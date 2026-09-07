"use client";

import { useEffect, useState } from "react";
import { AppSidebar, type NavScreenId } from "@/components/AppSidebar";
import { DynamicProgressHeader } from "@/components/DynamicProgressHeader";
import { ProfileTab } from "@/components/ProfileTab";
import { JDTab } from "@/components/JDTab";
import { ResumeTab } from "@/components/ResumeTab";
import { InterviewPrepTab } from "@/components/InterviewPrepTab";
import { LinkedInOptimizerTab } from "@/components/LinkedInOptimizerTab";
import { ApplicationTrackerTab } from "@/components/ApplicationTrackerTab";
import { WorkspaceBackupModal } from "@/components/WorkspaceBackupModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import BulletBankModal from "@/components/BulletBankModal";
import { GeneralResumeOptimizer } from "@/components/GeneralResumeOptimizer";
import { useAppStore } from "@/lib/store";

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

const SCREEN_TITLES: Record<NavScreenId, string> = {
  studio: "Interactive AI Studio (Enhancv / Worded)",
  jd: "Target Role & Job Description Intelligence",
  profile: "Master Candidate Profile & Experience Bank",
  interview: "AI STAR Interview Practice & Coach Studio",
  linkedin: "LinkedIn Profile Auto-Optimizer (Recruiter SEO)",
  tracker: "Application Pipeline & Offer Tracker",
  general: "General Resume Optimizer (Google XYZ Audit)",
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<NavScreenId>("studio");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showBulletBankModal, setShowBulletBankModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const { jd, profile, setProfileMode, setResumeText, setJobDescription } = useAppStore();

  // Populate default demo data on first load so users immediately see the Enhancv/ResumeWorded split-screen UI
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
    setProfileMode("resumeText");
    setResumeText(DEMO_RESUME);
    setJobDescription(DEMO_JD);
    setCurrentScreen("studio");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-row relative selection:bg-indigo-600 selection:text-white">
      {/* 1. Left Vertical Navigation Sidebar */}
      <AppSidebar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          setMobileSidebarOpen(false);
        }}
        onOpenBulletBank={() => setShowBulletBankModal(true)}
        onOpenUserProfile={() => setShowUserProfileModal(true)}
        onOpenBackup={() => setShowBackupModal(true)}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Right Main Application Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Dynamic Progress & Milestone Header */}
        <DynamicProgressHeader
          onRunDemo={handleRunDemo}
          activeScreenTitle={SCREEN_TITLES[currentScreen]}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Active Module Canvas */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
          {currentScreen === "studio" && (
            <ResumeTab onBack={() => setCurrentScreen("profile")} />
          )}

          {currentScreen === "jd" && (
            <JDTab
              onBack={() => setCurrentScreen("studio")}
              onNext={() => setCurrentScreen("profile")}
            />
          )}

          {currentScreen === "profile" && (
            <ProfileTab onNext={() => setCurrentScreen("studio")} />
          )}

          {currentScreen === "interview" && (
            <InterviewPrepTab />
          )}

          {currentScreen === "linkedin" && (
            <LinkedInOptimizerTab />
          )}

          {currentScreen === "tracker" && (
            <ApplicationTrackerTab
              onNavigateToTab={(tab) => {
                if (tab === "resume") setCurrentScreen("studio");
                else if (tab === "jd") setCurrentScreen("jd");
                else if (tab === "profile") setCurrentScreen("profile");
                else if (tab === "tracker") setCurrentScreen("tracker");
              }}
            />
          )}

          {currentScreen === "general" && (
            <GeneralResumeOptimizer />
          )}
        </main>

        <footer className="text-center text-xs text-slate-500 font-semibold py-6 border-t border-slate-200 mt-auto no-print">
          ResumePilot AI Suite — Next-Gen Commercial Career Tailoring Platform
        </footer>
      </div>

      {/* Persistent Modals */}
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
    </div>
  );
}
