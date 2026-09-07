"use client";

import { useState } from "react";
import { Check, ShieldCheck, Briefcase, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    avatarColor: "bg-indigo-600",
    resumeSnippet: "Results-driven Staff Engineer with 8+ years architecting microservices, Node.js, AWS, and RAG pipelines.",
  },
  {
    id: "p2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    title: "AI Transformation & Technical Program Manager",
    targetRole: "AI TPM / GenAI Lead",
    avatarColor: "bg-purple-600",
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

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { setResumeText, setProfileMode } = useAppStore();
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("p1");
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form fields for new persona
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSnippet, setNewSnippet] = useState("");

  if (!isOpen) return null;

  const currentPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="card max-w-xl w-full space-y-5 shadow-2xl border border-slate-200 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${currentPersona.avatarColor} text-white flex items-center justify-center font-black text-base shadow-sm`}>
              {currentPersona.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentPersona.name}</h3>
                {isGoogleConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Google Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{currentPersona.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-sm p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Google OAuth Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-white text-indigo-700 font-black flex items-center justify-center shadow-2xs">
              G
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Google Account Cloud Sync</span>
              <span className="text-[11px] text-slate-600 font-medium">Your tailored resumes & application pipelines sync across devices.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGoogleConnected(!isGoogleConnected)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors shrink-0 shadow-2xs"
          >
            {isGoogleConnected ? "Connected ✓" : "Connect Google"}
          </button>
        </div>

        {/* Persona Switcher Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" /> Saved Candidate Personas ({personas.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
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
                      ? "bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${persona.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                      {persona.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{persona.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-bold">
                          {persona.targetRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">{persona.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 italic pt-0.5">
                        &quot;{persona.resumeSnippet}&quot;
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs">
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
          <form onSubmit={handleAddPersona} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn text-xs">
            <h5 className="font-bold text-slate-900">+ Create Custom Candidate Persona</h5>
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
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Active Workspace: <strong className="text-indigo-700">{currentPersona.name}</strong>
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
