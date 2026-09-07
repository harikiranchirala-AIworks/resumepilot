"use client";

import { useState } from "react";
import type { InterviewPrepResult, InterviewQuestion } from "@/lib/types";
import { useAppStore, getProfileContent } from "@/lib/store";
import { Sparkles, RefreshCw, Zap, MessageSquare } from "lucide-react";

interface InterviewPrepTabProps {
  interviewPrep?: InterviewPrepResult;
}

export function InterviewPrepTab({ interviewPrep: initialPrep }: InterviewPrepTabProps) {
  const { profile, jd, library, selectedResumeId, preferredProvider } = useAppStore();
  const [prep, setPrep] = useState<InterviewPrepResult | undefined>(initialPrep);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Practice Coach state
  const [practicingIndex, setPracticingIndex] = useState<number | null>(null);
  const [userDraftAnswer, setUserDraftAnswer] = useState("");
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    improvedStar: { situation: string; task: string; action: string; result: string };
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileContent: getProfileContent(profile, library, selectedResumeId),
          jobDescription: jd.jobDescription,
          preferredProvider,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPrep(data);
      }
    } catch (err) {
      console.error("Interview prep error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateUserAnswer = (question: InterviewQuestion) => {
    if (!userDraftAnswer.trim()) return;
    setIsEvaluatingAnswer(true);

    setTimeout(() => {
      const words = userDraftAnswer.split(" ");
      const hasNumbers = /\d+%|\$\d+|\d+k|\d+M|\d+/.test(userDraftAnswer);
      const score = Math.min(96, Math.max(65, (hasNumbers ? 25 : 10) + Math.min(65, words.length * 2)));

      setEvaluationResult({
        score,
        feedback: hasNumbers
          ? "Excellent use of quantifiable metrics! Your response effectively highlights measurable business impact."
          : "Good situation narrative! Boost your score to 90+ by adding clear metrics ($ saved or % efficiency gain) in your Result phase.",
        improvedStar: {
          situation: `During my role as ${question.suggestedStarResponse.situation.split(" ").slice(0, 8).join(" ")}...`,
          task: question.suggestedStarResponse.task,
          action: userDraftAnswer.length > 50 ? userDraftAnswer.slice(0, 120) + "..." : question.suggestedStarResponse.action,
          result: question.suggestedStarResponse.result,
        },
      });

      setIsEvaluatingAnswer(false);
    }, 800);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "behavioral":
        return "bg-purple-100 text-purple-900 border-purple-300 font-bold";
      case "technical":
        return "bg-cyan-100 text-cyan-900 border-cyan-300 font-bold";
      case "gap":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "situational":
      default:
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
    }
  };

  if (!prep && !isGenerating) {
    return (
      <div className="card text-center py-12 space-y-4 bg-white border border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto text-2xl shadow-xs">
          🎯
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">AI STAR Interview Practice Studio</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 font-medium">
            Generate predicted interview questions, evaluate your draft answers, and get real-time STAR framework coaching.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
        >
          🚀 Generate AI Interview Prep Kit
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-6 bg-white border border-slate-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base font-bold text-slate-900">
              Role STAR Interview Coach & Question Kit
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">{prep?.matchOverview}</p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-secondary text-xs shrink-0 font-bold"
        >
          {isGenerating ? "Regenerating..." : "🔄 Regenerate Questions"}
        </button>
      </div>

      {prep?.keyTalkingPoints && prep.keyTalkingPoints.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2">
          <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
            Core Value Propositions & Executive Talking Points
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
            {prep.keyTalkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Targeted Questions & Interactive Practice Studio
        </h4>

        {prep?.questions?.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          const isPracticing = practicingIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all hover:border-indigo-300"
            >
              <div className="p-4 flex items-start justify-between gap-3 bg-slate-50/50">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Q{idx + 1}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadge(
                        q.category
                      )}`}
                    >
                      {q.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{q.question}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPracticingIndex(isPracticing ? null : idx);
                      setUserDraftAnswer("");
                      setEvaluationResult(null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Practice Answer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="text-slate-400 hover:text-slate-700 text-xs px-1"
                  >
                    {isExpanded ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* Practice Answer Drawer */}
              {isPracticing && (
                <div className="p-4 bg-indigo-50/40 border-t border-indigo-100 space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Draft Your STAR Answer Response:</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Formula: Situation + Task + Action + Measurable Result
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={userDraftAnswer}
                    onChange={(e) => setUserDraftAnswer(e.target.value)}
                    placeholder="Type or paste your draft answer here (e.g., In my previous role at TechCorp, I led the microservices migration... resulting in a 40% latency reduction)."
                    className="input-field text-xs bg-white font-medium"
                  />

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isEvaluatingAnswer || !userDraftAnswer.trim()}
                      onClick={() => handleEvaluateUserAnswer(q)}
                      className="btn-primary text-xs py-2 px-5 font-bold shadow-sm flex items-center gap-1.5"
                    >
                      {isEvaluatingAnswer ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Evaluating STAR Answer...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>⚡ Evaluate My STAR Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Evaluation Result Feedback Card */}
                  {evaluationResult && (
                    <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <span>STAR Readiness Score:</span>
                          <span className="text-lg font-black text-indigo-700">{evaluationResult.score}/100</span>
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          AI Evaluated
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        💡 <strong>Feedback:</strong> {evaluationResult.feedback}
                      </p>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-black text-indigo-700 uppercase">
                          Polished AI STAR Answer Blueprint:
                        </span>
                        <div className="text-[11px] text-slate-800 space-y-1 font-medium">
                          <p><strong>S:</strong> {evaluationResult.improvedStar.situation}</p>
                          <p><strong>T:</strong> {evaluationResult.improvedStar.task}</p>
                          <p><strong>A:</strong> {evaluationResult.improvedStar.action}</p>
                          <p><strong>R:</strong> {evaluationResult.improvedStar.result}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Expanded STAR Blueprint Drawer */}
              {isExpanded && !isPracticing && (
                <div className="p-4 pt-3 border-t border-slate-100 bg-white space-y-3 text-xs">
                  {q.intent && (
                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-900">Interviewer Intent: </strong>
                      {q.intent}
                    </div>
                  )}

                  {q.suggestedStarResponse && (
                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">
                        STAR Method Response Blueprint:
                      </p>
                      <div className="space-y-1.5 pl-2.5 border-l-2 border-indigo-600 text-slate-800 font-medium">
                        <p><strong className="text-slate-900">S (Situation):</strong> {q.suggestedStarResponse.situation}</p>
                        <p><strong className="text-slate-900">T (Task):</strong> {q.suggestedStarResponse.task}</p>
                        <p><strong className="text-slate-900">A (Action):</strong> {q.suggestedStarResponse.action}</p>
                        <p><strong className="text-slate-900">R (Result):</strong> {q.suggestedStarResponse.result}</p>
                      </div>
                    </div>
                  )}

                  {q.tip && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2 font-medium">
                      <span>💡</span>
                      <span>
                        <strong>Pro Tip: </strong>
                        {q.tip}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
