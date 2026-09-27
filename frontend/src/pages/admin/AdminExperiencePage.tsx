import React, { useState } from 'react';
import { Plus, Edit, Trash2, Briefcase, Calendar, MapPin, X } from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IExperience } from '../../types';

export const AdminExperiencePage: React.FC = () => {
  const { experience, refreshData } = usePortfolioData();
  const [editingExp, setEditingExp] = useState<Partial<IExperience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingExp({
      company: '',
      position: '',
      employmentType: 'Full-time',
      location: 'Bengaluru / Remote',
      startDate: '2024-01',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      responsibilities: ['Architected scalable microservices', 'Engineered resilient security controls'],
      achievements: ['Delivered zero-downtime deployment'],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (exp: IExperience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await portfolioApi.deleteItem('experience', id);
      await refreshData();
      setFeedback('Experience deleted.');
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error deleting experience');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    try {
      setIsSaving(true);
      if (editingExp._id) {
        await portfolioApi.updateItem<IExperience>('experience', editingExp._id, editingExp);
        setFeedback('Experience updated successfully.');
      } else {
        await portfolioApi.createItem<IExperience>('experience', editingExp);
        setFeedback('Experience created successfully.');
      }
      await refreshData();
      setIsModalOpen(false);
      setEditingExp(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error saving experience');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout activeSection="Experience & Career">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Career Timeline Management
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Manage professional engineering positions, internships, and impact metrics.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Position</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        <div className="space-y-4">
          {experience.map((exp) => (
            <div
              key={exp._id || exp.company}
              className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-white text-lg">{exp.position}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
                    {exp.employmentType}
                  </span>
                </div>
                <div className="text-xs font-mono text-cyan-400 font-semibold">
                  {exp.company} • {exp.location}
                </div>
                <div className="text-xs font-mono text-gray-500">
                  {exp.startDate} — {exp.endDate}
                </div>
                <p className="text-xs text-gray-400 max-w-2xl font-sans mt-2">
                  {exp.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && editingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl bg-[#0d1117] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  {editingExp._id ? 'Edit Experience' : 'Add Position'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">COMPANY *</label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">ROLE / TITLE *</label>
                    <input
                      type="text"
                      required
                      value={editingExp.position || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">LOCATION</label>
                    <input
                      type="text"
                      value={editingExp.location || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">TYPE</label>
                    <select
                      value={editingExp.employmentType || 'Full-time'}
                      onChange={(e) => setEditingExp({ ...editingExp, employmentType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">START DATE</label>
                    <input
                      type="text"
                      value={editingExp.startDate || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                      placeholder="2023-01"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">END DATE</label>
                    <input
                      type="text"
                      value={editingExp.endDate || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                      placeholder="Present or 2024-05"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={editingExp.description || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">TECHNOLOGIES (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingExp.technologies?.join(', ') || ''}
                    onChange={(e) => setEditingExp({
                      ...editingExp,
                      technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-cyber-primary px-5 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Position'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};
