"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { AIProvider } from "@/lib/types";

interface ProviderOption {
  id: AIProvider;
  name: string;
  available: boolean;
}

export function ProviderSelector() {
  const { preferredProvider, setPreferredProvider } = useAppStore();
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => setProviders(data))
      .catch(() => {});
  }, []);

  const currentProvider = providers.find((p) => p.id === preferredProvider) ?? {
    id: "auto",
    name: "Auto-Detect Best Available",
    available: true,
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-800/60 transition-all shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald" />
        <span className="text-slate-400 font-normal">AI Engine:</span>
        <span className="text-cyan-400">{currentProvider.name.split(" ")[0]}</span>
        <span className="text-slate-500 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900/95 shadow-2xl border border-slate-800 p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 mb-1 border-b border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select AI Engine
              </p>
            </div>
            <div className="space-y-1">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPreferredProvider(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    preferredProvider === p.id
                      ? "bg-indigo-950/50 text-cyan-300 font-semibold border border-indigo-800/60 shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {p.id === "auto"
                        ? "Gemini -> OpenAI -> Claude -> Cursor"
                        : p.available
                        ? "API key detected in .env"
                        : "Key not set (uses offline fallback)"}
                    </p>
                  </div>
                  {preferredProvider === p.id && (
                    <span className="text-cyan-400 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
