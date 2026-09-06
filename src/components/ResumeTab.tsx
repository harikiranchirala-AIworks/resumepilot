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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Step 3
              </span>
              <span className="text-xs text-slate-400">AI Tailoring & Generation Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              AI Resume Tailoring & ATS Suite
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Generate a high-match ATS resume, matching cover letter, and interview prep kit.
            </p>
          </div>

          <ProviderSelector />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!ready || isGenerating}
            className="btn-primary w-full sm:w-auto text-xs py-3 px-6 shadow-glow-indigo font-bold"
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
            <span className="text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1 rounded-xl">
              Engine: <strong className="text-white">{result.providerUsed}</strong>
            </span>
          )}
        </div>

        <TabActions showBack onBack={onBack} />

        {!ready && (
          <p className="mt-4 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 rounded-xl px-4 py-3">
            ⚠️ Please provide both Candidate Profile and Job Description to enable tailoring.
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sub-tab navigation */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveSubTab("resume")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "resume"
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              📄 Tailored Resume
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("diff")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === "diff"
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              🔍 Diff & Changes
              {result.resume.diffItems && result.resume.diffItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-300 text-[10px] flex items-center justify-center font-bold border border-indigo-500/40">
                  {result.resume.diffItems.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("cover-letter")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "cover-letter"
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              ✉️ Cover Letter
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("interview-prep")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "interview-prep"
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              🎯 Interview Prep
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("bullet-optimizer")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === "bullet-optimizer"
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              ✨ Bullet Optimizer
            </button>
          </div>

          {/* Sub-tab 1: Tailored Resume View */}
          {activeSubTab === "resume" && (
            <>
              <div className="card space-y-4">
                <h3 className="text-sm font-bold text-white">
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
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
                    <h4 className="font-bold text-emerald-400">
                      ✓ Matched Target Keywords ({result.match.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.match.matchedKeywords.length ? (
                        result.match.matchedKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 font-medium border border-emerald-800/40"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">None detected</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
                    <h4 className="font-bold text-amber-400">
                      ⚠️ Missing / Recommended Keywords ({result.match.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.match.missingKeywords.length ? (
                        result.match.missingKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 font-medium border border-amber-800/40"
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
                  <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-800/40">
                    <h4 className="font-semibold text-emerald-300 mb-1.5">ATS Strengths</h4>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      {result.ats.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-rose-950/20 p-3 border border-rose-800/40">
                    <h4 className="font-semibold text-rose-300 mb-1.5">Potential Issues</h4>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      {result.ats.issues.length ? (
                        result.ats.issues.map((s, i) => <li key={i}>{s}</li>)
                      ) : (
                        <li className="list-none text-slate-500">No major issues identified</li>
                      )}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                    <h4 className="font-semibold text-indigo-300 mb-1.5">Recommendations</h4>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
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

