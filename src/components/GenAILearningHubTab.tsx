"use client";

import { useRef, useEffect } from "react";
import { GraduationCap, ExternalLink, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function GenAILearningHubTab() {
  const { user } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync dark mode preference with iframe on mount and changes
  useEffect(() => {
    const syncTheme = () => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      const isDark = document.documentElement.classList.contains("dark");
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: "THEME_CHANGE", darkMode: isDark },
          "*"
        );
      } catch {}
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "/genai_learning_hub.html";
    }
  };

  const handleOpenNewTab = () => {
    window.open("/genai_learning_hub.html", "_blank");
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Banner & Fast Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white shadow-xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/25 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Grow — GenAI learning hub
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                12 Modules
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 font-medium">
              Real-world AI curriculum, Leitner spaced repetition flashcards, interactive RAG lab, and interview bible tailored for {user?.targetRole || "AI & Tech Roles"}.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0 text-xs">
          <button
            type="button"
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer shadow-xs"
            title="Reload learning hub canvas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            title="Launch in standalone distraction-free window"
          >
            <span>Open Standalone</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Embedded Super App Viewport */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/genai_learning_hub.html"
          title="The Production Gen AI Engineer Roadmap & Interview Bible"
          className="w-full h-[78vh] min-h-[640px] border-0"
          allow="clipboard-read; clipboard-write;"
        />
      </div>
    </div>
  );
}
