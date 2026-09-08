"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, FilePlus2, ShieldCheck, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { createEvidenceProposal, transitionEvidenceProposal, type EvidenceAnswer, type EvidenceProposal } from "@/lib/groundedEvidence";

const QUESTIONS = [
  { id: "result", label: "What changed because of this work?" },
  { id: "observed", label: "What result did you observe?" },
  { id: "scale", label: "What scale was involved?" },
  { id: "affected", label: "Who or what was affected?" },
];

const emptyAnswers = (): EvidenceAnswer[] => QUESTIONS.map((question) => ({ questionId: question.id, question: question.label, answer: "" }));

export function BulletPointRewriter() {
  const { upsertResume } = useAppStore();
  const [statement, setStatement] = useState("");
  const [answers, setAnswers] = useState<EvidenceAnswer[]>(emptyAnswers);
  const [confirmedEvidence, setConfirmedEvidence] = useState("");
  const [proposal, setProposal] = useState<EvidenceProposal | null>(null);
  const [edited, setEdited] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("offercraft_evidence_proposal_v1");
      if (saved) {
        const parsed = JSON.parse(saved) as EvidenceProposal;
        setProposal(parsed);
        setStatement(parsed.originalStatement);
        setEdited(parsed.editedStatement || parsed.candidate.suggestedStatement);
        setAnswers(parsed.answers);
      }
    } catch { /* stale local proposal is safely ignored */ }
  }, []);

  useEffect(() => {
    if (proposal) localStorage.setItem("offercraft_evidence_proposal_v1", JSON.stringify(proposal));
  }, [proposal]);

  const activeText = edited.trim() || proposal?.candidate.suggestedStatement || "";
  const hasEnoughFacts = useMemo(() => answers.some((answer) => answer.answer.trim()), [answers]);

  const updateAnswer = (questionId: string, answer: string) => {
    setAnswers((current) => current.map((item) => item.questionId === questionId ? { ...item, answer } : item));
  };

  const generate = async () => {
    setError(null);
    setNotice(null);
    if (!statement.trim()) return setError("Add one specific résumé statement to review.");
    if (!hasEnoughFacts && !confirmedEvidence.trim()) return setError("Add at least one fact, or choose “I don't know” / “Not applicable” for the questions that do not apply.");
    setLoading(true);
    try {
      const response = await fetch("/api/evidence-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-workspace-id": "local-beta" },
        body: JSON.stringify({ statement: statement.trim(), answers, confirmedEvidence: confirmedEvidence.trim() }),
      });
      const data = await response.json() as { candidate?: EvidenceProposal["candidate"]; error?: string };
      if (!response.ok || !data.candidate) throw new Error(data.error || "Candidate could not be safely grounded in the supplied facts.");
      const next = createEvidenceProposal({ originalStatement: statement.trim(), answers, candidate: data.candidate });
      setProposal(next);
      setEdited(next.candidate.suggestedStatement);
      setNotice("Candidate generated. Review the factual trace before taking an action.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Candidate could not be safely grounded in the supplied facts.");
    } finally {
      setLoading(false);
    }
  };

  const edit = () => {
    if (!proposal) return;
    try { setProposal(transitionEvidenceProposal(proposal, "edit", edited)); setNotice("Your edit is saved as a proposal only."); } catch (cause) { setError(cause instanceof Error ? cause.message : "Edit failed."); }
  };

  const discard = () => {
    if (!proposal) return;
    setProposal(transitionEvidenceProposal(proposal, "discard"));
    setNotice("Proposal discarded. The authoritative résumé was not changed.");
  };

  const approve = () => {
    if (!proposal) return;
    try { setProposal(transitionEvidenceProposal(proposal, "approve")); setNotice("Approved as a proposal. Create a revision below to make an explicit résumé change."); } catch (cause) { setError(cause instanceof Error ? cause.message : "Approval failed."); }
  };

  const createRevision = async () => {
    if (!proposal || proposal.status !== "APPROVED") return;
    await upsertResume({ name: `Evidence revision — ${new Date().toLocaleDateString()}`, text: activeText });
    setNotice("A new browser-local résumé revision was created. The original statement remains unchanged.");
  };

  const reset = () => {
    setProposal(null); setStatement(""); setAnswers(emptyAnswers()); setConfirmedEvidence(""); setEdited(""); setError(null); setNotice(null); localStorage.removeItem("offercraft_evidence_proposal_v1");
  };

  return (
    <div className="card space-y-5">
      <div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500" /><h3 className="text-base font-bold text-white">Improve with verified evidence</h3></div>
        <p className="mt-1 text-xs leading-5 text-slate-400">We will ask what actually happened, then suggest wording using only the statement and facts you provide. No numbers or tools are guessed.</p>
      </div>

      <label className="block text-xs font-semibold text-slate-300">Specific résumé statement
        <textarea value={statement} onChange={(event) => setStatement(event.target.value)} maxLength={800} rows={3} className="input-field mt-2 w-full text-sm leading-relaxed" placeholder="Paste one résumé statement to review…" />
      </label>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Facts you can verify</p>
        {answers.map((answer) => (
          <label key={answer.questionId} className="block text-xs font-semibold text-slate-300">{answer.question}
            <textarea value={answer.answer} onChange={(event) => updateAnswer(answer.questionId, event.target.value)} maxLength={500} rows={2} className="input-field mt-1.5 w-full text-xs" placeholder="Type a fact, I don't know, or Not applicable" />
          </label>
        ))}
        <label className="block text-xs font-semibold text-slate-300">Confirmed résumé evidence (optional)
          <textarea value={confirmedEvidence} onChange={(event) => setConfirmedEvidence(event.target.value)} maxLength={800} rows={2} className="input-field mt-1.5 w-full text-xs" placeholder="A phrase already confirmed elsewhere in your résumé…" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={generate} disabled={loading} className="btn-primary text-xs">{loading ? "Checking evidence…" : "Generate grounded candidate"}</button>
        {proposal && <button type="button" onClick={reset} className="btn-secondary text-xs">Start over</button>}
      </div>

      {error && <p className="rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-xs font-semibold text-rose-200">{error}</p>}
      {notice && <p className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-200">{notice}</p>}

      {proposal && proposal.status !== "DISCARDED" && (
        <div className="space-y-4 border-t border-slate-800 pt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><p className="text-[10px] font-bold uppercase text-slate-500">Original statement</p><p className="mt-2 text-xs leading-5 text-slate-200">{proposal.originalStatement}</p></div>
            <div className="rounded-xl border border-indigo-800/60 bg-indigo-950/20 p-3"><p className="text-[10px] font-bold uppercase text-indigo-300">Suggested statement</p><textarea value={edited} onChange={(event) => setEdited(event.target.value)} maxLength={800} rows={4} className="mt-2 w-full resize-y bg-transparent text-xs leading-5 text-slate-100 outline-none" /></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><p className="text-[10px] font-bold uppercase text-slate-500">Why this wording is supported</p><p className="mt-2 text-xs leading-5 text-slate-300">{proposal.candidate.whySupported}</p><div className="mt-3 space-y-2">{proposal.candidate.trace.map((item, index) => <div key={`${item.phrase}-${index}`} className="rounded-lg border border-slate-800 p-2 text-xs"><span className="font-semibold text-emerald-300">“{item.phrase}”</span><span className="text-slate-500"> · {item.source}</span><p className="mt-1 text-slate-400">{item.whySupported}</p></div>)}</div></div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-auto text-[11px] font-semibold text-slate-500">State: {proposal.status}</span>
            {proposal.status !== "APPROVED" && <button type="button" onClick={edit} className="btn-secondary flex items-center gap-1.5 text-xs"><Edit3 className="h-3.5 w-3.5" /> Save edit</button>}
            {proposal.status !== "APPROVED" && <button type="button" onClick={approve} className="btn-primary flex items-center gap-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Approve proposal</button>}
            <button type="button" onClick={discard} className="rounded-xl border border-rose-800 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/50"><Trash2 className="mr-1 inline h-3.5 w-3.5" /> Discard</button>
          </div>
          {proposal.status === "APPROVED" && <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-3"><p className="text-xs leading-5 text-emerald-200">Approval does not overwrite the authoritative résumé. Use the explicit action below to create a separate browser-local revision.</p><button type="button" onClick={createRevision} className="btn-primary mt-3 flex items-center gap-1.5 text-xs"><FilePlus2 className="h-3.5 w-3.5" /> Create local revision</button></div>}
        </div>
      )}
    </div>
  );
}
