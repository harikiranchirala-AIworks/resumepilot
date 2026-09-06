import type { ATSAnalysis, KeywordGapCategory, KeywordGapItem, MatchAnalysis } from "./types";

const ATS_POSITIVE_PATTERNS = [
  /\b(experience|skills|education|summary|projects|certifications)\b/i,
  /\b(led|managed|developed|implemented|achieved|increased|reduced)\b/i,
  /\d+%|\$\d+|\d+\+/,
];

const ATS_NEGATIVE_PATTERNS = [
  /\b(photo|image|graphic|chart|table of contents)\b/i,
  /[^\x00-\x7F]/,
  /\b(see attached|click here)\b/i,
];

const CATEGORY_MAP: Record<string, KeywordGapCategory> = {
  // Core Tech
  typescript: "core-tech",
  javascript: "core-tech",
  python: "core-tech",
  java: "core-tech",
  golang: "core-tech",
  go: "core-tech",
  rust: "core-tech",
  csharp: "core-tech",
  "c++": "core-tech",
  react: "core-tech",
  "next.js": "core-tech",
  nextjs: "core-tech",
  vue: "core-tech",
  angular: "core-tech",
  "node.js": "core-tech",
  nodejs: "core-tech",
  sql: "core-tech",
  postgresql: "core-tech",
  postgres: "core-tech",
  mongodb: "core-tech",
  redis: "core-tech",
  graphql: "core-tech",
  "rest api": "core-tech",
  "restful apis": "core-tech",

  // Cloud & DevOps
  aws: "cloud-devops",
  azure: "cloud-devops",
  gcp: "cloud-devops",
  docker: "cloud-devops",
  kubernetes: "cloud-devops",
  k8s: "cloud-devops",
  terraform: "cloud-devops",
  "ci/cd": "cloud-devops",
  cicd: "cloud-devops",
  "github actions": "cloud-devops",
  jenkins: "cloud-devops",
  linux: "cloud-devops",
  kafka: "cloud-devops",
  rabbitmq: "cloud-devops",

  // Architecture & Methods
  microservices: "architecture",
  "system design": "architecture",
  "distributed systems": "architecture",
  "event-driven": "architecture",
  "high availability": "architecture",
  scalability: "architecture",
  performance: "architecture",
  security: "architecture",
  testing: "architecture",

  // Soft Skills & Governance
  agile: "soft-skills",
  scrum: "soft-skills",
  leadership: "soft-skills",
  mentorship: "soft-skills",
  communication: "soft-skills",
  "stakeholder management": "soft-skills",
  "cross-functional": "soft-skills",
  "project management": "soft-skills",

  // Certifications & Education
  pmp: "certifications",
  cspo: "certifications",
  csm: "certifications",
  "solutions architect": "certifications",
  bachelor: "certifications",
  master: "certifications",
};

export function analyzeATSHeuristic(
  latex: string,
  profileText: string,
  jobDescription: string
): ATSAnalysis {
  const issues: string[] = [];
  const strengths: string[] = [];
  const formattingTips: string[] = [];

  const sections = ["section", "textbf", "itemize"];
  const hasSections = sections.every((s) => latex.includes(s));
  if (hasSections) {
    strengths.push("Uses clear section headings and bullet lists");
  } else {
    issues.push("Missing standard resume sections or bullet formatting");
  }

  // Check positive patterns (action verbs & quantified metrics)
  const fullContent = latex + " " + profileText;
  const positiveMatches = ATS_POSITIVE_PATTERNS.filter((p) => p.test(fullContent)).length;
  if (positiveMatches >= 2) {
    strengths.push("Includes strong action verbs and quantified impact metrics");
  }

  // Check negative patterns
  const negativeMatches = ATS_NEGATIVE_PATTERNS.filter((p) => p.test(fullContent)).length;
  if (negativeMatches > 0) {
    issues.push("Contains non-standard formatting or characters that may disrupt basic ATS parsers");
  }

  if (!latex.includes("includegraphics")) {
    strengths.push("No embedded images — good for ATS parsing");
  } else {
    issues.push("Contains images which ATS systems may ignore");
  }

  if (latex.includes("hyperref")) {
    formattingTips.push("Hyperlinks are enabled; ensure URLs are plain text too");
  }

  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = (latex + profileText).toLowerCase();
  const matched = jdKeywords.filter((kw) => resumeLower.includes(kw.toLowerCase()));
  const matchRatio = jdKeywords.length ? matched.length / jdKeywords.length : 0;

  if (matchRatio >= 0.6) {
    strengths.push(`Strong keyword alignment (${Math.round(matchRatio * 100)}% of JD terms)`);
  } else if (matchRatio >= 0.35) {
    formattingTips.push("Add more job-description keywords where honestly applicable");
  } else {
    issues.push("Low keyword overlap with the job description");
  }

  let score = 70;
  score += strengths.length * 5;
  score -= issues.length * 8;
  score += Math.round(matchRatio * 20);
  score = Math.min(100, Math.max(0, score));

  if (!formattingTips.length) {
    formattingTips.push(
      "Use standard section names: Experience, Education, Skills",
      "Keep one column; avoid tables and text boxes",
      "Use consistent date formats (e.g., Jan 2022 – Present)"
    );
  }

  return { score, issues, strengths, formattingTips };
}

export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "and", "for", "with", "you", "your", "our", "will", "this", "that",
    "are", "have", "from", "able", "work", "team", "role", "job", "years",
    "experience", "required", "preferred", "including", "using", "must",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const bigrams: string[] = [];
  const tokens = text.toLowerCase().match(/[a-z]+(?:\s+[a-z]+){1,2}/g) ?? [];
  for (const t of tokens) {
    if (!stopWords.has(t.split(" ")[0])) bigrams.push(t);
  }

  const freq = new Map<string, number>();
  for (const w of [...words, ...bigrams]) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w);
}

export function analyzeMatchHeuristic(
  profileText: string,
  jobDescription: string
): MatchAnalysis {
  const keywords = extractKeywords(jobDescription);
  const profileLower = profileText.toLowerCase();
  const matchedKeywords = keywords.filter((kw) => profileLower.includes(kw));
  const missingKeywords = keywords.filter((kw) => !profileLower.includes(kw));

  const keywordMatch = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 0;

  const skillPatterns = [
    /\b(javascript|typescript|python|java|react|node|sql|aws|docker|kubernetes|agile|leadership|communication)\b/gi,
  ];
  const jdSkills = new Set<string>();
  const profileSkills = new Set<string>();
  for (const pattern of skillPatterns) {
    for (const m of jobDescription.matchAll(pattern)) jdSkills.add(m[0].toLowerCase());
    for (const m of profileText.matchAll(pattern)) profileSkills.add(m[0].toLowerCase());
  }
  const skillOverlap = [...jdSkills].filter((s) => profileSkills.has(s));
  const skillsMatch = jdSkills.size
    ? Math.round((skillOverlap.length / jdSkills.size) * 100)
    : keywordMatch;

  const expMatch = /\d+\+?\s*(years?|yrs?)/i.test(profileText) ? 75 : 50;
  const experienceMatch = Math.min(100, expMatch + (keywordMatch > 50 ? 15 : 0));
  const overallScore = Math.round(
    keywordMatch * 0.45 + skillsMatch * 0.35 + experienceMatch * 0.2
  );

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Incorporate these JD terms where accurate: ${missingKeywords.slice(0, 6).join(", ")}`
    );
  }
  if (skillsMatch < 60) {
    recommendations.push("Highlight transferable skills that map to the role's tech stack");
  }
  if (keywordMatch < 50) {
    recommendations.push("Rewrite bullet points to mirror the job description language");
  }
  recommendations.push("Quantify achievements with metrics relevant to the role");

  return {
    overallScore,
    keywordMatch,
    skillsMatch,
    experienceMatch,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    recommendations,
  };
}

/**
 * Detailed Keyword Gap Analysis categorizing terms and frequencies.
 */
export function analyzeKeywordGapsDetailed(
  jobDescription: string,
  resumeText: string
): KeywordGapItem[] {
  if (!jobDescription || !jobDescription.trim()) return [];

  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const extracted = extractKeywords(jobDescription);
  const items: KeywordGapItem[] = [];
  const seen = new Set<string>();

  for (const rawKw of extracted) {
    const kw = rawKw.toLowerCase().trim();
    if (seen.has(kw) || kw.length < 3) continue;
    seen.add(kw);

    // Count JD frequency
    const jdRegex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "gi");
    const jdCount = (jdLower.match(jdRegex) || []).length || 1;

    // Count Resume frequency
    const resRegex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "gi");
    const resCount = (resumeLower.match(resRegex) || []).length;

    // Determine category
    const category: KeywordGapCategory = CATEGORY_MAP[kw] || categorizeKeywordGeneric(kw);

    // Status
    const status: KeywordGapItem["status"] =
      resCount > 0 ? "matched" : jdCount >= 3 ? "missing" : "partial";

    // Relevance
    const relevance: KeywordGapItem["relevance"] =
      jdCount >= 3 || category === "core-tech" || category === "cloud-devops"
        ? "critical"
        : jdCount >= 2
        ? "recommended"
        : "nice-to-have";

    items.push({
      keyword: rawKw.charAt(0).toUpperCase() + rawKw.slice(1),
      category,
      jdFrequency: jdCount,
      resumeFrequency: resCount,
      status,
      relevance,
    });
  }

  // Sort: Critical missing first, then critical matched, then by JD frequency
  return items.sort((a, b) => {
    if (a.status === "missing" && b.status !== "missing") return -1;
    if (b.status === "missing" && a.status !== "missing") return 1;
    return b.jdFrequency - a.jdFrequency;
  });
}

function categorizeKeywordGeneric(kw: string): KeywordGapCategory {
  if (/(engineer|developer|code|api|database|data|backend|frontend|fullstack)/i.test(kw)) {
    return "core-tech";
  }
  if (/(cloud|server|deploy|pipeline|infrastructure|devops|security)/i.test(kw)) {
    return "cloud-devops";
  }
  if (/(design|architecture|system|scalability|performance|scale)/i.test(kw)) {
    return "architecture";
  }
  if (/(lead|manage|agile|scrum|team|communicate|collaborate|product)/i.test(kw)) {
    return "soft-skills";
  }
  return "core-tech";
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
