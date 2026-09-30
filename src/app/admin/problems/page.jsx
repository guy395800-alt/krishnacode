'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Plus, Search, Edit, Trash2, Code2, CheckSquare, X, Terminal } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

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
    points: 50,
    status: 'Active'
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const resp = await api.get('/problems');
      setProblems(resp.data || []);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      const slugValue = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await api.post('/problems', { ...form, slug: slugValue });
      setShowModal(false);
      fetchProblems();
      setForm({
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
        points: 50,
        status: 'Active'
      });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create problem');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this problem from the catalog?')) return;
    try {
      await api.delete(`/problems/${id}`);
      fetchProblems();
    } catch (err) {
      alert('Delete operation failed.');
    }
  };

  const filteredProblems = problems.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Problem Catalog Manager"
        subtitle="Maintain competitive programming challenges, test case constraints, memory limits, and points."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Code2 className="h-3.5 w-3.5" /> Bank: {problems.length} Problems
          </span>
        }
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Problem</span>
          </button>
        }
      />

      {/* Search Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Title</th>
                  <th className="px-5 py-3.5 font-semibold">Difficulty</th>
                  <th className="px-5 py-3.5 font-semibold">Topic</th>
                  <th className="px-5 py-3.5 font-semibold">Points</th>
                  <th className="px-5 py-3.5 font-semibold">Limits</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProblems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div>{prob.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{prob.slug || `prob-${prob.id}`}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={prob.difficulty} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                        {prob.topic}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-400">
                      {prob.points || 50} pts
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">
                      {prob.time_limit || 2}s · {prob.memory_limit || 128}MB
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(prob.id)}
                        className="p-1.5 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg transition-all border border-rose-500/20"
                        title="Delete Problem"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Code2}
            title="No Problems Found"
            description="Create problems to build your institution's competitive programming question bank."
            actionLabel="Create Problem"
            onAction={() => setShowModal(true)}
          />
        )}
      </div>

      {/* Create Problem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" /> Add Algorithmic Problem
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reverse Binary Tree In-Place"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">XP Points</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Problem statement, inputs, outputs, and constraints..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Limit (Seconds)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={form.time_limit}
                    onChange={(e) => setForm({ ...form, time_limit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Memory Limit (MB)</label>
                  <input
                    type="number"
                    min="32"
                    required
                    value={form.memory_limit}
                    onChange={(e) => setForm({ ...form, memory_limit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
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
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
