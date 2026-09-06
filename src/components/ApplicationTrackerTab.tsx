"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { ApplicationStage, JobApplication } from "@/lib/types";

interface ApplicationTrackerTabProps {
  onOpenApplicationInStudio?: (app: JobApplication) => void;
  onNavigateToTab?: (tab: string) => void;
}

const STAGES: { id: ApplicationStage; label: string; icon: string; border: string; bg: string; badge: string }[] = [
  { id: "saved", label: "Saved / Target", icon: "📋", border: "border-slate-800", bg: "bg-slate-900/40", badge: "bg-slate-800 text-slate-300 border-slate-700" },
  { id: "tailored", label: "Tailored & Ready", icon: "⚡", border: "border-cyan-900/50", bg: "bg-cyan-950/20", badge: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60" },
  { id: "applied", label: "Applied", icon: "🚀", border: "border-indigo-900/50", bg: "bg-indigo-950/20", badge: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60" },
  { id: "interviewing", label: "Interviewing", icon: "🎙️", border: "border-amber-900/50", bg: "bg-amber-950/20", badge: "bg-amber-950/60 text-amber-300 border-amber-800/60" },
  { id: "offered", label: "Offer Received", icon: "🏆", border: "border-emerald-900/50", bg: "bg-emerald-950/20", badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60" },
  { id: "archived", label: "Archived / Closed", icon: "📁", border: "border-slate-800/60", bg: "bg-slate-950/30", badge: "bg-slate-900 text-slate-400 border-slate-800" },
];

export function ApplicationTrackerTab({
  onOpenApplicationInStudio,
  onNavigateToTab,
}: ApplicationTrackerTabProps) {
  const {
    applications,
    initApplications,
    addApplication,
    deleteApplication,
    setApplicationStage,
    saveCurrentWorkspaceAsApplication,
    loadApplicationIntoWorkspace,
    result,
    jd,
  } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newJd, setNewJd] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    initApplications();
  }, [initApplications]);

  const handleSaveCurrent = () => {
    const defaultCompany = result?.coverLetter?.companyName || "Target Company";
    const defaultRole = result?.coverLetter?.roleTitle || "Target Role";
    saveCurrentWorkspaceAsApplication({
      companyName: defaultCompany,
      roleTitle: defaultRole,
      notes: `Tailored with ${result?.providerUsed || "ResumePilot"} (Score: ${result?.match.overallScore || 85}%)`,
    });
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    addApplication({
      companyName: newCompany.trim(),
      roleTitle: newRole.trim(),
      jobDescription: newJd.trim(),
      stage: "saved",
      salaryEstimate: newSalary.trim() || undefined,
      location: newLocation.trim() || undefined,
      notes: newNotes.trim() || undefined,
    });

    setNewCompany("");
    setNewRole("");
    setNewSalary("");
    setNewLocation("");
    setNewNotes("");
    setNewJd("");
    setShowAddModal(false);
  };

  const handleOpenStudio = (app: JobApplication) => {
    loadApplicationIntoWorkspace(app.id);
    if (onOpenApplicationInStudio) {
      onOpenApplicationInStudio(app);
    } else if (onNavigateToTab) {
      onNavigateToTab("resume");
    }
  };

  const filteredApps = applications.filter((a) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      a.companyName.toLowerCase().includes(q) ||
      a.roleTitle.toLowerCase().includes(q) ||
      (a.location && a.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="card card-accent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Job Application Pipeline & Tracker
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Kanban
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Track applications from target discovery through tailoring, submissions, and STAR interview prep.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {jd.jobDescription.trim().length > 20 && (
            <button
              type="button"
              onClick={handleSaveCurrent}
              className="btn-secondary text-xs"
              title="Save current workspace as a tracked application"
            >
              💾 Bookmark Current Workspace
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs"
          >
            + Add New Application
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-slate-400 font-medium">
          Total Tracked: <strong className="text-cyan-400">{applications.length}</strong> applications
        </div>
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="input-field text-xs py-1.5 px-3 max-w-[240px]"
        />
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {STAGES.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.stage === stage.id);

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border ${stage.border} ${stage.bg} backdrop-blur-md p-3.5 space-y-3 min-h-[360px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200">
                  <span>{stage.icon}</span>
                  <span>{stage.label}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border shadow-xs ${stage.badge}`}>
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 flex-1">
                {stageApps.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No applications in this stage.
                  </div>
                )}

                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 shadow-md hover:border-slate-700 hover:shadow-cyan-950/20 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 leading-snug">
                          {app.roleTitle}
                        </h4>
                        <p className="text-[11px] font-semibold text-cyan-400 mt-0.5">
                          {app.companyName}
                        </p>
                      </div>

                      {app.matchScore && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold shrink-0">
                          {app.matchScore}%
                        </span>
                      )}
                    </div>

                    {(app.location || app.salaryEstimate) && (
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                        {app.location && <span>📍 {app.location}</span>}
                        {app.salaryEstimate && <span>💰 {app.salaryEstimate}</span>}
                      </div>
                    )}

                    {app.appliedDate && (
                      <p className="text-[10px] text-slate-500">
                        Applied: {app.appliedDate}
                      </p>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-950/60 p-1.5 rounded-md border border-slate-800/80">
                        &quot;{app.notes}&quot;
                      </p>
                    )}

                    {/* Stage Switcher & Studio Button */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                      <select
                        value={app.stage}
                        onChange={(e) => setApplicationStage(app.id, e.target.value as ApplicationStage)}
                        className="text-[10px] rounded-lg border border-slate-800 bg-slate-950 px-1.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenStudio(app)}
                          className="px-2 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-[10px] font-semibold border border-indigo-800/60 transition-colors"
                          title="Open tailored resume & cover letter"
                        >
                          ⚡ Open
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteApplication(app.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-1 transition-colors"
                          title="Delete card"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-lg w-full space-y-4 shadow-2xl border border-slate-800 bg-slate-900/95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                + Track New Job Application
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Stripe"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Staff Backend Engineer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. $180k - $220k"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / San Francisco"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Job Description (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Paste the target job posting text to enable keyword matching..."
                  value={newJd}
                  onChange={(e) => setNewJd(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Referred by Alex; hiring manager is Sarah"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Application Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
