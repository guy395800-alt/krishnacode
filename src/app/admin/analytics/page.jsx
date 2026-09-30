'use client';

import React from 'react';
import { getExportUrl } from '../../../lib/api';
import { BarChart3, FileSpreadsheet, Download, Users, History, Trophy } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans animate-reveal-fade">
      <PageHeader
        title="Analytics &amp; Data Exports"
        subtitle="Export cryptographically verified institutional records, student performance ledgers, and raw execution logs."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <FileSpreadsheet className="h-3.5 w-3.5" /> CSV / Excel Engine
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4 text-center interactive-card">
          <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-white text-base">Student Directory Ledger</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Complete institutional roster with registration numbers, email, batch, section, and total scores.
          </p>
          <a
            href={getExportUrl('students')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all interactive-btn"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4 text-center interactive-card">
          <div className="h-14 w-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
            <History className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-white text-base">Submissions Audit Log</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Timestamped execution stream with verdicts, runtime latency (ms), language breakdown, and point allocations.
          </p>
          <a
            href={getExportUrl('submissions')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all interactive-btn"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4 text-center interactive-card">
          <div className="h-14 w-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-white text-base">Leaderboard Standings</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Audited global student rank distribution, problem count totals, pass rate percentages, and score sums.
          </p>
          <a
            href={getExportUrl('leaderboard')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all interactive-btn"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}
