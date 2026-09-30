'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { GraduationCap, Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { CardSkeleton } from '../../../components/LoadingSkeleton';

export default function StudentExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const resp = await api.get('/exams');
      setExams(resp.data || []);
    } catch (err) {
      console.error('Failed to load exams', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter((e) => {
    if (filter === 'All') return true;
    return e.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Coding Examinations"
        subtitle="Institutional proctored tests, lab practicals, and automated compiler grading arenas."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Proctored Ecosystem
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {['All', 'Active', 'Scheduled', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-400/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            {tab}
            {tab === 'All' && exams.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {exams.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={exam.status} size="md" />
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700/60">
                    {exam.total_marks || 100} Marks
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-sans">
                    {exam.name}
                  </h3>
                  {exam.description && (
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {exam.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>{exam.duration_minutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <Calendar className="h-4 w-4 text-sky-400" />
                    <span>{new Date(exam.start_time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href={`/student/exams/${exam.id}/workspace`}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    exam.status === 'Active'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:scale-[1.01]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>{exam.status === 'Active' ? 'Enter Live Exam Interface' : 'View Exam Overview'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No Examinations Found"
          description="There are currently no proctored coding examinations assigned to your batch under this filter. Check back when your faculty schedules a test."
          actionLabel="Practice Problems Instead"
          actionHref="/student/problems"
        />
      )}
    </div>
  );
}
