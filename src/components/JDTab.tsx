"use client";

import { useAppStore, canProceedFromJD } from "@/lib/store";
import { TabActions } from "./TabActions";
import { KeywordGapMatrix } from "./KeywordGapMatrix";

interface JDTabProps {
  onBack: () => void;
  onNext: () => void;
}

const SAMPLE_JDS = [
  {
    title: "Senior Full Stack Engineer",
    text: `Job Title: Senior Full Stack Engineer (Next.js / TypeScript / Cloud)
Company: NextGen Systems | Location: Remote / San Francisco, CA

About the Role:
We are seeking a talented Senior Full Stack Engineer to architect and build high-performance web applications and resilient distributed systems. You will lead technical design, optimize frontend rendering performance, and establish scalable cloud infrastructure.

Responsibilities:
- Architect and develop modern, responsive web applications using Next.js 15, React 19, TypeScript, and Tailwind CSS.
- Design and maintain high-throughput backend services and REST/GraphQL APIs with Node.js and PostgreSQL.
- Lead cloud infrastructure architecture on AWS (ECS, Lambda, RDS, S3) using Docker and Terraform.
- Implement robust CI/CD pipelines, automated testing (Jest, Playwright), and code review standards.
- Collaborate with product management, design, and executive leadership to define product roadmaps.

Requirements & Qualifications:
- 5+ years of professional software engineering experience.
- Deep proficiency with TypeScript, React, Next.js, and Node.js.
- Strong knowledge of relational and NoSQL databases (PostgreSQL, Redis).
- Demonstrated experience with AWS, Docker containerization, and modern CI/CD workflows.
- Excellent communication skills and a track record of mentoring engineering team members.`,
  },
  {
    title: "Technical Program Manager",
    text: `Job Title: Senior Technical Program Manager - Cloud & AI
Company: Stratos Enterprise | Location: Hybrid / New York, NY

About the Role:
Stratos Enterprise is looking for a Senior Technical Program Manager to lead cross-functional delivery of enterprise cloud migration and AI automation programs.

Responsibilities:
- Drive end-to-end program execution across engineering, product, security, and operations teams.
- Establish program roadmaps, sprint cadence, risk registers, and executive milestone reporting.
- Facilitate agile ceremonies, OKR alignment, and continuous workflow improvements.
- Manage vendor relationships, resource allocations, and cross-team dependencies.

Requirements:
- 6+ years in Technical Program Management or Product Management within enterprise software.
- Experience delivering cloud (AWS/Azure/GCP) or AI/ML automation initiatives.
- Proven expertise with Agile/Scrum methodologies and tools (Jira, Confluence, Tableau).
- PMP, CSM, or equivalent certification preferred.`,
  },
];

export function JDTab({ onBack, onNext }: JDTabProps) {
  const { jd, setJobDescription } = useAppStore();
  const canNext = canProceedFromJD(jd);

  return (
    <div className="space-y-6">
      <div className="card card-accent space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
              Step 2
            </p>
            <h2 className="text-xl font-bold text-brand-900">Target Job Description</h2>
            <p className="mt-1 text-xs text-slate-600">
              Paste the job posting you want to tailor your resume for.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Load sample JD:</span>
            {SAMPLE_JDS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setJobDescription(sample.text)}
                className="text-[11px] px-2 py-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition-colors border border-brand-200"
              >
                {sample.title.split(" ")[0]} {sample.title.split(" ")[1]}
              </button>
            ))}
          </div>
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
                onClick={() => setJobDescription("")}
                className="text-[11px] text-slate-400 hover:text-rose-600"
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            id="jobDescription"
            rows={12}
            className="input-field text-xs leading-relaxed"
            placeholder="Paste the complete job description — responsibilities, requirements, qualifications, tech stack..."
            value={jd.jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            {jd.jobDescription.length} characters
            {jd.jobDescription.length < 50 && jd.jobDescription.length > 0 && (
              <span className="text-amber-600 font-medium">
                {" "}
                — paste the full JD for accurate matching and ATS scoring
              </span>
            )}
          </p>
        </div>

        <div className="tip-box">
          <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
            Pro-Tips for Maximum Match Score
          </h3>
          <ul className="mt-1.5 text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Include the full posting including requirements and qualifications</li>
            <li>Our engine extracts and prioritizes high-frequency keywords across 5 technical and domain categories</li>
            <li>We will also generate matching interview questions and cover letters</li>
          </ul>
        </div>

        <TabActions
          showBack
          onBack={onBack}
          onNext={onNext}
          nextDisabled={!canNext}
        />
      </div>

      {jd.jobDescription.trim().length > 30 && (
        <KeywordGapMatrix />
      )}
    </div>
  );
}
