'use client';

import React, { useState, useEffect } from 'react';
import { api, getExportUrl } from '../../../lib/api';
import { History, FileSpreadsheet, Eye, X, Activity, RefreshCw, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  
  // Live Tracking States
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');

  useEffect(() => {
    fetchSubmissions();

    // Setup 3-second live polling interval for real-time submission tracking
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchSubmissions(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchSubmissions = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const resp = await api.get('/submissions');
      setSubmissions(resp.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch live submissions', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter !== 'All' && sub.status !== statusFilter) return false;
    if (languageFilter !== 'All' && sub.language.toLowerCase() !== languageFilter.toLowerCase()) return false;
    return true;
  });

  const totalAccepted = submissions.filter((s) => s.status === 'Accepted').length;
  const totalRejected = Math.max(0, submissions.length - totalAccepted);

  return (
    <div className="space-y-6">
      {/* Live Stream Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" /> Live Submission Tracker
            </h1>

            {autoRefresh && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span> Live Stream Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time monitoring of student code execution, pass rates, and submission streams
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              autoRefresh
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-Refresh ON (3s)' : 'Auto-Refresh OFF'}
          </button>

          <a
            href={getExportUrl('submissions')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export CSV
          </a>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Submissions</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{submissions.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Accepted</span>
          <div className="text-2xl font-black text-emerald-500">{totalAccepted}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Rejected / Errors</span>
          <div className="text-2xl font-black text-red-500">{totalRejected}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Last Polled</span>
          <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">{lastUpdated || '--:--:--'}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
          <Filter className="h-4 w-4" /> Live Filters:
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Compilation Error">Compilation Error</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
        </select>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
        >
          <option value="All">All Languages</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* Live Stream Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Connecting to live submission stream...</div>
        ) : filteredSubmissions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Submission ID</th>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Passed Test Cases</th>
                <th className="px-6 py-4">Execution Time</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4 text-right">Source Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-slate-400">
                    #{sub.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {sub.problem_title}
                  </td>
                  <td className="px-6 py-4 uppercase font-mono font-bold text-xs text-slate-500">
                    {sub.language}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      sub.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {sub.passed_test_cases} / {sub.total_test_cases}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {sub.execution_time_ms} ms
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(sub.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                      title="Inspect Student Code"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No submissions matching active filter</div>
        )}
      </div>

      {/* Code Viewer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white">{selectedSub.problem_title}</h3>
                <span className="text-xs text-slate-400 uppercase font-mono">
                  Submitted by Student #{selectedSub.student_id} • {selectedSub.language} • {selectedSub.status}
                </span>
              </div>
              <button onClick={() => setSelectedSub(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 p-4 min-h-[350px]">
              <MonacoEditor
                height="100%"
                language={selectedSub.language === 'python' ? 'python' : 'cpp'}
                theme="vs-dark"
                value={selectedSub.code}
                options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
