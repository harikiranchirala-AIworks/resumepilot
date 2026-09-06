"use client";

import { useRef, useState } from "react";
import { useAppStore } from "@/lib/store";

interface WorkspaceBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceBackupModal({ isOpen, onClose }: WorkspaceBackupModalProps) {
  const { exportWorkspaceJson, importWorkspaceJson, applications, library } = useAppStore();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = exportWorkspaceJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `resumepilot-workspace-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = importWorkspaceJson(text);
      if (success) {
        setImportStatus("✓ Workspace successfully restored from backup!");
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } else {
        setImportStatus("⚠️ Invalid backup JSON file structure.");
      }
    } catch {
      setImportStatus("⚠️ Could not read or parse the selected backup file.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="card max-w-md w-full space-y-5 shadow-2xl border border-slate-800 bg-slate-900/95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <h3 className="text-base font-bold text-white">
              Workspace Backup & Restore
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            Export and save your entire ResumePilot workspace including your saved profiles (<strong className="text-cyan-400">{library.length}</strong>), application tracker records (<strong className="text-indigo-400">{applications.length}</strong>), and custom formulas.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Export Box */}
          <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-cyan-300">Download Backup File</h4>
              <p className="text-[11px] text-slate-400">JSON snapshot of all local data</p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="btn-primary text-xs py-1.5 px-3 shrink-0"
            >
              📥 Export JSON
            </button>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Restore from Backup</h4>
              <p className="text-[11px] text-slate-400">Upload a previously saved JSON file</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-xs py-1.5 px-3 shrink-0"
            >
              📤 Import JSON
            </button>
          </div>
        </div>

        {importStatus && (
          <p className="text-xs text-center font-semibold text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/60">
            {importStatus}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
