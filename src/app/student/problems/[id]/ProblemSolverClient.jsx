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
  Check,
  Flame
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ExecutionResultViewer from '../../../../components/ExecutionResultViewer';
import StreakModal from '../../../../components/StreakModal';
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
    // Print the answer using cout

    return 0;
}
`,
    c: `// C Solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Read input and write logic
    return 0;
}
`,
    java: `// Java 17 Solution
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}
`,
    javascript: `// JavaScript (Node.js) Solution
const fs = require('fs');

function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    if (!input) return;
    // Write your logic here
}

main();
`
  };

  return templates[language] || templates.python;
}

export const DEFAULT_PROBLEMS_CATALOG = {
  '1': {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 10,
    time_limit: 2.0,
    memory_limit: 128,
    topic: 'Arrays',
    tags: ['array', 'hash-table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    input_format: 'First line contains N and Target space separated. Second line contains N integers.',
    output_format: 'Print the two 0-indexed space-separated indices.',
    constraints: '2 <= N <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    examples: [
      { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }
    ],
    test_cases: [
      { id: 1, input_data: '4 9\n2 7 11 15', expected_output: '0 1', is_public: true },
      { id: 2, input_data: '3 6\n3 2 4', expected_output: '1 2', is_public: true },
      { id: 3, input_data: '2 6\n3 3', expected_output: '0 1', is_public: false }
    ]
  },
  '2': {
    id: 2,
    title: 'Reverse String',
    difficulty: 'Easy',
    points: 10,
    time_limit: 1.0,
    memory_limit: 128,
    topic: 'Strings',
    tags: ['string', 'two-pointers'],
    description: 'Write a program that takes a string input and prints the string reversed.',
    input_format: 'A single line containing the string S.',
    output_format: 'The reversed string.',
    constraints: '1 <= |S| <= 10^5',
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'Reversed string is olleh' }
    ],
    test_cases: [
      { id: 4, input_data: 'hello', expected_output: 'olleh', is_public: true },
      { id: 5, input_data: 'NexGenCode', expected_output: 'edoCneGxeN', is_public: true },
      { id: 6, input_data: 'racecar', expected_output: 'racecar', is_public: false }
    ]
  }
};

export function getProblemTestCases(prob) {
  if (prob?.test_cases && prob.test_cases.length > 0) {
    return prob.test_cases;
  }
  const idStr = String(prob?.id || '1');
  return DEFAULT_PROBLEMS_CATALOG[idStr]?.test_cases || DEFAULT_PROBLEMS_CATALOG['1'].test_cases;
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
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakData, setStreakData] = useState({ streak: 1, streakIncreased: true });

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
      } else {
        const fallback = DEFAULT_PROBLEMS_CATALOG[String(problemId)] || DEFAULT_PROBLEMS_CATALOG['1'];
        setProblem(fallback);
        setCode(generateNamedFunctionTemplate(language, fallback));
      }
    } catch {
      const fallback = DEFAULT_PROBLEMS_CATALOG[String(problemId)] || DEFAULT_PROBLEMS_CATALOG['1'];
      setProblem(fallback);
      setCode(generateNamedFunctionTemplate(language, fallback));
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemSubmissions = async () => {
    try {
      const resp = await api.get(`/submissions?problem_id=${problemId}`);
      if (Array.isArray(resp.data)) {
        setSubmissionHistory(resp.data);
      }
    } catch {
      // ignore
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(generateNamedFunctionTemplate(newLang, problem));
  };

  const handleResetCode = () => {
    setCode(generateNamedFunctionTemplate(language, problem));
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

      // Trigger Streak Animation Modal
      if (resp.data && resp.data.streak) {
        setStreakData({
          streak: resp.data.streak,
          streakIncreased: resp.data.streak_increased ?? true,
        });
        setShowStreakModal(true);
      }
    } catch {
      const localResult = executeCodeLocally(code, language, rawCases);
      setExecutionResult(localResult);

      if (localResult.overall_status === 'Accepted') {
        triggerConfetti();
      }

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
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{problem.title}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <span className="text-xs text-slate-400">Topic: {problem.topic || 'General Algorithms'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="python">Python 3.11</option>
            <option value="cpp">C++ 17</option>
            <option value="c">C (GCC)</option>
            <option value="java">Java 17</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>

          <button
            onClick={handleResetCode}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Starter Code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            {running ? <Clock className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />}
            Run Tests
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {submitting ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit Solution
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Problem Statement */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Problem Description</h3>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
          </div>

          {problem.input_format && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Format</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">{problem.input_format}</p>
            </div>
          )}

          {problem.output_format && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Output Format</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">{problem.output_format}</p>
            </div>
          )}

          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h4>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[10px]">Input:</span>
                    <pre className="text-slate-200 whitespace-pre-wrap">{ex.input}</pre>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[10px]">Output:</span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{ex.output}</pre>
                  </div>
                  {ex.explanation && (
                    <div className="pt-1 text-slate-400 font-sans text-xs">
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Monaco Code Editor & Tabs */}
        <div className="flex flex-col space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2 text-slate-200 font-bold">
                <Code2 className="h-4 w-4 text-blue-400" /> solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'java' ? 'java' : 'js'}
              </span>
              <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Anti-Cheat Active
              </span>
            </div>

            <div className="h-[380px] w-full">
              <MonacoEditor
                height="100%"
                language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : 'cpp'}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={handleDisableCopyPaste}
                options={MONACO_NO_COPY_OPTIONS}
              />
            </div>
          </div>

          {/* Bottom Execution Console & Results */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/70 px-4">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'testcases' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'output' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" /> Compiler Console
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Submissions
              </button>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              {activeTab === 'output' && (
                <ExecutionResultViewer
                  result={executionResult}
                  language={language}
                  isLoading={running || submitting}
                />
              )}

              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  {getProblemTestCases(problem).filter(t => t.is_public !== false).map((tc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Test Case #{idx + 1}:</span>
                      <div><strong className="text-slate-500">Input:</strong> <span className="text-slate-200">{tc.input_data || tc.input}</span></div>
                      <div><strong className="text-slate-500">Expected:</strong> <span className="text-emerald-400">{tc.expected_output || tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
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

      {/* Streak Celebration Modal Animation */}
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streak={streakData.streak}
        streakIncreased={streakData.streakIncreased}
        problemTitle={problem?.title}
      />
    </div>
  );
}
