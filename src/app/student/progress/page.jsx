'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { TrendingUp, Award, Zap, Code2, Target, CheckCircle2, Sparkles, BarChart2, Flame } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../../../components/PageHeader';
import { StatCard } from '../../../components/StatCard';
import { EmptyState } from '../../../components/EmptyState';
import { StatsSkeleton } from '../../../components/LoadingSkeleton';

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
      <div className="space-y-8 font-sans">
        <div className="h-28 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
        <StatsSkeleton />
      </div>
    );
  }

  const difficultyData = [
    { name: 'Easy', count: progress?.difficulty_breakdown?.Easy || 0, fill: '#10b981' },
    { name: 'Medium', count: progress?.difficulty_breakdown?.Medium || 0, fill: '#f59e0b' },
    { name: 'Hard', count: progress?.difficulty_breakdown?.Hard || 0, fill: '#ef4444' },
  ];

  const hasData = progress?.problems_solved > 0;

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Coding Progress &amp; Mastery"
        subtitle="In-depth analytics on solved algorithms, topic proficiencies, and learning consistency."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" /> Performance Matrix
          </span>
        }
      />

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          label="Solved Problems"
          value={progress?.problems_solved || 0}
          subtext="Verified problem submissions"
          icon={Target}
          variant="blue"
        />
        <StatCard
          label="XP Points Score"
          value={`${progress?.score || 0} pts`}
          subtext="Platform skill score"
          icon={Zap}
          variant="amber"
        />
        <StatCard
          label="Active Streak"
          value={`${progress?.streak || 0} Days`}
          subtext="Consecutive coding momentum"
          icon={Flame}
          variant="emerald"
        />
      </div>

      {/* Analytics Charts */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Breakdown Bar Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-400" /> Solved by Difficulty Level
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-sky-400" /> Topic Breakdown
            </h3>
            {progress?.topic_breakdown && Object.keys(progress.topic_breakdown).length > 0 ? (
              <div className="space-y-3 pt-2">
                {Object.entries(progress.topic_breakdown).map(([topicName, count]) => (
                  <div key={topicName} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{topicName}</span>
                      <span className="font-mono text-slate-400">{count} solved</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (count / (progress.problems_solved || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                Solve problems across different categories to see topic distribution.
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={TrendingUp}
          title="No Progress Recorded Yet"
          description="Start solving practice problems to generate your difficulty distribution and topic mastery statistics."
          actionLabel="Go to Practice Catalog"
          actionHref="/student/problems"
        />
      )}
    </div>
  );
}
