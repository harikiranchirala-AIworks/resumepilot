"use client";

import { useState } from "react";
import type { InterviewPrepResult } from "@/lib/types";
import { useAppStore, getProfileContent } from "@/lib/store";

interface InterviewPrepTabProps {
  interviewPrep?: InterviewPrepResult;
}

export function InterviewPrepTab({ interviewPrep: initialPrep }: InterviewPrepTabProps) {
  const { profile, jd, library, selectedResumeId, preferredProvider } = useAppStore();
  const [prep, setPrep] = useState<InterviewPrepResult | undefined>(initialPrep);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileContent: getProfileContent(profile, library, selectedResumeId),
          jobDescription: jd.jobDescription,
          preferredProvider,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPrep(data);
      }
    } catch (err) {
      console.error("Interview prep error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "behavioral":
        return "bg-purple-950/60 text-purple-300 border-purple-800/60";
      case "technical":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-800/60";
      case "gap":
        return "bg-amber-950/60 text-amber-300 border-amber-800/60";
      case "situational":
      default:
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
    }
  };

  if (!prep && !isGenerating) {
    return (
      <div className="card text-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto text-2xl shadow-glow-indigo">
          🎯
        </div>
        <div>
          <h3 className="text-base font-bold text-white">AI Interview Prep Kit</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Generate predicted interview questions and structured STAR responses tailored to this role and your experience.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="btn-primary text-xs"
        >
          Generate Interview Prep Kit
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base font-bold text-white">
              Role Interview Prep Kit
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{prep?.matchOverview}</p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-secondary text-xs shrink-0"
        >
          {isGenerating ? "Regenerating..." : "🔄 Regenerate Questions"}
        </button>
      </div>

      {prep?.keyTalkingPoints && prep.keyTalkingPoints.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
            Core Value Propositions / Talking Points
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {prep.keyTalkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Targeted Questions & STAR Answer Frameworks
        </h4>

        {prep?.questions?.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Q{idx + 1}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        q.category
                      )}`}
                    >
                      {q.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">{q.question}</p>
                </div>
                <span className="text-slate-400 text-xs mt-1">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                  {q.intent && (
                    <div className="text-[11px] text-slate-400 pt-3">
                      <strong className="text-slate-200">Interviewer Intent: </strong>
                      {q.intent}
                    </div>
                  )}

                  {q.suggestedStarResponse && (
                    <div className="space-y-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        STAR Method Response Blueprint:
                      </p>
                      <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/60 text-slate-300">
                        <p>
                          <strong className="text-white">S (Situation):</strong>{" "}
                          {q.suggestedStarResponse.situation}
                        </p>
                        <p>
                          <strong className="text-white">T (Task):</strong>{" "}
                          {q.suggestedStarResponse.task}
                        </p>
                        <p>
                          <strong className="text-white">A (Action):</strong>{" "}
                          {q.suggestedStarResponse.action}
                        </p>
                        <p>
                          <strong className="text-white">R (Result):</strong>{" "}
                          {q.suggestedStarResponse.result}
                        </p>
                      </div>
                    </div>
                  )}

                  {q.tip && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-start gap-1.5">
                      <span>💡</span>
                      <span>
                        <strong>Pro Tip: </strong>
                        {q.tip}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
