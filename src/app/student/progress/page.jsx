'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { TrendingUp, Award, Zap, Code2, Target, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function StudentProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const resp = await api.get('/students/me/progress');
      setProgress(resp.data);
    } catch (err) {
      console.error('Failed to load progress', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading progress analysis...</div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Coding Progress & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          In-depth evaluation of topic mastery, difficulty breakdown, and coding streak
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Target className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Solved Problems</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{progress?.problems_solved || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Coding Score</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{progress?.score || 0} pts</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Streak</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{progress?.streak || 0} Days 🔥</span>
          </div>
        </div>
      </div>

      {/* Topic Breakdown Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-500" /> Topic Performance Breakdown
        </h3>
        <div className="h-72 w-full">
          {progress?.topic_breakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress.topic_breakdown}>
                <XAxis dataKey="topic" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="solved" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Solved" />
                <Bar dataKey="attempts" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Attempts" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              Solve problems across different topics to view topic mastery graph
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
