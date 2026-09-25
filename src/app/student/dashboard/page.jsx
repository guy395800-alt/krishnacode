'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import {
  Code2,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Target,
  GraduationCap,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Flame,
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const resp = await api.get('/students/me/stats');
      setStats(resp.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Student Dashboard...</span>
        </div>
      </div>
    );
  }

  const accuracyData = [
    { name: 'Accepted', value: stats?.accepted_submissions || 0, color: '#10b981' },
    { name: 'Rejected', value: Math.max(0, (stats?.total_submissions || 0) - (stats?.accepted_submissions || 0)), color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner with Glowing Accents */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
            <Sparkles className="h-4 w-4 text-amber-300" /> Active Student Developer
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.full_name || 'Coder'}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl font-normal leading-relaxed">
            Ready to level up your algorithms? Solve daily problems, maintain your streak, and ace technical exams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/student/problems"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-black/10 transition-all hover:scale-105"
          >
            <Code2 className="h-5 w-5" /> Start Practice
          </Link>
          <Link
            href="/student/exams"
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold bg-blue-900/60 hover:bg-blue-900/80 text-white border border-white/20 backdrop-blur-md transition-all"
          >
            <GraduationCap className="h-5 w-5 text-amber-300" /> Take Exam
          </Link>
        </div>
      </div>

      {/* 2. KPI Stat Tiles (Glassmorphic Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Problems Solved */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Problems Solved
            </span>
            <div className="text-3xl font-black text-white">
              {stats?.problems_solved || 0}
            </div>
            <span className="text-xs text-slate-400">{stats?.problems_attempted || 0} attempted</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Problem Accuracy */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="text-3xl font-black text-white">
              {stats?.accuracy || 0}%
            </div>
            <span className="text-xs text-slate-400 font-mono">{stats?.accepted_submissions || 0}/{stats?.total_submissions || 0} Passed</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
            <Target className="h-6 w-6" />
          </div>
        </div>

        {/* Coding Score & Rank */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              XP Score
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {stats?.score || 0} <span className="text-xs font-bold text-slate-400">pts</span>
            </div>
            <span className="text-xs font-bold text-amber-400">Global Rank #{stats?.rank || '-'}</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        {/* Streak & Exams */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Streak
            </span>
            <div className="text-3xl font-black text-white flex items-center gap-1.5">
              {stats?.streak || 0} <Flame className="h-6 w-6 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <span className="text-xs text-slate-400">{stats?.exams_completed || 0} Exams Completed</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold shadow-lg shadow-purple-500/10">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Accuracy Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" /> Submission Ratio
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            {stats?.total_submissions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={accuracyData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No submissions recorded yet</div>
            )}
          </div>
          <div className="flex justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Accepted ({stats?.accepted_submissions || 0})
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-3 w-3 rounded-full bg-red-500"></span> Rejected ({Math.max(0, (stats?.total_submissions || 0) - (stats?.accepted_submissions || 0))})
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" /> Recent Submissions
            </h3>
            <Link href="/student/submissions" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/60 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Problem</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Runtime</th>
                  <th className="px-4 py-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recent_submissions?.length > 0 ? (
                  stats.recent_submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white">
                        {sub.problem_title}
                      </td>
                      <td className="px-4 py-3.5 uppercase font-mono font-bold text-slate-400">
                        {sub.language}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.status === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {sub.execution_time_ms} ms
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      No submissions recorded yet. Start solving problems to see your history!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
