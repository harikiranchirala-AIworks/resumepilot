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
    <nav className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
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
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-500"
                  : isDone
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold"
                  : "bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.step ? (
                <span
                  className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-full text-[11px] font-black ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-xs"
                      : isDone
                      ? "bg-emerald-600 text-white font-black"
                      : "bg-slate-200 text-slate-700"
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
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shrink-0 shadow-xs"
          title="Export or Import JSON Workspace Data"
        >
          💾 Backup / Restore
        </button>
      )}
    </nav>
  );
}
