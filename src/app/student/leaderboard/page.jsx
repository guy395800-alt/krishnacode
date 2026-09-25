'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Trophy, Medal, Filter, Star, Flame, Sparkles, Award, Crown } from 'lucide-react';

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
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-400 animate-bounce" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600 fill-amber-600" />;
    return <span className="font-mono font-bold text-slate-400">#{rank}</span>;
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
            <Trophy className="h-8 w-8 text-amber-400" /> Global Leaderboard
          </h1>
          <p className="text-sm text-slate-400">
            Real-time competitive student rankings based on score, solved problems, and accuracy
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          {/* 2nd Place (Silver) */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/60 border border-slate-400/30 shadow-xl text-center space-y-3 relative hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-700 border border-slate-500 text-slate-200 text-xs font-bold font-mono">
              🥈 2nd Place
            </div>
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center font-black text-white text-xl shadow-lg">
              {top2.student_name ? top2.student_name.charAt(0).toUpperCase() : '2'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{top2.student_name}</h3>
              <span className="text-xs text-slate-400 font-mono">{top2.registration_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs flex items-center justify-around">
              <div>
                <span className="text-slate-500 block text-[10px]">Score</span>
                <span className="text-blue-400 font-bold">{top2.score} pts</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Solved</span>
                <span className="text-emerald-400 font-bold">{top2.problems_solved}</span>
              </div>
            </div>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div className="order-1 md:order-2 p-7 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900/80 to-slate-900/90 border border-amber-500/50 shadow-2xl text-center space-y-3 relative -translate-y-2 hover:-translate-y-3 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black font-mono flex items-center gap-1 shadow-lg shadow-amber-500/30">
              👑 Champion
            </div>
            <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-1 shadow-xl shadow-amber-500/30">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-amber-400 text-2xl">
                {top1.student_name ? top1.student_name.charAt(0).toUpperCase() : '1'}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{top1.student_name}</h3>
              <span className="text-xs text-amber-300/80 font-mono font-bold">{top1.registration_number}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/20 font-mono text-xs flex items-center justify-around">
              <div>
                <span className="text-slate-400 block text-[10px]">Score</span>
                <span className="text-amber-400 font-black text-sm">{top1.score} pts</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Solved</span>
                <span className="text-emerald-400 font-black text-sm">{top1.problems_solved}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Streak</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Flame className="h-3.5 w-3.5 fill-amber-400" /> {top1.streak}d
                </span>
              </div>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 md:order-3 p-6 rounded-3xl bg-slate-900/60 border border-amber-800/40 shadow-xl text-center space-y-3 relative hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-900 border border-amber-700 text-amber-200 text-xs font-bold font-mono">
              🥉 3rd Place
            </div>
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-800 to-amber-600 flex items-center justify-center font-black text-white text-xl shadow-lg">
              {top3.student_name ? top3.student_name.charAt(0).toUpperCase() : '3'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{top3.student_name}</h3>
              <span className="text-xs text-slate-400 font-mono">{top3.registration_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs flex items-center justify-around">
              <div>
                <span className="text-slate-500 block text-[10px]">Score</span>
                <span className="text-blue-400 font-bold">{top3.score} pts</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Solved</span>
                <span className="text-emerald-400 font-bold">{top3.problems_solved}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
          <Filter className="h-4 w-4 text-blue-400" /> Filters:
        </div>

        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Batches</option>
          <option value="2023-2027">Batch 2023-2027</option>
          <option value="2022-2026">Batch 2022-2026</option>
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>

      {/* Full Rankings Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">Updating leaderboard rankings...</div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/60 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 rounded-l-2xl">Rank</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Reg No</th>
                  <th className="px-6 py-4">Batch / Sec</th>
                  <th className="px-6 py-4">Solved</th>
                  <th className="px-6 py-4">Accuracy</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 rounded-r-2xl">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((st) => (
                  <tr key={st.student_id} className={`hover:bg-slate-800/40 transition-colors ${st.rank <= 3 ? 'bg-amber-500/5 font-semibold' : ''}`}>
                    <td className="px-6 py-4 font-bold flex items-center gap-2">
                      {getRankBadge(st.rank)}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {st.student_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {st.registration_number}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {st.batch} ({st.section})
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {st.problems_solved}
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-400">
                      {st.accuracy}%
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-amber-400 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {st.score}
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-400">
                      🔥 {st.streak}d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">No leaderboard entries found for selected filter</div>
        )}
      </div>
    </div>
  );
}
