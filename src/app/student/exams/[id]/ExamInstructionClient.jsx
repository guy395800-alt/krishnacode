'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { GraduationCap, Clock, Calendar, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ExamInstructionClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id || initialId || '1';

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    try {
      const resp = await api.get(`/exams/${examId}`);
      setExam(resp.data);
    } catch (err) {
      console.error('Failed to load exam', err);
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

  if (!exam) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Exam Not Found</h2>
        <Link href="/student/exams" className="text-blue-500 hover:underline">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/student/exams" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Examinations List
      </Link>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {exam.status}
            </span>
            <h1 className="text-2xl font-black text-white">{exam.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Marks</span>
            <div className="text-2xl font-black text-blue-400">{exam.total_marks} pts</div>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">{exam.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Duration</span>
            <span className="font-bold text-white">{exam.duration_minutes} Minutes</span>
          </div>
          <div>
            <span className="text-slate-500 block">Passing Marks</span>
            <span className="font-bold text-emerald-400">{exam.passing_marks} pts</span>
          </div>
          <div>
            <span className="text-slate-500 block">Questions</span>
            <span className="font-bold text-sky-400">{exam.problems?.length || 0} Problems</span>
          </div>
        </div>

        {exam.instructions && (
          <div className="space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">Special Instructions:</span>
            <p className="p-4 rounded-xl bg-slate-950 text-slate-300 whitespace-pre-line">{exam.instructions}</p>
          </div>
        )}

        <div className="space-y-2 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300">
          <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Anti-Cheating & Examination Rules
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Clipboard copy-paste functionality is restricted in the coding editor.</li>
            <li>Tab switching or exiting fullscreen will be logged and flagged.</li>
            <li>The test will automatically submit when the countdown timer expires.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href={`/student/exams/${exam.id}/workspace`}
            className="w-full py-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            Enter Exam Workspace Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
