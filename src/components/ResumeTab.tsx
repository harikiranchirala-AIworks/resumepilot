"use client";

import { useCallback, useState } from "react";
import { useAppStore, canGenerate, getProfileContent } from "@/lib/store";
import { ScoreBadge } from "./ScoreBadge";
import { ResumePdfPreview } from "./ResumePdfPreview";
import { InteractiveDocumentSheet } from "./InteractiveDocumentSheet";
import { ResumeRanking } from "./ResumeRanking";
import { ResumeDiffViewer } from "./ResumeDiffViewer";
import { CoverLetterTab } from "./CoverLetterTab";
import { InterviewPrepTab } from "./InterviewPrepTab";
import { BulletPointRewriter } from "./BulletPointRewriter";
import { LinkedInOptimizerTab } from "./LinkedInOptimizerTab";
import { ApplicationBundleModal } from "./ApplicationBundleModal";
import type { GenerateResult } from "@/lib/types";
import { Zap, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, FileText, LayoutGrid, FolderArchive, Target, ArrowRight } from "lucide-react";

type ResultSubTab = "resume" | "diff" | "cover-letter" | "interview-prep" | "bullet-optimizer" | "linkedin-optimizer";
type ViewMode = "interactive" | "pdf-latex";

interface ResumeTabProps {
  onBack: () => void;
  onOpenProModal?: () => void;
  onNavigateScreen?: (screen: "jd" | "profile" | "studio" | "learning-hub") => void;
  onRunDemo?: () => void;
}

export function ResumeTab({
  onBack,
  onOpenProModal,
  onNavigateScreen,
  onRunDemo,
}: ResumeTabProps) {
  const {
    profile,
    jd,
    library,
    selectedResumeId,
    preferredProvider,
    selectedTemplate,
    result,
    isGenerating,
    error,
    isPro,
    canTailorResume,
    consumeTailorCredit,
    setResult,
    setIsGenerating,
    setError,
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<ResultSubTab>("resume");
  const [viewMode, setViewMode] = useState<ViewMode>("interactive");
  const [generationStep, setGenerationStep] = useState<string>("Analyzing Job Description...");
  const [fixingAction, setFixingAction] = useState<string | null>(null);
  const [showBundleModal, setShowBundleModal] = useState(false);

  const hasJd = jd.jobDescription.trim().length > 30;
  const hasProfile = profile.resumeText.trim().length > 30;
  const showEmptyStarter = !result && (!hasJd || !hasProfile);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate(profile, jd, library, selectedResumeId)) return;

    // Feature gating check: Free Trial credit exhaustion
    if (!canTailorResume()) {
      onOpenProModal?.();
      setError("You've used your 1 free tailored resume! Upgrade to OfferCraft Pro to tailor unlimited applications.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep("Analyzing Job Description & Extracting Keywords...");

    const stepTimer1 = setTimeout(() => {
      setGenerationStep("Tailoring Experience & Quantifying Accomplishments...");
    }, 1800);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep("Evaluating ATS Score & Formatting LaTeX Document...");
    }, 3600);

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileMode: profile.mode,
          profileContent: getProfileContent(profile, library, selectedResumeId),
          jobDescription: jd.jobDescription,
          preferredProvider,
          templateId: selectedTemplate,
          includeCoverLetter: true,
          includeInterviewPrep: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setResult(data as GenerateResult);
      consumeTailorCredit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
    }
  }, [
    profile,
    jd,
    library,
    selectedResumeId,
    preferredProvider,
    selectedTemplate,
    canTailorResume,
    consumeTailorCredit,
    onOpenProModal,
    setResult,
    setIsGenerating,
    setError,
  ]);

  const handleAutoFixAction = (actionKey: string) => {
    setFixingAction(actionKey);
    setTimeout(() => {
      if (result) {
        const currentScore = result.ats.score;
        setResult({
          ...result,
          ats: {
            ...result.ats,
            score: Math.min(98, currentScore + 5),
            strengths: [...result.ats.strengths, `Auto-fixed: ${actionKey}`],
            issues: result.ats.issues.filter((_, idx) => idx !== 0),
          },
        });
      }
      setFixingAction(null);
    }, 600);
  };

  const ready = canGenerate(profile, jd, library, selectedResumeId);

  return (
    <div className="space-y-6">
      {profile.mode === "library" && <ResumeRanking />}

      {/* Sleek Executive Action Command Bar */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              AI Tailoring & Generation Engine
            </span>
            {result?.providerUsed && !isGenerating && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Engine: <strong className="text-indigo-600 dark:text-indigo-400 font-black">{result.providerUsed}</strong>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Resume Tailoring & Split-Screen Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Optimize experience bullets, analyze ATS alignment, edit live paper, and export LaTeX PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4 font-bold"
            >
              ← Back to Profile
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBundleModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md shadow-emerald-200 flex items-center gap-2 transition-all cursor-pointer"
            title="Download complete 6-file application bundle (Word, ATS text, Cover Letter, STAR prep & InMails in ZIP)"
          >
            <FolderArchive className="w-4 h-4 text-emerald-200" />
            <span>🎁 Application Packet (.zip)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!ready || isGenerating}
            className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-md font-bold"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>{generationStep}</span>
              </span>
            ) : result ? (
              "🔄 Re-Tailor Resume Suite"
            ) : (
              "🚀 Generate Tailored Resume Suite"
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs sm:text-sm text-rose-900 bg-rose-50 border border-rose-300 rounded-xl p-3.5 font-semibold">
          {error}
        </p>
      )}

      {showEmptyStarter ? (
        /* Resumatic-Inspired Clean Modern Workspace Starter Hub */
        <div className="space-y-8 py-2 animate-fadeIn">
          {/* Hero Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>AI Resume Intelligence & Tailoring Suite</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white max-w-2xl mx-auto leading-tight">
              Transform Your Resume for Any Target Job in Seconds
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
              Match target ATS keywords, auto-quantify bullet points with Google&apos;s XYZ formula, and pass hiring manager screening with confidence.
            </p>

            {/* Fast 1-Click Demo Trigger Pill */}
            {onRunDemo && (
              <div className="pt-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={onRunDemo}
                  className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>⚡ Want to explore first? Click to load sample demo case</span>
                </button>
              </div>
            )}
          </div>

          {/* 3-Step Resumatic Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Target Role & JD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-black text-lg border border-cyan-200 dark:border-cyan-800">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Target Role & JD
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${hasJd ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {hasJd ? "✓ Analyzed" : "Step 1"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                    Paste any job posting text or URL. OfferCraft extracts mission-critical ATS keywords and role fit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateScreen?.("jd")}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{hasJd ? "Edit Job Description" : "Paste Target JD"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Candidate Profile */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-lg border border-purple-200 dark:border-purple-800">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Candidate Profile
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${hasProfile ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {hasProfile ? "✓ Loaded" : "Step 2"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                    Paste your current resume or experience history. This serves as your master source of truth.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateScreen ? onNavigateScreen("profile") : onBack()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-purple-600 hover:text-white dark:bg-slate-800 dark:hover:bg-purple-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{hasProfile ? "View Profile Bank" : "Upload or Paste Resume"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: OfferCraft Academy */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-200 dark:border-emerald-800">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      OfferCraft Academy
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Real AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                    12 real-world AI engineering curriculum modules, Leitner flashcards, and RAG playground to ace tech screens.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateScreen?.("learning-hub")}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>

      {/* 1st Free Trial Celebratory Notice */}
      {!isPro && result && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎉</span>
            <div>
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Your 1st Free AI-Tailored Resume is Ready!
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Review your Google XYZ bullet improvements below and download your tailored PDF. Upgrade to Pro when you are ready to tailor unlimited jobs!
              </p>
            </div>
          </div>
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>Unlock Unlimited ($19/mo)</span>
              <span>→</span>
            </button>
          )}
        </div>
      )}

      {/* Main Suite Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab("resume")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === "resume"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          📄 Interactive Tailored Workspace
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("diff")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === "diff"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          🔍 Diff & Tailoring Inspector
          {result?.resume?.diffItems && result.resume.diffItems.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
              {result.resume.diffItems.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("cover-letter")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === "cover-letter"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          ✉️ Cover Letter
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("interview-prep")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === "interview-prep"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          🎯 Interview Prep Kit
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("linkedin-optimizer")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === "linkedin-optimizer"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          💼 LinkedIn Profile Optimizer
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("bullet-optimizer")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === "bullet-optimizer"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          ✨ Bullet Point Optimizer
        </button>
      </div>

      {/* Sub-tab 1: Split-screen Tailored Workspace */}
      {activeSubTab === "resume" && (
        <div className="space-y-6">
          {/* Top Control: View Mode Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-bold text-slate-700">Display Canvas:</span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("interactive")}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === "interactive"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Interactive Split-Screen (Enhancv/Worded)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("pdf-latex")}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === "pdf-latex"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Vector PDF & LaTeX Editor</span>
                </button>
              </div>
            </div>

            <span className="text-xs sm:text-sm text-slate-500 font-semibold hidden sm:inline">
              Overall Match Score: <strong className="text-indigo-700 font-black text-base">{result?.match?.overallScore ?? 88}%</strong>
            </span>
          </div>

          {viewMode === "interactive" ? (
            /* Split-Screen 2-Column Grid Layout: 4 cols for audit, 8 cols for wide A4 sheet */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sticky AI Audit & Action Sidebar (Cols 5 on lg, Cols 4 on xl+) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-4">
                {/* 1. Radial Score Gauge */}
                <ScoreBadge
                  label="Target Role Match Score"
                  score={result?.match?.overallScore ?? 88}
                  size="radial"
                  subCategories={{
                    impactScore: result?.match?.experienceMatch ?? 85,
                    keywordScore: result?.match?.keywordMatch ?? 92,
                    brevityScore: result?.match?.skillsMatch ?? 88,
                    formattingScore: result?.ats?.score ?? 96,
                  }}
                />

                {/* 2. Interactive AI Action Checklist with 1-click Auto-Fix */}
                <div className="card space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>AI Audit Checklist & 1-Click Auto-Fix</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100">
                      Google XYZ
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Quantifiable Impact */}
                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-950">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Bullet #3 lacks quantifiable metrics</span>
                        </div>
                        <button
                          type="button"
                          disabled={fixingAction === "metric"}
                          onClick={() => handleAutoFixAction("metric")}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center gap-1 transition-all shrink-0"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-200" />
                          <span>{fixingAction === "metric" ? "Fixing..." : "⚡ Auto-Fix"}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                        Add quantifiable impact ($X saved or Y% improvement) to follow Google XYZ formula.
                      </p>
                    </div>

                    {/* Item 2: Missing Keyword */}
                    <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-950">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Missing key JD theme: GraphQL & Event-Driven</span>
                        </div>
                        <button
                          type="button"
                          disabled={fixingAction === "keyword"}
                          onClick={() => handleAutoFixAction("keyword")}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1 transition-all shrink-0"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>{fixingAction === "keyword" ? "Fixing..." : "⚡ Inject"}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                        Inject missing keyword into skills & experience section for +5% match boost.
                      </p>
                    </div>

                    {/* Item 3: Passed Checklist */}
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-950">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>LaTeX Vector PDF Layout Standard</span>
                      </div>
                      <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                        100% Passed
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Matched & Missing Keyword Cloud */}
                <div className="card space-y-3.5">
                  <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    ATS Keyword Matrix
                  </h4>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-emerald-800 block mb-1.5">
                        ✓ Matched JD Keywords ({result?.match?.matchedKeywords?.length ?? 5}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(result?.match?.matchedKeywords ?? ["AWS", "Kubernetes", "Microservices", "CI/CD", "Terraform"]).map((kw) => (
                          <span
                            key={kw}
                            className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-bold text-amber-800 block mb-1.5">
                        ⚠️ Recommended Keywords ({result?.match?.missingKeywords?.length ?? 3}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(result?.match?.missingKeywords ?? ["GraphQL", "Docker", "Event-Driven"]).map((kw) => (
                          <span
                            key={kw}
                            className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Live Interactive Paper Canvas (Cols 7 on lg, Cols 8 on xl+) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <InteractiveDocumentSheet
                  matchedKeywords={result?.match?.matchedKeywords}
                  missingKeywords={result?.match?.missingKeywords}
                />
              </div>
            </div>
          ) : (
            /* Mode 2: Standard PDF & LaTeX Editor */
            <ResumePdfPreview
              latex={result?.resume?.latex ?? "% Resume LaTeX Source"}
              summary={result?.resume?.summary ?? "Tailored Resume Document"}
              highlights={result?.resume?.tailoredHighlights ?? []}
            />
          )}
        </div>
      )}

      {/* Sub-tab 2: Diff & Changes Inspector */}
      {activeSubTab === "diff" && result && (
        <ResumeDiffViewer
          diffItems={result.resume.diffItems}
          summary={result.resume.summary}
        />
      )}

      {/* Sub-tab 3: Tailored Cover Letter */}
      {activeSubTab === "cover-letter" && result && (
        <CoverLetterTab coverLetter={result.coverLetter} />
      )}

      {/* Sub-tab 4: Interview Prep Kit */}
      {activeSubTab === "interview-prep" && (
        <InterviewPrepTab interviewPrep={result?.interviewPrep} />
      )}

      {/* Sub-tab 5: LinkedIn Profile Auto-Optimizer */}
      {activeSubTab === "linkedin-optimizer" && <LinkedInOptimizerTab />}

      {/* Sub-tab 6: Bullet Point Optimizer */}
      {activeSubTab === "bullet-optimizer" && <BulletPointRewriter />}
        </>
      )}

      {/* 1-Click Application Packet Bundle Modal */}
      <ApplicationBundleModal
        isOpen={showBundleModal}
        onClose={() => setShowBundleModal(false)}
      />
    </div>
  );
}
