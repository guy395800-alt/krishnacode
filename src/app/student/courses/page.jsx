'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses, getEnrolledCourses, enrollInCourse } from '../../../lib/coursesStore';
import { triggerConfetti } from '../../../lib/confetti';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Layers,
  Award,
  PlayCircle,
  Code2
} from 'lucide-react';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [justEnrolled, setJustEnrolled] = useState(null);

  useEffect(() => {
    setCourses(getCourses().filter((c) => c.isPublished));
    setEnrolledIds(getEnrolledCourses());
  }, []);

  const categories = ['All', 'Data Structures', 'Full-Stack', 'AI & Data', 'Systems'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = enrollInCourse(courseId);
    setEnrolledIds(updated || []);
    setJustEnrolled(courseId);
    triggerConfetti();
    setTimeout(() => setJustEnrolled(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="h-4 w-4 text-amber-400" /> College Curriculum & Industry Tracks
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Academic Courses & Skill Paths
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            Faculty-curated curriculum, week-by-week structured milestones, embedded code exercises, and placement interview bootcamps.
          </p>
        </div>

        {/* Floating Ambient Badge */}
        <div className="absolute right-6 -bottom-4 hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <div>
            <div className="text-xs font-mono text-slate-400">Your Enrolled Tracks</div>
            <div className="text-lg font-black text-white">{enrolledIds.length} Active Courses</div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
                  : 'apple-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, instructors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="rounded-3xl apple-card-interactive border border-white/10 shadow-xl overflow-hidden flex flex-col justify-between group transition-all"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Category Pill */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900/90 border border-white/10 text-cyan-300 backdrop-blur-md">
                      {course.category}
                    </span>

                    {/* Difficulty Pill */}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border backdrop-blur-md ${
                      course.difficulty === 'Easy'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                        : course.difficulty === 'Intermediate'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                        : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                    }`}>
                      {course.difficulty}
                    </span>

                    {/* Enrolled Status Overlay Badge */}
                    {isEnrolled && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-bold shadow-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                      </div>
                    )}
                  </div>

                  {/* Course Details Body */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-white line-clamp-2 tracking-tight group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        {course.instructor.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-slate-200">{course.instructor}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{course.instructorRole}</div>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>
                          {course.modules?.reduce((acc, m) => acc + (m.lessons?.filter(l => l.type === 'problem')?.length || 0), 0) || 0} Coding Challenges
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  {isEnrolled ? (
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                    >
                      <PlayCircle className="h-4 w-4" /> Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => handleEnroll(course.id, e)}
                      className="w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 apple-btn-glass text-slate-200 hover:text-white transition-all hover:scale-[1.02]"
                    >
                      <GraduationCap className="h-4 w-4 text-amber-400" /> Enroll in Course
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-16 text-center text-slate-400 apple-card rounded-3xl border border-white/10 space-y-3">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
            <div className="text-base font-bold text-white">No courses match your filter</div>
            <p className="text-xs text-slate-400">Try changing the category or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
