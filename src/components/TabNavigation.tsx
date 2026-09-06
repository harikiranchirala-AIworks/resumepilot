"use client";

export type TabId = "profile" | "jd" | "resume" | "tracker";

const TABS: { id: TabId; label: string; step?: number; icon: string }[] = [
  { id: "profile", label: "Candidate Profile", step: 1, icon: "👤" },
  { id: "jd", label: "Job Description", step: 2, icon: "🎯" },
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
    <nav className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white/85 backdrop-blur-md rounded-2xl border border-brand-100 shadow-card">
      <div className="flex flex-wrap flex-1 gap-1.5">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isDone = tab.step ? index < activeIndex : false;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 ${
                isActive
                  ? "tab-btn-active"
                  : isDone
                  ? "tab-btn-done"
                  : "tab-btn-inactive"
              }`}
            >
              {tab.step ? (
                <span
                  className={`step-pill ${
                    isActive
                      ? "ring-2 ring-brand-300 ring-offset-1 bg-brand-600"
                      : isDone
                      ? "bg-brand-500"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {tab.step}
                </span>
              ) : (
                <span className="text-sm">{tab.icon}</span>
              )}
              <span className="font-semibold text-xs sm:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {onOpenBackupModal && (
        <button
          type="button"
          onClick={onOpenBackupModal}
          className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-brand-800 hover:bg-brand-50/60 rounded-xl border border-transparent hover:border-brand-200 transition-colors shrink-0"
          title="Export or Import JSON Workspace Data"
        >
          💾 Backup / Restore
        </button>
      )}
    </nav>
  );
}
