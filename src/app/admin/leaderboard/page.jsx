'use client';

import React, { useState, useEffect } from 'react';
import { api, getExportUrl } from '../../../lib/api';
import { Trophy, FileSpreadsheet, Medal } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const resp = await api.get('/leaderboard');
      setLeaderboard(resp.data || []);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans animate-reveal-fade">
      <PageHeader
        title="Leaderboard Audit &amp; Rankings"
        subtitle="Global student standing audit, verified submission accuracy, and point totals."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="h-3.5 w-3.5" /> Institutional Standings
          </span>
        }
        actions={
          <a
            href={getExportUrl('leaderboard')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700/80 text-white hover:bg-slate-800 transition-all interactive-btn"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export CSV
          </a>
        }
      />

      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reg No</th>
                  <th className="px-6 py-4">Cohort</th>
                  <th className="px-6 py-4">Solved</th>
                  <th className="px-6 py-4">Accuracy</th>
                  <th className="px-6 py-4">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {leaderboard.map((st) => (
                  <tr key={st.student_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-black font-mono">
                      {st.rank === 1 ? (
                        <span className="text-amber-400 flex items-center gap-1">🥇 #1</span>
                      ) : st.rank === 2 ? (
                        <span className="text-slate-300 flex items-center gap-1">🥈 #2</span>
                      ) : st.rank === 3 ? (
                        <span className="text-amber-600 flex items-center gap-1">🥉 #3</span>
                      ) : (
                        <span className="text-slate-400">#{st.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{st.student_name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{st.registration_number}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{st.batch} ({st.section})</td>
                    <td className="px-6 py-4 font-mono font-bold text-white">{st.problems_solved}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{st.accuracy}%</td>
                    <td className="px-6 py-4 font-mono font-black text-amber-400">{st.score} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="No Leaderboard Data Available"
            description="Student rankings will compute and populate here once problem submissions are evaluated."
          />
        )}
      </div>
    </div>
  );
}
