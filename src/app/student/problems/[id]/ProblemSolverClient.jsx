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
  const title = (problem?.title || '').toLowerCase();
  const desc = (problem?.description || '').toLowerCase();
  const inputFmt = (problem?.input_format || '').toLowerCase();

  let fnName = 'solution';
  let paramsPy = 'nums: list[int], target: int';
  let paramsCpp = 'vector<int>& nums, int target';
  let paramsJava = 'int[] nums, int target';
  let paramsJs = 'nums, target';
  let returnTypePy = 'list[int]';
  let returnTypeCpp = 'vector<int>';
  let returnTypeJava = 'int[]';

  if (title.includes('two sum') || (desc.includes('two') && desc.includes('sum'))) {
    fnName = 'twoSum';
    paramsPy = 'nums: list[int], target: int';
    paramsCpp = 'vector<int>& nums, int target';
    paramsJava = 'int[] nums, int target';
    paramsJs = 'nums, target';
    returnTypePy = 'list[int]';
    returnTypeCpp = 'vector<int>';
    returnTypeJava = 'int[]';
  } else if (title.includes('palindrome') || desc.includes('palindrome')) {
    fnName = 'isPalindrome';
    paramsPy = 's: str';
    paramsCpp = 'string s';
    paramsJava = 'String s';
    paramsJs = 's';
    returnTypePy = 'bool';
    returnTypeCpp = 'bool';
    returnTypeJava = 'boolean';
  } else if (title.includes('max') && title.includes('array')) {
    fnName = 'maxSubArray';
    paramsPy = 'nums: list[int]';
    paramsCpp = 'vector<int>& nums';
    paramsJava = 'int[] nums';
    paramsJs = 'nums';
    returnTypePy = 'int';
    returnTypeCpp = 'int';
    returnTypeJava = 'int';
  } else if (title.includes('stair') || title.includes('climb') || title.includes('fibonacci')) {
    fnName = 'climbStairs';
    paramsPy = 'n: int';
    paramsCpp = 'int n';
    paramsJava = 'int n';
    paramsJs = 'n';
    returnTypePy = 'int';
    returnTypeCpp = 'int';
    returnTypeJava = 'int';
  } else if (title.includes('reverse') || title.includes('string')) {
    fnName = 'reverseString';
    paramsPy = 's: str';
    paramsCpp = 'string s';
    paramsJava = 'String s';
    paramsJs = 's';
    returnTypePy = 'str';
    returnTypeCpp = 'string';
    returnTypeJava = 'String';
  } else if (title.includes('matrix') || title.includes('grid')) {
    fnName = 'solveGrid';
    paramsPy = 'grid: list[list[int]]';
    paramsCpp = 'vector<vector<int>>& grid';
    paramsJava = 'int[][] grid';
    paramsJs = 'grid';
    returnTypePy = 'int';
    returnTypeCpp = 'int';
    returnTypeJava = 'int';
  } else if (desc.includes('string') || inputFmt.includes('string')) {
    fnName = 'solve';
    paramsPy = 's: str';
    paramsCpp = 'string s';
    paramsJava = 'String s';
    paramsJs = 's';
    returnTypePy = 'str';
    returnTypeCpp = 'string';
    returnTypeJava = 'String';
  } else {
    fnName = 'solve';
    paramsPy = 'nums: list[int]';
    paramsCpp = 'vector<int>& nums';
    paramsJava = 'int[] nums';
    paramsJs = 'nums';
    returnTypePy = 'int';
    returnTypeCpp = 'int';
    returnTypeJava = 'int';
  }

  const templates = {
    python: `# Python 3.11 Solution
# Implement function logic and RETURN the answer (Do NOT use input())
def ${fnName}(${paramsPy}) -> ${returnTypePy}:
    # Write your algorithmic solution here
    pass
`,
    cpp: `// C++17 Solution
// Implement function logic and RETURN the answer (Do NOT use cin)
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

${returnTypeCpp} ${fnName}(${paramsCpp}) {
    // Write your algorithmic solution here
    return {};
}
`,
    c: `// C (GCC 11) Solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int ${fnName}(int nums[], int size) {
    // Write your algorithmic solution here and return the answer
    return 0;
}
`,
    java: `// Java 17 OpenJDK Solution
// Implement function logic and RETURN the answer (Do NOT use Scanner)
import java.util.*;

public class Solution {
    public ${returnTypeJava} ${fnName}(${paramsJava}) {
        // Write your algorithmic solution here
        return ${returnTypeJava.includes('[]') ? 'new int[]{}' : (returnTypeJava === 'boolean' ? 'false' : '0')};
    }
}
`,
    javascript: `// Node.js 18 JavaScript Solution
// Implement function logic and RETURN the answer
function ${fnName}(${paramsJs}) {
    // Write your algorithmic solution here
    return null;
}
`
  };

  return templates[language] || templates.python;
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
      setProblem(resp.data);
      setCode(generateNamedFunctionTemplate(language, resp.data));
    } catch (err) {
      console.error('Failed to load problem details', err);
    } finally {
      setLoading(false);
    }
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

export function getProblemTestCases(prob) {
  if (prob?.test_cases && prob.test_cases.length > 0) {
    return prob.test_cases;
  }

  const title = (prob?.title || '').toLowerCase();
  const desc = (prob?.description || '').toLowerCase();

  if (title.includes('two sum') || (desc.includes('two') && desc.includes('sum'))) {
    return [
      { id: 1, input_data: 'nums = [2, 7, 11, 15], target = 9', expected_output: '[0, 1]', is_public: true },
      { id: 2, input_data: 'nums = [3, 2, 4], target = 6', expected_output: '[1, 2]', is_public: true },
      { id: 3, input_data: 'nums = [3, 3], target = 6', expected_output: '[0, 1]', is_public: true }
    ];
  }

  if (title.includes('palindrome') || desc.includes('palindrome')) {
    return [
      { id: 1, input_data: 's = "A man, a plan, a canal: Panama"', expected_output: 'true', is_public: true },
      { id: 2, input_data: 's = "race a car"', expected_output: 'false', is_public: true },
      { id: 3, input_data: 's = " "', expected_output: 'true', is_public: true }
    ];
  }

  if (title.includes('max') && (title.includes('subarray') || title.includes('array'))) {
    return [
      { id: 1, input_data: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected_output: '6', is_public: true },
      { id: 2, input_data: 'nums = [1]', expected_output: '1', is_public: true },
      { id: 3, input_data: 'nums = [5, 4, -1, 7, 8]', expected_output: '23', is_public: true }
    ];
  }

  if (title.includes('stair') || title.includes('climb')) {
    return [
      { id: 1, input_data: 'n = 2', expected_output: '2', is_public: true },
      { id: 2, input_data: 'n = 3', expected_output: '3', is_public: true },
      { id: 3, input_data: 'n = 4', expected_output: '5', is_public: true }
    ];
  }

  return [
    { id: 1, input_data: 'nums = [3, 7, 2, 9, 5]', expected_output: '9', is_public: true },
    { id: 2, input_data: 'nums = [-10, -3, -50, -1]', expected_output: '-1', is_public: true },
    { id: 3, input_data: 'nums = [42]', expected_output: '42', is_public: true }
  ];
}

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
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-400">Loading problem environment...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Problem Not Found</h2>
        <p className="text-slate-400 text-sm">The requested coding problem does not exist or has been removed.</p>
        <Link
          href="/student/problems"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Problem Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/student/problems"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {problem.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Topic: {problem.topic} • Points: {problem.points} XP • Time Limit: {problem.time_limit || 2}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 text-emerald-500 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Testing...' : 'Run Tests'}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Send className={`h-3.5 w-3.5 ${submitting ? 'animate-pulse' : ''}`} />
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Main Split Grid (Problem Statement Left | Monaco Editor & Output Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[75vh]">
        {/* Left Column: Problem Details & Constraints */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[82vh] space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Problem Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {problem.input_format && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Format</h4>
              <p className="text-xs font-mono bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl text-slate-800 dark:text-slate-200">
                {problem.input_format}
              </p>
            </div>
          )}

          {problem.output_format && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Output Format</h4>
              <p className="text-xs font-mono bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl text-slate-800 dark:text-slate-200">
                {problem.output_format}
              </p>
            </div>
          )}

          {problem.constraints && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
              <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl text-slate-800 dark:text-slate-200 whitespace-pre-line">
                {problem.constraints}
              </div>
            </div>
          )}

          {/* Public Example Test Cases */}
          {problem.test_cases?.filter((tc) => tc.is_public)?.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Example Test Cases</h4>
              <div className="space-y-3">
                {problem.test_cases
                  .filter((tc) => tc.is_public)
                  .map((tc, idx) => (
                    <div key={tc.id || idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">Example #{idx + 1}</div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Input:</span>
                        <pre className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg text-slate-800 dark:text-slate-200 overflow-x-auto">
                          {tc.input_data}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Expected Output:</span>
                        <pre className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold overflow-x-auto">
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
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-500" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="python">Python (3.11)</option>
                <option value="cpp">C++ (GCC 11)</option>
                <option value="c">C (GCC 11)</option>
                <option value="java">Java (OpenJDK 17)</option>
                <option value="javascript">JavaScript (Node.js 18)</option>
              </select>
            </div>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Template
            </button>
          </div>

          {/* Function Return Mode Info Banner */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Function-Return Mode:</strong> Implement your logic and <strong>RETURN</strong> the computed answer directly. No need to read standard input (<code>input()</code> / <code>cin</code>).
            </span>
          </div>

          {/* Monaco Editor Container */}
          <div className="relative flex-1 min-h-[420px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
            {copyPasteAlert && (
              <div className="absolute top-3 right-3 z-30 px-3.5 py-1.5 rounded-xl bg-red-600/95 text-white font-bold text-xs shadow-xl flex items-center gap-1.5 backdrop-blur-sm animate-pulse border border-red-400/30">
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
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'testcases' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'output' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" /> Execution Output
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'submissions' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Past Submissions ({submissionHistory.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 text-xs">
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  <span className="font-semibold text-slate-500">Public Test Cases Preview:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problem.test_cases?.filter((t) => t.is_public).map((tc, idx) => (
                      <div key={tc.id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] space-y-1">
                        <div className="font-bold text-slate-400">Case #{idx + 1}</div>
                        <div><span className="text-slate-500">In:</span> {tc.input_data}</div>
                        <div><span className="text-slate-500">Out:</span> <span className="text-emerald-500">{tc.expected_output}</span></div>
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
                      <div key={sub.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            sub.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-700'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="uppercase font-mono font-bold text-slate-500">{sub.language}</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          {new Date(sub.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400">
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
