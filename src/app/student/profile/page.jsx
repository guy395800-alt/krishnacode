'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { User, Mail, GraduationCap, Lock, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const resp = await api.get('/students/me');
      setProfile(resp.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Password change failed' });
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 apple-card rounded-3xl">
        <div className="animate-pulse">Loading student profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <User className="h-4 w-4" /> Student Credentials & Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Account Profile & Security
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-normal">
            Personal identity credentials, registered college department, and account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details Card */}
        <div className="p-7 rounded-3xl apple-card border border-white/10 shadow-xl space-y-5">
          <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto shadow-lg shadow-blue-500/20">
            {profile?.full_name?.charAt(0) || 'S'}
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white tracking-tight">{profile?.full_name}</h3>
            <span className="text-xs font-mono text-slate-400 block">{profile?.email}</span>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Reg No:</span>
              <span className="font-bold text-white">{profile?.registration_number}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Roll No:</span>
              <span className="font-bold text-white">{profile?.roll_number}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Dept:</span>
              <span className="font-bold text-blue-400">{profile?.department}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Batch / Sec:</span>
              <span className="font-bold text-white">{profile?.batch} ({profile?.section})</span>
            </div>
          </div>
        </div>

        {/* Password Security Form */}
        <div className="md:col-span-2 p-7 rounded-3xl apple-card border border-white/10 shadow-xl space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <Lock className="h-5 w-5 text-blue-400" /> Security & Password
          </h3>

          {msg.text && (
            <div className={`p-4 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/60 text-red-300 border border-red-500/40'
            }`}>
              {msg.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <ShieldAlert className="h-4 w-4 text-red-400" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-8 rounded-2xl font-bold text-white apple-btn-primary shadow-lg shadow-blue-500/25 transition-all"
            >
              Update Security Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
