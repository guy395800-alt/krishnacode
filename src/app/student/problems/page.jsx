'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Search, Filter, Code2, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default function StudentProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, topic]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (topic) params.topic = topic;

      const resp = await api.get('/problems', { params });
      setProblems(resp.data);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Medium': return 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Hard': return 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Problem Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Practice data structures, algorithms, and competitive programming problems
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Topics</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Searching">Searching</option>
            <option value="Sorting">Sorting</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading problem set...</div>
        ) : problems.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {problems.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Code2 className="h-5 w-5 text-blue-500 shrink-0" />
                    <span>{p.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(p.difficulty)}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {p.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {p.points}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/student/problems/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all group-hover:scale-105"
                    >
                      Solve Problem <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="font-semibold text-lg">No problems found matching your filters</p>
            <p className="text-xs">Try searching for a different keyword or resetting filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
