"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { analyzeMatchHeuristic } from "@/lib/ats";
import { ScoreBadge } from "./ScoreBadge";

export function ResumeRanking() {
  const { library, jd, selectedResumeId, selectResume } = useAppStore();

  const ranked = useMemo(() => {
    return library
      .map((entry) => ({
        entry,
        match: analyzeMatchHeuristic(entry.text, jd.jobDescription),
      }))
      .sort((a, b) => b.match.overallScore - a.match.overallScore);
  }, [library, jd.jobDescription]);

  // Recommend the top-ranked resume once per JD, overriding any stale
  // selection left over from adding/editing library entries. A manual
  // pick further down doesn't get fought because this only re-fires
  // when the JD text itself changes.
  const autoSelectedForJD = useRef<string | null>(null);
  useEffect(() => {
    if (ranked.length === 0) return;
    if (autoSelectedForJD.current !== jd.jobDescription) {
      autoSelectedForJD.current = jd.jobDescription;
      selectResume(ranked[0].entry.id);
    }
  }, [ranked, jd.jobDescription, selectResume]);

  if (library.length < 2) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-bold text-brand-900 mb-1">Best-fit resume</h3>
      <p className="text-xs text-slate-500 mb-4">
        Ranked by match to this job description. Pick a different one to tailor instead.
      </p>
      <div className="space-y-2">
        {ranked.map(({ entry, match }, i) => (
          <label
            key={entry.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-brand-100 cursor-pointer hover:border-brand-200 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="rankedResume"
                checked={selectedResumeId === entry.id}
                onChange={() => selectResume(entry.id)}
                className="text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="block text-sm font-semibold text-brand-900">
                  {entry.name}
                  {i === 0 && (
                    <span className="ml-2 text-xs font-medium text-brand-600">
                      Recommended
                    </span>
                  )}
                </span>
              </div>
            </div>
            <ScoreBadge label="Match" score={match.overallScore} size="sm" />
          </label>
        ))}
      </div>
    </div>
  );
}
