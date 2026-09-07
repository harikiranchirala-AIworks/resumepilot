"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, UserCheck, Search, Tag, Send, Mail, Users } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function LinkedInOptimizerTab() {
  const { user, jd } = useAppStore();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Extract company & role name if available from JD
  const roleMatch = jd.jobDescription.match(/(?:Job Title|Role|Position):\s*([^\n\r]+)/i);
  const companyMatch = jd.jobDescription.match(/(?:Company|Organization):\s*([^\n\r]+)/i);

  const targetRole = roleMatch ? roleMatch[1].trim() : (user?.targetRole || "Senior AI & Cloud Engineer");
  const targetCompany = companyMatch ? companyMatch[1].trim() : "your team";
  const candidateName = user?.name || "Candidate";

  const outreachDMs = [
    {
      id: "dm-hiring-manager",
      title: "Direct Hiring Manager DM (Value-First Hook)",
      target: "For Engineering / Product / Program Directors",
      icon: Send,
      text: `Hi [Hiring Manager],

I came across your opening for the ${targetRole} role at ${targetCompany}.

Given your team's focus on scaling modern cloud architectures and Generative AI delivery, I recently engineered an event-driven platform handling 50M+ daily transactions while cutting cloud spend by 40%.

I've submitted my tailored application, but wanted to reach out directly to share a few quick ideas on how I can accelerate your upcoming roadmap. Would 10 minutes next Tuesday or Wednesday work for a brief introductory chat?

Best regards,
${candidateName}`,
    },
    {
      id: "dm-recruiter",
      title: "Talent Acquisition / Recruiter DM (ATS Fast-Track)",
      target: "For In-house Recruiters & Talent Partners",
      icon: Mail,
      text: `Hi [Recruiter Name],

I just submitted my formal application for the ${targetRole} position at ${targetCompany}.

My background is an 88%+ direct match with your posted requirements—specifically leading cross-functional squads in cloud migration, LLM integration pipelines, and agile delivery.

I know your inbox is swamped with applicants, so I wanted to express my strong enthusiasm for ${targetCompany}'s mission directly. If you have 5 minutes this week, I'd welcome the opportunity to connect!

Warm regards,
${candidateName}`,
    },
    {
      id: "dm-peer",
      title: "Team Peer / Alumni Coffee Chat (Warm Cultural Outreach)",
      target: "For Future Team Peers & School / Company Alumni",
      icon: Users,
      text: `Hi [Name],

I noticed you're working as a [Role/Title] at ${targetCompany}—the recent work your group has shipped is really impressive!

I'm currently in the application process for the ${targetRole} role and would love to ask 2 quick questions about the day-to-day culture and engineering practices over a virtual coffee.

Totally understand if you're swamped, but wanted to say hello and connect!

Best,
${candidateName}`,
    },
  ];

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

      {/* 4. High-Conversion Recruiter & Hiring Manager Cold Outreach DMs */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>📬 1-Click Cold Outreach DMs (Hiring Manager, Recruiter & Peer)</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Targeted LinkedIn & Email messages tailored for <strong className="text-slate-700 dark:text-slate-300">{targetRole}</strong> at <strong className="text-slate-700 dark:text-slate-300">{targetCompany}</strong>.
            </p>
          </div>
          <span className="text-[10px] font-black uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-300 dark:border-cyan-800 self-start sm:self-auto">
            High Response Rate
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {outreachDMs.map((dm) => {
            const Icon = dm.icon;
            return (
              <div
                key={dm.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {dm.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {dm.target}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(dm.text, dm.id)}
                    className="btn-primary text-xs py-1 px-3 font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedSection === dm.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy DM</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 select-all">
                  {dm.text}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
