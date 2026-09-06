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
    <div className="card space-y-3">
      <div>
        <h3 className="text-sm font-bold text-white mb-0.5">Best-Fit Candidate Resume</h3>
        <p className="text-xs text-slate-400">
          Ranked automatically by ATS match to this job description. Select any profile below to tailor.
        </p>
      </div>

      <div className="space-y-2">
        {ranked.map(({ entry, match }, i) => (
          <label
            key={entry.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer hover:border-slate-700 has-[:checked]:border-cyan-500/60 has-[:checked]:bg-cyan-950/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="rankedResume"
                checked={selectedResumeId === entry.id}
                onChange={() => selectResume(entry.id)}
                className="text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
              />
              <div>
                <span className="block text-xs font-semibold text-slate-200">
                  {entry.name}
                  {i === 0 && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                      Top Match
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
