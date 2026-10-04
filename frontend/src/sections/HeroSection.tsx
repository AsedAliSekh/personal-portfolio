import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Send, Mail, Shield, Sparkles, Cpu, Layers, Radio } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter } from '../components/icons/SocialIcons';
import { HeroThreeScene } from '../components/3d/HeroThreeScene';
import { HeroErrorBoundary } from '../components/3d/HeroErrorBoundary';
import { portfolioApi } from '../services/api';
import type { IProfile } from '../types';

interface HeroSectionProps {
  profile: IProfile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVisitorData = async () => {
      try {
        const res = await portfolioApi.getVisitorCount();
        if (isMounted && res?.totalVisitors) {
          setVisitorCount(res.totalVisitors);
        }
      } catch (err) {
        console.warn('[HeroSection] Telemetry counter poll:', err);
      }
    };

    fetchVisitorData();
    // Live auto-polling every 12 seconds
    const interval = setInterval(fetchVisitorData, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute English ordinal suffix (1st, 2nd, 3rd, 56th, 66th, etc.)
  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return `${n.toLocaleString()}${suffix}`;
  };

  const titles = profile?.titles || [
    'Full Stack Software Engineer',
    'AI / Machine Learning Practitioner',
    'Cyber Security Specialist',
    'Distributed Systems Architect'
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-radial-gradient">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Availability Status & Real-Time Dynamic Database Visitor Uplink Cluster */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3"
            >
              {/* Availability Chip */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] sm:text-xs tracking-wide">
                  {profile?.statusText?.toUpperCase() || 'AVAILABLE FOR HIRE / SYSTEM ARCHITECTURE'}
                </span>
              </div>

              {/* Attractive Real-Time Live Database Visitor Telemetry Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 via-[#0d1117]/80 to-purple-950/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md transition-all hover:border-cyan-300/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                <div className="flex items-center gap-1.5 shrink-0">

                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                </div>



                <span className="text-[11px] sm:text-xs text-gray-200">
                  Welcome! You are the{' '}
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 inline-block font-mono tracking-tight">
                    {visitorCount !== null ? (
                      getOrdinal(visitorCount)
                    ) : (
                      <span className="animate-pulse">#...</span>
                    )}
                  </span>{' '}
                  visitor
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  {profile?.name || 'Ased Ali Sekh'}.
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-mono text-cyan-400/90 font-medium">
                {titles[0]} • AI &amp; Cyber Practitioner
              </p>
            </motion.div>

            {/* Editorial Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 font-sans font-light leading-relaxed"
            >
              {profile?.shortBio || 'I build scalable web applications, intelligent machine learning systems, and secure digital architectures with meticulous craftsmanship.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href="#projects"
                className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm tracking-wide"
              >
                <span>View My Work</span>
                <ArrowDown className="w-4 h-4 text-cyan-400" />
              </a>

              <a
                href={profile?.resumeUrl || ' '}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-gray-800 bg-[#0d1117] text-gray-200 hover:text-white hover:border-gray-700 text-sm font-mono flex items-center gap-2 transition-all hover:bg-white/5"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Resume</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 text-sm font-mono flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </motion.div>

            {/* Social Uplinks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-gray-400"
            >
              <span className="text-xs font-mono text-gray-500">UPLINKS //</span>
              <a href="https://github.com/AsedAliSekh" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors p-1" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/ased-ali-sekh/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors p-1" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://x.com/AsedAliSekh" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors p-1" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={`mailto:${profile?.email || 'asedalisekh@gmail.com'}`} className="hover:text-cyan-400 transition-colors p-1" title="Email Direct">
                <Mail className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Three.js Interactive Hero Digital Universe */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HeroErrorBoundary>
              <HeroThreeScene />
            </HeroErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
};
