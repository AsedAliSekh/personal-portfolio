import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Database, Cpu, FlaskConical, TrendingUp } from 'lucide-react';
import { GithubIcon as Github } from '../components/icons/SocialIcons';
import type { IResearch } from '../types';

interface ResearchSectionProps {
  research: IResearch[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ research }) => {
  return (
    <section id="research" className="relative py-24 bg-[#08090B] border-t border-cyan-500/10 overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            05 // SCIENTIFIC RESEARCH  &amp; PAPERS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Academic Research &amp; Publications
          </h2>
          <p className="text-sm font-mono text-gray-400 max-w-xl">
            Here are some noteable academic research papers I've published.
          </p>
        </div>

        <div className="space-y-8">
          {research.map((item, index) => (
            <motion.div
              key={item._id || item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="inline-block text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 mb-2">
                    {item.publicationStatus}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.paperUrl && (
                    <a
                      href={item.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-lg border border-purple-400/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Paper PDF</span>
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-gray-800 bg-[#11151c] text-gray-300 hover:text-white"
                      title="Research Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Research Question & Abstract */}
              <div className="mt-4 space-y-3">
                <div className="text-xs font-mono text-cyan-300 bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/20">
                  <span className="text-gray-400">RESEARCH QUESTION: </span>
                  "{item.researchQuestion}"
                </div>

                <p className="text-sm text-gray-300 font-sans leading-relaxed">
                  {item.abstract}
                </p>
              </div>

              {/* Methodology, Dataset, Model Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/5 text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#08090B] border border-gray-800">
                  <FlaskConical className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">METHOD: {item.methodology}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#08090B] border border-gray-800">
                  <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">DATASET: {item.dataset}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#08090B] border border-gray-800">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">MODEL: {item.model}</span>
                </div>
              </div>

              {/* Empirical Findings & Metrics */}
              {item.metrics && item.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5">
                  {item.metrics.map((m) => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-[#08090B]/60">
                      <div className="text-sm sm:text-base font-bold font-mono text-purple-400">{m.value}</div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
