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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Curated Resume Bullet Bank</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {recommendedCount} Recommended for this JD
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                60 formula-engineered, metric-driven accomplishments from your career utility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tracks Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tracks.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
                  selectedTrack === t.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
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
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search 60 bullets or themes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setOnlyRecommended(!onlyRecommended)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border shrink-0 ${
                onlyRecommended
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>🟢 Recommended Only ({recommendedCount})</span>
            </button>
          </div>
        </div>

        {/* Bullets List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
          {filteredBullets.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-sm font-bold">No bullet points match your filter criteria.</p>
              <p className="text-xs text-slate-600 mt-1">Try toggling &apos;Recommended Only&apos; or clearing the search box.</p>
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
                      ? 'bg-white border-emerald-300 shadow-xs hover:border-emerald-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {b.track}
                      </span>
                      <span className="text-xs font-bold text-indigo-700">
                        {b.theme}
                      </span>
                    </div>
                    <div>
                      {b.isRecommended ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                          🟢 USE THIS — Matches JD
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">⚪ Optional</span>
                      )}
                    </div>
                  </div>

                  {/* Bullet Content */}
                  <p className="text-sm text-slate-800 leading-relaxed font-sans font-medium">
                    {b.bullet.split(/(\[[^\]]+\])/g).map((part, i) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        return (
                          <span
                            key={i}
                            className="bg-amber-100 text-amber-900 font-mono font-bold px-1 rounded border border-amber-300 text-xs mx-0.5"
                          >
                            {part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(b.bullet, idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 transition-colors border border-slate-300 shadow-xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
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