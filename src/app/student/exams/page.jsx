'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { GraduationCap, Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Coding Examinations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enrolled coding examinations, active tests, and completed evaluations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400">Loading exams...</div>
        ) : exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    exam.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 animate-pulse'
                      : exam.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {exam.status}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Total Marks: {exam.total_marks}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {exam.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {exam.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Duration: {exam.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>Start: {new Date(exam.start_time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/student/exams/${exam.id}/workspace`}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    exam.status === 'Active'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {exam.status === 'Active' ? 'Enter Exam Interface' : 'View Instructions'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No coding exams currently assigned to your batch.
          </div>
        )}
      </div>
    </div>
  );
}
