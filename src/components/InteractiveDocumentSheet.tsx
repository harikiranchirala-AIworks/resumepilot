"use client";

import { useState } from "react";
import { Check, Copy, Wand2, Zap, RefreshCw, Scissors, Target } from "lucide-react";

type BulletCategory = "quantified" | "needs-metric" | "matched-keyword" | "passive";

interface BulletItem {
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
    originalText: "Managed cross-functional engineering teams to launch cloud microservices platform, improving system throughput by 42% and reducing latency by 85ms across 12M daily requests.",
    currentText: "Managed cross-functional engineering teams to launch cloud microservices platform, improving system throughput by 42% and reducing latency by 85ms across 12M daily requests.",
    category: "quantified",
    suggestion: "Google XYZ aligned: Excellent metric density (42%, 85ms, 12M).",
    matchedKeywords: ["microservices", "latency", "cloud"],
  },
  {
    id: "b2",
    originalText: "Responsible for updating API documentation and helping junior developers with code reviews.",
    currentText: "Responsible for updating API documentation and helping junior developers with code reviews.",
    category: "passive",
    suggestion: "Passive phrasing ('Responsible for'). Upgrade with strong action verb like 'Spearheaded' or 'Orchestrated'.",
    matchedKeywords: ["API", "code reviews"],
  },
  {
    id: "b3",
    originalText: "Implemented automated CI/CD pipeline using GitHub Actions, Kubernetes, and Terraform.",
    currentText: "Implemented automated CI/CD pipeline using GitHub Actions, Kubernetes, and Terraform.",
    category: "needs-metric",
    suggestion: "Missing metric numbers. Add deployment frequency or build time reduction (e.g. 'reduced deploy time by 60%').",
    matchedKeywords: ["CI/CD", "Kubernetes", "Terraform"],
  },
  {
    id: "b4",
    originalText: "Led migration of legacy monolithic system to AWS serverless architecture, slashing cloud Infrastructure costs by $180,000 annually.",
    currentText: "Led migration of legacy monolithic system to AWS serverless architecture, slashing cloud Infrastructure costs by $180,000 annually.",
    category: "matched-keyword",
    suggestion: "Strong keyword match (AWS, serverless) + $180k financial impact metric.",
    matchedKeywords: ["AWS", "serverless", "monolithic"],
  },
];

export function InteractiveDocumentSheet({
  initialBullets,
  missingKeywords = ["GraphQL", "Docker", "Event-Driven"],
  onBulletChange,
  headerName = "ALEX MORGAN",
  headerTitle = "Senior Full Stack & Cloud Solutions Engineer",
}: InteractiveDocumentSheetProps) {
  const [bullets, setBullets] = useState<BulletItem[]>(() => {
    if (initialBullets && initialBullets.length > 0) {
      return initialBullets.map((text, idx) => {
        const hasMetric = /\b(\d+%|\$\d+|\d+\+|\d+k|\d+M|percent|million|thousand)\b/i.test(text);
        const isPassive = /^(responsible for|helped with|worked on|assisted in)/i.test(text);
        const cat: BulletCategory = hasMetric ? "quantified" : isPassive ? "passive" : "needs-metric";
        return {
          id: `b-${idx}`,
          originalText: text,
          currentText: text,
          category: cat,
          suggestion: hasMetric
            ? "Google XYZ aligned with quantifiable metrics."
            : isPassive
            ? "Replace passive lead verb with strong action verb."
            : "Add quantifiable impact metric ($X or Y%).",
        };
      });
    }
    return DEFAULT_DEMO_BULLETS;
  });

  const [activeBulletId, setActiveBulletId] = useState<string | null>(null);
  const [isRewritingId, setIsRewritingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
            newText = `${newText.replace(/\.$/, "")} leveraging ${kw} integration.`;
          } else if (actionType === "shorten") {
            const words = newText.split(" ");
            if (words.length > 12) {
              newText = words.slice(0, 14).join(" ") + ".";
            }
          }

          const hasMetric = /\b(\d+%|\$\d+|\d+\+|\d+k|\d+M|percent|million|thousand)\b/i.test(newText);
          const newCategory: BulletCategory = hasMetric ? "quantified" : "matched-keyword";
          return {
            ...b,
            currentText: newText,
            category: newCategory,
            suggestion: "⚡ Bullet AI optimized!",
          };
        });

        if (onBulletChange) {
          onBulletChange(updated.map((b) => b.currentText));
        }

        return updated;
      });
      setIsRewritingId(null);
    }, 500);
  };

  const handleCopyDocument = () => {
    const fullDoc = `${headerName}\n${headerTitle}\n\nEXPERIENCE HIGHLIGHTS:\n` + bullets.map((b) => `• ${b.currentText}`).join("\n");
    navigator.clipboard.writeText(fullDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900">
            Live A4 Interactive Document Sheet
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
            Inline AI Micro-Toolbar Active
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyDocument}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Paper Text"}</span>
        </button>
      </div>

      {/* Legend Badges */}
      <div className="flex flex-wrap items-center gap-2 px-1 text-xs font-semibold">
        <span className="text-slate-500 font-bold">Inline Highlights:</span>
        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 🟢 Quantified (Google XYZ)
        </span>
        <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 🟡 Missing Metric
        </span>
        <span className="px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-500" /> 🔵 JD Keyword Match
        </span>
        <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> 🔴 Passive / Fluff Phrasing
        </span>
      </div>

      {/* Realistic Paper Sheet Canvas */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 p-8 sm:p-12 transition-all">
        {/* Document Paper Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {headerName}
          </h1>
          <p className="text-sm font-bold text-indigo-700 tracking-wide mt-1">
            {headerTitle}
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 mt-2">
            <span>📧 alex.morgan@example.com</span>
            <span>📱 (555) 019-2834</span>
            <span>🌐 linkedin.com/in/alexmorgan</span>
            <span>📍 San Francisco, CA</span>
          </div>
        </div>

        {/* Section: Professional Summary */}
        <div className="mb-6 space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-normal">
            Results-driven Cloud & Full Stack Solutions Engineer with 7+ years of experience designing high-throughput microservices, optimizing AWS cloud infrastructure, and automating CI/CD pipelines. Proven track record of reducing latency, cutting enterprise cloud costs, and scaling applications to millions of daily active users.
          </p>
        </div>

        {/* Section: Professional Experience */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Professional Experience & Key Accomplishments
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Lead Cloud Systems Architect</span>
              <span className="text-xs font-bold text-slate-500">2021 — Present</span>
            </div>
            <p className="text-xs font-semibold text-slate-700">TechCorp Solutions Inc. | San Francisco, CA</p>

            {/* Interactive Bullets List */}
            <div className="space-y-3 pt-1">
              {bullets.map((bullet) => {
                const isActive = activeBulletId === bullet.id;
                const isRewriting = isRewritingId === bullet.id;

                let categoryStyle = "bg-slate-50 border-slate-200 text-slate-900";
                if (bullet.category === "quantified") {
                  categoryStyle = "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium";
                } else if (bullet.category === "needs-metric") {
                  categoryStyle = "bg-amber-50/70 border-amber-300 text-amber-950";
                } else if (bullet.category === "matched-keyword") {
                  categoryStyle = "bg-cyan-50/70 border-cyan-300 text-cyan-950 font-medium";
                } else if (bullet.category === "passive") {
                  categoryStyle = "bg-rose-50/70 border-rose-300 text-rose-950";
                }

                return (
                  <div
                    key={bullet.id}
                    onMouseEnter={() => setActiveBulletId(bullet.id)}
                    onClick={() => setActiveBulletId(bullet.id)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer group ${categoryStyle} ${
                      isActive ? "ring-2 ring-indigo-500/80 shadow-md scale-[1.005]" : "hover:border-slate-400"
                    }`}
                  >
                    {/* Bullet bullet icon */}
                    <div className="flex items-start gap-2.5">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <div className="flex-1 text-xs leading-relaxed">
                        <span>{bullet.currentText}</span>
                      </div>
                    </div>

                    {/* Inline Suggestion Badge */}
                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 italic font-medium">
                        💡 {bullet.suggestion}
                      </span>
                      {bullet.matchedKeywords && (
                        <div className="flex flex-wrap gap-1">
                          {bullet.matchedKeywords.map((kw) => (
                            <span key={kw} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Floating Micro-Toolbar on Hover / Active */}
                    {isActive && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 animate-fadeIn">
                        <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">
                          ⚡ AI Micro-Actions:
                        </span>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "quantify");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Quantify (Google XYZ)</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "verb");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1 transition-all"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-white" />
                          <span>Action Verb Boost</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "keyword");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs flex items-center gap-1 transition-all"
                        >
                          <Target className="w-3.5 h-3.5 text-cyan-200" />
                          <span>Inject JD Keyword</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRewriting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAction(bullet.id, "shorten");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1 transition-all"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>Shorten</span>
                        </button>

                        {isRewriting && (
                          <span className="text-xs text-indigo-700 font-bold animate-pulse ml-2 flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rewriting...
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
        <div className="mt-6 space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Core Technical Skills & Stack Alignment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold">Languages & Web:</strong>
              <span className="text-slate-700">TypeScript, Python, React, Next.js, Node.js</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold">Cloud & DevOps:</strong>
              <span className="text-slate-700">AWS (Lambda, S3, EC2), Docker, Kubernetes, Terraform</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold">Database & Architecture:</strong>
              <span className="text-slate-700">PostgreSQL, Redis, GraphQL, REST APIs, Microservices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
