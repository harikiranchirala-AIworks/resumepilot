"use client";

function scoreTheme(score: number): { ring: string; text: string; bg: string } {
  if (score >= 80) {
    return {
      ring: "border-emerald-500 shadow-glow-emerald",
      text: "text-emerald-400",
      bg: "bg-emerald-950/40",
    };
  }
  if (score >= 65) {
    return {
      ring: "border-cyan-500 shadow-glow-cyan",
      text: "text-cyan-400",
      bg: "bg-cyan-950/40",
    };
  }
  if (score >= 50) {
    return {
      ring: "border-amber-500 shadow-sm",
      text: "text-amber-400",
      bg: "bg-amber-950/40",
    };
  }
  return {
    ring: "border-rose-500 shadow-sm",
    text: "text-rose-400",
    bg: "bg-rose-950/40",
  };
}

interface ScoreBadgeProps {
  label: string;
  score: number;
  size?: "sm" | "lg";
}

export function ScoreBadge({ label, score, size = "lg" }: ScoreBadgeProps) {
  const theme = scoreTheme(score);
  const ringSize =
    size === "lg"
      ? "h-20 w-20 text-2xl"
      : "h-14 w-14 text-lg";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex ${ringSize} items-center justify-center rounded-2xl border-2 font-black transition-all ${theme.ring} ${theme.text} ${theme.bg}`}
      >
        <span>{score}</span>
        <span className="text-[10px] font-normal text-slate-400 self-end mb-2">%</span>
      </div>
      <span className="text-xs font-semibold text-slate-300 text-center max-w-[100px] leading-tight">
        {label}
      </span>
    </div>
  );
}
