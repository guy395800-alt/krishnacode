'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { CheckSquare, Plus, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

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
      setProblems(resp.data);
      if (resp.data.length > 0) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Test Case Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure public example test cases and server-isolated hidden test cases
        </p>
      </div>

      {/* Select Problem */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <label className="text-xs font-bold uppercase text-slate-500">Select Problem:</label>
        <select
          value={selectedProbId}
          onChange={(e) => setSelectedProbId(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
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
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" /> Add Test Case
          </h3>

          <form onSubmit={handleAddTestCase} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 uppercase mb-1">Input STDIN</label>
              <textarea
                required rows={3} value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="4 9&#10;2 7 11 15"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase mb-1">Expected Output STDOUT</label>
              <textarea
                required rows={3} value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="0 1"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Public Example</span>
                <span className="text-[10px] text-slate-400">If enabled, visible on student problem page</span>
              </div>
              <input
                type="checkbox" checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
            >
              Add Test Case
            </button>
          </form>
        </div>

        {/* Existing Test Cases */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Configured Test Cases ({testCases.length})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading test cases...</div>
          ) : testCases.length > 0 ? (
            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={tc.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Test Case #{idx + 1}
                      {tc.is_public ? (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden (Server Isolated)
                        </span>
                      )}
                    </span>

                    <button onClick={() => handleDeleteTestCase(tc.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div><span className="text-slate-400">Input:</span> <code className="font-mono text-slate-900 dark:text-white">{tc.input_data}</code></div>
                  <div><span className="text-slate-400">Expected Output:</span> <code className="font-mono text-emerald-600">{tc.expected_output}</code></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">No test cases configured for this problem yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
