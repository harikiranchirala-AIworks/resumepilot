'use client';

import React, { useState, useRef } from 'react';
import { useAppStore, canProceedFromJD } from '@/lib/store';
import { TabActions } from './TabActions';
import { KeywordGapMatrix } from './KeywordGapMatrix';
import ArchetypeDashboard from './ArchetypeDashboard';
import BulletBankModal from './BulletBankModal';
import { parseExcelJobFile } from '@/lib/excelIntegration';
import { ArchetypeTrack } from '@/lib/archetypeScoring';
import { FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';

interface JDTabProps {
  onBack: () => void;
  onNext: () => void;
}

const SAMPLE_JDS = [
  {
    title: 'AI Transformation Manager',
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
    title: 'Technical Program Manager',
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
    title: 'Product Manager',
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

  const handleOpenBulletBank = (track?: ArchetypeTrack) => {
    setBulletBankTrack(track);
    setBulletBankOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="card card-accent space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
              Step 2
            </p>
            <h2 className="text-xl font-bold text-brand-900">Target Job Description & Archetype Matcher</h2>
            <p className="mt-1 text-xs text-slate-600">
              Paste your target job posting or upload your Excel Job Utility (.xlsx) to analyze role fit and keyword coverage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start pt-1">
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
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition-colors border border-emerald-300 flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isParsingExcel ? 'Reading Excel...' : 'Upload Excel (.xlsx)'}</span>
            </button>

            {/* Bullet Bank Button */}
            <button
              type="button"
              onClick={() => handleOpenBulletBank()}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold transition-colors border border-indigo-200 flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>60-Bullet Bank</span>
            </button>
          </div>
        </div>

        {excelMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{excelMsg}</span>
          </div>
        )}

        {/* Sample JDs Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium">Load archetype sample:</span>
          {SAMPLE_JDS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setJobDescription(sample.text)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition-colors border border-brand-200"
            >
              {sample.title}
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="jobDescription"
              className="text-xs font-semibold text-brand-900"
            >
              Job Description Content
            </label>
            {jd.jobDescription.length > 0 && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-[11px] text-slate-400 hover:text-rose-600"
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            id="jobDescription"
            rows={10}
            className="input-field text-xs leading-relaxed font-mono"
            placeholder="Paste the complete job description — responsibilities, requirements, qualifications, tech stack..."
            value={jd.jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            {jd.jobDescription.length} characters
            {jd.jobDescription.length < 50 && jd.jobDescription.length > 0 && (
              <span className="text-amber-600 font-medium">
                {' '}
                — paste the full JD for accurate matching, archetype scoring, and ATS optimization
              </span>
            )}
          </p>
        </div>

        <TabActions
          showBack
          onBack={onBack}
          onNext={onNext}
          nextDisabled={!canNext}
        />
      </div>

      {/* Dynamic Career Archetype & Excel Formula Scoring Dashboard */}
      {jd.jobDescription.trim().length > 30 && (
        <div className="space-y-6">
          <ArchetypeDashboard
            jdText={jd.jobDescription}
            onOpenBulletBank={handleOpenBulletBank}
          />
          <KeywordGapMatrix />
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