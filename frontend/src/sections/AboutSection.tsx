import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Shield, Award, Terminal, Code2, Sparkles } from 'lucide-react';
import { IProfile } from '../types';

interface AboutSectionProps {
  profile: IProfile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [isImageActive, setIsImageActive] = useState(false);
  const stats = profile?.stats && profile.stats.length > 0 ? profile.stats : [
    { label: 'Completed Projects', value: 'loding...', order: 1 },
    { label: 'Years Experience', value: 'loding...', order: 2 },
    { label: 'Open Source Repos', value: 'loding...', order: 3 },
    { label: 'Security Audits', value: 'loding...', order: 4 },
  ];

  return (
    <section id="about" className="relative py-24 bg-[#08090B] border-t border-cyan-500/10 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            01 // ABOUT ME
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Full Stack Developer &nbsp;
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              &amp; Cyber Spectrum
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Avatar Holographic Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={() => setIsImageActive((prev) => !prev)}
              className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl p-2 border border-cyan-400/40 bg-[#0d1117] shadow-[0_0_35px_rgba(34,211,238,0.15)] group cursor-pointer select-none"
            >
              {/* HUD Corner Brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src={profile?.avatarUrl || 'https://res.cloudinary.com/xyfuo9xi/image/upload/v1790542116/portfolio-cms/portfolio-cms/1790542116201-Confident-Professional-in-a-Warm-Workspace-500kb.jpeg.jpg'}
                  alt={profile?.name || 'Ased Profile'}
                  className={`w-full h-full object-cover object-center filter contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105 group-active:grayscale-0 group-active:scale-105 ${isImageActive ? 'grayscale-0 scale-105' : 'grayscale'
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-80" />

                {/* Overlay Identity Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg border border-white/10 bg-[#08090B]/85 backdrop-blur-md">
                  <div className="font-heading font-bold text-white text-sm flex items-center justify-between">
                    <span>{profile?.name || 'Ased Ali Sekh'}</span>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/30">
                      &#9734; &#9734; &#9734;
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5 truncate">
                    {profile?.title || 'Full Stack Developer'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-gray-300 font-sans leading-relaxed text-base sm:text-lg">
              <p>
                {profile?.bio || 'Passionate computer science professional building scalable cloud architectures, intelligent machine learning systems, and resilient cybersecurity solutions with modern aesthetics.'}
              </p>
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/15 backdrop-blur-sm">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider block mb-1">
                  CORE PHILOSOPHY //
                </span>
                <p className="text-sm font-sans italic text-cyan-100">
                  "{profile?.philosophy || 'Code should be clean, resilient, and visually captivating. Engineering is the bridge between human curiosity and tangible societal impact.'}"
                </p>
              </div>
            </div>

            {/* Meta Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-[#0d1117]/60 text-xs font-mono text-gray-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>LOCATION: {profile?.location || 'loding...'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-[#0d1117]/60 text-xs font-mono text-gray-300">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>EXP: {profile?.yearsOfExperience || 'loding...'}+ Years Active</span>
              </div>
            </div>

            {/* Dynamic Statistics Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-4 rounded-xl border border-gray-800 bg-[#0d1117] text-center hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1 line-clamp-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
