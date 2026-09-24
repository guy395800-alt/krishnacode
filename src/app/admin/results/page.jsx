'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { FileCheck2, FileSpreadsheet, Trophy } from 'lucide-react';

export default function AdminResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchResults(selectedExamId);
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      const resp = await api.get('/exams');
      setExams(resp.data);
      if (resp.data.length > 0) {
        setSelectedExamId(String(resp.data[0].id));
      }
    } catch (err) {
      console.error('Failed to load exams', err);
    }
  };

  const fetchResults = async (examId) => {
    setLoading(true);
    try {
      const resp = await api.get(`/exams/${examId}/results`);
      setResultsData(resp.data);
    } catch (err) {
      console.error('Failed to load exam results', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Exam Results & Grading
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Student score reports, percentage distribution, and test case pass rates
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <label className="text-xs font-bold uppercase text-slate-500">Select Exam:</label>
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.status})
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Calculating exam results...</div>
        ) : resultsData?.results?.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Reg No</th>
                <th className="px-6 py-4">Batch / Sec</th>
                <th className="px-6 py-4">Total Score</th>
                <th className="px-6 py-4">Percentage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submission Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {resultsData.results.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {res.student_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{res.registration_number}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{res.batch} ({res.section})</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{res.total_score}/{resultsData.total_marks}</td>
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{res.percentage}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      res.percentage >= 40 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {res.percentage >= 40 ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {res.end_time ? new Date(res.end_time).toLocaleTimeString() : 'In Progress'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">No submission results for this exam yet</div>
        )}
      </div>
    </div>
  );
}
