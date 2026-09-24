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
  Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

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
    return <div className="p-12 text-center text-slate-400">Loading admin control center...</div>;
  }

  const m = data?.metrics || {};
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Admin Control Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time platform analytics, student management, and examination controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getExportUrl('students')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Students CSV
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Students</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{m.total_students || 0}</div>
            <span className="text-xs font-bold text-emerald-500">{m.active_students || 0} Active Accounts</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Problems</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{m.total_problems || 0}</div>
            <span className="text-xs text-slate-500">Competitive Problems</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Code2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Submissions</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{m.total_submissions || 0}</div>
            <span className="text-xs text-emerald-500 font-bold">{m.accepted_submissions || 0} Accepted</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <History className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Exams</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{m.active_exams || 0}</div>
            <span className="text-xs font-bold text-amber-500">{m.upcoming_exams || 0} Scheduled</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Attempted Problems */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Most Attempted Coding Problems
          </h3>
          <div className="h-64 w-full">
            {data?.charts?.top_problems?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.top_problems}>
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="attempts" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No submission activity</div>
            )}
          </div>
        </div>

        {/* Batch Performance Comparison */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-500" /> Batch Average Score
          </h3>
          <div className="h-64 w-full">
            {data?.charts?.batch_performance?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.batch_performance}>
                  <XAxis dataKey="batch" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="avg_score" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No batch data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
