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
    <nav className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
      <div className="flex flex-wrap flex-1 gap-2">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isDone = tab.step ? index < activeIndex : false;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-glow-indigo border border-indigo-400/50 ring-1 ring-white/20"
                  : isDone
                  ? "bg-emerald-950/50 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60 font-semibold"
                  : "bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-650 shadow-sm"
              }`}
            >
              {tab.step ? (
                <span
                  className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-full text-[11px] font-black ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-sm"
                      : isDone
                      ? "bg-emerald-400 text-slate-950 font-black"
                      : "bg-slate-700 text-slate-100 border border-slate-600"
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
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-600 hover:border-slate-500 transition-all shrink-0 shadow-sm"
          title="Export or Import JSON Workspace Data"
        >
          💾 Backup / Restore
        </button>
      )}
    </nav>
  );
}
