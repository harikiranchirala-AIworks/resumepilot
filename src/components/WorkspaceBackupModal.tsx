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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="card max-w-md w-full space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <h3 className="text-base font-bold text-brand-900">
              Workspace Backup & Restore
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            Export and save your entire ResumePilot workspace including your saved profiles ({library.length}), application tracker records ({applications.length}), and settings.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Export Box */}
          <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-brand-900">Download Backup File</h4>
              <p className="text-[11px] text-slate-500">JSON snapshot of all local data</p>
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
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Restore from Backup</h4>
              <p className="text-[11px] text-slate-500">Upload a previously saved JSON file</p>
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
          <p className="text-xs text-center font-semibold text-brand-700 bg-brand-50 p-2 rounded-lg border border-brand-200">
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
