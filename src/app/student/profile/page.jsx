'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { User, Mail, GraduationCap, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

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
    return <div className="p-12 text-center text-slate-400">Loading student profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Student Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personal account details, academic information, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto">
            {profile?.full_name?.charAt(0)}
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.full_name}</h3>
            <span className="text-xs font-mono text-slate-500">{profile?.email}</span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Reg Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{profile?.registration_number}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Roll Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{profile?.roll_number}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Department</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Batch & Section</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.batch} ({profile?.section})</span>
            </div>
          </div>
        </div>

        {/* Password Security Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" /> Security & Password
          </h3>

          {msg.text && (
            <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {msg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 uppercase mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
            >
              Update Security Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
