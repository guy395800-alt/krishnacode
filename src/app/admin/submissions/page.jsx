'use client';

import React, { useState, useEffect } from 'react';
import { api, getExportUrl } from '../../../lib/api';
import { History, FileSpreadsheet, Eye, X, Activity, RefreshCw, Filter, CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PageHeader } from '../../../components/PageHeader';
import { StatCard } from '../../../components/StatCard';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

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

    // 3-second live polling interval
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
      setSubmissions(resp.data || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch live submissions', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter !== 'All' && sub.status !== statusFilter) return false;
    if (languageFilter !== 'All' && sub.language?.toLowerCase() !== languageFilter.toLowerCase()) return false;
    return true;
  });

  const totalAccepted = submissions.filter((s) => s.status === 'Accepted').length;
  const totalRejected = Math.max(0, submissions.length - totalAccepted);

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Live Submission Stream"
        subtitle="Real-time compiler telemetry, student code executions, assertion logs, and execution times."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Live Stream Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                autoRefresh
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Live (3s)' : 'Paused'}</span>
            </button>
            <a
              href={getExportUrl('submissions')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </a>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Submissions"
          value={submissions.length}
          subtext="Processed by compiler engines"
          icon={Activity}
          variant="blue"
        />
        <StatCard
          label="Accepted"
          value={totalAccepted}
          subtext="100% test cases passed"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          label="Rejected / Errors"
          value={totalRejected}
          subtext="Failed assertions or errors"
          icon={XCircle}
          variant="slate"
        />
        <StatCard
          label="Last Stream Tick"
          value={lastUpdated || '--:--:--'}
          subtext="Real-time polling state"
          icon={Clock}
          variant="cyan"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase font-mono">
          <Filter className="h-3.5 w-3.5" /> Filters:
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
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
          className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
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
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading && submissions.length === 0 ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">ID</th>
                  <th className="px-5 py-3.5 font-semibold">Problem</th>
                  <th className="px-5 py-3.5 font-semibold">Language</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Passed Cases</th>
                  <th className="px-5 py-3.5 font-semibold">Runtime</th>
                  <th className="px-5 py-3.5 font-semibold">Timestamp</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">
                      #{sub.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {sub.problem_title}
                    </td>
                    <td className="px-5 py-3.5 uppercase font-mono font-bold text-slate-400">
                      {sub.language}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-200">
                      {sub.passed_test_cases || 0} / {sub.total_test_cases || 0}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {sub.execution_time_ms} ms
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(sub.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-lg transition-colors border border-blue-500/20"
                        title="Inspect Code"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="No Submissions Streamed"
            description="Waiting for student submissions. Submissions appear here automatically in real time."
          />
        )}
      </div>

      {/* Code Viewer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedSub.problem_title}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Student #{selectedSub.student_id} • {selectedSub.language?.toUpperCase()} • {selectedSub.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 p-2 min-h-[350px] bg-slate-950">
              <MonacoEditor
                height="350px"
                language={selectedSub.language === 'cpp' || selectedSub.language === 'c' ? 'cpp' : selectedSub.language}
                theme="vs-dark"
                value={selectedSub.code || '// No source code recorded'}
                options={{
                  readOnly: true,
                  fontFamily: 'Menlo, Monaco, Consolas, "Courier New", "Ubuntu Mono", "JetBrains Mono", monospace',
                  fontSize: 13.5,
                  lineHeight: 22,
                  minimap: { enabled: false },
                  automaticLayout: true
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
