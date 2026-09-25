'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, Code2, Sparkles, Trophy, GraduationCap, ShieldCheck, Flame } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl transition-all">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Code2 className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white font-mono flex items-center gap-1">
                KRISHNA<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">CODE</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1 flex items-center gap-1">
                Assessment Platform <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <Link
              href="/student/problems"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              Problems
            </Link>
            <Link
              href="/student/exams"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              Exams
            </Link>
            <Link
              href="/student/leaderboard"
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors flex items-center gap-1"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" /> Leaderboard
            </Link>
          </nav>
        </div>

        {/* Right Section: Status Indicator, Theme, & User Profile */}
        <div className="flex items-center gap-3">
          {/* Live Engine Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sandbox Live</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all border border-transparent hover:border-slate-700/50"
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
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>

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
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login?role=student"
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
