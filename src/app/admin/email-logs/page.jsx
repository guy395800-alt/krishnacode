'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Mail, CheckCircle2, AlertTriangle, RefreshCw, Send, Radio } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

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
      setLogs(resp.data || []);
    } catch (err) {
      console.error('Failed to load email logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans animate-reveal-fade">
      <PageHeader
        title="Email Delivery Logs"
        subtitle="System notification delivery status, student credential dispatch logs, and SMTP diagnostic traces."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> Live SMTP Queue
          </span>
        }
        actions={
          <button
            onClick={fetchEmailLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700/80 text-white hover:bg-slate-800 transition-all interactive-btn disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
          </button>
        }
      />

      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Email Type</th>
                  <th className="px-6 py-4">Sent Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Diagnostic Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {log.recipient}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold font-mono">
                        {log.email_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {new Date(log.sent_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                        log.delivery_status.includes('Sent')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.delivery_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400 max-w-xs truncate">
                      {log.error_message || log.payload || 'OK'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Mail}
            title="No Email Logs Recorded"
            description="All automated credential deliveries, reset instructions, and institutional notifications will appear in this audit log."
          />
        )}
      </div>
    </div>
  );
}
