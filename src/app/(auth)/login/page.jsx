'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Code2, Lock, Mail, ShieldAlert, GraduationCap, ShieldCheck, ArrowRight, Sparkles, Key } from 'lucide-react';

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
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-2xl space-y-6 backdrop-blur-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-b-full shadow-lg shadow-blue-500/50" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-1">
          <Code2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Nexgen<span className="text-blue-400">Code</span>
        </h2>
        <p className="text-xs text-slate-400">
          Sign in to access your secure coding workspace & assessments
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => { setRole('student'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            role === 'student'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Student Portal
        </button>

        <button
          type="button"
          onClick={() => { setRole('admin'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            role === 'admin'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Admin Portal
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 font-medium">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@nexgencode.com' : 'student@nexgencode.com'}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase text-slate-400">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 ${
            role === 'admin'
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-blue-500/25'
          }`}
        >
          {loading ? 'Authenticating...' : `Sign In to ${role === 'admin' ? 'Admin' : 'Student'} Workspace`}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center text-slate-400">Loading sign in page...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
