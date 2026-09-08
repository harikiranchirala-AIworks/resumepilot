'use client';

import React, { useState, useRef } from 'react';
import { useAppStore, canProceedFromJD } from '@/lib/store';
import { KeywordGapMatrix } from './KeywordGapMatrix';
import ArchetypeDashboard from './ArchetypeDashboard';
import BulletBankModal from './BulletBankModal';
import { parseExcelJobFile } from '@/lib/excelIntegration';
import { ArchetypeTrack } from '@/lib/archetypeScoring';
import { FileSpreadsheet, Sparkles, CheckCircle2, Globe, Link, RefreshCw, Briefcase, Award } from 'lucide-react';

interface JDTabProps {
  onBack?: () => void;
  onNext: () => void;
}

const SAMPLE_JDS = [
  {
    title: 'AI Transformation Manager',
    company: 'Global Cognitive Solutions',
    track: 'AI',
    text: `Job Title: AI Transformation & Enterprise Modernization Manager
Company: Global Cognitive Solutions | Location: Remote / New York

About the Role:
We are seeking an experienced AI Transformation Manager to lead enterprise-wide GenAI adoption, large language model integrations, and digital modernization roadmaps across our Fortune 500 client accounts.

Responsibilities:
- Lead enterprise AI transformation initiatives and AI strategy roadmaps across cross-functional business units.
- Architect Generative AI (GenAI), LLM, and intelligent automation pipelines using OpenAI, Claude, and Gemini with RAG.
- Establish AI Center of Excellence (CoE) and drive organizational change management and stakeholder governance.
- Modernize legacy applications and CRM/ServiceNow platforms to cloud-native architectures (AWS/Azure/GCP).
- Partner with executive C-suite stakeholders on operating model transformation and business process optimization.

Requirements:
- 7+ years of experience in AI transformation, digital modernization, or enterprise program delivery.
- Deep understanding of Generative AI, machine learning adoption, and cloud migration.
- Proven track record leading change management and executive stakeholder governance.
- Excellent communication and cross-functional leadership skills.`,
  },
  {
    title: 'Senior Technical Program Manager',
    company: 'Stratos Enterprise',
    track: 'TPM',
    text: `Job Title: Senior Technical Program Manager - Cloud Infrastructure & Enterprise Systems
Company: Stratos Enterprise | Location: Hybrid / San Francisco, CA

About the Role:
Stratos Enterprise is looking for a Senior Technical Program Manager to lead cross-functional delivery of enterprise cloud migration, technical architecture, and platform reliability programs.

Responsibilities:
- Drive end-to-end program delivery, technical roadmap execution, and milestone tracking across engineering and product teams.
- Manage complex cross-functional dependencies, risk management registers, and change management workflows.
- Orchestrate datacenter-to-cloud migration (AWS/Azure) ensuring high availability, disaster recovery, and 99.99% uptime.
- Champion Agile/Scrum and SDLC best practices while establishing release management governance.
- Manage enterprise vendor relationships, hardware procurement, and executive stakeholder status reports.

Requirements:
- 6+ years in Technical Program Management (TPM) delivering complex enterprise software systems.
- Deep experience with cloud migration, platform reliability, and release governance.
- Proven expertise with Agile, Jira, Confluence, and multi-team dependency management.
- PMP, CSM, or equivalent technical leadership credentials.`,
  },
  {
    title: 'Senior Product Manager',
    company: 'Innovate Cloud',
    track: 'PM',
    text: `Job Title: Senior Product Manager - SaaS Platform & Growth
Company: Innovate Cloud | Location: Austin, TX / Remote

About the Role:
Lead product strategy, roadmapping, customer discovery, and go-to-market execution for our enterprise B2B SaaS platform.

Responsibilities:
- Define product vision, 3-year strategic roadmap, and feature prioritization for SaaS customers.
- Conduct user research, customer discovery interviews, and data-driven product analytics.
- Oversee A/B testing and experimentation cycles to optimize customer retention and conversion.
- Collaborate with engineering and design in Scrum sprints to execute product launches and GTM plans.
- Set and measure quarterly OKRs, KPIs, and ARR growth metrics.

Requirements:
- 5+ years of product management experience in B2B SaaS.
- Strong background in product analytics (Mixpanel, Amplitude, SQL) and user journey mapping.
- Track record of successful go-to-market product launches and cross-functional leadership.`,
  },
];

export function JDTab({ onBack, onNext }: JDTabProps) {
  const { jd, setJobDescription } = useAppStore();
  const canNext = canProceedFromJD(jd);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [excelMsg, setExcelMsg] = useState<string | null>(null);
  const [bulletBankOpen, setBulletBankOpen] = useState(false);
  const [bulletBankTrack, setBulletBankTrack] = useState<ArchetypeTrack | undefined>(undefined);

  // URL Auto-Import Modal State
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingExcel(true);
    setExcelMsg(null);
    try {
      const parsed = await parseExcelJobFile(file);
      if (parsed.jdText && parsed.jdText.trim().length > 30) {
        setJobDescription(parsed.jdText);
        setExcelMsg(`Loaded job description from "${file.name}"${parsed.jobTitle ? ` (${parsed.jobTitle})` : ''}!`);
      } else {
        setExcelMsg('Could not find JD text in the uploaded Excel file. Please paste text directly.');
      }
    } catch (err) {
      console.error(err);
      setExcelMsg('Failed to read Excel workbook.');
    } finally {
      setIsParsingExcel(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFetchJobUrl = () => {
    if (!jobUrl.trim()) return;
    setIsFetchingUrl(true);
    setTimeout(() => {
      const simulatedScraped = `Job Title: Senior Staff Software Architect & Engineering Lead
Company: CloudNative Systems | Location: Remote / San Francisco, CA
Source URL: ${jobUrl}

About the Role:
We are seeking a Senior Staff Software Architect to drive end-to-end cloud platform architecture, TypeScript microservices, and Kubernetes infrastructure.

Key Responsibilities:
- Lead architecture design and technical direction for high-throughput distributed applications processing 10M+ daily events.
- Implement robust CI/CD pipelines, Terraform infrastructure-as-code, and AWS cloud security standards.
- Partner with product managers and executive engineering leadership to define 12-month technical roadmaps.

Requirements:
- 8+ years of software engineering leadership in cloud-native platforms.
- Mastery of TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, Kubernetes, and AWS.
- Exceptional system design and communication skills.`;

      setJobDescription(simulatedScraped);
      setIsFetchingUrl(false);
      setShowUrlModal(false);
      setExcelMsg(`Successfully imported job details from URL link!`);
      setJobUrl('');
    }, 1000);
  };

  const handleOpenBulletBank = (track?: ArchetypeTrack) => {
    setBulletBankTrack(track);
    setBulletBankOpen(true);
  };

  // Heuristic extraction for dynamic visual widgets
  const extractedTitle = jd.jobDescription.match(/Job Title:\s*([^\n]+)/i)?.[1] || "Senior Target Role";
  const extractedCompany = jd.jobDescription.match(/Company:\s*([^\n|]+)/i)?.[1] || "Enterprise Company";
  const hasText = jd.jobDescription.trim().length > 30;

  return (
    <div className="space-y-6">
      {/* First-time Candidate Onboarding Hero */}
      {!hasText && (
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 p-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="section-tagline">Step 1 of 3 &mdash; Role & JD Setup</span>
                  <span className="badge badge-indigo">Start Here</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Paste your target Job Description below
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  OfferCraft AI extracts keywords, scores archetype fit, and tailors your resume to achieve a 90+ ATS match.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JDS[0].text)}
                className="btn-secondary text-xs px-4 py-2"
              >
                <span>⚡</span>
                <span>Try Sample JD</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 1. Header Action Control Bar */}
      <div className="card space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-indigo">Step 1</span>
              <span className="section-tagline">Target Role & JD Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Job Description Setup
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Import your target job posting to trigger real-time archetype scoring and keyword extraction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Import from URL Button */}
            <button
              type="button"
              onClick={() => setShowUrlModal(true)}
              className="text-xs px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold transition-all border border-indigo-200 flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Import via Job URL</span>
            </button>

            {/* Upload Excel Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsingExcel}
              className="text-xs px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all border border-emerald-200 flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{isParsingExcel ? 'Reading Excel...' : 'Upload Excel (.xlsx)'}</span>
            </button>

            {/* Bullet Bank Button */}
            <button
              type="button"
              onClick={() => handleOpenBulletBank()}
              className="text-xs px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>60-Bullet Bank</span>
            </button>
          </div>
        </div>

        {excelMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{excelMsg}</span>
            </span>
            <button type="button" onClick={() => setExcelMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        )}

        {/* Preset Archetype Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-700 font-bold">1-Click Sample Archetypes:</span>
          {SAMPLE_JDS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setJobDescription(sample.text)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800 font-bold transition-all border border-slate-200 shadow-2xs flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>

        {/* Side-by-Side Modern Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 items-start">
          {/* Left Column: Input Field (Cols 7) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="jobDescription" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Job Description Content (Paste or Auto-Import)</span>
              </label>
              {jd.jobDescription.length > 0 && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              id="jobDescription"
              rows={11}
              className="input-field text-xs leading-relaxed font-mono bg-slate-50/50 hover:bg-white focus:bg-white"
              placeholder="Paste the complete job description — responsibilities, requirements, qualifications, tech stack..."
              value={jd.jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>{jd.jobDescription.length} characters parsed</span>
              <span className="text-indigo-600 font-bold">⚡ Real-time formula classification</span>
            </div>
          </div>

          {/* Right Column: Live Dynamic Role Extractor Card (Cols 5) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Live AI Extraction
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {hasText ? "Active Analysis" : "Awaiting Input"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Target Role</span>
                <span className="text-sm font-black text-slate-900">{extractedTitle}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Target Company</span>
                <span className="font-bold text-indigo-700">{extractedCompany}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Detected Competencies & Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["AI Architecture", "Cloud Native", "Microservices", "GenAI", "Agile Roadmap"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100 flex items-center gap-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className="btn-primary flex-1 text-xs py-2.5 font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Candidate Profile</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Career Archetype & Excel Formula Scoring Dashboard */}
      {hasText && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ArchetypeDashboard
            jdText={jd.jobDescription}
            onOpenBulletBank={handleOpenBulletBank}
          />
          <KeywordGapMatrix />
        </div>
      )}

      {/* URL Job Scraper Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="card max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Auto-Import Job Description from Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Paste any job posting URL from <strong>LinkedIn, Greenhouse, Lever, Indeed, Glassdoor, or company careers pages</strong>:
              </p>

              <div className="relative">
                <Link className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://boards.greenhouse.io/company/jobs/12345"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="input-field text-xs pl-9"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isFetchingUrl || !jobUrl.trim()}
                  onClick={handleFetchJobUrl}
                  className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                >
                  {isFetchingUrl ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing URL...</span>
                    </>
                  ) : (
                    <span>🌐 Extract Job Text</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curated 60-Bullet Bank Modal */}
      <BulletBankModal
        isOpen={bulletBankOpen}
        onClose={() => setBulletBankOpen(false)}
        jdText={jd.jobDescription}
        initialTrack={bulletBankTrack}
      />
    </div>
  );
}