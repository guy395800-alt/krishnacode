'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, getEnrolledCourses, enrollInCourse } from '../../../../lib/coursesStore';
import { triggerConfetti } from '../../../../lib/confetti';
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
  Download
} from 'lucide-react';

export default function CourseDetailClient({ initialId }) {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id || initialId;

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(['l1', 'l2']);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    if (courseId) {
      const found = getCourseById(courseId);
      if (found) {
        setCourse(found);
        setOpenModuleId(found.modules?.[0]?.id || null);
        setActiveLesson(found.modules?.[0]?.lessons?.[0] || null);
        const enrolled = getEnrolledCourses();
        setIsEnrolled(enrolled.includes(courseId));
      }
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="p-16 text-center text-slate-400 apple-card rounded-3xl space-y-4">
        <div className="animate-pulse">Loading course curriculum...</div>
        <Link href="/student/courses" className="text-xs text-blue-400 hover:underline">
          ← Return to Courses Catalog
        </Link>
      </div>
    );
  }

  const handleLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      triggerConfetti();
    }
  };

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

      {/* Curriculum & Lesson Player Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Lesson Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl apple-card border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold">
                <PlayCircle className="h-4 w-4" /> Active Lesson
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activeLesson?.duration || '30 min'}
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeLesson?.title || 'Select a lesson from curriculum'}
              </h2>

              {/* Video / Interactive Code Simulation Player */}
              <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-16 w-16 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/20 group cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Interactive Lecture: {activeLesson?.title}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  1080p Full HD Video Stream with Embedded Monaco Coding Sandbox
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <Link
                  href="/student/problems"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition-all"
                >
                  <Code2 className="h-4 w-4 text-cyan-400" /> Open Code Problem Arena
                </Link>

                <button
                  onClick={() => activeLesson && handleLessonComplete(activeLesson.id)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark Lesson Complete (+25 XP)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Modules & Syllabus Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-black text-white tracking-tight">
              Course Curriculum
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {course.modules?.length} Modules
            </span>
          </div>

          <div className="space-y-3">
            {course.modules?.map((mod, modIdx) => {
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
                        {mod.lessons?.length || 0} Lessons
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
                            onClick={() => setActiveLesson(les)}
                            className={`p-3 rounded-xl flex items-center justify-between cursor-pointer text-xs transition-all ${
                              isSelected
                                ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                                : 'hover:bg-slate-900/80 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
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
