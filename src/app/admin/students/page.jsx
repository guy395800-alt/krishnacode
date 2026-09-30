'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import {
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Mail,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  Edit2,
  Users
} from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from '../../../components/LoadingSkeleton';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('');
  const [section, setSection] = useState('');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    registration_number: '',
    roll_number: '',
    department: 'CSE',
    batch: '2023-2027',
    section: 'A',
    year: 1
  });

  const [modalLoading, setModalLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState({ type: '', text: '' });

  // Edit Student Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [editModalLoading, setEditModalLoading] = useState(false);
  const [editModalMsg, setEditModalMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, [search, batch, section]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (batch) params.batch = batch;
      if (section) params.section = section;

      const resp = await api.get('/students', { params });
      setStudents(resp.data);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalMsg({ type: '', text: '' });

    try {
      const resp = await api.post('/students', form);
      const tempPass = resp.data?.temporary_password;
      const emailSent = resp.data?.email_sent;
      const msg = emailSent 
        ? `Student account created & credentials sent to ${form.email}!`
        : `Student created! Temp Password: ${tempPass} (Email delivery blocked by Render Free SMTP)`;
      setModalMsg({ type: 'success', text: msg });
      setTimeout(() => {
        setShowAddModal(false);
        fetchStudents();
        setForm({
          full_name: '', email: '', registration_number: '', roll_number: '',
          department: 'CSE', batch: '2023-2027', section: 'A', year: 1
        });
      }, emailSent ? 1500 : 4000);
    } catch (err) {
      setModalMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to create student.' });
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenEditModal = (student) => {
    setEditForm({
      id: student.id,
      full_name: student.full_name,
      email: student.email,
      registration_number: student.registration_number,
      roll_number: student.roll_number,
      department: student.department,
      batch: student.batch,
      section: student.section,
      year: student.year || 1,
      is_active: student.is_active
    });
    setEditModalMsg({ type: '', text: '' });
    setShowEditModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editForm) return;

    setEditModalLoading(true);
    setEditModalMsg({ type: '', text: '' });

    try {
      await api.put(`/students/${editForm.id}`, {
        full_name: editForm.full_name,
        email: editForm.email,
        registration_number: editForm.registration_number,
        roll_number: editForm.roll_number,
        department: editForm.department,
        batch: editForm.batch,
        section: editForm.section,
        year: Number(editForm.year),
        is_active: editForm.is_active
      });

      setEditModalMsg({ type: 'success', text: 'Student details updated successfully!' });
      setTimeout(() => {
        setShowEditModal(false);
        setEditForm(null);
        fetchStudents();
      }, 1000);
    } catch (err) {
      setEditModalMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update student details.' });
    } finally {
      setEditModalLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentActive) => {
    try {
      await api.patch(`/students/${id}/status?is_active=${!currentActive}`);
      fetchStudents();
    } catch (err) {
      alert('Failed to update student status');
    }
  };

  const handleResetPassword = async (id, name) => {
    if (!confirm(`Reset password for ${name}? A new temporary password will be generated.`)) return;
    try {
      const resp = await api.post(`/students/${id}/reset-password`);
      const tempPass = resp.data?.temporary_password;
      const emailSent = resp.data?.email_sent;
      alert(`Password reset for ${name}!\n\nTemporary Password: ${tempPass}\n\nEmail Status: ${emailSent ? 'Delivered via Email' : 'Email blocked by Render Free Tier SMTP restriction. Copy the temporary password above to share with the student.'}`);
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  const handleResendCredentials = async (id, email) => {
    try {
      const resp = await api.post(`/students/${id}/resend-email`);
      const tempPass = resp.data?.temporary_password;
      const emailSent = resp.data?.email_sent;
      alert(`Credentials regenerated for ${email}!\n\nTemporary Password: ${tempPass}\n\nEmail Status: ${emailSent ? 'Delivered via Email' : 'Email blocked by Render Free Tier SMTP restriction. Copy the temporary password above to share with the student.'}`);
    } catch (err) {
      alert('Failed to resend credentials');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete student account ${name}?`)) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const handleExportStudentsCSV = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://krishnacodebackend.onrender.com/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('nexgen_access_token') : null;
    const url = token ? `${apiBase}/analytics/export/students?token=${token}` : `${apiBase}/analytics/export/students`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <PageHeader
        title="Student Directory &amp; Roster"
        subtitle="Manage enrolled student accounts, batch cohorts, authentication credentials, and account activation."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            Total: {students.length} Accounts
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportStudentsCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Student Account</span>
            </button>
          </div>
        }
      />

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, reg no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div>
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="">All Batches</option>
            <option value="2023-2027">Batch 2023-2027</option>
            <option value="2022-2026">Batch 2022-2026</option>
          </select>
        </div>

        <div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} />
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Student Name</th>
                  <th className="px-5 py-3.5 font-semibold">Reg No / Roll</th>
                  <th className="px-5 py-3.5 font-semibold">Dept / Batch</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Score</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div>{st.full_name}</div>
                      <div className="text-[11px] font-mono font-normal text-slate-400">{st.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs">
                      <div className="font-bold text-white">{st.registration_number}</div>
                      <div className="text-slate-400">Roll: {st.roll_number}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300">
                      <div>{st.department}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{st.batch} ({st.section})</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(st.id, st.is_active)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          st.is_active
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-500/30 hover:bg-rose-900'
                        }`}
                      >
                        {st.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-400">
                      {st.score || 0} pts
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        className="p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-lg transition-colors border border-blue-500/20"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(st.id, st.full_name)}
                        className="p-1.5 text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-600 rounded-lg transition-colors border border-amber-500/20"
                        title="Reset Password"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleResendCredentials(st.id, st.email)}
                        className="p-1.5 text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-600 rounded-lg transition-colors border border-sky-500/20"
                        title="Resend Credentials"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(st.id, st.full_name)}
                        className="p-1.5 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg transition-colors border border-rose-500/20"
                        title="Delete Student"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No Students Found"
            description="No registered students match your active search and cohort filter criteria."
          />
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add New Student Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                modalMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {modalMsg.text}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Rahul Kumar"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Registration No</label>
                  <input
                    type="text" required value={form.registration_number}
                    onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                    placeholder="23A91A0501"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Roll Number</label>
                  <input
                    type="text" required value={form.roll_number}
                    onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                    placeholder="0501"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Department</label>
                  <input
                    type="text" required value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Batch</label>
                  <input
                    type="text" required value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Section</label>
                  <input
                    type="text" required value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={modalLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                {modalLoading ? 'Creating & Sending Credentials...' : 'Create Account & Send Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Student Details</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {editModalMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                editModalMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {editModalMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text" required value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email" required value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Registration No</label>
                  <input
                    type="text" required value={editForm.registration_number}
                    onChange={(e) => setEditForm({ ...editForm, registration_number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Roll Number</label>
                  <input
                    type="text" required value={editForm.roll_number}
                    onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Department</label>
                  <input
                    type="text" required value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Batch</label>
                  <input
                    type="text" required value={editForm.batch}
                    onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Section</label>
                  <input
                    type="text" required value={editForm.section}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Account Access Status</span>
                  <span className="text-[10px] text-slate-400">Controls whether student can log in</span>
                </div>
                <select
                  value={editForm.is_active ? 'active' : 'disabled'}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'active' })}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <button
                type="submit" disabled={editModalLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                {editModalLoading ? 'Saving Changes...' : 'Save Updated Student Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
