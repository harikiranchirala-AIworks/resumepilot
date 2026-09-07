"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { PlayCircle, Menu, Crown, Sparkles, ChevronRight } from "lucide-react";
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
  const activeCredits = mounted ? freeTailorCredits : 1;

  const hasJd = jd.jobDescription.trim().length > 30;
  const hasProfile = profile.resumeText.trim().length > 30;
  const hasResult = Boolean(result);

  let progressPercent = 0;
  if (hasResult) {
    progressPercent = 100;
  } else if (hasProfile && hasJd) {
    progressPercent = 75;
  } else if (hasJd) {
    progressPercent = 40;
  } else if (hasProfile) {
    progressPercent = 30;
  }

  // Derive a short breadcrumb label from the full screen title
  const breadcrumb = activeScreenTitle.replace(/^Step \d+: /, "").replace(/ & LaTeX Export$/, "").replace(/ \(.*\)$/, "");

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors duration-200">
      {/* Slim progress indicator bar at very top */}
      <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-700 rounded-full"
          style={{ width: `${Math.max(progressPercent === 0 ? 0 : 8, progressPercent)}%` }}
        />
      </div>

      {/* Main header row */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-3">
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm min-w-0">
            <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:block shrink-0">
              OfferCraft AI
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{breadcrumb}</span>
          </nav>
        </div>

        {/* Right: action controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Provider selector */}
          <div className="hidden md:block">
            <ProviderSelector />
          </div>

          {/* Tour button */}
          {onOpenTour && (
            <button
              type="button"
              onClick={onOpenTour}
              className="btn-ghost hidden sm:inline-flex text-xs px-3 py-1.5"
              title="Take the 20-second interactive guided tour"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tour</span>
            </button>
          )}

          {/* Demo button */}
          <button
            type="button"
            onClick={onRunDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
              bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200
              dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800
              transition-all active:scale-95"
            title="Pre-populate demo case to test all features"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Demo</span>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Credit / Pro pill */}
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeIsPro
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : activeCredits > 0
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                  : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
              }`}
            >
              {activeIsPro ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pro</span>
                </>
              ) : activeCredits > 0 ? (
                <>
                  <span>🎁</span>
                  <span className="hidden sm:inline">1 Free Tailor</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span className="hidden sm:inline">Upgrade</span>
                </>
              )}
            </button>
          )}

          {/* Upgrade CTA when not pro */}
          {onOpenProModal && !activeIsPro && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 shadow-sm shadow-indigo-500/20"
            >
              <Crown className="w-3.5 h-3.5 text-indigo-200" />
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          )}

          {/* Google user / sign-in */}
          {activeUser ? (
            <button
              type="button"
              onClick={onOpenUserProfile}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-700
                hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium text-slate-700 dark:text-slate-200"
              title={`Signed in as ${activeUser.email}`}
            >
              {activeUser.avatar ? (
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-7 h-7 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {activeUser.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block truncate max-w-[80px] text-xs">{activeUser.name.split(" ")[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700
                hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-step milestone strip */}
      <div className="px-4 sm:px-6 pb-3 hidden sm:block">
        <div className="flex items-center gap-1">
          {[
            { label: "Role & JD", done: hasJd, step: 1 },
            { label: "Experience Bank", done: hasProfile, step: 2 },
            { label: "AI Studio", done: hasResult, step: 3 },
          ].map((item, idx) => (
            <div key={item.step} className="flex items-center gap-1">
              {idx > 0 && (
                <div className={`h-px w-6 sm:w-10 rounded-full transition-all duration-500 ${item.done || (idx === 1 && hasJd) || (idx === 2 && hasProfile) ? "bg-indigo-300" : "bg-slate-200 dark:bg-slate-700"}`} />
              )}
              <div className={`flex items-center gap-1.5 text-xs font-medium transition-all ${item.done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                  item.done
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}>
                  {item.done ? "✓" : item.step}
                </span>
                <span className="hidden md:block">{item.label}</span>
              </div>
            </div>
          ))}
          <div className="ml-auto text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {progressPercent}% Complete
          </div>
        </div>
      </div>
    </header>
  );
}
