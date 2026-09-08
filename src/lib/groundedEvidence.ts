export type EvidenceAnswer = {
  questionId: string;
  question: string;
  answer: string;
};

export type EvidenceTraceItem = {
  phrase: string;
  source: "original" | "fact" | "confirmed";
  sourceId?: string;
  whySupported: string;
};

export type GroundedCandidate = {
  suggestedStatement: string;
  whySupported: string;
  trace: EvidenceTraceItem[];
};

export type EvidenceProposalStatus = "GENERATED_PROPOSAL" | "USER_EDITED" | "APPROVED" | "DISCARDED";

export type EvidenceProposal = {
  id: string;
  createdAt: string;
  originalStatement: string;
  answers: EvidenceAnswer[];
  candidate: GroundedCandidate;
  editedStatement?: string;
  status: EvidenceProposalStatus;
};

const NO_FACT = /^(i\s*don'?t\s*know|not\s*applicable|n\/a|none|unknown|no information)$/i;
const METRIC = /(?:\$\s?\d[\d,.]*|\b\d[\d,.]*\s*(?:%|percent|x|times|people|person|engineers?|members?|users?|projects?|regions?|countries?))/gi;
const TOOL_NAMES = [
  "aws", "azure", "gcp", "google cloud", "kubernetes", "docker", "terraform", "python", "java",
  "javascript", "typescript", "react", "node.js", "salesforce", "siebel", "servicenow", "snowflake",
  "databricks", "kafka", "graphql", "openai", "claude", "gemini",
];
const LEADERSHIP = /\b(led|leads|leading|spearheaded|architected|owned|managed|directed|championed|headed)\b/i;
const SCOPE = /\b(global|globally|worldwide|international|cross[- ]regional|across\s+(?:the\s+)?world)\b/i;
const OUTCOME = /\b(reduced|increased|improved|decreased|saved|grew|boosted|cut|eliminated|accelerated|uptime|downtime|latency|revenue|cost|profit|performance|defect|adoption)\b/i;

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function words(value: string): string[] {
  return clean(value.toLowerCase()).match(/[a-z0-9][a-z0-9+.#'-]*/g) ?? [];
}

function sourceText(original: string, answers: EvidenceAnswer[], confirmed: string): string {
  return [original, confirmed, ...answers.map((a) => (NO_FACT.test(clean(a.answer)) ? "" : a.answer))].join(" ");
}

function hasSupportedNumber(candidate: string, source: string): boolean {
  const candidateMetrics = candidate.match(METRIC) ?? [];
  const sourceLower = source.toLowerCase();
  return candidateMetrics.every((metric) => sourceLower.includes(metric.toLowerCase()));
}

function hasUnsupportedTool(candidate: string, source: string): boolean {
  const lowerCandidate = candidate.toLowerCase();
  const lowerSource = source.toLowerCase();
  return TOOL_NAMES.some((tool) => lowerCandidate.includes(tool) && !lowerSource.includes(tool));
}

function hasUnsupportedLeadership(candidate: string, source: string): boolean {
  return LEADERSHIP.test(candidate) && !LEADERSHIP.test(source);
}

function hasUnsupportedScope(candidate: string, source: string): boolean {
  return SCOPE.test(candidate) && !SCOPE.test(source);
}

function hasUnsupportedOutcome(candidate: string, source: string): boolean {
  if (!OUTCOME.test(candidate)) return false;
  const candidateOutcomeTerms = candidate.toLowerCase().match(OUTCOME) ?? [];
  const sourceLower = source.toLowerCase();
  return candidateOutcomeTerms.some((term) => !sourceLower.includes(term));
}

export function validateGroundedCandidate(
  originalStatement: string,
  answers: EvidenceAnswer[],
  candidate: GroundedCandidate,
  confirmedEvidence = ""
): { ok: true } | { ok: false; reason: string } {
  const original = clean(originalStatement);
  const suggested = clean(candidate.suggestedStatement);
  if (!original || !suggested) return { ok: false, reason: "Original statement and candidate are required." };
  if (suggested.length > 800) return { ok: false, reason: "Candidate exceeds the safe length limit." };

  const source = sourceText(original, answers, confirmedEvidence);
  if (!hasSupportedNumber(suggested, source)) return { ok: false, reason: "Candidate introduced an unsupported metric or scope number." };
  if (hasUnsupportedTool(suggested, source)) return { ok: false, reason: "Candidate introduced an unsupported tool or platform." };
  if (hasUnsupportedLeadership(suggested, source)) return { ok: false, reason: "Candidate introduced unsupported leadership or ownership language." };
  if (hasUnsupportedScope(suggested, source)) return { ok: false, reason: "Candidate introduced unsupported geographic or global scope." };
  if (hasUnsupportedOutcome(suggested, source)) return { ok: false, reason: "Candidate introduced an unsupported business outcome." };

  if (!candidate.trace?.length) return { ok: false, reason: "Candidate has no factual trace." };
  for (const item of candidate.trace) {
    const phrase = clean(item.phrase);
    if (!phrase || !clean(item.whySupported) || !suggested.toLowerCase().includes(phrase.toLowerCase())) {
      return { ok: false, reason: "Candidate contains an untraceable factual phrase." };
    }
    const sourceForItem = item.source === "original"
      ? original
      : item.source === "confirmed"
        ? confirmedEvidence
        : answers.find((answer) => answer.questionId === item.sourceId)?.answer ?? source;
    const phraseWords = words(phrase).filter((word) => word.length > 3);
    const sourceWords = new Set(words(sourceForItem));
    const overlap = phraseWords.filter((word) => sourceWords.has(word)).length;
    if (phraseWords.length > 0 && overlap === 0) return { ok: false, reason: "Candidate trace does not map to supplied evidence." };
  }

  return { ok: true };
}

export function createEvidenceProposal(input: Omit<EvidenceProposal, "id" | "createdAt" | "status">): EvidenceProposal {
  return { ...input, id: `ev_${crypto.randomUUID()}`, createdAt: new Date().toISOString(), status: "GENERATED_PROPOSAL" };
}

export function transitionEvidenceProposal(proposal: EvidenceProposal, action: "edit" | "approve" | "discard", editedStatement?: string): EvidenceProposal {
  if (action === "edit") {
    const edited = clean(editedStatement ?? "");
    if (!edited) throw new Error("Edited statement is required.");
    return { ...proposal, editedStatement: edited, status: "USER_EDITED" };
  }
  if (action === "approve") {
    if (proposal.status !== "GENERATED_PROPOSAL" && proposal.status !== "USER_EDITED") throw new Error("Only an active proposal can be approved.");
    return { ...proposal, status: "APPROVED" };
  }
  if (proposal.status === "DISCARDED") throw new Error("Proposal is already discarded.");
  return { ...proposal, status: "DISCARDED" };
}
