"use client";

import { useEffect, useState } from "react";
import { FileText, Save, User, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { profile, setResumeText } = useAppStore();
  const [resumeText, setResumeTextLocal] = useState(profile.resumeText);
  const [saved, setSaved] = useState(false);

  useEffect(() => setResumeTextLocal(profile.resumeText), [profile.resumeText]);

  if (!isOpen) return null;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setResumeText(resumeText.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><User className="h-5 w-5" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Local workspace profile</h2>
              <p className="text-xs text-slate-500">No account or cloud sync is enabled in this beta.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={save} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Master résumé text</span>
            <textarea value={resumeText} onChange={(e) => setResumeTextLocal(e.target.value)} rows={12} className="input-field w-full text-sm" placeholder="Paste your résumé or experience bank here…" />
          </label>
          {saved && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Saved to this browser.</p>}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary">Close</button>
            <button type="submit" className="btn-primary flex items-center gap-2"><Save className="h-4 w-4" /> Save locally</button>
          </div>
        </form>
      </div>
    </div>
  );
}
