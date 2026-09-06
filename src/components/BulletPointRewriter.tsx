"use client";

import { useState } from "react";
import type { BulletRewriteOption } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export function BulletPointRewriter() {
  const { jd, preferredProvider } = useAppStore();
  const [bulletText, setBulletText] = useState("");
  const [options, setOptions] = useState<BulletRewriteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRewrite = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletText: bulletText.trim(),
          jobDescription: jd.jobDescription,
          preferredProvider,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOptions(data.options || []);
      }
    } catch (err) {
      console.error("Rewrite bullet error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <h3 className="text-base font-bold text-brand-900">
            Bullet Point Optimizer (Google XYZ Formula)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Paste any resume bullet point to instantly rewrite it with action verbs, quantifiable impact, and ATS keywords.
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          rows={3}
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
          placeholder="e.g., Led the migration of databases to AWS cloud and made the system faster..."
          className="input-field text-xs leading-relaxed"
        />
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Formula: Accomplished [X] as measured by [Y], by doing [Z]
          </span>
          <button
            type="button"
            onClick={handleRewrite}
            disabled={loading || !bulletText.trim()}
            className="btn-primary text-xs py-2 px-4"
          >
            {loading ? "Optimizing..." : "⚡ Optimize Bullet"}
          </button>
        </div>
      </div>

      {options.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-brand-100">
          <p className="text-xs font-bold text-brand-900 uppercase tracking-wider">
            Optimized Variations
          </p>
          {options.map((opt, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-brand-100 bg-white shadow-2xs hover:border-brand-300 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {opt.style === "xyz-impact"
                    ? "🏆 Google XYZ Impact"
                    : opt.style === "action-focused"
                    ? "🚀 Action & Leadership"
                    : "⚡ High-Density Concise"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(opt.text, i)}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold"
                >
                  {copiedIndex === i ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {opt.text}
              </p>
              {opt.rationale && (
                <p className="text-[11px] text-slate-500 italic">
                  Why: {opt.rationale}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
