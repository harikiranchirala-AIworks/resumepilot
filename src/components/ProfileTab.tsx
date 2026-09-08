"use client";

import { useEffect, useState } from "react";
import { useAppStore, canProceedFromProfile } from "@/lib/store";
import { TabActions } from "./TabActions";
import { ResumeUploader } from "./ResumeUploader";
import { HelpCircle, Info, FileText, Library } from "lucide-react";

interface ProfileTabProps {
  onBack?: () => void;
  onNext: () => void;
}

const SAMPLE_PROFILES = [
  {
    name: "Staff Software Engineer",
    text: `Jordan Lee
jordan.lee@example.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/jordanlee

SUMMARY
Results-driven Staff Software Engineer with 8+ years architecting high-throughput distributed systems, event-driven microservices, and modern web platforms. Proven track record leading multi-disciplinary engineering squads, optimizing cloud infrastructure costs by 40%, and maintaining 99.99% system uptime.

EXPERIENCE
Staff Software Engineer | CloudScale Technologies | 2021 – Present
- Architected and deployed a multi-region event-streaming platform using Node.js, TypeScript, Kafka, and Kubernetes, processing over 50M daily transactions.
- Championed engineering best practices, CI/CD pipeline modernization, and automated test coverage, reducing release failure rates from 14% to under 1.5%.
- Led cross-functional squad of 10 engineers across backend, frontend, and DevOps, delivering core enterprise features on schedule.

Senior Full Stack Engineer | Apex Financial Systems | 2018 – 2021
- Developed scalable customer-facing financial dashboards with React, Next.js, TypeScript, and GraphQL, increasing user retention by 28%.
- Refactored monolithic backend services into containerized microservices on AWS (ECS, RDS, Redis), cutting average API response times from 340ms to 85ms.
- Mentored junior and mid-level engineers, established rigorous code review standards, and spearheaded internal tech-talk series.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of California, Berkeley (2018)
- AWS Certified Solutions Architect – Professional (2022)

SKILLS
Languages & Frameworks: TypeScript, JavaScript, Python, React, Next.js, Node.js, GraphQL, Go
Cloud & DevOps: AWS (ECS, Lambda, S3, RDS, CloudFront), Docker, Kubernetes, Terraform, GitHub Actions, CI/CD
Databases & Systems: PostgreSQL, Redis, Apache Kafka, MongoDB, RESTful APIs, Distributed Systems`,
  },
  {
    name: "Senior Product & Program Manager",
    text: `Jordan Taylor
jordan.taylor@example.com | (555) 876-5432 | New York, NY | linkedin.com/in/jordantaylor

SUMMARY
Dynamic Senior Technical Program & Product Manager with 9+ years directing enterprise digital transformations, AI automation programs, and cross-functional product launches. Expert in agile methodologies, stakeholder governance, and product roadmapping.

EXPERIENCE
Senior Technical Program Manager | Enterprise Next Inc. | 2020 – Present
- Spearheaded global enterprise SaaS rollout across 4 regions and 12,000 users, completing implementation 2 months ahead of schedule and 15% under budget.
- Established data-driven OKR governance framework and automated sprint velocity tracking, boosting engineering velocity by 32%.
- Managed executive stakeholder communications, risk mitigation strategies, and budget allocations exceeding $8M annually.

Product Manager | Innovate Solutions | 2016 – 2020
- Defined product requirements and vision for AI-driven customer support automation, reducing ticket resolution time by 45%.
- Facilitated scrum ceremonies, backlog grooming, and user discovery workshops across engineering, UX design, and sales teams.

EDUCATION & CERTIFICATIONS
- M.B.A. | Columbia Business School (2016)
- B.S. in Industrial Engineering | Cornell University (2013)
- PMP Certified | Certified Scrum Product Owner (CSPO)

SKILLS
Core Competencies: Product Roadmapping, Technical Program Management, Agile/Scrum, Stakeholder Management, OKR Governance, Risk Management
Tools & Analytics: Jira, Confluence, Figma, SQL, Tableau, PowerBI, Salesforce, Mixpanel`,
  },
];

export function ProfileTab({ onBack, onNext }: ProfileTabProps) {
  const {
    profile,
    library,
    selectedResumeId,
    setProfileMode,
    setResumeText,
    loadLibrary,
    selectResume,
    upsertResume,
    removeResume,
  } = useAppStore();
  const canNext = canProceedFromProfile(profile, library, selectedResumeId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [saveAsName, setSaveAsName] = useState("");
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const handleAddResume = async () => {
    if (!newName.trim() || !newText.trim()) return;
    await upsertResume({ name: newName.trim(), text: newText.trim() });
    setNewName("");
    setNewText("");
    setShowAddForm(false);
  };

  const handleSaveToLibrary = async () => {
    if (!saveAsName.trim() || !profile.resumeText.trim()) return;
    await upsertResume({ name: saveAsName.trim(), text: profile.resumeText.trim() });
    setSaveAsName("");
  };

  const handleExtractedText = (text: string, suggestedName?: string) => {
    setResumeText(text);
    if (suggestedName && !saveAsName) {
      setSaveAsName(suggestedName);
    }
  };

  const handleExtractedForNewForm = (text: string, suggestedName?: string) => {
    setNewText(text);
    if (suggestedName && !newName) {
      setNewName(suggestedName);
    }
  };

  return (
    <div className="space-y-6">
      {/* First-time Candidate Onboarding Banner */}
      {profile.resumeText.trim().length < 30 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 border border-purple-200 dark:border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  APPLY — Add your experience
                </span>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-bold">
                  Next Step
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Upload your master resume or paste your career experience
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                OfferCraft AI will align your real career accomplishments with the requirements analyzed in Step 1 to generate high-impact, quantified bullets.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setProfileMode("resumeText");
                setResumeText(SAMPLE_PROFILES[0].text);
                setSaveAsName(SAMPLE_PROFILES[0].name);
              }}
              className="text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Try Sample Profile</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      )}

      <div className="card space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Apply — experience
            </span>
            <span className="text-xs text-slate-600 font-medium">Baseline Context</span>
            <button
              type="button"
              onClick={() => setShowHelpTooltip(!showHelpTooltip)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title="What is the experience source?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Your experience source</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Upload your master resume, select from your saved profiles library, or paste plain text.
          </p>

          {showHelpTooltip && (
            <div className="mt-3 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1 animate-fadeIn">
              <p className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                How your experience is used:
              </p>
              <p className="text-cyan-900 dark:text-cyan-200">
                Your experience is the source of truth. OfferCraft compares it with the target job and only improves wording using facts you provide.
              </p>
            </div>
          )}
        </div>

        {/* Quick sample loader */}
        <div className="flex flex-wrap items-center gap-1.5 self-start pt-1">
          <span className="text-xs text-slate-600 font-medium">Try Sample Profile:</span>
          {SAMPLE_PROFILES.map((samp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProfileMode("resumeText");
                setResumeText(samp.text);
                setSaveAsName(samp.name);
              }}
              className="text-xs px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 font-semibold transition-all border border-slate-300 hover:border-indigo-300 shadow-xs"
            >
              {samp.name.split(" ")[0]} {samp.name.split(" ")[1] || ""}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="grid sm:grid-cols-2 gap-3.5">
        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/60 shadow-xs">
          <input
            type="radio"
            name="profileMode"
            value="resumeText"
            checked={profile.mode === "resumeText"}
            onChange={() => setProfileMode("resumeText")}
            className="mt-1 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 w-4 h-4"
          />
          <div>
            <span className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Upload / Paste Resume
            </span>
            <span className="block text-xs text-slate-600 mt-0.5 font-medium">
              Drag-and-drop a file or paste raw resume text directly.
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/60 shadow-xs">
          <input
            type="radio"
            name="profileMode"
            value="library"
            checked={profile.mode === "library"}
            onChange={() => setProfileMode("library")}
            className="mt-1 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 w-4 h-4"
          />
          <div>
            <span className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Library className="w-4 h-4 text-indigo-600" />
              Saved Resume Library ({library.length})
            </span>
            <span className="block text-xs text-slate-600 mt-0.5 font-medium">
              Choose from your saved profile versions.
            </span>
          </div>
        </label>
      </fieldset>

      {profile.mode === "library" ? (
        <div className="space-y-3">
          {library.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              No saved resumes in library yet. Click below or switch to Upload/Paste.
            </div>
          )}

          {library.map((entry) => (
            <label
              key={entry.id}
              className="flex items-start justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-300 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/40 transition-all shadow-xs"
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectedResume"
                  checked={selectedResumeId === entry.id}
                  onChange={() => selectResume(entry.id)}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 w-4 h-4"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-900">
                    {entry.name}
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Updated {new Date(entry.updatedAt).toLocaleDateString()} —{" "}
                    {entry.text.slice(0, 90)}…
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeResume(entry.id)}
                className="text-xs text-rose-600 hover:text-rose-800 shrink-0 font-semibold px-2 py-1 rounded bg-rose-50 border border-rose-200 transition-colors"
              >
                Remove
              </button>
            </label>
          ))}

          {showAddForm ? (
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Add New Resume Version
              </h4>
              <ResumeUploader onTextExtracted={handleExtractedForNewForm} />
              <input
                type="text"
                className="input-field"
                placeholder="Resume label (e.g., Staff Backend Engineer)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <textarea
                rows={8}
                className="input-field font-mono text-xs leading-relaxed"
                placeholder="Paste this resume version's full text..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-xs" onClick={handleAddResume}>
                  Save to Library
                </button>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-all shadow-xs"
              onClick={() => setShowAddForm(true)}
            >
              + Add New Resume to Library
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <ResumeUploader onTextExtracted={handleExtractedText} />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="resumeText"
                className="text-xs font-bold text-slate-900"
              >
                Resume Content
              </label>
              {profile.resumeText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setResumeText("")}
                  className="text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                >
                  Clear Text
                </button>
              )}
            </div>

            <textarea
              id="resumeText"
              rows={12}
              className="input-field font-mono text-xs leading-relaxed bg-white"
              placeholder="Paste your full resume here — experience, education, skills, metrics, projects..."
              value={profile.resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <p className="mt-1.5 text-[11px] text-slate-600 font-medium">
              {profile.resumeText.length} characters
              {profile.resumeText.length < 50 && profile.resumeText.length > 0 && (
                <span className="text-amber-700 font-bold ml-2">
                  — include more background for optimal tailoring
                </span>
              )}
            </p>

            {profile.resumeText.trim().length > 50 && (
              <div className="mt-3 flex items-center gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <input
                  type="text"
                  className="input-field flex-1 text-xs"
                  placeholder="Give this resume a name to save to your library"
                  value={saveAsName}
                  onChange={(e) => setSaveAsName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-primary text-xs shrink-0"
                  onClick={handleSaveToLibrary}
                  disabled={!saveAsName.trim()}
                >
                  Save to Library
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        <TabActions
          onBack={onBack}
          onNext={onNext}
          showBack={Boolean(onBack)}
          nextLabel="Proceed to Studio"
          nextDisabled={!canNext}
        />
      </div>
    </div>
  );
}
