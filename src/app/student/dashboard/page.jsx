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
  Activity,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { PageHeader } from '../../../components/PageHeader';
import { StatCard } from '../../../components/StatCard';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { StatsSkeleton, TableSkeleton } from '../../../components/LoadingSkeleton';

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
      <div className="space-y-8 font-sans">
        <div className="h-36 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
        <StatsSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const accuracyData = [
    { name: 'Accepted', value: stats?.accepted_submissions || 0, color: '#10b981' },
    { name: 'Rejected', value: Math.max(0, (stats?.total_submissions || 0) - (stats?.accepted_submissions || 0)), color: '#ef4444' },
  ];

  const totalSubs = stats?.total_submissions || 0;

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Welcome Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white shadow-xl border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/15">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Student Workspace
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-sans">
            Welcome back, {user?.full_name || 'Coder'}
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Track your coding progress, solve practice problems, and prepare for upcoming academic examinations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            href="/student/problems"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Code2 className="h-4 w-4 text-blue-600" />
            <span>Practice Problems</span>
          </Link>
          <Link
            href="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-blue-950/80 hover:bg-blue-900/80 text-white border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4 text-sky-300" />
            <span>Courses &amp; Labs</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Problems Solved"
          value={stats?.problems_solved || 0}
          subtext={`${stats?.problems_attempted || 0} attempted`}
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          label="Accuracy Rate"
          value={`${stats?.accuracy || 0}%`}
          subtext={`${stats?.accepted_submissions || 0}/${stats?.total_submissions || 0} passed`}
          icon={Target}
          variant="blue"
        />
        <StatCard
          label="XP Score"
          value={stats?.score || 0}
          subtext={stats?.rank ? `Rank #${stats.rank}` : 'Platform Score'}
          icon={Trophy}
          variant="amber"
        />
        <StatCard
          label="Streak"
          value={`${stats?.streak || 0} Days`}
          subtext={`${stats?.exams_completed || 0} exams completed`}
          icon={Flame}
          variant="cyan"
        />
      </div>

      {/* 3. Analytics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Accuracy Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" /> Submission Ratio
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{totalSubs} total</span>
            </div>
            <p className="text-xs text-slate-400">
              Breakdown of your automated compiler evaluations.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {totalSubs > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={accuracyData} innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                No submissions recorded yet
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 text-xs font-medium pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Accepted ({stats?.accepted_submissions || 0})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span>Rejected ({Math.max(0, totalSubs - (stats?.accepted_submissions || 0))})</span>
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" /> Recent Submissions
            </h3>
            <Link
              href="/student/submissions"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats?.recent_submissions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2.5 rounded-l-lg font-semibold">Problem</th>
                    <th className="px-3.5 py-2.5 font-semibold">Language</th>
                    <th className="px-3.5 py-2.5 font-semibold">Status</th>
                    <th className="px-3.5 py-2.5 font-semibold">Runtime</th>
                    <th className="px-3.5 py-2.5 rounded-r-lg font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recent_submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-3.5 py-3 font-semibold text-white">
                        {sub.problem_title}
                      </td>
                      <td className="px-3.5 py-3 uppercase font-mono font-bold text-slate-400">
                        {sub.language}
                      </td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-400">
                        {sub.execution_time_ms} ms
                      </td>
                      <td className="px-3.5 py-3 text-slate-400">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No Submissions Yet"
              description="You haven't submitted code for any problem yet. Head to the practice catalog to start solving algorithmic challenges."
              actionLabel="Browse Problems"
              actionHref="/student/problems"
            />
          )}
        </div>
      </div>
    </div>
  );
}
