'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { triggerConfetti } from '../../../../lib/confetti';
import { executeCodeLocally, compareOutputs } from '../../../../lib/codeEvaluator';
import {
  Code2,
  Play,
  Send,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  RotateCcw,
  Sparkles,
  Terminal,
  ChevronRight,
  AlertTriangle,
  Star,
  Check
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ExecutionResultViewer from '../../../../components/ExecutionResultViewer';
import { handleDisableCopyPaste, MONACO_NO_COPY_OPTIONS } from '../../../../lib/monaco';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export function generateNamedFunctionTemplate(language, problem) {
  const templates = {
    python: `# Python 3.11 Solution
# Read input from standard input (stdin) and print output (stdout)
import sys

def solve():
    # Read input: e.g. input_data = sys.stdin.read().split() or line = input()
    # Write your algorithmic solution here
    # Print the answer using print(...)
    pass

if __name__ == '__main__':
    solve()
`,
    cpp: `// C++17 Solution
// Read input from standard input (cin) and print output (cout)
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your algorithmic solution here
    // Read input from cin and print output using cout

    return 0;
}
`,
    c: `// C (GCC 11) Solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Write your algorithmic solution here
    // Read input from scanf and print output using printf

    return 0;
}
`,
    java: `// Java 17 OpenJDK Solution
// Read input from standard input (Scanner) and print output
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your algorithmic solution here
        // Read input using sc and print output using System.out.println(...)

    }
}
`,
    javascript: `// Node.js 18 JavaScript Solution
const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;

    // Write your algorithmic solution here
    // Read input and print output using console.log(...)

}

solve();
`
  };

  return templates[language] || templates.python;
}

export const DEFAULT_PROBLEMS_CATALOG = {
  '1': {
    id: 1,
    title: 'Find Maximum Element in Array',
    topic: 'Arrays',
    difficulty: 'Easy',
    points: 50,
    time_limit: 2,
    description: 'Given an array of integers on standard input, determine and print the maximum value found in the array.',
    input_format: 'A line containing space-separated integers, or an array formatted as nums = [3, 7, 2, 9, 5].',
    output_format: 'Print a single integer representing the maximum element in the array.',
    constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
    test_cases: [
      { id: 1, input_data: 'nums = [3, 7, 2, 9, 5]', expected_output: '9', is_public: true },
      { id: 2, input_data: 'nums = [-10, -3, -50, -1]', expected_output: '-1', is_public: true },
      { id: 3, input_data: 'nums = [42]', expected_output: '42', is_public: true }
    ]
  },
  '2': {
    id: 2,
    title: 'Two Sum Target Pair Indices',
    topic: 'Arrays',
    difficulty: 'Easy',
    points: 50,
    time_limit: 2,
    description: 'Given an array of integers `nums` and an integer `target`, find indices of the two numbers such that they add up to `target` and print the resulting pair.',
    input_format: 'The array nums and the target integer on standard input (or formatted as nums = [...], target = k).',
    output_format: 'Print the array of two zero-based indices [index1, index2] to standard output.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nExactly one valid answer exists.',
    test_cases: [
      { id: 1, input_data: 'nums = [2, 7, 11, 15], target = 9', expected_output: '[0, 1]', is_public: true },
      { id: 2, input_data: 'nums = [3, 2, 4], target = 6', expected_output: '[1, 2]', is_public: true },
      { id: 3, input_data: 'nums = [3, 3], target = 6', expected_output: '[0, 1]', is_public: true }
    ]
  },
  '3': {
    id: 3,
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    points: 75,
    time_limit: 2,
    description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and print its sum.',
    input_format: 'An array of integers nums on standard input.',
    output_format: 'Print a single integer representing the maximum subarray sum.',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    test_cases: [
      { id: 1, input_data: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected_output: '6', is_public: true },
      { id: 2, input_data: 'nums = [1]', expected_output: '1', is_public: true },
      { id: 3, input_data: 'nums = [5, 4, -1, 7, 8]', expected_output: '23', is_public: true }
    ]
  },
  '4': {
    id: 4,
    title: 'Valid Palindrome String',
    topic: 'Strings',
    difficulty: 'Easy',
    points: 50,
    time_limit: 2,
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Determine if the string is a palindrome and print true or false.',
    input_format: 'A string s on standard input.',
    output_format: 'Print true if s is a palindrome, or false otherwise.',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    test_cases: [
      { id: 1, input_data: 's = "A man, a plan, a canal: Panama"', expected_output: 'true', is_public: true },
      { id: 2, input_data: 's = "race a car"', expected_output: 'false', is_public: true },
      { id: 3, input_data: 's = " "', expected_output: 'true', is_public: true }
    ]
  },
  '5': {
    id: 5,
    title: 'Climbing Stairs Combinations',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    points: 50,
    time_limit: 2,
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. Calculate in how many distinct ways you can climb to the top and print the total.',
    input_format: 'An integer n representing the total number of stairs.',
    output_format: 'Print the integer number of distinct ways to climb to the top.',
    constraints: '1 <= n <= 45',
    test_cases: [
      { id: 1, input_data: 'n = 2', expected_output: '2', is_public: true },
      { id: 2, input_data: 'n = 3', expected_output: '3', is_public: true },
      { id: 3, input_data: 'n = 5', expected_output: '8', is_public: true }
    ]
  }
};

export function getProblemTestCases(prob) {
  if (prob?.test_cases && prob.test_cases.length > 0) {
    return prob.test_cases;
  }

  const title = (prob?.title || '').toLowerCase();
  const desc = (prob?.description || '').toLowerCase();

  if (title.includes('two sum') || (desc.includes('two') && desc.includes('sum'))) {
    return DEFAULT_PROBLEMS_CATALOG['2'].test_cases;
  }

  if (title.includes('palindrome') || desc.includes('palindrome')) {
    return DEFAULT_PROBLEMS_CATALOG['4'].test_cases;
  }

  if (title.includes('max') && (title.includes('subarray') || title.includes('array'))) {
    return DEFAULT_PROBLEMS_CATALOG['3'].test_cases;
  }

  if (title.includes('stair') || title.includes('climb')) {
    return DEFAULT_PROBLEMS_CATALOG['5'].test_cases;
  }

  return DEFAULT_PROBLEMS_CATALOG['1'].test_cases;
}

export default function ProblemSolverClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const problemId = params?.id || initialId || '1';

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState('testcases');
  
  // Execution state
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [copyPasteAlert, setCopyPasteAlert] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchProblemDetails();
      fetchProblemSubmissions();
    }
  }, [problemId]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/problems/${problemId}`);
      if (resp.data && resp.data.title) {
        setProblem(resp.data);
        setCode(generateNamedFunctionTemplate(language, resp.data));
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend problem fetch error, loading from catalog', err);
    }
    
    // Fallback to local catalog
    const fallback = DEFAULT_PROBLEMS_CATALOG[String(problemId)] || DEFAULT_PROBLEMS_CATALOG['1'];
    setProblem(fallback);
    setCode(generateNamedFunctionTemplate(language, fallback));
    setLoading(false);
  };

  const fetchProblemSubmissions = async () => {
    try {
      const resp = await api.get('/submissions');
      const filtered = resp.data.filter((s) => String(s.problem_id) === String(problemId));
      setSubmissionHistory(filtered);
    } catch (err) {
      console.error('Failed to load past submissions', err);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(generateNamedFunctionTemplate(newLang, problem));
  };

  const handleResetCode = () => {
    if (confirm('Reset code editor to starter template? Your current edits will be lost.')) {
      setCode(generateNamedFunctionTemplate(language, problem));
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setActiveTab('output');
    setExecutionResult(null);

    const rawCases = getProblemTestCases(problem);
    const publicCases = rawCases.filter(t => t.is_public !== false);

    try {
      const resp = await api.post('/submissions/run', {
        problem_id: Number(problemId),
        language,
        code,
      });

      if (resp.data) {
        setExecutionResult(resp.data);
      } else {
        const localResult = executeCodeLocally(code, language, publicCases);
        setExecutionResult(localResult);
      }
    } catch {
      // Offline / Sandbox Fallback: evaluate code accurately with test cases
      const localResult = executeCodeLocally(code, language, publicCases);
      setExecutionResult(localResult);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitting(true);
    setActiveTab('output');
    setExecutionResult(null);

    const rawCases = getProblemTestCases(problem);

    try {
      const resp = await api.post('/submissions', {
        problem_id: Number(problemId),
        language,
        code,
      });

      setExecutionResult(resp.data);
      fetchProblemSubmissions();
      if (resp.data.overall_status === 'Accepted' || resp.data.status === 'Accepted') {
        triggerConfetti();
      }
    } catch {
      // Evaluate all test cases locally
      const localResult = executeCodeLocally(code, language, rawCases);
      setExecutionResult(localResult);

      if (localResult.overall_status === 'Accepted') {
        triggerConfetti();
      }

      // Append local submission history
      const newSub = {
        id: Date.now(),
        problem_id: Number(problemId),
        language,
        status: localResult.overall_status,
        passed_test_cases: localResult.passed_test_cases,
        total_test_cases: localResult.total_test_cases,
        execution_time_ms: localResult.execution_time_ms,
        created_at: new Date().toISOString()
      };
      setSubmissionHistory(prev => [newSub, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-400 font-sans">Loading problem environment...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white font-sans">Problem Not Found</h2>
        <p className="text-slate-400 text-sm font-sans">The requested coding problem does not exist or has been removed.</p>
        <Link
          href="/student/problems"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Problem Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans animate-reveal-fade">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/student/problems"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {problem.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Topic: {problem.topic} • Points: {problem.points} XP • Time Limit: {problem.time_limit || 2}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-700/80 transition-all interactive-btn disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 text-emerald-400 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Running Tests...' : 'Run Test Cases'}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all interactive-btn disabled:opacity-50"
          >
            <Send className={`h-3.5 w-3.5 ${submitting ? 'animate-pulse' : ''}`} />
            {submitting ? 'Submitting Solution...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Main Split Grid (Problem Statement Left | Monaco Editor & Output Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[75vh]">
        {/* Left Column: Problem Details & Constraints */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-y-auto max-h-[82vh] space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {problem.input_format && (
            <div className="space-y-2 pt-3 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Format</h4>
              <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-slate-300 border border-slate-800/80">
                {problem.input_format}
              </p>
            </div>
          )}

          {problem.output_format && (
            <div className="space-y-2 pt-3 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Output Format</h4>
              <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-slate-300 border border-slate-800/80">
                {problem.output_format}
              </p>
            </div>
          )}

          {problem.constraints && (
            <div className="space-y-2 pt-3 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
              <div className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-slate-300 border border-slate-800/80 whitespace-pre-line">
                {problem.constraints}
              </div>
            </div>
          )}

          {/* Public Example Test Cases */}
          {problem.test_cases?.filter((tc) => tc.is_public)?.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Example Test Cases</h4>
              <div className="space-y-3">
                {problem.test_cases
                  .filter((tc) => tc.is_public)
                  .map((tc, idx) => (
                    <div key={tc.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-white font-mono">Example #{idx + 1}</div>
                      <div>
                        <span className="text-slate-500 font-semibold block mb-0.5">Input:</span>
                        <pre className="font-mono bg-slate-900 p-2 rounded-lg text-slate-200 border border-slate-800/80 overflow-x-auto">
                          {tc.input_data}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block mb-0.5">Expected Output:</span>
                        <pre className="font-mono bg-slate-900 p-2 rounded-lg text-emerald-400 font-bold border border-slate-800/80 overflow-x-auto">
                          {tc.expected_output}
                        </pre>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Console Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Editor Header / Language Selector */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-400" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 font-bold text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC 11)</option>
                <option value="c">C (GCC 11)</option>
                <option value="java">Java (OpenJDK 17)</option>
                <option value="javascript">JavaScript (Node.js 18)</option>
              </select>
            </div>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Template
            </button>
          </div>

          {/* Standard I/O Mode Info Banner */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2.5 font-sans">
            <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
            <span>
              <strong>Standard I/O Mode:</strong> Read input from standard input (<code>input()</code> / <code>sys.stdin</code> / <code>cin</code> / <code>Scanner</code>) and <strong>print the output</strong> directly (using <code>print(...)</code> / <code>cout</code> / <code>System.out.println</code>) according to the problem description.
            </span>
          </div>

          {/* Monaco Editor Container */}
          <div className="relative flex-1 min-h-[420px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
            {copyPasteAlert && (
              <div className="absolute top-3 right-3 z-30 px-3.5 py-1.5 rounded-xl bg-red-600/95 text-white font-bold text-xs shadow-xl flex items-center gap-1.5 backdrop-blur-sm animate-shake border border-red-400/30">
                <AlertTriangle className="h-4 w-4" /> Copy & Paste is disabled
              </div>
            )}
            <MonacoEditor
              height="420px"
              language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : 'cpp'}
              theme="vs-dark"
              value={code}
              onChange={(newVal) => setCode(newVal || '')}
              onMount={(editor, monaco) => {
                handleDisableCopyPaste(editor, monaco, () => {
                  setCopyPasteAlert(true);
                  setTimeout(() => setCopyPasteAlert(false), 2500);
                });
              }}
              options={{
                ...MONACO_NO_COPY_OPTIONS,
                fontSize: 14,
              }}
            />
          </div>

          {/* Bottom Tabs: Test Cases / Console Output / Submissions */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'testcases'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'output'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" /> Execution Output
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'submissions'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past Submissions ({submissionHistory.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 text-xs">
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  <span className="font-semibold text-slate-400">Public Test Cases Preview:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problem.test_cases?.filter((t) => t.is_public).map((tc, idx) => (
                      <div key={tc.id || idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                        <div className="font-bold text-slate-400">Case #{idx + 1}</div>
                        <div><span className="text-slate-500">In:</span> {tc.input_data}</div>
                        <div><span className="text-slate-500">Out:</span> <span className="text-emerald-400">{tc.expected_output}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'output' && (
                <ExecutionResultViewer
                  result={executionResult}
                  language={language}
                  isLoading={running || submitting}
                />
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-2">
                  {submissionHistory.length > 0 ? (
                    submissionHistory.map((sub) => (
                      <div key={sub.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="uppercase font-mono font-bold text-slate-400">{sub.language}</span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {new Date(sub.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-500 font-sans">
                      No submissions recorded for this problem yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
