import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Code2, Save, X, Star, 
  Upload, Image as ImageIcon, Link2, Sparkles, AlertCircle,
  GripVertical, ArrowLeft, ArrowRight
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { ISkill, SkillCategory } from '../../types';
import { TechLogo, PRESET_TECH_LOGOS } from '../../components/icons/TechIcons';

export const AdminSkillsPage: React.FC = () => {
  const { skills, refreshData } = usePortfolioData();
  const [skillList, setSkillList] = useState<ISkill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Partial<ISkill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories: SkillCategory[] = [
    'frontend', 'backend', 'database', 'programming', 
    'ai_ml', 'cyber_security', 'devops', 'tools'
  ];

  // Sync skillList whenever skills change
  useEffect(() => {
    if (skills) {
      setSkillList([...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [skills]);

  const saveNewOrder = async (newList: ISkill[]) => {
    try {
      setIsReordering(true);
      const ids = newList.map(s => s._id).filter(Boolean);
      await portfolioApi.reorderItems('skills', ids);
      await refreshData();
      setFeedback('Skill order updated & synced to portfolio.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('Failed to update skill order:', err);
      setFeedback(err.response?.data?.message || 'Failed to update skill order.');
      if (skills) {
        setSkillList([...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      }
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsReordering(false);
    }
  };

  const handleMove = async (currentIndex: number, delta: number) => {
    const targetIndex = currentIndex + delta;
    if (targetIndex < 0 || targetIndex >= skillList.length) return;

    const reordered = [...skillList];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setSkillList(reordered);
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
    // Left target
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...skillList];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setSkillList(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
    await saveNewOrder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCreate = () => {
    setEditingSkill({
      name: '',
      category: 'frontend',
      proficiency: 85,
      years: 2,
      description: '',
      icon: 'react',
      logoUrl: '',
      featured: true,
      orbitRadius: 4.0,
      speed: 1.0,
      order: skillList.length,
    });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: ISkill) => {
    setEditingSkill({ ...skill });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingLogo(true);
      setUploadError(null);
      const uploadedItem = await portfolioApi.uploadMedia(formData);
      setEditingSkill((prev) => (prev ? { ...prev, logoUrl: uploadedItem.url } : null));
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload logo image. Make sure backend is running.');
    } finally {
      setIsUploadingLogo(false);
      // Reset input value so same file can be re-uploaded if needed
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete skill entry?')) return;
    try {
      await portfolioApi.deleteItem('skills', id);
      await refreshData();
      setFeedback('Skill deleted.');
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error deleting skill');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    // Sanitize proficiency and years so user input is properly normalized
    const prof = (editingSkill.proficiency as unknown as string) === '' || editingSkill.proficiency === undefined || editingSkill.proficiency === null
      ? 0
      : Math.max(0, Math.min(100, Number(editingSkill.proficiency)));

    const yrs = (editingSkill.years as unknown as string) === '' || editingSkill.years === undefined || editingSkill.years === null
      ? 0
      : Math.max(0, Number(editingSkill.years));


    const skillPayload: Partial<ISkill> = {
      ...editingSkill,
      proficiency: prof,
      years: yrs,
    };

    try {
      setIsSaving(true);
      if (editingSkill._id) {
        await portfolioApi.updateItem<ISkill>('skills', editingSkill._id, skillPayload);
        setFeedback('Skill updated successfully.');
      } else {
        await portfolioApi.createItem<ISkill>('skills', { ...skillPayload, order: skillList.length });
        setFeedback('Skill created successfully.');
      }
      await refreshData();
      setIsModalOpen(false);
      setEditingSkill(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error saving skill');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout activeSection="Skills & Technologies">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Skill Ecosystem &amp; Orbit Matrix
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Manage technical proficiencies, categories, and 3D orbiting satellites.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Skill</span>
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
              <strong>Ordering:</strong> Drag cards by hand or use the <ArrowLeft className="w-3 h-3 inline mx-0.5 text-cyan-400" /> / <ArrowRight className="w-3 h-3 inline mx-0.5 text-cyan-400" /> arrows to reorder skills. Ordering reflects directly on your portfolio.
            </span>
          </div>
          {isReordering && (
            <span className="flex items-center gap-1.5 text-cyan-400 animate-pulse text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Syncing order...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillList.map((skill, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={skill._id || `${skill.name}-${index}`}
                draggable={!isSaving && !isReordering}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 select-none ${
                  isDragging
                    ? 'opacity-40 border-cyan-500/60 bg-cyan-950/30 scale-[0.98]'
                    : isDragOver
                    ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-[#0d1726] shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02]'
                    : 'border-gray-800 bg-[#0d1117] hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                      <TechLogo name={skill.name} icon={skill.icon} logoUrl={skill.logoUrl} size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-500 font-bold">#{index + 1}</span>
                        <div className="font-bold text-white text-sm truncate">{skill.name}</div>
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase">{skill.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {skill.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                    <span className="font-mono text-xs font-bold text-white">{skill.proficiency}%</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{skill.years}y Exp</span>
                    {/* Reorder Arrows */}
                    <div className="flex items-center gap-0.5 ml-1 border-l border-white/10 pl-2">
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0 || isReordering}
                        title="Move skill earlier"
                        className="p-1 rounded text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/40 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === skillList.length - 1 || isReordering}
                        title="Move skill later"
                        className="p-1 rounded text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/40 disabled:opacity-20 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-1 hover:text-cyan-400 cursor-pointer"
                      title="Edit skill"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="p-1 hover:text-rose-400 cursor-pointer"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && editingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto my-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {editingSkill._id ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">SKILL NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">CATEGORY</label>
                    <select
                      value={editingSkill.category || 'frontend'}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as SkillCategory })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">PROFICIENCY (0-100)%</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingSkill.proficiency ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingSkill({ 
                          ...editingSkill, 
                          proficiency: val === '' ? ('' as unknown as number) : Number(val) 
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">YEARS EXPERIENCE</label>
                  <input
                    type="number"
                    min={0}
                    value={editingSkill.years ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingSkill({ 
                        ...editingSkill, 
                        years: val === '' ? ('' as unknown as number) : Number(val) 
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Dynamic Logo & Icon Configuration */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-gray-300 font-bold tracking-wide">DYNAMIC TECHNOLOGY LOGO</span>
                    </div>
                    {editingSkill.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingSkill({ ...editingSkill, logoUrl: '' })}
                        className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Reset to preset
                      </button>
                    )}
                  </div>

                  {/* Live Preview Box */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-12 h-12 rounded-xl bg-[#090b10] border border-white/10 flex items-center justify-center p-2 flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.12)]">
                      <TechLogo 
                        name={editingSkill.name || 'Skill'} 
                        icon={editingSkill.icon} 
                        logoUrl={editingSkill.logoUrl} 
                        size={28} 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white truncate">
                        {editingSkill.logoUrl ? 'Custom Image / SVG Logo' : (editingSkill.icon ? `Icon: ${editingSkill.icon}` : 'Auto-detected from Skill Name')}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {editingSkill.logoUrl || 'Renders crisp vector logo or custom upload'}
                      </div>
                    </div>
                  </div>

                  {/* Option A: Direct File Upload */}
                  <div>
                    <label className="text-gray-400 block mb-1 text-[11px]">UPLOAD LOGO FILE (SVG, PNG, WEBP)</label>
                    <div className="flex items-center gap-2">
                      <label className={`btn-cyber-primary px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-bold cursor-pointer ${isUploadingLogo ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isUploadingLogo ? 'Uploading...' : 'Choose File to Upload'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          disabled={isUploadingLogo}
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                      {editingSkill.logoUrl && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          ✓ Logo loaded
                        </span>
                      )}
                    </div>
                    {uploadError && (
                      <div className="mt-1 text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Option B: Direct Logo URL */}
                  <div>
                    <label className="text-gray-400 block mb-1 text-[11px]">OR LOGO IMAGE / SVG URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingSkill.logoUrl || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.svg or /uploads/..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                      />
                      <Link2 className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Option C: Preset Tech Selection */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/[0.05]">
                    <div>
                      <label className="text-gray-400 block mb-1 text-[11px]">TECH PRESET LOGO</label>
                      <select
                        value={editingSkill.icon || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                      >
                        <option value="">Auto (Match Skill Name)</option>
                        {PRESET_TECH_LOGOS.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1 text-[11px]">CUSTOM ICON IDENTIFIER</label>
                      <input
                        type="text"
                        value={editingSkill.icon || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                        placeholder="python, react, docker, etc."
                        className="w-full px-2.5 py-1.5 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={editingSkill.description || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredSkill"
                    checked={!!editingSkill.featured}
                    onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                    className="rounded bg-gray-800 border-gray-700 text-cyan-400"
                  />
                  <label htmlFor="featuredSkill" className="text-gray-300 cursor-pointer">
                    Display In 3D Orbit System
                  </label>
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
                    {isSaving ? 'Saving...' : 'Save Skill'}
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
