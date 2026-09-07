"use client";

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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  currentScreen,
  onSelectScreen,
  onOpenBulletBank,
  onOpenUserProfile,
  onOpenBackup,
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const { jd, result } = useAppStore();

  const navItems = [
    {
      id: "studio" as NavScreenId,
      label: "Interactive AI Studio",
      badge: "Split-Screen",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
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
        className={`w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 z-50 lg:z-30 shadow-xl lg:shadow-xs select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 1. Top Section: Platform Logo & User Card */}
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-200">
                RP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-base tracking-tight">ResumePilot</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">AI Resume & ATS Platform</p>
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
            className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-purple-50/60 border border-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AM
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Alex Morgan
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[140px]">
                    Cloud & Full Stack Lead
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
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
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold block truncate">{item.label}</span>
                    <span className={`text-xs block truncate font-medium ${isActive ? "text-indigo-100" : "text-slate-500"}`}>
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

        {/* 3. Bottom Section: Live ATS Readiness Dial & Quick Tools */}
        <div className="p-3.5 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {/* Live Radial Gauge Mini Card */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Target ATS Match</span>
              </div>
              <span className="text-xs font-black text-indigo-600">{matchScore}%</span>
            </div>

            {/* Sub progress bars */}
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 font-semibold mb-0.5">
                  <span>Google XYZ Impact</span>
                  <span className="font-bold text-slate-800">{impactScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${impactScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 font-semibold mb-0.5">
                  <span>Keywords Coverage</span>
                  <span className="font-bold text-slate-800">{keywordScore}%</span>
                </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${keywordScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tools Row */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={onOpenBulletBank}
            className="py-1.5 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">Bullet Bank</span>
          </button>

          <button
            type="button"
            onClick={onOpenBackup}
            className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">Backup</span>
          </button>
          </div>
        </div>
      </aside>
    </>
  );
}
