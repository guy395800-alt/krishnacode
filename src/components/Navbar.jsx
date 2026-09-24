import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User, Code2, ShieldAlert, BookOpen } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent font-mono">
              NEXGEN<span className="text-slate-900 dark:text-white ml-1">CODE</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
              Coding & Exam Platform
            </span>
          </div>
        </Link>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {user.full_name}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                  {user.role === 'admin' ? (
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">ADMIN</span>
                  ) : (
                    <span>{user.registration_number || user.email}</span>
                  )}
                </span>
              </div>

              <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>

              <button
                onClick={logout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
