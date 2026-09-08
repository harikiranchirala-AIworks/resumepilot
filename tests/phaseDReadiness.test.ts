import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST as evidenceRewrite } from "../src/app/api/evidence-rewrite/route";
import { GET as resumesGet, POST as resumesPost } from "../src/app/api/resumes/route";
import { DELETE as resumeDelete } from "../src/app/api/resumes/[id]/route";

const originalStatement = "Coordinated the CRM migration and documented the delivery approach.";
const answers = [
  { questionId: "result", question: "What changed?", answer: "The delivery team had a clearer approach." },
];

function request(body: unknown, workspaceId = `phase-d-${crypto.randomUUID()}`): NextRequest {
  return new NextRequest("http://localhost/api/evidence-rewrite", {
    method: "POST",
    headers: { "content-type": "application/json", "x-workspace-id": workspaceId },
    body: JSON.stringify(body),
  });
}

function providerPayload(text: string) {
  return {
    output_text: JSON.stringify({
      suggestedStatement: text,
      whySupported: "The wording is supported by the original statement and supplied fact.",
      trace: [
        { phrase: "CRM migration", source: "original", whySupported: "Present in the original statement." },
      ],
    }),
  };
}

test.beforeEach(() => {
  process.env.OPENAI_API_KEY = "phase-d-test-key";
  process.env.OPENAI_MODEL = "phase-d-test-model";
});

test("sends only the selected statement and supplied facts to the provider", async () => {
  let captured: { body: string; headers: Headers } | undefined;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_input, init) => {
    captured = { body: String(init?.body), headers: new Headers(init?.headers) };
    return new Response(JSON.stringify(providerPayload("Coordinated the CRM migration and documented a clearer delivery approach.")), { status: 200 });
  };

  try {
    const response = await evidenceRewrite(request({
      statement: originalStatement,
      answers,
      confirmedEvidence: "The delivery team had a clearer approach.",
      resumeText: "PRIVATE FULL RESUME MUST NOT BE SENT",
      jobDescription: "PRIVATE JOB DESCRIPTION MUST NOT BE SENT",
    }));
    assert.equal(response.status, 200);
    assert.ok(captured);
    const body = JSON.parse(captured.body);
    const serialized = JSON.stringify(body);
    assert.match(serialized, /CRM migration/);
    assert.match(serialized, /clearer approach/);
    assert.doesNotMatch(serialized, /PRIVATE FULL RESUME/);
    assert.doesNotMatch(serialized, /PRIVATE JOB DESCRIPTION/);
    assert.equal(captured.headers.get("authorization"), "Bearer phase-d-test-key");

    const responseBody = await response.json();
    assert.deepEqual(responseBody.telemetry, {
      route: "/api/evidence-rewrite",
      status: 200,
      durationMs: responseBody.telemetry.durationMs,
      model: "phase-d-test-model",
    });
    assert.equal(Object.prototype.hasOwnProperty.call(responseBody.telemetry, "statement"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(responseBody.telemetry, "answers"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(responseBody.telemetry, "apiKey"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fails closed for a malformed provider response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ output_text: "not-json" }), { status: 200 });
  try {
    const response = await evidenceRewrite(request({ statement: originalStatement, answers }));
    assert.equal(response.status, 422);
    assert.deepEqual(await response.json(), { error: "Candidate could not be safely grounded in the supplied facts." });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("returns a bounded failure when the provider is unavailable", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("provider unavailable", { status: 503 });
  try {
    const response = await evidenceRewrite(request({ statement: originalStatement, answers }));
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: "Evidence rewrite provider unavailable." });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("returns a bounded timeout failure and does not echo supplied facts", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    throw error;
  };
  try {
    const secretFact = "PRIVATE FACT THAT MUST NOT APPEAR IN ERRORS";
    const response = await evidenceRewrite(request({ statement: originalStatement, answers: [{ ...answers[0], answer: secretFact }] }));
    assert.equal(response.status, 504);
    const body = await response.json();
    assert.deepEqual(body, { error: "Evidence rewrite timed out. Your entered facts were not changed." });
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE FACT/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fails closed when provider configuration is missing", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await evidenceRewrite(request({ statement: originalStatement, answers }));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "Evidence rewrite provider is not configured." });
  } finally {
    process.env.OPENAI_API_KEY = previous;
  }
});

test("enforces bounded requests per workspace without disclosing content", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(providerPayload("Coordinated the CRM migration and documented a clearer delivery approach.")), { status: 200 });
  const workspaceId = `rate-limit-${crypto.randomUUID()}`;
  try {
    const statuses: number[] = [];
    for (let index = 0; index < 7; index += 1) {
      const response = await evidenceRewrite(request({ statement: originalStatement, answers }, workspaceId));
      statuses.push(response.status);
      if (response.status === 429) {
        assert.deepEqual(await response.json(), { error: "Evidence rewrite limit reached. Try again later." });
      }
    }
    assert.deepEqual(statuses, [200, 200, 200, 200, 200, 200, 429]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("keeps resume persistence browser-local by rejecting server persistence routes", async () => {
  assert.equal((await resumesGet()).status, 410);
  assert.equal((await resumesPost()).status, 410);
  assert.equal((await resumeDelete()).status, 410);
});
