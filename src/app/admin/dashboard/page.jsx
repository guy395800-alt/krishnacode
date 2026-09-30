'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, getExportUrl } from '../../../lib/api';
import {
  Users,
  Code2,
  GraduationCap,
  History,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
  Zap,
  Activity,
  Award,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PageHeader } from '../../../components/PageHeader';
import { StatCard } from '../../../components/StatCard';
import { StatsSkeleton } from '../../../components/LoadingSkeleton';
import { EmptyState } from '../../../components/EmptyState';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      const resp = await api.get('/analytics/dashboard');
      setData(resp.data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="h-24 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
        <StatsSkeleton />
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Admin Control Center"
        subtitle="Live platform metrics, student management, proctored examinations, and compiler telemetry."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Institutional Authority
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <a
              href={getExportUrl('students')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export Students CSV</span>
            </a>
            <Link
              href="/admin/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Exam</span>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Students"
          value={m.total_students || 0}
          subtext={`${m.active_students || 0} active accounts`}
          icon={Users}
          variant="blue"
        />
        <StatCard
          label="Problem Bank"
          value={m.total_problems || 0}
          subtext="Catalogued algorithms"
          icon={Code2}
          variant="cyan"
        />
        <StatCard
          label="Submissions"
          value={m.total_submissions || 0}
          subtext={`${m.accepted_submissions || 0} verified passed`}
          icon={History}
          variant="emerald"
        />
        <StatCard
          label="Active Exams"
          value={m.active_exams || 0}
          subtext={`${m.upcoming_exams || 0} scheduled`}
          icon={GraduationCap}
          variant="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Attempted Problems */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" /> Most Attempted Coding Problems
          </h3>
          <div className="h-60 w-full">
            {data?.charts?.top_problems?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.top_problems}>
                  <XAxis dataKey="title" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="attempts" fill="#2563eb" radius={[6, 6, 0, 0]} name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No problem submission data recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Batch Performance Comparison */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" /> Batch Average Performance
          </h3>
          <div className="h-60 w-full">
            {data?.charts?.batch_performance?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.batch_performance}>
                  <XAxis dataKey="batch" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="avg_score" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Score (pts)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No batch evaluation data recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
