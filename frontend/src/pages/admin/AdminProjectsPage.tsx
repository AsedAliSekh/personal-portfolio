import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, ExternalLink, Star, 
  Check, X, Eye, AlertCircle, Save, Upload, 
  Image as ImageIcon, Sparkles, Cpu, Shield, 
  Layers, Activity, Calendar, Link2 
} from 'lucide-react';
import { GithubIcon as Github } from '../../components/icons/SocialIcons';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IProject } from '../../types';

export const AdminProjectsPage: React.FC = () => {
  const { projects, refreshData } = usePortfolioData();
  const [editingProject, setEditingProject] = useState<Partial<IProject> | null>(null);
  const [techInput, setTechInput] = useState<string>('');
  const [statisticsList, setStatisticsList] = useState<{ label: string; value: string }[]>([]);
  const [galleryList, setGalleryList] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const statusOptions = [
    'Fully Developed & Live',
    'Under Active Development',
    'Beta Preview',
    'Prototype / Research',
    'Production Hardened'
  ];

  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      detailedDescription: '',
      category: 'Full Stack',
      status: 'Fully Developed & Live',
      securityAudit: 'PASS: ZERO CVEs',
      clientType: 'Personal Flagship Initiative',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      gallery: [],
      technologies: ['React', 'TypeScript', 'Node.js'],
      githubUrl: '',
      liveUrl: '',
      caseStudyUrl: '',
      isFeatured: false,
      completionDate: new Date().toISOString().slice(0, 10),
      challenges: '',
      solution: '',
      results: '',
      architectureDiagram: '',
      statistics: [],
      published: true,
      order: projects.length,
    });
    setTechInput('React, TypeScript, Node.js');
    setStatisticsList([]);
    setGalleryList([]);
    setGalleryUrlInput('');
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: IProject) => {
    setEditingProject({ ...project });
    setTechInput(project.technologies ? project.technologies.join(', ') : '');
    setStatisticsList(project.statistics ? [...project.statistics] : []);
    setGalleryList(project.gallery ? [...project.gallery] : []);
    setGalleryUrlInput('');
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingThumbnail(true);
      setUploadError(null);
      const uploadedItem = await portfolioApi.uploadMedia(formData);
      setEditingProject((prev) => (prev ? { ...prev, thumbnail: uploadedItem.url } : null));
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload thumbnail image to CDN.');
    } finally {
      setIsUploadingThumbnail(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingGallery(true);
      setUploadError(null);
      const uploadedItem = await portfolioApi.uploadMedia(formData);
      setGalleryList((prev) => [...prev, uploadedItem.url]);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload gallery image to CDN.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setGalleryList((prev) => [...prev, galleryUrlInput.trim()]);
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setGalleryList((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAddStatistic = (label = '', value = '') => {
    setStatisticsList((prev) => [...prev, { label, value }]);
  };

  const handleUpdateStatistic = (index: number, field: 'label' | 'value', val: string) => {
    setStatisticsList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveStatistic = (index: number) => {
    setStatisticsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddMlPresets = () => {
    setStatisticsList((prev) => [
      ...prev,
      { label: 'Scans Done', value: '14,000+' },
      { label: 'Model Accuracy', value: '96.2%' },
      { label: 'Offline Support', value: '100%' },
    ]);
  };

  const handleAddSystemPresets = () => {
    setStatisticsList((prev) => [
      ...prev,
      { label: 'Latency', value: '< 2ms' },
      { label: 'Uptime', value: '99.99%' },
      { label: 'Throughput', value: '50k req/s' },
    ]);
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

    const payload: Partial<IProject> = {
      ...editingProject,
      technologies: techInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      gallery: galleryList,
      statistics: statisticsList.filter((s) => s.label.trim() || s.value.trim()),
      status: editingProject.status || 'Fully Developed & Live',
      securityAudit: editingProject.securityAudit || 'PASS: ZERO CVEs',
      clientType: editingProject.clientType || 'Personal Project',
    };

    try {
      setIsSaving(true);
      if (editingProject._id) {
        await portfolioApi.updateItem<IProject>('projects', editingProject._id, payload);
        setFeedback('Project updated successfully.');
      } else {
        await portfolioApi.createItem<IProject>('projects', { ...payload, order: projects.length });
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
              Manage portfolio projects, case studies, technologies, architecture topologies, and live metrics.
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
            <table className="w-full min-w-[760px] text-left font-mono text-xs text-gray-300">
              <thead className="bg-[#08090B] text-gray-500 uppercase border-b border-gray-800">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Category &amp; Status</th>
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
                    <td className="p-4">
                      <div className="text-cyan-400 font-semibold">{p.category}</div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{p.status || 'Live / Deployed'}</span>
                      </span>
                    </td>
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
                        {p.technologies.length > 3 && (
                          <span className="text-[10px] text-gray-500 self-center">
                            +{p.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noreferrer" title="GitHub Repository">
                            <Github className="w-4 h-4 hover:text-white" />
                          </a>
                        )}
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" title="Live System Demo">
                            <ExternalLink className="w-4 h-4 hover:text-cyan-400" />
                          </a>
                        )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-3xl sm:max-w-4xl bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-white">
                  {editingProject._id ? 'Edit Project Deployment' : 'Create New Project'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
                {/* SECTION 1: CORE IDENTIFIERS */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Core Identifiers &amp; Status</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 block mb-1">PROJECT TITLE *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                            slug: editingProject._id
                              ? editingProject.slug
                              : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          })
                        }
                        placeholder="e.g. NeuralShield AI"
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
                        placeholder="e.g. neuralshield-ai"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 block mb-1">CATEGORY</label>
                      <input
                        type="text"
                        value={editingProject.category || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="e.g. AI / ML & Full Stack, Cyber Security"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">PROJECT STATUS BADGE</label>
                      <select
                        value={editingProject.status || 'Fully Developed & Live'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">COMPLETION / DEPLOY DATE</label>
                      <input
                        type="text"
                        value={editingProject.completionDate || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                        placeholder="e.g. 2025-08 or Aug 2025"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={!!editingProject.isFeatured}
                      onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                      className="rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-0"
                    />
                    <label htmlFor="isFeatured" className="text-gray-300 cursor-pointer">
                      Flagship Featured Project (Highlighted on Home Portfolio)
                    </label>
                  </div>
                </div>

                {/* SECTION 2: THUMBNAIL (URL OR DIRECT CDN UPLOAD) */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Project Thumbnail (URL or Direct Upload to CDN)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="text-gray-400 block mb-1">IMAGE URL</label>
                        <input
                          type="text"
                          value={editingProject.thumbnail || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                          placeholder="https://example.com/image.jpg or /uploads/..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          className={`btn-cyber-primary px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer ${
                            isUploadingThumbnail ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{isUploadingThumbnail ? 'Uploading to CDN...' : 'Upload Thumbnail File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingThumbnail}
                            onChange={handleThumbnailUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-gray-500">
                          Directly uploads to CDN storage and automatically fills the URL.
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Live Preview */}
                    <div className="h-28 rounded-xl border border-white/10 overflow-hidden bg-black flex items-center justify-center relative">
                      {editingProject.thumbnail ? (
                        <>
                          <img
                            src={editingProject.thumbnail}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-emerald-400 font-mono">
                            ✓ Loaded
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-[10px] font-mono">No Image Preview</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: DESCRIPTIONS & TECHNOLOGIES */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Descriptions &amp; Technology Stack</span>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">SHORT SUMMARY DESCRIPTION *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingProject.shortDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                      placeholder="Brief punchy summary shown on project cards..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">DETAILED ARCHITECTURAL WRITEUP</label>
                    <textarea
                      rows={4}
                      value={editingProject.detailedDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, detailedDescription: e.target.value })}
                      placeholder="In-depth system breakdown, algorithms, distributed architecture overview..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-y"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-gray-400 block">TECHNOLOGY STACK</label>
                      <span className="text-[10px] text-cyan-400 font-mono">Comma-separated</span>
                    </div>
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="React, TypeScript, PyTorch, Docker, PostgreSQL, WebAssembly"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SECTION 4: KEY METRICS & STATISTICS (HUD COUNTERS) */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>Key Metrics &amp; Statistics (HUD Counters)</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Optional metrics. Ideal for ML projects (e.g. Scans Done, Model Accuracy, Offline Support) or system benchmarks.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddMlPresets}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-300 text-[10px] hover:bg-purple-900/50 transition-colors cursor-pointer"
                        title="Add ML Project Metrics: Scans Done, Model Accuracy, Offline Support"
                      >
                        + Add ML Presets
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSystemPresets}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[10px] hover:bg-cyan-900/50 transition-colors cursor-pointer"
                        title="Add Web/System Metrics: Latency, Uptime, Throughput"
                      >
                        + Add System Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddStatistic('', '')}
                        className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-[10px] hover:text-white transition-colors cursor-pointer"
                      >
                        + Add Metric Row
                      </button>
                    </div>
                  </div>

                  {statisticsList.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-gray-800 text-center text-gray-500 text-[11px]">
                      No metrics added. Leave empty if not required for this project, or click a preset button above to add metrics.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {statisticsList.map((stat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5"
                        >
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleUpdateStatistic(idx, 'label', e.target.value)}
                            placeholder="Label (e.g. Model Accuracy)"
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                          />
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleUpdateStatistic(idx, 'value', e.target.value)}
                            placeholder="Value (e.g. 96.2%)"
                            className="w-28 px-2.5 py-1.5 rounded-lg border border-gray-800 bg-[#08090B] text-cyan-400 font-bold focus:border-cyan-400 focus:outline-none text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveStatistic(idx)}
                            className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove Metric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION 5: DETAILED PAGE SCHEMATICS & IMPACT */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>Case Study Deep-Dive Schematics &amp; Ratings</span>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">
                      DATA FLOW &amp; COMPONENT TOPOLOGY (Architecture Pipeline Diagram)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.architectureDiagram || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architectureDiagram: e.target.value })}
                      placeholder="e.g. Mobile Camera -> TF.js WebAssembly -> Offline Diagnosis -> Background Sync -> Express API -> Mongo Cluster"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-rose-400 block mb-1">TECHNICAL CHALLENGES</label>
                      <textarea
                        rows={3}
                        value={editingProject.challenges || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value })}
                        placeholder="Key technical obstacles, edge cases, distributed network latencies..."
                        className="w-full px-3 py-2 rounded-xl border border-rose-500/30 bg-[#08090B] text-white focus:border-rose-400 focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="text-emerald-400 block mb-1">ENGINEERING SOLUTIONS</label>
                      <textarea
                        rows={3}
                        value={editingProject.solution || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                        placeholder="Architectural resolutions, algorithmic optimizations, protocol enhancements..."
                        className="w-full px-3 py-2 rounded-xl border border-emerald-500/30 bg-[#08090B] text-white focus:border-emerald-400 focus:outline-none resize-y"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-purple-400 block mb-1">
                      EMPIRICAL RESULTS &amp; IMPACT FIELD
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.results || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, results: e.target.value })}
                      placeholder="Quantifiable real-world outcome, benchmarks, cost reductions, validated accuracies..."
                      className="w-full px-3 py-2 rounded-xl border border-purple-500/30 bg-[#08090B] text-white focus:border-purple-400 focus:outline-none resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 block mb-1">PROJECT INITIATIVE</label>
                      <input
                        type="text"
                        value={editingProject.clientType || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, clientType: e.target.value })}
                        placeholder="e.g. Agritech Social Initiative, Enterprise Security"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">SECURITY &amp; AUDIT RATING</label>
                      <input
                        type="text"
                        value={editingProject.securityAudit || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, securityAudit: e.target.value })}
                        placeholder="e.g. PASS: ZERO CVEs or A+ Security Hardened"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 6: VISUAL DOCUMENTATION (GALLERY SCREENSHOTS) */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Visual Documentation (Gallery Screenshots)</span>
                    </div>

                    <label
                      className={`btn-cyber-primary px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer ${
                        isUploadingGallery ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isUploadingGallery ? 'Uploading to CDN...' : 'Upload Screenshot to CDN'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingGallery}
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add Image by URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      placeholder="Paste image URL (e.g. https://... or /uploads/...)"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </div>

                  {/* Gallery Grid Previews */}
                  {galleryList.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-gray-800 text-center text-gray-500 text-[11px]">
                      No gallery screenshots yet. Upload images above or add image URLs.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {galleryList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative h-24 rounded-xl border border-white/10 overflow-hidden bg-black"
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-lg bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-950/80 cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION 7: EXTERNAL REPO & LIVE DEMO URLS */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="text-cyan-400 font-bold tracking-wider text-[11px] uppercase flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>External Links &amp; Live Demonstrations</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 block mb-1">GITHUB REPO URL</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">LIVE DEMO URL</label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                        placeholder="https://myproject.dev"
                        className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-cyber-primary px-7 py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
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
