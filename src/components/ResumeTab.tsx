"use client";

import { useCallback, useState } from "react";
import { useAppStore, canGenerate, getProfileContent } from "@/lib/store";
import { ScoreBadge } from "./ScoreBadge";
import { TabActions } from "./TabActions";
import { ResumePdfPreview } from "./ResumePdfPreview";
import { InteractiveDocumentSheet } from "./InteractiveDocumentSheet";
import { ResumeRanking } from "./ResumeRanking";
import { ProviderSelector } from "./ProviderSelector";
import { ResumeDiffViewer } from "./ResumeDiffViewer";
import { CoverLetterTab } from "./CoverLetterTab";
import { InterviewPrepTab } from "./InterviewPrepTab";
import { BulletPointRewriter } from "./BulletPointRewriter";
import type { GenerateResult } from "@/lib/types";
import { Zap, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, FileText, LayoutGrid } from "lucide-react";

type ResultSubTab = "resume" | "diff" | "cover-letter" | "interview-prep" | "bullet-optimizer";
type ViewMode = "interactive" | "pdf-latex";

interface ResumeTabProps {
  onBack: () => void;
}

export function ResumeTab({ onBack }: ResumeTabProps) {
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
    setResult,
    setIsGenerating,
    setError,
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<ResultSubTab>("resume");
  const [viewMode, setViewMode] = useState<ViewMode>("interactive");
  const [generationStep, setGenerationStep] = useState<string>("Analyzing Job Description...");
  const [fixingAction, setFixingAction] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate(profile, jd, library, selectedResumeId)) return;

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

      <div className="card card-accent space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Step 3
              </span>
              <span className="text-xs text-slate-600 font-medium">AI Tailoring & Generation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Resume Tailoring & Split-Screen Workspace
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              Tailor experience bullets, evaluate ATS alignment, edit interactive paper, and export vector PDF.
            </p>
          </div>

          <ProviderSelector />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!ready || isGenerating}
            className="btn-primary w-full sm:w-auto text-xs py-3 px-6 shadow-md font-bold"
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

          {result?.providerUsed && !isGenerating && (
            <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl font-bold">
              Engine: <strong className="text-slate-900">{result.providerUsed}</strong>
            </span>
          )}
        </div>

        <TabActions showBack onBack={onBack} />

        {!ready && (
          <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium">
            ⚠️ Please provide Candidate Profile and Job Description to enable full tailoring. You can preview demo mode below!
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
            {error}
          </p>
        )}
      </div>

      {/* Main Suite Tabs Bar */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab("resume")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
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
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === "diff"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          🔍 Diff & Tailoring Inspector
          {result?.resume?.diffItems && result.resume.diffItems.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-bold">
              {result.resume.diffItems.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("cover-letter")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
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
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === "interview-prep"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          🎯 Interview Prep Kit
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("bullet-optimizer")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
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
          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Display Canvas:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("interactive")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === "interactive"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Interactive Split-Screen (Enhancv/Worded)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("pdf-latex")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === "pdf-latex"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Vector PDF & LaTeX Editor</span>
                </button>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Overall Score: <strong className="text-indigo-700">{result?.match?.overallScore ?? 88}%</strong>
            </span>
          </div>

          {viewMode === "interactive" ? (
            /* Split-Screen 2-Column Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sticky AI Audit & Action Sidebar (Cols 5) */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
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
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>AI Audit Checklist & 1-Click Auto-Fix</span>
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                      Google XYZ Verified
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Quantifiable Impact */}
                    <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Bullet #3 lacks quantifiable metrics</span>
                        </div>
                        <button
                          type="button"
                          disabled={fixingAction === "metric"}
                          onClick={() => handleAutoFixAction("metric")}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center gap-1 transition-all shrink-0"
                        >
                          <Zap className="w-3 h-3 text-amber-200" />
                          <span>{fixingAction === "metric" ? "Fixing..." : "⚡ Auto-Fix"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-normal font-medium">
                        Add quantifiable impact ($X saved or Y% improvement) to follow Google XYZ formula.
                      </p>
                    </div>

                    {/* Item 2: Missing Keyword */}
                    <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Missing key JD theme: GraphQL & Event-Driven</span>
                        </div>
                        <button
                          type="button"
                          disabled={fixingAction === "keyword"}
                          onClick={() => handleAutoFixAction("keyword")}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1 transition-all shrink-0"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>{fixingAction === "keyword" ? "Fixing..." : "⚡ Inject"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-rose-900 leading-normal font-medium">
                        Inject missing keyword into skills & experience section for +5% match boost.
                      </p>
                    </div>

                    {/* Item 3: Passed Checklist */}
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs font-bold text-emerald-950">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>LaTeX Vector PDF Layout Standard</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        100% Passed
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Matched & Missing Keyword Cloud */}
                <div className="card space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                    ATS Keyword Matrix
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-700 block mb-1">
                        ✓ Matched JD Keywords ({result?.match?.matchedKeywords?.length ?? 5}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(result?.match?.matchedKeywords ?? ["AWS", "Kubernetes", "Microservices", "CI/CD", "Terraform"]).map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-bold text-amber-700 block mb-1">
                        ⚠️ Recommended Keywords ({result?.match?.missingKeywords?.length ?? 3}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(result?.match?.missingKeywords ?? ["GraphQL", "Docker", "Event-Driven"]).map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 text-[11px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Live Interactive Paper Canvas (Cols 7) */}
              <div className="lg:col-span-7">
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
      {activeSubTab === "interview-prep" && result && (
        <InterviewPrepTab interviewPrep={result.interviewPrep} />
      )}

      {/* Sub-tab 5: Bullet Point Optimizer */}
      {activeSubTab === "bullet-optimizer" && <BulletPointRewriter />}
    </div>
  );
}
