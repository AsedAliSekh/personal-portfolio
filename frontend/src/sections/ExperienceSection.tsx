import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ChevronRight, Award } from 'lucide-react';
import { IExperience } from '../types';

interface ExperienceSectionProps {
  experience: IExperience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#08090d' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/4 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 mb-16"
        >
          <div className="section-eyebrow">03 // EXPERIENCES</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Experience
            </span>
          </h2>
          <p className="text-sm font-mono text-gray-500 max-w-xl">
            A track record of engineering and professional excellence.
          </p>
        </motion.div>

        {/* Chronological Timeline */}
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[19px] sm:left-[35px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

          <div className="ml-10 sm:ml-20 space-y-10">
            {experience.map((exp, index) => (
              <motion.div
                key={exp._id || exp.company}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline Cyber Node */}
                <div className="absolute -left-[51px] sm:-left-[67px] top-5 flex items-center justify-center">
                  <div className="relative w-7 h-7 rounded-full border-2 border-cyan-400/60 bg-[#08090d] flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-all" />
                  </div>
                </div>

                {/* Experience Card */}
                <div className="p-6 sm:p-8 rounded-2xl border border-white/6 bg-[#0d1117]/90 hover:border-cyan-400/25 hover:shadow-[0_0_40px_rgba(34,211,238,0.07)] transition-all duration-400 relative overflow-hidden group">
                  {/* Subtle top gradient */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent group-hover:via-cyan-400/50 transition-all duration-300" />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-white/5">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono text-sm text-cyan-400 font-semibold">{exp.company}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-400/25 text-cyan-300/80">
                          {exp.employmentType}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs font-mono text-gray-500 gap-1.5 flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400/60" />
                        <span className="text-gray-300">{exp.startDate} — {exp.endDate}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-600" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-400 mt-5 leading-relaxed font-sans">
                    {exp.description}
                  </p>

                  {/* Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mt-5 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-gray-600 block mb-2">
                        Key Responsibilities //
                      </span>
                      {exp.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-5 p-4 rounded-xl border border-purple-500/15 bg-purple-950/8">
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-purple-400/80 flex items-center gap-1.5 mb-2.5">
                        <Award className="w-3.5 h-3.5" /> Quantifiable Impact &amp; Awards
                      </span>
                      {exp.achievements.map((ach, i) => (
                        <div key={i} className="text-sm text-purple-200/80 flex items-center gap-2 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 shrink-0" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mr-1">TECH //</span>
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#11151e] text-cyan-300/80 border border-cyan-500/15 hover:border-cyan-500/35 hover:text-cyan-300 transition-colors duration-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
