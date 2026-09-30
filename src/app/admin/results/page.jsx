'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { FileCheck2, FileSpreadsheet, Trophy, GraduationCap, Percent } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchResults(selectedExamId);
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      const resp = await api.get('/exams');
      setExams(resp.data || []);
      if (resp.data?.length > 0) {
        setSelectedExamId(String(resp.data[0].id));
      }
    } catch (err) {
      console.error('Failed to load exams', err);
    }
  };

  const fetchResults = async (examId) => {
    setLoading(true);
    try {
      const resp = await api.get(`/exams/${examId}/results`);
      setResultsData(resp.data);
    } catch (err) {
      console.error('Failed to load exam results', err);
      setResultsData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Exam Results &amp; Grading Ledger"
        subtitle="Automated grading reports, percentage distributions, cohort pass rates, and individual student scores."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <FileCheck2 className="h-3.5 w-3.5" /> Automated Evaluator
          </span>
        }
      />

      {/* Exam Selector */}
      {exams.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase text-slate-400 font-mono">Select Examination:</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="flex-1 max-w-md px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : resultsData?.results?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Student Name</th>
                  <th className="px-5 py-3.5 font-semibold">Reg Number</th>
                  <th className="px-5 py-3.5 font-semibold">Batch / Cohort</th>
                  <th className="px-5 py-3.5 font-semibold">Score</th>
                  <th className="px-5 py-3.5 font-semibold">Percentage</th>
                  <th className="px-5 py-3.5 font-semibold">Result</th>
                  <th className="px-5 py-3.5 font-semibold">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {resultsData.results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {res.student_name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {res.registration_number}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {res.batch} ({res.section})
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {res.total_score} / {resultsData.total_marks || 100}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-400">
                      {res.percentage}%
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={res.status || (res.percentage >= 40 ? 'Passed' : 'Failed')} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">
                      {new Date(res.submitted_at || res.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FileCheck2}
            title="No Results Recorded"
            description="No student submissions have been logged for this examination yet. Check back once students complete their tests."
          />
        )}
      </div>
    </div>
  );
}
