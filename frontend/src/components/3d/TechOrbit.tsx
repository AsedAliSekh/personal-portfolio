import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ISkill } from '../../types';
import { 
  Atom, Server, Database, Cpu, Layers, Box, Terminal, 
  ShieldCheck, Palette, FileCode2, Sparkles, Binary, Zap, Lock 
} from 'lucide-react';

interface TechOrbitProps {
  skills: ISkill[];
}

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'atom': return <Atom className="w-5 h-5 text-cyan-400" />;
    case 'server': return <Server className="w-5 h-5 text-blue-400" />;
    case 'database': return <Database className="w-5 h-5 text-emerald-400" />;
    case 'cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
    case 'layers': return <Layers className="w-5 h-5 text-green-400" />;
    case 'box': return <Box className="w-5 h-5 text-cyan-300" />;
    case 'terminal': return <Terminal className="w-5 h-5 text-yellow-400" />;
    case 'shieldcheck': return <ShieldCheck className="w-5 h-5 text-emerald-300" />;
    case 'palette': return <Palette className="w-5 h-5 text-purple-400" />;
    case 'filecode2': return <FileCode2 className="w-5 h-5 text-blue-300" />;
    case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-300" />;
    case 'binary': return <Binary className="w-5 h-5 text-yellow-300" />;
    case 'zap': return <Zap className="w-5 h-5 text-rose-400" />;
    case 'lock': return <Lock className="w-5 h-5 text-red-400" />;
    default: return <Atom className="w-5 h-5 text-cyan-400" />;
  }
};

export const TechOrbit: React.FC<TechOrbitProps> = ({ skills }) => {
  const [activeSkill, setActiveSkill] = useState<ISkill | null>(null);

  const featuredSkills = skills.filter(s => s.featured).slice(0, 10);
  const ring1 = featuredSkills.slice(0, 4);
  const ring2 = featuredSkills.slice(4, 10);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[520px]">
      {/* Background Ambient Glow */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Orbit Rings (CSS 3D perspective) */}
      <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
        {/* Ring 1 - Inner Orbit */}
        <div className="absolute inset-12 sm:inset-16 rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]" />

        {/* Ring 2 - Outer Orbit */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite_reverse]" />

        {/* Central Hub: "MY STACK" */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-cyan-400/60 bg-[#08090B]/90 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.25)] text-center p-2 cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mb-1" />
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest uppercase">CORE</span>
          <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-wide">MY STACK</span>
          <span className="text-[10px] font-mono text-gray-400">{skills.length} Techs</span>
        </motion.div>

        {/* Inner Ring Nodes */}
        {ring1.map((skill, index) => {
          const angle = (index / ring1.length) * 2 * Math.PI;
          const radius = 100; // px
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={skill._id || skill.name}
              className="absolute z-20"
              style={{
                left: `calc(50% + ${x}px - 22px)`,
                top: `calc(50% + ${y}px - 22px)`,
              }}
              whileHover={{ scale: 1.25 }}
              onMouseEnter={() => setActiveSkill(skill)}
              onClick={() => setActiveSkill(skill)}
            >
              <div className="w-11 h-11 rounded-xl border border-cyan-400/40 bg-[#0d1117]/95 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:border-cyan-400 hover:shadow-[0_0_20px_#22d3ee] transition-all">
                {getIcon(skill.icon)}
              </div>
            </motion.div>
          );
        })}

        {/* Outer Ring Nodes */}
        {ring2.map((skill, index) => {
          const angle = (index / ring2.length) * 2 * Math.PI;
          const radius = 160; // px
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={skill._id || skill.name}
              className="absolute z-20"
              style={{
                left: `calc(50% + ${x}px - 22px)`,
                top: `calc(50% + ${y}px - 22px)`,
              }}
              whileHover={{ scale: 1.25 }}
              onMouseEnter={() => setActiveSkill(skill)}
              onClick={() => setActiveSkill(skill)}
            >
              <div className="w-11 h-11 rounded-xl border border-purple-500/40 bg-[#0d1117]/95 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:border-purple-400 hover:shadow-[0_0_20px_#8b5cf6] transition-all">
                {getIcon(skill.icon)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Holographic Inspection HUD */}
      <div className="w-full max-w-md mt-6 h-28 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSkill ? (
            <motion.div
              key={activeSkill.name}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="w-full glass-panel hud-corner p-4 rounded-xl border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.15)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center">
                  {getIcon(activeSkill.icon)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    {activeSkill.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                      {activeSkill.category}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{activeSkill.description}</p>
                </div>
              </div>
              <div className="text-right pl-3 border-l border-white/10">
                <div className="text-xs font-mono font-bold text-cyan-400">{activeSkill.proficiency}%</div>
                <div className="text-[10px] text-gray-500 font-mono">{activeSkill.years}y Exp</div>
              </div>
            </motion.div>
          ) : (
            <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Hover or tap any orbiting node to inspect technical metrics
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
