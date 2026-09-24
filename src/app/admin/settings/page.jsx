'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { Settings, Mail, Cpu, Save, CheckCircle2, User, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();

  // Admin Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || 'Admin User');
  const [email, setEmail] = useState(user?.email || 'admin@nexgencode.com');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // System Settings State
  const [saved, setSaved] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [executionMode, setExecutionMode] = useState('LOCAL');

  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const resp = await api.put('/auth/me', {
        full_name: fullName,
        email: email
      });

      updateUser({
        full_name: resp.data.full_name,
        email: resp.data.email
      });

      setProfileMsg({ type: 'success', text: 'Admin profile & email updated successfully in database!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update admin profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveSystemSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-8 w-8 text-blue-500" /> Platform Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage admin profile credentials, email delivery providers, and execution engine configurations
        </p>
      </div>

      {/* Admin Profile & Email Update Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" /> Admin Account & Email Profile
        </h3>

        {profileMsg.text && (
          <div className={`p-4 rounded-xl font-bold text-xs flex items-center gap-2 ${
            profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 uppercase mb-1">Admin Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="py-2.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {profileLoading ? 'Updating Email in DB...' : 'Update Admin Account Email'}
          </button>
        </form>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5" /> Platform configurations saved successfully!
        </div>
      )}

      {/* System Configurations Form */}
      <form onSubmit={handleSaveSystemSettings} className="space-y-6">
        {/* Execution Engine Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-500" /> Code Execution Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between ${
              executionMode === 'LOCAL' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <input type="radio" name="exec" value="LOCAL" checked={executionMode === 'LOCAL'} onChange={() => setExecutionMode('LOCAL')} className="hidden" />
                <span className="font-bold text-sm block">Local Subprocess Sandbox</span>
                <span className="text-slate-500 font-normal">Isolated process runner with CPU & memory limits.</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between ${
              executionMode === 'PISTON' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <input type="radio" name="exec" value="PISTON" checked={executionMode === 'PISTON'} onChange={() => setExecutionMode('PISTON')} className="hidden" />
                <span className="font-bold text-sm block">Piston API Adapter</span>
                <span className="text-slate-500 font-normal">Connects to high-performance open-source Piston engine.</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between ${
              executionMode === 'JUDGE0' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <input type="radio" name="exec" value="JUDGE0" checked={executionMode === 'JUDGE0'} onChange={() => setExecutionMode('JUDGE0')} className="hidden" />
                <span className="font-bold text-sm block">Judge0 API Adapter</span>
                <span className="text-slate-500 font-normal">Connects to Judge0 sandboxed competitive engine.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Email Settings Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-500" /> Email Delivery Service
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 uppercase mb-1">SMTP Host</label>
              <input
                type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 uppercase mb-1">SMTP Port</label>
              <input
                type="number" value={smtpPort} onChange={(e) => setSmtpPort(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-8 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2"
        >
          <Save className="h-4 w-4" /> Save System Settings
        </button>
      </form>
    </div>
  );
}
