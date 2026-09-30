'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { History, CheckCircle2, XCircle, Code2, Eye, X, Terminal, Clock, Copy, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const resp = await api.get('/submissions');
      setSubmissions(resp.data || []);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (selectedSub?.code) {
      navigator.clipboard.writeText(selectedSub.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Submission History"
        subtitle="Auditable record of all test assertions, compiler logs, runtime metrics, and source code snapshots."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <History className="h-3.5 w-3.5" /> Immutable Code Ledger
          </span>
        }
      />

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Problem</th>
                  <th className="px-5 py-3.5 font-semibold">Language</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Score</th>
                  <th className="px-5 py-3.5 font-semibold">Runtime</th>
                  <th className="px-5 py-3.5 font-semibold">Timestamp</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Snapshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {sub.problem_title}
                    </td>
                    <td className="px-5 py-3.5 uppercase font-mono font-bold text-slate-400">
                      {sub.language}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {sub.score || 0} pts
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {sub.execution_time_ms} ms
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-2 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-lg transition-all border border-blue-500/20"
                        title="View Source Code"
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
            title="No Submissions Recorded"
            description="You haven't submitted any solutions yet. Solve problems in the practice arena to populate your history."
            actionLabel="Start Practicing"
            actionHref="/student/problems"
          />
        )}
      </div>

      {/* Code Snapshot Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedSub.problem_title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="uppercase">{selectedSub.language}</span>
                    <span>•</span>
                    <span>{selectedSub.execution_time_ms} ms</span>
                    <span>•</span>
                    <StatusBadge status={selectedSub.status} size="sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-2 bg-slate-950 min-h-[350px]">
              <MonacoEditor
                height="350px"
                language={selectedSub.language === 'cpp' || selectedSub.language === 'c' ? 'cpp' : selectedSub.language}
                value={selectedSub.code || '// No source code recorded'}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
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
