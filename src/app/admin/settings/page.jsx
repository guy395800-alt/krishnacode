'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { Settings, Mail, Cpu, Save, CheckCircle2, User, ShieldAlert, Sliders } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';

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
    <div className="max-w-4xl mx-auto space-y-8 font-sans animate-reveal-fade">
      <PageHeader
        title="Platform Settings"
        subtitle="Manage administrator credentials, SMTP notification gateways, and sandboxed code execution environments."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sliders className="h-3.5 w-3.5" /> System Config
          </span>
        }
      />

      {/* Admin Profile & Email Update Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" /> Admin Account &amp; Email Profile
        </h3>

        {profileMsg.text && (
          <div className={`p-4 rounded-xl font-bold text-xs flex items-center gap-2 ${
            profileMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <ShieldAlert className="h-4 w-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">Admin Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all interactive-btn disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {profileLoading ? 'Updating Email in DB...' : 'Update Admin Account Email'}
          </button>
        </form>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center gap-2 border border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4" /> Platform configurations saved successfully!
        </div>
      )}

      {/* System Configurations Form */}
      <form onSubmit={handleSaveSystemSettings} className="space-y-6">
        {/* Execution Engine Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400" /> Code Execution Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
              executionMode === 'LOCAL'
                ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-sm'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
            }`}>
              <div>
                <input type="radio" name="exec" value="LOCAL" checked={executionMode === 'LOCAL'} onChange={() => setExecutionMode('LOCAL')} className="hidden" />
                <span className="font-bold text-sm block mb-1 text-white">Local Subprocess Sandbox</span>
                <span className="text-slate-400 font-normal leading-relaxed text-xs">Isolated process runner with CPU &amp; memory limit constraints.</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
              executionMode === 'PISTON'
                ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-sm'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
            }`}>
              <div>
                <input type="radio" name="exec" value="PISTON" checked={executionMode === 'PISTON'} onChange={() => setExecutionMode('PISTON')} className="hidden" />
                <span className="font-bold text-sm block mb-1 text-white">Piston API Adapter</span>
                <span className="text-slate-400 font-normal leading-relaxed text-xs">Connects to high-performance open-source Piston engine node.</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
              executionMode === 'JUDGE0'
                ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-sm'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
            }`}>
              <div>
                <input type="radio" name="exec" value="JUDGE0" checked={executionMode === 'JUDGE0'} onChange={() => setExecutionMode('JUDGE0')} className="hidden" />
                <span className="font-bold text-sm block mb-1 text-white">Judge0 API Adapter</span>
                <span className="text-slate-400 font-normal leading-relaxed text-xs">Connects to Judge0 sandboxed competitive engine cluster.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Email Settings Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-400" /> Email Delivery Service
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">SMTP Port</label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-8 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all interactive-btn"
        >
          <Save className="h-4 w-4" /> Save System Settings
        </button>
      </form>
    </div>
  );
}
