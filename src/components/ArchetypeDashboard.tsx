'use client';

import React, { useState, useMemo } from 'react';
import {
  ArchetypeTrack,
  AdditionalFactors,
  evaluateArchetypes,
  TRACK_META
} from '@/lib/archetypeScoring';
import { exportToExcel } from '@/lib/excelIntegration';
import {
  Trophy,
  Sparkles,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Target,
  BookOpen,
  Layers
} from 'lucide-react';

interface ArchetypeDashboardProps {
  jdText: string;
  jobTitle?: string;
  onOpenBulletBank?: (track?: ArchetypeTrack) => void;
}

export default function ArchetypeDashboard({
  jdText,
  jobTitle = 'Target Role',
  onOpenBulletBank
}: ArchetypeDashboardProps) {
  const [activeTrack, setActiveTrack] = useState<ArchetypeTrack>('TPM');
  const [factors, setFactors] = useState<AdditionalFactors>({
    patternMatch: { AI: 1, TPM: 3, ITDM: 1, PM: 3 },
    companyMatch: { AI: 4, TPM: 3, ITDM: 2, PM: 1 },
    redFlagPenalty: { AI: 0, TPM: 0, ITDM: 0, PM: 0 }
  });
  const [showFactorControls, setShowFactorControls] = useState(false);
  const [expandedThemes, setExpandedThemes] = useState(false);

  const analysis = useMemo(() => {
    return evaluateArchetypes(jdText, factors);
  }, [jdText, factors]);

  // Auto-switch to best fit on initial load or JD change
  React.useEffect(() => {
    if (analysis.bestFitTrack) {
      setActiveTrack(analysis.bestFitTrack);
    }
  }, [analysis.bestFitTrack]);

  const currentTrackResult = analysis.tracks[activeTrack];

  const handleFactorChange = (
    type: 'patternMatch' | 'companyMatch' | 'redFlagPenalty',
    track: ArchetypeTrack,
    value: number
  ) => {
    setFactors(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [track]: value
      }
    }));
  };

  const handleExport = () => {
    exportToExcel(analysis, jdText, jobTitle);
  };

  const tracks: ArchetypeTrack[] = ['AI', 'TPM', 'ITDM', 'PM'];

  return (
    <div className="space-y-6">
      {/* Best Fit Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Formula-Derived Career Archetype
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${analysis.bestFit.matchLevelColor}`}>
                {analysis.bestFit.matchLevel}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>{analysis.bestFit.icon}</span>
              <span>{analysis.bestFit.name}</span>
              <span className="text-sm font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Score: {analysis.bestFit.finalScore}/40
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              {analysis.bestFit.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
            >
              <Download className="w-4 h-4" /> Export Excel (.xlsx)
            </button>
            {onOpenBulletBank && (
              <button
                onClick={() => onOpenBulletBank(analysis.bestFitTrack)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> 60-Bullet Bank
              </button>
            )}
          </div>
        </div>

        {/* Strategic Next Steps */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Immediate Strategy & Positioning
            </span>
            <p className="text-slate-400 leading-relaxed">{analysis.interviewThemes}</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Top Alignment Tip
            </span>
            <p className="text-slate-400 leading-relaxed">{analysis.top5Edits[0]}</p>
          </div>
        </div>
      </div>

      {/* 4-Track Tabs Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tracks.map(track => {
          const res = analysis.tracks[track];
          const isSelected = activeTrack === track;
          const isBest = analysis.bestFitTrack === track;
          return (
            <button
              key={track}
              onClick={() => setActiveTrack(track)}
              className={`relative text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {isBest && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  BEST FIT
                </span>
              )}
              <div className="text-2xl mb-1">{res.icon}</div>
              <div className="font-bold text-sm text-white truncate">{res.name}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-slate-400">Score:</span>
                <span className="font-extrabold text-white">{res.finalScore}/40</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    res.finalScore >= 32
                      ? 'bg-emerald-500'
                      : res.finalScore >= 25
                      ? 'bg-blue-500'
                      : res.finalScore >= 18
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (res.finalScore / 40) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Track Deep Dive */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{currentTrackResult.icon}</span>
                <span>{currentTrackResult.name} Breakdown</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentTrackResult.matchLevelColor}`}>
                {currentTrackResult.matchLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Keyword Score: <strong className="text-white">{currentTrackResult.keywordScore}/30 pts</strong> | Pattern: +{currentTrackResult.patternMatch} | Company: +{currentTrackResult.companyMatch} | Penalty: -{currentTrackResult.redFlagPenalty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFactorControls(!showFactorControls)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Adjust Factors
            </button>
            {onOpenBulletBank && (
              <button
                onClick={() => onOpenBulletBank(activeTrack)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/80 hover:bg-indigo-600 text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> View {currentTrackResult.name} Bullets (15)
              </button>
            )}
          </div>
        </div>

        {/* Factor Controls Drawer */}
        {showFactorControls && (
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-4 text-xs animate-in fade-in duration-200">
            <div className="font-bold text-slate-200">Additional Excel Formula Factors (0-5 scale):</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="flex justify-between text-slate-300 font-medium">
                  <span>Responsibility Pattern:</span>
                  <span className="font-bold text-indigo-400">{currentTrackResult.patternMatch}/5</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={currentTrackResult.patternMatch}
                  onChange={e => handleFactorChange('patternMatch', activeTrack, parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <p className="text-[11px] text-slate-500">{TRACK_META[activeTrack].patternDesc}</p>
              </div>
              <div className="space-y-1.5">
                <label className="flex justify-between text-slate-300 font-medium">
                  <span>Company Match:</span>
                  <span className="font-bold text-indigo-400">{currentTrackResult.companyMatch}/5</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={currentTrackResult.companyMatch}
                  onChange={e => handleFactorChange('companyMatch', activeTrack, parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <p className="text-[11px] text-slate-500">{TRACK_META[activeTrack].companyDesc}</p>
              </div>
              <div className="space-y-1.5">
                <label className="flex justify-between text-slate-300 font-medium">
                  <span>Red Flag Penalty:</span>
                  <span className="font-bold text-red-400">-{currentTrackResult.redFlagPenalty}/5</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={currentTrackResult.redFlagPenalty}
                  onChange={e => handleFactorChange('redFlagPenalty', activeTrack, parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
                <p className="text-[11px] text-slate-500">{TRACK_META[activeTrack].redFlagDesc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Missing Keywords & Boost Potential Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Top Missing Keywords & Point Boost Potential
            </h4>
            <span className="text-xs text-slate-400">Add these themes to boost score (+4 pts each)</span>
          </div>

          {currentTrackResult.topMissingKeywords.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All 15 core competency themes for {currentTrackResult.name} are present in the JD!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Missing Competency</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Score Boost</th>
                    <th className="p-3">Action Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {currentTrackResult.topMissingKeywords.map(item => (
                    <tr key={item.rank} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-400">#{item.rank}</td>
                      <td className="p-3 font-bold text-white">{item.theme}</td>
                      <td className="p-3 text-slate-400">{item.weight}x</td>
                      <td className="p-3 font-bold text-emerald-400">{item.boost}</td>
                      <td className="p-3 text-slate-300 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{item.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 15 Theme Score Details Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setExpandedThemes(!expandedThemes)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> View All 15 Evaluated Competency Themes ({currentTrackResult.themeScores.filter(t => t.isHit).length}/15 Matched)
            </span>
            {expandedThemes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedThemes && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs animate-in fade-in duration-200">
              {currentTrackResult.themeScores.map((theme, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                    theme.isHit
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-200">{theme.theme}</span>
                    {theme.isHit ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50">
                        <CheckCircle2 className="w-3 h-3" /> +{theme.weightedScore} pts
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        <XCircle className="w-3 h-3" /> 0 pts
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {theme.isHit ? (
                      <span className="text-emerald-400 font-mono">Matched: {theme.matchedSynonyms.slice(0, 3).join(', ')}</span>
                    ) : (
                      <span>{theme.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}