import { create } from "zustand";
import type {
  AIProvider,
  ApplicationStage,
  GenerateResult,
  JDState,
  JobApplication,
  PageFitSettings,
  ProfileInputMode,
  ProfileState,
  ResumeEntry,
  ResumeTemplateId,
  WorkspaceExportData,
  UserAccount,
} from "./types";
import { buildLatexDocument, extractLatexBody } from "./latex";

const LOCAL_STORAGE_APPS_KEY = "offercraft_applications_v1";
const LOCAL_STORAGE_PAGE_FIT_KEY = "offercraft_page_fit_v1";
const LOCAL_STORAGE_USER_KEY = "offercraft_user_session_v1";

const DEFAULT_PAGE_FIT: PageFitSettings = {
  margin: "standard",
  fontSize: "standard",
  lineSpacing: "normal",
  itemSpacing: "normal",
  targetPages: 1,
};

function loadStoredApplications(): JobApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredApplications(apps: JobApplication[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(apps));
  } catch {
    /* ignore */
  }
}

function loadStoredPageFit(): PageFitSettings {
  if (typeof window === "undefined") return DEFAULT_PAGE_FIT;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PAGE_FIT_KEY);
    return raw ? { ...DEFAULT_PAGE_FIT, ...JSON.parse(raw) } : DEFAULT_PAGE_FIT;
  } catch {
    return DEFAULT_PAGE_FIT;
  }
}

function saveStoredPageFit(fit: PageFitSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PAGE_FIT_KEY, JSON.stringify(fit));
  } catch {
    /* ignore */
  }
}

function loadStoredUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredUser(user: UserAccount | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  } catch {
    /* ignore */
  }
}

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

  // Phase 2: Applications Kanban Tracker & Page Fit
  applications: JobApplication[];
  activeApplicationId: string | null;
  pageFitSettings: PageFitSettings;

  // Option 4: SaaS Monetization & Pro Plan
  isPro: boolean;
  proPlan: "free" | "pro-monthly" | "pro-annual" | "executive-lifetime";
  setProPlan: (plan: "free" | "pro-monthly" | "pro-annual" | "executive-lifetime") => void;

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

  // Applications Tracker Actions
  initApplications: () => void;
  addApplication: (app: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => JobApplication;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  setApplicationStage: (id: string, stage: ApplicationStage) => void;
  saveCurrentWorkspaceAsApplication: (meta: {
    companyName: string;
    roleTitle: string;
    salaryEstimate?: string;
    location?: string;
    notes?: string;
  }) => JobApplication;
  loadApplicationIntoWorkspace: (id: string) => void;

  // Page Fit Actions
  setPageFitSettings: (settings: Partial<PageFitSettings>) => void;

  // Google Account Cloud Sync & User Session
  user: UserAccount | null;
  isSyncing: boolean;
  loginWithGoogle: (details: {
    name: string;
    email: string;
    avatar?: string;
    targetRole?: string;
  }) => void;
  registerAccount: (details: {
    name: string;
    email: string;
    avatar?: string;
    targetRole?: string;
    provider?: "google" | "email";
  }) => void;
  logoutUser: () => void;
  syncCloudData: () => Promise<boolean>;
  updateUserAccount: (updates: Partial<UserAccount>) => void;

  // Workspace Backup & Restore
  exportWorkspaceJson: () => string;
  importWorkspaceJson: (jsonString: string) => boolean;
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

  applications: [],
  activeApplicationId: null,
  pageFitSettings: DEFAULT_PAGE_FIT,

  user: loadStoredUser(),
  isSyncing: false,

  isPro: typeof window !== "undefined" && localStorage.getItem("resumepilot_is_pro") === "true",
  proPlan:
    (typeof window !== "undefined" &&
      (localStorage.getItem("resumepilot_pro_plan") as
        | "free"
        | "pro-monthly"
        | "pro-annual"
        | "executive-lifetime")) ||
    "free",
  setProPlan: (plan) => {
    const isPro = plan !== "free";
    if (typeof window !== "undefined") {
      localStorage.setItem("resumepilot_is_pro", isPro ? "true" : "false");
      localStorage.setItem("resumepilot_pro_plan", plan);
    }
    set({ isPro, proPlan: plan });
  },

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

  // Applications Actions
  initApplications: () => {
    const apps = loadStoredApplications();
    const fit = loadStoredPageFit();
    set({ applications: apps, pageFitSettings: fit });
  },

  addApplication: (appData) => {
    const now = new Date().toISOString();
    const newApp: JobApplication = {
      ...appData,
      id: "app_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    const nextApps = [newApp, ...get().applications];
    set({ applications: nextApps, activeApplicationId: newApp.id });
    saveStoredApplications(nextApps);
    return newApp;
  },

  updateApplication: (id, updates) => {
    const nextApps = get().applications.map((app) =>
      app.id === id
        ? { ...app, ...updates, updatedAt: new Date().toISOString() }
        : app
    );
    set({ applications: nextApps });
    saveStoredApplications(nextApps);
  },

  deleteApplication: (id) => {
    const nextApps = get().applications.filter((app) => app.id !== id);
    set({
      applications: nextApps,
      activeApplicationId: get().activeApplicationId === id ? null : get().activeApplicationId,
    });
    saveStoredApplications(nextApps);
  },

  setApplicationStage: (id, stage) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;
    const updates: Partial<JobApplication> = { stage };
    if (stage === "applied" && !app.appliedDate) {
      updates.appliedDate = new Date().toISOString().split("T")[0];
    }
    get().updateApplication(id, updates);
  },

  saveCurrentWorkspaceAsApplication: (meta) => {
    const current = get();
    const now = new Date().toISOString();
    const newApp: JobApplication = {
      id: "app_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now(),
      companyName: meta.companyName.trim() || "Target Company",
      roleTitle: meta.roleTitle.trim() || "Target Position",
      jobDescription: current.jd.jobDescription,
      stage: current.result ? "tailored" : "saved",
      salaryEstimate: meta.salaryEstimate,
      location: meta.location,
      notes: meta.notes,
      matchScore: current.result?.match.overallScore,
      resumeLatex: current.editableLatex || current.result?.resume.latex,
      templateId: current.selectedTemplate,
      coverLetterText: current.result?.coverLetter?.text,
      interviewPrep: current.result?.interviewPrep,
      createdAt: now,
      updatedAt: now,
    };

    const nextApps = [newApp, ...current.applications];
    set({ applications: nextApps, activeApplicationId: newApp.id });
    saveStoredApplications(nextApps);
    return newApp;
  },

  loadApplicationIntoWorkspace: (id) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    set({
      activeApplicationId: app.id,
      jd: { jobDescription: app.jobDescription || "" },
      selectedTemplate: app.templateId || "tech-standard",
      editableLatex: app.resumeLatex || "",
    });
  },

  // Page Fit Actions
  setPageFitSettings: (settings) => {
    const updated = { ...get().pageFitSettings, ...settings };
    set({ pageFitSettings: updated });
    saveStoredPageFit(updated);
  },

  loginWithGoogle: ({ name, email, avatar, targetRole }) => {
    const userAccount: UserAccount = {
      id: `usr_${Date.now()}`,
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      provider: "google",
      isGoogleConnected: true,
      cloudSyncEnabled: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      targetRole: targetRole?.trim() || "Technology Leader",
      registeredAt: new Date().toISOString(),
    };
    saveStoredUser(userAccount);

    // If user has a previously synced vault in cloud localStorage, restore it!
    if (typeof window !== "undefined") {
      try {
        const vaultKey = `offercraft_cloud_vault_${userAccount.email}`;
        const vaultData = localStorage.getItem(vaultKey);
        if (vaultData) {
          const parsed = JSON.parse(vaultData);
          if (parsed.profile?.resumeText) {
            set({ profile: parsed.profile });
          }
          if (parsed.applications?.length) {
            set({ applications: parsed.applications });
            saveStoredApplications(parsed.applications);
          }
        }
      } catch (err) {
        console.error("Cloud vault restore error:", err);
      }
    }

    set({ user: userAccount });
  },

  registerAccount: ({ name, email, avatar, targetRole, provider = "google" }) => {
    const userAccount: UserAccount = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      provider,
      isGoogleConnected: provider === "google",
      cloudSyncEnabled: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      targetRole: targetRole?.trim() || "Candidate",
      registeredAt: new Date().toISOString(),
    };
    saveStoredUser(userAccount);
    set({ user: userAccount });
  },

  logoutUser: () => {
    saveStoredUser(null);
    set({ user: null });
  },

  syncCloudData: async () => {
    const { user, profile, applications, library, selectedTemplate, preferredProvider } = get();
    if (!user) return false;

    set({ isSyncing: true });
    // Simulate realistic Google Cloud latency
    await new Promise((r) => setTimeout(r, 650));

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updatedUser: UserAccount = {
      ...user,
      lastSyncedAt: timestamp,
      cloudSyncEnabled: true,
      isGoogleConnected: true,
    };

    saveStoredUser(updatedUser);

    if (typeof window !== "undefined") {
      try {
        const vaultKey = `offercraft_cloud_vault_${user.email}`;
        const snapshot = {
          syncedAt: new Date().toISOString(),
          profile,
          applications,
          library,
          selectedTemplate,
          preferredProvider,
        };
        localStorage.setItem(vaultKey, JSON.stringify(snapshot));
      } catch (e) {
        console.error("Failed saving cloud snapshot:", e);
      }
    }

    set({ user: updatedUser, isSyncing: false });
    return true;
  },

  updateUserAccount: (updates) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    saveStoredUser(updated);
    set({ user: updated });
  },

  // Workspace Backup & Restore
  exportWorkspaceJson: () => {
    const state = get();
    const data: WorkspaceExportData = {
      version: "1.2.0",
      exportedAt: new Date().toISOString(),
      profile: state.profile,
      library: state.library,
      applications: state.applications,
      selectedTemplate: state.selectedTemplate,
      preferredProvider: state.preferredProvider,
    };
    return JSON.stringify(data, null, 2);
  },

  importWorkspaceJson: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString) as WorkspaceExportData;
      if (!parsed || typeof parsed !== "object") return false;

      if (parsed.profile) set({ profile: parsed.profile });
      if (Array.isArray(parsed.library)) set({ library: parsed.library });
      if (Array.isArray(parsed.applications)) {
        set({ applications: parsed.applications });
        saveStoredApplications(parsed.applications);
      }
      if (parsed.selectedTemplate) set({ selectedTemplate: parsed.selectedTemplate });
      if (parsed.preferredProvider) set({ preferredProvider: parsed.preferredProvider });
      return true;
    } catch {
      return false;
    }
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
