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
  Lock,
  Play,
  CopyCheck,
  ShieldAlert
} from 'lucide-react';

const CODE_SNIPPETS = {
  python: `# Python 3.11 Solution
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution: two_sum([2, 7, 11, 15], 9) -> [0, 1]`,

  cpp: `// C++17 High Performance Solution
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (seen.count(diff)) return {seen[diff], i};
        seen[nums[i]] = i;
    }
    return {};
}`,

  java: `// Java 17 OpenJDK Solution
import java.util.HashMap;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) return new int[]{map.get(diff), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,

  javascript: `// Node.js 18 Solution
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) return [seen.get(diff), i];
        seen.set(nums[i], i);
    }
    return [];
}`
};

export default function LandingPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isTestRun, setIsTestRun] = useState(false);

  const problemCategories = ['All', 'Easy', 'Medium', 'Hard', 'Arrays', 'Strings', 'Trees', 'DP'];

  const sampleProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Array', 'Hash Table'],
      solvedCount: 3420,
      xp: 25,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings',
      tags: ['String', 'Sliding Window'],
      solvedCount: 2150,
      xp: 40,
      description: 'Find the length of the longest substring without repeating characters in a given string with O(N) complexity.'
    },
    {
      id: 3,
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      category: 'Trees',
      tags: ['Tree', 'BFS', 'Queue'],
      solvedCount: 1680,
      xp: 45,
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values from left to right.'
    },
    {
      id: 4,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Strings',
      tags: ['Stack', 'String'],
      solvedCount: 4120,
      xp: 20,
      description: 'Determine if the input string containing brackets is valid according to open and closing matching order.'
    },
    {
      id: 5,
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      category: 'Arrays',
      tags: ['Heap', 'Linked List', 'Divide & Conquer'],
      solvedCount: 890,
      xp: 75,
      description: 'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all into one sorted list.'
    },
    {
      id: 6,
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      difficulty: 'Medium',
      category: 'Arrays',
      tags: ['Array', 'Dynamic Programming'],
      solvedCount: 2890,
      xp: 35,
      description: 'Find the contiguous subarray with the largest sum and return its total sum in optimal O(N) runtime.'
    }
  ];

  const filteredProblems = sampleProblems.filter(problem => {
    if (activeCategory === 'All') return true;
    if (['Easy', 'Medium', 'Hard'].includes(activeCategory)) return problem.difficulty === activeCategory;
    return problem.category === activeCategory;
  });

  return (
    <div className="flex flex-col space-y-28 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* =========================================================================
          1. HERO SECTION: Interactive Live Code Playground & Modern Value Proposition
         ========================================================================= */}
      <section className="relative pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Animated Announcement Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wide uppercase backdrop-blur-md shadow-lg shadow-blue-500/10">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Next-Gen Coding & Anti-Cheat Exam Platform</span>
            </div>

            {/* 3D Gradient Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Code. Practice. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                Ace Technical Exams.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              KrishnaCode provides a high-performance sandbox compiler, proctored examinations with AI anti-cheat protection, smart syntax error diagnostics, and campus leaderboards.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
                >
                  <span>Go to {user.role === 'admin' ? 'Admin' : 'Student'} Workspace</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login?role=student"
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span>Start Practice Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/login?role=admin"
                    className="flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all backdrop-blur-md shadow-md"
                  >
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                    <span>Admin Portal</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 500+ Curated Problems
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 5 Multi-Language Sandboxes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Anti-Cheat Proctoring HUD
              </span>
            </div>
          </div>

          {/* Hero Right: Interactive Live Code Playground Simulation */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs backdrop-blur-xl">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400 font-semibold text-xs font-sans">
                    TwoSum.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : 'js'}
                  </span>
                </div>

                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {['python', 'cpp', 'java', 'javascript'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsTestRun(false);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold transition-all ${
                        selectedLanguage === lang
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'javascript' ? 'JS' : lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Body */}
              <div className="p-5 text-slate-300 leading-relaxed overflow-x-auto min-h-[260px] bg-slate-950/70">
                {!isTestRun ? (
                  <pre className="text-xs whitespace-pre font-mono">
                    <code>{CODE_SNIPPETS[selectedLanguage]}</code>
                  </pre>
                ) : (
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> ALL 5 TEST CASES PASSED
                      </span>
                      <span className="text-slate-400 text-[11px]">Runtime: 14ms</span>
                    </div>
                    <div className="space-y-1.5 text-slate-300 text-xs">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] font-sans">Case #1 Input: nums=[2,7,11,15], target=9</span>
                        <span className="text-emerald-400 font-bold">Output: [0, 1] (Match)</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] font-sans">Case #2 Input: nums=[3,2,4], target=6</span>
                        <span className="text-emerald-400 font-bold">Output: [1, 2] (Match)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> +25 XP Earned
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 fill-amber-400" /> 7-Day Streak
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="px-4 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-sans">
                  <Terminal className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-300 font-medium capitalize">{selectedLanguage} Sandbox</span>
                </div>

                <button
                  onClick={() => setIsTestRun(!isTestRun)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold font-sans text-xs transition-all ${
                    isTestRun
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  }`}
                >
                  <Play className={`h-3 w-3 ${!isTestRun ? 'fill-white' : ''}`} />
                  {isTestRun ? 'Reset Code' : 'Run Tests (Simulate)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PLATFORM METRICS TILES (High-Contrast Glassmorphic KPI Row)
         ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl text-center">
        <div className="space-y-1 p-2">
          <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            500+
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Practice Problems
          </div>
        </div>

        <div className="space-y-1 p-2 border-l border-white/10">
          <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            100%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Anti-Cheat Protected
          </div>
        </div>

        <div className="space-y-1 p-2 border-l border-white/10">
          <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
            5
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Language Sandboxes
          </div>
        </div>

        <div className="space-y-1 p-2 border-l border-white/10">
          <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            &lt;20ms
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Execution Latency
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. BENTO GRID FEATURE SHOWCASE (Why KrishnaCode)
         ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Sparkles className="h-4 w-4" /> Enterprise-Grade Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Engineered for Modern Assessment & Learning
          </h2>
          <p className="text-slate-400 text-sm">
            Everything universities, coding bootcamps, and technical recruiters need in a single unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bento Card 1: Anti-Cheat Suite */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Anti-Cheat Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-spectrum protection: clipboard copy/paste blocking, tab-switch loss tracking, right-click disabling, and synchronized countdown submission.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-semibold text-blue-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Armed & Verified
            </div>
          </div>

          {/* Bento Card 2: Diagnostic Error Parser */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1.5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold shadow-lg shadow-purple-500/10">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Error Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically isolates line numbers for SyntaxErrors, IndentationErrors, and compiler crashes with smart fix suggestions.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-semibold text-purple-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Line & Column Extraction
            </div>
          </div>

          {/* Bento Card 3: Multi-Language Sandbox */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1.5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/10">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Language Sandbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run Python 3.11, C++17, Java 17, C, and Node.js JavaScript with strict memory safety and time limit benchmarking.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Millisecond Benchmarking
            </div>
          </div>

          {/* Bento Card 4: Leaderboards & Telemetry */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Campus Leaderboards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gamified XP rankings, 3D podiums, daily problem streaks, and 3-second live streaming submission trackers for admins.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-semibold text-amber-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> 3-Sec Live Stream
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PRACTICE PROBLEMS CATALOG PREVIEW (Filterable Explorer)
         ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Code2 className="h-4 w-4" /> Algorithmic Challenge Bank
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Curated Practice Challenges
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {problemCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
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
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl flex flex-col justify-between hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> +{problem.xp} XP
                  </span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {problem.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-[10px] font-semibold text-slate-400 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {problem.solvedCount.toLocaleString()} Solved
                </span>
                <Link
                  href="/student/problems"
                  className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors"
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 border border-white/10 hover:border-slate-700 transition-all shadow-lg"
          >
            Explore All 500+ Practice Problems <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. LEARNING ROADMAPS SECTION (01 - 04)
         ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Compass className="h-4 w-4" /> Systematic Curriculums
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Structured Learning Roadmaps
          </h2>
          <p className="text-slate-400 text-sm">
            Step-by-step master tracks designed by software engineers to take you from foundational syntax to advanced graph theory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roadmap 01 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-bl-2xl font-mono">
              01
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Programming Fundamentals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Variables, operators, conditional branching, loops, functions, basic recursion, and pointer memory models.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Control Flow & Nested Logic
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Functions, Scope & Call Stacks
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Input / Output Stream Parsing
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 02 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-bl-2xl font-mono">
              02
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/10">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Data Structures Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master contiguous vs linked memory: Arrays, Linked Lists, Stacks, Queues, Binary Trees, Heaps, and Hash Maps.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Linear Structures & Dynamic Arrays
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Binary Search Trees & Priority Queues
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Hash Tables & Collision Resolution
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 03 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-bl-2xl font-mono">
              03
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/10">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Algorithms & Complexity Design</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asymptotic complexity (Big-O), Divide & Conquer, Binary Search, Dynamic Programming, and Graph Traversals.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Binary Search & Sliding Windows
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Dynamic Programming & Memoization
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Graph Algorithms (BFS, DFS, Dijkstra)
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap 04 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-600 text-white text-xs font-black rounded-bl-2xl font-mono">
              04
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Interview Patterns & Speed Drills</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targeted technical screening questions, speed mock tests under strict anti-cheat proctoring, and company problem archives.
              </p>
              <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Top 75 LeetCode / FAANG Patterns
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Timed Proctored Mock Examinations
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" /> Behavioral & Coding Speed Analysis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. DAILY CODING CHALLENGE SPOTLIGHT (Streak & XP Gamification)
         ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" /> Daily Challenge Active
              </span>
              <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono">
                <Clock className="h-3.5 w-3.5 inline mr-1" /> Resets in 06h 45m
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Problem of the Day: <span className="bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">Find the Missing Number</span>
            </h3>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Given an array <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">nums</code> containing <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">n</code> distinct numbers in the range <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">[0, n]</code>, return the only number missing from the array in O(N) time and O(1) space.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Difficulty</span>
                <span className="text-amber-400 font-bold">Medium</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reward</span>
                <span className="text-emerald-400 font-bold">+50 XP & Streak Bonus</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Submissions Today</span>
                <span className="text-white font-bold font-mono">540+ Students</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-center w-full max-w-xs space-y-2 shadow-xl">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Your Coding Streak</div>
              <div className="text-4xl font-black text-amber-400 flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-amber-500 fill-amber-500 animate-pulse" /> 7 Days
              </div>
              <div className="text-[11px] text-slate-400">Solve today to level up your developer rank!</div>
            </div>

            <Link
              href="/student/problems"
              className="w-full max-w-xs py-3.5 px-6 rounded-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
            >
              Solve Today's Challenge Now
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SUPPORTED LANGUAGES GRID
         ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Terminal className="h-4 w-4" /> Multi-Language Sandbox Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Compiled & Interpreted Languages
          </h2>
          <p className="text-slate-400 text-sm">
            Execute code seamlessly in your language of choice with standardized I/O streams and instant assertion testing.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Python', version: 'Python 3.11', icon: '🐍', tag: 'Fast Execution' },
            { name: 'C++', version: 'GCC 11 (C++17)', icon: '🚀', tag: 'Ultra-Fast O(1)' },
            { name: 'Java', version: 'Java 17 OpenJDK', icon: '☕', tag: 'Enterprise Grade' },
            { name: 'C', version: 'GCC 11 (C17)', icon: '⚡', tag: 'Low-Level Speed' },
            { name: 'JavaScript', version: 'Node.js 18', icon: '💛', tag: 'Async Engine' },
          ].map(lang => (
            <div
              key={lang.name}
              className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl text-center space-y-2 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl">{lang.icon}</div>
              <div className="font-bold text-white text-base">{lang.name}</div>
              <div className="text-xs text-slate-400 font-mono">{lang.version}</div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                {lang.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. FINAL CALL TO ACTION (Get Started Today)
         ========================================================================= */}
      <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Accelerate Your Coding Journey?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Join thousands of developers and university students practicing algorithms, taking proctored exams, and preparing for top-tier software engineering careers.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login?role=student"
              className="px-8 py-4 rounded-2xl font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-black/20 transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login?role=admin"
              className="px-8 py-4 rounded-2xl font-bold bg-blue-900/50 hover:bg-blue-900/70 text-white border border-white/30 backdrop-blur-md transition-all"
            >
              Request Admin Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
