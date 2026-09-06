"use client";

import { useEffect, useState } from "react";
import { useAppStore, canProceedFromProfile } from "@/lib/store";
import { TabActions } from "./TabActions";
import { ResumeUploader } from "./ResumeUploader";

interface ProfileTabProps {
  onNext: () => void;
}

const SAMPLE_PROFILES = [
  {
    name: "Staff Software Engineer",
    text: `Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan

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

export function ProfileTab({ onNext }: ProfileTabProps) {
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
    <div className="card card-accent space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
            Step 1
          </p>
          <h2 className="text-xl font-bold text-brand-900">Your Candidate Profile</h2>
          <p className="mt-1 text-xs text-slate-600">
            Upload your existing resume, select from your library, or paste raw text.
          </p>
        </div>

        {/* Quick sample loader */}
        <div className="flex items-center gap-1.5 self-start pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Load sample:</span>
          {SAMPLE_PROFILES.map((samp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProfileMode("resumeText");
                setResumeText(samp.text);
                setSaveAsName(samp.name);
              }}
              className="text-[11px] px-2 py-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition-colors border border-brand-200"
            >
              {samp.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-brand-100 cursor-pointer hover:border-brand-200 hover:bg-brand-50/50 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:shadow-sm">
          <input
            type="radio"
            name="profileMode"
            value="resumeText"
            checked={profile.mode === "resumeText"}
            onChange={() => setProfileMode("resumeText")}
            className="mt-1 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <span className="block text-sm font-semibold text-brand-900">
              Upload / Paste Resume
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">
              Drag-and-drop a file or paste text directly.
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-brand-100 cursor-pointer hover:border-brand-200 hover:bg-brand-50/50 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:shadow-sm">
          <input
            type="radio"
            name="profileMode"
            value="library"
            checked={profile.mode === "library"}
            onChange={() => setProfileMode("library")}
            className="mt-1 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <span className="block text-sm font-semibold text-brand-900">
              Saved Resume Library ({library.length})
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">
              Choose from your saved profile versions.
            </span>
          </div>
        </label>
      </fieldset>

      {profile.mode === "library" ? (
        <div className="space-y-3">
          {library.length === 0 && !showAddForm && (
            <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No saved resumes yet. Click below or switch to Upload/Paste.
            </div>
          )}

          {library.map((entry) => (
            <label
              key={entry.id}
              className="flex items-start justify-between gap-3 p-4 rounded-xl border-2 border-brand-100 cursor-pointer hover:border-brand-200 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectedResume"
                  checked={selectedResumeId === entry.id}
                  onChange={() => selectResume(entry.id)}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-brand-900">
                    {entry.name}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Updated {new Date(entry.updatedAt).toLocaleDateString()} —{" "}
                    {entry.text.slice(0, 90)}…
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeResume(entry.id)}
                className="text-xs text-rose-600 hover:text-rose-800 shrink-0 font-medium"
              >
                Remove
              </button>
            </label>
          ))}

          {showAddForm ? (
            <div className="p-5 rounded-xl border-2 border-brand-200 bg-brand-50/30 space-y-3">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
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
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 bg-brand-50 border border-brand-200 px-3.5 py-2 rounded-xl"
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
                className="text-xs font-semibold text-brand-900"
              >
                Resume Content
              </label>
              {profile.resumeText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setResumeText("")}
                  className="text-[11px] text-slate-400 hover:text-rose-600"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              id="resumeText"
              rows={12}
              className="input-field font-mono text-xs leading-relaxed"
              placeholder="Paste your full resume here — experience, education, skills, metrics, projects..."
              value={profile.resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {profile.resumeText.length} characters
              {profile.resumeText.length < 50 && profile.resumeText.length > 0 && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  — include more background for optimal tailoring
                </span>
              )}
            </p>

            {profile.resumeText.trim().length > 50 && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-brand-50/50 rounded-xl border border-brand-100">
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

      <TabActions onNext={onNext} nextDisabled={!canNext} />
    </div>
  );
}

