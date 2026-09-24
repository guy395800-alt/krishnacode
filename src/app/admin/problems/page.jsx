'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Plus, Search, Edit, Trash2, Code2, CheckSquare, X } from 'lucide-react';

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Easy',
    topic: 'Arrays',
    tags: ['array'],
    input_format: '',
    output_format: '',
    constraints: '',
    time_limit: 2.0,
    memory_limit: 128,
    points: 10,
    status: 'Active'
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const resp = await api.get('/problems');
      setProblems(resp.data);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/problems', form);
      setShowModal(false);
      fetchProblems();
      setForm({
        title: '', slug: '', description: '', difficulty: 'Easy', topic: 'Arrays',
        tags: ['array'], input_format: '', output_format: '', constraints: '',
        time_limit: 2.0, memory_limit: 128, points: 10, status: 'Active'
      });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create problem');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      fetchProblems();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Problem Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create algorithms problems, configure test case limits, points, and status
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
        >
          <Plus className="h-4 w-4" /> Create New Problem
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading problem directory...</div>
        ) : problems.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Title / Slug</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {problems.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    <div>{p.title}</div>
                    <div className="text-xs font-mono font-normal text-slate-400">{p.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{p.topic}</td>
                  <td className="px-6 py-4 font-mono font-bold">{p.points} pts</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No problems configured yet</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create Programming Problem</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Title</label>
                  <input
                    type="text" required value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Slug</label>
                  <input
                    type="text" required value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  required rows={4} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Difficulty</label>
                  <select
                    value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Topic</label>
                  <input
                    type="text" required value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Points</label>
                  <input
                    type="number" required value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Input Format</label>
                <input
                  type="text" required value={form.input_format}
                  onChange={(e) => setForm({ ...form, input_format: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Output Format</label>
                <input
                  type="text" required value={form.output_format}
                  onChange={(e) => setForm({ ...form, output_format: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Constraints</label>
                <input
                  type="text" required value={form.constraints}
                  onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                Save Problem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
