'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  GraduationCap,
  History,
  TrendingUp,
  Trophy,
  User,
  Users,
  FileCheck2,
  BarChart3,
  Mail,
  Settings,
  ShieldCheck,
  CheckSquare,
  Flame,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Courses & Tracks', href: '/student/courses', icon: BookOpen },
    { label: 'Practice Problems', href: '/student/problems', icon: Code2 },
    { label: 'Examinations', href: '/student/exams', icon: GraduationCap },
    { label: 'Submissions', href: '/student/submissions', icon: History },
    { label: 'Learning Progress', href: '/student/progress', icon: TrendingUp },
    { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
    { label: 'My Profile', href: '/student/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Course Management', href: '/admin/courses', icon: BookOpen },
    { label: 'Student Directory', href: '/admin/students', icon: Users },
    { label: 'Problem Catalog', href: '/admin/problems', icon: Code2 },
    { label: 'Test Case Suites', href: '/admin/test-cases', icon: CheckSquare },
    { label: 'Exam Management', href: '/admin/exams', icon: GraduationCap },
    { label: 'Live Submissions', href: '/admin/submissions', icon: History },
    { label: 'Result Reports', href: '/admin/results', icon: FileCheck2 },
    { label: 'Rankings Board', href: '/admin/leaderboard', icon: Trophy },
    { label: 'Performance Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Email Notifications', href: '/admin/email-logs', icon: Mail },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-white/10 bg-slate-900/60 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="space-y-4">
        {/* Workspace Portal Header Badge */}
        <div className="p-3 bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center font-bold ${
            user.role === 'admin'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10'
          }`}>
            {user.role === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              WORKSPACE
            </span>
            <span className="text-xs font-black text-white capitalize flex items-center gap-1">
              {user.role} Portal
              {user.role === 'admin' && <span className="text-[10px] text-amber-400">👑</span>}
            </span>
          </div>
        </div>

        {/* Navigation Link List */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-sm" />
                )}
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Gamified Mini Widget (For Students) or System Pulse (For Admins) */}
      <div className="pt-4 border-t border-white/10">
        {user.role === 'student' ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" /> Daily Streak
              </span>
              <span className="font-bold text-amber-400 font-mono">7 Days</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[70%]" />
            </div>
            <Link
              href="/student/problems"
              className="mt-1 w-full py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[11px] font-bold flex items-center justify-between border border-blue-500/30 transition-colors"
            >
              <span>Solve Today's Problem</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Security Guard</span>
              <span className="text-emerald-400 text-[10px] font-mono">ARMED 🛡️</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Anti-cheat & copy protection active across examination sessions.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
