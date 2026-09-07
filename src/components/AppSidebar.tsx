"use client";

import Image from "next/image";
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
} from "lucide-react";

export type NavScreenId =
  | "studio"
  | "jd"
  | "profile"
  | "interview"
  | "linkedin"
  | "tracker"
  | "general";

interface AppSidebarProps {
  currentScreen: NavScreenId;
  onSelectScreen: (screen: NavScreenId) => void;
  onOpenBulletBank: () => void;
  onOpenUserProfile: () => void;
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
  onOpenBackup,
  onOpenCopilot,
  onOpenProModal,
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const { jd, result, isPro, proPlan } = useAppStore();

  const navItems = [
    {
      id: "studio" as NavScreenId,
      label: "Interactive AI Studio",
      badge: "Split-Screen",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: LayoutGrid,
      description: "Live A4 sheet & inline AI toolbar",
    },
    {
      id: "jd" as NavScreenId,
      label: "Target Role & JD",
      badge: "Step 1",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: Target,
      description: "Archetypes, keywords & URL scraper",
    },
    {
      id: "profile" as NavScreenId,
      label: "Candidate Profile",
      badge: "Step 2",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: User,
      description: "Master resume & experience bank",
    },
    {
      id: "interview" as NavScreenId,
      label: "STAR Interview Coach",
      badge: "AI Practice",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: MessageSquare,
      description: "Role questions & STAR evaluator",
    },
    {
      id: "linkedin" as NavScreenId,
      label: "LinkedIn Optimizer",
      badge: "Recruiter SEO",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Share2,
      description: "5 headlines, bio & search tags",
    },
    {
      id: "tracker" as NavScreenId,
      label: "Application Pipeline",
      badge: "Kanban",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Kanban,
      description: "Job status, salaries & dates",
    },
    {
      id: "general" as NavScreenId,
      label: "General Resume Optimizer",
      badge: "Standalone",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      icon: FileText,
      description: "Google XYZ bullet audit (No JD)",
    },
  ];

  // Dynamic calculations
  const matchScore = result?.match?.overallScore ?? (jd.jobDescription.length > 50 ? 88 : 65);
  const impactScore = result?.match?.experienceMatch ?? 85;
  const keywordScore = result?.match?.keywordMatch ?? 90;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 z-50 lg:z-30 shadow-xl lg:shadow-xs select-none transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 1. Top Section: Platform Logo & User Card */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/offercraft-logo.png"
                alt="OfferCraft AI"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 shadow-md shadow-cyan-500/20 border border-cyan-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                    OfferCraft <span className="text-cyan-600 dark:text-cyan-400">AI</span>
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">Craft Your Next Career Move</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Candidate Persona Card with Google Cloud Sync */}
          <div
            onClick={onOpenUserProfile}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-50/80 via-slate-50 to-teal-50/60 dark:from-slate-800/80 dark:via-slate-900/60 dark:to-cyan-950/30 border border-cyan-100/80 dark:border-cyan-900/40 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AM
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      Alex Morgan
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">
                    Cloud & Full Stack Lead
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Pro Membership Banner */}
          {onOpenProModal && (
            <div>
              {!isPro ? (
                <button
                  type="button"
                  onClick={() => {
                    onOpenProModal();
                    onCloseMobile?.();
                  }}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cyan-500/20 to-teal-500/15 dark:from-amber-950/50 dark:via-cyan-950/40 dark:to-slate-900/60 border border-amber-400/50 dark:border-amber-600/60 text-left hover:border-cyan-500 transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">Upgrade to Pro</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                      56% Off
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                    Unlimited AI tailorings, Google XYZ auto-fix & ZIP packets.
                  </p>
                </button>
              ) : (
                <div className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-300 truncate">
                      {proPlan === "executive-lifetime" ? "Executive Lifetime" : "OfferCraft Pro"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProModal();
                      onCloseMobile?.();
                    }}
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-bold shrink-0 cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Middle Section: Vertical Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Workspace Modules
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectScreen(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold block truncate">{item.label}</span>
                    <span className={`text-xs block truncate font-medium ${isActive ? "text-cyan-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {item.description}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                    isActive ? "bg-white/20 text-white border-white/30" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Bottom Section: AI Copilot & Live ATS Readiness Dial */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          {/* AI Career Copilot Fast Trigger */}
          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => {
                onOpenCopilot();
                onCloseMobile?.();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-slate-900 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 border border-cyan-400/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span className="tracking-wide">AI Career Copilot</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md text-white font-bold">
                Chat 💬
              </span>
            </button>
          )}

          {/* Live Radial Gauge Mini Card */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Target ATS Match</span>
              </div>
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{matchScore}%</span>
            </div>

            {/* Sub progress bars */}
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-0.5">
                  <span>Google XYZ Impact</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{impactScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${impactScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-0.5">
                  <span>Keywords Coverage</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{keywordScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${keywordScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tools Row */}
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={onOpenBulletBank}
              className="py-1.5 px-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px]">Bullet Bank</span>
            </button>

            <button
              type="button"
              onClick={onOpenBackup}
              className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-[11px]">Backup</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
