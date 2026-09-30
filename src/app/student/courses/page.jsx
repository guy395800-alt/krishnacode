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
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';

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
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Academic Courses &amp; Labs"
        subtitle="Faculty-curated syllabus pathways, week-by-week structured milestones, and embedded compiler exercises."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" /> Enrolled: {enrolledIds.length} Active
          </span>
        }
      />

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 border border-blue-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
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
                className="rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl overflow-hidden flex flex-col justify-between group transition-all hover:border-slate-700"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Category Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-slate-900/90 border border-white/10 text-cyan-300 backdrop-blur-md">
                      {course.category}
                    </span>

                    {/* Difficulty Pill */}
                    <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border backdrop-blur-md ${
                      course.difficulty === 'Easy'
                        ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/30'
                        : course.difficulty === 'Intermediate'
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/30'
                        : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
                    }`}>
                      {course.difficulty}
                    </span>

                    {/* Enrolled Status Overlay Badge */}
                    {isEnrolled && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold shadow-md">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                      </div>
                    )}
                  </div>

                  {/* Course Details Body */}
                  <div className="p-5 space-y-3.5">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white line-clamp-1 tracking-tight group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
                      <div className="h-7 w-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-300">
                        {course.instructor.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-200">{course.instructor}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{course.instructorRole}</div>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-sky-400" />
                        <span>
                          {course.modules?.reduce((acc, m) => acc + (m.lessons?.filter(l => l.type === 'problem')?.length || 0), 0) || 0} Challenges
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  {isEnrolled ? (
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Continue Learning</span>
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => handleEnroll(course.id, e)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all hover:scale-[1.01]"
                    >
                      <GraduationCap className="h-4 w-4 text-amber-400" />
                      <span>Enroll in Course</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={BookOpen}
              title="No Courses Match Your Query"
              description="Try adjusting your keyword search or select a different category to view available courses."
              actionLabel="Show All Courses"
              onAction={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
