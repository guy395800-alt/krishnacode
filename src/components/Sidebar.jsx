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
  CheckSquare
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Problems', href: '/student/problems', icon: Code2 },
    { label: 'Exams', href: '/student/exams', icon: GraduationCap },
    { label: 'Submissions', href: '/student/submissions', icon: History },
    { label: 'Progress', href: '/student/progress', icon: TrendingUp },
    { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
    { label: 'Profile', href: '/student/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Problems', href: '/admin/problems', icon: Code2 },
    { label: 'Test Cases', href: '/admin/test-cases', icon: CheckSquare },
    { label: 'Exams', href: '/admin/exams', icon: GraduationCap },
    { label: 'Submissions', href: '/admin/submissions', icon: History },
    { label: 'Results', href: '/admin/results', icon: FileCheck2 },
    { label: 'Leaderboard', href: '/admin/leaderboard', icon: Trophy },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Email Logs', href: '/admin/email-logs', icon: Mail },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-4 px-3 py-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
        {user.role === 'admin' ? (
          <ShieldCheck className="h-5 w-5 text-amber-500" />
        ) : (
          <GraduationCap className="h-5 w-5 text-blue-500" />
        )}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Portal
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
            {user.role} Workspace
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
