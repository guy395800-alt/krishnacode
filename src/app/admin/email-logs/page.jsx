'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Mail, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminEmailLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const fetchEmailLogs = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/email-logs');
      setLogs(resp.data);
    } catch (err) {
      console.error('Failed to load email logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Email Delivery Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            System notification delivery status, student credential dispatch logs, and SMTP diagnostic traces
          </p>
        </div>

        <button
          onClick={fetchEmailLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Logs
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading email logs...</div>
        ) : logs.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Email Type</th>
                <th className="px-6 py-4">Sent Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Diagnostic Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {log.recipient}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {log.email_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {new Date(log.sent_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      log.delivery_status.includes('Sent')
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    }`}>
                      {log.delivery_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500 max-w-xs truncate">
                    {log.error_message || log.payload || 'OK'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No email logs recorded</div>
        )}
      </div>
    </div>
  );
}
