"use client";

import { useState, useRef } from "react";

interface ResumeUploaderProps {
  onTextExtracted: (text: string, suggestedName?: string) => void;
}

export function ResumeUploader({ onTextExtracted }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
    showSamples?: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsParsing(true);
    setStatusMessage(null);

    const filename = file.name.toLowerCase();

    // Client-side direct text read for text-based formats
    if (
      filename.endsWith(".txt") ||
      filename.endsWith(".md") ||
      filename.endsWith(".tex") ||
      filename.endsWith(".json")
    ) {
      try {
        const text = await file.text();
        if (text.trim().length >= 10) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "");
          onTextExtracted(text, cleanName);
          setStatusMessage({
            type: "success",
            text: `Successfully imported "${file.name}" (${text.length} characters).`,
          });
          setIsParsing(false);
          return;
        }
      } catch {
        // Fall back to server parsing
      }
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            "Could not extract text from this document. If this is a scanned PDF, please paste the text directly."
        );
      }

      onTextExtracted(data.text, data.name);
      setStatusMessage({
        type: "success",
        text: `Extracted ${data.wordCount || Math.round(data.characterCount / 5)} words from "${file.name}".`,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to parse file. Please paste your resume text manually.";
      setStatusMessage({
        type: "error",
        text: msg,
        showSamples: true,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-950/40 shadow-glow-indigo scale-[0.99]"
            : "border-slate-800 hover:border-indigo-500/70 hover:bg-slate-950/80 bg-slate-950/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.doc,.txt,.md,.json,.tex,.rtf,.html,.htm"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shadow-inner">
            {isParsing ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <span>📄</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {isParsing
                ? "Extracting resume text with multi-tier parser..."
                : "Drop your resume file here or click to browse"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports PDF, DOCX, DOC, TXT, MD, TeX, RTF, HTML & JSON
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`text-xs rounded-xl p-3.5 border space-y-2 ${
            statusMessage.type === "success"
              ? "text-emerald-300 bg-emerald-950/40 border-emerald-800/50 shadow-sm"
              : "text-rose-300 bg-rose-950/40 border-rose-800/50 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span>
              {statusMessage.type === "success" ? "✓ " : "⚠️ "}
              {statusMessage.text}
            </span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>

          {statusMessage.showSamples && (
            <div className="pt-2 border-t border-rose-800/40 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-rose-300">
                Quick options:
              </span>
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById(
                    "resumeText"
                  ) as HTMLTextAreaElement | null;
                  if (textarea) {
                    textarea.focus();
                    textarea.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-indigo-300 border border-indigo-500/30 hover:bg-slate-850 transition-colors"
              >
                📋 Paste text directly below
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
