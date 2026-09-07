"use client";

import { useState } from "react";
import { Check, ShieldCheck, Briefcase, Plus, RefreshCw, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoogleAuth?: () => void;
}

interface Persona {
  id: string;
  name: string;
  email: string;
  title: string;
  resumeSnippet: string;
  targetRole: string;
  avatarColor: string;
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: "p1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    title: "Senior Full Stack & Cloud Architect",
    targetRole: "Cloud / Full Stack Lead",
    avatarColor: "bg-cyan-600",
    resumeSnippet: "Results-driven Staff Engineer with 8+ years architecting microservices, Node.js, AWS, and RAG pipelines.",
  },
  {
    id: "p2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    title: "AI Transformation & Technical Program Manager",
    targetRole: "AI TPM / GenAI Lead",
    avatarColor: "bg-teal-600",
    resumeSnippet: "Senior TPM with 7+ years orchestrating GenAI adoption, Agile governance, and cloud migration roadmaps.",
  },
  {
    id: "p3",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    title: "B2B SaaS Product Manager & Growth Strategist",
    targetRole: "Senior Product Manager",
    avatarColor: "bg-emerald-600",
    resumeSnippet: "Product Leader with 6+ years driving SaaS GTM launches, A/B experimentation, and OKR retention growth.",
  },
];

export function UserProfileModal({ isOpen, onClose, onOpenGoogleAuth }: UserProfileModalProps) {
  const { setResumeText, setProfileMode, user, logoutUser, syncCloudData, isSyncing } = useAppStore();
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("p1");
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form fields for new persona
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSnippet, setNewSnippet] = useState("");

  if (!isOpen) return null;

  const currentPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];
  const activeName = user?.name || currentPersona.name;
  const activeEmail = user?.email || currentPersona.email;
  const isGoogleConnected = Boolean(user?.isGoogleConnected);

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersonaId(persona.id);
    setProfileMode("resumeText");
    setResumeText(persona.resumeSnippet);
  };

  const handleAddPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSnippet.trim()) return;

    const created: Persona = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      title: newTitle.trim() || "Candidate Persona",
      targetRole: newTitle.trim() || "Target Role",
      avatarColor: "bg-cyan-600",
      resumeSnippet: newSnippet.trim(),
    };

    setPersonas((prev) => [...prev, created]);
    handleSelectPersona(created);
    setShowAddForm(false);
    setNewName("");
    setNewTitle("");
    setNewEmail("");
    setNewSnippet("");
  };

  const handleManualSync = async () => {
    const success = await syncCloudData();
    if (success) {
      setSyncFeedback("✓ Cloud Sync Complete! Resumes & applications synced.");
      setTimeout(() => setSyncFeedback(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="card max-w-xl w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              {activeName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeName}</h3>
                {isGoogleConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Google Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Google Cloud Sync Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50/90 via-slate-50 to-teal-50/60 dark:from-slate-800 dark:via-slate-800/80 dark:to-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/80 space-y-2.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Google Official 4-Color SVG */}
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Google Account Cloud Sync
                  </span>
                  {isGoogleConnected ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  {isGoogleConnected
                    ? `Synced to ${user?.email} • Last backup: ${user?.lastSyncedAt || "Just now"}`
                    : "Sign in with Google to protect your resumes & sync across all devices."}
                </p>
              </div>
            </div>

            {isGoogleConnected ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleManualSync}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Synchronize all workspaces with Google Cloud Vault"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGoogleAuth?.();
                  }}
                  className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Switch
                </button>

                <button
                  type="button"
                  onClick={logoutUser}
                  className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                  title="Sign out of Google Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGoogleAuth?.();
                }}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
              >
                <span>Sign In with Google</span>
              </button>
            )}
          </div>

          {syncFeedback && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center animate-fadeIn">
              {syncFeedback}
            </p>
          )}
        </div>

        {/* Persona Switcher Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-600" /> Saved Candidate Personas ({personas.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-cyan-600 hover:text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Persona
            </button>
          </div>

          {/* Personas List */}
          <div className="grid grid-cols-1 gap-2.5">
            {personas.map((persona) => {
              const isSelected = selectedPersonaId === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-500 shadow-xs ring-2 ring-cyan-500/20"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${persona.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                      {persona.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{persona.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                          {persona.targetRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{persona.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 italic pt-0.5">
                        &quot;{persona.resumeSnippet}&quot;
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-1 rounded-lg bg-cyan-600 text-white text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Persona Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddPersona} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn text-xs">
            <h5 className="font-bold text-slate-900 dark:text-white">+ Create Custom Candidate Persona</h5>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Jordan Lee)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field text-xs"
              />
              <input
                type="text"
                placeholder="Target Role (e.g. Lead DevOps Engineer)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="input-field text-xs"
            />
            <textarea
              rows={3}
              required
              placeholder="Paste master resume experience text..."
              value={newSnippet}
              onChange={(e) => setNewSnippet(e.target.value)}
              className="input-field text-xs font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-1.5 px-4 font-bold">
                Save & Select Persona
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Active Identity: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{activeName}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs py-2 px-5 font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
