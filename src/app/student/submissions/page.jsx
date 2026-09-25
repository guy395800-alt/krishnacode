'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { History, CheckCircle2, XCircle, Code2, Eye, X, Terminal, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const resp = await api.get('/submissions');
      setSubmissions(resp.data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl apple-card border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <History className="h-4 w-4" /> Code Snapshot Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Submission History
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-normal">
            Complete record of your test assertions, execution timings, memory consumption, and source code snapshots.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl apple-card border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-mono">
            <div className="animate-pulse">Loading submission ledger...</div>
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-white/10 font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-4">Problem</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Runtime</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">View Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white tracking-tight">
                      {sub.problem_title}
                    </td>
                    <td className="px-6 py-4 uppercase font-mono font-bold text-xs text-blue-400">
                      {sub.language}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                        sub.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {sub.status === 'Accepted' ? '✓ Accepted' : '✗ Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {sub.score} pts
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {sub.execution_time_ms} ms
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-2.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-xl transition-all border border-blue-500/20"
                        title="View Code Snapshot"
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
          <div className="p-16 text-center text-slate-400">No submissions recorded yet</div>
        )}
      </div>

      {/* Code Viewer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl apple-card bg-slate-950 rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white">{selectedSub.problem_title}</h3>
                  <span className="text-xs text-slate-400 uppercase font-mono">
                    {selectedSub.language} • {selectedSub.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-hidden min-h-[350px] bg-slate-950">
              <MonacoEditor
                height="100%"
                language={selectedSub.language === 'python' ? 'python' : 'cpp'}
                theme="vs-dark"
                value={selectedSub.code}
                options={{
                  readOnly: true,
                  fontSize: 13,
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
                  minimap: { enabled: false }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
