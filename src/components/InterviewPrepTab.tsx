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
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "technical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "gap":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "situational":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  if (!prep && !isGenerating) {
    return (
      <div className="card text-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto text-2xl">
          🎯
        </div>
        <div>
          <h3 className="text-base font-bold text-brand-900">AI Interview Prep Kit</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base font-bold text-brand-900">
              Role Interview Prep Kit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{prep?.matchOverview}</p>
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
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
          <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">
            Core Value Propositions / Talking Points
          </h4>
          <ul className="space-y-1.5 text-xs text-brand-800">
            {prep.keyTalkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
          Targeted Questions & STAR Answer Frameworks
        </h4>

        {prep?.questions?.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        q.category
                      )}`}
                    >
                      {q.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{q.question}</p>
                </div>
                <span className="text-slate-400 text-xs mt-1">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-3 text-xs">
                  {q.intent && (
                    <div className="text-[11px] text-slate-600 pt-3">
                      <strong className="text-slate-800">Interviewer Intent: </strong>
                      {q.intent}
                    </div>
                  )}

                  {q.suggestedStarResponse && (
                    <div className="space-y-2 p-3 rounded-lg bg-white border border-slate-200">
                      <p className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                        STAR Method Response Blueprint:
                      </p>
                      <div className="space-y-1.5 pl-2 border-l-2 border-brand-200 text-slate-700">
                        <p>
                          <strong className="text-brand-900">S (Situation):</strong>{" "}
                          {q.suggestedStarResponse.situation}
                        </p>
                        <p>
                          <strong className="text-brand-900">T (Task):</strong>{" "}
                          {q.suggestedStarResponse.task}
                        </p>
                        <p>
                          <strong className="text-brand-900">A (Action):</strong>{" "}
                          {q.suggestedStarResponse.action}
                        </p>
                        <p>
                          <strong className="text-brand-900">R (Result):</strong>{" "}
                          {q.suggestedStarResponse.result}
                        </p>
                      </div>
                    </div>
                  )}

                  {q.tip && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5">
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
