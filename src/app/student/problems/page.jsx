'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Search, Filter, Code2, ArrowRight, Star, Sparkles } from 'lucide-react';

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
      case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
            <Code2 className="h-8 w-8 text-blue-400" /> Practice Catalog
          </h1>
          <p className="text-sm text-slate-400">
            Solve algorithmic problems, benchmark test cases, and level up your skills
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl backdrop-blur-xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="">All Topics</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Searching">Searching</option>
            <option value="Sorting">Sorting</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Trees">Trees</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">Loading problem set...</div>
        ) : problems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/60 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 rounded-l-2xl">Title</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">XP Points</th>
                  <th className="px-6 py-4 text-right rounded-r-2xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold">{p.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 font-semibold border border-slate-700/50">
                        {p.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {p.points} XP
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/student/problems/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        Solve Problem <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="font-semibold text-base text-white">No problems found matching your filters</p>
            <p className="text-xs">Try searching for a different keyword or resetting filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
