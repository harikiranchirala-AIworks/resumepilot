"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Wand2,
  Zap,
  RefreshCw,
  Scissors,
  Target,
  Download,
  FileText,
  Printer,
  RotateCcw,
  Edit3,
} from "lucide-react";
import { exportResumeToWord, exportResumeToTxt, ResumeExportData } from "@/lib/exportDocx";

export type BulletCategory = "quantified" | "needs-metric" | "matched-keyword" | "passive";

export interface BulletItem {
  id: string;
  originalText: string;
  currentText: string;
  category: BulletCategory;
  suggestion: string;
  matchedKeywords?: string[];
}

interface InteractiveDocumentSheetProps {
  initialBullets?: string[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  onBulletChange?: (newBullets: string[]) => void;
  headerName?: string;
  headerTitle?: string;
}

const DEFAULT_DEMO_BULLETS: BulletItem[] = [
  {
    id: "b1",
    originalText:
      "Managed cross-functional engineering teams to launch cloud microservices platform, improving system throughput by 42% and reducing latency by 85ms across 12M daily requests.",
    currentText:
      "Managed cross-functional engineering teams to launch cloud microservices platform, improving system throughput by 42% and reducing latency by 85ms across 12M daily requests.",
    category: "quantified",
    suggestion: "Google XYZ aligned: Excellent metric density (42%, 85ms, 12M).",
    matchedKeywords: ["microservices", "latency", "cloud"],
  },
  {
    id: "b2",
    originalText:
      "Responsible for updating API documentation and helping junior developers with code reviews.",
    currentText:
      "Responsible for updating API documentation and helping junior developers with code reviews.",
    category: "passive",
    suggestion: "Passive phrasing ('Responsible for'). Upgrade with strong action verb like 'Spearheaded' or 'Orchestrated'.",
    matchedKeywords: ["API", "code reviews"],
  },
  {
    id: "b3",
    originalText:
      "Implemented automated CI/CD pipeline using GitHub Actions, Kubernetes, and Terraform.",
    currentText:
      "Implemented automated CI/CD pipeline using GitHub Actions, Kubernetes, and Terraform.",
    category: "needs-metric",
    suggestion: "Missing metric numbers. Add deployment frequency or build time reduction (e.g. 'reduced deploy time by 60%').",
    matchedKeywords: ["CI/CD", "Kubernetes", "Terraform"],
  },
  {
    id: "b4",
    originalText:
      "Led migration of legacy monolithic system to AWS serverless architecture, slashing cloud Infrastructure costs by $180,000 annually.",
    currentText:
      "Led migration of legacy monolithic system to AWS serverless architecture, slashing cloud Infrastructure costs by $180,000 annually.",
    category: "matched-keyword",
    suggestion: "Strong keyword match (AWS, serverless) + $180k financial impact metric.",
    matchedKeywords: ["AWS", "serverless", "monolithic"],
  },
];

const INITIAL_SUMMARY =
  "Results-driven Cloud & Full Stack Solutions Engineer with 7+ years of experience designing high-throughput microservices, optimizing AWS cloud infrastructure, and automating CI/CD pipelines. Proven track record of reducing latency, cutting enterprise cloud costs, and scaling applications to millions of daily active users.";

function categorizeBullet(text: string): { category: BulletCategory; suggestion: string } {
  const hasMetric = /\b(\d+%|\$\d+|\d+\+|\d+k|\d+M|percent|million|thousand)\b/i.test(text);
  const isPassive = /^(responsible for|helped with|worked on|assisted in|assisted with)/i.test(text.trim());

  if (hasMetric) {
    return {
      category: "quantified",
      suggestion: "Google XYZ aligned: High-impact metric detected!",
    };
  }
  if (isPassive) {
    return {
      category: "passive",
      suggestion: "Passive lead verb. Click 'Action Verb Boost' to replace with high-impact leadership verb.",
    };
  }
  return {
    category: "needs-metric",
    suggestion: "Needs quantifiable impact. Add a metric (e.g., $X saved, Y% improved, Z users served).",
  };
}

export function InteractiveDocumentSheet({
  initialBullets,
  missingKeywords = ["GraphQL", "Docker", "Event-Driven"],
  onBulletChange,
  headerName = "ALEX MORGAN",
  headerTitle = "Senior Full Stack & Cloud Solutions Engineer",
}: InteractiveDocumentSheetProps) {
  // Document state (editable WYSIWYG)
  const [name, setName] = useState(headerName);
  const [title, setTitle] = useState(headerTitle);
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("(555) 019-2834");
  const [location, setLocation] = useState("San Francisco, CA");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexmorgan");
  const [summary, setSummary] = useState(INITIAL_SUMMARY);

  const [role, setRole] = useState("Lead Cloud Systems Architect");
  const [company, setCompany] = useState("TechCorp Solutions Inc.");
  const [period, setPeriod] = useState("2021 — Present");
  const [jobLocation, setJobLocation] = useState("San Francisco, CA");

  const [skillsLanguages, setSkillsLanguages] = useState("TypeScript, Python, React, Next.js, Node.js");
  const [skillsCloud, setSkillsCloud] = useState("AWS (Lambda, S3, EC2), Docker, Kubernetes, Terraform");
  const [skillsDb, setSkillsDb] = useState("PostgreSQL, Redis, GraphQL, REST APIs, Microservices");

  // Inline editing active cell
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Bullets state
  const [bullets, setBullets] = useState<BulletItem[]>(() => {
    if (initialBullets && initialBullets.length > 0) {
      return initialBullets.map((text, idx) => {
        const { category, suggestion } = categorizeBullet(text);
        return {
          id: `b-${idx}`,
          originalText: text,
          currentText: text,
          category,
          suggestion,
        };
      });
    }
    return DEFAULT_DEMO_BULLETS;
  });

  const [activeBulletId, setActiveBulletId] = useState<string | null>(null);
  const [isRewritingId, setIsRewritingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Helper to compile full export data
  const getExportData = (): ResumeExportData => ({
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    summary,
    experience: [
      {
        role,
        company,
        period,
        location: jobLocation,
        bullets: bullets.map((b) => b.currentText),
      },
    ],
    skills: [
      { category: "Languages & Web", items: skillsLanguages },
      { category: "Cloud & DevOps", items: skillsCloud },
      { category: "Database & Architecture", items: skillsDb },
    ],
  });

  // Handle Export Word
  const handleExportWord = () => {
    const cleanFilename = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_Resume.doc`;
    exportResumeToWord(getExportData(), cleanFilename);
  };

  // Handle Export Plain Text
  const handleExportTxt = () => {
    const cleanFilename = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_Resume.txt`;
    exportResumeToTxt(getExportData(), cleanFilename);
  };

  // Handle Print PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Handle Reset AI Draft
  const handleResetDraft = () => {
    setName(headerName);
    setTitle(headerTitle);
    setEmail("alex.morgan@example.com");
    setPhone("(555) 019-2834");
    setLocation("San Francisco, CA");
    setLinkedin("linkedin.com/in/alexmorgan");
    setSummary(INITIAL_SUMMARY);
    setRole("Lead Cloud Systems Architect");
    setCompany("TechCorp Solutions Inc.");
    setPeriod("2021 — Present");
    setJobLocation("San Francisco, CA");
    setSkillsLanguages("TypeScript, Python, React, Next.js, Node.js");
    setSkillsCloud("AWS (Lambda, S3, EC2), Docker, Kubernetes, Terraform");
    setSkillsDb("PostgreSQL, Redis, GraphQL, REST APIs, Microservices");

    setBullets(DEFAULT_DEMO_BULLETS);
    if (onBulletChange) {
      onBulletChange(DEFAULT_DEMO_BULLETS.map((b) => b.currentText));
    }
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  // Quick Action on bullet
  const handleApplyAction = (bulletId: string, actionType: "quantify" | "verb" | "keyword" | "shorten") => {
    setIsRewritingId(bulletId);
    setTimeout(() => {
      setBullets((prev) => {
        const updated: BulletItem[] = prev.map((b) => {
          if (b.id !== bulletId) return b;
          let newText = b.currentText;

          if (actionType === "quantify") {
            if (!/\d+%|\$\d+/.test(newText)) {
              newText = `${newText.replace(/\.$/, "")}, driving 38% efficiency increase and saving $45,000 annually.`;
            }
          } else if (actionType === "verb") {
            newText = newText.replace(/^(responsible for|helped|worked on|assisted|managed)/i, "Spearheaded");
            newText = newText.replace(/^(led|implemented)/i, "Orchestrated");
          } else if (actionType === "keyword") {
            const kw = missingKeywords[0] || "Docker & GraphQL";
            newText = `${newText.replace(/\.$/, "")} leveraging ${kw} architecture.`;
          } else if (actionType === "shorten") {
            const words = newText.split(" ");
            if (words.length > 14) {
              newText = words.slice(0, 14).join(" ") + ".";
            }
          }

          const { category } = categorizeBullet(newText);
          return {
            ...b,
            currentText: newText,
            category,
            suggestion: "⚡ Bullet AI optimized!",
          };
        });

        if (onBulletChange) {
          onBulletChange(updated.map((b) => b.currentText));
        }

        return updated;
      });
      setIsRewritingId(null);
    }, 400);
  };

  // Inline bullet text direct editing
  const handleBulletTextChange = (bulletId: string, newText: string) => {
    setBullets((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== bulletId) return b;
        const { category, suggestion } = categorizeBullet(newText);
        return {
          ...b,
          currentText: newText,
          category,
          suggestion,
        };
      });
      if (onBulletChange) {
        onBulletChange(updated.map((b) => b.currentText));
      }
      return updated;
    });
  };

  const handleCopyDocument = () => {
    const fullDoc =
      `${name}\n${title}\n${email} | ${phone} | ${location} | ${linkedin}\n\n` +
      `PROFESSIONAL SUMMARY:\n${summary}\n\n` +
      `EXPERIENCE:\n${role} — ${company} (${period}, ${jobLocation})\n` +
      bullets.map((b) => `• ${b.currentText}`).join("\n") +
      `\n\nCORE SKILLS:\nLanguages: ${skillsLanguages}\nCloud: ${skillsCloud}\nDatabases: ${skillsDb}`;
    navigator.clipboard.writeText(fullDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Actions & Direct Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              Live A4 Interactive Document Sheet
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                WYSIWYG Editable
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Click any text to edit inline &bull; Real-time Google XYZ score sync &bull; Direct exports
            </p>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Print Export */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export clean vector PDF"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>PDF Print</span>
          </button>

          {/* Word Export */}
          <button
            type="button"
            onClick={handleExportWord}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download formatted Microsoft Word .doc"
          >
            <Download className="w-4 h-4 text-indigo-200" />
            <span>Word (.docx)</span>
          </button>

          {/* TXT Export */}
          <button
            type="button"
            onClick={handleExportTxt}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download plain ATS text format"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Text (.txt)</span>
          </button>

          {/* Copy Text */}
          <button
            type="button"
            onClick={handleCopyDocument}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy entire document text to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          {/* Reset AI Draft */}
          <button
            type="button"
            onClick={handleResetDraft}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset document to initial AI draft"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>{resetSuccess ? "Reset Done!" : "Reset Draft"}</span>
          </button>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="flex flex-wrap items-center gap-2 px-1 text-xs sm:text-sm font-semibold print:hidden">
        <span className="text-slate-600 font-bold">Inline Highlights:</span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 🟢 Quantified (Google XYZ)
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 🟡 Missing Metric
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-950 border border-cyan-300 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-500" /> 🔵 JD Keyword Match
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> 🔴 Passive Phrasing
        </span>
      </div>

      {/* Realistic Paper Sheet Canvas */}
      <div
        id="printable-resume-sheet"
        className="print-clean relative bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/70 p-8 sm:p-12 lg:p-14 transition-all w-full"
      >
        {/* Document Paper Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6">
          {/* Editable Name */}
          <div className="relative group">
            {editingCell === "name" ? (
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                className="w-full text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase border-b-2 border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
              />
            ) : (
              <div
                onClick={() => setEditingCell("name")}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 -m-1 rounded-lg transition-colors"
                title="Click to edit Name"
              >
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                  {name}
                </h1>
                <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
              </div>
            )}
          </div>

          {/* Editable Title */}
          <div className="relative group mt-1.5">
            {editingCell === "title" ? (
              <input
                type="text"
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                className="w-full text-base sm:text-lg font-bold text-indigo-700 tracking-wide border-b-2 border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
              />
            ) : (
              <div
                onClick={() => setEditingCell("title")}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 -m-1 rounded-lg transition-colors"
                title="Click to edit Professional Title"
              >
                <p className="text-base sm:text-lg font-bold text-indigo-700 tracking-wide">
                  {title}
                </p>
                <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
              </div>
            )}
          </div>

          {/* Editable Contact Row */}
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-slate-600 mt-2.5">
            {/* Email */}
            <div className="relative group">
              {editingCell === "email" ? (
                <input
                  type="email"
                  value={email}
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("email")}
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-1"
                  title="Click to edit Email"
                >
                  📧 {email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="relative group">
              {editingCell === "phone" ? (
                <input
                  type="text"
                  value={phone}
                  autoFocus
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("phone")}
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-1"
                  title="Click to edit Phone"
                >
                  📱 {phone}
                </span>
              )}
            </div>

            {/* LinkedIn */}
            <div className="relative group">
              {editingCell === "linkedin" ? (
                <input
                  type="text"
                  value={linkedin}
                  autoFocus
                  onChange={(e) => setLinkedin(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("linkedin")}
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-1"
                  title="Click to edit LinkedIn"
                >
                  🌐 {linkedin}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="relative group">
              {editingCell === "location" ? (
                <input
                  type="text"
                  value={location}
                  autoFocus
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("location")}
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-1"
                  title="Click to edit Location"
                >
                  📍 {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section: Professional Summary */}
        <div className="mb-8 space-y-2.5">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">
              Professional Summary
            </h2>
            <span className="text-xs text-slate-400 font-medium print:hidden">Click to edit</span>
          </div>

          <div className="relative group">
            {editingCell === "summary" ? (
              <textarea
                value={summary}
                autoFocus
                rows={4}
                onChange={(e) => setSummary(e.target.value)}
                onBlur={() => setEditingCell(null)}
                className="w-full text-sm sm:text-base text-slate-800 leading-relaxed p-2.5 rounded-xl border-2 border-indigo-600 bg-indigo-50/40 outline-none"
              />
            ) : (
              <div
                onClick={() => setEditingCell("summary")}
                className="cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
                title="Click to edit Summary"
              >
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                  {summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section: Professional Experience */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">
              Professional Experience & Key Accomplishments
            </h2>
            <span className="text-xs text-slate-400 font-medium print:hidden">Click to edit</span>
          </div>

          <div className="space-y-3.5">
            {/* Role, Period, Company */}
            <div className="flex flex-wrap justify-between items-baseline gap-2">
              <div className="flex items-center gap-2">
                {editingCell === "role" ? (
                  <input
                    type="text"
                    value={role}
                    autoFocus
                    onChange={(e) => setRole(e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                    className="text-base sm:text-lg font-black text-slate-900 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                  />
                ) : (
                  <span
                    onClick={() => setEditingCell("role")}
                    className="text-base sm:text-lg font-black text-slate-900 cursor-pointer hover:text-indigo-700"
                    title="Click to edit Role"
                  >
                    {role}
                  </span>
                )}
              </div>

              <div>
                {editingCell === "period" ? (
                  <input
                    type="text"
                    value={period}
                    autoFocus
                    onChange={(e) => setPeriod(e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                    className="text-xs sm:text-sm font-bold text-slate-600 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded text-right"
                  />
                ) : (
                  <span
                    onClick={() => setEditingCell("period")}
                    className="text-xs sm:text-sm font-bold text-slate-500 cursor-pointer hover:text-indigo-700"
                    title="Click to edit Period"
                  >
                    {period}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-900">
              {editingCell === "company" ? (
                <input
                  type="text"
                  value={company}
                  autoFocus
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="font-bold text-indigo-900 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("company")}
                  className="cursor-pointer hover:underline"
                  title="Click to edit Company"
                >
                  {company}
                </span>
              )}
              <span>|</span>
              {editingCell === "jobLocation" ? (
                <input
                  type="text"
                  value={jobLocation}
                  autoFocus
                  onChange={(e) => setJobLocation(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
                  className="font-bold text-indigo-900 border-b border-indigo-600 bg-indigo-50/50 outline-none px-1 rounded"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("jobLocation")}
                  className="cursor-pointer hover:underline"
                  title="Click to edit Job Location"
                >
                  {jobLocation}
                </span>
              )}
            </div>

            {/* Interactive Bullets List */}
            <div className="space-y-3.5 pt-1.5">
              {bullets.map((bullet) => {
                const isActive = activeBulletId === bullet.id;
                const isRewriting = isRewritingId === bullet.id;
                const isEditingText = editingCell === `bullet-${bullet.id}`;

                let categoryStyle = "bg-slate-50 border-slate-200 text-slate-900";
                if (bullet.category === "quantified") {
                  categoryStyle = "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium";
                } else if (bullet.category === "needs-metric") {
                  categoryStyle = "bg-amber-50/80 border-amber-300 text-amber-950";
                } else if (bullet.category === "matched-keyword") {
                  categoryStyle = "bg-cyan-50/80 border-cyan-300 text-cyan-950 font-medium";
                } else if (bullet.category === "passive") {
                  categoryStyle = "bg-rose-50/80 border-rose-300 text-rose-950";
                }

                return (
                  <div
                    key={bullet.id}
                    onMouseEnter={() => setActiveBulletId(bullet.id)}
                    onClick={() => setActiveBulletId(bullet.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${categoryStyle} ${
                      isActive ? "ring-2 ring-indigo-500/80 shadow-md scale-[1.002]" : "hover:border-slate-400"
                    }`}
                  >
                    {/* Bullet bullet icon */}
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 font-black text-base mt-0.5">•</span>
                      <div className="flex-1 text-sm sm:text-base leading-relaxed">
                        {isEditingText ? (
                          <textarea
                            value={bullet.currentText}
                            autoFocus
                            rows={3}
                            onChange={(e) => handleBulletTextChange(bullet.id, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            className="w-full text-sm sm:text-base leading-relaxed p-2 rounded-lg border-2 border-indigo-600 bg-white outline-none shadow-inner"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingCell(`bullet-${bullet.id}`);
                            }}
                            title="Double-click to edit bullet directly"
                            className="hover:underline decoration-dotted decoration-indigo-400"
                          >
                            {bullet.currentText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Inline Suggestion Badge */}
                    <div className="mt-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm print:hidden">
                      <span className="text-slate-600 italic font-medium">
                        💡 {bullet.suggestion}
                      </span>
                      {bullet.matchedKeywords && (
                        <div className="flex flex-wrap gap-1">
                          {bullet.matchedKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md text-xs bg-indigo-100 text-indigo-900 font-bold"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Floating Micro-Toolbar on Hover / Active */}
                    {isActive && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2 animate-fadeIn print:hidden">
                        <span className="text-xs font-black uppercase text-slate-600 mr-1">
                          ⚡ AI Actions:
                        </span>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "quantify");
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>Quantify (Google XYZ)</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "verb");
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Wand2 className="w-4 h-4 text-white" />
                          <span>Action Verb Boost</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "keyword");
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Target className="w-4 h-4 text-cyan-200" />
                          <span>Inject JD Keyword</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "shorten");
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Scissors className="w-4 h-4" />
                          <span>Shorten</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCell(`bullet-${bullet.id}`);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit Text</span>
                        </button>

                        {isRewriting && (
                          <span className="text-xs sm:text-sm text-indigo-700 font-bold animate-pulse ml-2 flex items-center gap-1.5">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Rewriting...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Technical Skills */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">
              Core Technical Skills & Stack Alignment
            </h2>
            <span className="text-xs text-slate-400 font-medium print:hidden">Click to edit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {/* Languages */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-1">Languages & Web:</strong>
              {editingCell === "skillsLanguages" ? (
                <textarea
                  value={skillsLanguages}
                  autoFocus
                  rows={2}
                  onChange={(e) => setSkillsLanguages(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  className="w-full text-xs text-slate-800 p-1.5 rounded border border-indigo-600 bg-white outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("skillsLanguages")}
                  className="text-slate-800 font-medium cursor-pointer hover:underline block"
                  title="Click to edit languages"
                >
                  {skillsLanguages}
                </span>
              )}
            </div>

            {/* Cloud */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-1">Cloud & DevOps:</strong>
              {editingCell === "skillsCloud" ? (
                <textarea
                  value={skillsCloud}
                  autoFocus
                  rows={2}
                  onChange={(e) => setSkillsCloud(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  className="w-full text-xs text-slate-800 p-1.5 rounded border border-indigo-600 bg-white outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("skillsCloud")}
                  className="text-slate-800 font-medium cursor-pointer hover:underline block"
                  title="Click to edit Cloud stack"
                >
                  {skillsCloud}
                </span>
              )}
            </div>

            {/* Database */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-1">Database & Architecture:</strong>
              {editingCell === "skillsDb" ? (
                <textarea
                  value={skillsDb}
                  autoFocus
                  rows={2}
                  onChange={(e) => setSkillsDb(e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  className="w-full text-xs text-slate-800 p-1.5 rounded border border-indigo-600 bg-white outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditingCell("skillsDb")}
                  className="text-slate-800 font-medium cursor-pointer hover:underline block"
                  title="Click to edit Databases"
                >
                  {skillsDb}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
