import test from "node:test";
import assert from "node:assert/strict";
import {
  createEvidenceProposal,
  transitionEvidenceProposal,
  validateGroundedCandidate,
  type EvidenceAnswer,
  type GroundedCandidate,
} from "../src/lib/groundedEvidence";

const original = "Coordinated the CRM migration and documented the delivery approach.";
const answers: EvidenceAnswer[] = [
  { questionId: "result", question: "What changed?", answer: "The migration plan was easier for the delivery team to follow." },
  { questionId: "observed", question: "What result?", answer: "Stakeholders had a clearer view of the delivery approach." },
  { questionId: "scale", question: "What scale?", answer: "Not applicable" },
  { questionId: "affected", question: "Who?", answer: "The delivery team and stakeholders." },
];

function candidate(text: string): GroundedCandidate {
  return {
    suggestedStatement: text,
    whySupported: "The wording stays within the supplied statement and facts.",
    trace: [{ phrase: "CRM migration", source: "original", whySupported: "Present in the original statement." }],
  };
}

test("accepts a supported rewrite with trace", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Coordinated the CRM migration and documented a clearer delivery approach."));
  assert.deepEqual(result, { ok: true });
});

test("rejects an invented percentage", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Coordinated the CRM migration and improved delivery clarity by 40%."));
  assert.equal(result.ok, false);
});

test("rejects an invented technology", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Coordinated the CRM migration using AWS and documented the delivery approach."));
  assert.equal(result.ok, false);
});

test("rejects invented leadership or ownership", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Led and owned the CRM migration delivery approach."));
  assert.equal(result.ok, false);
});

test("rejects invented team size and global scope", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Coordinated a 20-person global CRM migration team."));
  assert.equal(result.ok, false);
});

test("rejects an invented business outcome", () => {
  const result = validateGroundedCandidate(original, answers, candidate("Coordinated the CRM migration and reduced downtime."));
  assert.equal(result.ok, false);
});

test("enforces proposal lifecycle without mutating the original", () => {
  const proposal = createEvidenceProposal({ originalStatement: original, answers, candidate: candidate("Coordinated the CRM migration and documented a clearer delivery approach.") });
  const edited = transitionEvidenceProposal(proposal, "edit", "Coordinated the CRM migration and documented a clearer delivery approach for stakeholders.");
  const approved = transitionEvidenceProposal(edited, "approve");
  assert.equal(proposal.status, "GENERATED_PROPOSAL");
  assert.equal(approved.status, "APPROVED");
  assert.equal(approved.originalStatement, original);
  assert.throws(() => transitionEvidenceProposal(approved, "edit", ""));
});
