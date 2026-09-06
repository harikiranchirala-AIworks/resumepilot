"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RESUME_TEMPLATES } from "@/lib/latex";
import { latexToHtml } from "@/lib/latexToHtml";
import { useAppStore } from "@/lib/store";
import type { ResumeTemplateId } from "@/lib/types";
import { SectionCoPilot } from "./SectionCoPilot";
import { KeywordGapMatrix } from "./KeywordGapMatrix";
import BulletBankModal from "./BulletBankModal";

type PreviewMode = "preview" | "pdf" | "source";
type PdfSource = "server" | "client" | null;

interface ResumePdfPreviewProps {
  latex: string;
  summary: string;
  highlights: string[];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  downloadBlob(blob, filename);
}

export function ResumePdfPreview({
  latex,
  summary,
  highlights,
}: ResumePdfPreviewProps) {
  const {
    selectedTemplate,
    changeTemplate,
    editableLatex,
    setEditableLatex,
    pageFitSettings,
    setPageFitSettings,
    jd,
  } = useAppStore();

  const [mode, setMode] = useState<PreviewMode>("preview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSource, setPdfSource] = useState<PdfSource>(null);
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLatex, setActiveLatex] = useState(editableLatex || latex);
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Drawer toggles
  const [showCoPilot, setShowCoPilot] = useState(false);
  const [showKeywordMatrix, setShowKeywordMatrix] = useState(false);
  const [showSpacingTuner, setShowSpacingTuner] = useState(false);
  const [showBulletBank, setShowBulletBank] = useState(false);

  const handleInsertBullet = (bulletText: string) => {
    const escaped = bulletText
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/&/g, "\\&")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_");
    const latexItem = `    \\item ${escaped}`;

    let newLatex = activeLatex;
    const itemizeIdx = newLatex.indexOf("\\begin{itemize}");
    if (itemizeIdx !== -1) {
      const insertPos = itemizeIdx + "\\begin{itemize}".length;
      newLatex = newLatex.slice(0, insertPos) + "\n" + latexItem + newLatex.slice(insertPos);
    } else {
      newLatex = newLatex + "\n" + latexItem;
    }

    setActiveLatex(newLatex);
    setEditableLatex(newLatex);
  };

  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latex) {
      setActiveLatex(latex);
      setEditableLatex(latex);
    }
  }, [latex, setEditableLatex]);

  const renderedHtml = latexToHtml(activeLatex, selectedTemplate);

  /** Client-side PDF generation using html2canvas & jsPDF */
  const generateClientPdf = useCallback(async (): Promise<Blob | null> => {
    if (!previewContainerRef.current) return null;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(previewContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgWidth = 210; // A4 mm
      const pageHeight = 297; // A4 mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;
      let heightLeft = imgHeight;

      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const blob = pdf.output("blob");
      return blob;
    } catch (err) {
      console.error("Client PDF generation error:", err);
      return null;
    }
  }, []);

  /** Build or compile PDF for preview & download */
  const buildPdf = useCallback(async () => {
    setIsBuildingPdf(true);
    setError(null);

    // Try server-side pdflatex first
    try {
      const res = await fetch("/api/compile-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: activeLatex }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlob(blob);
        setPdfUrl(url);
        setPdfSource("server");
        setIsBuildingPdf(false);
        return;
      }
    } catch {
      // Fall through to client engine
    }

    // Client engine fallback
    const clientBlob = await generateClientPdf();
    if (clientBlob) {
      const url = URL.createObjectURL(clientBlob);
      setPdfBlob(clientBlob);
      setPdfUrl(url);
      setPdfSource("client");
    } else {
      setError("PDF compiler is initializing. Use 'Print / Save as PDF' or 'Download .tex' as immediate alternative.");
    }
    setIsBuildingPdf(false);
  }, [activeLatex, generateClientPdf]);

  const handleDownloadPdf = async () => {
    if (pdfBlob) {
      downloadBlob(pdfBlob, "tailored-resume.pdf");
      return;
    }

    setIsBuildingPdf(true);
    const blob = await generateClientPdf();
    if (blob) {
      downloadBlob(blob, "tailored-resume.pdf");
    } else {
      window.print();
    }
    setIsBuildingPdf(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyLatexEdit = () => {
    setEditableLatex(activeLatex);
    buildPdf();
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(activeLatex);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const tabClass = (active: boolean) =>
    `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
      active
        ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
    }`;

  // Apply page fit margin classes
  let marginPaddingClass = "p-8";
  if (pageFitSettings.margin === "tight") {
    marginPaddingClass = "p-5";
  } else if (pageFitSettings.margin === "relaxed") {
    marginPaddingClass = "p-10";
  }

  return (
    <div className="card space-y-4">
      {/* Header with summary & download action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Tailored Resume Output</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold shadow-sm">
              ATS Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">{summary}</p>
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full bg-slate-950/60 border border-slate-800 text-indigo-300 text-[11px]"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={handleDownloadPdf}
            disabled={isBuildingPdf}
          >
            {isBuildingPdf ? "⏳ Generating..." : "📥 Download PDF"}
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={handlePrint}
            title="Print or Save via high-resolution browser print engine"
          >
            🖨️ Print / Save
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() =>
              downloadFile(activeLatex, "tailored-resume.tex", "application/x-tex")
            }
          >
            📄 .tex
          </button>
        </div>
      </div>

      {/* Auxiliary Co-Pilot & Spacing Tool Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCoPilot(!showCoPilot)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showCoPilot
                ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white"
            }`}
          >
            ⚡ Section AI Co-Pilot
          </button>

          <button
            type="button"
            onClick={() => setShowKeywordMatrix(!showKeywordMatrix)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showKeywordMatrix
                ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white"
            }`}
          >
            🎯 Keyword Gap Matrix
          </button>

          <button
            type="button"
            onClick={() => setShowSpacingTuner(!showSpacingTuner)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showSpacingTuner
                ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-400/40"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white"
            }`}
          >
            📏 1-Page Length Tuner
          </button>

          <button
            type="button"
            onClick={() => setShowBulletBank(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-indigo-950/50 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-500/40 shadow-sm"
          >
            💎 60-Bullet Bank (Excel)
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
          Template: <strong className="text-white capitalize">{selectedTemplate.replace("-", " ")}</strong>
        </span>
      </div>

      {/* Drawer 1: Section AI Co-Pilot */}
      {showCoPilot && (
        <div className="animate-fadeIn">
          <SectionCoPilot />
        </div>
      )}

      {/* Drawer 2: Keyword Gap Matrix */}
      {showKeywordMatrix && (
        <div className="animate-fadeIn">
          <KeywordGapMatrix />
        </div>
      )}

      {/* Drawer 3: 1-Page Length Optimizer & Spacing Tuner */}
      {showSpacingTuner && (
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 animate-fadeIn no-print shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">
              📏 1-Page Strict Length & Spacing Tuner
            </h4>
            <span className="text-[11px] text-slate-400">
              Adjust spacing parameters to fit perfectly on 1 page without 2-line spills.
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Margin Padding:
              </label>
              <div className="flex gap-1">
                {(["tight", "standard", "relaxed"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPageFitSettings({ margin: m })}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg capitalize border transition-all ${
                      pageFitSettings.margin === m
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-glow-indigo"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Item Spacing:
              </label>
              <div className="flex gap-1">
                {(["tight", "normal", "relaxed"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPageFitSettings({ itemSpacing: s })}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg capitalize border transition-all ${
                      pageFitSettings.itemSpacing === s
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-glow-indigo"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  setPageFitSettings({
                    margin: "tight",
                    itemSpacing: "tight",
                    lineSpacing: "tight",
                  })
                }
                className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors"
              >
                ⚡ Auto-Fit to Exactly 1 Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template selector & preview mode bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-800/80 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Style Template:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => changeTemplate(e.target.value as ResumeTemplateId)}
            className="text-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {RESUME_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name} ({tmpl.description.slice(0, 30)}…)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            className={tabClass(mode === "preview")}
            onClick={() => setMode("preview")}
          >
            ✨ Live Preview
          </button>
          <button
            type="button"
            className={tabClass(mode === "pdf")}
            onClick={() => {
              setMode("pdf");
              if (!pdfUrl) buildPdf();
            }}
          >
            📄 PDF View
          </button>
          <button
            type="button"
            className={tabClass(mode === "source")}
            onClick={() => setMode("source")}
          >
            💻 LaTeX Source
          </button>
        </div>
      </div>

      {/* Mode 1: Live Formatted Resume Preview */}
      {mode === "preview" && (
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-8 overflow-auto max-h-[min(85vh,900px)] shadow-2xl">
          <div
            ref={previewContainerRef}
            className={`${marginPaddingClass} bg-white text-slate-900 shadow-2xl rounded-xl relative max-w-3xl mx-auto border border-slate-200`}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />

          {/* Visual Page 1 cutoff indicator */}
          <div className="mt-8 border-t-2 border-dashed border-amber-500/50 pt-1 text-center text-[11px] font-bold text-amber-400 bg-amber-950/30 p-2 rounded-xl no-print border border-amber-800/30 max-w-3xl mx-auto">
            ✂️ Approximate Page 1 Cutoff Boundary (A4 Standard Height)
          </div>
        </div>
      )}

      {/* Mode 2: Compiled PDF Iframe View */}
      {mode === "pdf" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden min-h-[500px] shadow-2xl">
          {pdfSource && (
            <div className="bg-slate-900 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800">
              <span>
                Engine: <strong className="text-white">{pdfSource === "server" ? "Vector pdflatex" : "Client HTML2Canvas + jsPDF"}</strong>
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                🖨️ Direct High-Res Print
              </button>
            </div>
          )}
          {isBuildingPdf && (
            <div className="flex flex-col items-center justify-center h-[520px] text-xs text-indigo-400 gap-2">
              <span className="animate-spin text-lg">⏳</span>
              <span>Rendering PDF document...</span>
            </div>
          )}
          {!isBuildingPdf && error && (
            <div className="p-6 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-xl space-y-2 m-4">
              <p>{error}</p>
              <button
                type="button"
                className="btn-primary text-xs"
                onClick={handlePrint}
              >
                🖨️ Use Print / Save as PDF Engine
              </button>
            </div>
          )}
          {!isBuildingPdf && pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-[650px] border-0 rounded-b-2xl bg-white"
              title="Tailored Resume PDF Preview"
            />
          )}
        </div>
      )}

      {/* Mode 3: LaTeX Source Code Editor */}
      {mode === "source" && (
        <div className="space-y-2 no-print">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Live editable LaTeX source. Modify sections and click Re-compile.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLatex}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {copiedLatex ? "✓ Copied" : "📋 Copy"}
              </button>
              <button
                type="button"
                onClick={handleApplyLatexEdit}
                className="btn-primary text-xs py-1 px-3"
              >
                ⚡ Re-compile
              </button>
            </div>
          </div>
          <textarea
            rows={22}
            value={activeLatex}
            onChange={(e) => setActiveLatex(e.target.value)}
            className="w-full rounded-xl bg-slate-950 text-emerald-300 p-4 text-xs font-mono leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      )}

      {/* Curated 60-Bullet Bank Modal */}
      <BulletBankModal
        isOpen={showBulletBank}
        onClose={() => setShowBulletBank(false)}
        jdText={jd.jobDescription}
        onInsertBullet={handleInsertBullet}
      />
    </div>
  );
}
