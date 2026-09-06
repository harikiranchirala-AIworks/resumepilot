"use client";

export type TabId = "profile" | "jd" | "resume" | "tracker";

const TABS: { id: TabId; label: string; step?: number; icon: string }[] = [
  { id: "profile", label: "Candidate Profile", step: 1, icon: "👤" },
  { id: "jd", label: "Target JD & Archetypes", step: 2, icon: "🎯" },
  { id: "resume", label: "Tailored Studio", step: 3, icon: "⚡" },
  { id: "tracker", label: "Applications Tracker", icon: "📊" },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenBackupModal?: () => void;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  onOpenBackupModal,
}: TabNavigationProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl">
      <div className="flex flex-wrap flex-1 gap-1.5">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isDone = tab.step ? index < activeIndex : false;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-glow-indigo border border-indigo-400/40 ring-1 ring-white/10"
                  : isDone
                  ? "bg-emerald-950/25 text-emerald-400 border border-emerald-800/30 hover:bg-emerald-950/40"
                  : "bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-slate-850"
              }`}
            >
              {tab.step ? (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-sm"
                      : isDone
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? "✓" : tab.step}
                </span>
              ) : (
                <span className="text-sm">{tab.icon}</span>
              )}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {onOpenBackupModal && (
        <button
          type="button"
          onClick={onOpenBackupModal}
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shrink-0"
          title="Export or Import JSON Workspace Data"
        >
          💾 Backup / Restore
        </button>
      )}
    </nav>
  );
}
