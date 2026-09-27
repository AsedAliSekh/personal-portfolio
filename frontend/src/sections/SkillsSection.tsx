import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ISkill } from '../types';
import { TechOrbit } from '../components/3d/TechOrbit';
import { Layers, Orbit } from 'lucide-react';


interface SkillsSectionProps {
  skills: ISkill[];
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'from-cyan-500 to-blue-500',
  backend: 'from-emerald-500 to-cyan-500',
  programming: 'from-blue-500 to-indigo-500',
  database: 'from-orange-500 to-amber-500',
  ai_ml: 'from-purple-500 to-pink-500',
  cyber_security: 'from-red-500 to-orange-500',
  devops: 'from-teal-500 to-emerald-500',
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'matrix' | 'orbit'>('matrix');

  const categories = [
    { key: 'all', label: 'All Domains' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'programming', label: 'Languages' },
    { key: 'database', label: 'Database' },
    { key: 'ai_ml', label: 'AI / ML' },
    { key: 'cyber_security', label: 'Cyber Security' },
    { key: 'devops', label: 'DevOps & Cloud' },
  ];

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getBarGradient = (category: string) => CATEGORY_COLORS[category] || 'from-cyan-500 to-purple-500';


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
              <TechOrbit skills={skills} />
            </div>
          ) : (
            <>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${selectedCategory === cat.key
                      ? 'bg-cyan-400 text-black font-bold shadow-[0_0_18px_rgba(34,211,238,0.45)]'
                      : 'border border-white/8 bg-[#0d1117] text-gray-400 hover:border-white/15 hover:text-white'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill._id || skill.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                    className="group p-5 rounded-2xl border border-white/6 bg-[#0d1117]/90 hover:border-cyan-400/30 hover:bg-[#111620] hover:shadow-[0_0_25px_rgba(34,211,238,0.08)] transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${getBarGradient(skill.category)} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

                    <div className="flex items-start justify-between mb-3">
                      <span className="font-heading font-bold text-white text-sm group-hover:text-cyan-300 transition-colors leading-tight">
                        {skill.name}
                      </span>
                      <span className={`font-mono text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r ${getBarGradient(skill.category)} ml-2 flex-shrink-0`}>
                        {skill.proficiency}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-3.5 font-sans leading-relaxed">
                      {skill.description || 'Production level engineering proficiency.'}
                    </p>

                    {/* Cyber Visual Bar */}
                    <div className="w-full h-1 bg-[#1a2030] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getBarGradient(skill.category)} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-gray-600">
                      <span className="uppercase tracking-wider">{skill.category.replace('_', ' ')}</span>
                      <span>{skill.years}y exp</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )
        }
      </div >
    </section >
  );
};
