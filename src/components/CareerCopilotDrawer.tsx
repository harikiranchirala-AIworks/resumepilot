"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Zap,
  Target,
  Briefcase,
  HelpCircle,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestedBullet?: string;
  timestamp: string;
}

interface CareerCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBullet?: (bullet: string) => void;
  targetRole?: string;
  targetCompany?: string;
}

const QUICK_PROMPTS = [
  {
    id: "xyz",
    label: "⚡ Quantify (Google XYZ)",
    prompt: "Quantify my recent impact using Google's XYZ formula with realistic metrics.",
    icon: Zap,
  },
  {
    id: "keywords",
    label: "🎯 Missing JD Keywords",
    prompt: "What critical technical keywords from the job description should I highlight?",
    icon: Target,
  },
  {
    id: "pitch",
    label: "💼 30-Sec Elevator Pitch",
    prompt: "Generate a compelling 30-second executive elevator pitch for this role.",
    icon: Briefcase,
  },
  {
    id: "interview",
    label: "❓ Top 3 Interview Qs",
    prompt: "What are the top 3 behavioral and technical interview questions for this position?",
    icon: HelpCircle,
  },
  {
    id: "salary",
    label: "💰 Salary Benchmarks",
    prompt: "What is the compensation benchmark and negotiation strategy for this role?",
    icon: DollarSign,
  },
  {
    id: "director",
    label: "🚀 Director Tone Boost",
    prompt: "How can I elevate my resume bullets to sound like a Director / Staff Engineer?",
    icon: TrendingUp,
  },
];

export function CareerCopilotDrawer({
  isOpen,
  onClose,
  onApplyBullet,
  targetRole = "Lead Cloud Systems Architect",
  targetCompany = "TechCorp Solutions Inc.",
}: CareerCopilotDrawerProps) {
  const { jd, profile, preferredProvider } = useAppStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: `👋 **Welcome to your Executive Career Copilot!**\n\nI'm your AI career strategist and FAANG technical recruiter. I've analyzed your target position **${targetRole}** at **${targetCompany}**.\n\nAsk me anything: bullet rewrites with Google XYZ metrics, keyword gap injections, elevator pitches, or salary negotiation scripts!`,
      timestamp: "Just now",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/career-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          targetRole,
          targetCompany,
          jobDescription: jd.jobDescription,
          profileHighlights: profile.resumeText ? profile.resumeText.slice(0, 600) : "",
          preferredProvider,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: data.reply,
          suggestedBullet: data.suggestedBullet,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Failed to generate reply");
      }
    } catch (err) {
      console.error("Copilot request error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        text: `### ⚡ Executive Coaching Recommendation\n\nFor **${targetRole}**, maximize your impact by articulating technical leadership and quantified business ROI:\n\n> *"Spearheaded cloud-native microservices architecture migration, boosting system throughput by 42% and trimming annual operating expenses by \$180,000."*`,
        suggestedBullet:
          "Spearheaded cloud-native microservices architecture migration, boosting system throughput by 42% and trimming annual operating expenses by $180,000.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (id: string, bullet: string) => {
    if (onApplyBullet) {
      onApplyBullet(bullet);
    }
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: `👋 Chat reset. What would you like to optimize next for **${targetRole}**?`,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity animate-fadeIn"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] md:w-[520px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                  AI Career Copilot
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Live Coach
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium truncate max-w-[240px] sm:max-w-[280px]">
                {targetRole} &bull; {targetCompany}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close Copilot"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Chips Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-2">
          {QUICK_PROMPTS.map((qp) => {
            const Icon = qp.icon;
            return (
              <button
                key={qp.id}
                type="button"
                disabled={loading}
                onClick={() => handleSendMessage(qp.prompt)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/80">
          {messages.map((msg) => {
            const isAi = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? "items-start" : "items-end justify-end"}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isAi
                      ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      : "bg-indigo-600 text-white font-medium"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* 1-Click Apply Action Card for Suggested Bullet */}
                  {msg.suggestedBullet && (
                    <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-slate-100 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> Recommended Bullet:
                        </span>
                        <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          Draft signal
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 italic">
                        &ldquo;{msg.suggestedBullet}&rdquo;
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApply(msg.id, msg.suggestedBullet!)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {appliedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied to Sheet!</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>⚡ Apply to Sheet</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.suggestedBullet!)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 font-medium ${
                      isAi ? "text-slate-400 text-right" : "text-indigo-200 text-right"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs font-bold animate-pulse p-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <span className="flex items-center gap-1">
                Executive Copilot is crafting recommendation
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot (e.g. 'Quantify my AWS project')..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 px-1 font-medium">
            <span>Press Enter to send</span>
            <span>Google XYZ &bull; STAR Method &bull; ATS Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
}
