'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Cpu,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Compass,
  Sparkles,
  BarChart3,
  Layers,
  Terminal,
  Clock,
  Award,
  ChevronRight,
  Check,
  Star,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [codeTab, setCodeTab] = useState('code');

  const problemCategories = ['All', 'Easy', 'Medium', 'Hard', 'Arrays', 'Strings', 'Trees'];

  const sampleProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Array', 'Hash Table'],
      solvedCount: 1240,
      xp: 20,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings',
      tags: ['String', 'Sliding Window'],
      solvedCount: 890,
      xp: 35,
      description: 'Find the length of the longest substring without repeating characters in a given string.'
    },
    {
      id: 3,
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      category: 'Trees',
      tags: ['Tree', 'BFS'],
      solvedCount: 650,
      xp: 40,
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values.'
    },
    {
      id: 4,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Strings',
      tags: ['Stack', 'String'],
      solvedCount: 1510,
      xp: 15,
      description: 'Determine if the input string containing brackets is valid according to open and closing matching order.'
    },
    {
      id: 5,
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      category: 'Arrays',
      tags: ['Heap', 'Linked List'],
      solvedCount: 320,
      xp: 60,
      description: 'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all into one.'
    },
    {
      id: 6,
      title: 'Maximum Subarray (Kadanes Algorithm)',
      difficulty: 'Medium',
      category: 'Arrays',
      tags: ['Array', 'Dynamic Programming'],
      solvedCount: 980,
      xp: 30,
      description: 'Find the contiguous subarray with the largest sum and return its total sum.'
    }
  ];

  const filteredProblems = sampleProblems.filter(problem => {
    if (activeCategory === 'All') return true;
    if (['Easy', 'Medium', 'Hard'].includes(activeCategory)) return problem.difficulty === activeCategory;
    return problem.category === activeCategory;
  });

  return (
    <div className="flex flex-col space-y-24 py-6 max-w-7xl mx-auto">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Student-First Coding Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Practice. Build. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">
                Get Future Ready.
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              NexGenCode is designed specifically for students and aspiring developers to master programming concepts, solve curated algorithm challenges, track coding growth, and prepare for top tech interviews.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Go to {user.role === 'admin' ? 'Admin' : 'Student'} Workspace <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login?role=student"
                    className="flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                  >
                    <GraduationCap className="h-5 w-5" /> Start Practice Free <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login?role=admin"
                    className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
                  >
                    <ShieldCheck className="h-5 w-5 text-amber-500" /> Admin Access
                  </Link>
                </>
              )}
            </div>

            {/* Quick Micro Badges */}
            <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 500+ Curated Problems
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Language Compiler
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Test Execution
              </span>
            </div>
          </div>

          {/* Hero Right Code Snippet Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400 font-semibold text-xs">two_sum.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCodeTab('code')}
                    className={`px-2.5 py-1 rounded text-[11px] font-sans font-semibold transition-colors ${
                      codeTab === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setCodeTab('output')}
                    className={`px-2.5 py-1 rounded text-[11px] font-sans font-semibold transition-colors ${
                      codeTab === 'output' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Result (Passed)
                  </button>
                </div>
              </div>

              {/* Code Body / Output Body */}
              {codeTab === 'code' ? (
                <div className="p-5 text-slate-300 space-y-1.5 leading-relaxed overflow-x-auto">
                  <div className="text-slate-500"># NexGenCode Python Execution Engine</div>
                  <div>
                    <span className="text-purple-400">def</span> <span className="text-blue-400 font-bold">two_sum</span>(nums: <span className="text-amber-300">list</span>[<span className="text-amber-300">int</span>], target: <span className="text-amber-300">int</span>) -&gt; <span className="text-amber-300">list</span>[<span className="text-amber-300">int</span>]:
                  </div>
                  <div className="pl-4">
                    seen = &#123;&#125;
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-400">enumerate</span>(nums):
                  </div>
                  <div className="pl-8">
                    complement = target - num
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen:
                  </div>
                  <div className="pl-12 text-emerald-400 font-semibold">
                    <span className="text-purple-400">return</span> [seen[complement], i]
                  </div>
                  <div className="pl-8">
                    seen[num] = i
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">return</span> []
                  </div>
                  <div className="pt-2 text-slate-500"># Execution snippet passed target 9</div>
                </div>
              ) : (
                <div className="p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> ALL 5 TEST CASES PASSED
                    </span>
                    <span className="text-slate-400 text-[11px]">Runtime: 18ms</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div><span className="text-slate-500">Test Case 1:</span> nums=[2,7,11,15], target=9 -&gt; <span className="text-emerald-400">[0, 1]</span></div>
                    <div><span className="text-slate-500">Test Case 2:</span> nums=[3,2,4], target=6 -&gt; <span className="text-emerald-400">[1, 2]</span></div>
                    <div><span className="text-slate-500">Test Case 3:</span> nums=[3,3], target=6 -&gt; <span className="text-emerald-400">[0, 1]</span></div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-amber-400 font-bold">+25 XP Earned</span>
                    <span className="text-sky-400 font-bold">Streak: 7 Days 🔥</span>
                  </div>
                </div>
              )}

              {/* Code Card Footer */}
              <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Terminal className="h-3.5 w-3.5 text-blue-400" /> Python 3.11 Compiler
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Sandboxed Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust & Social Proof Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="space-y-1 p-2">
          <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">500+</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Practice Problems
          </div>
        </div>
        <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">20+</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Structured Roadmaps
          </div>
        </div>
        <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">10+</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            CS Core Topics
          </div>
        </div>
        <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-3xl sm:text-4xl font-black text-amber-500">100%</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Student Focused
          </div>
        </div>
      </section>

      {/* 3. Why NexGenCode? (4 Feature Cards) */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed for Student Developers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to grow from typing your first line of code to cracking technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 font-bold">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Structured Practice</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Hand-curated coding problems across difficulty levels with comprehensive test cases and automated grading.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 font-bold">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Guided Roadmaps</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Step-by-step learning paths taking students from programming basics to advanced algorithm design.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 font-bold">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Real-time Compiler</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-language support for Python, Java, C, C++, JavaScript, and SQL running in secure sandboxes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 font-bold">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Track & Compete</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Live campus leaderboards, daily streak tracking, accuracy stats, and timed examination mode.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Coding Practice Section Preview */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Code2 className="h-4 w-4" /> Practice Catalog Preview
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Popular Problem Challenges
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {problemCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map(problem => (
            <div
              key={problem.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> +{problem.xp} XP
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {problem.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {problem.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {problem.solvedCount.toLocaleString()} Solved
                </span>
                <Link
                  href="/student/problems"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Solve Challenge <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/student/problems"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Explore All 500+ Practice Problems <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. Learning Roadmaps Section (01-04) */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Compass className="h-4 w-4" /> Structured Curriculums
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Structured Learning Roadmaps
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Follow a proven path designed to build strong problem-solving skills step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roadmap 01 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white text-xs font-extrabold rounded-bl-xl font-mono">
              01
            </div>
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Programming Fundamentals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Master core language syntax, control structures, variables, loops, basic recursion, and function design.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Variables, Data Types & Operators
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Conditional Statements & Loop Logic
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Modular Functions & Scope
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 02 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-2 bg-indigo-600 text-white text-xs font-extrabold rounded-bl-xl font-mono">
              02
            </div>
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Data Structures Mastery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Understand physical and logical memory representations to build efficient applications.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Arrays, Linked Lists, Stacks & Queues
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Binary Trees, Heaps & BSTs
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Hash Maps & Set Implementations
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 03 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-2 bg-emerald-600 text-white text-xs font-extrabold rounded-bl-xl font-mono">
              03
            </div>
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Algorithms & Problem Solving
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn classic algorithmic techniques to analyze time and space complexity effectively.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Sorting, Searching & Binary Search
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Dynamic Programming & Backtracking
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Graph Traversals (BFS & DFS)
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 04 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-2 bg-amber-600 text-white text-xs font-extrabold rounded-bl-xl font-mono">
              04
            </div>
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Coding Interview Prep
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ace technical interview rounds with curated top questions, mock timed exams, and speed drills.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Top 100 Most Asked Interview Patterns
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Mock Timed Coding Examinations
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Company Tagged Problem Sets
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Daily Coding Challenge Spotlight */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" /> Daily Practice Challenge
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono">
                <Clock className="h-3.5 w-3.5 inline mr-1" /> Resets in 08h 24m
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Problem of the Day: <span className="text-sky-300">Find the Missing Number</span>
            </h3>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Given an array <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">nums</code> containing <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">n</code> distinct numbers in the range <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">[0, n]</code>, return the only number in the range that is missing from the array.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block">Difficulty</span>
                <span className="text-amber-400 font-bold">Medium</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reward</span>
                <span className="text-emerald-400 font-bold">+50 XP & Streak Bonus</span>
              </div>
              <div>
                <span className="text-slate-400 block">Submissions Today</span>
                <span className="text-white font-bold">428 Students</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-center w-full max-w-xs space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Active Streak</div>
              <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-amber-500 fill-amber-500 animate-pulse" /> 7 Days
              </div>
              <div className="text-[11px] text-slate-400">Solve today to keep your streak alive!</div>
            </div>

            <Link
              href="/student/problems"
              className="w-full max-w-xs py-3.5 px-6 rounded-xl font-bold text-center bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all"
            >
              Solve Today's Challenge Now
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Student Dashboard Preview Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <BarChart3 className="h-4 w-4" /> Live Student Workspace
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Track Progress & Coding Performance
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Intuitive analytics keep you motivated with problem resolution counters, accuracy percentages, and XP levels.
          </p>
        </div>

        {/* Dashboard Mockup Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-6">
          {/* Header Stats Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Problems Solved</span>
              <div className="text-2xl font-black text-white">128 / 500</div>
              <div className="text-[11px] text-emerald-400 font-medium">+14 this week</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Coding Streak</span>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
                <Flame className="h-5 w-5 fill-amber-400" /> 12 Days
              </div>
              <div className="text-[11px] text-amber-300 font-medium">Personal Best!</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Accuracy Rate</span>
              <div className="text-2xl font-black text-sky-400">82.4%</div>
              <div className="text-[11px] text-sky-300 font-medium">High submission precision</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total XP Points</span>
              <div className="text-2xl font-black text-indigo-400">2,450 XP</div>
              <div className="text-[11px] text-indigo-300 font-medium">Level 6 Developer</div>
            </div>
          </div>

          {/* Activity Bar Chart Mockup & Continue Learning Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Weekly Activity Bar Chart */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Weekly Coding Activity</span>
                <span className="text-slate-500 font-mono">Mon - Sun</span>
              </div>
              <div className="flex items-end justify-between h-32 pt-4 px-2">
                {[
                  { day: 'Mon', count: 4, height: 'h-16' },
                  { day: 'Tue', count: 7, height: 'h-24' },
                  { day: 'Wed', count: 3, height: 'h-12' },
                  { day: 'Thu', count: 9, height: 'h-28' },
                  { day: 'Fri', count: 6, height: 'h-20' },
                  { day: 'Sat', count: 12, height: 'h-32' },
                  { day: 'Sun', count: 8, height: 'h-24' }
                ].map(item => (
                  <div key={item.day} className="flex flex-col items-center gap-2">
                    <div className={`w-8 rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 ${item.height} transition-all`} />
                    <span className="text-[11px] text-slate-400 font-mono">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Learning Progress Card */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">In Progress Roadmap</span>
                <h4 className="text-base font-bold text-white">Data Structures & Algorithms</h4>
                <p className="text-xs text-slate-400">13 of 20 Modules Completed (65%)</p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[65%]" />
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/student/dashboard"
                  className="w-full block py-2.5 rounded-xl text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Resume Learning Path
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Supported Languages Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Terminal className="h-4 w-4" /> Multi-Language Sandboxing
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Supported Programming Languages
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Write, test, and execute code in your preferred programming language with low-latency compiler execution.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Python', version: 'Python 3.11', icon: '🐍', color: 'text-amber-500' },
            { name: 'Java', version: 'Java 17 OpenJDK', icon: '☕', color: 'text-orange-500' },
            { name: 'C', version: 'GCC 11 (C17)', icon: '⚡', color: 'text-blue-500' },
            { name: 'C++', version: 'GCC 11 (C++17)', icon: '🚀', color: 'text-sky-500' },
            { name: 'JavaScript', version: 'Node.js 18', icon: '💛', color: 'text-yellow-400' },
            { name: 'SQL', version: 'PostgreSQL / SQLite', icon: '🗄️', color: 'text-purple-400' }
          ].map(lang => (
            <div
              key={lang.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2 hover:border-blue-500/50 transition-colors"
            >
              <div className="text-3xl">{lang.icon}</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{lang.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{lang.version}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Challenges & Competitions Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
              <Trophy className="h-4 w-4" /> Live Competitions
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Campus Coding Challenges
            </h2>
          </div>
          <Link
            href="/student/exams"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            View All Scheduled Competitions <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                Upcoming
              </span>
              <span className="text-xs text-slate-400 font-mono">Sat, 6:00 PM</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Weekly Campus Coding Contest #14
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              4 algorithmic challenges in 120 minutes. Top 10 participants earn profile badges and placement credits.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">150+ Registered</span>
              <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Register Free
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Active Now
              </span>
              <span className="text-xs text-slate-400 font-mono">3 Days Remaining</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Beginner Algorithmic Sprint
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Perfect for 1st & 2nd year students testing foundational array and string logic under low pressure.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">320 Participants</span>
              <Link href="/student/problems" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Enter Challenge
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold border border-slate-500/20">
                Completed
              </span>
              <span className="text-xs text-slate-400 font-mono">Last Weekend</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Structures Speed Run
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              High speed challenge focused on trees, graphs, and dynamic programming optimization.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Winner: Rahul Sharma</span>
              <Link href="/student/leaderboard" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                View Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/80 via-indigo-950/90 to-slate-950 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/30 backdrop-blur-xl">
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Sparkles className="h-4 w-4 text-blue-400" /> Start Practicing Today
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Master Problem Solving?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Join students and aspiring software developers building consistency, mastering data structures, and excelling in technical interviews.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all text-center shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all text-center"
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
