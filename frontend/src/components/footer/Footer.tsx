import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowUp, ShieldCheck, Terminal, Heart } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter } from '../icons/SocialIcons';
import type { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const navigate = useNavigate();
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecretFooterClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      navigate('/malikhaihum/cockpit');
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2500);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800/80">
          {/* Col 1: Identity & HUD Status */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-cyan-400/40 bg-cyan-950/40 flex items-center justify-center font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                {profile?.initials || 'AS'}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-lg tracking-wide">
                  {profile?.name || 'Ased Ali Sekh'}
                </h3>
                <p className="text-xs font-mono text-cyan-400">
                  {profile?.title || 'Full Stack & Cyber Security Specialist'}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 max-w-md font-sans leading-relaxed">
              {profile?.philosophy || 'Engineering scalable web architectures, resilient zero-trust defenses, and intelligent AI models with precision.'}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {profile?.statusText || 'Available for opportunities'}
              </span>
              <span>•</span>
              <span>GEO: {profile?.location || 'Bengaluru / Remote'}</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> SYSTEM DIRECTORY
            </h4>
            <ul className="space-y-2 text-sm font-mono text-gray-400">
              <li><a href="#about" className="hover:text-cyan-300 transition-colors">01 // About Me</a></li>
              <li><a href="#skills" className="hover:text-cyan-300 transition-colors">02 // Skill Matrix</a></li>
              <li><a href="#projects" className="hover:text-cyan-300 transition-colors">03 // Featured Work</a></li>
              <li><a href="#research" className="hover:text-cyan-300 transition-colors">04 // Research & Papers</a></li>
              <li><Link to="/blog" className="hover:text-cyan-300 transition-colors">05 // Technical Journal</Link></li>
              <li><a href="#contact" className="hover:text-cyan-300 transition-colors">06 // Encrypted Channel</a></li>
            </ul>
          </div>

          {/* Col 3: Social Telemetry */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> SOCIAL UPLINKS
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://github.com/AsedAliSekh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-gray-800 bg-[#0d1117] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ased-ali-sekh/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-gray-800 bg-[#0d1117] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/AsedAliSekh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-gray-800 bg-[#0d1117] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile?.email || 'asedalisekh.dev@gmail.com'}`}
                className="w-10 h-10 rounded-lg border border-gray-800 bg-[#0d1117] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                title="Email Direct"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6">
              <a
                href={profile?.resumeUrl || '/uploads/sample_resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
              >
                View Resume PDF →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div
            onClick={handleSecretFooterClick}
            className="cursor-default select-none transition-colors hover:text-gray-400"
            title=""
          >
            © {currentYear} {profile?.name || 'Ased'}. All digital rights reserved.
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            Crafted with React 19, Three.js & Cyber Resilience
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-800 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
