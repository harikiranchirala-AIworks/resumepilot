"use client";

export type TabId = "profile" | "jd" | "resume";

const TABS: { id: TabId; label: string; step: number }[] = [
  { id: "profile", label: "Candidate Profile", step: 1 },
  { id: "jd", label: "Job Description", step: 2 },
  { id: "resume", label: "Tailored Suite", step: 3 },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <nav className="flex flex-wrap gap-2 p-2 bg-white/80 backdrop-blur rounded-2xl border border-brand-100 shadow-card">
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isDone = index < activeIndex;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`tab-btn flex-1 min-w-[120px] flex items-center justify-center gap-2 ${
              isActive
                ? "tab-btn-active"
                : isDone
                  ? "tab-btn-done"
                  : "tab-btn-inactive"
            }`}
          >
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
            <span className="font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

