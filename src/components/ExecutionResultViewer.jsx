'use client';

import React, { useState } from 'react';
import { parseExecutionError } from '../lib/errorParser';
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
  Code,
  FileCode2,
  AlertTriangle
} from 'lucide-react';

export default function ExecutionResultViewer({ result, language = 'python', isLoading = false }) {
  const [copied, setCopied] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);

  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
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

  const isAccepted = result.status === 'Accepted' || (result.passed_test_cases && result.passed_test_cases === result.total_test_cases && !result.stderr && !result.error);
  const parsed = parseExecutionError(result, language);

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

    const type = parsed?.errorType || result.status || 'Execution Failed';

    if (type.toLowerCase().includes('syntax') || type.toLowerCase().includes('compilation')) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <AlertOctagon className="h-4 w-4" /> {type.toUpperCase()}
        </span>
      );
    }

    if (type.toLowerCase().includes('time limit')) {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <Clock className="h-4 w-4" /> TIME LIMIT EXCEEDED
        </span>
      );
    }

    if (type.toLowerCase().includes('wrong answer')) {
      return (
        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <XCircle className="h-4 w-4" /> WRONG ANSWER
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
        <XCircle className="h-4 w-4" /> {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {result.passed_test_cases !== undefined && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
              Passed: <strong className={result.passed_test_cases === result.total_test_cases ? 'text-emerald-500' : 'text-amber-500'}>{result.passed_test_cases}</strong> / {result.total_test_cases}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {result.execution_time_ms !== undefined && (
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Clock className="h-3 w-3" /> {result.execution_time_ms} ms
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

      {/* Structured Syntax / Compilation / Runtime Diagnostic Card */}
      {!isAccepted && parsed && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 dark:bg-red-950/30 overflow-hidden shadow-sm">
          {/* Diagnostic Header */}
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-red-500 shrink-0" />
              <span className="font-bold text-red-700 dark:text-red-300 uppercase tracking-wide text-[11px]">
                {parsed.errorType} Detected
              </span>
            </div>

            {parsed.line && (
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 font-mono font-bold text-[11px] border border-red-500/30">
                Line {parsed.line}{parsed.column ? `, Col ${parsed.column}` : ''}
              </span>
            )}
          </div>

          {/* Diagnostic Details */}
          <div className="p-3 space-y-2.5">
            <div className="font-mono text-red-200 text-xs font-semibold bg-red-950/60 p-2.5 rounded-lg border border-red-900/50 break-words whitespace-pre-wrap">
              {parsed.message}
            </div>

            {/* Code Snippet pointer if available */}
            {parsed.snippet && (
              <div className="font-mono text-[11px] bg-slate-950 p-2 rounded-lg text-slate-300 overflow-x-auto border border-slate-800 whitespace-pre">
                {parsed.snippet}
              </div>
            )}

            {/* Smart Helpful Hint Box */}
            {parsed.hint && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Suggestion / Fix:</span>
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

      {/* Test Case Breakdown if available */}
      {Array.isArray(result.test_case_results) && result.test_case_results.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider block">
            Test Case Evaluation:
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {result.test_case_results.map((tc, idx) => {
              const isPassed = tc.passed || tc.status === 'Passed' || tc.status === 'Accepted';
              return (
                <div
                  key={tc.test_case_id || idx}
                  className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 transition-all ${
                    isPassed
                      ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-300'
                      : 'bg-red-950/20 border-red-500/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-sans text-[11px]">
                    <span className="font-bold text-slate-400">Case #{idx + 1}</span>
                    <span className={`font-bold flex items-center gap-1 ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {isPassed ? 'Passed' : tc.status || 'Failed'}
                    </span>
                  </div>

                  {tc.input && (
                    <div className="text-[11px]">
                      <span className="text-slate-500 block font-sans text-[10px]">Input:</span>
                      <pre className="p-1.5 rounded bg-slate-950 text-slate-300 overflow-x-auto whitespace-pre-wrap">{tc.input}</pre>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {tc.expected !== undefined && (
                      <div>
                        <span className="text-slate-500 block font-sans text-[10px]">Expected Output:</span>
                        <pre className="p-1.5 rounded bg-slate-950 text-emerald-400 font-bold overflow-x-auto whitespace-pre-wrap">{tc.expected}</pre>
                      </div>
                    )}
                    {tc.actual !== undefined && (
                      <div>
                        <span className="text-slate-500 block font-sans text-[10px]">Your Output:</span>
                        <pre className={`p-1.5 rounded bg-slate-950 font-bold overflow-x-auto whitespace-pre-wrap ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>{tc.actual}</pre>
                      </div>
                    )}
                  </div>

                  {tc.stderr && (
                    <div className="text-[10px]">
                      <span className="text-red-400 block font-sans">Error:</span>
                      <pre className="p-1.5 rounded bg-red-950/50 text-red-300 overflow-x-auto whitespace-pre-wrap">{tc.stderr}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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

      {/* Standard Error Stream */}
      {result.stderr && !parsed?.snippet && (
        <div className="space-y-1">
          <span className="text-red-500 text-[11px] font-bold uppercase tracking-wider block">
            Standard Error (stderr):
          </span>
          <pre className="p-3 rounded-xl bg-red-950/30 text-red-300 border border-red-900/40 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-48">
            {result.stderr}
          </pre>
        </div>
      )}

      {/* Collapsible Full Raw Traceback */}
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
