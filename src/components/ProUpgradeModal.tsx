"use client";

import { useState } from "react";
import {
  X,
  Check,
  Crown,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Star,
  CheckCircle2,
  Gift,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const { isPro, proPlan, setProPlan, freeTailorCredits, tailoredCount } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedCheckout = (planId: "pro-monthly" | "pro-annual" | "executive-lifetime") => {
    setIsUpgrading(true);
    setTimeout(() => {
      setProPlan(planId);
      setIsUpgrading(false);
      setSuccessPlan(
        planId === "executive-lifetime"
          ? "Executive Lifetime"
          : planId === "pro-annual"
          ? "Pro Annual"
          : "Pro Monthly"
      );
      setTimeout(() => {
        setSuccessPlan(null);
        onClose();
      }, 2500);
    }, 800);
  };

  const handleDowngrade = () => {
    setProPlan("free");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col my-auto transition-colors">
        {/* Modal Top Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-3">
              <Crown className="w-4 h-4" />
              <span>Commercial Pro Membership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Land 3.8x More Interviews with OfferCraft Pro
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 mt-2 font-medium">
              Join 14,200+ candidates who used Google XYZ auto-fix, 1-click application packets, and our AI career coach to land roles at Google, Meta, Amazon, and Apple.
            </p>
          </div>

          {/* Social Proof Strip */}
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-indigo-900/60 text-xs text-indigo-300 font-semibold">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-white font-bold ml-1">4.9/5 Rating</span>
            </div>
            <span>&bull;</span>
            <span>30-Day Money-Back Guarantee</span>
            <span>&bull;</span>
            <span>Cancel Anytime in 1-Click</span>
          </div>

          {/* Free Trial Status Notice */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-100">
              <span className="text-base">{freeTailorCredits > 0 ? "🎁" : "🔒"}</span>
              <span className="font-medium">
                {isPro
                  ? "You have OfferCraft Pro Active with Unlimited AI Tailors!"
                  : freeTailorCredits > 0
                  ? "You have 1 Free Full-Power AI Tailor available. Upgrade below to unlock unlimited applications."
                  : `You have used your 1 Free AI Tailoring trial (${tailoredCount} resume tailored). Unlock unlimited applications below:`}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px] uppercase shrink-0">
              {isPro ? "Pro Active" : freeTailorCredits > 0 ? "1 Credit Left" : "Trial Used"}
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successPlan && (
          <div className="p-4 bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>🎉 Congratulations! You have successfully activated {successPlan}!</span>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3">
          <span
            className={`text-xs sm:text-sm font-bold cursor-pointer ${
              billingCycle === "monthly"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() => setBillingCycle((prev) => (prev === "monthly" ? "annual" : "monthly"))}
            className="w-13 h-7 rounded-full bg-indigo-600 p-1 transition-colors relative cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              billingCycle === "annual"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            Annual Billing
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black border border-emerald-300 dark:border-emerald-700">
              Save 56%
            </span>
          </span>
        </div>

        {/* 3 Pricing Tier Cards */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-950/50 overflow-y-auto">
          {/* Tier 1: Free Starter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Starter</h3>
                {!isPro && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                For exploring basic resume checks and initial keyword gap reviews.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Resume Tailoring / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Basic ATS Keyword Match</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Plain Text (.txt) Export</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>No Word / PDF Exports</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>No Career Copilot Chat</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>No 1-Click ZIP Bundle</span>
                </li>
              </ul>
            </div>

            {isPro ? (
              <button
                type="button"
                onClick={handleDowngrade}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Downgrade to Free
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs cursor-default"
              >
                Your Active Plan
              </button>
            )}
          </div>

          {/* Tier 2: Pro Member (MOST POPULAR) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 relative flex flex-col justify-between space-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
              👑 Most Popular &bull; 92% Choice
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 mt-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Pro Member</h3>
                {isPro && proPlan?.startsWith("pro") && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Active Plan
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {billingCycle === "annual" ? "$8.25" : "$19"}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  / month {billingCycle === "annual" && "(billed $99/yr)"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                Full commercial toolkit to tailor, practice, and win top offers fast.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span><strong>Unlimited</strong> AI Tailored Resumes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span><strong>Google XYZ Impact</strong> Auto-Fixer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>Direct <strong>Word (.docx) & Vector PDF</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span><strong>AI Career Copilot</strong> 24/7 Chat Coach</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span><strong>1-Click Application ZIP Packets</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>Cover Letter & STAR Interview Generator</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isUpgrading}
              onClick={() =>
                handleSimulatedCheckout(billingCycle === "annual" ? "pro-annual" : "pro-monthly")
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpgrading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Activating Pro...</span>
                </>
              ) : isPro && proPlan?.startsWith("pro") ? (
                <span>✓ Active Pro Member</span>
              ) : (
                <>
                  <span>Upgrade to Pro Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Tier 3: Executive Lifetime */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Executive Lifetime
                </h3>
                {proPlan === "executive-lifetime" && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">$149</span>
                <span className="text-xs text-slate-500 font-semibold">one-time &bull; forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                Pay once, own forever. Perfect for senior leaders, contractors, and career climbers.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span><strong>Everything in Pro</strong> for Life</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>No Monthly or Annual Fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>Up to 10 Candidate Personas Bank</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>LinkedIn 100% Score Optimizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>Salary Negotiation Playbook</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                  <span>VIP Priority Customer Support</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isUpgrading}
              onClick={() => handleSimulatedCheckout("executive-lifetime")}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-bold text-xs sm:text-sm border border-slate-800 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpgrading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : proPlan === "executive-lifetime" ? (
                <span>✓ Active Lifetime License</span>
              ) : (
                <>
                  <span>Get Lifetime License</span>
                  <Gift className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer: Trust Badges */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> 30-Day Money-Back Guarantee
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Stripe & Apple Pay Verified
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
          >
            Continue with Free
          </button>
        </div>
      </div>
    </div>
  );
}
