import * as XLSX from 'xlsx';
import { ArchetypeAnalysisResult, ArchetypeTrack } from './archetypeScoring';

export function exportToExcel(
  result: ArchetypeAnalysisResult,
  jdText: string,
  jobTitle: string = 'Target Role'
): void {
  const wb = XLSX.utils.book_new();

  // 1. OVERVIEW Sheet
  const overviewData = [
    ['🎯 RESUMEPILOT - JD TO RESUME MATCHING REPORT'],
    ['Target Job Title:', jobTitle],
    ['Best-Fit Archetype:', result.bestFit.name, 'Score:', `${result.bestFit.finalScore}/40`, 'Match:', result.bestFit.matchLevel],
    [],
    ['Career Track', 'Keyword Score (0-30)', 'Pattern Match', 'Company Fit', 'Red Flag Penalty', 'Final Score (0-40)', 'Match Tier'],
    ...(['AI', 'TPM', 'ITDM', 'PM'] as ArchetypeTrack[]).map(t => {
      const res = result.tracks[t];
      return [
        res.name,
        res.keywordScore,
        res.patternMatch,
        res.companyMatch,
        res.redFlagPenalty,
        res.finalScore,
        res.matchLevel
      ];
    }),
    [],
    ['Top Action Items Before Applying:'],
    ...result.actionItems.map(item => [item]),
    [],
    ['Top 5 Resume Edits:'],
    ...result.top5Edits.map(edit => [edit])
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'OVERVIEW');

  // 2. JD_INPUT Sheet
  const jdData = [
    ['Job Description Input'],
    ['Job Title:', jobTitle],
    ['Date Analyzed:', new Date().toISOString().split('T')[0]],
    [],
    ['Raw Job Description Text:'],
    [jdText || '']
  ];
  const wsJD = XLSX.utils.aoa_to_sheet(jdData);
  XLSX.utils.book_append_sheet(wb, wsJD, 'JD_INPUT');

  // 3-6. Track Scoring Sheets
  (['AI', 'TPM', 'ITDM', 'PM'] as ArchetypeTrack[]).forEach(track => {
    const trackRes = result.tracks[track];
    const sheetName = `${track}_SCORE`;
    const trackRows = [
      [`${trackRes.name} - Scoring`],
      [],
      ['Keyword / Theme', 'Weight', 'Auto Score (0,1,2)', 'Weighted Score', 'Notes', 'JD Hit?'],
      ...trackRes.themeScores.map(ts => [
        ts.theme,
        ts.weight,
        ts.autoScore,
        ts.weightedScore,
        ts.notes,
        ts.isHit ? '✅ YES' : '❌ NO'
      ]),
      [],
      ['TOTAL KEYWORD SCORE', '', '', trackRes.keywordScore, `(${trackRes.keywordScore}/30)`],
      ['Responsibility Pattern Match (0-5)', '', '', trackRes.patternMatch],
      ['Company Match (0-5)', '', '', trackRes.companyMatch],
      ['Red Flag Penalty (0-5)', '', '', trackRes.redFlagPenalty],
      ['FINAL SCORE', '', '', trackRes.finalScore, `(${trackRes.matchLevel})`],
      [],
      ['TOP MISSING KEYWORDS'],
      ['Rank', 'Missing Keyword', 'Weight', 'Boost Potential', 'Action Plan'],
      ...trackRes.topMissingKeywords.map(m => [
        m.rank,
        m.theme,
        m.weight,
        m.boost,
        m.action
      ])
    ];
    const wsTrack = XLSX.utils.aoa_to_sheet(trackRows);
    XLSX.utils.book_append_sheet(wb, wsTrack, sheetName);
  });

  // 7. FINAL_RECOMMENDATION Sheet
  const finalRecRows = [
    ['Final Recommendation - Auto-Calculated'],
    [],
    ['Career Track', 'Final Score', 'Match Level', 'Notes'],
    ...(['AI', 'TPM', 'ITDM', 'PM'] as ArchetypeTrack[]).map(t => [
      result.tracks[t].name,
      result.tracks[t].finalScore,
      result.tracks[t].matchLevel,
      result.tracks[t].tagline
    ]),
    [],
    ['🏆 BEST FIT RESUME:', result.bestFit.name],
    ['Score:', `${result.bestFit.finalScore}/40`, 'Match:', result.bestFit.matchLevel],
    [],
    ['Interview Themes to Prepare:'],
    [result.interviewThemes],
    [],
    ['Top 5 Resume Edits:'],
    ...result.top5Edits.map(e => [e])
  ];
  const wsFinal = XLSX.utils.aoa_to_sheet(finalRecRows);
  XLSX.utils.book_append_sheet(wb, wsFinal, 'FINAL_RECOMMENDATION');

  // 8. BULLET_GENERATOR Sheet
  const bulletRows = [
    ['✍️ RESUME BULLET GENERATOR — 60 Pre-Engineered Accomplishments'],
    ['Green / YES bullets match your JD keywords — ready to insert directly into resume'],
    [],
    ['Track', 'Keyword Theme', 'Suggested Resume Bullet (Metric-Ready)', 'JD Hit?', 'Recommended?'],
    ...result.bullets.map(b => [
      b.track,
      b.theme,
      b.bullet,
      b.jdHit ? '✅ YES' : '❌ NO',
      b.isRecommended ? '🟢 USE THIS' : '—'
    ])
  ];
  const wsBullets = XLSX.utils.aoa_to_sheet(bulletRows);
  XLSX.utils.book_append_sheet(wb, wsBullets, 'BULLET_GENERATOR');

  // Download
  const cleanTitle = (jobTitle || 'Resume_Scoring').replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(wb, `${cleanTitle}_ResumePilot_Analysis.xlsx`);
}

export async function parseExcelJobFile(file: File): Promise<{ jdText?: string; jobTitle?: string }> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });
  
  let jdText = '';
  let jobTitle = '';

  if (wb.SheetNames.includes('JD_INPUT')) {
    const ws = wb.Sheets['JD_INPUT'];
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
    for (const row of rows) {
      if (Array.isArray(row)) {
        if (row[0] && row[0].toString().toLowerCase().includes('job title:')) {
          jobTitle = row[1] ? row[1].toString() : '';
        }
        for (const cell of row) {
          if (cell && typeof cell === 'string' && cell.length > 50) {
            jdText = cell;
            break;
          }
        }
      }
      if (jdText) break;
    }
  }

  if (!jdText && wb.SheetNames.length > 0) {
    const firstWs = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<string[]>(firstWs, { header: 1 });
    for (const row of rows) {
      if (Array.isArray(row)) {
        for (const cell of row) {
          if (cell && typeof cell === 'string' && cell.length > 50) {
            jdText = cell;
            break;
          }
        }
      }
      if (jdText) break;
    }
  }

  return { jdText, jobTitle };
}