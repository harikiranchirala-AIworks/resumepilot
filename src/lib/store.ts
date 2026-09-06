import { create } from "zustand";
import type {
  AIProvider,
  GenerateResult,
  JDState,
  ProfileInputMode,
  ProfileState,
  ResumeEntry,
  ResumeTemplateId,
} from "./types";
import { buildLatexDocument, extractLatexBody } from "./latex";

interface AppStore {
  profile: ProfileState;
  jd: JDState;
  result: GenerateResult | null;
  isGenerating: boolean;
  error: string | null;
  library: ResumeEntry[];
  selectedResumeId: string | null;
  preferredProvider: AIProvider;
  selectedTemplate: ResumeTemplateId;
  editableLatex: string;

  setProfileMode: (mode: ProfileInputMode) => void;
  setResumeText: (text: string) => void;
  setJobDescription: (text: string) => void;
  setResult: (result: GenerateResult | null) => void;
  setIsGenerating: (value: boolean) => void;
  setError: (error: string | null) => void;
  setPreferredProvider: (provider: AIProvider) => void;
  setSelectedTemplate: (template: ResumeTemplateId) => void;
  setEditableLatex: (latex: string) => void;
  changeTemplate: (template: ResumeTemplateId) => void;
  loadLibrary: () => Promise<void>;
  selectResume: (id: string) => void;
  upsertResume: (entry: { id?: string; name: string; text: string }) => Promise<void>;
  removeResume: (id: string) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  profile: {
    mode: "resumeText",
    resumeText: "",
  },
  jd: {
    jobDescription: "",
  },
  result: null,
  isGenerating: false,
  error: null,
  library: [],
  selectedResumeId: null,
  preferredProvider: "auto",
  selectedTemplate: "tech-standard",
  editableLatex: "",

  setProfileMode: (mode) =>
    set((state) => ({
      profile: { ...state.profile, mode },
      result: null,
      error: null,
    })),
  setResumeText: (resumeText) =>
    set((state) => ({
      profile: { ...state.profile, resumeText },
      result: null,
      error: null,
    })),
  setJobDescription: (jobDescription) =>
    set(() => ({
      jd: { jobDescription },
      result: null,
      error: null,
    })),
  setResult: (result) =>
    set({
      result,
      editableLatex: result?.resume.latex ?? "",
      selectedTemplate: result?.templateUsed ?? "tech-standard",
    }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setPreferredProvider: (preferredProvider) => set({ preferredProvider }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
  setEditableLatex: (editableLatex) => set({ editableLatex }),

  changeTemplate: (template) => {
    const currentResult = get().result;
    const currentLatex = get().editableLatex || currentResult?.resume.latex;
    if (!currentLatex) {
      set({ selectedTemplate: template });
      return;
    }
    const body = extractLatexBody(currentLatex);
    const newLatex = buildLatexDocument(body, template);

    set({
      selectedTemplate: template,
      editableLatex: newLatex,
      result: currentResult
        ? {
            ...currentResult,
            resume: {
              ...currentResult.resume,
              latex: newLatex,
            },
            templateUsed: template,
          }
        : null,
    });
  },

  loadLibrary: async () => {
    try {
      const res = await fetch("/api/resumes");
      const library = (await res.json()) as ResumeEntry[];
      set({ library });
    } catch {
      /* ignore */
    }
  },
  selectResume: (id) =>
    set({ selectedResumeId: id, result: null, error: null }),
  upsertResume: async (entry) => {
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const saved = (await res.json()) as ResumeEntry;
    const library = get().library;
    const idx = library.findIndex((e) => e.id === saved.id);
    const nextLibrary =
      idx >= 0
        ? library.map((e) => (e.id === saved.id ? saved : e))
        : [...library, saved];
    set({ library: nextLibrary, selectedResumeId: saved.id });
  },
  removeResume: async (id) => {
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    set((state) => ({
      library: state.library.filter((e) => e.id !== id),
      selectedResumeId: state.selectedResumeId === id ? null : state.selectedResumeId,
    }));
  },
}));

function selectedResumeText(
  library: ResumeEntry[],
  selectedResumeId: string | null
): string {
  return library.find((e) => e.id === selectedResumeId)?.text.trim() ?? "";
}

export function getProfileContent(
  profile: ProfileState,
  library: ResumeEntry[],
  selectedResumeId: string | null
): string {
  if (profile.mode === "library") {
    return selectedResumeText(library, selectedResumeId);
  }
  return profile.resumeText.trim();
}

export function canProceedFromProfile(
  profile: ProfileState,
  library: ResumeEntry[],
  selectedResumeId: string | null
): boolean {
  return profile.mode === "library"
    ? selectedResumeText(library, selectedResumeId).length > 0
    : profile.resumeText.trim().length > 0;
}

export function canProceedFromJD(jd: JDState): boolean {
  return jd.jobDescription.trim().length > 0;
}

export function canGenerate(
  profile: ProfileState,
  jd: JDState,
  library: ResumeEntry[],
  selectedResumeId: string | null
): boolean {
  const hasProfile =
    profile.mode === "library"
      ? selectedResumeText(library, selectedResumeId).length > 20
      : profile.resumeText.trim().length > 20;
  const hasJD = jd.jobDescription.trim().length > 20;
  return hasProfile && hasJD;
}

