"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Sparkles,
  LayoutGrid,
  Target,
  User,
  MessageSquare,
  Share2,
  Kanban,
  FileText,
  ShieldCheck,
  Database,
  ChevronRight,
  TrendingUp,
  X,
  Crown,
  GraduationCap,
} from "lucide-react";

export type NavScreenId =
  | "studio"
  | "jd"
  | "profile"
  | "learning-hub"
  | "interview"
  | "linkedin"
  | "tracker"
  | "general";

interface AppSidebarProps {
  currentScreen: NavScreenId;
  onSelectScreen: (screen: NavScreenId) => void;
  onOpenBulletBank: () => void;
  onOpenUserProfile: () => void;
  onOpenGoogleAuth?: () => void;
  onOpenBackup: () => void;
  onOpenCopilot?: () => void;
  onOpenProModal?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  currentScreen,
  onSelectScreen,
  onOpenBulletBank,
  onOpenUserProfile,
  onOpenGoogleAuth,
  onOpenBackup,
  onOpenCopilot,
  onOpenProModal,
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const { jd, result, isPro, proPlan, user } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeUser = mounted ? user : null;
  const activeIsPro = mounted ? isPro : false;

  const coreWorkflowItems = [
    {
      id: "jd" as NavScreenId,
      label: "Target Role & JD",
      badge: "Step 1",
      icon: Target,
      description: "Archetypes, keywords & scraper",
    },
    {
      id: "profile" as NavScreenId,
      label: "Candidate Profile",
      badge: "Step 2",
      icon: User,
      description: "Master resume & experience bank",
    },
    {
      id: "studio" as NavScreenId,
      label: "Interactive AI Studio",
      badge: "Step 3",
      icon: LayoutGrid,
      description: "Live A4 sheet & inline AI toolbar",
    },
  ];

  const accelerationTools = [
    {
      id: "general" as NavScreenId,
      label: "ATS Resume Checker",
      badge: "Audit",
      icon: FileText,
      description: "Google XYZ bullet scoring",
    },
    {
      id: "linkedin" as NavScreenId,
      label: "LinkedIn Optimizer",
      badge: "SEO",
      icon: Share2,
      description: "5 headlines, bio & search tags",
    },
    {
      id: "interview" as NavScreenId,
      label: "STAR Interview Coach",
      badge: "Coach",
      icon: MessageSquare,
      description: "Role questions & STAR evaluator",
    },
    {
      id: "tracker" as NavScreenId,
      label: "Application Pipeline",
      badge: "Kanban",
      icon: Kanban,
      description: "Job status, salaries & dates",
    },
    {
      id: "learning-hub" as NavScreenId,
      label: "OfferCraft Academy",
      badge: "GenAI",
      icon: GraduationCap,
      description: "Real AI learning & interview bible",
    },
  ];

  const matchScore = result?.match?.overallScore ?? (jd.jobDescription.length > 50 ? 88 : 65);
  const impactScore = result?.match?.experienceMatch ?? 85;
  const keywordScore = result?.match?.keywordMatch ?? 90;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed lg:sticky top-0 left-0 z-50 lg:z-30 shadow-xl lg:shadow-none select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ── Top: Logo + User + Pro ─────────────────────────── */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          {/* Logo row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                    OfferCraft <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Craft Your Next Career Move</p>
              </div>
            </div>

            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User card */}
          {activeUser ? (
            <button
              type="button"
              onClick={onOpenUserProfile}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {activeUser.avatar ? (
                    <img
                      src={activeUser.avatar}
                      alt={activeUser.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {activeUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {activeUser.name}
                      </span>
                      <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                        {activeUser.targetRole || "Google Synced"}
                      </p>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => (onOpenGoogleAuth ? onOpenGoogleAuth() : onOpenUserProfile())}
              className="w-full p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block transition-colors">
                      Google Cloud Sync
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                      Sign in to sync & save
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-colors">
                  Sign In
                </span>
              </div>
            </button>
          )}

          {/* Pro banner */}
          {onOpenProModal && (
            !activeIsPro ? (
              <button
                type="button"
                onClick={() => { onOpenProModal(); onCloseMobile?.(); }}
                className="w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-left hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Upgrade to Pro</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                    56% Off
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-snug">
                  Unlimited tailorings, XYZ auto-fix & ZIP bundles.
                </p>
              </button>
            ) : (
              <div className="w-full p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                    {proPlan === "executive-lifetime" ? "Executive Lifetime" : "OfferCraft Pro"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { onOpenProModal(); onCloseMobile?.(); }}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0"
                >
                  Manage
                </button>
              </div>
            )
          )}
        </div>

        {/* ── Middle: Navigation ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Core Workflow */}
          <div className="space-y-0.5">
            <div className="px-2 pb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Core Workflow
              </span>
            </div>
            {coreWorkflowItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { onSelectScreen(item.id); onCloseMobile?.(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-2 border-indigo-600 dark:border-indigo-500"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/80 border-l-2 border-transparent"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-semibold block truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] block truncate font-medium ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}>
                      {item.description}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AI Acceleration Suite */}
          <div className="space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="px-2 pb-1.5 pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                AI Acceleration Suite
              </span>
            </div>
            {accelerationTools.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { onSelectScreen(item.id); onCloseMobile?.(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-2 border-indigo-600 dark:border-indigo-500"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/80 border-l-2 border-transparent"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-semibold block truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] block truncate font-medium ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}>
                      {item.description}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bottom: Copilot + ATS + Quick Tools ───────────── */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/60 dark:bg-slate-900/60">
          {/* AI Copilot button */}
          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => { onOpenCopilot(); onCloseMobile?.(); }}
              className="w-full p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold
                flex items-center justify-between transition-all shadow-sm shadow-indigo-500/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>AI Career Copilot</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-lg font-semibold">Chat 💬</span>
            </button>
          )}

          {/* ATS mini card */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Target ATS Match</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{matchScore}%</span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Google XYZ Impact", value: impactScore, color: "bg-emerald-500" },
                { label: "Keywords Coverage", value: keywordScore, color: "bg-indigo-600" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
                    <span>{bar.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{bar.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`${bar.color} h-full rounded-full transition-all duration-700`} style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tools */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onOpenBulletBank}
              className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700
                text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700
                text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Bullet Bank</span>
            </button>
            <button
              type="button"
              onClick={onOpenBackup}
              className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700
                text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700
                text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Database className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Backup</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
