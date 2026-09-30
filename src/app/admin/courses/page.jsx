'use client';

import React, { useState, useEffect } from 'react';
import { getCourses, saveCourse, deleteCourse } from '../../../lib/coursesStore';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Search,
  UploadCloud,
  GraduationCap
} from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { EmptyState } from '../../../components/EmptyState';
import { StatusBadge } from '../../../components/StatusBadge';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [instructorRole, setInstructorRole] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [category, setCategory] = useState('Data Structures');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('8 Weeks (40 Hours)');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60');
  const [tagsInput, setTagsInput] = useState('DSA, Python, Algorithms');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setCourses(getCourses());
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setTitle(course.title);
      setInstructor(course.instructor);
      setInstructorRole(course.instructorRole);
      setDepartment(course.department);
      setCategory(course.category);
      setDifficulty(course.difficulty);
      setDuration(course.duration);
      setThumbnail(course.thumbnail);
      setTagsInput(course.tags ? course.tags.join(', ') : '');
      setDescription(course.description);
      setIsPublished(course.isPublished);
    } else {
      setEditingCourse(null);
      setTitle('');
      setInstructor('Prof. Arvind Sharma');
      setInstructorRole('Senior Faculty');
      setDepartment('Computer Science & Engineering');
      setCategory('Data Structures');
      setDifficulty('Intermediate');
      setDuration('8 Weeks (40 Hours)');
      setThumbnail('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60');
      setTagsInput('DSA, Python, Algorithms');
      setDescription('');
      setIsPublished(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      ...(editingCourse ? { id: editingCourse.id } : {}),
      title,
      instructor,
      instructorRole,
      department,
      category,
      difficulty,
      duration,
      thumbnail,
      tags,
      description,
      isPublished
    };

    saveCourse(payload);
    setIsModalOpen(false);
    loadCourses();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this course? Students will no longer see it.')) {
      deleteCourse(id);
      loadCourses();
    }
  };

  const togglePublish = (course) => {
    saveCourse({ ...course, isPublished: !course.isPublished });
    loadCourses();
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans animate-reveal-fade">
      <PageHeader
        title="Course Management"
        subtitle="Upload institutional courses, configure structured syllabuses, manage student enrollment tracks, and publish labs."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" /> Total Courses: {courses.length}
          </span>
        }
        actions={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all interactive-btn"
          >
            <Plus className="h-4 w-4" /> Create Course
          </button>
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Active Catalog: <strong className="text-white">{courses.length}</strong></span>
          <span>•</span>
          <span>Published: <strong className="text-emerald-400">{courses.filter((c) => c.isPublished).length}</strong></span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors font-medium"
          />
        </div>
      </div>

      {/* Courses List Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-4">Course Info</th>
                  <th className="px-6 py-4">Faculty</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail}
                          alt=""
                          className="h-10 w-14 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-950"
                        />
                        <div>
                          <div className="font-bold text-white tracking-tight line-clamp-1">{c.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.difficulty} • {c.modules?.length || 0} Modules</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-white">{c.instructor}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {c.duration}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(c)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          c.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {c.isPublished ? (
                          <>
                            <Eye className="h-3 w-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors interactive-btn"
                          title="Edit Course"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors interactive-btn"
                          title="Delete Course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Courses Found"
            description="Create your first academic syllabus pathway using the button above."
          />
        )}
      </div>

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto modal-backdrop-anim">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8 modal-content-anim">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <UploadCloud className="h-4 w-4 text-blue-400" />
                {editingCourse ? 'Edit Academic Course' : 'Create Academic Course'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-medium max-h-[75vh] overflow-y-auto font-sans">
              <div>
                <label className="block text-slate-400 uppercase mb-1 font-sans">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms Masterclass"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Instructor Name *</label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Instructor Role / Title</label>
                  <input
                    type="text"
                    value={instructorRole}
                    onChange={(e) => setInstructorRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Systems">Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 10 Weeks (50 Hours)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1 font-sans">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1 font-sans">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="DSA, Python, Graphs, Algorithms"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1 font-sans">Course Description &amp; Outcomes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of syllabus topics covered and target student learning outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-sans text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="pub-check" className="text-slate-300 font-medium">
                  Publish immediately (Visible to students in their portal)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all interactive-btn"
                >
                  {editingCourse ? 'Save Changes' : 'Upload Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
