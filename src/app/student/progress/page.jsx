'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { TrendingUp, Award, Zap, Code2, Target, CheckCircle2, Sparkles, BarChart2 } from 'lucide-react';
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
    return (
      <div className="p-16 text-center text-slate-400 apple-card rounded-3xl">
        <div className="animate-pulse">Loading progress analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <TrendingUp className="h-4 w-4" /> Personal Performance Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Coding Progress & Analytics
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-normal">
            In-depth evaluation of topic mastery, difficulty breakdown, and coding streak momentum.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl apple-card-interactive border border-white/10 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Target className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Solved Problems</span>
            <span className="text-3xl font-black text-white">{progress?.problems_solved || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl apple-card-interactive border border-white/10 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Coding Score</span>
            <span className="text-3xl font-black text-white">{progress?.score || 0} pts</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl apple-card-interactive border border-white/10 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Active Streak</span>
            <span className="text-3xl font-black text-white">{progress?.streak || 0} Days 🔥</span>
          </div>
        </div>
      </div>

      {/* Topic Breakdown Bar Chart */}
      <div className="p-8 rounded-3xl apple-card border border-white/10 shadow-2xl space-y-6">
        <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
          <Code2 className="h-5 w-5 text-blue-400" /> Topic Performance Breakdown
        </h3>
        <div className="h-72 w-full">
          {progress?.topic_breakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress.topic_breakdown}>
                <XAxis dataKey="topic" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="solved" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Solved" />
                <Bar dataKey="attempts" fill="#475569" radius={[8, 8, 0, 0]} name="Attempts" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400 font-medium">
              Solve problems across different topics to generate your mastery graph
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
