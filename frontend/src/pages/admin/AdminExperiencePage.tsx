import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Briefcase, Calendar, MapPin, X, 
  GripVertical, ArrowUp, ArrowDown, Award, CheckCircle2 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IExperience } from '../../types';

export const AdminExperiencePage: React.FC = () => {
  const { experience, refreshData } = usePortfolioData();
  const [experienceList, setExperienceList] = useState<IExperience[]>([]);
  const [editingExp, setEditingExp] = useState<Partial<IExperience> | null>(null);
  const [techInput, setTechInput] = useState<string>('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState<string>('');
  const [achievementsInput, setAchievementsInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync experienceList whenever experience changes
  useEffect(() => {
    if (experience) {
      setExperienceList([...experience].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [experience]);

  const saveNewOrder = async (newList: IExperience[]) => {
    try {
      setIsReordering(true);
      const ids = newList.map((e) => e._id).filter(Boolean);
      await portfolioApi.reorderItems('experience', ids);
      await refreshData();
      setFeedback('Experience timeline updated & synced to portfolio.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('Failed to update experience order:', err);
      setFeedback(err.response?.data?.message || 'Failed to update experience order.');
      if (experience) {
        setExperienceList([...experience].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      }
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsReordering(false);
    }
  };

  const handleMove = async (currentIndex: number, delta: number) => {
    const targetIndex = currentIndex + delta;
    if (targetIndex < 0 || targetIndex >= experienceList.length) return;

    const reordered = [...experienceList];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setExperienceList(reordered);
    await saveNewOrder(reordered);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // left target
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...experienceList];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setExperienceList(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
    await saveNewOrder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCreate = () => {
    setEditingExp({
      company: '',
      position: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      responsibilities: [],
      achievements: [],
      technologies: [],
      order: experienceList.length,
    });
    setTechInput('');
    setResponsibilitiesInput('');
    setAchievementsInput('');
    setIsModalOpen(true);
  };

  const handleEdit = (exp: IExperience) => {
    setEditingExp({ ...exp });
    setTechInput(exp.technologies ? exp.technologies.join(', ') : '');
    setResponsibilitiesInput(exp.responsibilities ? exp.responsibilities.join('\n') : '');
    setAchievementsInput(exp.achievements ? exp.achievements.join('\n') : '');
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

    const payload: Partial<IExperience> = {
      ...editingExp,
      technologies: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      responsibilities: responsibilitiesInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      achievements: achievementsInput
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      setIsSaving(true);
      if (editingExp._id) {
        await portfolioApi.updateItem<IExperience>('experience', editingExp._id, payload);
        setFeedback('Experience updated successfully.');
      } else {
        await portfolioApi.createItem<IExperience>('experience', { ...payload, order: experienceList.length });
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

        {/* Reordering helper banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              <strong>Ordering:</strong> Drag positions by hand or use the <ArrowUp className="w-3 h-3 inline mx-0.5 text-cyan-400" /> / <ArrowDown className="w-3 h-3 inline mx-0.5 text-cyan-400" /> arrows to reorder timeline. Ordering reflects directly on your portfolio.
            </span>
          </div>
          {isReordering && (
            <span className="flex items-center gap-1.5 text-cyan-400 animate-pulse text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Syncing order...
            </span>
          )}
        </div>

        <div className="space-y-4">
          {experienceList.map((exp, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={exp._id || `${exp.company}-${index}`}
                draggable={!isSaving && !isReordering}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none ${
                  isDragging
                    ? 'opacity-40 border-cyan-500/60 bg-cyan-950/30 scale-[0.99]'
                    : isDragOver
                    ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-[#0d1726] shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.01]'
                    : 'border-gray-800 bg-[#0d1117] hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Drag Handle & Order Controls */}
                  <div className="flex flex-col items-center gap-1.5 pt-1 shrink-0">
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80 font-bold bg-cyan-950/50 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0 || isReordering}
                        title="Move position up / earlier"
                        className="p-1 rounded text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/40 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === experienceList.length - 1 || isReordering}
                        title="Move position down / later"
                        className="p-1 rounded text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/40 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Experience Content */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-white text-lg">{exp.position}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
                        {exp.employmentType}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-cyan-400 font-semibold">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>

                    <div className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                      <span>{exp.startDate} — {exp.endDate}</span>
                    </div>

                    {exp.description && (
                      <p className="text-xs text-gray-400 max-w-2xl font-sans leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}

                    {/* Metadata summary: Responsibilities, Impact, Technologies */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-gray-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400/70" />
                          <span>{exp.responsibilities.length} {exp.responsibilities.length === 1 ? 'Responsibility' : 'Responsibilities'}</span>
                        </span>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/30 text-purple-300 flex items-center gap-1">
                          <Award className="w-3 h-3 text-purple-400" />
                          <span>{exp.achievements.length} {exp.achievements.length === 1 ? 'Impact Award' : 'Impact Awards'}</span>
                        </span>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          {exp.technologies.slice(0, 5).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-400/20 text-cyan-300 text-[10px]">
                              {t}
                            </span>
                          ))}
                          {exp.technologies.length > 5 && (
                            <span className="text-[10px] text-gray-500">
                              +{exp.technologies.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Edit position"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && editingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {editingExp._id ? 'Edit Experience' : 'Add Position'}
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
                    <label className="text-gray-400 block mb-1">COMPANY *</label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      placeholder="e.g. Google, Microsoft, Startup"
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
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">LOCATION</label>
                    <input
                      type="text"
                      value={editingExp.location || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      placeholder="e.g. Bengaluru, India / Remote"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">START DATE</label>
                    <input
                      type="text"
                      value={editingExp.startDate || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                      placeholder="e.g. 2023-01 or Jan 2023"
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">END DATE</label>
                    <input
                      type="text"
                      value={editingExp.endDate || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                      placeholder="e.g. Present or 2024-05"
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
                    placeholder="Summary of responsibilities and scope of work..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Key Responsibilities Section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 block">KEY RESPONSIBILITIES</label>
                    <span className="text-[10px] font-mono text-gray-500">One item per line (shows as bullet points)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={responsibilitiesInput}
                    onChange={(e) => setResponsibilitiesInput(e.target.value)}
                    placeholder="Architected scalable microservices with zero downtime&#10;Engineered resilient security controls and automated CI/CD pipelines&#10;Mentored frontend and backend engineering teams"
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-y"
                  />
                </div>

                {/* Key Impact & Awards Section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 block">KEY IMPACT &amp; QUANTIFIABLE ACHIEVEMENTS</label>
                    <span className="text-[10px] font-mono text-purple-400/80">One item per line (shows in impact card)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={achievementsInput}
                    onChange={(e) => setAchievementsInput(e.target.value)}
                    placeholder="Reduced database query latency by 45% using Redis caching layer&#10;Delivered zero-downtime production deployment across 500k+ MAU&#10;Awarded Outstanding Technical Contributor of the Year"
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-y"
                  />
                </div>

                {/* Technologies (comma and space safely handled) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 block">TECHNOLOGIES</label>
                    <span className="text-[10px] font-mono text-cyan-400/80">Comma-separated</span>
                  </div>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
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
