'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { GraduationCap, Plus, Calendar, Clock, CheckSquare, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    instructions: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 40,
    target_batch: '2023-2027',
    target_section: 'A',
    selected_problem_ids: []
  });

  useEffect(() => {
    fetchExams();
    fetchProblems();
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

  const fetchProblems = async () => {
    try {
      const resp = await api.get('/problems');
      setProblems(resp.data || []);
    } catch (err) {
      console.error('Failed to load problems', err);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const start_time = now.toISOString();
      const end_time = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const examProblems = form.selected_problem_ids.map((pid, idx) => ({
        problem_id: pid,
        marks: Math.floor(form.total_marks / Math.max(1, form.selected_problem_ids.length)),
        order: idx + 1
      }));

      await api.post('/exams', {
        name: form.name,
        description: form.description,
        instructions: form.instructions,
        start_time,
        end_time,
        duration_minutes: Number(form.duration_minutes),
        total_marks: Number(form.total_marks),
        passing_marks: Number(form.passing_marks),
        target_batch: form.target_batch,
        target_section: form.target_section,
        problems: examProblems
      });

      setShowModal(false);
      setForm({
        name: '',
        description: '',
        instructions: '',
        duration_minutes: 60,
        total_marks: 100,
        passing_marks: 40,
        target_batch: '2023-2027',
        target_section: 'A',
        selected_problem_ids: []
      });
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create exam');
    }
  };

  const toggleProblemSelect = (pid) => {
    setForm((prev) => {
      const exists = prev.selected_problem_ids.includes(pid);
      return {
        ...prev,
        selected_problem_ids: exists
          ? prev.selected_problem_ids.filter((id) => id !== pid)
          : [...prev.selected_problem_ids, pid]
      };
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Examination Manager"
        subtitle="Schedule proctored programming tests, link problem sets, and enforce anti-cheat guidelines."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" /> Total: {exams.length} Exams
          </span>
        }
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Exam</span>
          </button>
        }
      />

      {/* Table of Exams */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Exam Title</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Target Cohort</th>
                  <th className="px-5 py-3.5 font-semibold">Duration</th>
                  <th className="px-5 py-3.5 font-semibold">Total Marks</th>
                  <th className="px-5 py-3.5 font-semibold">Passing</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {exam.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={exam.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300">
                      {exam.target_batch || 'All'} - Sec {exam.target_section || 'All'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300">
                      {exam.duration_minutes} mins
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {exam.total_marks} pts
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400">
                      {exam.passing_marks} pts
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {new Date(exam.start_time).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={GraduationCap}
            title="No Examinations Scheduled"
            description="Create an exam to assign problem sets and evaluate students with real-time proctoring."
            actionLabel="Schedule First Exam"
            onAction={() => setShowModal(true)}
          />
        )}
      </div>

      {/* Create Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-400" /> Schedule Examination
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS201 Midterm Examination"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of examination scope and topics..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={15}
                    required
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={form.total_marks}
                    onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={form.passing_marks}
                    onChange={(e) => setForm({ ...form, passing_marks: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Problem Selection Bank */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-slate-300 font-semibold">
                  Link Problems to Exam ({form.selected_problem_ids.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto divide-y divide-slate-800 rounded-xl bg-slate-950 border border-slate-800 p-2">
                  {problems.map((prob) => {
                    const isSelected = form.selected_problem_ids.includes(prob.id);
                    return (
                      <div
                        key={prob.id}
                        onClick={() => toggleProblemSelect(prob.id)}
                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <span className="font-medium text-xs">{prob.title}</span>
                        <StatusBadge status={prob.difficulty} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
