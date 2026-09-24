'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Code2, Lock, Mail, ShieldAlert, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') setRole('admin');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.requires_password_change) {
        router.push('/change-password');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.requires_password_change) {
        router.push('/change-password');
      } else if (loggedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-2">
          <Code2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome Back to NEXGEN CODE
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in to access your coding environment & exams
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => { setRole('student'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-colors ${
            role === 'student'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Student Portal
        </button>

        <button
          type="button"
          onClick={() => { setRole('admin'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-colors ${
            role === 'admin'
              ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Admin Portal
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : `Sign In to ${role === 'admin' ? 'Admin' : 'Student'} Portal`}
          {!loading && <ArrowRight className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <Suspense fallback={<div className="text-center text-slate-400">Loading sign in page...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
