'use client';

import React, { useState, useMemo } from 'react';
import {
  ArchetypeTrack,
  evaluateArchetypes,
} from '@/lib/archetypeScoring';
import {
  X,
  Sparkles,
  Search,
  Copy,
  Check,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

interface BulletBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  jdText: string;
  initialTrack?: ArchetypeTrack;
  onInsertBullet?: (bulletText: string) => void;
}

export default function BulletBankModal({
  isOpen,
  onClose,
  jdText,
  initialTrack,
  onInsertBullet
}: BulletBankModalProps) {
  const [selectedTrack, setSelectedTrack] = useState<ArchetypeTrack | 'ALL'>('ALL');
  const [onlyRecommended, setOnlyRecommended] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [insertedIndex, setInsertedIndex] = useState<number | null>(null);

  const analysis = useMemo(() => {
    return evaluateArchetypes(jdText);
  }, [jdText]);

  React.useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack, isOpen]);

  if (!isOpen) return null;

  const filteredBullets = analysis.bullets.filter(b => {
    if (selectedTrack !== 'ALL' && b.trackId !== selectedTrack) {
      return false;
    }
    if (onlyRecommended && !b.isRecommended) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const themeMatch = b.theme.toLowerCase().includes(q);
      const bulletMatch = b.bullet.toLowerCase().includes(q);
      if (!themeMatch && !bulletMatch) return false;
    }
    return true;
  });

  const recommendedCount = analysis.bullets.filter(b => b.isRecommended).length;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInsert = (text: string, idx: number) => {
    if (onInsertBullet) {
      onInsertBullet(text);
      setInsertedIndex(idx);
      setTimeout(() => setInsertedIndex(null), 2000);
    }
  };

  const tracks: Array<{ id: ArchetypeTrack | 'ALL'; label: string; icon: string }> = [
    { id: 'ALL', label: 'All Tracks (60)', icon: '🌟' },
    { id: 'AI', label: 'AI Transformation (15)', icon: '🤖' },
    { id: 'TPM', label: 'Technical PM (15)', icon: '⚙️' },
    { id: 'ITDM', label: 'IT Delivery (15)', icon: '🛠️' },
    { id: 'PM', label: 'Product Manager (15)', icon: '📦' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Curated Resume Bullet Bank</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {recommendedCount} Recommended for this JD
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                60 formula-engineered, metric-driven accomplishments from your career utility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tracks Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tracks.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  selectedTrack === t.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Recommend Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search 60 bullets or themes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setOnlyRecommended(!onlyRecommended)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 border shrink-0 ${
                onlyRecommended
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>🟢 Recommended Only ({recommendedCount})</span>
            </button>
          </div>
        </div>

        {/* Bullets List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-950/40">
          {filteredBullets.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm font-semibold">No bullet points match your filter criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try toggling &apos;Recommended Only&apos; or clearing the search box.</p>
            </div>
          ) : (
            filteredBullets.map((b, idx) => {
              const isCopied = copiedIndex === idx;
              const isInserted = insertedIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    b.isRecommended
                      ? 'bg-slate-900/90 border-emerald-800/50 hover:border-emerald-700/80 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {b.track}
                      </span>
                      <span className="text-xs font-semibold text-indigo-300">
                        {b.theme}
                      </span>
                    </div>
                    <div>
                      {b.isRecommended ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/60 animate-pulse">
                          🟢 USE THIS — Matches JD
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">⚪ Optional</span>
                      )}
                    </div>
                  </div>

                  {/* Bullet Content */}
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {b.bullet.split(/(\[[^\]]+\])/g).map((part, i) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        return (
                          <span
                            key={i}
                            className="bg-amber-500/20 text-amber-300 font-mono font-bold px-1 rounded border border-amber-500/30 text-xs mx-0.5"
                          >
                            {part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(b.bullet, idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Text
                        </>
                      )}
                    </button>

                    {onInsertBullet && (
                      <button
                        onClick={() => handleInsert(b.bullet, idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                      >
                        {isInserted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" /> Injected into Resume!
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" /> Insert into LaTeX Resume
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}