'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { History, CheckCircle2, XCircle, Code2, Eye, X } from 'lucide-react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Submission History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all your code submission attempts, test case scores, and code snapshots
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading submissions...</div>
        ) : submissions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Execution Time</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4 text-right">View Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
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
                    {sub.score} pts
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {sub.execution_time_ms} ms
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                      title="View Code"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No submissions recorded yet</div>
        )}
      </div>

      {/* Code Viewer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Code2 className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white">{selectedSub.problem_title}</h3>
                  <span className="text-xs text-slate-400 uppercase font-mono">
                    {selectedSub.language} • {selectedSub.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-hidden min-h-[350px]">
              <MonacoEditor
                height="100%"
                language={selectedSub.language === 'python' ? 'python' : 'cpp'}
                theme="vs-dark"
                value={selectedSub.code}
                options={{
                  readOnly: true,
                  fontSize: 13,
                  fontFamily: 'Fira Code, monospace',
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
