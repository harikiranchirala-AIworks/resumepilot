"use client";

import type { DiffItem } from "@/lib/types";

interface ResumeDiffViewerProps {
  diffItems?: DiffItem[];
  summary?: string;
}

export function ResumeDiffViewer({
  diffItems = [],
  summary = "",
}: ResumeDiffViewerProps) {
  const badgeStyle = (type: DiffItem["changeType"]) => {
    switch (type) {
      case "quantified":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
      case "keyword-injected":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-800/60";
      case "enhanced":
        return "bg-purple-950/60 text-purple-300 border-purple-800/60";
      case "added":
      default:
        return "bg-indigo-950/60 text-indigo-300 border-indigo-800/60";
    }
  };

  return (
    <div className="card space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <h3 className="text-base font-bold text-white">
            Tailoring Transformation & Diff Breakdown
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Detailed comparison showing how your raw experience was adapted to maximize ATS alignment and recruiter impact without falsification.
        </p>
      </div>

      {summary && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
            Strategy Summary
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">{summary}</p>
        </div>
      )}

      {diffItems.length === 0 ? (
        <p className="text-xs text-slate-500 italic">
          No specific bullet diff items were generated. See the full resume preview for the tailored output.
        </p>
      ) : (
        <div className="space-y-4">
          {diffItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm"
            >
              <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Transformation #{idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyle(
                    item.changeType
                  )}`}
                >
                  {item.changeType}
                </span>
              </div>

              <div className="p-4 grid md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                    Source / Raw Experience
                  </span>
                  <p className="text-slate-400 line-through decoration-slate-600">
                    {item.originalBullet}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                  <span className="font-semibold text-emerald-300 uppercase text-[10px] block">
                    ✓ Tailored & ATS-Optimized Bullet
                  </span>
                  <p className="text-emerald-200 font-medium leading-relaxed">
                    {item.tailoredBullet}
                  </p>
                </div>
              </div>

              {item.explanation && (
                <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800 text-[11px] text-slate-300">
                  <span className="font-semibold text-indigo-300">Rationale: </span>
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
