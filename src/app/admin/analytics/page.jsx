'use client';

import React from 'react';
import { getExportUrl } from '../../../lib/api';
import { BarChart3, FileSpreadsheet, Download, Users, History, Trophy } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Analytics & Data Exports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Download CSV and Excel compatible analytical reports for institutional record keeping
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
          <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Student Directory Export</h3>
          <p className="text-xs text-slate-500">Includes registration numbers, email, batch, section, and total scores.</p>
          <a
            href={getExportUrl('students')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
          <div className="h-14 w-14 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <History className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Submissions Audit Report</h3>
          <p className="text-xs text-slate-500">Includes submission statuses, execution times, language breakdown, and scores.</p>
          <a
            href={getExportUrl('submissions')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
          <div className="h-14 w-14 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Leaderboard Rankings</h3>
          <p className="text-xs text-slate-500">Includes global student ranks, solved counts, problem accuracy %, and streaks.</p>
          <a
            href={getExportUrl('leaderboard')}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}
