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
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
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
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const accuracyData = [
    { name: 'Accepted', value: stats?.accepted_submissions || 0, color: '#10b981' },
    { name: 'Rejected', value: Math.max(0, (stats?.total_submissions || 0) - (stats?.accepted_submissions || 0)), color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Zap className="h-4 w-4 text-amber-300" /> Active Student
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome, {user?.full_name}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Track your coding progress, solve algorithm problems, and prepare for upcoming exams.
          </p>
        </div>

        <Link
          href="/student/problems"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all hover:scale-105"
        >
          <Code2 className="h-5 w-5" /> Start Solving Problems
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Problems Solved
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.problems_solved || 0}
            </div>
            <span className="text-xs text-slate-500">Out of {stats?.problems_attempted || 0} attempted</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Problem Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.accuracy || 0}%
            </div>
            <span className="text-xs text-slate-500">{stats?.accepted_submissions}/{stats?.total_submissions} Submissions</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Target className="h-6 w-6" />
          </div>
        </div>

        {/* Coding Score & Rank */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Coding Score
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.score || 0} <span className="text-xs font-semibold text-slate-500">pts</span>
            </div>
            <span className="text-xs font-bold text-amber-500">Global Rank #{stats?.rank || '-'}</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        {/* Streak & Exams */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Coding Streak
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-1">
              {stats?.streak || 0} <span className="text-xs font-semibold text-amber-500">🔥 Days</span>
            </div>
            <span className="text-xs text-slate-500">{stats?.exams_completed || 0} Exams Completed</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Accuracy Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" /> Submission Ratio
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-400">No submissions recorded yet</div>
            )}
          </div>
          <div className="flex justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Accepted ({stats?.accepted_submissions || 0})
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span> Rejected ({Math.max(0, (stats?.total_submissions || 0) - (stats?.accepted_submissions || 0))})
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> Recent Submissions
            </h3>
            <Link href="/student/submissions" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Problem</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats?.recent_submissions?.length > 0 ? (
                  stats.recent_submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {sub.problem_title}
                      </td>
                      <td className="px-4 py-3 uppercase text-xs font-mono font-bold text-slate-500">
                        {sub.language}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'Accepted'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">
                        {sub.execution_time_ms} ms
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                      No coding submissions yet. Solve your first problem!
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
