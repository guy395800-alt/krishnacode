'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Trophy, Medal, Filter, Star, Flame, Sparkles, Award, Crown } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

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
      setLeaderboard(resp.data || []);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600 fill-amber-600" />;
    return <span className="font-mono font-bold text-slate-400">#{rank}</span>;
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Campus Leaderboard"
        subtitle="Rankings determined by verified problem submissions, cumulative XP score, and algorithmic accuracy."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="h-3.5 w-3.5" /> Competitive Standing
          </span>
        }
      />

      {/* Top 3 Podium Cards (when 3 or more exist) */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 shadow-lg text-center space-y-3 relative">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold font-mono">
              🥈 2nd Place
            </div>
            <div className="h-14 w-14 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-lg">
              {top2.student_name ? top2.student_name.charAt(0).toUpperCase() : '2'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{top2.student_name}</h3>
              <span className="text-[11px] text-slate-400 font-mono">{top2.registration_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-around">
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

          {/* 1st Place */}
          <div className="order-1 md:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-950/30 via-slate-900/80 to-slate-900 border border-amber-500/40 shadow-xl text-center space-y-3 relative md:-translate-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black font-mono shadow-md shadow-amber-500/20">
              👑 Champion
            </div>
            <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-2xl shadow-lg">
              {top1.student_name ? top1.student_name.charAt(0).toUpperCase() : '1'}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{top1.student_name}</h3>
              <span className="text-xs text-amber-400/90 font-mono font-bold">{top1.registration_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/20 font-mono text-xs flex items-center justify-around">
              <div>
                <span className="text-slate-500 block text-[10px]">Score</span>
                <span className="text-amber-400 font-bold">{top1.score} pts</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Solved</span>
                <span className="text-emerald-400 font-bold">{top1.problems_solved}</span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 md:order-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 shadow-lg text-center space-y-3 relative">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-amber-600 text-xs font-bold font-mono">
              🥉 3rd Place
            </div>
            <div className="h-14 w-14 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-lg">
              {top3.student_name ? top3.student_name.charAt(0).toUpperCase() : '3'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{top3.student_name}</h3>
              <span className="text-[11px] text-slate-400 font-mono">{top3.registration_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-around">
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

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Rank</th>
                  <th className="px-5 py-3.5 font-semibold">Student Name</th>
                  <th className="px-5 py-3.5 font-semibold">Registration ID</th>
                  <th className="px-5 py-3.5 font-semibold">Problems Solved</th>
                  <th className="px-5 py-3.5 font-semibold">Accuracy</th>
                  <th className="px-5 py-3.5 text-right font-semibold">XP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={entry.id || idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold">
                        <div className="flex items-center gap-2">
                          {getRankBadge(rank)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {entry.student_name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {entry.registration_number}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        {entry.problems_solved || 0}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">
                        {entry.accuracy || 0}%
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-400">
                        {entry.score || 0} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="Leaderboard Empty"
            description="No student rankings have been calculated yet. Rankings update automatically as students solve problems and complete tests."
          />
        )}
      </div>
    </div>
  );
}
