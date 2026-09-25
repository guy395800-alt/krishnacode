'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  LogOut,
  Code2,
  Sparkles,
  Trophy,
  GraduationCap,
  ShieldCheck,
  Flame,
  Mail,
  Menu,
  X,
  Layers,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-all">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand Logo & Interactive Glow Icon */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Code2 className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white font-sans flex items-center">
                Nexgen<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Code</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1 flex items-center gap-1">
                Assessment Platform <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              </span>
            </div>
          </Link>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <Link
              href="/student/courses"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02]"
            >
              Courses
            </Link>
            <Link
              href="/student/problems"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02]"
            >
              Problems
            </Link>
            <Link
              href="/#labs"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02]"
            >
              Semester Labs
            </Link>
            <Link
              href="/#exams"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02]"
            >
              Proctoring Shield
            </Link>
            <Link
              href="/student/leaderboard"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02] flex items-center gap-1"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" /> Leaderboard
            </Link>
            <Link
              href="/#faq"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-all hover:scale-[1.02]"
            >
              FAQ
            </Link>
          </nav>
        </div>

        {/* Right Section: Sandbox Beacon, Theme Toggle, Book Demo & User/Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Live Engine Status Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sandbox Live • 99.99%</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all border border-transparent hover:border-slate-700/50"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
                  {user.role === 'admin' ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      ADMIN 👑
                    </span>
                  ) : (
                    <span className="text-blue-400 font-semibold">{user.registration_number || 'STUDENT'}</span>
                  )}
                </span>
              </div>

              {/* Avatar Pill */}
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20 hover:scale-105 transition-transform"
                title="Go to workspace"
              >
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </Link>

              <button
                onClick={logout}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors border border-transparent hover:border-red-900/50"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <a
                href="mailto:kp13226663@gmail.com?subject=Book%20a%20Demo%20-%20NexgenCode%20Platform&body=Hello%20NexgenCode%20Team%2C%0A%0AI%20would%20like%20to%20schedule%20a%20live%20institutional%20demo%20of%20NexgenCode%20for%20our%20college%2Funiversity.%0A%0AInstitution%20Name%3A%0AContact%20Person%3A%0APhone%20Number%3A%0AEstimated%20Students%3A%0APreferred%20Date%20%26%20Time%3A%0A%0AThank%20you!"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all hover:scale-105 shadow-sm"
                title="Schedule an Institutional Demo"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>Book Demo</span>
              </a>
              <Link
                href="/login"
                className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white lg:hidden rounded-xl bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-300">
            <Link
              href="/student/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between"
            >
              <span>Courses</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              href="/student/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between"
            >
              <span>Problems</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              href="/#labs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between"
            >
              <span>Semester Labs</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              href="/#exams"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between"
            >
              <span>Proctoring Shield</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              href="/student/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between text-amber-300"
            >
              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Leaderboard
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between"
            >
              <span>FAQ</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
            <a
              href="mailto:kp13226663@gmail.com?subject=Book%20a%20Demo%20-%20NexgenCode%20Platform&body=Hello%20NexgenCode%20Team%2C%0A%0AI%20would%20like%20to%20schedule%20a%20live%20institutional%20demo%20of%20NexgenCode%20for%20our%20college%2Funiversity.%0A%0AInstitution%20Name%3A%0AContact%20Person%3A%0APhone%20Number%3A%0AEstimated%20Students%3A%0APreferred%20Date%20%26%20Time%3A%0A%0AThank%20you!"
              className="w-full py-3 rounded-xl text-center text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4 text-amber-400" />
              <span>Book Demo (kp13226663@gmail.com)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
