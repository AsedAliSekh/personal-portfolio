import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Terminal, Radio, Eye, KeyRound, AlertTriangle, Cpu, Shield, Zap, Server } from 'lucide-react';
import { usePortfolioData } from '../contexts/PortfolioDataContext';

// Helper to render icon by name
const renderPillarIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'radio':
      return <Radio className="w-5 h-5 text-emerald-400" />;
    case 'alerttriangle':
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'lock':
      return <Lock className="w-5 h-5 text-purple-400" />;
    case 'shieldcheck':
    case 'shield':
      return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    case 'terminal':
      return <Terminal className="w-5 h-5 text-cyan-400" />;
    case 'cpu':
      return <Cpu className="w-5 h-5 text-cyan-400" />;
    case 'zap':
      return <Zap className="w-5 h-5 text-yellow-400" />;
    case 'server':
      return <Server className="w-5 h-5 text-blue-400" />;
    case 'keyround':
    default:
      return <KeyRound className="w-5 h-5 text-cyan-400" />;
  }
};

export const CyberSecuritySection: React.FC = () => {
  const { siteSettings } = usePortfolioData();
  const cyberData = siteSettings?.cyberSecurity;

  const badge = cyberData?.badge || '06 // DEFENSIVE ENGINEERING & APPLIED CYBERSECURITY';
  const headline = cyberData?.headline || 'Offensive Awareness';
  const description = cyberData?.description || 'Building software with an adversary-first mindset. Security is an architectural foundation, not an afterthought.';

  const defaultPillars = [
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
  ];

  const pillars = cyberData?.pillars && cyberData.pillars.length > 0 ? cyberData.pillars : defaultPillars;

  const defaultArsenal = [
    'Linux Mainframe', 'Wireshark', 'Burp Suite Pro', 'Nmap',
    'Metasploit', 'Python Scapy', 'OWASP ZAP', 'Docker Hardening',
  ];

  const arsenalTools = cyberData?.arsenalTools && cyberData.arsenalTools.length > 0 ? cyberData.arsenalTools : defaultArsenal;
  const arsenalTitle = cyberData?.arsenalTitle || 'SECURITY TOOLCHAIN & AUDITING ARSENAL';
  const arsenalStatus = cyberData?.arsenalStatus || 'THREAT INTELLIGENCE FEED: SYNCHRONIZED';

  return (
    <section id="cyber" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#08090d' }}>
      {/* Ambient Grid Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-emerald-500/4 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 mb-16 text-center sm:text-left"
        >
          <div className="section-eyebrow" style={{ color: '#34d399' }}>
            <ShieldCheck className="w-3.5 h-3.5 -ml-0.5" style={{ color: '#34d399' }} />
            {badge}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            {headline.split(' • ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              • {headline.split(' • ')[1] || 'Defensive Fortification'}
            </span>
          </h2>
          <p className="text-sm font-mono text-gray-500 max-w-xl">
            {description}
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title + i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-white/6 bg-[#0d1117] hover:border-emerald-400/30 hover:shadow-[0_0_25px_rgba(34,197,94,0.08)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent group-hover:via-emerald-400/50 transition-all duration-300" />
              <div className="w-12 h-12 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-300">
                {renderPillarIcon(pillar.icon)}
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Arsenal & Terminal HUD */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/6 bg-[#08090d]/90 backdrop-blur-xl relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>{arsenalTitle}</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {arsenalStatus}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {arsenalTools.map((tool) => (
              <span
                key={tool}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-[#0d1117] border border-gray-800 text-gray-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
              >
                $ {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
