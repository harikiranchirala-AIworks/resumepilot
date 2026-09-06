"use client";

import { useMemo, useState } from "react";
import { analyzeKeywordGapsDetailed } from "@/lib/ats";
import { useAppStore, getProfileContent } from "@/lib/store";
import type { KeywordGapItem } from "@/lib/types";

interface KeywordGapMatrixProps {
  onInsertKeyword?: (keyword: string, suggestedBullet?: string) => void;
}

export function KeywordGapMatrix({ onInsertKeyword }: KeywordGapMatrixProps) {
  const { profile, jd, library, selectedResumeId, editableLatex, result, setEditableLatex } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGap, setSelectedGap] = useState<KeywordGapItem | null>(null);
  const [weaving, setWeaving] = useState(false);
  const [weaveSuggestions, setWeaveSuggestions] = useState<string[]>([]);

  const resumeText = editableLatex || result?.resume.latex || getProfileContent(profile, library, selectedResumeId);
  const items = useMemo(
    () => analyzeKeywordGapsDetailed(jd.jobDescription, resumeText),
    [jd.jobDescription, resumeText]
  );

  const stats = useMemo(() => {
    const total = items.length;
    const matched = items.filter((i) => i.status === "matched").length;
    const missing = items.filter((i) => i.status === "missing").length;
    const criticalMissing = items.filter((i) => i.status === "missing" && i.relevance === "critical").length;
    const percentage = total > 0 ? Math.round((matched / total) * 100) : 0;
    return { total, matched, missing, criticalMissing, percentage };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        activeCategory === "all" ||
        (activeCategory === "missing" && item.status === "missing") ||
        item.category === activeCategory;

      const matchSearch =
        !searchQuery ||
        item.keyword.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleWeaveClick = async (item: KeywordGapItem) => {
    setSelectedGap(item);
    setWeaving(true);
    setWeaveSuggestions([]);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "inject_keyword",
          selectedText: `Spearheaded project initiatives and technical delivery across core responsibilities.`,
          targetKeyword: item.keyword,
          jobDescription: jd.jobDescription,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const texts = data.suggestions?.map((s: { text: string }) => s.text) || [];
        setWeaveSuggestions(texts);
      }
    } catch {
      setWeaveSuggestions([
        `Architected scalable solutions leveraging ${item.keyword}, driving a 35% improvement in delivery velocity.`,
        `Spearheaded integration of ${item.keyword} across engineering squads, boosting operational reliability.`,
      ]);
    } finally {
      setWeaving(false);
    }
  };

  const handleInsertIntoLatex = (bulletText: string) => {
    if (!editableLatex) {
      if (onInsertKeyword && selectedGap) {
        onInsertKeyword(selectedGap.keyword, bulletText);
      }
      return;
    }

    // Insert into the first \begin{itemize} found in editableLatex
    const itemizeIdx = editableLatex.indexOf("\\begin{itemize}");
    if (itemizeIdx !== -1) {
      const insertionPoint = itemizeIdx + "\\begin{itemize}".length;
      const updated =
        editableLatex.slice(0, insertionPoint) +
        `\n  \\item ${bulletText.replace(/%/g, "\\%").replace(/&/g, "\\&")}` +
        editableLatex.slice(insertionPoint);
      setEditableLatex(updated);
    }

    if (onInsertKeyword && selectedGap) {
      onInsertKeyword(selectedGap.keyword, bulletText);
    }
    setSelectedGap(null);
  };

  if (!jd.jobDescription.trim()) {
    return (
      <div className="card text-center py-10 space-y-2 bg-slate-900/80 border border-slate-800">
        <div className="text-2xl">🎯</div>
        <h4 className="text-sm font-bold text-white">ATS Keyword Gap Analysis</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Paste a Job Description in Step 2 to generate a live keyword heatmap and discover high-priority missing skills.
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-5 bg-slate-900/80 border border-slate-800 shadow-2xl">
      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base font-bold text-white">
              ATS Keyword Gap & Alignment Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Frequency comparison of JD terms vs. your candidate profile with 1-click auto-weaving.
          </p>
        </div>

        {/* Mini stats counters */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 block font-medium">JD Match</span>
            <span className="text-sm font-black text-indigo-400">{stats.percentage}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center shadow-sm">
            <span className="text-[10px] text-emerald-400 block font-medium">Matched</span>
            <span className="text-sm font-black text-emerald-300">{stats.matched}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-center shadow-sm">
            <span className="text-[10px] text-rose-400 block font-medium">Missing</span>
            <span className="text-sm font-black text-rose-300">{stats.missing}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "all", label: `All (${stats.total})` },
            { id: "missing", label: `⚠️ Missing Gaps (${stats.missing})` },
            { id: "core-tech", label: "Languages & Frameworks" },
            { id: "cloud-devops", label: "Cloud & DevOps" },
            { id: "architecture", label: "Architecture" },
            { id: "soft-skills", label: "Leadership & Agile" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategory === tab.id
                  ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field text-xs py-1.5 px-3 max-w-[200px]"
        />
      </div>

      {/* Keywords Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-xl">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 sticky top-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Keyword</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">JD Frequency</th>
                <th className="py-2.5 px-3 text-center">Resume Frequency</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No keywords found for this filter.
                  </td>
                </tr>
              )}
              {filteredItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-900/50 transition-colors"
                >
                  <td className="py-2.5 px-4 font-semibold text-white flex items-center gap-2">
                    {item.keyword}
                    {item.relevance === "critical" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        Critical
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 capitalize">
                    {item.category.replace("-", " ")}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-300">
                    {item.jdFrequency}×
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium">
                    {item.resumeFrequency > 0 ? (
                      <span className="text-emerald-400 font-bold">{item.resumeFrequency}×</span>
                    ) : (
                      <span className="text-rose-400 font-bold">0</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.status === "matched" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        ✓ Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                        ⚠️ Missing
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleWeaveClick(item)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/40 transition-colors active:scale-95"
                    >
                      ⚡ Weave In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1-Click Weave Assistant Drawer */}
      {selectedGap && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <h4 className="text-xs font-bold text-indigo-300">
                AI Weaving Assistant for &quot;{selectedGap.keyword}&quot;
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedGap(null)}
              className="text-slate-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Select a tailored bullet point below to insert into your resume:
          </p>

          {weaving ? (
            <div className="py-4 text-center text-xs text-indigo-400 flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Generating authentic bullet point variations...
            </div>
          ) : (
            <div className="space-y-2">
              {weaveSuggestions.map((sug, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm hover:border-slate-700 transition-colors"
                >
                  <span className="text-xs text-slate-200 leading-relaxed font-sans">
                    • {sug}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(sug)}
                      className="btn-secondary text-[11px] py-1 px-2.5"
                    >
                      📋 Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertIntoLatex(sug)}
                      className="btn-primary text-[11px] py-1 px-2.5"
                    >
                      ⚡ Insert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
