'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { CheckSquare, Plus, Trash2, Eye, EyeOff, ShieldCheck, Binary } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { CardSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminTestCasesPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProbId, setSelectedProbId] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form
  const [inputData, setInputData] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [points, setPoints] = useState(5);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProbId) {
      fetchTestCases(selectedProbId);
    }
  }, [selectedProbId]);

  const fetchProblems = async () => {
    try {
      const resp = await api.get('/problems');
      setProblems(resp.data || []);
      if (resp.data && resp.data.length > 0) {
        setSelectedProbId(String(resp.data[0].id));
      }
    } catch (err) {
      console.error('Failed to load problems', err);
    }
  };

  const fetchTestCases = async (probId) => {
    setLoading(true);
    try {
      const resp = await api.get(`/problems/${probId}`);
      setTestCases(resp.data.test_cases || []);
    } catch (err) {
      console.error('Failed to load test cases', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!selectedProbId) return;

    try {
      await api.post(`/problems/${selectedProbId}/test-cases`, {
        input_data: inputData,
        expected_output: expectedOutput,
        is_public: isPublic,
        points: Number(points),
        weight: 1.0
      });
      setInputData('');
      setExpectedOutput('');
      fetchTestCases(selectedProbId);
    } catch (err) {
      alert('Failed to add test case');
    }
  };

  const handleDeleteTestCase = async (tcId) => {
    if (!confirm('Delete this test case?')) return;
    try {
      await api.delete(`/problems/test-cases/${tcId}`);
      fetchTestCases(selectedProbId);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-8 font-sans animate-reveal-fade">
      <PageHeader
        title="Test Case Management"
        subtitle="Configure public example test cases and server-isolated hidden validation suites for automated grading."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Binary className="h-3.5 w-3.5" /> Validation Suite
          </span>
        }
      />

      {/* Select Problem */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex flex-wrap items-center gap-4">
        <label className="text-xs font-bold uppercase text-slate-400 font-sans">Select Target Problem:</label>
        <select
          value={selectedProbId}
          onChange={(e) => setSelectedProbId(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 font-bold text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          {problems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.difficulty})
            </option>
          ))}
        </select>
      </div>

      {/* Grid: Add Form + Test Case List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-400" /> Add Test Case
          </h3>

          <form onSubmit={handleAddTestCase} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">Input STDIN</label>
              <textarea
                required
                rows={3}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="4 9&#10;2 7 11 15"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-1.5 font-sans">Expected Output STDOUT</label>
              <textarea
                required
                rows={3}
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="0 1"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white block text-xs">Public Example</span>
                <span className="text-[10px] text-slate-400 font-normal">If enabled, visible on student problem view</span>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all interactive-btn"
            >
              Add Test Case
            </button>
          </form>
        </div>

        {/* Existing Test Cases */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              Configured Test Cases
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">
              {testCases.length} Cases Loaded
            </span>
          </div>

          {loading ? (
            <CardSkeleton count={2} />
          ) : testCases.length > 0 ? (
            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={tc.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2 font-mono">
                      Test Case #{idx + 1}
                      {tc.is_public ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[10px] flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px] flex items-center gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden (Server Isolated)
                        </span>
                      )}
                    </span>

                    <button
                      onClick={() => handleDeleteTestCase(tc.id)}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Test Case"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <div><span className="text-slate-500">Input:</span> <span className="text-slate-300">{tc.input_data}</span></div>
                    <div><span className="text-slate-500">Expected Output:</span> <span className="text-emerald-400 font-bold">{tc.expected_output}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Binary}
              title="No Test Cases Configured"
              description="Create public examples and server-isolated test cases using the form on the left."
            />
          )}
        </div>
      </div>
    </div>
  );
}
