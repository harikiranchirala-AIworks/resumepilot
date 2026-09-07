"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, UserCheck, Search, Tag } from "lucide-react";

export function LinkedInOptimizerTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const headLines = [
    `Senior Full Stack & Cloud Architect | AWS, Microservices, Node.js & Generative AI Systems`,
    `Staff Software Engineer | Scaled Distributed Systems (50M+ Daily Trans) | Technical Leadership`,
    `Technical Program Manager & GenAI Lead | Driving Enterprise Cloud Migration & Agile Governance`,
    `AI Transformation Manager | LLM Integration, RAG Pipelines & Cloud Modernization`,
    `Product & Engineering Leader | Scaling B2B SaaS Platforms & High-Throughput Microservices`,
  ];

  const linkedinBio = `🚀 Results-driven Senior Engineering Leader & Cloud Architect with 8+ years of experience architecting high-throughput microservices, Generative AI models, and cloud modernizations.

🌟 CORE EXPERTISE:
• Cloud & Distributed Systems: AWS (Lambda, EC2, S3), Node.js, TypeScript, Docker, Kubernetes, Terraform.
• AI Transformation & GenAI: LLM Integrations, RAG Architecture, Prompt Engineering, OpenAI/Claude APIs.
• Engineering Leadership: Spearheading cross-functional squads of 10+ engineers, Agile OKR governance, and executive stakeholder alignment.

📈 KEY ACCOMPLISHMENTS:
✓ Architected multi-region event-streaming platform processing 50M+ daily transactions with 99.99% uptime.
✓ Slashed enterprise cloud infrastructure expenses by 40% ($180k+ annual savings) via serverless adoption.
✓ Reduced API latency by 65% across core customer-facing microservices.

📫 Open to high-impact technical leadership, Staff Engineer, and TPM roles. Let's connect!
📧 alex.morgan@example.com`;

  const linkedinSkills = [
    "Cloud Architecture", "AWS", "Microservices", "TypeScript", "Node.js",
    "Generative AI", "RAG Pipelines", "Kubernetes", "Docker", "Terraform",
    "Agile Leadership", "System Design", "CI/CD Automation", "PostgreSQL", "REST APIs"
  ];

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="card space-y-6 bg-white border border-slate-200 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h3 className="text-base font-bold text-slate-900">
              LinkedIn Profile Auto-Optimizer & Recruiter SEO
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Recruiter Search Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Convert your tailored resume into high-converting LinkedIn bio hooks, headlines, and search skill tags.
          </p>
        </div>
      </div>

      {/* 1. Recruiter Search SEO Headlines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-indigo-600" /> 5 High-SEO LinkedIn Headlines (Pick Your Persona)
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Optimized for LinkedIn Recruiter search algorithms</span>
        </div>

        <div className="space-y-2">
          {headLines.map((hl, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                  #{i + 1}
                </span>
                <span className="font-bold text-slate-900">{hl}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(hl, `hl-${i}`)}
                className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1 shrink-0 font-bold"
              >
                {copiedSection === `hl-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === `hl-${i}` ? "Copied" : "Copy"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. High-Converting LinkedIn About / Bio Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" /> Optimized LinkedIn About / Bio Summary
          </h4>
          <button
            type="button"
            onClick={() => handleCopy(linkedinBio, "bio")}
            className="btn-primary text-xs py-1.5 px-4 font-bold flex items-center gap-1.5"
          >
            {copiedSection === "bio" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "bio" ? "Copied Bio!" : "Copy Full Bio"}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
            {linkedinBio}
          </pre>
        </div>
      </div>

      {/* 3. Top 15 Recruiter Skill Tags */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-indigo-600" /> Top 15 LinkedIn Skills Tags (Add to Profile Skills Section)
        </h4>

        <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          {linkedinSkills.map((sk) => (
            <span
              key={sk}
              className="px-3 py-1 rounded-xl bg-white text-indigo-800 font-bold border border-slate-200 text-xs shadow-2xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" /> #{sk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
