'use client';

import React, { useState } from 'react';
import { parseExecutionError } from '../lib/errorParser';
import { compareOutputs } from '../lib/codeEvaluator';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Lightbulb,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';

export default function ExecutionResultViewer({ result, language = 'python', isLoading = false }) {
  const [copied, setCopied] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-xs font-mono text-slate-400 animate-pulse">
          Executing sandbox container & evaluating test assertions...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="py-8 text-center text-slate-400 font-sans space-y-2">
        <Terminal className="h-8 w-8 text-slate-600 mx-auto" />
        <p className="text-xs">Click <strong className="text-slate-200">"Run Tests"</strong> or <strong className="text-blue-400">"Submit Solution"</strong> to inspect compiler output, syntax validation, and test assertions.</p>
      </div>
    );
  }

  const testList = Array.isArray(result.test_results)
    ? result.test_results
    : Array.isArray(result.test_case_results)
    ? result.test_case_results
    : [];

  // Helper to verify if a test case is passed
  const checkTestCasePassed = (tc) => {
    if (tc.passed !== undefined) return Boolean(tc.passed);
    if (tc.status === 'Passed' || tc.status === 'Accepted') return true;
    if (tc.status === 'Wrong Answer' || tc.status === 'Runtime Error' || tc.status === 'SyntaxError') return false;
    const actual = tc.actual_output ?? tc.actual ?? tc.stdout;
    const expected = tc.expected_output ?? tc.expected;
    if (expected !== undefined && actual !== undefined) {
      return compareOutputs(actual, expected);
    }
    return false;
  };

  const totalTests = result.total_test_cases ?? (result.total ?? testList.length);
  const passedTests = result.passed_test_cases ?? (result.passed ?? testList.filter(checkTestCasePassed).length);
  const executionTime = result.total_execution_time_ms ?? result.execution_time_ms ?? result.total_time_ms;
  const overallStatus = result.overall_status || result.status || (passedTests === totalTests && totalTests > 0 ? 'Accepted' : 'Wrong Answer');

  const isAccepted = overallStatus === 'Accepted' || (totalTests > 0 && passedTests === totalTests && overallStatus !== 'Wrong Answer');
  const parsed = parseExecutionError(result, language);

  const isSyntaxOrIndentError = parsed?.errorType && (
    parsed.errorType.toLowerCase().includes('syntax') ||
    parsed.errorType.toLowerCase().includes('indent') ||
    parsed.errorType.toLowerCase().includes('compil')
  );

  const isWrongAnswer = overallStatus === 'Wrong Answer' || (!isAccepted && !isSyntaxOrIndentError && testList.some(t => !t.passed));

  const handleCopyRaw = () => {
    const textToCopy = parsed?.rawText || JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Primary Status Badge
  const getStatusBadge = () => {
    if (isAccepted) {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="h-4 w-4" /> ACCEPTED
        </span>
      );
    }

    if (isSyntaxOrIndentError) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <AlertOctagon className="h-4 w-4" /> {(parsed?.errorType || 'Syntax Error').toUpperCase()}
        </span>
      );
    }

    if (isWrongAnswer) {
      return (
        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <XCircle className="h-4 w-4" /> WRONG ANSWER
        </span>
      );
    }

    if (overallStatus.toLowerCase().includes('time limit')) {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <Clock className="h-4 w-4" /> TIME LIMIT EXCEEDED
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
        <XCircle className="h-4 w-4" /> {overallStatus.toUpperCase()}
      </span>
    );
  };

  const activeTestCase = testList[activeCaseIdx] || testList[0];

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {totalTests > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
              Passed: <strong className={passedTests === totalTests ? 'text-emerald-500' : 'text-amber-500'}>{passedTests}</strong> / {totalTests}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {executionTime !== undefined && (
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Clock className="h-3 w-3" /> {executionTime} ms
            </span>
          )}
          <button
            onClick={handleCopyRaw}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-[11px] font-semibold"
            title="Copy Raw Output"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Diagnostic Card for SyntaxError, IndentationError, Compilation Errors, or Runtime Crashes */}
      {isSyntaxOrIndentError && parsed && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/20 dark:bg-red-950/30 overflow-hidden shadow-sm">
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-red-500 shrink-0" />
              <span className="font-bold text-red-600 dark:text-red-300 uppercase tracking-wide text-[11px]">
                {parsed.errorType} Detected
              </span>
            </div>

            {parsed.line && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-300 font-mono font-bold text-[11px] border border-red-500/30 animate-pulse">
                Line {parsed.line}{parsed.column ? `, Col ${parsed.column}` : ''}
              </span>
            )}
          </div>

          <div className="p-3.5 space-y-2.5">
            <div className="font-mono text-red-200 text-xs font-semibold bg-red-950/70 p-2.5 rounded-lg border border-red-900/60 break-words whitespace-pre-wrap">
              {parsed.message}
            </div>

            {parsed.snippet && (
              <div className="font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg text-slate-300 overflow-x-auto border border-slate-800 whitespace-pre">
                {parsed.snippet}
              </div>
            )}

            {parsed.hint && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Recommendation / Fix:</span>
                  <p className="leading-relaxed">{parsed.hint}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Accepted Banner */}
      {isAccepted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">All Test Cases Passed!</h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Your solution successfully produced the correct output within time and memory constraints.
            </p>
          </div>
        </div>
      )}

      {/* Test Case Evaluation Section (Wrong Answer or All Cases Preview) */}
      {testList.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-500" /> Test Case Assertions:
            </span>
          </div>

          {/* Test Case Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {testList.map((tc, idx) => {
              const isPassed = checkTestCasePassed(tc);
              const isActive = activeCaseIdx === idx;
              return (
                <button
                  key={tc.test_case_id || tc.id || idx}
                  onClick={() => setActiveCaseIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                    isActive
                      ? isPassed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-red-600 text-white shadow-sm'
                      : isPassed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>Case {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Active Test Case Detail Card */}
          {activeTestCase && (
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-3 transition-all ${
              checkTestCasePassed(activeTestCase)
                ? 'bg-emerald-950/10 border-emerald-500/30'
                : 'bg-red-950/20 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between font-sans text-xs pb-1 border-b border-slate-800">
                <span className="font-bold text-white">
                  Test Case #{activeCaseIdx + 1} {checkTestCasePassed(activeTestCase) ? '(Passed)' : `(${activeTestCase.status || 'Failed'})`}
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  {(activeTestCase.execution_time_ms !== undefined || activeTestCase.runtime_ms !== undefined) && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {activeTestCase.execution_time_ms ?? activeTestCase.runtime_ms} ms
                    </span>
                  )}
                  {(activeTestCase.memory_kb !== undefined || activeTestCase.memory_mb !== undefined) && (
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> {activeTestCase.memory_kb ? `${activeTestCase.memory_kb} KB` : `${activeTestCase.memory_mb} MB`}
                    </span>
                  )}
                </div>
              </div>

              {/* Input Data */}
              {(activeTestCase.input_data || activeTestCase.input) && (
                <div className="space-y-1">
                  <span className="text-slate-400 block font-sans text-[11px] font-semibold uppercase">Input:</span>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                    {activeTestCase.input_data || activeTestCase.input}
                  </pre>
                </div>
              )}

              {/* Expected vs Actual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-sans text-[11px] font-semibold uppercase">Expected Output:</span>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-emerald-400 font-bold border border-emerald-900/40 overflow-x-auto whitespace-pre-wrap">
                    {activeTestCase.expected_output ?? activeTestCase.expected ?? ''}
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-sans text-[11px] font-semibold uppercase">Your Output:</span>
                  <pre className={`p-2.5 rounded-lg bg-slate-950 font-bold border overflow-x-auto whitespace-pre-wrap ${
                    checkTestCasePassed(activeTestCase)
                      ? 'text-emerald-400 border-emerald-900/40'
                      : 'text-red-400 border-red-900/40'
                  }`}>
                    {activeTestCase.actual_output ?? activeTestCase.actual ?? activeTestCase.stdout ?? ''}
                  </pre>
                </div>
              </div>

              {/* Error Message if present */}
              {(activeTestCase.error_message || activeTestCase.stderr || activeTestCase.error) && (
                <div className="space-y-1 pt-1">
                  <span className="text-red-400 block font-sans text-[11px] font-semibold uppercase">Error Stream:</span>
                  <pre className="p-2.5 rounded-lg bg-red-950/40 text-red-300 border border-red-900/50 overflow-x-auto whitespace-pre-wrap">
                    {activeTestCase.error_message || activeTestCase.stderr || activeTestCase.error}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Standard Output Stream */}
      {result.stdout && (
        <div className="space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
            Standard Output (stdout):
          </span>
          <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-48">
            {result.stdout}
          </pre>
        </div>
      )}

      {/* Collapsible Full Raw Logs */}
      <div className="pt-1">
        <button
          onClick={() => setShowFullTrace(!showFullTrace)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-[11px] font-semibold transition-colors"
        >
          {showFullTrace ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showFullTrace ? 'Hide Full Compiler Logs' : 'View Full Compiler / Execution Logs'}
        </button>

        {showFullTrace && (
          <div className="mt-2 space-y-1">
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-60">
              {parsed?.rawText || JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
