export type ProfileInputMode = "library" | "resumeText";

export type AIProvider = "auto" | "gemini" | "openai" | "anthropic" | "cursor";

export type ResumeTemplateId =
  | "tech-standard"
  | "modern-clean"
  | "classic-academic"
  | "compact-executive"
  | "creative-bold";

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

/* ==========================================================================
   Phase 2 & 3 Interfaces: Applications Kanban, Keyword Matrix, Co-Pilot & Customizer
   ========================================================================== */

export type ApplicationStage =
  | "saved"
  | "tailored"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "archived";

export interface JobApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  jobDescription: string;
  stage: ApplicationStage;
  salaryEstimate?: string;
  location?: string;
  notes?: string;
  appliedDate?: string;
  interviewDate?: string;
  matchScore?: number;
  resumeLatex?: string;
  templateId?: ResumeTemplateId;
  coverLetterText?: string;
  interviewPrep?: InterviewPrepResult;
  createdAt: string;
  updatedAt: string;
}

export type KeywordGapCategory =
  | "core-tech"
  | "cloud-devops"
  | "architecture"
  | "soft-skills"
  | "certifications";

export interface KeywordGapItem {
  keyword: string;
  category: KeywordGapCategory;
  jdFrequency: number;
  resumeFrequency: number;
  status: "matched" | "missing" | "partial";
  relevance: "critical" | "recommended" | "nice-to-have";
}

export interface PageFitSettings {
  margin: "tight" | "standard" | "relaxed";
  fontSize: "small" | "medium" | "standard";
  lineSpacing: "tight" | "normal" | "relaxed";
  itemSpacing: "tight" | "normal" | "relaxed";
  targetPages: 1 | 2 | "auto";
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
}

export type CoPilotActionType =
  | "quantify"
  | "inject_keyword"
  | "shorten"
  | "elevate_tone";

export interface CoPilotSuggestion {
  text: string;
  rationale: string;
  metricsEstimated?: string;
}

export interface CoPilotRequest {
  action: CoPilotActionType;
  selectedText: string;
  contextRole?: string;
  targetKeyword?: string;
  jobDescription?: string;
  preferredProvider?: AIProvider;
}

export interface CoPilotResponse {
  action: CoPilotActionType;
  originalText: string;
  suggestions: CoPilotSuggestion[];
  providerUsed?: string;
}

export interface WorkspaceExportData {
  version: string;
  exportedAt: string;
  profile: ProfileState;
  library: ResumeEntry[];
  applications: JobApplication[];
  selectedTemplate: ResumeTemplateId;
  preferredProvider: AIProvider;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "email";
  isGoogleConnected: boolean;
  cloudSyncEnabled: boolean;
  lastSyncedAt: string;
  targetRole: string;
  registeredAt: string;
}

