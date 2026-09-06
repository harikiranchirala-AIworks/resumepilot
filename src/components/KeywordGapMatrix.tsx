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
      <div className="card text-center py-10 space-y-2">
        <div className="text-2xl">🎯</div>
        <h4 className="text-sm font-bold text-brand-900">ATS Keyword Gap Analysis</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Paste a Job Description in Step 2 to generate a live keyword heatmap and discover high-priority missing skills.
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-5">
      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base font-bold text-brand-900">
              ATS Keyword Gap & Alignment Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Frequency comparison of JD terms vs. your candidate profile with 1-click auto-weaving.
          </p>
        </div>

        {/* Mini stats counters */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-center">
            <span className="text-[10px] text-slate-500 block font-medium">JD Match</span>
            <span className="text-sm font-bold text-brand-700">{stats.percentage}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-600 block font-medium">Matched</span>
            <span className="text-sm font-bold text-emerald-800">{stats.matched}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] text-rose-600 block font-medium">Missing</span>
            <span className="text-sm font-bold text-rose-800">{stats.missing}</span>
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
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === tab.id
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
      <div className="border border-brand-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-brand-100 sticky top-0 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Keyword</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">JD Frequency</th>
                <th className="py-2.5 px-3 text-center">Resume Frequency</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No keywords found for this filter.
                  </td>
                </tr>
              )}
              {filteredItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-brand-50/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    {item.keyword}
                    {item.relevance === "critical" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Critical
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 capitalize">
                    {item.category.replace("-", " ")}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-brand-800">
                    {item.jdFrequency}×
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium">
                    {item.resumeFrequency > 0 ? (
                      <span className="text-emerald-700">{item.resumeFrequency}×</span>
                    ) : (
                      <span className="text-rose-500 font-bold">0</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.status === "matched" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        ✓ Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                        ⚠️ Missing
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleWeaveClick(item)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
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
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 border-2 border-brand-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <h4 className="text-xs font-bold text-brand-900">
                AI Weaving Assistant for &quot;{selectedGap.keyword}&quot;
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedGap(null)}
              className="text-slate-400 hover:text-slate-700 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-slate-600">
            Select a tailored bullet point below to insert into your resume:
          </p>

          {weaving ? (
            <div className="py-4 text-center text-xs text-brand-700 flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Generating authentic bullet point variations...
            </div>
          ) : (
            <div className="space-y-2">
              {weaveSuggestions.map((sug, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg border border-brand-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-2xs hover:border-brand-400 transition-colors"
                >
                  <span className="text-xs text-slate-800 leading-relaxed font-sans">
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
