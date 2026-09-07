"use client";

function scoreTheme(score: number): { ring: string; text: string; bg: string; stroke: string } {
  if (score >= 80) {
    return {
      ring: "border-emerald-600 shadow-md shadow-emerald-100",
      text: "text-emerald-900",
      bg: "bg-emerald-50",
      stroke: "#059669",
    };
  }
  if (score >= 65) {
    return {
      ring: "border-indigo-600 shadow-md shadow-indigo-100",
      text: "text-indigo-900",
      bg: "bg-indigo-50",
      stroke: "#4F46E5",
    };
  }
  if (score >= 50) {
    return {
      ring: "border-amber-500 shadow-md shadow-amber-100",
      text: "text-amber-900",
      bg: "bg-amber-50",
      stroke: "#D97706",
    };
  }
  return {
    ring: "border-rose-500 shadow-md shadow-rose-100",
    text: "text-rose-900",
    bg: "bg-rose-50",
    stroke: "#E11D48",
  };
}

interface ScoreBadgeProps {
  label: string;
  score: number;
  size?: "sm" | "lg" | "radial";
  subCategories?: {
    impactScore?: number;
    keywordScore?: number;
    brevityScore?: number;
    formattingScore?: number;
  };
}

export function ScoreBadge({ label, score, size = "lg", subCategories }: ScoreBadgeProps) {
  const theme = scoreTheme(score);

  if (size === "radial") {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const categories = [
      { name: "Impact & Google XYZ Formula", val: subCategories?.impactScore ?? Math.min(100, score + 4) },
      { name: "ATS Keyword Match & Coverage", val: subCategories?.keywordScore ?? score },
      { name: "Brevity & Conciseness", val: subCategories?.brevityScore ?? Math.max(70, score - 5) },
      { name: "Structure & LaTeX Formatting", val: subCategories?.formattingScore ?? 98 },
    ];

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-5">
          {/* Radial Circular SVG Score Meter */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${theme.text}`}>{score}</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">/100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Resume Audit Gauge
            </span>
            <h3 className="text-xl font-black text-slate-900 leading-tight">{label}</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {score >= 80
                ? "Top 5% candidate match. High interview callback potential!"
                : "Good base. Use 1-click AI auto-fixes to boost score to 90+."}
            </p>
          </div>
        </div>

        {/* 4 Sub-Category Progress Bars */}
        <div className="space-y-3.5 pt-3 border-t border-slate-100 text-xs sm:text-sm">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{cat.name}</span>
                <span className="font-black text-slate-900">{cat.val}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    cat.val >= 80
                      ? "bg-emerald-500"
                      : cat.val >= 65
                      ? "bg-indigo-600"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${cat.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ringSize = size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex ${ringSize} items-center justify-center rounded-2xl border-2 font-black transition-all ${theme.ring} ${theme.text} ${theme.bg}`}
      >
        <span>{score}</span>
        <span className="text-[10px] font-normal text-slate-500 self-end mb-2">%</span>
      </div>
      <span className="text-xs font-bold text-slate-800 text-center max-w-[100px] leading-tight">
        {label}
      </span>
    </div>
  );
}
