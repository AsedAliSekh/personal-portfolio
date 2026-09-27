import React, { useState } from 'react';
import { Plus, Edit, Trash2, GraduationCap, Award, X, BookOpen } from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IEducation, ICertification } from '../../types';

type ActiveTab = 'education' | 'certifications';

export const AdminEducationPage: React.FC = () => {
  const { education, certifications, refreshData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('education');

  // Education state
  const [editingEdu, setEditingEdu] = useState<Partial<IEducation> | null>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);

  // Certification state
  const [editingCert, setEditingCert] = useState<Partial<ICertification> | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // ── Education handlers ──────────────────────────────────────────────────
  const handleCreateEdu = () => {
    setEditingEdu({
      degree: '',
      institution: '',
      location: '',
      startYear: '2020',
      endYear: '2024',
      grade: '',
      description: '',
      coursework: [],
    });
    setIsEduModalOpen(true);
  };

  const handleEditEdu = (edu: IEducation) => {
    setEditingEdu({ ...edu });
    setIsEduModalOpen(true);
  };

  const handleDeleteEdu = async (id: string) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await portfolioApi.deleteItem('education', id);
      await refreshData();
      showFeedback('Education entry deleted.');
    } catch {
      alert('Error deleting education');
    }
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    try {
      setIsSaving(true);
      if (editingEdu._id) {
        await portfolioApi.updateItem<IEducation>('education', editingEdu._id, editingEdu);
        showFeedback('Education updated successfully.');
      } else {
        await portfolioApi.createItem<IEducation>('education', editingEdu);
        showFeedback('Education created successfully.');
      }
      await refreshData();
      setIsEduModalOpen(false);
      setEditingEdu(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving education');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Certification handlers ──────────────────────────────────────────────
  const handleCreateCert = () => {
    setEditingCert({
      title: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      certificateImageUrl: '',
      description: '',
    });
    setIsCertModalOpen(true);
  };

  const handleEditCert = (cert: ICertification) => {
    setEditingCert({ ...cert });
    setIsCertModalOpen(true);
  };

  const handleDeleteCert = async (id: string) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await portfolioApi.deleteItem('certifications', id);
      await refreshData();
      showFeedback('Certification deleted.');
    } catch {
      alert('Error deleting certification');
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    try {
      setIsSaving(true);
      if (editingCert._id) {
        await portfolioApi.updateItem<ICertification>('certifications', editingCert._id, editingCert);
        showFeedback('Certification updated successfully.');
      } else {
        await portfolioApi.createItem<ICertification>('certifications', editingCert);
        showFeedback('Certification created successfully.');
      }
      await refreshData();
      setIsCertModalOpen(false);
      setEditingCert(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving certification');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-xs font-mono';
  const labelCls = 'text-gray-400 block mb-1 text-[11px] uppercase tracking-wider';

  return (
    <AdminDashboardLayout activeSection="Academic Foundation & Accreditations">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Education & Certifications
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Manage academic foundation, degrees, and industry accreditations.
            </p>
          </div>
          <button
            onClick={activeTab === 'education' ? handleCreateEdu : handleCreateCert}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>{activeTab === 'education' ? 'Add Education' : 'Add Certification'}</span>
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800 pb-0">
          {(['education', 'certifications'] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono font-semibold rounded-t-xl border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'education' ? (
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Academic Foundation</span>
              ) : (
                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Industry Accreditations</span>
              )}
            </button>
          ))}
        </div>

        {/* Education List */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            {education.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 text-xs font-mono">
                No education entries yet. Click "Add Education" to get started.
              </div>
            )}
            {education.map((edu) => (
              <div
                key={edu._id}
                className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-heading font-bold text-white text-base">{edu.degree}</h3>
                    {edu.grade && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-400/30 text-emerald-300">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-cyan-400 font-semibold">{edu.institution}</div>
                  <div className="text-xs font-mono text-gray-500">{edu.location} · {edu.startYear} – {edu.endYear}</div>
                  {edu.description && (
                    <p className="text-xs text-gray-400 max-w-2xl mt-1">{edu.description}</p>
                  )}
                  {edu.coursework?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {edu.coursework.map((c, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEditEdu(edu)} className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteEdu(edu._id)} className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications List */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            {certifications.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 text-xs font-mono">
                No certifications yet. Click "Add Certification" to get started.
              </div>
            )}
            {certifications.map((cert) => (
              <div
                key={cert._id}
                className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {cert.certificateImageUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-purple-500/30 bg-[#08090b] shrink-0">
                      <img
                        src={cert.certificateImageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <h3 className="font-heading font-bold text-white text-base">{cert.title}</h3>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 font-semibold">{cert.issuer}</div>
                    <div className="text-xs font-mono text-gray-500">
                      Issued: {cert.issueDate}
                      {cert.expirationDate && ` · Expires: ${cert.expirationDate}`}
                    </div>
                    {cert.credentialId && (
                      <div className="text-[10px] font-mono text-gray-600">ID: {cert.credentialId}</div>
                    )}
                    {cert.description && (
                      <p className="text-xs text-gray-400 max-w-2xl mt-1">{cert.description}</p>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-cyan-400 underline">
                        View Credential ↗
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEditCert(cert)} className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCert(cert._id)} className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Modal */}
      {isEduModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0d1117] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="font-heading font-extrabold text-lg text-white">
                {editingEdu._id ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4 font-mono text-xs">
              <div>
                <label className={labelCls}>DEGREE / QUALIFICATION *</label>
                <input type="text" required value={editingEdu.degree || ''} onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })} className={inputCls} placeholder="B.E. Computer Science" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>INSTITUTION *</label>
                  <input type="text" required value={editingEdu.institution || ''} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>LOCATION</label>
                  <input type="text" value={editingEdu.location || ''} onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>START YEAR *</label>
                  <input type="text" required value={editingEdu.startYear || ''} onChange={(e) => setEditingEdu({ ...editingEdu, startYear: e.target.value })} className={inputCls} placeholder="2020" />
                </div>
                <div>
                  <label className={labelCls}>END YEAR *</label>
                  <input type="text" required value={editingEdu.endYear || ''} onChange={(e) => setEditingEdu({ ...editingEdu, endYear: e.target.value })} className={inputCls} placeholder="2024" />
                </div>
              </div>

              <div>
                <label className={labelCls}>GRADE / GPA</label>
                <input type="text" value={editingEdu.grade || ''} onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })} className={inputCls} placeholder="8.5 CGPA / First Class" />
              </div>

              <div>
                <label className={labelCls}>DESCRIPTION</label>
                <textarea rows={2} value={editingEdu.description || ''} onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>KEY COURSEWORK (Comma-separated)</label>
                <input
                  type="text"
                  value={editingEdu.coursework?.join(', ') || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, coursework: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className={inputCls}
                  placeholder="Data Structures, OS, Networks, Cryptography"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsEduModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 text-xs font-mono">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-cyber-primary px-5 py-2 rounded-xl font-bold text-xs cursor-pointer">
                  {isSaving ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {isCertModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0d1117] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="font-heading font-extrabold text-lg text-white">
                {editingCert._id ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setIsCertModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4 font-mono text-xs">
              <div>
                <label className={labelCls}>CERTIFICATION TITLE *</label>
                <input type="text" required value={editingCert.title || ''} onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })} className={inputCls} placeholder="AWS Certified Solutions Architect" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>ISSUING ORGANIZATION *</label>
                  <input type="text" required value={editingCert.issuer || ''} onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>ISSUE DATE *</label>
                  <input type="text" required value={editingCert.issueDate || ''} onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })} className={inputCls} placeholder="Jan 2024" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>EXPIRATION DATE</label>
                  <input type="text" value={editingCert.expirationDate || ''} onChange={(e) => setEditingCert({ ...editingCert, expirationDate: e.target.value })} className={inputCls} placeholder="Jan 2027 (or leave blank)" />
                </div>
                <div>
                  <label className={labelCls}>CREDENTIAL ID</label>
                  <input type="text" value={editingCert.credentialId || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>CREDENTIAL URL</label>
                <input type="url" value={editingCert.credentialUrl || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>

              <div>
                <label className={labelCls}>CERTIFICATE IMAGE URL</label>
                <input type="text" value={editingCert.certificateImageUrl || ''} onChange={(e) => setEditingCert({ ...editingCert, certificateImageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>

              <div>
                <label className={labelCls}>DESCRIPTION</label>
                <textarea rows={2} value={editingCert.description || ''} onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsCertModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 text-xs font-mono">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-cyber-primary px-5 py-2 rounded-xl font-bold text-xs cursor-pointer">
                  {isSaving ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};
