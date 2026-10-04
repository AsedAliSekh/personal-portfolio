import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Code2, Save, X, Star, 
  Upload, Image as ImageIcon, Link2, Sparkles, AlertCircle 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { ISkill, SkillCategory } from '../../types';
import { TechLogo, PRESET_TECH_LOGOS } from '../../components/icons/TechIcons';

export const AdminSkillsPage: React.FC = () => {
  const { skills, refreshData } = usePortfolioData();
  const [editingSkill, setEditingSkill] = useState<Partial<ISkill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories: SkillCategory[] = [
    'frontend', 'backend', 'database', 'programming', 
    'ai_ml', 'cyber_security', 'devops', 'tools'
  ];

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

    try {
      setIsSaving(true);
      if (editingSkill._id) {
        await portfolioApi.updateItem<ISkill>('skills', editingSkill._id, editingSkill);
        setFeedback('Skill updated successfully.');
      } else {
        await portfolioApi.createItem<ISkill>('skills', editingSkill);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id || skill.name}
              className="p-4 rounded-xl border border-gray-800 bg-[#0d1117] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    <TechLogo name={skill.name} icon={skill.icon} logoUrl={skill.logoUrl} size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{skill.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase">{skill.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
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
                <span>{skill.years}y Exp</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1 hover:text-cyan-400 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-1 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                      value={editingSkill.proficiency || 85}
                      onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">YEARS EXPERIENCE</label>
                  <input
                    type="number"
                    value={editingSkill.years || 2}
                    onChange={(e) => setEditingSkill({ ...editingSkill, years: Number(e.target.value) })}
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
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
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
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400"
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
