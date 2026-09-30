'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import {
  GraduationCap,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  Maximize2
} from 'lucide-react';
import { PageHeader } from '../../../../components/PageHeader';
import { StatusBadge } from '../../../../components/StatusBadge';
import { Skeleton } from '../../../../components/LoadingSkeleton';

export default function ExamInstructionClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id || initialId || '1';

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

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
      <div className="max-w-3xl mx-auto space-y-6 py-6 font-sans">
        <Skeleton className="h-6 w-32" />
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-16 space-y-4 font-sans max-w-md mx-auto">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Examination Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested exam does not exist or you do not have permission to view its instructions.
        </p>
        <Link
          href="/student/exams"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Examinations</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <PageHeader
        title={exam.name}
        subtitle="Review institutional examination rules, duration, and proctoring constraints before launching."
        backHref="/student/exams"
        badge={<StatusBadge status={exam.status} size="md" />}
      />

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-2xl space-y-6">
        {exam.description && (
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {exam.description}
          </p>
        )}

        {/* Exam Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block font-medium">Duration</span>
            <span className="font-bold text-white text-sm font-mono">{exam.duration_minutes} Mins</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Total Marks</span>
            <span className="font-bold text-blue-400 text-sm font-mono">{exam.total_marks || 100} pts</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Passing Threshold</span>
            <span className="font-bold text-emerald-400 text-sm font-mono">{exam.passing_marks || 40} pts</span>
          </div>
        </div>

        {/* Special Instructions if present */}
        {exam.instructions && (
          <div className="space-y-1.5 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Faculty Instructions:
            </span>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed">
              {exam.instructions}
            </div>
          </div>
        )}

        {/* Anti-Cheating & Proctoring Protocol */}
        <div className="space-y-3 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
          <h4 className="font-bold text-blue-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Proctoring &amp; Anti-Cheating Protocol
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-300 leading-relaxed">
            <li>Clipboard copy-paste operations are locked inside the coding arena.</li>
            <li>Browser tab-switching and window defocusing are automatically tracked in the audit log.</li>
            <li>The test will automatically finalize and submit once the countdown timer reaches zero.</li>
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-300 leading-normal">
              I acknowledge the examination rules and agree to adhere to academic integrity standards during this test session.
            </span>
          </label>
        </div>

        {/* Launch Button */}
        <div>
          <Link
            href={`/student/exams/${exam.id}/workspace`}
            className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              agreed
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:scale-[1.01]'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>Launch Exam Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
