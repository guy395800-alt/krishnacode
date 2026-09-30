'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Search, Filter, Code2, ArrowRight, Star, Sparkles, Terminal, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

const FALLBACK_PROBLEMS_LIST = [
  { id: 1, title: 'Find Maximum Element in Array', difficulty: 'Easy', topic: 'Arrays', points: 50 },
  { id: 2, title: 'Two Sum Target Pair Indices', difficulty: 'Easy', topic: 'Arrays', points: 50 },
  { id: 3, title: 'Maximum Subarray (Kadane\'s Algorithm)', difficulty: 'Medium', topic: 'Dynamic Programming', points: 75 },
  { id: 4, title: 'Valid Palindrome String', difficulty: 'Easy', topic: 'Strings', points: 50 },
  { id: 5, title: 'Climbing Stairs Combinations', difficulty: 'Easy', topic: 'Dynamic Programming', points: 50 },
];

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
      if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
        setProblems(resp.data);
      } else {
        setProblems(FALLBACK_PROBLEMS_LIST);
      }
    } catch (err) {
      console.warn('Backend problem fetch error, loading from local catalog', err);
      setProblems(FALLBACK_PROBLEMS_LIST);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDifficulty('');
    setTopic('');
  };

  const hasActiveFilters = search || difficulty || topic;

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Practice Problem Catalog"
        subtitle="Solve algorithmic challenges across core data structures, benchmark against hidden test suites, and earn XP."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Terminal className="h-3.5 w-3.5" /> 6+ Compilers &amp; SQL
          </span>
        }
      />

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
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
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
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
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : problems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Problem</th>
                  <th className="px-5 py-3.5 font-semibold">Difficulty</th>
                  <th className="px-5 py-3.5 font-semibold">Topic</th>
                  <th className="px-5 py-3.5 font-semibold">XP Reward</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-3.5 font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.difficulty} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-medium text-[11px] border border-slate-700/60">
                        {p.topic}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-400">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{p.points || 50} pts</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/student/problems/${p.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Solve</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
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
            description="No algorithmic problems match your current search and filter settings. Reset the filters to view the full practice catalog."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
}
