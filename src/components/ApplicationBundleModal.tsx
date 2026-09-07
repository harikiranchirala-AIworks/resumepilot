"use client";

import { useState } from "react";
import {
  X,
  Download,
  CheckCircle2,
  FileText,
  Mail,
  HelpCircle,
  MessageSquare,
  Sparkles,
  RefreshCw,
  FolderArchive,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { downloadApplicationBundle, ApplicationBundleData } from "@/lib/exportBundle";

interface ApplicationBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationBundleModal({ isOpen, onClose }: ApplicationBundleModalProps) {
  const { result, user, jd } = useAppStore();
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const candidateName = user?.name?.trim() || "Candidate";
  const roleTitle = jd.jobDescription.match(/Job Title:\s*([^\n]+)/i)?.[1]?.trim() || user?.targetRole || "Target Role";
  const companyName = jd.jobDescription.match(/Company:\s*([^\n|]+)/i)?.[1]?.trim() || "Target Enterprise";

  const bundleFiles = [
    {
      name: "01_Tailored_Resume.doc",
      desc: "Fully formatted Word (.docx compatible) document with 0.75-inch margins and tabbed dates",
      icon: FileText,
      badge: "Word DOC",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      name: "01_Tailored_Resume_ATS.txt",
      desc: "Clean plain-text version optimized for aggressive ATS parsers (Workday, Taleo, Greenhouse)",
      icon: FileText,
      badge: "ATS Clean",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      name: "02_Tailored_Cover_Letter.doc",
      desc: "Custom cover letter matching the target role with hook paragraphs and quantifiable achievements",
      icon: Mail,
      badge: "Cover Letter",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      name: "03_STAR_Interview_CheatSheet.txt",
      desc: "Predicted behavioral & technical questions with model Situation-Task-Action-Result responses",
      icon: HelpCircle,
      badge: "STAR Prep",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      name: "04_Recruiter_Outreach_InMail.txt",
      desc: "3 high-converting cold outreach templates for Hiring Managers, Internal Recruiters, and Referrals",
      icon: MessageSquare,
      badge: "InMail Outreach",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    },
    {
      name: "README_Application_Strategy.txt",
      desc: "Submission timeline checklist, follow-up cadence, and interview readiness recommendations",
      icon: CheckCircle2,
      badge: "Strategy Guide",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
  ];

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const bundleData: ApplicationBundleData = {
        candidateName,
        roleTitle,
        companyName,
        resumeData: {
          name: candidateName,
          title: roleTitle,
          email: "alex.morgan@example.com",
          phone: "(555) 019-2834",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/alexmorgan",
          summary:
            "Results-driven Cloud & Full Stack Solutions Engineer with 7+ years of experience designing high-throughput microservices, optimizing AWS cloud infrastructure, and automating CI/CD pipelines.",
          experience: [
            {
              role: roleTitle,
              company: companyName,
              period: "2021 — Present",
              location: "San Francisco, CA",
              bullets: [
                "Managed cross-functional engineering teams to launch cloud microservices platform, improving system throughput by 42% and reducing latency by 85ms across 12M daily requests.",
                "Spearheaded migration of legacy monolithic system to AWS serverless architecture, slashing cloud Infrastructure costs by $180,000 annually.",
                "Implemented automated CI/CD pipeline using GitHub Actions, Kubernetes, and Terraform, reducing release cycle time by 65%.",
              ],
            },
          ],
          skills: [
            { category: "Languages & Web", items: "TypeScript, Python, React, Next.js, Node.js" },
            { category: "Cloud & DevOps", items: "AWS (Lambda, S3, EC2), Docker, Kubernetes, Terraform" },
            { category: "Database & Architecture", items: "PostgreSQL, Redis, GraphQL, REST APIs, Microservices" },
          ],
        },
        coverLetterText:
          result?.coverLetter?.text ||
          `Dear Hiring Team at ${companyName},\n\nI am writing to express my strong enthusiasm for the ${roleTitle} position. With over 7 years architecting high-throughput distributed systems and slashing enterprise cloud infrastructure costs, I have consistently driven measurable business outcomes.\n\nAt my current company, I spearheaded our migration to an AWS serverless architecture that reduced p99 latency by 68% and generated $180,000 in annual recurring savings. I am excited about the prospect of bringing this track record of scalable execution to ${companyName}.\n\nThank you for your consideration, and I look forward to connecting soon.\n\nSincerely,\n${candidateName}`,
        interviewPrep: result?.interviewPrep,
      };

      await downloadApplicationBundle(bundleData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to download bundle:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FolderArchive className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  1-Click Application Packet Bundle
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ZIP Package
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                Targeting <strong className="text-white">{roleTitle}</strong> at{" "}
                <strong className="text-white">{companyName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50 dark:bg-slate-950/80">
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
              Everything you need to apply, interview, and negotiate in one clean download. No more manual file naming or missing recruiter follow-ups!
            </div>
          </div>

          {/* File Checklist Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider px-1">
              Included Artifacts (6 Files in ZIP):
            </h3>

            {bundleFiles.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {f.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{f.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${f.badgeColor}`}
                  >
                    {f.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            Compressed size: ~18 KB &bull; Compatible with MS Word, Google Docs & Mac Pages
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownloadZip}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-200 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>ZIP Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Application Bundle (.zip)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
