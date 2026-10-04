import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Check, AlertCircle, RefreshCw, 
  Sliders, User, Globe, Eye, Palette, BarChart3, Plus, Trash2 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import type { IProfile, ISiteSettings, IEnabledSections } from '../../types';

const defaultStats = [
  { label: 'Completed Projects', value: '20+', order: 1 },
  { label: 'Years Experience', value: '3+', order: 2 },
  { label: 'Open Source Repos', value: '30+', order: 3 },
  { label: 'Security Audits', value: '15+', order: 4 },
];

export const AdminSettingsPage: React.FC = () => {
  const { profile, siteSettings, refreshData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'profile' | 'seo' | 'sections'>('profile');
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState<Partial<IProfile>>({});
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<Partial<ISiteSettings>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        initials: profile.initials,
        title: profile.title,
        titles: profile.titles,
        bio: profile.bio,
        shortBio: profile.shortBio,
        philosophy: profile.philosophy,
        location: profile.location,
        email: profile.email,
        availabilityStatus: profile.availabilityStatus,
        statusText: profile.statusText,
        avatarUrl: profile.avatarUrl,
        resumeUrl: profile.resumeUrl,
        yearsOfExperience: profile.yearsOfExperience,
        terminalWhoami: profile.terminalWhoami,
        stats: profile.stats?.length ? profile.stats : defaultStats
      });
    }
    if (siteSettings) {
      setSettingsForm({
        siteTitle: siteSettings.siteTitle,
        metaDescription: siteSettings.metaDescription,
        keywords: siteSettings.keywords,
        accentColor: siteSettings.accentColor,
        ogImage: siteSettings.ogImage,
        author: siteSettings.author,
        enabledSections: { ...siteSettings.enabledSections }
      });
    }
  }, [profile, siteSettings]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await portfolioApi.updateProfile(profileForm);
      await refreshData();
      setSuccessMsg('Developer profile successfully updated across the dynamic portfolio.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    setProfileForm(p => {
      const stats = [...(p.stats || defaultStats)];
      stats[index] = { ...stats[index], [field]: val };
      return { ...p, stats };
    });
  };

  const handleAddStat = () => {
    setProfileForm(p => {
      const stats = [...(p.stats || defaultStats)];
      stats.push({ label: 'New Metric', value: '10+', order: stats.length + 1 });
      return { ...p, stats };
    });
  };

  const handleRemoveStat = (index: number) => {
    setProfileForm(p => {
      const stats = (p.stats || defaultStats).filter((_, i) => i !== index);
      return { ...p, stats };
    });
  };

  const handleResetStats = () => {
    setProfileForm(p => ({ ...p, stats: defaultStats }));
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await portfolioApi.updateSettings(settingsForm);
      await refreshData();
      setSuccessMsg('Site settings, SEO configuration, and section visibility successfully synchronized.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update system settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setSettingsForm(prev => {
      const current = (prev.enabledSections || {}) as Record<string, boolean>;
      return {
        ...prev,
        enabledSections: {
          ...current,
          [sectionKey]: !current[sectionKey]
        } as unknown as IEnabledSections
      };
    });
  };

  const sectionLabels: Record<string, string> = {
    hero: '01. Hero & Three.js Universe',
    about: '02. About & Philosophy',
    skills: '03. Interactive Skills Ecosystem',
    techOrbit: '04. 3D Technology Orbit Visualization',
    experience: '05. Work Experience Timeline',
    projects: '06. Engineering Projects Showcase',
    research: '07. Academic Research & Publications',
    cyberSecurity: '08. Cyber Security Operations Lab',
    education: '07. Academic Foundation (Education)',
    certifications: '08. Industry Accreditations (Certifications)',
    services: '09. Services & Capabilities',
    testimonials: '10. Professional Endorsements',
    blog: '11. Technical Journal & Insights',
    terminal: '12. Interactive Cyber Terminal',
    contact: '13. Contact & Message Uplink'
  };

  return (
    <AdminDashboardLayout activeSection="Settings & SEO">
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>System Settings & Configuration</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Configure developer identity, live availability status, SEO metadata, and dynamic sections.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full -mx-1 px-1">
            {(['profile', 'seo', 'sections'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'bg-[#0d1117] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {tab === 'profile' && <User className="w-3.5 h-3.5 text-cyan-400" />}
                {tab === 'seo' && <Globe className="w-3.5 h-3.5 text-purple-400" />}
                {tab === 'sections' && <Sliders className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{tab === 'profile' ? 'Developer Profile' : tab === 'seo' ? 'SEO & Meta' : 'Dynamic Sections'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: DEVELOPER PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
              <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Primary Identity</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">FULL NAME</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">INITIALS LOGO</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={profileForm.initials || ''}
                    onChange={e => setProfileForm(p => ({ ...p, initials: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono uppercase focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">PRIMARY EMAIL</label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">PRIMARY TITLE</label>
                <input
                  type="text"
                  value={profileForm.title || ''}
                  onChange={e => setProfileForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  ROTATING TITLES (Comma separated for typewriter hero animation)
                </label>
                <input
                  type="text"
                  value={(profileForm.titles || []).join(', ')}
                  onChange={e => setProfileForm(p => ({ ...p, titles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">YEARS OF EXPERIENCE</label>
                  <input
                    type="number"
                    value={profileForm.yearsOfExperience || 0}
                    onChange={e => setProfileForm(p => ({ ...p, yearsOfExperience: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">SHORT HERO BIO</label>
                <input
                  type="text"
                  value={profileForm.shortBio || ''}
                  onChange={e => setProfileForm(p => ({ ...p, shortBio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">FULL BIOGRAPHY</label>
                <textarea
                  rows={3}
                  value={profileForm.bio || ''}
                  onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">ENGINEERING PHILOSOPHY</label>
                <textarea
                  rows={2}
                  value={profileForm.philosophy || ''}
                  onChange={e => setProfileForm(p => ({ ...p, philosophy: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Developer Status */}
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
              <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Status Beacon</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">AVAILABILITY MODE</label>
                  <select
                    value={profileForm.availabilityStatus || 'available'}
                    onChange={e => setProfileForm(p => ({ ...p, availabilityStatus: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="available">Available (Open to opportunities)</option>
                    <option value="working">Working (Engaged in projects)</option>
                    <option value="learning">Learning (Deep tech research)</option>
                    <option value="building">Building (Shipping new software)</option>
                    <option value="busy">Busy (Limited capacity)</option>
                    <option value="custom">Custom Status</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">STATUS BANNER TEXT</label>
                  <input
                    type="text"
                    value={profileForm.statusText || ''}
                    onChange={e => setProfileForm(p => ({ ...p, statusText: e.target.value }))}
                    placeholder="e.g. Currently building neural network pipelines"
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">AVATAR IMAGE URL</label>
                  <input
                    type="text"
                    value={profileForm.avatarUrl || ''}
                    onChange={e => setProfileForm(p => ({ ...p, avatarUrl: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">RESUME / CV URL</label>
                  <input
                    type="text"
                    value={profileForm.resumeUrl || ''}
                    onChange={e => setProfileForm(p => ({ ...p, resumeUrl: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Key Impact Statistics & Counters */}
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Impact Statistics &amp; Metrics Counters (About Section)</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    Live counters displayed in the About section (e.g. 20+ Completed Projects, 3+ Years Experience, etc.)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetStats}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-800 bg-[#08090b] text-[11px] font-mono text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/50 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {(profileForm.stats || defaultStats).map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-800 bg-[#08090b] space-y-2.5 relative group hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                        METRIC 0{idx + 1}
                      </span>
                      {(profileForm.stats || defaultStats).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(idx)}
                          className="text-gray-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                          title="Delete Metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">VALUE / COUNTER</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={e => handleStatChange(idx, 'value', e.target.value)}
                        placeholder="e.g. 20+, 3+, 30+"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-gray-800 text-cyan-300 font-bold text-sm font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">LABEL</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="e.g. Completed Projects"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{isSaving ? 'SAVING PROFILE...' : 'SAVE PROFILE UPDATES'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: SEO & METADATA */}
        {activeTab === 'seo' && (
          <form onSubmit={handleSettingsSave} className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
              <h2 className="text-sm font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Search Engine Optimization & Meta Cards</span>
              </h2>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">SITE TITLE TAG</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle || ''}
                  onChange={e => setSettingsForm(s => ({ ...s, siteTitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">META DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={settingsForm.metaDescription || ''}
                  onChange={e => setSettingsForm(s => ({ ...s, metaDescription: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  KEYWORDS (Comma separated)
                </label>
                <input
                  type="text"
                  value={(settingsForm.keywords || []).join(', ')}
                  onChange={e => setSettingsForm(s => ({ ...s, keywords: e.target.value.split(',').map(x => x.trim()).filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">AUTHOR NAME</label>
                  <input
                    type="text"
                    value={settingsForm.author || ''}
                    onChange={e => setSettingsForm(s => ({ ...s, author: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">OPEN GRAPH (OG) BANNER IMAGE URL</label>
                  <input
                    type="text"
                    value={settingsForm.ogImage || ''}
                    onChange={e => setSettingsForm(s => ({ ...s, ogImage: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">PRIMARY ACCENT COLOR HEX</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settingsForm.accentColor || '#22D3EE'}
                    onChange={e => setSettingsForm(s => ({ ...s, accentColor: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={settingsForm.accentColor || '#22D3EE'}
                    onChange={e => setSettingsForm(s => ({ ...s, accentColor: e.target.value }))}
                    className="w-36 px-3 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{isSaving ? 'SAVING SEO...' : 'SAVE SEO SETTINGS'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: DYNAMIC SECTION BUILDER */}
        {activeTab === 'sections' && (
          <form onSubmit={handleSettingsSave} className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    <span>Dynamic Section Visibility Engine</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Toggle homepage components on or off instantly without code redeployment.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {Object.entries(sectionLabels).map(([key, label]) => {
                  const sectionsRecord = (settingsForm.enabledSections || {}) as Record<string, boolean | undefined>;
                  const isEnabled = sectionsRecord[key] !== false;
                  return (
                    <div
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isEnabled
                          ? 'border-cyan-500/40 bg-cyan-950/20 text-white'
                          : 'border-gray-800/80 bg-[#08090b] text-gray-500'
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <span className="text-xs font-mono font-medium block truncate">
                          {label}
                        </span>
                      </div>

                      <div
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                          isEnabled ? 'bg-cyan-500' : 'bg-gray-800'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{isSaving ? 'UPDATING SECTIONS...' : 'PERSIST SECTION CONFIGURATION'}</span>
            </button>
          </form>
        )}
      </div>
    </AdminDashboardLayout>
  );
};
