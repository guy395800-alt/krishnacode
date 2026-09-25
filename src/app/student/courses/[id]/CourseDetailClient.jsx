'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, getEnrolledCourses, enrollInCourse } from '../../../../lib/coursesStore';
import { triggerConfetti } from '../../../../lib/confetti';
import { handleDisableCopyPaste, MONACO_NO_COPY_OPTIONS } from '../../../../lib/monaco';
import { executeCodeLocally } from '../../../../lib/codeEvaluator';
import ExecutionResultViewer from '../../../../components/ExecutionResultViewer';
import dynamic from 'next/dynamic';
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Clock,
  Star,
  Users,
  Code2,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Share2,
  Download,
  Play,
  RotateCcw,
  Terminal,
  Cpu,
  AlertCircle,
  Check,
  Zap,
  Info
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CourseDetailClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id || initialId;

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(['l1', 'l2']);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModuleId, setOpenModuleId] = useState(null);

  // Coding Arena State
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'video' | 'notes'

  useEffect(() => {
    if (courseId) {
      const found = getCourseById(courseId);
      if (found) {
        setCourse(found);
        setOpenModuleId(found.modules?.[0]?.id || null);
        const firstLesson = found.modules?.[0]?.lessons?.[0] || null;
        setActiveLesson(firstLesson);
        if (firstLesson?.problem) {
          setUserCode(firstLesson.problem.templates?.python || '');
        }
        const enrolled = getEnrolledCourses();
        setIsEnrolled(enrolled.includes(courseId));
      }
    }
  }, [courseId]);

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    setExecutionResult(null);
    if (lesson.problem) {
      setUserCode(lesson.problem.templates?.[selectedLanguage] || lesson.problem.templates?.python || '');
      setActiveTab('problem');
    } else {
      setActiveTab('video');
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (activeLesson?.problem?.templates?.[lang]) {
      setUserCode(activeLesson.problem.templates[lang]);
    }
    setExecutionResult(null);
  };

  const handleResetCode = () => {
    if (activeLesson?.problem?.templates?.[selectedLanguage]) {
      setUserCode(activeLesson.problem.templates[selectedLanguage]);
      setExecutionResult(null);
    }
  };

  const handleRunCode = () => {
    if (!activeLesson?.problem) return;
    setIsRunning(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsRunning(false);
      const testCases = activeLesson.problem.testCases || [];
      const evaluated = executeCodeLocally(userCode, selectedLanguage, testCases);
      setExecutionResult(evaluated);

      if (evaluated.overall_status === 'Accepted') {
        triggerConfetti();
        handleLessonComplete(activeLesson.id);
      }
    }, 400);
  };

  const handleLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
  };

  if (!course) {
    return (
      <div className="p-16 text-center text-slate-400 apple-card rounded-3xl space-y-4">
        <div className="animate-pulse">Loading course curriculum & coding problems...</div>
        <Link href="/student/courses" className="text-xs text-blue-400 hover:underline">
          ← Return to Courses Catalog
        </Link>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="space-y-8">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Courses
        </Link>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
          {course.category} • {course.difficulty}
        </span>
      </div>

      {/* Main Course Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{course.rating}</span>
                <span className="text-slate-400">({course.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span>{course.totalStudents.toLocaleString()} Enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>{course.duration}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-3 space-y-1.5 max-w-lg">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Course Completion:</span>
                <span className="font-bold text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{course.instructor}</div>
                <div className="text-[11px] text-slate-400">{course.instructorRole}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              🏛️ {course.department}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum & Coding Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Lesson or Coding Challenge */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl apple-card border border-white/10 shadow-2xl space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold">
                  {activeLesson?.type === 'problem' ? (
                    <Code2 className="h-4 w-4 text-amber-400" />
                  ) : (
                    <PlayCircle className="h-4 w-4 text-blue-400" />
                  )}
                  <span>
                    {activeLesson?.type === 'problem' ? 'Integrated Coding Challenge' : 'Theory & Lecture'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeLesson?.title || 'Select a lesson from curriculum'}
                </h2>
              </div>

              {/* Mode Switcher Tabs */}
              {activeLesson?.problem && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('problem')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'problem'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" /> Code Solver
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'video'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Video Lecture
                  </button>
                </div>
              )}
            </div>

            {/* =========================================================
                IF CODING PROBLEM VIEW
               ========================================================= */}
            {activeLesson?.problem && activeTab === 'problem' ? (
              <div className="space-y-6">
                {/* Function Return Mode Info Banner */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 backdrop-blur-md">
                  <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">
                      ⚡ Function-Return Mode (LeetCode Style)
                    </span>
                    <p className="text-amber-200/90 leading-relaxed font-normal">
                      <strong>Do NOT read from standard input</strong> (no <code>input()</code>, <code>cin</code>, or <code>Scanner</code>). Simply write the algorithmic logic inside the function and <strong>RETURN the computed answer</strong>.
                    </p>
                  </div>
                </div>

                {/* Problem Statement & Description */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white font-mono text-sm">
                      {activeLesson.problem.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">
                      +{activeLesson.problem.points} XP
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{activeLesson.problem.description}</p>

                  {/* Sample Test Case Preview */}
                  <div className="space-y-2 pt-2">
                    <div className="font-mono font-bold text-slate-400 uppercase text-[10px]">
                      Example Test Cases:
                    </div>
                    {activeLesson.problem.testCases?.map((tc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                        <div className="text-slate-400"><strong>Input:</strong> {tc.input}</div>
                        <div className="text-emerald-400"><strong>Expected Return:</strong> {tc.expected}</div>
                        {tc.explanation && (
                          <div className="text-slate-500 text-[10px]"><strong>Explanation:</strong> {tc.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monaco Code Editor with Language Selector */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {/* Language Tabs */}
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'python', label: 'Python 3.11' },
                        { id: 'cpp', label: 'C++17' },
                        { id: 'java', label: 'Java 17' },
                        { id: 'javascript', label: 'JavaScript' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => handleLanguageChange(lang.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            selectedLanguage === lang.id
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleResetCode}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                      title="Reset to starter template"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset Template
                    </button>
                  </div>

                  {/* Editor Frame */}
                  <div className="h-80 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-inner">
                    <MonacoEditor
                      height="100%"
                      language={selectedLanguage === 'cpp' ? 'cpp' : (selectedLanguage === 'java' ? 'java' : (selectedLanguage === 'javascript' ? 'javascript' : 'python'))}
                      theme="vs-dark"
                      value={userCode}
                      onChange={(val) => setUserCode(val || '')}
                      onMount={(editor, monaco) => handleDisableCopyPaste(editor, monaco)}
                      options={{
                        ...MONACO_NO_COPY_OPTIONS,
                        fontSize: 13,
                        fontFamily: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Terminal className="h-4 w-4 text-blue-400" />
                    <span>Evaluation Sandbox: Isolated Sandbox Node</span>
                  </div>

                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold font-sans text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                    {isRunning ? 'Evaluating Test Cases...' : 'Run Code & Return Answer'}
                  </button>
                </div>

                {/* Execution Results Viewer */}
                {(executionResult || isRunning) && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
                    <ExecutionResultViewer
                      result={executionResult}
                      language={selectedLanguage}
                      isLoading={isRunning}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* =========================================================
                  VIDEO LECTURE / NOTES VIEW
                 ========================================================= */
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-16 w-16 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/20 group cursor-pointer hover:scale-110 transition-transform">
                    <PlayCircle className="h-8 w-8" />
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Lecture: {activeLesson?.title}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    1080p Full HD Video Stream with Embedded Notes
                  </span>
                </div>

                {activeLesson?.notes && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-white block">Key Lecture Takeaways:</span>
                    <p className="font-normal leading-relaxed">{activeLesson.notes}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    onClick={() => activeLesson && handleLessonComplete(activeLesson.id)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Completed (+25 XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Modules & Syllabus Accordion */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-black text-white tracking-tight">
              Course Curriculum
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {course.modules?.length} Modules
            </span>
          </div>

          <div className="space-y-3">
            {course.modules?.map((mod) => {
              const isOpen = openModuleId === mod.id;
              return (
                <div
                  key={mod.id}
                  className="rounded-2xl apple-card border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white line-clamp-1">{mod.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {mod.lessons?.length || 0} Lessons & Problems
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-white/5 bg-slate-950/40">
                      {mod.lessons?.map((les) => {
                        const isDone = completedLessons.includes(les.id);
                        const isSelected = activeLesson?.id === les.id;
                        return (
                          <div
                            key={les.id}
                            onClick={() => handleSelectLesson(les)}
                            className={`p-3 rounded-xl flex items-center justify-between cursor-pointer text-xs transition-all ${
                              isSelected
                                ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                                : 'hover:bg-slate-900/80 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              ) : les.type === 'problem' ? (
                                <Code2 className="h-4 w-4 text-amber-400 shrink-0" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-blue-400 shrink-0" />
                              )}
                              <span className="line-clamp-1 font-medium">{les.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                              {les.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
