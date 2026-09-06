"use client";

import { useCallback, useState } from "react";
import { useAppStore, canGenerate, getProfileContent } from "@/lib/store";
import { ScoreBadge } from "./ScoreBadge";
import { TabActions } from "./TabActions";
import { ResumePdfPreview } from "./ResumePdfPreview";
import { ResumeRanking } from "./ResumeRanking";
import { ProviderSelector } from "./ProviderSelector";
import { ResumeDiffViewer } from "./ResumeDiffViewer";
import { CoverLetterTab } from "./CoverLetterTab";
import { InterviewPrepTab } from "./InterviewPrepTab";
import { BulletPointRewriter } from "./BulletPointRewriter";
import type { GenerateResult } from "@/lib/types";

type ResultSubTab = "resume" | "diff" | "cover-letter" | "interview-prep" | "bullet-optimizer";

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
  const [generationStep, setGenerationStep] = useState<string>("Analyzing Job Description...");

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

  const ready = canGenerate(profile, jd, library, selectedResumeId);

  return (
    <div className="space-y-6">
      {profile.mode === "library" && <ResumeRanking />}

      <div className="card card-accent space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
              Step 3
            </p>
            <h2 className="text-xl font-bold text-brand-900">
              AI Resume Tailoring & ATS Suite
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Generate a high-match ATS resume, cover letter, and interview prep kit.
            </p>
          </div>

          <ProviderSelector />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!ready || isGenerating}
            className="btn-primary w-full sm:w-auto text-xs py-3 px-6"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-sm">⏳</span>
                <span>{generationStep}</span>
              </span>
            ) : result ? (
              "🔄 Re-Tailor Resume Suite"
            ) : (
              "🚀 Generate Tailored Resume Suite"
            )}
          </button>

          {result?.providerUsed && !isGenerating && (
            <span className="text-[11px] text-slate-500 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg">
              Engine: <strong className="text-brand-900">{result.providerUsed}</strong>
            </span>
          )}
        </div>

        <TabActions showBack onBack={onBack} />

        {!ready && (
          <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            ⚠️ Please provide both Candidate Profile and Job Description to enable tailoring.
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Sub-tab navigation */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/80 backdrop-blur rounded-2xl border border-brand-100 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveSubTab("resume")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "resume"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              📄 Tailored Resume
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("diff")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === "diff"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              🔍 Diff & Changes
              {result.resume.diffItems && result.resume.diffItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-900 text-[10px] flex items-center justify-center font-bold">
                  {result.resume.diffItems.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("cover-letter")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "cover-letter"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              ✉️ Cover Letter
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("interview-prep")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "interview-prep"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              🎯 Interview Prep
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("bullet-optimizer")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "bullet-optimizer"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              ✨ Bullet Optimizer
            </button>
          </div>

          {/* Sub-tab 1: Tailored Resume View */}
          {activeSubTab === "resume" && (
            <>
              <div className="card space-y-4">
                <h3 className="text-sm font-bold text-brand-900">
                  Profile ↔ Job Description Alignment Breakdown
                </h3>
                <div className="flex flex-wrap justify-around gap-4 py-2">
                  <ScoreBadge label="Overall Match" score={result.match.overallScore} />
                  <ScoreBadge label="Keywords Match" score={result.match.keywordMatch} size="sm" />
                  <ScoreBadge label="Skills Match" score={result.match.skillsMatch} size="sm" />
                  <ScoreBadge label="Experience Match" score={result.match.experienceMatch} size="sm" />
                  <ScoreBadge label="ATS Score" score={result.ats.score} size="sm" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="rounded-xl bg-brand-50/60 border border-brand-100 p-4 space-y-2">
                    <h4 className="font-semibold text-brand-900">
                      ✓ Matched Target Keywords ({result.match.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.match.matchedKeywords.length ? (
                        result.match.matchedKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-medium"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">None detected</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50/80 border border-amber-100 p-4 space-y-2">
                    <h4 className="font-semibold text-amber-900">
                      ⚠️ Missing / Recommended Keywords ({result.match.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.match.missingKeywords.length ? (
                        result.match.missingKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">Exceptional coverage!</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100">
                    <h4 className="font-semibold text-emerald-900 mb-1.5">ATS Strengths</h4>
                    <ul className="text-slate-600 space-y-1 list-disc list-inside">
                      {result.ats.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-rose-50/50 p-3 border border-rose-100">
                    <h4 className="font-semibold text-rose-900 mb-1.5">Potential Issues</h4>
                    <ul className="text-slate-600 space-y-1 list-disc list-inside">
                      {result.ats.issues.length ? (
                        result.ats.issues.map((s, i) => <li key={i}>{s}</li>)
                      ) : (
                        <li className="list-none text-slate-500">No major issues identified</li>
                      )}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-1.5">Recommendations</h4>
                    <ul className="text-slate-600 space-y-1 list-disc list-inside">
                      {result.match.recommendations.slice(0, 3).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <ResumePdfPreview
                latex={result.resume.latex}
                summary={result.resume.summary}
                highlights={result.resume.tailoredHighlights}
              />
            </>
          )}

          {/* Sub-tab 2: Diff & Changes Inspector */}
          {activeSubTab === "diff" && (
            <ResumeDiffViewer
              diffItems={result.resume.diffItems}
              summary={result.resume.summary}
            />
          )}

          {/* Sub-tab 3: Tailored Cover Letter */}
          {activeSubTab === "cover-letter" && (
            <CoverLetterTab coverLetter={result.coverLetter} />
          )}

          {/* Sub-tab 4: Interview Prep Kit */}
          {activeSubTab === "interview-prep" && (
            <InterviewPrepTab interviewPrep={result.interviewPrep} />
          )}

          {/* Sub-tab 5: Bullet Point Optimizer */}
          {activeSubTab === "bullet-optimizer" && <BulletPointRewriter />}
        </div>
      )}
    </div>
  );
}

