"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { PlayCircle, Target, Menu, Crown, Sparkles } from "lucide-react";
import { ProviderSelector } from "./ProviderSelector";
import { ThemeToggle } from "./ThemeToggle";

interface DynamicProgressHeaderProps {
  onRunDemo: () => void;
  activeScreenTitle: string;
  onToggleMobileSidebar?: () => void;
  onOpenProModal?: () => void;
  onOpenGoogleAuth?: () => void;
  onOpenUserProfile?: () => void;
  onOpenTour?: () => void;
}

export function DynamicProgressHeader({
  onRunDemo,
  activeScreenTitle,
  onToggleMobileSidebar,
  onOpenProModal,
  onOpenGoogleAuth,
  onOpenUserProfile,
  onOpenTour,
}: DynamicProgressHeaderProps) {
  const { jd, profile, result, isPro, user, freeTailorCredits } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeUser = mounted ? user : null;
  const activeIsPro = mounted ? isPro : false;

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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                Live Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Next-Gen AI Career Suite & Offer Acceleration Engine
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Account Cloud Sync Fast Trigger */}
          {activeUser ? (
            <button
              type="button"
              onClick={onOpenUserProfile}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-2xs text-xs font-bold cursor-pointer"
              title={`Google Cloud Sync Active (${activeUser.email})`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>{activeUser.name.split(" ")[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-2xs text-xs font-bold cursor-pointer"
              title="Sign in with Google to sync your workspaces"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Google Sign In</span>
            </button>
          )}

          <ProviderSelector />

          {/* 20-Second Guided Tour */}
          {onOpenTour && (
            <button
              type="button"
              onClick={onOpenTour}
              className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 text-xs font-bold cursor-pointer"
              title="Take the 20-second interactive guided tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>🚀 20s Tour</span>
            </button>
          )}

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

          {/* Trial / Pro Credit Status Pill */}
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer border ${
                activeIsPro
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : freeTailorCredits > 0
                  ? "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800"
                  : "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              }`}
              title={
                activeIsPro
                  ? "OfferCraft Pro is Active — Unlimited AI Tailors"
                  : freeTailorCredits > 0
                  ? "1 Free Full-Power AI Tailor Available"
                  : "Free Trial Used — Upgrade for Unlimited Tailors"
              }
            >
              {activeIsPro ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pro Active</span>
                </>
              ) : freeTailorCredits > 0 ? (
                <>
                  <span className="text-xs">🎁</span>
                  <span>1 Free Tailor</span>
                </>
              ) : (
                <>
                  <span className="text-xs">🔒</span>
                  <span>0 Credits (Upgrade)</span>
                </>
              )}
            </button>
          )}

          {/* Pro Upgrade Trigger (Only if not already Pro) */}
          {onOpenProModal && !activeIsPro && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs shadow-amber-200 dark:shadow-none"
              title="View Pro Membership & Pricing"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Multi-Step Animated Progress Bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 dark:from-slate-800/80 dark:via-cyan-950/40 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{statusText}</span>
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 font-black text-sm">{progressPercent}% Tailored</span>
        </div>

        {/* Dynamic Glow Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* 3 Step Milestones */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasJd ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              {hasJd ? "✓" : "1"}
            </span>
            <span className={hasJd ? "text-slate-900 dark:text-white font-bold" : ""}>Step 1: Role & JD</span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasProfile ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              {hasProfile ? "✓" : "2"}
            </span>
            <span className={hasProfile ? "text-slate-900 dark:text-white font-bold" : ""}>Step 2: Experience Bank</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${hasResult ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              {hasResult ? "✓" : "3"}
            </span>
            <span className={hasResult ? "text-slate-900 dark:text-white font-bold" : ""}>Step 3: Studio & LaTeX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
