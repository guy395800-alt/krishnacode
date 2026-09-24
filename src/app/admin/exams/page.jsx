'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { GraduationCap, Plus, Calendar, Clock, CheckSquare, X } from 'lucide-react';

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
    selected_problem_ids: []});

  useEffect(() => {
    fetchExams();
    fetchProblems();
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

  const fetchProblems = async () => {
    try {
      const resp = await api.get('/problems');
      setProblems(resp.data);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Coding Exam Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Schedule examinations, assign problem sets, and set server-controlled duration timers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
        >
          <Plus className="h-4 w-4" /> Schedule New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400">Loading exams...</div>
        ) : exams.length > 0 ? (
          exams.map((ex) => (
            <div key={ex.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  {ex.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Duration: {ex.duration_minutes} min</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{ex.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{ex.description}</p>
              <div className="pt-2 text-xs font-mono font-semibold text-slate-500 flex justify-between">
                <span>Total Marks: {ex.total_marks}</span>
                <span>Passing: {ex.passing_marks}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl">
            No exams scheduled yet
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Schedule Coding Exam</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Exam Title</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Data Structures Midterm Exam"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Description</label>
                <input
                  type="text" required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Duration (Min)</label>
                  <input
                    type="number" required value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Total Marks</label>
                  <input
                    type="number" required value={form.total_marks}
                    onChange={(e) => setForm({ ...form, total_marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Passing Marks</label>
                  <input
                    type="number" required value={form.passing_marks}
                    onChange={(e) => setForm({ ...form, passing_marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Select Problems for Exam</label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {problems.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.selected_problem_ids.includes(p.id)}
                        onChange={() => toggleProblemSelect(p.id)}
                        className="h-4 w-4 rounded text-blue-600"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{p.title}</span>
                      <span className="text-slate-400 font-normal font-mono">({p.difficulty})</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                Schedule & Assign Exam
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
