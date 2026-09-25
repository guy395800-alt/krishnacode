'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { GraduationCap, Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Award } from 'lucide-react';

export default function StudentExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const resp = await api.get('/exams');
      setExams(resp.data);
    } catch (err) {
      console.error('Failed to load exams', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="h-4 w-4" /> Proctored Academic Evaluations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Coding Examinations & Labs
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-normal">
            Enrolled semester assessments, placement mock tests, and real-time AI-proctored code arenas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400 apple-card rounded-3xl">
            <div className="animate-pulse">Loading assigned examinations...</div>
          </div>
        ) : exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="p-7 rounded-3xl apple-card-interactive border border-white/10 shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold ${
                    exam.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                      : exam.status === 'Scheduled'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
                  }`}>
                    {exam.status === 'Active' ? '🟢 LIVE NOW' : exam.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-xl border border-white/5">
                    {exam.total_marks} Marks
                  </span>
                </div>

                <h3 className="text-xl font-black text-white tracking-tight">
                  {exam.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                  {exam.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>{exam.duration_minutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <span>{new Date(exam.start_time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/student/exams/${exam.id}/workspace`}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    exam.status === 'Active'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.02]'
                      : 'apple-btn-glass text-slate-200'
                  }`}
                >
                  {exam.status === 'Active' ? 'Enter Live Exam Interface' : 'View Exam Overview'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-400 apple-card rounded-3xl border border-white/10">
            No coding examinations currently assigned to your batch.
          </div>
        )}
      </div>
    </div>
  );
}
