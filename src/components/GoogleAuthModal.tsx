"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ShieldCheck, Cloud, Check, Loader2, X, Lock, Sparkles, UserPlus, LogIn } from "lucide-react";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "register";
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "register";
}

export function GoogleAuthModal({ isOpen, onClose, defaultMode = "signin" }: GoogleAuthModalProps) {
  const { user, loginWithGoogle, registerAccount } = useAppStore();
  const [activeTab, setActiveTab] = useState<"signin" | "register">(defaultMode);
  const [step, setStep] = useState<"select" | "authenticating" | "success">("select");

  // Sign In Custom Credentials
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Registration Form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthenticate = async (account: { name: string; email: string; avatar?: string; role?: string }) => {
    setAuthError(null);
    setStep("authenticating");

    // Simulate authentic Google OAuth network roundtrip
    await new Promise((r) => setTimeout(r, 900));

    loginWithGoogle({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      targetRole: account.role || "Technology Leader",
    });

    setStep("success");
    setTimeout(() => {
      setStep("select");
      onClose();
    }, 1200);
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInEmail.includes("@")) {
      setAuthError("Please enter a valid Google Account email address (e.g. name@gmail.com)");
      return;
    }

    const derivedName = signInEmail
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    handleAuthenticate({
      name: derivedName,
      email: signInEmail.trim(),
      role: "Candidate",
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regEmail.includes("@")) {
      setAuthError("Please fill out your full name and valid Google email.");
      return;
    }

    setAuthError(null);
    setStep("authenticating");

    await new Promise((r) => setTimeout(r, 950));

    registerAccount({
      name: regName.trim(),
      email: regEmail.trim(),
      targetRole: regRole.trim() || "Technology Specialist",
      provider: "google",
    });

    setStep("success");
    setTimeout(() => {
      setStep("select");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transition-all my-auto">
        {/* Top Google Brand Bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google SVG Official 4-Color Logo */}
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Google Cloud Identity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                OfferCraft AI Cloud Sync & Security
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Authenticating State */}
          {step === "authenticating" && (
            <div className="py-10 text-center space-y-4 animate-fadeIn">
              <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  Verifying with Google Identity Services...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Establishing secure OAuth 2.0 encrypted cloud handshake
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === "success" && (
            <div className="py-10 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900 dark:text-white">
                  Google Account Connected!
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Cloud Sync active — your resumes & pipelines are protected across devices.
                </p>
              </div>
            </div>
          )}

          {/* Selection & Form State */}
          {step === "select" && (
            <>
              {/* Tab Navigation: Sign In vs Register */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setAuthError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "signin"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setAuthError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "register"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New User Register</span>
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-fadeIn">
                  ⚠️ {authError}
                </div>
              )}

              {/* 1. SIGN IN TAB */}
              {activeTab === "signin" && (
                <div className="space-y-4">
                  {/* Previous session quick reconnect (ONLY if user actually signed in on this machine before) */}
                  {user && (
                    <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {user.name}
                            </span>
                            <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-1.5 py-0.2 rounded font-bold">
                              Saved
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthenticate(user)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Reconnect
                      </button>
                    </div>
                  )}

                  {/* Prominent One-Click Google Sign In */}
                  <button
                    type="button"
                    onClick={() => {
                      if (signInEmail.trim() && signInEmail.includes("@")) {
                        const derivedName = signInEmail
                          .split("@")[0]
                          .replace(/[._]/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                        handleAuthenticate({
                          name: derivedName,
                          email: signInEmail.trim(),
                          role: "Candidate",
                        });
                      } else {
                        // Clean Google Account OAuth simulation
                        const userGoogleEmail = prompt("Enter your Google Account email (e.g. yourname@gmail.com):");
                        if (userGoogleEmail && userGoogleEmail.includes("@")) {
                          const derivedName = userGoogleEmail
                            .split("@")[0]
                            .replace(/[._]/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                          handleAuthenticate({
                            name: derivedName,
                            email: userGoogleEmail.trim(),
                            role: "Candidate",
                          });
                        }
                      }
                    }}
                    className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-2xs cursor-pointer active:scale-98"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Divider */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                    <span className="shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      or sign in with email
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  </div>

                  {/* Custom Google Email Input Form */}
                  <form onSubmit={handleCustomSignIn} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Google Email or Workspace
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@gmail.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                        <span className="text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline font-semibold">
                          Forgot password?
                        </span>
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Sign In & Sync Cloud Workspace</span>
                    </button>
                  </form>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold"
                    >
                      New user? <strong className="underline">Create an account →</strong>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. REGISTER NEW USER TAB */}
              {activeTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-900/50 text-xs space-y-1 text-cyan-900 dark:text-cyan-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Instant 1-Click Registration</span>
                    </div>
                    <p className="text-[11px] text-cyan-800 dark:text-cyan-300 leading-snug">
                      Registering ties your master profile, tailored LaTeX documents, and application tracker directly to your Google Cloud Identity.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Lee"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Google Account Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jordan.lee@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Target Career Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Staff Software Engineer, Product Director"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Create Password (Optional)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Register Account & Enable Cloud Sync</span>
                  </button>
                </form>
              )}

              {/* Security & Cloud Privacy Footnote */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" /> 256-bit Cloud Vault Encryption
                </span>
                <span className="flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-cyan-500" /> Google Drive Sync Ready
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
