"use client";

import { useAppStore } from "@/lib/store";
import { PlayCircle, Target, Menu, Crown } from "lucide-react";
import { ProviderSelector } from "./ProviderSelector";
import { ThemeToggle } from "./ThemeToggle";

interface DynamicProgressHeaderProps {
  onRunDemo: () => void;
  activeScreenTitle: string;
  onToggleMobileSidebar?: () => void;
  onOpenProModal?: () => void;
}

export function DynamicProgressHeader({
  onRunDemo,
  activeScreenTitle,
  onToggleMobileSidebar,
  onOpenProModal,
}: DynamicProgressHeaderProps) {
  const { jd, profile, result, isPro } = useAppStore();

  const hasJd = jd.jobDescription.trim().length > 30;
  const hasProfile = profile.resumeText.trim().length > 30;
  const hasResult = Boolean(result);

  let progressPercent = 0;
  let statusText = "Ready to Tailor — Paste Job Description to Start";
  if (hasResult) {
    progressPercent = 100;
    statusText = "Application Suite Complete — Tailored Resume, Cover Letter & Interview Kit Ready";
  } else if (hasProfile && hasJd) {
    progressPercent = 75;
    statusText = "Candidate Profile & Target JD Aligned — Ready for 1-Click AI Generation";
  } else if (hasJd) {
    progressPercent = 40;
    statusText = "Job Description Analyzed — Review Candidate Profile Match";
  } else if (hasProfile) {
    progressPercent = 30;
    statusText = "Profile Loaded — Provide Target Job Posting to Run Match";
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sm:px-8 space-y-3.5 shadow-2xs transition-colors duration-200">
      {/* Top Bar: Title, Engine & Demo Case */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeScreenTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Live Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Next-Gen AI Resume Checker & Multi-Track Career Tailoring
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ProviderSelector />

          {/* 1-Click Demo Trigger */}
          <button
            type="button"
            onClick={onRunDemo}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 text-xs dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            title="Pre-populate full high-score case to test all features"
          >
            <PlayCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>⚡ Try Demo Case</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* Pro Upgrade Trigger */}
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isPro
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs shadow-amber-200 dark:shadow-none"
              }`}
              title="View Pro Membership & Pricing"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{isPro ? "Pro Active" : "Upgrade"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Multi-Step Animated Progress Bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{statusText}</span>
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{progressPercent}% Tailored</span>
        </div>

        {/* Dynamic Glow Bar */}
        <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* 3 Step Milestones */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasJd ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
              {hasJd ? "✓" : "1"}
            </span>
            <span className={hasJd ? "text-slate-900 font-bold" : ""}>Target JD Analyzed</span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasProfile ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
              {hasProfile ? "✓" : "2"}
            </span>
            <span className={hasProfile ? "text-slate-900 font-bold" : ""}>Profile Matched</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasResult ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
              {hasResult ? "✓" : "3"}
            </span>
            <span className={hasResult ? "text-slate-900 font-bold" : ""}>Tailored & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
