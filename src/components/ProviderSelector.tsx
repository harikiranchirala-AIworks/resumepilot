"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function ProviderSelector() {
  const { setPreferredProvider } = useAppStore();
  const [openAIReady, setOpenAIReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/providers")
      .then((response) => response.json() as Promise<{ openai?: boolean }>)
      .then((data) => {
        setOpenAIReady(Boolean(data.openai));
        if (data.openai) setPreferredProvider("openai");
      })
      .catch(() => setOpenAIReady(false));
  }, [setPreferredProvider]);

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200">
      <span className={`h-2 w-2 rounded-full ${openAIReady ? "bg-emerald-400" : "bg-amber-400"}`} />
      <span className="text-slate-400 font-normal">Grounded AI:</span>
      <span className={openAIReady ? "text-emerald-300" : "text-amber-300"}>
        {openAIReady === null ? "Checking" : openAIReady ? "Ready" : "Provider not configured"}
      </span>
    </div>
  );
}
