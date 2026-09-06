import type {
  AIProvider,
  BulletRewriteOption,
  CoPilotRequest,
  CoPilotResponse,
  CoPilotSuggestion,
  CoverLetterResult,
  DiffItem,
  GenerateResult,
  InterviewPrepResult,
  MatchAnalysis,
  ProfileInputMode,
  ResumeTemplateId,
  ATSAnalysis,
} from "./types";
import {
  buildCoverLetterLatex,
  buildFallbackLatex,
  buildLatexDocument,
  extractLatexBody,
} from "./latex";
import { analyzeATSHeuristic, analyzeMatchHeuristic, extractKeywords } from "./ats";
import { callGeminiApi, hasGemini } from "./providers/gemini";
import { callOpenAIApi, hasOpenAI } from "./providers/openai";
import { callAnthropicApi, hasAnthropic } from "./providers/anthropic";
import { generateWithCursorSdk, hasCursorSdk } from "./cursor-agent";
import {
  buildBulletRewritePrompt,
  buildCoPilotPrompt,
  buildCoverLetterPrompt,
  buildInterviewPrepPrompt,
  buildTailorPrompt,
} from "./prompts";

const SYSTEM_PROMPT = `You are a premier executive resume writer, hiring manager, and ATS optimization specialist.
Rules:
- Never fabricate degrees, employers, or skills the candidate does not have.
- Reframe and prioritize authentic experience to match the JD requirements and keywords.
- Use strong action verbs and quantified metrics where supported.
- Use ATS-friendly structure: Summary, Skills, Experience, Education.
- Output valid JSON only without markdown formatting.`;

export function getAvailableProviders(): { id: AIProvider; name: string; available: boolean }[] {
  return [
    { id: "auto", name: "Auto-Detect Best Available", available: true },
    { id: "gemini", name: "Google Gemini (gemini-2.5-flash)", available: hasGemini() },
    { id: "openai", name: "OpenAI (gpt-4o-mini)", available: hasOpenAI() },
    { id: "anthropic", name: "Anthropic Claude (claude-3-5-sonnet)", available: hasAnthropic() },
    { id: "cursor", name: "Cursor SDK Agent", available: hasCursorSdk() },
  ];
}

interface RawTailorResponse {
  latexBody: string;
  summary: string;
  tailoredHighlights: string[];
  diffItems?: DiffItem[];
  match?: MatchAnalysis;
  ats?: ATSAnalysis;
}

async function callProviderJson<T>(
  prompt: string,
  preferredProvider: AIProvider = "auto",
  systemPrompt = SYSTEM_PROMPT
): Promise<{ data: T; providerName: string }> {
  // 1. Explicit provider requested
  if (preferredProvider === "gemini" && hasGemini()) {
    const data = await callGeminiApi<T>(prompt, systemPrompt);
    return { data, providerName: "Google Gemini" };
  }
  if (preferredProvider === "openai" && hasOpenAI()) {
    const data = await callOpenAIApi<T>(prompt, systemPrompt);
    return { data, providerName: "OpenAI" };
  }
  if (preferredProvider === "anthropic" && hasAnthropic()) {
    const data = await callAnthropicApi<T>(prompt, systemPrompt);
    return { data, providerName: "Anthropic Claude" };
  }

  // 2. Auto-priority: Gemini -> OpenAI -> Anthropic
  if (hasGemini()) {
    try {
      const data = await callGeminiApi<T>(prompt, systemPrompt);
      return { data, providerName: "Google Gemini" };
    } catch (e) {
      console.warn("Gemini call failed, falling back to next provider:", e);
    }
  }

  if (hasOpenAI()) {
    try {
      const data = await callOpenAIApi<T>(prompt, systemPrompt);
      return { data, providerName: "OpenAI" };
    } catch (e) {
      console.warn("OpenAI call failed, falling back to next provider:", e);
    }
  }

  if (hasAnthropic()) {
    try {
      const data = await callAnthropicApi<T>(prompt, systemPrompt);
      return { data, providerName: "Anthropic Claude" };
    } catch (e) {
      console.warn("Anthropic call failed:", e);
    }
  }

  throw new Error("No configured AI provider succeeded");
}

export async function generateTailoredResume(
  profileText: string,
  jobDescription: string,
  profileMode: ProfileInputMode,
  preferredProvider: AIProvider = "auto",
  templateId: ResumeTemplateId = "tech-standard"
): Promise<GenerateResult> {
  // Try Cursor SDK first if explicitly requested
  if (preferredProvider === "cursor" && hasCursorSdk()) {
    try {
      return await generateWithCursorSdk(profileText, jobDescription, profileMode, templateId);
    } catch (err) {
      console.error("Cursor SDK failed:", err);
    }
  }

  // Call standard LLM providers
  try {
    const prompt = buildTailorPrompt(profileText, jobDescription, profileMode);
    const { data: parsed, providerName } = await callProviderJson<RawTailorResponse>(
      prompt,
      preferredProvider
    );

    const cleanBody = extractLatexBody(parsed.latexBody);
    const latex = buildLatexDocument(cleanBody, templateId);
    const match = parsed.match ?? analyzeMatchHeuristic(profileText, jobDescription);
    const ats = parsed.ats ?? analyzeATSHeuristic(latex, profileText, jobDescription);

    return {
      resume: {
        latex,
        latexBody: cleanBody,
        summary: parsed.summary,
        tailoredHighlights: parsed.tailoredHighlights ?? [],
        diffItems: parsed.diffItems ?? [],
      },
      match,
      ats,
      providerUsed: providerName,
      templateUsed: templateId,
    };
  } catch (error) {
    console.warn("AI generation failed, attempting Cursor SDK or heuristic fallback:", error);
  }

  // Fallback to Cursor SDK if available
  if (hasCursorSdk()) {
    try {
      return await generateWithCursorSdk(profileText, jobDescription, profileMode, templateId);
    } catch (err) {
      console.error("Cursor SDK fallback failed:", err);
    }
  }

  // Final fallback: heuristic template engine
  return fallbackResult(
    profileText,
    jobDescription,
    templateId,
    "Generated with offline heuristic template. Configure GEMINI_API_KEY or OPENAI_API_KEY in .env.local for full AI tailoring."
  );
}

export async function generateCoverLetter(
  profileText: string,
  jobDescription: string,
  preferredProvider: AIProvider = "auto"
): Promise<CoverLetterResult> {
  const prompt = buildCoverLetterPrompt(profileText, jobDescription);

  try {
    const { data } = await callProviderJson<{
      roleTitle: string;
      companyName: string;
      text: string;
      keyHooks: string[];
    }>(prompt, preferredProvider);

    const latex = buildCoverLetterLatex(
      data.text,
      "Candidate",
      data.roleTitle,
      data.companyName
    );

    return {
      latex,
      text: data.text,
      roleTitle: data.roleTitle,
      companyName: data.companyName,
      keyHooks: data.keyHooks ?? [],
    };
  } catch (error) {
    console.warn("AI Cover Letter generation failed, using heuristic fallback:", error);
    return fallbackCoverLetter(profileText, jobDescription);
  }
}

export async function generateInterviewPrep(
  profileText: string,
  jobDescription: string,
  preferredProvider: AIProvider = "auto"
): Promise<InterviewPrepResult> {
  const prompt = buildInterviewPrepPrompt(profileText, jobDescription);

  try {
    const { data } = await callProviderJson<InterviewPrepResult>(prompt, preferredProvider);
    return data;
  } catch (error) {
    console.warn("AI Interview prep generation failed, using heuristic fallback:", error);
    return fallbackInterviewPrep(profileText, jobDescription);
  }
}

export async function rewriteBulletPoint(
  originalBullet: string,
  jdContext: string,
  preferredProvider: AIProvider = "auto"
): Promise<BulletRewriteOption[]> {
  const prompt = buildBulletRewritePrompt(originalBullet, jdContext);

  try {
    const { data } = await callProviderJson<{ options: BulletRewriteOption[] }>(
      prompt,
      preferredProvider
    );
    return data.options;
  } catch {
    return [
      {
        style: "xyz-impact",
        text: `Accomplished key deliverables by executing ${originalBullet.slice(0, 60)}, resulting in measurable business impact.`,
        rationale: "Quantified impact framework.",
      },
      {
        style: "action-focused",
        text: `Spearheaded ${originalBullet.slice(0, 70)}, driving cross-functional success.`,
        rationale: "Leadership and ownership focus.",
      },
      {
        style: "concise",
        text: originalBullet.trim(),
        rationale: "Direct streamlined statement.",
      },
    ];
  }
}

export async function executeCoPilotAction(
  request: CoPilotRequest
): Promise<CoPilotResponse> {
  const prompt = buildCoPilotPrompt(request);

  try {
    const { data, providerName } = await callProviderJson<{ suggestions: CoPilotSuggestion[] }>(
      prompt,
      request.preferredProvider
    );

    if (data.suggestions && data.suggestions.length > 0) {
      return {
        action: request.action,
        originalText: request.selectedText,
        suggestions: data.suggestions,
        providerUsed: providerName,
      };
    }
  } catch (err) {
    console.warn("AI CoPilot call failed, using heuristic fallback:", err);
  }

  // Heuristic fallbacks
  const clean = request.selectedText.trim();
  const kw = request.targetKeyword || "Target Architecture";

  let fallbackSuggestions: CoPilotSuggestion[] = [];

  switch (request.action) {
    case "quantify":
      fallbackSuggestions = [
        {
          text: `Optimized performance by 38% while executing ${clean.slice(0, 70)}, saving 15+ engineering hours weekly.`,
          rationale: "Adds measurable time and efficiency outcomes using Google's XYZ formula.",
          metricsEstimated: "+38% efficiency",
        },
        {
          text: `Scaled throughput by 3.5x across production systems by implementing ${clean.slice(0, 60)}.`,
          rationale: "Highlights scalability and high-load impact.",
          metricsEstimated: "3.5x throughput",
        },
        {
          text: `Reduced release defect rates from 14% to 1.8% by standardizing ${clean.slice(0, 65)}.`,
          rationale: "Demonstrates reliability and quality assurance metrics.",
          metricsEstimated: "-85% defects",
        },
      ];
      break;

    case "inject_keyword":
      fallbackSuggestions = [
        {
          text: `Architected and deployed solutions leveraging ${kw}, accelerating delivery by 30% across key workflows.`,
          rationale: `Seamlessly weaves in ${kw} with architectural leadership context.`,
        },
        {
          text: `Spearheaded cross-functional integration of ${kw}, resolving legacy bottlenecks and boosting system uptime.`,
          rationale: `Emphasizes proactive adoption and modernization with ${kw}.`,
        },
        {
          text: `Standardized ${kw} best practices, reducing team onboarding cycle times by 40%.`,
          rationale: `Positions ${kw} in governance and team velocity impact.`,
        },
      ];
      break;

    case "shorten":
      fallbackSuggestions = [
        {
          text: clean.split(/\s+/).slice(0, Math.max(8, Math.round(clean.split(/\s+/).length * 0.7))).join(" ") + ".",
          rationale: "Trimmed filler phrasing for strict single-page resume layout.",
        },
        {
          text: `Led ${clean.slice(0, 60).replace(/^(responsible for|worked on|helped with)\s+/i, "")}.`,
          rationale: "Replaces passive verbs with direct action verbs.",
        },
      ];
      break;

    case "elevate_tone":
    default:
      fallbackSuggestions = [
        {
          text: `Spearheaded strategic delivery of ${clean.slice(0, 70)}, driving alignment across engineering and executive leadership.`,
          rationale: "Elevates cross-functional governance and high-level ownership.",
        },
        {
          text: `Championed technical architecture for ${clean.slice(0, 65)}, establishing scalable foundations for high-growth initiatives.`,
          rationale: "Frames contribution as scalable foundation engineering.",
        },
      ];
      break;
  }

  return {
    action: request.action,
    originalText: request.selectedText,
    suggestions: fallbackSuggestions,
    providerUsed: "Offline Heuristic Co-Pilot",
  };
}

function fallbackResult(
  profileText: string,
  jobDescription: string,
  templateId: ResumeTemplateId,
  summary: string
): GenerateResult {
  const latex = buildFallbackLatex(profileText, jobDescription, templateId);
  const match = analyzeMatchHeuristic(profileText, jobDescription);
  const ats = analyzeATSHeuristic(latex, profileText, jobDescription);
  const keywords = extractKeywords(jobDescription);

  const diffItems: DiffItem[] = [
    {
      originalBullet: "Experience background from profile",
      tailoredBullet: `Spearheaded initiatives aligned with ${keywords.slice(0, 2).join(" & ")}, driving operational excellence.`,
      changeType: "keyword-injected",
      explanation: "Incorporated high-frequency JD keywords directly into experience bullets.",
    },
    {
      originalBullet: "Core accomplishments",
      tailoredBullet: "Delivered scalable solutions reducing project cycle time by 35%.",
      changeType: "quantified",
      explanation: "Added measurable performance metrics to meet ATS standards.",
    },
  ];

  return {
    resume: {
      latex,
      latexBody: extractLatexBody(latex),
      summary,
      tailoredHighlights: match.matchedKeywords.slice(0, 5),
      diffItems,
    },
    match,
    ats,
    providerUsed: "Offline Heuristic Engine",
    templateUsed: templateId,
  };
}

function fallbackCoverLetter(
  profileText: string,
  jobDescription: string
): CoverLetterResult {
  const jdKeywords = extractKeywords(jobDescription);
  const text = `Dear Hiring Team,\n\nI am writing to express my strong enthusiasm for this role. With extensive background across ${jdKeywords.slice(0, 3).join(", ")}, I have consistently delivered high-impact results, optimized complex workflows, and empowered cross-functional teams.\n\nIn my previous roles, I have spearheaded strategic projects that significantly improved performance and operational efficiency. I am particularly excited about this opportunity and would welcome the chance to discuss how my skill set aligns with your organizational goals.\n\nThank you for your time and consideration.\n\nSincerely,\nCandidate`;

  const latex = buildCoverLetterLatex(text, "Candidate", "Target Role", "Hiring Team");
  return {
    latex,
    text,
    roleTitle: "Target Role",
    companyName: "Hiring Team",
    keyHooks: jdKeywords.slice(0, 3),
  };
}

function fallbackInterviewPrep(
  profileText: string,
  jobDescription: string
): InterviewPrepResult {
  const keywords = extractKeywords(jobDescription);
  return {
    roleTitle: "Target Role",
    matchOverview: `Key focus areas identified from JD: ${keywords.slice(0, 6).join(", ")}. Be prepared to discuss technical execution and cross-functional leadership.`,
    questions: [
      {
        question: `How have you applied ${keywords[0] ?? "your core skills"} in your past projects to solve complex problems?`,
        category: "technical",
        intent: "Assessing core technical depth and problem-solving methodology.",
        suggestedStarResponse: {
          situation: "Faced a critical system or process constraint in a previous project.",
          task: `Needed to implement a robust solution leveraging ${keywords[0] ?? "best practices"}.`,
          action: "Architected a streamlined approach and coordinated testing and rollout.",
          result: "Achieved measurable efficiency gains and zero downtime.",
        },
        tip: "Reference specific architectural decisions and metrics.",
      },
      {
        question: "Describe a challenging situation where you had to align conflicting stakeholder priorities.",
        category: "behavioral",
        intent: "Evaluating communication and stakeholder management under pressure.",
        suggestedStarResponse: {
          situation: "Multiple team leads had competing priorities for project milestones.",
          task: "Establish consensus and keep the delivery schedule on track.",
          action: "Facilitated alignment workshops and established clear success metrics.",
          result: "Delivered 100% on schedule with full stakeholder buy-in.",
        },
        tip: "Focus on active listening and empathy.",
      },
      {
        question: `What experience do you have with ${keywords[1] ?? "modern automation"} and scaling workflows?`,
        category: "gap",
        intent: "Evaluating adaptability to JD requirements.",
        suggestedStarResponse: {
          situation: "Existing workflows required manual intervention.",
          task: "Automate repetitive tasks to reduce error rates.",
          action: "Implemented automated testing and deployment pipelines.",
          result: "Reduced manual effort by 40%.",
        },
        tip: "Highlight transferable foundation even if specific tool was different.",
      },
    ],
    keyTalkingPoints: [
      `Demonstrated track record with ${keywords.slice(0, 3).join(", ")}`,
      "Commitment to high code/deliverable quality and continuous optimization",
      "Strong cross-functional communication and proactive leadership",
    ],
  };
}

