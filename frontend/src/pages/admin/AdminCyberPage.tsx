import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Save, Check, AlertCircle, 
  Plus, Trash2, KeyRound, Radio, AlertTriangle, 
  Lock, RefreshCw, Sparkles, Layers, Eye 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import type { ICyberSecurity, ISecurityPillar } from '../../types';

export const AdminCyberPage: React.FC = () => {
  const { siteSettings, refreshData } = usePortfolioData();

  const defaultCyber: ICyberSecurity = {
    badge: '06 // DEFENSIVE ENGINEERING & APPLIED CYBERSECURITY',
    headline: 'Offensive Awareness • Defensive Fortification',
    description: 'Building software with an adversary-first mindset. Security is an architectural foundation, not an afterthought.',
    pillars: [
      {
        title: 'Zero-Trust Architecture',
        description: 'Strict identity verification, ephemeral cryptographic token issuance, micro-segmentation, and explicit principle of least privilege.',
        icon: 'KeyRound',
      },
      {
        title: 'Network Packet Forensics',
        description: 'Deep packet inspection via Wireshark and eBPF filters, protocol anomaly detection, and automated intrusion payload analysis.',
        icon: 'Radio',
      },
      {
        title: 'OWASP Top 10 Hardening',
        description: 'Systematic vulnerability scanning for SSRF, broken object-level authorization (BOLA), injection vectors, and prototype pollution.',
        icon: 'AlertTriangle',
      },
      {
        title: 'Decentralized Cryptography',
        description: 'Zero-knowledge proofs (zk-SNARKs), asymmetric key management (ECDSA/Ed25519), and quantum-resistant hashing pipelines.',
        icon: 'Lock',
      },
    ],
    arsenalTitle: 'SECURITY TOOLCHAIN & AUDITING ARSENAL',
    arsenalStatus: 'THREAT INTELLIGENCE FEED: SYNCHRONIZED',
    arsenalTools: [
      'Linux Mainframe', 'Wireshark', 'Burp Suite Pro', 'Nmap', 
      'Metasploit', 'Python Scapy', 'OWASP ZAP', 'Docker Hardening', 
      'eBPF Tracing', 'GDB / Binary Ninja', 'Suricata SIEM', 'Fail2ban'
    ]
  };

  const [form, setForm] = useState<ICyberSecurity>(defaultCyber);
  const [newTool, setNewTool] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (siteSettings?.cyberSecurity) {
      setForm({
        badge: siteSettings.cyberSecurity.badge || defaultCyber.badge,
        headline: siteSettings.cyberSecurity.headline || defaultCyber.headline,
        description: siteSettings.cyberSecurity.description || defaultCyber.description,
        pillars: siteSettings.cyberSecurity.pillars?.length ? siteSettings.cyberSecurity.pillars : defaultCyber.pillars,
        arsenalTitle: siteSettings.cyberSecurity.arsenalTitle || defaultCyber.arsenalTitle,
        arsenalStatus: siteSettings.cyberSecurity.arsenalStatus || defaultCyber.arsenalStatus,
        arsenalTools: siteSettings.cyberSecurity.arsenalTools?.length ? siteSettings.cyberSecurity.arsenalTools : defaultCyber.arsenalTools
      });
    }
  }, [siteSettings]);

  const handlePillarChange = (index: number, field: keyof ISecurityPillar, value: string) => {
    const updated = [...form.pillars];
    updated[index] = { ...updated[index], [field]: value };
    setForm(prev => ({ ...prev, pillars: updated }));
  };

  const handleAddPillar = () => {
    setForm(prev => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          title: 'New Security Vector',
          description: 'Description of the architectural defensive security mechanism.',
          icon: 'ShieldCheck'
        }
      ]
    }));
  };

  const handleRemovePillar = (index: number) => {
    setForm(prev => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== index)
    }));
  };

  const handleAddTool = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTool.trim();
    if (!trimmed) return;
    if (form.arsenalTools.includes(trimmed)) {
      setNewTool('');
      return;
    }
    setForm(prev => ({
      ...prev,
      arsenalTools: [...prev.arsenalTools, trimmed]
    }));
    setNewTool('');
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setForm(prev => ({
      ...prev,
      arsenalTools: prev.arsenalTools.filter(t => t !== toolToRemove)
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all cybersecurity fields back to default configuration?')) {
      setForm(defaultCyber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await portfolioApi.updateSettings({
        cyberSecurity: form
      });
      await refreshData();
      setSuccessMsg('Cybersecurity Architecture & Toolchain updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save cybersecurity settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout activeSection="Cyber & Arsenal">
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Cybersecurity &amp; Arsenal CMS</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Configure defensive architecture pillars, threat intelligence status, and the security audit toolchain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white border border-gray-800 bg-[#0d1117] transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="btn-cyber-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Panel 1: Section Header & Telemetry */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
            <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Section Identity &amp; Telemetry</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  SECTION BADGE / NUMBER
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  placeholder="06 // DEFENSIVE ENGINEERING & APPLIED CYBERSECURITY"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  HEADLINE
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
                  placeholder="Offensive Awareness • Defensive Fortification"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">
                DESCRIPTION / ARCHITECTURAL PHILOSOPHY
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Building software with an adversary-first mindset..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Panel 2: Defensive Security Pillars */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Defensive Security Pillars ({form.pillars.length})</span>
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Core engineering methodologies highlighted on the interactive cybersecurity grid.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPillar}
                className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/50 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-800/80 bg-[#08090b] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      PILLAR 0{idx + 1}
                    </span>
                    {form.pillars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(idx)}
                        className="text-gray-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete Pillar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-mono text-gray-500 block mb-0.5">TITLE</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={e => handlePillarChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Zero-Trust Architecture"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-0.5">ICON</label>
                      <select
                        value={pillar.icon || 'KeyRound'}
                        onChange={e => handlePillarChange(idx, 'icon', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#0d1117] border border-gray-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="KeyRound">KeyRound</option>
                        <option value="Radio">Radio</option>
                        <option value="AlertTriangle">AlertTriangle</option>
                        <option value="Lock">Lock</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Terminal">Terminal</option>
                        <option value="Cpu">Cpu</option>
                        <option value="Zap">Zap</option>
                        <option value="Server">Server</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-0.5">DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={e => handlePillarChange(idx, 'description', e.target.value)}
                      placeholder="Detailed explanation of the defensive method..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-gray-800 text-gray-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 3: Security Toolchain & Auditing Arsenal */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
            <h2 className="text-sm font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Security Toolchain &amp; Auditing Arsenal</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  ARSENAL TITLE
                </label>
                <input
                  type="text"
                  value={form.arsenalTitle}
                  onChange={e => setForm(f => ({ ...f, arsenalTitle: e.target.value }))}
                  placeholder="SECURITY TOOLCHAIN & AUDITING ARSENAL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  FEED STATUS BANNER
                </label>
                <input
                  type="text"
                  value={form.arsenalStatus}
                  onChange={e => setForm(f => ({ ...f, arsenalStatus: e.target.value }))}
                  placeholder="THREAT INTELLIGENCE FEED: SYNCHRONIZED"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Tool Chips Manager */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-mono text-gray-400 block">
                ACTIVE SECURITY TOOLS ({form.arsenalTools.length})
              </label>

              {/* Add Tool Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTool}
                  onChange={e => setNewTool(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}
                  placeholder="Enter tool name (e.g. Kali Linux, Ghidra, Snort) and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#08090b] border border-gray-800 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddTool()}
                  className="px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-950/70 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tool</span>
                </button>
              </div>

              {/* Tool Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {form.arsenalTools.map(tool => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#08090b] border border-gray-800 text-gray-200 group hover:border-emerald-500/40 transition-all"
                  >
                    <span className="text-emerald-400">$</span>
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="text-gray-500 hover:text-rose-400 transition-colors ml-1"
                      title={`Remove ${tool}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{isSaving ? 'SAVING CYBER SYSTEM...' : 'SAVE ALL CYBER CHANGES'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
};
