import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, ExternalLink, Star, 
  Check, X, Eye, AlertCircle, Save 
} from 'lucide-react';
import { GithubIcon as Github } from '../../components/icons/SocialIcons';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IProject } from '../../types';

export const AdminProjectsPage: React.FC = () => {
  const { projects, refreshData } = usePortfolioData();
  const [editingProject, setEditingProject] = useState<Partial<IProject> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      detailedDescription: '',
      category: 'Full Stack',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      gallery: [],
      technologies: ['React', 'TypeScript', 'Node.js'],
      githubUrl: '',
      liveUrl: '',
      isFeatured: false,
      published: true,
      statistics: [
        { label: 'Latency', value: '< 2ms' },
        { label: 'Uptime', value: '99.9%' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: IProject) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this project from the database?')) {
      return;
    }
    try {
      await portfolioApi.deleteItem('projects', id);
      await refreshData();
      setFeedback('Project deleted successfully.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      alert('Failed to delete project.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      setIsSaving(true);
      if (editingProject._id) {
        await portfolioApi.updateItem<IProject>('projects', editingProject._id, editingProject);
        setFeedback('Project updated successfully.');
      } else {
        await portfolioApi.createItem<IProject>('projects', editingProject);
        setFeedback('Project created successfully.');
      }
      await refreshData();
      setIsModalOpen(false);
      setEditingProject(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout activeSection="Projects CMS">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Project Deployments CMS
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Manage portfolio projects, case studies, technologies, and live URLs.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add New Project</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        {/* Projects Table */}
        <div className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-gray-300">
              <thead className="bg-[#08090B] text-gray-500 uppercase border-b border-gray-800">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Flagship</th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4">Links</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {projects.map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail}
                          alt=""
                          className="w-12 h-10 object-cover rounded-lg border border-gray-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{p.title}</div>
                          <div className="text-[10px] text-gray-500">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-cyan-400">{p.category}</td>
                    <td className="p-4">
                      {p.isFeatured ? (
                        <span className="text-amber-400 flex items-center gap-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> Flagship
                        </span>
                      ) : (
                        <span className="text-gray-500">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer"><Github className="w-4 h-4 hover:text-white" /></a>}
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 hover:text-cyan-400" /></a>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit / Create Modal */}
        {isModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#0d1117] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  {editingProject._id ? 'Edit Project Deployment' : 'Create New Project'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">PROJECT TITLE *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ 
                        ...editingProject, 
                        title: e.target.value,
                        slug: editingProject._id ? editingProject.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">SLUG (URL PATH) *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">CATEGORY</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={!!editingProject.isFeatured}
                      onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                      className="rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-0"
                    />
                    <label htmlFor="isFeatured" className="text-gray-300 cursor-pointer">
                      Flagship Featured Project
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">THUMBNAIL IMAGE URL</label>
                  <input
                    type="text"
                    value={editingProject.thumbnail || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">SHORT SUMMARY DESCRIPTION *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProject.shortDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">DETAILED ARCHITECTURAL WRITEUP</label>
                  <textarea
                    rows={4}
                    value={editingProject.detailedDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, detailedDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">TECHNOLOGIES (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingProject.technologies?.join(', ') || ''}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="React, TypeScript, PyTorch, Docker"
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">GITHUB REPO URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">LIVE DEMO URL</label>
                    <input
                      type="text"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-cyber-primary px-6 py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Project Data'}
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
