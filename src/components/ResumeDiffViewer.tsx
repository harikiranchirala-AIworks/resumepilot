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
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "keyword-injected":
        return "bg-brand-100 text-brand-800 border-brand-200";
      case "enhanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "added":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="card space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <h3 className="text-base font-bold text-brand-900">
            Tailoring Transformation & Diff Breakdown
          </h3>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Detailed comparison showing how your raw experience was adapted to maximize ATS alignment and recruiter impact without falsification.
        </p>
      </div>

      {summary && (
        <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100">
          <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">
            Strategy Summary
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
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
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">
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
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 uppercase text-[10px] block">
                    Source / Raw Experience
                  </span>
                  <p className="text-slate-700 line-through decoration-slate-400">
                    {item.originalBullet}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-semibold text-emerald-800 uppercase text-[10px] block">
                    ✓ Tailored & ATS-Optimized Bullet
                  </span>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    {item.tailoredBullet}
                  </p>
                </div>
              </div>

              {item.explanation && (
                <div className="px-4 py-2 bg-brand-50/40 border-t border-brand-100/50 text-[11px] text-brand-800">
                  <span className="font-semibold">Rationale: </span>
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
