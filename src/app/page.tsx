"use client";

import { useState } from "react";
import { TabNavigation, type TabId } from "@/components/TabNavigation";
import { ProfileTab } from "@/components/ProfileTab";
import { JDTab } from "@/components/JDTab";
import { ResumeTab } from "@/components/ResumeTab";
import { ApplicationTrackerTab } from "@/components/ApplicationTrackerTab";
import { WorkspaceBackupModal } from "@/components/WorkspaceBackupModal";
import BulletBankModal from "@/components/BulletBankModal";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showBulletBankModal, setShowBulletBankModal] = useState(false);
  const { jd } = useAppStore();

  return (
    <main className="min-h-screen bg-page-gradient text-slate-100 relative selection:bg-indigo-500 selection:text-white pb-12">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 left-1/2 -translate-x-1/2 w-[700px] h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80 shadow-2xl no-print">
        <div className="max-w-6xl mx-auto px-4 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-glow-indigo">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-300 text-sm sm:text-base">
                  RP
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    ResumePilot
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI v1.3
                    </span>
                  </h1>
                </div>
                <p className="text-slate-400 text-[11px] sm:text-xs hidden sm:block">
                  AI Career Archetypes, ATS Match Engine & LaTeX Studio
                </p>
              </div>
            </div>

            {/* AI Status & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-emerald-300">Live AI Engine Active</span>
              </div>

              <button
                type="button"
                onClick={() => setShowBulletBankModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all border border-indigo-400/40 flex items-center gap-1.5 shadow-glow-indigo active:scale-95"
              >
                💎 <span className="hidden sm:inline">60-Bullet Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBackupModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold transition-all border border-slate-700/80 hover:border-slate-600 flex items-center gap-1.5 active:scale-95"
              >
                💾 <span className="hidden sm:inline">Backup</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <div className="no-print">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenBackupModal={() => setShowBackupModal(true)}
          />
        </div>

        {activeTab === "profile" && (
          <ProfileTab onNext={() => setActiveTab("jd")} />
        )}

        {activeTab === "jd" && (
          <JDTab
            onBack={() => setActiveTab("profile")}
            onNext={() => setActiveTab("resume")}
          />
        )}

        {activeTab === "resume" && (
          <ResumeTab onBack={() => setActiveTab("jd")} />
        )}

        {activeTab === "tracker" && (
          <ApplicationTrackerTab
            onNavigateToTab={(tab) => setActiveTab(tab as TabId)}
          />
        )}

        <footer className="text-center text-xs text-slate-500 pt-6 pb-8 no-print border-t border-slate-900/60 mt-8">
          ResumePilot Suite — Review tailored documents before submission. Export to PDF, LaTeX, or Overleaf.
        </footer>
      </div>

      <WorkspaceBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      <BulletBankModal
        isOpen={showBulletBankModal}
        onClose={() => setShowBulletBankModal(false)}
        jdText={jd.jobDescription}
      />
    </main>
  );
}
