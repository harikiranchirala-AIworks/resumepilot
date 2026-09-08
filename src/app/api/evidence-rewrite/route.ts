import { NextRequest, NextResponse } from "next/server";
import { validateGroundedCandidate, type EvidenceAnswer, type GroundedCandidate } from "@/lib/groundedEvidence";

export const runtime = "nodejs";

const MAX_STATEMENT = 800;
const MAX_ANSWER = 500;
const MAX_ANSWERS = 4;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 6;
const requests = new Map<string, number[]>();

function clientKey(request: NextRequest): string {
  return request.headers.get("x-workspace-id")?.slice(0, 120) || "local-beta";
}

function allowedRequest(key: string): boolean {
  const now = Date.now();
  const recent = (requests.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requests.set(key, recent);
    return false;
  }
  recent.push(now);
  requests.set(key, recent);
  return true;
}

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["suggestedStatement", "whySupported", "trace"],
  properties: {
    suggestedStatement: { type: "string", maxLength: MAX_STATEMENT },
    whySupported: { type: "string", maxLength: 500 },
    trace: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["phrase", "source", "whySupported"],
        properties: {
          phrase: { type: "string", maxLength: 160 },
          source: { type: "string", enum: ["original", "fact", "confirmed"] },
          sourceId: { type: "string", maxLength: 80 },
          whySupported: { type: "string", maxLength: 240 },
        },
      },
    },
  },
} as const;

function buildPrompt(statement: string, answers: EvidenceAnswer[], confirmedEvidence: string): string {
  return [
    "Original résumé statement:", statement,
    "User facts:", JSON.stringify(answers),
    "Explicitly confirmed résumé evidence:", confirmedEvidence || "None",
    "Return one concise candidate statement and a phrase-level factual trace. Use only the supplied material.",
  ].join("\n\n");
}

function extractResponseText(payload: { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }): string {
  if (payload.output_text) return payload.output_text;
  const text = payload.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("").trim();
  if (!text) throw new Error("Provider returned no candidate.");
  return text;
}

export async function POST(request: NextRequest) {
  const started = Date.now();
  const key = clientKey(request);
  if (!allowedRequest(key)) return NextResponse.json({ error: "Evidence rewrite limit reached. Try again later." }, { status: 429 });

  try {
    const body = await request.json() as { statement?: string; answers?: EvidenceAnswer[]; confirmedEvidence?: string };
    const statement = body.statement?.trim() ?? "";
    const answers = Array.isArray(body.answers) ? body.answers.slice(0, MAX_ANSWERS) : [];
    const confirmedEvidence = body.confirmedEvidence?.trim() ?? "";
    if (!statement || statement.length > MAX_STATEMENT) return NextResponse.json({ error: "A résumé statement up to 800 characters is required." }, { status: 400 });
    if (answers.some((answer) => !answer.questionId || !answer.question || typeof answer.answer !== "string" || answer.answer.length > MAX_ANSWER)) {
      return NextResponse.json({ error: "Each factual answer must be present and up to 500 characters." }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Evidence rewrite provider is not configured." }, { status: 503 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    let providerResponse: Response;
    try {
      providerResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
          store: false,
          max_output_tokens: 400,
          input: [
            { role: "system", content: [{ type: "input_text", text: "You are a grounded résumé editor. Never invent facts. Do not add metrics, tools, employers, dates, team size, geography, leadership, seniority, or outcomes. If evidence is insufficient, preserve cautious language. Return only the requested JSON." }] },
            { role: "user", content: [{ type: "input_text", text: buildPrompt(statement, answers, confirmedEvidence) }] },
          ],
          text: { format: { type: "json_schema", name: "grounded_resume_candidate", strict: true, schema } },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!providerResponse.ok) return NextResponse.json({ error: "Evidence rewrite provider unavailable." }, { status: 502 });
    const payload = await providerResponse.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const candidate = JSON.parse(extractResponseText(payload)) as GroundedCandidate;
    const validation = validateGroundedCandidate(statement, answers, candidate, confirmedEvidence);
    if (!validation.ok) return NextResponse.json({ error: "Candidate could not be safely grounded in the supplied facts." }, { status: 422 });

    return NextResponse.json({ candidate, telemetry: { route: "/api/evidence-rewrite", status: 200, durationMs: Date.now() - started, model: process.env.OPENAI_MODEL || "gpt-5.6-luna" } });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json({ error: isTimeout ? "Evidence rewrite timed out. Your entered facts were not changed." : "Candidate could not be safely grounded in the supplied facts." }, { status: isTimeout ? 504 : 422 });
  }
}
