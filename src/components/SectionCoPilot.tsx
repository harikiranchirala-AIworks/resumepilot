"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { CoPilotActionType, CoPilotSuggestion } from "@/lib/types";

interface SectionCoPilotProps {
  initialText?: string;
  onApply?: (newText: string) => void;
}

export function SectionCoPilot({ initialText = "", onApply }: SectionCoPilotProps) {
  const { jd, preferredProvider, editableLatex, setEditableLatex } = useAppStore();
  const [inputText, setInputText] = useState(
    initialText || "Responsible for developing backend services and collaborating with frontend engineers."
  );
  const [targetKeyword, setTargetKeyword] = useState("");
  const [activeAction, setActiveAction] = useState<CoPilotActionType>("quantify");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<CoPilotSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CoPilotSuggestion | null>(null);

  const handleRunCoPilot = async (action: CoPilotActionType, keyword?: string) => {
    if (!inputText.trim()) return;

    setActiveAction(action);
    setIsProcessing(true);
    setSelectedSuggestion(null);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          selectedText: inputText.trim(),
          targetKeyword: keyword || targetKeyword || undefined,
          jobDescription: jd.jobDescription,
          preferredProvider,
        }),
      });

      const data = await res.json();
      if (res.ok && data.suggestions) {
        setSuggestions(data.suggestions);
        if (data.suggestions.length > 0) {
          setSelectedSuggestion(data.suggestions[0]);
        }
      }
    } catch (err) {
      console.error("CoPilot execution error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = (suggestion: CoPilotSuggestion) => {
    if (onApply) {
      onApply(suggestion.text);
    } else if (editableLatex) {
      // If the original text is found in editableLatex, replace it directly
      const cleanOriginal = inputText.trim();
      if (editableLatex.includes(cleanOriginal)) {
        const updated = editableLatex.replace(
          cleanOriginal,
          suggestion.text.replace(/%/g, "\\%").replace(/&/g, "\\&")
        );
        setEditableLatex(updated);
      }
    }
    setInputText(suggestion.text);
    setSelectedSuggestion(null);
  };

  return (
    <div className="card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <div>
            <h3 className="text-sm font-bold text-brand-900">
              Interactive Section AI Co-Pilot
            </h3>
            <p className="text-[11px] text-slate-500">
              Refine, quantify, and inject keywords into specific resume sentences in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Input Snippet */}
      <div>
        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
          Resume Sentence / Bullet to Optimize:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type any resume bullet point here..."
          className="input-field text-xs font-sans leading-relaxed"
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => handleRunCoPilot("quantify")}
          disabled={isProcessing}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeAction === "quantify" && suggestions.length > 0
              ? "bg-brand-600 text-white shadow-2xs"
              : "bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200"
          }`}
        >
          📊 Quantify (Google XYZ)
        </button>

        <button
          type="button"
          onClick={() => handleRunCoPilot("shorten")}
          disabled={isProcessing}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeAction === "shorten" && suggestions.length > 0
              ? "bg-brand-600 text-white shadow-2xs"
              : "bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200"
          }`}
        >
          ✂️ Shorten (1-Page Fit)
        </button>

        <button
          type="button"
          onClick={() => handleRunCoPilot("elevate_tone")}
          disabled={isProcessing}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeAction === "elevate_tone" && suggestions.length > 0
              ? "bg-brand-600 text-white shadow-2xs"
              : "bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200"
          }`}
        >
          👔 Elevate Executive Tone
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <input
            type="text"
            placeholder="Custom keyword (e.g., Kafka)"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            className="input-field text-xs py-1 px-2.5 max-w-[160px]"
          />
          <button
            type="button"
            onClick={() => handleRunCoPilot("inject_keyword", targetKeyword)}
            disabled={isProcessing || !targetKeyword.trim()}
            className="btn-primary text-xs py-1 px-2.5 shrink-0 disabled:opacity-50"
          >
            🎯 Inject
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isProcessing && (
        <div className="py-6 text-center text-xs text-brand-700 flex items-center justify-center gap-2">
          <span className="animate-spin text-base">⏳</span>
          <span>Co-Pilot is optimizing bullet with {preferredProvider} engine...</span>
        </div>
      )}

      {/* Generated Suggestions */}
      {!isProcessing && suggestions.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            AI Suggestions ({suggestions.length}):
          </span>

          <div className="grid gap-2.5">
            {suggestions.map((sug, i) => (
              <div
                key={i}
                onClick={() => setSelectedSuggestion(sug)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSuggestion?.text === sug.text
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-400/30"
                    : "border-brand-200 bg-white hover:border-brand-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-900 font-sans leading-relaxed">
                      • {sug.text}
                    </p>
                    <p className="text-[11px] text-slate-500 italic">
                      💡 {sug.rationale}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sug.metricsEstimated && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {sug.metricsEstimated}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(sug.text);
                      }}
                      className="btn-secondary text-[11px] py-1 px-2"
                    >
                      📋 Copy
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(sug);
                      }}
                      className="btn-primary text-[11px] py-1 px-2.5"
                    >
                      ⚡ Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
