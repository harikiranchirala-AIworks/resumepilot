import { Agent, CursorAgentError } from "@cursor/sdk";
import path from "path";
import type {
  ATSAnalysis,
  DiffItem,
  GenerateResult,
  MatchAnalysis,
  ProfileInputMode,
  ResumeTemplateId,
} from "./types";
import { buildLatexDocument, extractLatexBody } from "./latex";
import { analyzeATSHeuristic, analyzeMatchHeuristic } from "./ats";
import { buildTailorPrompt } from "./prompts";
import { parseAgentJson } from "./parse-agent-json";

interface TailorAgentResponse {
  latexBody: string;
  summary: string;
  tailoredHighlights: string[];
  diffItems?: DiffItem[];
  match: MatchAnalysis;
  ats: ATSAnalysis;
}

function getApiKey(): string | null {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key || key.startsWith("cursor_your")) return null;
  return key;
}

export function hasCursorSdk(): boolean {
  return getApiKey() !== null;
}

export async function generateWithCursorSdk(
  profileText: string,
  jobDescription: string,
  profileMode: ProfileInputMode,
  templateId: ResumeTemplateId = "tech-standard"
): Promise<GenerateResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new CursorAgentError("CURSOR_API_KEY is not set", { isRetryable: false });
  }

  const prompt = buildTailorPrompt(profileText, jobDescription, profileMode);
  const cwd = path.resolve(process.cwd());

  let result;
  try {
    result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: process.env.CURSOR_MODEL ?? "composer-2.5" },
      local: {
        cwd,
        settingSources: [],
      },
    });
  } catch (err) {
    if (err instanceof CursorAgentError) throw err;
    throw err;
  }

  if (result.status === "error") {
    throw new Error(`Cursor agent run failed (run id: ${result.id})`);
  }
  if (result.status === "cancelled") {
    throw new Error(`Cursor agent run cancelled (run id: ${result.id})`);
  }
  if (!result.result?.trim()) {
    throw new Error("Cursor agent returned an empty response");
  }

  const parsed = parseAgentJson<TailorAgentResponse>(result.result);
  const cleanBody = extractLatexBody(parsed.latexBody);
  const latex = buildLatexDocument(cleanBody, templateId);

  return {
    resume: {
      latex,
      latexBody: cleanBody,
      summary: parsed.summary,
      tailoredHighlights: parsed.tailoredHighlights ?? [],
      diffItems: parsed.diffItems ?? [],
    },
    match: parsed.match ?? analyzeMatchHeuristic(profileText, jobDescription),
    ats: parsed.ats ?? analyzeATSHeuristic(latex, profileText, jobDescription),
    providerUsed: "Cursor Agent",
    templateUsed: templateId,
  };
}

