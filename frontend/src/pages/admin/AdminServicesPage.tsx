import React, { useState } from 'react';
import { Plus, Edit, Trash2, Zap, Quote, Star, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IService, ITestimonial } from '../../types';

type ActiveTab = 'services' | 'testimonials';

export const AdminServicesPage: React.FC = () => {
  const { services, testimonials, refreshData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');

  // Service state
  const [editingService, setEditingService] = useState<Partial<IService> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Testimonial state
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<ITestimonial> | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // ── Service handlers ────────────────────────────────────────────────────
  const handleCreateService = () => {
    setEditingService({
      title: '',
      description: '',
      icon: 'Zap',
      features: [],
      enabled: true,
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: IService) => {
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await portfolioApi.deleteItem('services', id);
      await refreshData();
      showFeedback('Service deleted.');
    } catch {
      alert('Error deleting service');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      setIsSaving(true);
      if (editingService._id) {
        await portfolioApi.updateItem<IService>('services', editingService._id, editingService);
        showFeedback('Service updated successfully.');
      } else {
        await portfolioApi.createItem<IService>('services', editingService);
        showFeedback('Service created successfully.');
      }
      await refreshData();
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Testimonial handlers ────────────────────────────────────────────────
  const handleCreateTestimonial = () => {
    setEditingTestimonial({
      name: '',
      role: '',
      company: '',
      photoUrl: '',
      content: '',
      linkedinUrl: '',
      rating: 5,
      published: true,
    });
    setIsTestimonialModalOpen(true);
  };

  const handleEditTestimonial = (t: ITestimonial) => {
    setEditingTestimonial({ ...t });
    setIsTestimonialModalOpen(true);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await portfolioApi.deleteItem('testimonials', id);
      await refreshData();
      showFeedback('Testimonial deleted.');
    } catch {
      alert('Error deleting testimonial');
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      setIsSaving(true);
      if (editingTestimonial._id) {
        await portfolioApi.updateItem<ITestimonial>('testimonials', editingTestimonial._id, editingTestimonial);
        showFeedback('Testimonial updated successfully.');
      } else {
        await portfolioApi.createItem<ITestimonial>('testimonials', editingTestimonial);
        showFeedback('Testimonial created successfully.');
      }
      await refreshData();
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-xs font-mono';
  const labelCls = 'text-gray-400 block mb-1 text-[11px] uppercase tracking-wider';

  return (
    <AdminDashboardLayout activeSection="Capabilities & Endorsements">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Services & Testimonials
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Manage professional capabilities, offered services, and peer endorsements.
            </p>
          </div>
          <button
            onClick={activeTab === 'services' ? handleCreateService : handleCreateTestimonial}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>{activeTab === 'services' ? 'Add Service' : 'Add Testimonial'}</span>
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          {(['services', 'testimonials'] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono font-semibold rounded-t-xl border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'services' ? (
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Professional Capabilities</span>
              ) : (
                <span className="flex items-center gap-1.5"><Quote className="w-3.5 h-3.5" /> Peer Validation</span>
              )}
            </button>
          ))}
        </div>

        {/* Services List */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            {services.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 text-xs font-mono">
                No services yet. Click "Add Service" to get started.
              </div>
            )}
            {services.map((service) => (
              <div
                key={service._id}
                className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-heading font-bold text-white text-base">{service.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      service.enabled
                        ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                        : 'bg-gray-900 border-gray-700 text-gray-500'
                    }`}>
                      {service.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{service.description}</p>
                  {service.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {service.features.map((f, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEditService(service)} className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteService(service._id)} className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials List */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {testimonials.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 text-xs font-mono">
                No testimonials yet. Click "Add Testimonial" to get started.
              </div>
            )}
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center font-mono text-sm text-cyan-300 font-bold shrink-0">
                      {t.name?.[0] || '?'}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs font-mono text-cyan-400">{t.role} · {t.company}</div>
                    </div>
                    <div className="flex items-center gap-0.5 ml-2">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      t.published
                        ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                        : 'bg-gray-900 border-gray-700 text-gray-500'
                    }`}>
                      {t.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <blockquote className="text-xs text-gray-300 italic border-l-2 border-cyan-500/40 pl-3 mt-2">
                    "{t.content}"
                  </blockquote>
                  {t.linkedinUrl && (
                    <a href={t.linkedinUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-cyan-400 underline">
                      LinkedIn Profile ↗
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEditTestimonial(t)} className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteTestimonial(t._id)} className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {editingService._id ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 font-mono text-xs">
              <div>
                <label className={labelCls}>SERVICE TITLE *</label>
                <input type="text" required value={editingService.title || ''} onChange={(e) => setEditingService({ ...editingService, title: e.target.value })} className={inputCls} placeholder="Full-Stack Development" />
              </div>

              <div>
                <label className={labelCls}>DESCRIPTION *</label>
                <textarea rows={3} required value={editingService.description || ''} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>ICON NAME (Lucide icon)</label>
                <input type="text" value={editingService.icon || 'Zap'} onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })} className={inputCls} placeholder="Zap, Code2, Shield, Brain..." />
              </div>

              <div>
                <label className={labelCls}>KEY FEATURES (Comma-separated)</label>
                <input
                  type="text"
                  value={editingService.features?.join(', ') || ''}
                  onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className={inputCls}
                  placeholder="React, Node.js, API Design, Cloud Deploy"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className={labelCls + ' mb-0'}>ENABLED</label>
                <button
                  type="button"
                  onClick={() => setEditingService({ ...editingService, enabled: !editingService.enabled })}
                  className="cursor-pointer text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  {editingService.enabled
                    ? <ToggleRight className="w-6 h-6 text-emerald-400" />
                    : <ToggleLeft className="w-6 h-6 text-gray-600" />
                  }
                </button>
                <span className="text-[10px] font-mono text-gray-500">{editingService.enabled ? 'Visible on site' : 'Hidden from site'}</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 text-xs font-mono">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-cyber-primary px-5 py-2 rounded-xl font-bold text-xs cursor-pointer">
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0d1117] border border-purple-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {editingTestimonial._id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>FULL NAME *</label>
                  <input type="text" required value={editingTestimonial.name || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>COMPANY *</label>
                  <input type="text" required value={editingTestimonial.company || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>ROLE / TITLE *</label>
                <input type="text" required value={editingTestimonial.role || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} className={inputCls} placeholder="Senior Engineering Manager" />
              </div>

              <div>
                <label className={labelCls}>TESTIMONIAL CONTENT *</label>
                <textarea rows={4} required value={editingTestimonial.content || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })} className={`${inputCls} resize-none`} placeholder="What they said about your work..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>PHOTO URL</label>
                  <input type="text" value={editingTestimonial.photoUrl || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photoUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelCls}>LINKEDIN URL</label>
                  <input type="url" value={editingTestimonial.linkedinUrl || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, linkedinUrl: e.target.value })} className={inputCls} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>RATING (1–5)</label>
                  <select value={editingTestimonial.rating || 5} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })} className={inputCls}>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className={labelCls + ' mb-0'}>PUBLISHED</label>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial({ ...editingTestimonial, published: !editingTestimonial.published })}
                    className="cursor-pointer"
                  >
                    {editingTestimonial.published
                      ? <ToggleRight className="w-6 h-6 text-emerald-400" />
                      : <ToggleLeft className="w-6 h-6 text-gray-600" />
                    }
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 text-xs font-mono">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-cyber-primary px-5 py-2 rounded-xl font-bold text-xs cursor-pointer">
                  {isSaving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};
