"use client";

import { useEffect, useState } from "react";
import { TabNavigation, type TabId } from "@/components/TabNavigation";
import { ProfileTab } from "@/components/ProfileTab";
import { JDTab } from "@/components/JDTab";
import { ResumeTab } from "@/components/ResumeTab";
import { ApplicationTrackerTab } from "@/components/ApplicationTrackerTab";
import { WorkspaceBackupModal } from "@/components/WorkspaceBackupModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import BulletBankModal from "@/components/BulletBankModal";
import { GeneralResumeOptimizer } from "@/components/GeneralResumeOptimizer";
import { useAppStore } from "@/lib/store";
import { Sparkles, PlayCircle, User, LayoutGrid, FileText } from "lucide-react";

const DEMO_RESUME = `Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan

SUMMARY
Results-driven Staff Software Engineer & AI Program Manager with 8+ years architecting high-throughput distributed systems, event-driven microservices, Generative AI models, and cloud modernizations.

EXPERIENCE
Staff Software Engineer & AI Lead | CloudScale Technologies | 2021 – Present
- Architected and deployed a multi-region event-streaming platform using Node.js, TypeScript, Kafka, and RAG pipelines, processing 50M daily transactions.
- Championed Generative AI CoE adoption across 10 engineering squads, optimizing cloud infrastructure costs by 40%.
- Led cross-functional squad of 12 engineers delivering enterprise GenAI features on schedule.

Senior Technical Program Manager | Apex Financial Systems | 2018 – 2021
- Spearheaded enterprise SaaS platform rollout across AWS cloud infrastructure, cutting API latency by 65%.
- Established agile OKR governance framework boosting delivery velocity by 30%.`;

const DEMO_JD = `Job Title: AI Transformation & Enterprise Program Manager
Company: Global Cognitive Solutions | Location: Remote / San Francisco

About the Role:
We are seeking an experienced AI Transformation & Program Manager to lead enterprise GenAI adoption, LLM integrations (OpenAI/Claude/Gemini), and cloud modernization roadmaps.

Responsibilities:
- Lead enterprise AI transformation initiatives and AI strategy roadmaps across business units.
- Architect Generative AI (GenAI), LLM, and intelligent automation pipelines using OpenAI, Claude, and Gemini with RAG.
- Manage enterprise program delivery, OKR governance, and executive stakeholder communications.
- Modernize legacy systems to cloud-native architectures (AWS/Azure/GCP).

Requirements:
- 6+ years in AI transformation, Technical Program Management (TPM), or digital modernization.
- Hands-on experience with GenAI, machine learning adoption, cloud migration, and agile delivery.`;

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("resume");
  const [appMode, setAppMode] = useState<"job-match" | "general-audit">("job-match");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showBulletBankModal, setShowBulletBankModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const { jd, profile, setProfileMode, setResumeText, setJobDescription } = useAppStore();

  // Ensure default demo data is populated on first load so users immediately see the Enhancv/ResumeWorded split-screen UI
  useEffect(() => {
    if (!profile.resumeText || profile.resumeText.trim().length < 20) {
      setProfileMode("resumeText");
      setResumeText(DEMO_RESUME);
    }
    if (!jd.jobDescription || jd.jobDescription.trim().length < 20) {
      setJobDescription(DEMO_JD);
    }
  }, [profile.resumeText, jd.jobDescription, setProfileMode, setResumeText, setJobDescription]);

  const handleRunDemo = () => {
    setAppMode("job-match");
    setProfileMode("resumeText");
    setResumeText(DEMO_RESUME);
    setJobDescription(DEMO_JD);
    setActiveTab("resume");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative selection:bg-indigo-600 selection:text-white pb-12">
      {/* Subtle ambient light glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Enhancv / ResumeWorded Top SaaS Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Platform Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm sm:text-base shadow-md shadow-indigo-200">
                RP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                    ResumePilot
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Next-Gen AI Workspace
                    </span>
                  </h1>
                </div>
                <p className="text-slate-500 font-semibold text-[11px] hidden sm:block">
                  Enhancv & ResumeWorded-Style Interactive AI Audit & A4 Studio
                </p>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
              {/* Workspace Mode Selector */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAppMode("job-match");
                    setActiveTab("resume");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    appMode === "job-match" && activeTab === "resume"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Split-Screen Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppMode("general-audit")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    appMode === "general-audit"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>General Optimizer</span>
                </button>
              </div>

              {/* 1-Click Demo Case */}
              <button
                type="button"
                onClick={handleRunDemo}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                title="Reset workspace with sample high-score resume & JD"
              >
                <PlayCircle className="w-4 h-4 text-amber-600" />
                <span>⚡ Reset Demo</span>
              </button>

              {/* Google Account Profile Switcher */}
              <button
                type="button"
                onClick={() => setShowUserProfileModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Google Account</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBulletBankModal(true)}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md font-bold"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">60-Bullet Bank</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Navigation Bar */}
        {appMode === "job-match" && (
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenBackupModal={() => setShowBackupModal(true)}
          />
        )}

        {/* Dynamic Workspace Container */}
        {appMode === "general-audit" ? (
          <GeneralResumeOptimizer />
        ) : (
          <>
            {activeTab === "resume" && (
              <ResumeTab onBack={() => setActiveTab("profile")} />
            )}

            {activeTab === "jd" && (
              <JDTab
                onBack={() => setActiveTab("profile")}
                onNext={() => setActiveTab("profile")}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab onNext={() => setActiveTab("resume")} />
            )}

            {activeTab === "tracker" && (
              <ApplicationTrackerTab
                onNavigateToTab={(tab) => setActiveTab(tab as TabId)}
              />
            )}
          </>
        )}

        <footer className="text-center text-xs text-slate-500 font-semibold pt-6 pb-8 no-print border-t border-slate-200 mt-8">
          ResumePilot Next-Gen AI Studio — Interactive Split-Screen Resume Checker & LaTeX PDF Compiler
        </footer>
      </div>

      <WorkspaceBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      <UserProfileModal
        isOpen={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
      />

      <BulletBankModal
        isOpen={showBulletBankModal}
        onClose={() => setShowBulletBankModal(false)}
        jdText={jd.jobDescription}
      />
    </main>
  );
}
