'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Database,
  Users,
  Activity,
  HelpCircle,
  Laptop,
  Briefcase,
  GitBranch,
  Rocket,
  CheckCircle
} from 'lucide-react';

const ROTATING_PHRASES = [
  { text: 'spark real careers.', gradient: 'from-blue-400 via-indigo-300 to-sky-400' },
  { text: 'crack dream placements.', gradient: 'from-emerald-400 via-teal-300 to-cyan-400' },
  { text: 'master complex algorithms.', gradient: 'from-purple-400 via-pink-300 to-indigo-400' },
  { text: 'ace proctored college exams.', gradient: 'from-amber-400 via-orange-300 to-yellow-400' },
  { text: 'build future-ready software.', gradient: 'from-rose-400 via-pink-400 to-purple-400' }
];

const CODE_EXAMPLES = {
  python: {
    filename: 'two_sum.py',
    lang: 'PYTHON 3.11',
    code: `# Given an array of integers, return indices adding to target
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution: two_sum([2, 7, 11, 15], 9) -> [0, 1]`,
    output: '6 / 6 Test Cases Passed · O(n) Runtime · 12 ms · 2.1 MB'
  },
  cpp: {
    filename: 'two_sum.cpp',
    lang: 'C++17 (GCC 11)',
    code: `// C++17 High-Performance Solution
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    output: '6 / 6 Test Cases Passed · O(n) Runtime · 4 ms · 1.8 MB'
  },
  sql: {
    filename: 'top_students.sql',
    lang: 'SQL (POSTGRESQL)',
    code: `-- Query: Top scoring student per college department
SELECT 
    department, 
    student_name, 
    MAX(score) AS highest_score
FROM college_assessments
GROUP BY department, student_name
ORDER BY highest_score DESC
LIMIT 5;`,
    output: 'Query Executed · 5 Rows Returned · 8 ms · Memory 1.2 MB'
  },
  java: {
    filename: 'TwoSum.java',
    lang: 'JAVA 17 (OPENJDK)',
    code: `// Java 17 OpenJDK Solution
import java.util.HashMap;

public class TwoSum {
    public static int[] solve(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) return new int[]{map.get(diff), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    output: '6 / 6 Test Cases Passed · O(n) Runtime · 22 ms · 3.4 MB'
  },
  javascript: {
    filename: 'twoSum.js',
    lang: 'NODE.JS 18 LTS',
    code: `// Node.js 18 Solution
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}`,
    output: '6 / 6 Test Cases Passed · O(n) Runtime · 16 ms · 2.6 MB'
  }
};

const CAREER_TRACKS = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: GitBranch,
    badge: 'Core Foundation',
    color: 'from-blue-500 to-indigo-500',
    description: 'Master arrays, trees, dynamic programming, graphs, and Big-O analysis demanded by FAANG & Tier-1 tech firms.',
    modules: ['Arrays & Sliding Window', 'Linked Lists & Two Pointers', 'Binary Trees & Graphs', 'Dynamic Programming & Memoization', 'Bit Manipulation & Greedy'],
    problems: '280+ Problems',
    avgPackage: '12-45 LPA Target'
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Web & Cloud',
    icon: Laptop,
    badge: 'Industry High Demand',
    color: 'from-purple-500 to-pink-500',
    description: 'Build enterprise-grade REST APIs, relational databases, Next.js client architectures, and CI/CD pipelines.',
    modules: ['Modern JavaScript & TypeScript', 'Next.js 14 Server Components', 'PostgreSQL & Database Design', 'FastAPI & Python Microservices', 'Docker & Cloud Deployment'],
    problems: '150+ Full Projects',
    avgPackage: '10-35 LPA Target'
  },
  {
    id: 'ai_data',
    name: 'AI & Data Engineering',
    icon: Cpu,
    badge: 'Next-Gen Frontier',
    color: 'from-emerald-500 to-teal-500',
    description: 'Deep dive into Python data pipelines, vectorized operations, SQL window functions, and LLM application frameworks.',
    modules: ['Advanced Python & NumPy', 'SQL Analytics & Window Functions', 'Data Pipelines & ETL Design', 'Vector Databases & Embeddings', 'AI Agent Architectures'],
    problems: '120+ Datasets & Tasks',
    avgPackage: '14-40 LPA Target'
  },
  {
    id: 'systems',
    name: 'Systems & Core CS',
    icon: Terminal,
    badge: 'Academic Excellence',
    color: 'from-amber-500 to-orange-500',
    description: 'Understand operating system fundamentals, memory allocation, multi-threading, concurrency, and low-level C/C++.',
    modules: ['C/C++ Memory Management', 'Pointers & System Calls', 'Processes & Concurrency', 'Networking & TCP/IP Sockets', 'Compiler Design Fundamentals'],
    problems: '90+ System Challenges',
    avgPackage: '12-38 LPA Target'
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [activeLang, setActiveLang] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('dsa');

  // Dynamic Rotating Hero Text State ("Text Going")
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setIsFading(false);
      }, 400);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setSimulatedOutput(true);
    }, 550);
  };

  const faqs = [
    {
      q: 'How does the Anti-Cheat Proctoring engine protect exam integrity?',
      a: 'NexgenCode uses an institutional-grade security shield: it intercepts and disables keyboard shortcuts for copy/paste/cut (Ctrl+C, Ctrl+V, Shift+Insert, Command+V), locks out right-click context menus, prevents text highlighting, monitors browser tab-switches and focus loss with automated audit logs, and enforces server-side synchronized countdown timers.'
    },
    {
      q: 'Can our college configure custom semester labs and syllabus tracks?',
      a: 'Yes! Admins can create semester-wise labs with week-wise unlocked tracks (W1 to W12), configure custom problem sets with public example test cases and hidden evaluation cases, and track student code submission streams in real-time.'
    },
    {
      q: 'What programming languages and compilers are supported?',
      a: 'The platform provides isolated, high-speed execution sandboxes for Python 3.11, C++17 (GCC 11), C17, Java 17 (OpenJDK), Node.js 18 (JavaScript), and PostgreSQL/SQLite database engines.'
    },
    {
      q: 'How does the automated compiler diagnostic parser work?',
      a: 'When student code fails or triggers an error, our intelligent diagnostic parser analyzes the compiler stderr and tracebacks to pinpoint the exact line & column, explains the error type (SyntaxError, IndentationError, TLE, Wrong Answer), and provides actionable fix hints without giving away the full answer.'
    },
    {
      q: 'Can assessment results and student marks be exported for college records?',
      a: 'Yes. Admins can export complete CSV/Excel score reports, submission code snapshots, pass percentages, execution times, and anti-cheat audit logs with a single click.'
    }
  ];

  const currentPhrase = ROTATING_PHRASES[phraseIndex];

  return (
    <div className="flex flex-col space-y-28 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* =========================================================================
          1. HERO SECTION (Apple SF Pro Typography + Dynamic Cycling Text)
         ========================================================================= */}
      <section className="relative pt-6 pb-4" id="top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Product Tag Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase backdrop-blur-md shadow-lg shadow-blue-500/10 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Next-Gen College Coding & Proctoring Ecosystem</span>
            </div>

            {/* Subtitle Triad: Learn • Practice • Master • Get Placed */}
            <div className="flex items-center gap-4 text-xs font-mono font-bold tracking-[0.14em] uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-cyan-400 block shadow-sm shadow-cyan-400" /> Learn
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-indigo-400 block shadow-sm shadow-indigo-400" /> Practice
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-purple-400 block shadow-sm shadow-purple-400" /> Master
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-amber-400 block shadow-sm shadow-amber-400" /> Placement
              </span>
            </div>

            {/* Main Punchy Headline with Dynamic Rotating Text */}
            <div className="min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] flex flex-col justify-center">
              <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black tracking-tight text-white leading-[1.08]">
                Where students learn to code — and <br className="hidden sm:inline" />
                <span
                  className={`inline-block transition-all duration-300 transform ${
                    isFading ? 'opacity-0 -translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100'
                  } bg-gradient-to-r ${currentPhrase.gradient} bg-clip-text text-transparent italic font-serif`}
                >
                  {currentPhrase.text}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              The all-in-one college platform: curated tech roadmaps, semester-wise labs with week-wise unlocks, placement-style examinations with AI anti-cheat security, and real-time live admin dashboards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white apple-btn-primary shadow-xl shadow-blue-500/25"
                >
                  <span>Go to {user.role === 'admin' ? 'Admin' : 'Student'} Workspace</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login?role=student"
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white apple-btn-primary shadow-xl shadow-blue-500/30"
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span>Start Practice Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/login?role=admin"
                    className="flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-slate-300 hover:text-white apple-btn-glass"
                  >
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                    <span>Admin Portal</span>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof Quick Counters */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-white/10 text-left">
              <div>
                <div className="font-mono font-black text-2xl sm:text-3xl text-white">50+</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Colleges Onboard</div>
              </div>
              <div>
                <div className="font-mono font-black text-2xl sm:text-3xl text-white">25,000+</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Students</div>
              </div>
              <div>
                <div className="font-mono font-black text-2xl sm:text-3xl text-white">6+</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Compilers + SQL</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Interactive Multi-Language Code Arena */}
          <div className="lg:col-span-5 relative">
            {/* Top Floating Badge: XP & Rank Climb */}
            <div className="absolute -top-5 right-2 z-20 px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-white font-bold text-xs shadow-2xl flex items-center gap-2 backdrop-blur-xl animate-float-slow">
              <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>+120 XP · Rank #14 ➔ #9 🏆</span>
            </div>

            {/* Interactive Code Container */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs backdrop-blur-2xl apple-card">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400 font-semibold text-xs font-sans">
                    {CODE_EXAMPLES[activeLang].filename}
                  </span>
                </div>

                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {Object.keys(CODE_EXAMPLES).map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setActiveLang(k);
                        setSimulatedOutput(false);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold transition-all ${
                        activeLang === k
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {k === 'javascript' ? 'JS' : k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Body */}
              <div className="p-5 text-slate-300 leading-relaxed overflow-x-auto min-h-[250px] bg-slate-950/70">
                <pre className="text-xs whitespace-pre font-mono">
                  <code>{CODE_EXAMPLES[activeLang].code}</code>
                </pre>
              </div>

              {/* Simulated Output Banner (when user clicks Run) */}
              {simulatedOutput && (
                <div className="p-3.5 bg-emerald-950/50 border-t border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {CODE_EXAMPLES[activeLang].output}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Accepted
                  </span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="px-4 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-sans">
                  <Terminal className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-300 font-semibold">{CODE_EXAMPLES[activeLang].lang}</span>
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold font-sans text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <Play className={`h-3 w-3 ${isRunning ? 'animate-spin' : 'fill-slate-950'}`} />
                  {isRunning ? 'Compiling...' : 'Run Code'}
                </button>
              </div>
            </div>

            {/* Bottom Floating Badge: Active Student Presence Stack */}
            <div className="absolute -bottom-5 -left-3 sm:-left-6 z-20 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white font-bold text-xs shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-float-reverse">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full border border-white/20 bg-blue-600 flex items-center justify-center text-[10px] font-bold">A</span>
                <span className="w-7 h-7 rounded-full border border-white/20 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">R</span>
                <span className="w-7 h-7 rounded-full border border-white/20 bg-purple-600 flex items-center justify-center text-[10px] font-bold">S</span>
                <span className="w-7 h-7 rounded-full border border-white/20 bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">K</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span><strong>1,420+</strong> students coding live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ANIMATED MARQUEE TICKER (Continuous High-Tech Banner)
         ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-blue-900/30 via-indigo-900/40 to-purple-900/30 border-y border-white/10 py-3.5 overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-8 text-xs font-mono font-bold tracking-wider text-slate-300 uppercase whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-2">⚡ Proctored Placement Exams</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">🛡️ Strict Clipboard & Anti-Cheat Shield</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">💻 6+ Languages + SQL Live Sandboxes</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">📅 Semester-Wise 12-Week Unlocked Labs</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">🎯 Instant Diagnostic & Syntax Error Hints</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">📊 Real-Time Admin Code Stream</span>
          <span className="text-blue-500">•</span>
          <span className="flex items-center gap-2">🏆 Campus Rankings & Streak Flame</span>
        </div>
      </div>

      {/* =========================================================================
          3. HOW EVERY STUDENT SPARKS (4-Step Learning Journey Loop)
         ========================================================================= */}
      <section className="space-y-12" id="journey">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Compass className="h-4 w-4" /> The Learning Loop
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Every Student <span className="animate-text-gold italic font-serif">sparks.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Not passive video watching — a continuous hands-on loop students run every day on every topic until the concept clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <div className="p-7 rounded-3xl apple-card-interactive space-y-4 relative overflow-hidden group">
            <div className="text-4xl font-black font-mono text-blue-500/30 group-hover:text-blue-400 transition-colors">
              01
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Learn Concepts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Short, focused concept breakdowns, theory slides, and input/output structure designs with zero filler.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-7 rounded-3xl apple-card-interactive space-y-4 relative overflow-hidden group">
            <div className="text-4xl font-black font-mono text-indigo-500/30 group-hover:text-indigo-400 transition-colors">
              02
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Code & Assert</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve algorithmic challenges directly in the browser Monaco editor with public and hidden test case assertions.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-7 rounded-3xl apple-card-interactive space-y-4 relative overflow-hidden group">
            <div className="text-4xl font-black font-mono text-purple-500/30 group-hover:text-purple-400 transition-colors">
              03
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Diagnostics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated compiler parsing isolates line numbers, explains syntax/indentation errors, and displays Big-O complexity insights.
            </p>
          </div>

          {/* Step 04 */}
          <div className="p-7 rounded-3xl apple-card-interactive space-y-4 relative overflow-hidden group">
            <div className="text-4xl font-black font-mono text-amber-500/30 group-hover:text-amber-400 transition-colors">
              04
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Level Up & Rank</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn XP points, unlock next week's lab milestone, maintain streak momentum, and climb campus leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CAREER TRACKS & SYLLABUS ROADMAPS (AlgoSpark Inspired)
         ========================================================================= */}
      <section className="space-y-8" id="tracks">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Target className="h-4 w-4" /> Career Specializations
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Curated <span className="animate-text-flow">Industry Tracks</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Structured step-by-step pathways designed around real corporate hiring standards and technical interview patterns.
          </p>
        </div>

        {/* Track Selector Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CAREER_TRACKS.map((track) => {
            const Icon = track.icon;
            const isSelected = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 border border-blue-400/40 scale-105'
                    : 'apple-card text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                <span>{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Track Detailed Display Card */}
        {(() => {
          const currentTrack = CAREER_TRACKS.find((t) => t.id === selectedTrack);
          if (!currentTrack) return null;
          const TrackIcon = currentTrack.icon;

          return (
            <div className="p-8 sm:p-10 rounded-3xl apple-card border border-white/10 shadow-2xl space-y-8 backdrop-blur-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${currentTrack.color} text-white shadow-lg`}>
                      <TrackIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        {currentTrack.badge}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        {currentTrack.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
                    {currentTrack.description}
                  </p>
                </div>

                <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono font-bold text-slate-200">
                    🔥 {currentTrack.problems}
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
                    💼 {currentTrack.avgPackage}
                  </div>
                </div>
              </div>

              {/* Syllabus Module Pills */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Included Milestones & Lab Modules:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentTrack.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3 hover:border-blue-500/30 transition-all"
                    >
                      <div className="h-7 w-7 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        0{idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* =========================================================================
          5. SEMESTER-WISE LABS (12-Week Structured Curriculum Timeline)
         ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl apple-card border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl" id="labs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Layers className="h-4 w-4" /> Curriculum Progress Track
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Semester-Wise Labs with Week-Wise Unlocks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              A cohort that learns together. Complete Week 1 exercises to unlock Week 2. Every submission logs execution time, memory, and code snapshots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
              Semester 4: Data Structures & Algorithms
            </span>
          </div>
        </div>

        {/* 12-Week Milestone Timeline */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3 pt-4">
          {[
            { w: 'W1', title: 'Arrays & Pointers', status: 'completed' },
            { w: 'W2', title: 'Linked Lists', status: 'completed' },
            { w: 'W3', title: 'Stacks & Queues', status: 'completed' },
            { w: 'W4', title: 'Recursion & Backtracking', status: 'completed' },
            { w: 'W5', title: 'Binary Trees', status: 'completed' },
            { w: 'W6', title: 'BST & Heaps', status: 'completed' },
            { w: 'W7', title: 'Graph BFS & DFS', status: 'active' },
            { w: 'W8', title: 'Dynamic Programming', status: 'locked' },
            { w: 'W9', title: 'Greedy Algorithms', status: 'locked' },
            { w: 'W10', title: 'Hash Maps & Tries', status: 'locked' },
            { w: 'W11', title: 'Bit Manipulation', status: 'locked' },
            { w: 'W12', title: 'Capstone Project', status: 'locked' },
          ].map((item) => (
            <div
              key={item.w}
              className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                item.status === 'completed'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5'
                  : item.status === 'active'
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-xl shadow-amber-500/10 animate-pulse'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="font-mono font-black text-xs">{item.w}</div>
              <div className="flex justify-center">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : item.status === 'active' ? (
                  <Sparkles className="h-4 w-4 text-amber-400" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-600" />
                )}
              </div>
              <div className="text-[10px] font-medium line-clamp-1 text-slate-300">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. PROCTORED EXAMINATIONS & ANTI-CHEAT SUITE
         ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl apple-card" id="exams">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="h-4 w-4" /> Proctoring & Integrity Guard
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Placement-Style Exams Built for Academic Integrity
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Conduct high-stakes semester exams and hiring assessments with a battle-tested anti-cheat engine that eliminates unauthorized assistance.
            </p>

            <div className="space-y-3 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Clipboard Security:</strong> Strict Monaco and DOM-level blocking of Copy, Paste, Cut, and Context-Menu.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Tab Visibility Tracking:</strong> Records window blur & tab switching events in live audit logs.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Synchronized Timer:</strong> Automatic exam submission on zero-countdown with zero data loss.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-red-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400 animate-bounce" /> Live Anti-Cheat Monitor
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold text-[10px] border border-red-500/30">
                ARMED & ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Copy / Paste Shortcut Attempt:</span>
                <span className="text-red-400 font-bold font-mono">BLOCKED ❌</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Right-Click Context Menu:</span>
                <span className="text-red-400 font-bold font-mono">DISABLED ❌</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tab Focus Loss Count:</span>
                <span className="text-emerald-400 font-bold font-mono">0 Incidents (Clean) ✅</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time Remaining:</span>
                <span className="text-white font-black font-mono">42:15</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. INTERACTIVE FAQ ACCORDION SECTION
         ========================================================================= */}
      <section className="max-w-4xl mx-auto space-y-8 w-full">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl apple-card cursor-pointer transition-all hover:border-blue-500/40"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="h-4 w-4 text-blue-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
              {activeFaq === idx && (
                <p className="pt-3 text-xs text-slate-300 leading-relaxed font-normal border-t border-slate-800 mt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. FINAL CALL TO ACTION BANNER (Get Started / Book Demo)
         ========================================================================= */}
      <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Empower Your Campus Coders?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Join thousands of engineering students mastering algorithms, taking proctored exams, and unlocking career-defining tech placements.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login?role=student"
              className="px-8 py-4 rounded-2xl font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-black/20 transition-all hover:scale-105"
            >
              Start Practicing Free
            </Link>
            <Link
              href="/login?role=admin"
              className="px-8 py-4 rounded-2xl font-bold bg-blue-950/60 hover:bg-blue-950/80 text-white border border-white/30 backdrop-blur-md transition-all"
            >
              Launch Admin Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
