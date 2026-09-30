'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { User, Mail, GraduationCap, Lock, CheckCircle2, ShieldAlert, ShieldCheck, Key } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { Skeleton } from '../../../components/LoadingSkeleton';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setMsg({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Password change failed. Please verify current password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 font-sans">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <PageHeader
        title="Student Profile &amp; Security"
        subtitle="Manage your academic credentials, verified institution records, and login authentication."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Account
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
          <div className="h-14 w-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            {profile?.full_name?.charAt(0) || 'S'}
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{profile?.full_name}</h3>
            <span className="text-xs font-mono text-slate-400 block">{profile?.email}</span>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Reg No:</span>
              <span className="font-bold text-white">{profile?.registration_number || '-'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Roll No:</span>
              <span className="font-bold text-white">{profile?.roll_number || '-'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Department:</span>
              <span className="font-bold text-white">{profile?.department || 'CS / Engineering'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Batch Year:</span>
              <span className="font-bold text-white">{profile?.batch_year || '-'}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Change Security Password</h3>
              <p className="text-[11px] text-slate-400">Ensure your account password is strong and updated regularly.</p>
            </div>
          </div>

          {msg.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                msg.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}
            >
              {msg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <ShieldAlert className="h-4 w-4 shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
