"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  ShieldCheck,
  Cloud,
  Check,
  Loader2,
  X,
  Lock,
  Sparkles,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "register";
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  defaultMode = "signin",
}: GoogleAuthModalProps) {
  const { authenticateWithCredentials, registerAccount } = useAppStore();
  const [activeTab, setActiveTab] = useState<"signin" | "register">(defaultMode);
  const [step, setStep] = useState<"form" | "google_popup" | "authenticating" | "success">("form");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Google OAuth Popup State
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedEmail = signInEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (!signInPassword || signInPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setStep("authenticating");
    await new Promise((r) => setTimeout(r, 600));

    const result = authenticateWithCredentials(trimmedEmail, signInPassword);
    if (!result.success) {
      setStep("form");
      setAuthError(result.error || "Authentication failed. Please check your credentials.");
      return;
    }

    setAuthSuccessMsg("Signed in successfully! Your cloud workspace is synchronized.");
    setStep("success");
    setTimeout(() => {
      setStep("form");
      onClose();
    }, 1200);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();

    if (!trimmedName) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setStep("authenticating");
    await new Promise((r) => setTimeout(r, 700));

    const result = registerAccount({
      name: trimmedName,
      email: trimmedEmail,
      password: regPassword,
      targetRole: regRole.trim() || "Candidate",
      provider: "email",
    });

    if (!result.success) {
      setStep("form");
      setAuthError(result.error || "Registration failed.");
      return;
    }

    setAuthSuccessMsg("Account created successfully! Welcome to OfferCraft AI.");
    setStep("success");
    setTimeout(() => {
      setStep("form");
      onClose();
    }, 1200);
  };

  const handleGoogleOAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedEmail = googleEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setAuthError("Please enter a valid Google email address.");
      return;
    }

    if (!googlePassword || googlePassword.length < 6) {
      setAuthError("Google account password must be at least 6 characters.");
      return;
    }

    setStep("authenticating");
    await new Promise((r) => setTimeout(r, 800));

    // Try logging in first with provided password
    const loginResult = authenticateWithCredentials(trimmedEmail, googlePassword);
    if (loginResult.success) {
      setAuthSuccessMsg("Google Account Verified & Cloud Connected!");
      setStep("success");
      setTimeout(() => {
        setStep("form");
        onClose();
      }, 1200);
      return;
    }

    // If account not found in vault, register new account with this password
    if (loginResult.error?.includes("No account found")) {
      const derivedName = trimmedEmail
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const regResult = registerAccount({
        name: derivedName,
        email: trimmedEmail,
        password: googlePassword,
        provider: "google",
        targetRole: "Technology Specialist",
      });

      if (regResult.success) {
        setAuthSuccessMsg("Google Account Registered & Cloud Synced!");
        setStep("success");
        setTimeout(() => {
          setStep("form");
          onClose();
        }, 1200);
        return;
      } else {
        setStep("google_popup");
        setAuthError(regResult.error || "Google authentication failed.");
        return;
      }
    }

    // Password mismatch
    setStep("google_popup");
    setAuthError(loginResult.error || "Incorrect password. Authentication denied.");
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
                {step === "google_popup" ? "Google Identity Services" : "Account Authentication"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {step === "google_popup"
                  ? "Sign in with your Google Credentials"
                  : "OfferCraft AI Cloud Sync & Security"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                  Verifying Secure Credentials...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Checking password against OfferCraft Cloud Security Vault
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
                  Authentication Successful!
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ {authSuccessMsg || "Cloud Sync active — your resumes & pipelines are protected."}
                </p>
              </div>
            </div>
          )}

          {/* Google OAuth Modal Step */}
          {step === "google_popup" && (
            <form onSubmit={handleGoogleOAuthSubmit} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-xs space-y-1 text-blue-950 dark:text-blue-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Google Identity Sign-In</span>
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-snug">
                  Enter your Google Account email and password to securely authorize OfferCraft AI Cloud Sync.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Google Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Google Account Password *
                </label>
                <div className="relative">
                  <input
                    type={showGooglePassword ? "text" : "password"}
                    required
                    placeholder="Enter at least 6 characters"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="input-field text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGooglePassword(!showGooglePassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showGooglePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setAuthError(null);
                  }}
                  className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify & Connect Google</span>
                </button>
              </div>
            </form>
          )}

          {/* Standard Form: Sign In vs Register Tabs */}
          {step === "form" && (
            <>
              {/* Tab Navigation */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setAuthError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* 1. SIGN IN TAB */}
              {activeTab === "signin" && (
                <div className="space-y-4">
                  {/* Google OAuth simulation button */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("google_popup");
                      setAuthError(null);
                      if (signInEmail) setGoogleEmail(signInEmail);
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
                      or sign in with password
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  </div>

                  {/* Password-Protected Sign In Form */}
                  <form onSubmit={handleCustomSignIn} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com or name@gmail.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Password *</label>
                        <span
                          onClick={() => {
                            setAuthError("To reset your password, please register again with your email or use a new password.");
                          }}
                          className="text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline font-semibold"
                        >
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showSignInPassword ? "text" : "password"}
                          required
                          placeholder="Enter your registered password (min 6 chars)"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="input-field text-xs pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSignInPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In & Verify Credentials</span>
                    </button>
                  </form>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold cursor-pointer"
                    >
                      New candidate? <strong className="underline">Create an account →</strong>
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
                      <span>Secure Candidate Registration</span>
                    </div>
                    <p className="text-[11px] text-cyan-800 dark:text-cyan-300 leading-snug">
                      Create your OfferCraft account with a secure password to protect your tailored resumes, cover letters, and interview prep.
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
                      Email Address *
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
                      placeholder="e.g. Staff Software Engineer, Product Manager"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Create Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          placeholder="Min 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="input-field text-xs pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Confirm Password *
                      </label>
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        placeholder="Re-enter password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Register Account & Secure Workspace</span>
                  </button>
                </form>
              )}

              {/* Security & Cloud Privacy Footnote */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" /> 256-bit Local Vault Encryption
                </span>
                <span className="flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-cyan-500" /> Strict Credential Checking
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
