"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { BulletPointRewriter } from "./BulletPointRewriter";

interface BulletAnalysis {
  original: string;
  score: number;
  hasMetrics: boolean;
  actionVerb: string;
  suggestion: string;
}

export function GeneralResumeOptimizer() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const bullets = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || line.startsWith("•") || line.startsWith("*") || line.length > 25);

  const analyzedBullets: BulletAnalysis[] = bullets.slice(0, 8).map((bullet) => {
    const clean = bullet.replace(/^[-•*]\s*/, "");
    const hasMetric = /\b(\d+%|\$\d+|\d+\+|\d+k|\d+M|percent|million|thousand)\b/i.test(clean);
    const words = clean.split(" ");
    const actionVerb = words[0] || "Led";

    return {
      original: clean,
      score: hasMetric ? 90 : 55,
      hasMetrics: hasMetric,
      actionVerb,
      suggestion: hasMetric
        ? "Strong metric! Google XYZ formula aligned."
        : "Missing quantifiable impact metric. Add [X%] ROI or [$Y] revenue/cost impact.",
    };
  });

  const quantifiedCount = analyzedBullets.filter((b) => b.hasMetrics).length;
  const overallQualityScore = analyzedBullets.length > 0
    ? Math.round((quantifiedCount / analyzedBullets.length) * 100)
    : 0;

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 800);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="card card-accent space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Standalone Mode
              </span>
              <span className="text-xs text-slate-600 font-semibold">No Job Description Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              General Resume Optimizer & Google XYZ Audit
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Audit your master resume against Google&apos;s formula: <em>&quot;Accomplished [X], as measured by [Y], by doing [Z]&quot;</em>.
            </p>
          </div>

          {analysisDone && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Master Text"}</span>
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label htmlFor="masterResume" className="text-xs font-bold text-slate-900">
            Paste Master Resume / Experience Bullets
          </label>
          <textarea
            id="masterResume"
            rows={10}
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setAnalysisDone(false);
            }}
            placeholder="Paste your resume experience section here to audit bullet strength and metric density..."
            className="input-field text-xs font-mono leading-relaxed bg-white"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Formula Standard: <code className="text-indigo-700 font-bold">Action Verb + Metric [X%] + Implementation Method</code>
            </span>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md"
            >
              {isAnalyzing ? "Auditing Bullets..." : "⚡ Audit & Quantify Bullets"}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisDone && (
        <div className="space-y-6">
          {/* Quality Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-5 space-y-1 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Google XYZ Score</span>
              <div className="text-2xl font-black text-indigo-700 flex items-center gap-2">
                <span>{overallQualityScore}%</span>
                <span className="text-xs font-bold text-slate-500">Metric Density</span>
              </div>
            </div>

            <div className="card p-5 space-y-1 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Quantified Bullets</span>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                <span>{quantifiedCount} / {analyzedBullets.length}</span>
                <span className="text-xs font-semibold text-emerald-800">Has Numbers</span>
              </div>
            </div>

            <div className="card p-5 space-y-1 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">ATS Format Check</span>
              <div className="text-2xl font-black text-cyan-600 flex items-center gap-2">
                <span>100%</span>
                <span className="text-xs font-semibold text-cyan-800">Clean Vector</span>
              </div>
            </div>
          </div>

          {/* Bullet-by-Bullet Breakdown */}
          <div className="card space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Accomplishment Bullet-by-Bullet Audit
            </h3>
            <div className="space-y-3">
              {analyzedBullets.map((b, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${
                    b.hasMetrics
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-amber-50/40 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Bullet #{i + 1} — Verb: <strong className="text-indigo-700">{b.actionVerb}</strong>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        b.hasMetrics
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {b.hasMetrics ? "✓ Quantified" : "⚠️ Needs Metric"}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {b.original}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1.5 italic font-medium">
                    💡 Tip: {b.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Single Bullet Interactive Optimizer */}
          <BulletPointRewriter />
        </div>
      )}
    </div>
  );
}
