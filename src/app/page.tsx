"use client";

import { useState } from "react";
import { TabNavigation, type TabId } from "@/components/TabNavigation";
import { ProfileTab } from "@/components/ProfileTab";
import { JDTab } from "@/components/JDTab";
import { ResumeTab } from "@/components/ResumeTab";
import { ApplicationTrackerTab } from "@/components/ApplicationTrackerTab";
import { WorkspaceBackupModal } from "@/components/WorkspaceBackupModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showBackupModal, setShowBackupModal] = useState(false);

  return (
    <main className="min-h-screen bg-page-gradient">
      <header className="bg-header-gradient text-white shadow-lg shadow-brand-900/20 no-print">
        <div className="max-w-5xl mx-auto px-4 py-7 md:py-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-lg font-bold shadow-inner">
                RP
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  ResumePilot
                </h1>
                <p className="text-brand-100 text-xs md:text-sm">
                  AI Resume Tailoring, ATS Optimization & Interview Prep Suite
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowBackupModal(true)}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors border border-white/20"
              >
                💾 Backup Workspace
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
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

        <footer className="text-center text-xs text-brand-600/70 pt-4 pb-8 no-print">
          ResumePilot Suite — Review tailored documents before submission. Export to PDF, LaTeX, or Overleaf.
        </footer>
      </div>

      <WorkspaceBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />
    </main>
  );
}
