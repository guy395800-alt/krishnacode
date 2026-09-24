'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Trophy, Medal, Filter, Search, Zap, Star } from 'lucide-react';

export default function StudentLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState('All');
  const [section, setSection] = useState('All');

  useEffect(() => {
    fetchLeaderboard();
  }, [batch, section]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = {};
      if (batch !== 'All') params.batch = batch;
      if (section !== 'All') params.section = section;

      const resp = await api.get('/leaderboard', { params });
      setLeaderboard(resp.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700 fill-amber-700" />;
    return <span className="font-mono font-bold text-slate-500">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" /> Global Leaderboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time competitive student rankings based on score, solved problems, and accuracy
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
          <Filter className="h-4 w-4" /> Filters:
        </div>

        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Batches</option>
          <option value="2023-2027">Batch 2023-2027</option>
          <option value="2022-2026">Batch 2022-2026</option>
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>

      {/* Rankings Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Updating leaderboard rankings...</div>
        ) : leaderboard.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Reg No</th>
                <th className="px-6 py-4">Batch / Sec</th>
                <th className="px-6 py-4">Problems Solved</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((st) => (
                <tr key={st.student_id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${st.rank <= 3 ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-6 py-4 font-bold flex items-center gap-2">
                    {getRankBadge(st.rank)}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {st.student_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {st.registration_number}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {st.batch} ({st.section})
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {st.problems_solved}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {st.accuracy}%
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {st.score}
                  </td>
                  <td className="px-6 py-4 font-bold text-xs text-amber-500">
                    🔥 {st.streak} Days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No leaderboard entries found for selected filter</div>
        )}
      </div>
    </div>
  );
}
