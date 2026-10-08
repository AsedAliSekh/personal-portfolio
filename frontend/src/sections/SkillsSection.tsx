import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ISkill } from '../types';
import { TechOrbit } from '../components/3d/TechOrbit';
import { TechLogo } from '../components/icons/TechIcons';
import { Layers, Orbit, Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  skills: ISkill[];
}

const CATEGORY_ACCENTS: Record<string, { gradient: string; glow: string; border: string }> = {
  frontend: {
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34, 211, 238, 0.15)',
    border: 'border-cyan-500/30',
  },
  backend: {
    gradient: 'from-emerald-400 to-cyan-500',
    glow: 'rgba(52, 211, 153, 0.15)',
    border: 'border-emerald-500/30',
  },
  programming: {
    gradient: 'from-blue-400 to-indigo-500',
    glow: 'rgba(96, 165, 250, 0.15)',
    border: 'border-blue-500/30',
  },
  database: {
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.15)',
    border: 'border-amber-500/30',
  },
  ai_ml: {
    gradient: 'from-purple-400 to-pink-500',
    glow: 'rgba(192, 132, 252, 0.15)',
    border: 'border-purple-500/30',
  },
  cyber_security: {
    gradient: 'from-red-400 to-orange-500',
    glow: 'rgba(248, 113, 113, 0.15)',
    border: 'border-red-500/30',
  },
  devops: {
    gradient: 'from-teal-400 to-emerald-500',
    glow: 'rgba(45, 212, 191, 0.15)',
    border: 'border-teal-500/30',
  },
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'matrix' | 'orbit'>('matrix');

  const categories = [
    { key: 'all', label: 'All Domains' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'programming', label: 'Languages' },
    { key: 'database', label: 'Databases' },
    { key: 'ai_ml', label: 'AI & ML' },
    { key: 'cyber_security', label: 'Cyber Security' },
    { key: 'devops', label: 'DevOps & Cloud' },
  ];

  const sortedSkills = React.useMemo(() => {
    return [...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [skills]);

  const filteredSkills = selectedCategory === 'all'
    ? sortedSkills
    : sortedSkills.filter(s => s.category === selectedCategory);

  const getAccent = (cat: string) => CATEGORY_ACCENTS[cat] || {
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34, 211, 238, 0.15)',
    border: 'border-cyan-500/30',
  };


  return (
    <section id="skills" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#050508' }}>
      {/* Ambient Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="section-eyebrow">02 // SKILLS MATRIX</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Technical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Proficiencies
              </span>
            </h2>
            <p className="text-sm font-mono text-gray-500 max-w-xl">
              Engineered across client interfaces, resilient server runtimes, deep learning models, and security hardening.
            </p>
          </motion.div>

          {/* Toggle between Matrix View & 3D Orbit View */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8 bg-[#0d1117] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'matrix'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/35 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                : 'text-gray-500 hover:text-white'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Matrix View</span>
            </button>
            <button
              onClick={() => setActiveTab('orbit')}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'orbit'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/35 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                : 'text-gray-500 hover:text-white'
                }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>
          </div>
        </div>

        {
          activeTab === 'orbit' ? (
            <div className="p-6 rounded-2xl border border-cyan-500/15 bg-[#08090d]/60 backdrop-blur-xl">
              <div className="text-center font-mono text-xs text-cyan-400/60 mb-2 uppercase tracking-widest">
                Orbital Satellite Radial Visualizer
              </div>
              <TechOrbit skills={sortedSkills} />
            </div>
          ) : (
            <>
              {/* Category Filter Pills with clean minimalistic aesthetics */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  const count = cat.key === 'all'
                    ? sortedSkills.length
                    : sortedSkills.filter(s => s.category === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`group relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.18)]'
                          : 'bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/15'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-cyan-400/20 text-cyan-200 font-bold' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Skills Grid - Clean Minimalistic & Responsive */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill, index) => {
                    const accent = getAccent(skill.category);
                    return (
                      <motion.div
                        layout
                        key={skill._id || skill.name}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(index * 0.025, 0.25) }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative p-4 sm:p-5 rounded-2xl bg-[#090b10]/80 border border-white/[0.07] hover:border-cyan-400/35 backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(34,211,238,0.1)] flex flex-col justify-between overflow-hidden cursor-default select-none"
                      >
                        {/* Subtle ambient light on hover */}
                        <div
                          className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                          style={{ background: accent.glow }}
                        />

                        {/* Top: Logo + Name + Category + Proficiency */}
                        <div>
                          <div className="flex items-start gap-3.5 mb-3">
                            {/* Tech Logo Container */}
                            <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-cyan-400/40 group-hover:bg-cyan-950/20 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center justify-center transition-all duration-300">
                              <TechLogo 
                                name={skill.name} 
                                icon={skill.icon} 
                                logoUrl={skill.logoUrl} 
                                size={26} 
                                className="transition-transform duration-300 group-hover:scale-110" 
                              />
                            </div>

                            {/* Name & Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <h3 className="font-heading font-semibold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors truncate">
                                  {skill.name}
                                </h3>
                                <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-400/25 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                  {skill.proficiency}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-gray-500">
                                <span className="uppercase tracking-wider text-gray-400 truncate">
                                  {skill.category.replace('_', ' ')}
                                </span>
                                <span>•</span>
                                <span className="text-cyan-400/70 flex-shrink-0">{skill.years}y exp</span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-400/90 font-sans line-clamp-2 leading-relaxed min-h-[34px] mb-3">
                            {skill.description || 'Production level engineering proficiency.'}
                          </p>
                        </div>

                        {/* Bottom: Minimalist Hairline Progress Bar */}
                        <div className="pt-2 border-t border-white/[0.04]">
                          <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden p-0.5">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${accent.gradient} rounded-full`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )
        }
      </div >
    </section >
  );
};
