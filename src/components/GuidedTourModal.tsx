"use client";

import { useState } from "react";
import { Target, LayoutGrid, MessageSquare, GraduationCap, ArrowRight, ArrowLeft, Check, Sparkles, X } from "lucide-react";

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen?: (screen: "jd" | "studio" | "interview" | "learning-hub") => void;
}

const TOUR_SLIDES = [
  {
    step: "01 / 04",
    title: "Target Role & JD Intelligence",
    subtitle: "Reverse-engineer any job posting in seconds",
    icon: Target,
    badge: "Step 1",
    badgeColor: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700",
    color: "from-cyan-500 to-teal-500",
    description:
      "Paste any target Job Description or live job URL. OfferCraft AI extracts mission-critical ATS keywords, analyzes hiring manager requirements, and computes your candidate archetype match score (0-40).",
    highlights: [
      "Target Job Description scraper & archetype scanner",
      "Missing ATS keyword identification & frequency heatmap",
      "Instant role fit breakdown (AI Engineer, TPM, Product Lead)",
    ],
    targetScreen: "jd" as const,
  },
  {
    step: "02 / 04",
    title: "Interactive Split-Screen Studio",
    subtitle: "Enhancv & Worded style live LaTeX editor",
    icon: LayoutGrid,
    badge: "Step 2",
    badgeColor: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
    color: "from-indigo-500 to-cyan-500",
    description:
      "Work side-by-side on a live A4 sheet. Click any bullet to auto-quantify achievements using Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]. Instantly preview vector PDF exports.",
    highlights: [
      "WYSIWYG split-screen with click-to-edit bullet inspector",
      "Google XYZ metric injector with instant Before vs After diffs",
      "ATS formatting compliance & 1-page fit optimization",
    ],
    targetScreen: "studio" as const,
  },
  {
    step: "03 / 04",
    title: "STAR Interview Coach & LinkedIn SEO",
    subtitle: "Role-specific practice & recruiter visibility",
    icon: MessageSquare,
    badge: "Step 3",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    color: "from-amber-500 to-orange-500",
    description:
      "Ace your behavioral and technical rounds. Practice questions tailored to your target job posting with AI grading on Situation, Task, Action, and Result. Auto-optimize your LinkedIn headline for recruiter search algorithms.",
    highlights: [
      "Real-time STAR response evaluator & constructive feedback",
      "Recruiter search algorithm keyword injector for LinkedIn",
      "Application & interview round Kanban pipeline",
    ],
    targetScreen: "interview" as const,
  },
  {
    step: "04 / 04",
    title: "OfferCraft Academy & Real AI Learning",
    subtitle: "12 real-world AI modules, flashcards & interview bible",
    icon: GraduationCap,
    badge: "Academy",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    color: "from-emerald-500 to-teal-500",
    description:
      "Master real-world AI with our integrated 12-module GenAI Engineering Roadmap, Leitner spaced repetition flashcards, and interactive RAG architecture simulator. Download your complete 1-click application ZIP bundle.",
    highlights: [
      "12-Module GenAI Roadmap & Executive Leadership Bible",
      "Interactive RAG & Agent Architecture Lab simulator",
      "1-Click ZIP bundle: Formatted PDF + Cover Letter + Strategy Guide",
    ],
    targetScreen: "learning-hub" as const,
  },
];

export function GuidedTourModal({ isOpen, onClose, onNavigateToScreen }: GuidedTourModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const slide = TOUR_SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === TOUR_SLIDES.length - 1;

  const handleFinish = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("offercraft_tour_completed", "true");
      } catch {}
    }
    onClose();
  };

  const handleJumpToModule = () => {
    handleFinish();
    if (onNavigateToScreen && slide.targetScreen) {
      onNavigateToScreen(slide.targetScreen);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden transition-colors my-auto">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white relative flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                20-Second Guided Overview
              </span>
              <h3 className="text-base font-black text-white tracking-tight">
                Welcome to OfferCraft AI
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Badge & Step Indicator */}
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${slide.badgeColor}`}>
              {slide.badge}: {slide.title}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              {slide.step}
            </span>
          </div>

          {/* Hero Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${slide.color} text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {slide.title}
              </h4>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                {slide.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {slide.description}
          </p>

          {/* Key Feature Highlights Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
              What you can do here:
            </span>
            {slide.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Progress Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {TOUR_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-8 bg-gradient-to-r from-cyan-600 to-teal-600"
                    : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>Don&apos;t show this tour automatically</span>
            </label>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {currentSlide > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => prev - 1)}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => prev + 1)}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <span>Next Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleJumpToModule}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <span>Start Crafting Now 🚀</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
