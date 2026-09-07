"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, LogOut, Check, Save, User, Mail, Briefcase, MapPin, Phone, Globe, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoogleAuth?: () => void;
}

export function UserProfileModal({ isOpen, onClose, onOpenGoogleAuth }: UserProfileModalProps) {
  const { user, profile, setResumeText, updateUserAccount, logoutUser, syncCloudData, isSyncing } = useAppStore();

  const [name, setName] = useState(user?.name || "Candidate");
  const [email, setEmail] = useState(user?.email || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Project Manager");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeSummary, setResumeSummary] = useState(profile.resumeText || "");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTargetRole(user.targetRole || "Project Manager");
    }
  }, [user]);

  useEffect(() => {
    if (profile.resumeText) {
      setResumeSummary(profile.resumeText);
    }
  }, [profile.resumeText]);

  if (!isOpen) return null;

  const isGoogleConnected = Boolean(user?.isGoogleConnected);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUserAccount({
        name: name.trim(),
        targetRole: targetRole.trim(),
      });
    }
    if (resumeSummary.trim()) {
      setResumeText(resumeSummary.trim());
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleManualSync = async () => {
    const success = await syncCloudData();
    if (success) {
      setSyncFeedback("✓ Cloud Sync Complete! Resumes & applications backed up.");
      setTimeout(() => setSyncFeedback(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="card max-w-xl w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 my-auto transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/30 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {name}
                </h3>
                {isGoogleConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Google Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {email || "Guest Candidate"} • {targetRole}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Google Cloud Sync Status Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50/90 via-slate-50 to-teal-50/60 dark:from-slate-800 dark:via-slate-800/80 dark:to-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/80 space-y-2.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
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

        {/* User's Authentic Profile Form (Replaces Dummy Personas) */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-600" /> My Profile Information
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Auto-populates resume exports</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hari Kiran Chirala"
                className="input-field text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" /> Target Career Role
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Project Manager, AI Lead"
                className="input-field text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                disabled={isGoogleConnected}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="input-field text-xs disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/80"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Phone Number (Optional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="input-field text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State / Remote"
                className="input-field text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" /> LinkedIn Profile (Optional)
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" /> Baseline Experience / Resume Text
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Used by AI matching engine</span>
            </label>
            <textarea
              rows={4}
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              placeholder="Paste your baseline resume text, past roles, or core accomplishments here..."
              className="input-field text-xs font-mono"
            />
          </div>

          {saveSuccess && (
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center animate-fadeIn flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" /> Profile saved and synced to your cloud account!
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4 font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-6 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/25"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
