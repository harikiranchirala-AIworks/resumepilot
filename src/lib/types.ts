export type ProfileInputMode = "library" | "resumeText";

export type AIProvider = "auto" | "gemini" | "openai" | "anthropic" | "cursor";

export type ResumeTemplateId =
  | "tech-standard"
  | "modern-clean"
  | "classic-academic"
  | "compact-executive";

export interface ResumeTemplateInfo {
  id: ResumeTemplateId;
  name: string;
  description: string;
  bestFor: string;
}

export interface ResumeEntry {
  id: string;
  name: string;
  text: string;
  updatedAt: string;
}

export interface ProfileState {
  mode: ProfileInputMode;
  resumeText: string;
}

export interface JDState {
  jobDescription: string;
}

export interface MatchAnalysis {
  overallScore: number;
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface ATSAnalysis {
  score: number;
  issues: string[];
  strengths: string[];
  formattingTips: string[];
}

export interface DiffItem {
  originalBullet: string;
  tailoredBullet: string;
  changeType: "added" | "enhanced" | "quantified" | "keyword-injected";
  explanation: string;
}

export interface GeneratedResume {
  latex: string;
  latexBody?: string;
  summary: string;
  tailoredHighlights: string[];
  diffItems?: DiffItem[];
}

export interface CoverLetterResult {
  latex: string;
  text: string;
  roleTitle: string;
  companyName: string;
  keyHooks: string[];
}

export interface InterviewQuestion {
  question: string;
  category: "behavioral" | "technical" | "gap" | "situational";
  intent: string;
  suggestedStarResponse: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tip: string;
}

export interface InterviewPrepResult {
  roleTitle: string;
  matchOverview: string;
  questions: InterviewQuestion[];
  keyTalkingPoints: string[];
}

export interface BulletRewriteOption {
  style: "xyz-impact" | "action-focused" | "concise";
  text: string;
  rationale: string;
}

export interface GenerateResult {
  resume: GeneratedResume;
  match: MatchAnalysis;
  ats: ATSAnalysis;
  providerUsed?: string;
  templateUsed?: ResumeTemplateId;
  coverLetter?: CoverLetterResult;
  interviewPrep?: InterviewPrepResult;
}
