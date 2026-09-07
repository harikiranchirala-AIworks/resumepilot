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
import { Sparkles, ArrowRight, PlayCircle, X } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showBulletBankModal, setShowBulletBankModal] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const { jd, setProfileMode, setResumeText, setJobDescription } = useAppStore();

  const handleRunDemo = () => {
    setProfileMode("resumeText");
    setResumeText(DEMO_RESUME);
    setJobDescription(DEMO_JD);
    setActiveTab("jd");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative selection:bg-indigo-600 selection:text-white pb-12">
      {/* Subtle ambient light glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Modern Light Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-md shadow-indigo-200">
                RP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                    ResumePilot
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      AI v1.3
                    </span>
                  </h1>
                </div>
                <p className="text-slate-500 font-medium text-[11px] sm:text-xs hidden sm:block">
                  AI Career Archetypes, ATS Match Engine & LaTeX Studio
                </p>
              </div>
            </div>

            {/* Header Action Tools & Demo Bar */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              {/* 1-Click Demo Trigger */}
              <button
                type="button"
                onClick={handleRunDemo}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                title="Populate sample resume & JD to see instant match results"
              >
                <PlayCircle className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
                <span>⚡ Try Demo Case</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBulletBankModal(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>60-Bullet Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBackupModal(true)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <span>💾</span>
                <span className="hidden sm:inline">Backup</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Welcome & Quick-Start Onboarding Banner */}
        {showWelcomeBanner && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg relative overflow-hidden animate-fadeIn border border-indigo-700">
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                    New User Guide
                  </span>
                  <span className="text-xs text-indigo-200 font-medium">Build a 90%+ ATS resume in 3 quick steps</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Welcome to ResumePilot AI Studio
                </h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  1. Paste your profile or click <strong>Upload/Paste</strong> $\rightarrow$ 2. Paste target Job Posting to see real-time <strong>Career Archetype Match</strong> $\rightarrow$ 3. Generate tailored LaTeX Resume, Cover Letter, and Interview Prep.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleRunDemo}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>⚡ Load Instant Demo Sample</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-indigo-200">Or start below with your own resume</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWelcomeBanner(false)}
                className="text-indigo-300 hover:text-white p-1 transition-colors"
                title="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenBackupModal={() => setShowBackupModal(true)}
        />

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

        <footer className="text-center text-xs text-slate-500 font-medium pt-6 pb-8 no-print border-t border-slate-200 mt-8">
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
