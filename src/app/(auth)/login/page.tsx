'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { GoogleSignInButton } from '../../../components/GoogleSignInButton';
import { Code2, Lock, Mail, ShieldAlert, ArrowRight, Sparkles, UserCheck, Shield } from 'lucide-react';
import { UserRole } from '../../../types/auth';

function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (accountRole: UserRole) => {
    setSelectedRole(accountRole);
    if (accountRole === 'admin') {
      setEmail('admin@nexgencode.com');
      setPassword('Admin@1234');
    } else {
      setEmail('student@nexgencode.edu');
      setPassword('Student@1234');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-2xl space-y-6 backdrop-blur-2xl relative overflow-hidden">
      {/* Decorative Glow Top Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-b-full shadow-lg shadow-blue-500/50" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-1">
          <Code2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
          Nexgen<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Code</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Sign in to access your unified coding workspace & assessments
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 font-medium">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Google One-Click Sign In Section */}
      <div className="space-y-3">
        <GoogleSignInButton
          label="Sign in with Google"
          role={selectedRole}
          onSuccess={() => {
            console.log('Google Sign in successful');
          }}
        />

        {/* Divider with Text */}
        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 shrink-0">
            or continue with credentials
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>
      </div>

      {/* Unified Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-sans">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu or admin@nexgencode.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase text-slate-400 font-sans">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-blue-400 hover:underline font-sans">
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium transition-all font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-sans"
        >
          {loading ? 'Signing In...' : 'Sign In with Email'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      {/* Quick Demo Test Fill Options */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block text-center">
          ⚡ Quick Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillQuickAccount('student')}
            className="py-1.5 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Student Demo</span>
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('admin')}
            className="py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Demo</span>
          </button>
        </div>
      </div>
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
