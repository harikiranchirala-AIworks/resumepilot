"use client";

import { useState } from "react";
import type { CoverLetterResult } from "@/lib/types";
import { useAppStore, getProfileContent } from "@/lib/store";
import { buildCoverLetterLatex } from "@/lib/latex";

interface CoverLetterTabProps {
  coverLetter?: CoverLetterResult;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function CoverLetterTab({ coverLetter: initialCoverLetter }: CoverLetterTabProps) {
  const { profile, jd, library, selectedResumeId, preferredProvider } = useAppStore();
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | undefined>(initialCoverLetter);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(initialCoverLetter?.text || "");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileContent: getProfileContent(profile, library, selectedResumeId),
          jobDescription: jd.jobDescription,
          preferredProvider,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoverLetter(data);
        setEditedText(data.text);
      }
    } catch (err) {
      console.error("Cover letter error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedText : coverLetter?.text || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const textToUse = isEditing ? editedText : coverLetter?.text || "";
    const latex = buildCoverLetterLatex(
      textToUse,
      "Candidate",
      coverLetter?.roleTitle || "Target Role",
      coverLetter?.companyName || "Hiring Team"
    );
    downloadFile(latex, "tailored-cover-letter.tex", "application/x-tex");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!coverLetter && !isGenerating) {
    return (
      <div className="card text-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto text-2xl">
          ✉️
        </div>
        <div>
          <h3 className="text-base font-bold text-brand-900">Tailored Cover Letter</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
            Generate a targeted, high-impact 1-page cover letter matching the job description and your background.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="btn-primary text-xs"
        >
          Generate Tailored Cover Letter
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-100 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✉️</span>
            <h3 className="text-base font-bold text-brand-900">
              Tailored Cover Letter
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeting: <strong className="text-brand-900">{coverLetter?.roleTitle}</strong> at <strong className="text-brand-900">{coverLetter?.companyName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-secondary text-xs"
          >
            {isGenerating ? "Regenerating..." : "🔄 Regenerate"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary text-xs"
          >
            {isEditing ? "Done Editing" : "✏️ Edit Text"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs"
          >
            {copied ? "✓ Copied!" : "📋 Copy Text"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary text-xs"
          >
            🖨️ Print / PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadTex}
            className="btn-primary text-xs"
          >
            Download .tex
          </button>
        </div>
      </div>

      {coverLetter?.keyHooks && coverLetter.keyHooks.length > 0 && (
        <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-xl no-print">
          <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider block mb-1.5">
            Key Hooks Emphasized:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {coverLetter.keyHooks.map((hook, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs font-medium shadow-2xs"
              >
                ✓ {hook}
              </span>
            ))}
          </div>
        </div>
      )}

      {isEditing ? (
        <textarea
          rows={16}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="input-field font-sans text-xs leading-relaxed p-4 bg-white"
        />
      ) : (
        <div className="rounded-xl border border-brand-100 bg-white p-8 shadow-sm print:border-none print:shadow-none print:p-0">
          <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-4 text-xs">
            {(editedText || coverLetter?.text || "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
