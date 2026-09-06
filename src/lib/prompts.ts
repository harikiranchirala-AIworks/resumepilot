import type { CoPilotRequest, ProfileInputMode } from "./types";

export const TAILOR_JSON_SCHEMA = `{
  "latexBody": "LaTeX body only (sections, headings, itemize blocks - no \\\\documentclass or \\\\begin{document}). Escape LaTeX special chars like %, &, $, _, #.",
  "summary": "2-3 sentence executive tailoring summary",
  "tailoredHighlights": ["Specific tailored highlight 1", "Specific tailored highlight 2", "Specific tailored highlight 3"],
  "diffItems": [
    {
      "originalBullet": "Original line or concept from candidate background",
      "tailoredBullet": "Tailored, quantified bullet point produced in resume",
      "changeType": "quantified | keyword-injected | enhanced | added",
      "explanation": "Why this change was made to match the JD"
    }
  ],
  "match": {
    "overallScore": 85,
    "keywordMatch": 80,
    "skillsMatch": 90,
    "experienceMatch": 85,
    "matchedKeywords": ["TypeScript", "Next.js", "System Design"],
    "missingKeywords": ["Kubernetes", "GraphQL"],
    "recommendations": ["Highlight cloud architecture experience", "Add metrics to team leadership accomplishments"]
  },
  "ats": {
    "score": 92,
    "issues": ["Minor: Ensure all acronyms are spelled out once"],
    "strengths": ["Clean single-column structure", "High action-verb frequency", "Strong quantifiable metrics"],
    "formattingTips": ["Use standard date formatting", "Keep bullets under 2 lines"]
  }
}`;

export function buildTailorPrompt(
  profileText: string,
  jobDescription: string,
  profileMode: ProfileInputMode
): string {
  const profileLabel =
    profileMode === "library"
      ? "Candidate resume (selected from saved library)"
      : "Candidate resume";

  return `You are a premier executive resume writer and ATS optimization specialist.
Your goal is to tailor the candidate's resume to the target Job Description with precision, authentic framing, and maximum ATS compatibility.

${profileLabel}:
---
${profileText}
---

Job Description:
---
${jobDescription}
---

INSTRUCTIONS:
1. Produce a clean, ATS-compliant LaTeX resume body (no documentclass or preamble, ONLY the inner sections: Summary, Skills, Experience, Education, Projects/Certifications if applicable).
2. Escape all LaTeX special characters (% -> \\%, & -> \\&, $ -> \\$, _ -> \\_, # -> \\#).
3. Reframe and prioritize the candidate's genuine experience to directly address the JD's requirements and keywords.
4. Never invent degrees, employers, or skills the candidate clearly does not possess.
5. Provide 3-5 diff comparison items explaining how key bullet points were transformed.
6. Provide accurate match and ATS scores (0-100) and actionable recommendations.

Reply with ONLY valid JSON strictly adhering to this schema (no markdown fences, no explanatory commentary):
${TAILOR_JSON_SCHEMA}`;
}

export function buildCoverLetterPrompt(
  profileText: string,
  jobDescription: string
): string {
  return `You are an executive career coach and cover letter specialist.
Given the candidate's profile and the target job description, draft a persuasive, highly tailored 1-page cover letter.

Candidate Profile:
---
${profileText}
---

Target Job Description:
---
${jobDescription}
---

INSTRUCTIONS:
- Extract the role title and hiring company/organization name (or 'Hiring Team' if not named).
- Opening: Hook the reader with enthusiasm and 1-2 prominent value propositions aligned with the role.
- Body (2 paragraphs): Highlight 2-3 specific achievements from the profile that prove candidate will solve the employer's core challenges.
- Closing: Confident call to action requesting an interview.
- Tone: Professional, authoritative, articulate, and authentic.

Reply with ONLY valid JSON with this shape (no markdown, no extra text):
{
  "roleTitle": "Software Engineer",
  "companyName": "Acme Corp",
  "text": "Dear Hiring Team,\\n\\nI am writing to express my enthusiastic interest...\\n\\nSincerely,\\n[Candidate Name]",
  "keyHooks": ["Scaled distributed systems by 40%", "Led 8-person engineering team"]
}`;
}

export function buildInterviewPrepPrompt(
  profileText: string,
  jobDescription: string
): string {
  return `You are an interview preparation director.
Analyze the candidate's profile against the target job description to create a high-impact interview preparation kit.

Candidate Profile:
---
${profileText}
---

Job Description:
---
${jobDescription}
---

INSTRUCTIONS:
- Identify key competencies, potential experience gaps, and critical technical/leadership areas.
- Generate 5-6 target interview questions across categories: 'behavioral', 'technical', 'gap', and 'situational'.
- For each question, explain the interviewer's intent and provide a structured STAR response outline (Situation, Task, Action, Result) based on the candidate's background.
- Provide 3-4 overall winning talking points.

Reply with ONLY valid JSON with this shape (no markdown, no extra text):
{
  "roleTitle": "Target Role",
  "matchOverview": "Summary of strengths and strategic talking points...",
  "questions": [
    {
      "question": "Can you describe a time when you...",
      "category": "behavioral",
      "intent": "Assessing conflict resolution and stakeholder management",
      "suggestedStarResponse": {
        "situation": "Context from candidate background...",
        "task": "The objective or challenge faced...",
        "action": "Specific steps taken...",
        "result": "Measurable business or technical outcome..."
      },
      "tip": "Emphasize collaboration and quantitative results"
    }
  ],
  "keyTalkingPoints": ["Key talking point 1", "Key talking point 2", "Key talking point 3"]
}`;
}

export function buildBulletRewritePrompt(
  originalBullet: string,
  jdContext: string
): string {
  return `You are a resume bullet point optimizer.
Given this original resume bullet point and the target job description context, rewrite it in 3 distinct ATS-optimized styles:
1. 'xyz-impact' (Google formula: Accomplished [X] as measured by [Y], by doing [Z])
2. 'action-focused' (Led with strong action verbs and leadership verbs)
3. 'concise' (Punchy, direct, high-density 1-liner)

Original Bullet:
"${originalBullet}"

Job Description Context:
"${jdContext.slice(0, 1000)}"

Reply with ONLY valid JSON:
{
  "options": [
    {
      "style": "xyz-impact",
      "text": "Accelerated deployment velocity by 45% (Y) by architecting an automated CI/CD pipeline (Z), enabling daily production releases (X).",
      "rationale": "Applies Google's XYZ formula with quantifiable metrics."
    },
    {
      "style": "action-focused",
      "text": "Spearheaded end-to-end automation of delivery pipelines, eliminating deployment bottlenecks across 4 cross-functional squads.",
      "rationale": "Emphasizes leadership and proactive problem-solving."
    },
    {
      "style": "concise",
      "text": "Automated enterprise CI/CD pipelines, increasing release frequency by 45%.",
      "rationale": "High impact, compact single line."
    }
  ]
}`;
}

export function buildCoPilotPrompt(request: CoPilotRequest): string {
  let actionInstruction = "";

  switch (request.action) {
    case "quantify":
      actionInstruction = `Convert the selected text into Google's XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
Provide 3 variations with plausible, high-impact numerical metrics, latency reductions, or business outcomes.`;
      break;

    case "inject_keyword":
      actionInstruction = `Rewrite the selected text to seamlessly and authentically integrate the target keyword: "${request.targetKeyword || "High-Priority Skill"}".
Ensure the keyword feels natural, demonstrated through real execution rather than superficial mention.`;
      break;

    case "shorten":
      actionInstruction = `Condense the selected text by 20-35% to optimize for strict single-page resume layout.
Cut filler words, preserve strong active verbs, and keep the most impactful metric or achievement.`;
      break;

    case "elevate_tone":
      actionInstruction = `Elevate the tone of the selected text to reflect senior/staff-level ownership, system-level impact, and strategic engineering governance.`;
      break;
  }

  return `You are an expert AI Resume Co-Pilot.
Your task is to rewrite the provided resume snippet based on the specific optimization goal.

Action: ${request.action.toUpperCase()}
Optimization Goal:
${actionInstruction}

Original Snippet:
"${request.selectedText}"

${request.jobDescription ? `Target Job Description Context:\n"${request.jobDescription.slice(0, 1000)}"\n` : ""}

INSTRUCTIONS:
- Generate 3 distinct, high-quality suggestions.
- For each suggestion, provide:
  1. "text": The complete polished bullet point / sentence.
  2. "rationale": 1 concise sentence explaining the improvement.
  3. "metricsEstimated": Optional metric badge (e.g. "+35% efficiency", "40ms latency", "$1.2M saved").

Reply with ONLY valid JSON in this shape (no markdown fences, no extra commentary):
{
  "suggestions": [
    {
      "text": "Architected high-throughput event processing platform reducing p99 latency by 42% across 50M daily transactions.",
      "rationale": "Emphasizes scale and quantifies performance gains using Google XYZ formula.",
      "metricsEstimated": "-42% latency"
    }
  ]
}`;
}
