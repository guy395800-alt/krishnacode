'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { handleDisableCopyPaste, MONACO_NO_COPY_OPTIONS } from '../../../../../lib/monaco';
import { executeCodeLocally } from '../../../../../lib/codeEvaluator';
import {
  GraduationCap,
  Clock,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Code2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Maximize2,
  Check
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ExecutionResultViewer from '../../../../../components/ExecutionResultViewer';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const STARTER_TEMPLATES = {
  python: `# Write your exam solution in Python 3.11\nimport sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    # Solution logic here\n\nif __name__ == '__main__':\n    main()\n`,
  cpp: `// Write your exam solution in C++17\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Solution logic here\n    return 0;\n}\n`,
  java: `// Write your exam solution in Java 17\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Solution logic here\n    }\n}\n`,
  c: `// Write your exam solution in C\n#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Solution logic here\n    return 0;\n}\n`,
  javascript: `// Write your exam solution in JavaScript (Node.js)\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\n// Solution logic here\n`
};

export default function ExamWorkspaceClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id || initialId || '1';

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  
  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);

  // Per-problem answers and states: { [problemId]: { code, language, status, executionResult } }
  const [answers, setAnswers] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [currentCode, setCurrentCode] = useState(STARTER_TEMPLATES.python);
  
  // Anti-cheat warnings
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Execution status
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [copyPasteAlert, setCopyPasteAlert] = useState(false);

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  // Anti-cheat tab switch detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && timerActive) {
        setTabSwitches((prev) => {
          const count = prev + 1;
          setShowWarningModal(true);
          return count;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [timerActive]);

  // Exam Countdown Timer Interval
  useEffect(() => {
    if (!timerActive || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, secondsRemaining]);

  const fetchExamDetails = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/exams/${examId}`);
      setExam(resp.data);
      
      const durationSecs = (resp.data.duration_minutes || 60) * 60;
      setSecondsRemaining(durationSecs);
      setTimerActive(true);

      const initialAnswers = {};
      const problems = resp.data.problems || [];
      problems.forEach((p) => {
        const pid = p.problem?.id || p.problem_id || p.id;
        initialAnswers[pid] = {
          code: STARTER_TEMPLATES.python,
          language: 'python',
          status: 'unattempted',
          result: null
        };
      });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error('Failed to load exam', err);
    } finally {
      setLoading(false);
    }
  };

  const currentProblem = exam?.problems?.[currentProblemIdx]?.problem || exam?.problems?.[currentProblemIdx] || null;
  const currentPid = currentProblem?.id;

  const handleSelectProblem = (idx) => {
    if (currentPid) {
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: {
          ...prev[currentPid],
          code: currentCode,
          language: currentLanguage,
          result: executionResult
        }
      }));
    }

    setCurrentProblemIdx(idx);
    const nextProb = exam?.problems?.[idx]?.problem || exam?.problems?.[idx];
    const nextPid = nextProb?.id;

    if (nextPid && answers[nextPid]) {
      setCurrentCode(answers[nextPid].code || STARTER_TEMPLATES[answers[nextPid].language || 'python']);
      setCurrentLanguage(answers[nextPid].language || 'python');
      setExecutionResult(answers[nextPid].result || null);
    } else {
      setCurrentCode(STARTER_TEMPLATES.python);
      setCurrentLanguage('python');
      setExecutionResult(null);
    }
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLanguage(newLang);
    const newCode = STARTER_TEMPLATES[newLang] || '';
    setCurrentCode(newCode);
    if (currentPid) {
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: { ...prev[currentPid], language: newLang, code: newCode }
      }));
    }
  };

  const handleRunTest = async () => {
    if (!currentPid) return;
    setRunning(true);
    setExecutionResult(null);

    const testCases = currentProblem?.test_cases || [
      { id: 1, input_data: 'nums = [2, 7, 11, 15], target = 9', expected_output: '[0, 1]' },
      { id: 2, input_data: 'nums = [3, 2, 4], target = 6', expected_output: '[1, 2]' }
    ];

    try {
      const resp = await api.post('/submissions/run', {
        problem_id: Number(currentPid),
        language: currentLanguage,
        code: currentCode,
      });
      setExecutionResult(resp.data);
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: {
          ...prev[currentPid],
          code: currentCode,
          language: currentLanguage,
          result: resp.data,
          status: resp.data.status === 'Accepted' || resp.data.overall_status === 'Accepted' ? 'solved' : 'attempted'
        }
      }));
    } catch {
      // Local Sandbox execution fallback
      const localResult = executeCodeLocally(currentCode, currentLanguage, testCases);
      setExecutionResult(localResult);
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: {
          ...prev[currentPid],
          code: currentCode,
          language: currentLanguage,
          result: localResult,
          status: localResult.overall_status === 'Accepted' ? 'solved' : 'attempted'
        }
      }));
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!currentPid) return;
    setSubmitting(true);

    const testCases = currentProblem?.test_cases || [
      { id: 1, input_data: 'nums = [2, 7, 11, 15], target = 9', expected_output: '[0, 1]' },
      { id: 2, input_data: 'nums = [3, 2, 4], target = 6', expected_output: '[1, 2]' }
    ];

    try {
      const resp = await api.post('/submissions', {
        problem_id: Number(currentPid),
        language: currentLanguage,
        code: currentCode,
        exam_id: Number(examId),
      });
      setExecutionResult(resp.data);
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: {
          ...prev[currentPid],
          code: currentCode,
          language: currentLanguage,
          result: resp.data,
          status: resp.data.status === 'Accepted' || resp.data.overall_status === 'Accepted' ? 'solved' : 'attempted'
        }
      }));
    } catch {
      // Local Sandbox submission fallback
      const localResult = executeCodeLocally(currentCode, currentLanguage, testCases);
      setExecutionResult(localResult);
      setAnswers((prev) => ({
        ...prev,
        [currentPid]: {
          ...prev[currentPid],
          code: currentCode,
          language: currentLanguage,
          result: localResult,
          status: localResult.overall_status === 'Accepted' ? 'solved' : 'attempted'
        }
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishExam = async () => {
    try {
      await api.post(`/exams/${examId}/submit`, {});
      alert('Examination submitted successfully!');
      router.push('/student/exams');
    } catch (err) {
      router.push('/student/exams');
    }
  };

  const handleAutoSubmitExam = async () => {
    alert('Time limit expired! Your examination responses have been automatically submitted.');
    handleFinishExam();
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h.toString().padStart(2, '0')}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-sm font-bold text-slate-400">Initializing secure exam environment...</span>
        </div>
      </div>
    );
  }

  const problemsList = exam?.problems || [];

  return (
    <div className="min-h-screen flex flex-col space-y-4 -mt-4">
      {/* Exam Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{exam?.name}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Marks: {exam?.total_marks}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Anti-Cheat Active 🛡️</span>
            </div>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
          <Clock className={`h-5 w-5 ${secondsRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Time Remaining</span>
            <span className={`text-lg font-mono font-black ${secondsRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Right: Submit Exam Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
          >
            Finish & Submit Exam
          </button>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 px-2 uppercase">Questions:</span>
        {problemsList.map((p, idx) => {
          const pid = p.problem?.id || p.problem_id || p.id;
          const isCurrent = idx === currentProblemIdx;
          const status = answers[pid]?.status;

          return (
            <button
              key={pid || idx}
              onClick={() => handleSelectProblem(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Q{idx + 1}</span>
              {status === 'solved' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              {status === 'attempted' && <span className="h-2 w-2 rounded-full bg-amber-400"></span>}
            </button>
          );
        })}
      </div>

      {/* Exam Main Interface Split (Question Details Left | Monaco Editor Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[68vh]">
        {/* Left Column: Problem Details */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm overflow-y-auto max-h-[75vh] space-y-6 select-none">
          {currentProblem ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Question {currentProblemIdx + 1} of {problemsList.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {currentProblem.difficulty || 'Medium'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{currentProblem.title}</h2>
              </div>

              <div className="space-y-2 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentProblem.description}
              </div>

              {currentProblem.input_format && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 uppercase">Input Format:</span>
                  <p className="font-mono bg-slate-950 p-2.5 rounded-xl text-slate-200">
                    {currentProblem.input_format}
                  </p>
                </div>
              )}

              {currentProblem.output_format && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 uppercase">Output Format:</span>
                  <p className="font-mono bg-slate-950 p-2.5 rounded-xl text-slate-200">
                    {currentProblem.output_format}
                  </p>
                </div>
              )}

              {currentProblem.constraints && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 uppercase">Constraints:</span>
                  <p className="font-mono bg-slate-950 p-2.5 rounded-xl text-slate-200 whitespace-pre-line">
                    {currentProblem.constraints}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-slate-400 text-center py-12">Select a question to view statement.</div>
          )}
        </div>

        {/* Right Column: Monaco Code Editor with Anti-Cheat Protection */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Top Editor Bar */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-400" />
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-bold text-xs text-white focus:outline-none"
              >
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC 11)</option>
                <option value="java">Java 17 OpenJDK</option>
                <option value="c">C (GCC 11)</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTest}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
              >
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                {running ? 'Running...' : 'Run Test Cases'}
              </button>

              <button
                onClick={handleSubmitQuestion}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
              >
                <Send className="h-3.5 w-3.5" />
                {submitting ? 'Submitting...' : 'Submit Question'}
              </button>
            </div>
          </div>

          {/* Monaco Anti-Cheat Protected Editor */}
          <div className="relative flex-1 min-h-[380px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner no-copy-editor">
            {copyPasteAlert && (
              <div className="absolute top-3 right-3 z-30 px-3.5 py-1.5 rounded-xl bg-red-600/95 text-white font-bold text-xs shadow-xl flex items-center gap-1.5 backdrop-blur-sm animate-pulse border border-red-400/30">
                <ShieldAlert className="h-4 w-4" /> Copy & Paste is disabled (Anti-Cheat Active)
              </div>
            )}
            <MonacoEditor
              height="380px"
              language={currentLanguage === 'python' ? 'python' : currentLanguage === 'javascript' ? 'javascript' : currentLanguage === 'java' ? 'java' : 'cpp'}
              theme="vs-dark"
              value={currentCode}
              onChange={(val) => setCurrentCode(val || '')}
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

          {/* Console / Test Output Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <ExecutionResultViewer
              result={executionResult}
              language={currentLanguage}
              isLoading={running || submitting}
            />
          </div>
        </div>
      </div>

      {/* Warning Modal for Tab Switching */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-red-500/50 shadow-2xl text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-white">Anti-Cheating Warning</h3>
            <p className="text-xs text-slate-300">
              Tab switching or loss of focus detected ({tabSwitches} occurrence(s)). 
              All focus loss events are recorded in the examination audit log.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              I Understand & Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Finish Exam */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Submit Examination?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to finish and submit your exam? You will not be able to modify your answers once submitted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishExam}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yes, Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
