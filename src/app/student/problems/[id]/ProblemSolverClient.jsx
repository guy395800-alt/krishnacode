'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
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

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const STARTER_TEMPLATES = {
  python: `# Python 3.11 Solution
def solution():
    # Read input from STDIN and print output to STDOUT
    import sys
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Write your algorithmic solution here
    print(" ".join(input_data))

if __name__ == '__main__':
    solution()
`,
  cpp: `// C++17 Solution
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read input from STDIN
    // Write your algorithmic solution here

    return 0;
}
`,
  c: `// C (GCC 11) Solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Read input from STDIN
    // Write your algorithmic solution here

    return 0;
}
`,
  java: `// Java 17 OpenJDK Solution
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read input from STDIN
        // Write your algorithmic solution here
    }
}
`,
  javascript: `// Node.js 18 JavaScript Solution
const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    
    // Write your algorithmic solution here
    console.log(input);
}

main();
`
};

export default function ProblemSolverClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const problemId = params?.id || initialId || '1';

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_TEMPLATES.python);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState('testcases');
  
  // Execution state
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);

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
    setCode(STARTER_TEMPLATES[newLang] || '');
  };

  const handleResetCode = () => {
    if (confirm('Reset code editor to starter template? Your current edits will be lost.')) {
      setCode(STARTER_TEMPLATES[language] || '');
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setActiveTab('output');
    setExecutionResult(null);

    try {
      const resp = await api.post('/submissions/run', {
        problem_id: Number(problemId),
        language,
        code,
      });
      setExecutionResult(resp.data);
    } catch (err) {
      const errData = err.response?.data;
      const detailMsg = typeof errData?.detail === 'string' 
        ? errData.detail 
        : Array.isArray(errData?.detail) 
        ? errData.detail.map((d) => d.msg || JSON.stringify(d)).join('\n')
        : (errData?.error || err.message || 'Execution failed. Check backend compiler.');

      setExecutionResult({
        status: errData?.status || 'Runtime Error',
        error: detailMsg,
        stderr: errData?.stderr || (typeof errData?.detail === 'string' ? errData.detail : ''),
        stdout: errData?.stdout || '',
        test_case_results: errData?.test_case_results || []
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitting(true);
    setActiveTab('output');
    setExecutionResult(null);

    try {
      const resp = await api.post('/submissions', {
        problem_id: Number(problemId),
        language,
        code,
      });
      setExecutionResult(resp.data);
      fetchProblemSubmissions();
    } catch (err) {
      const errData = err.response?.data;
      const detailMsg = typeof errData?.detail === 'string' 
        ? errData.detail 
        : Array.isArray(errData?.detail) 
        ? errData.detail.map((d) => d.msg || JSON.stringify(d)).join('\n')
        : (errData?.error || err.message || 'Submission failed. Check backend status.');

      setExecutionResult({
        status: errData?.status || 'Submission Failed',
        error: detailMsg,
        stderr: errData?.stderr || (typeof errData?.detail === 'string' ? errData.detail : ''),
        stdout: errData?.stdout || '',
        test_case_results: errData?.test_case_results || []
      });
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

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[420px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
            <MonacoEditor
              height="420px"
              language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : 'cpp'}
              theme="vs-dark"
              value={code}
              onChange={(newVal) => setCode(newVal || '')}
              options={{
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
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
