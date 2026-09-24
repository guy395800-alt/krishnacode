'use client';

import React, { useState, useEffect } from 'react';
import { api, getExportUrl } from '../../../lib/api';
import { Trophy, FileSpreadsheet } from 'lucide-react';

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const resp = await api.get('/leaderboard');
      setLeaderboard(resp.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" /> Leaderboard Audit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Global rankings and student score verification
          </p>
        </div>

        <a
          href={getExportUrl('leaderboard')}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Leaderboard CSV
        </a>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading rankings...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Reg No</th>
                <th className="px-6 py-4">Batch / Sec</th>
                <th className="px-6 py-4">Solved</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((st) => (
                <tr key={st.student_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-bold font-mono">#{st.rank}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{st.student_name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{st.registration_number}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{st.batch} ({st.section})</td>
                  <td className="px-6 py-4 font-mono font-bold">{st.problems_solved}</td>
                  <td className="px-6 py-4 font-mono text-xs">{st.accuracy}%</td>
                  <td className="px-6 py-4 font-mono font-black text-amber-500">{st.score} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
