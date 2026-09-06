"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RESUME_TEMPLATES } from "@/lib/latex";
import { latexToHtml } from "@/lib/latexToHtml";
import { useAppStore } from "@/lib/store";
import type { ResumeTemplateId } from "@/lib/types";

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
  const { selectedTemplate, changeTemplate, editableLatex, setEditableLatex } = useAppStore();
  const [mode, setMode] = useState<PreviewMode>("preview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSource, setPdfSource] = useState<PdfSource>(null);
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLatex, setActiveLatex] = useState(editableLatex || latex);
  const [copiedLatex, setCopiedLatex] = useState(false);

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
    `px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
      active
        ? "bg-brand-600 text-white shadow-sm"
        : "text-brand-700 hover:bg-brand-50"
    }`;

  return (
    <div className="card space-y-4">
      {/* Header with summary & download action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-brand-900">Tailored Resume Output</h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
              ATS Compliant
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">{summary}</p>
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px]"
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

      {/* Template selector & preview mode bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-brand-100 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Style Template:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => changeTemplate(e.target.value as ResumeTemplateId)}
            className="text-xs rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 font-medium text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {RESUME_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name} ({tmpl.description.slice(0, 30)}…)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-brand-50 rounded-xl border border-brand-100">
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
        <div className="rounded-xl border border-brand-200 bg-slate-100/60 p-4 sm:p-8 overflow-auto max-h-[min(85vh,900px)] shadow-inner">
          <div
            ref={previewContainerRef}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      )}

      {/* Mode 2: Compiled PDF Iframe View */}
      {mode === "pdf" && (
        <div className="rounded-xl border border-brand-200 bg-slate-100 overflow-hidden min-h-[500px]">
          {pdfSource && (
            <div className="bg-slate-200/70 px-4 py-1.5 text-[11px] text-slate-600 flex items-center justify-between border-b border-slate-300">
              <span>
                Engine: {pdfSource === "server" ? "Vector pdflatex" : "Client HTML2Canvas + jsPDF"}
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="text-brand-700 font-medium hover:underline"
              >
                🖨️ Direct High-Res Print
              </button>
            </div>
          )}
          {isBuildingPdf && (
            <div className="flex flex-col items-center justify-center h-[520px] text-xs text-brand-700 gap-2">
              <span className="animate-spin text-lg">⏳</span>
              <span>Rendering PDF document...</span>
            </div>
          )}
          {!isBuildingPdf && error && (
            <div className="p-6 text-xs text-rose-700 bg-rose-50 space-y-2">
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
              title="Resume PDF preview"
              src={pdfUrl}
              className="w-full h-[min(80vh,750px)] bg-white shadow-inner"
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
                className="text-xs text-brand-600 hover:text-brand-800 font-medium"
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
            className="w-full rounded-xl bg-slate-950 text-emerald-300 p-4 text-xs font-mono leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}
    </div>
  );
}
