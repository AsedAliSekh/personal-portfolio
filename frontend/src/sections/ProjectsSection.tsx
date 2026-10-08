import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Star } from 'lucide-react';
import { GithubIcon as Github } from '../components/icons/SocialIcons';
import type { IProject } from '../types';

interface ProjectsSectionProps {
  projects: IProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Cyber Security & AI', 'AI / ML & Full Stack', 'Three.js & Graphics', 'Backend & Cloud'];

  const filteredProjects = filterCategory === 'all'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()) || p.category === filterCategory);

  const featuredProject = projects.find(p => p.isFeatured) || projects[0];

  return (
    <section id="projects" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#050508' }}>
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/4 blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="section-eyebrow">04 // PROJECTS</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Featured Projects{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                &amp; Systems
              </span>
            </h2>
            <p className="text-sm font-mono text-gray-500 max-w-xl">
              Production web applications, intelligent neural pipelines, and high-performance security tooling.
            </p>
          </motion.div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 self-start sm:self-auto py-2 border-b border-cyan-500/25 hover:border-cyan-400 transition-all duration-300 whitespace-nowrap"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Project Spotlight */}
        {featuredProject && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 rounded-3xl border border-cyan-400/25 bg-[#0d1117]/95 overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.08)] group relative"
          >
            {/* Flagship Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090d]/90 border border-cyan-400/35 backdrop-blur-md text-[11px] font-mono text-cyan-300">
              <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>FLAGSHIP SYSTEM</span>
            </div>

            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Media Thumbnail */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[380px] overflow-hidden">
                <img
                  src={featuredProject.thumbnail}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#0d1117]/20 to-[#0d1117]" />
              </div>

              {/* Text & Content */}
              <div className="lg:col-span-5 p-7 sm:p-10 space-y-6 flex flex-col justify-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-[0.15em]">
                      {featuredProject.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{featuredProject.status || 'Live / Deployed'}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {featuredProject.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 font-sans leading-relaxed">
                  {featuredProject.shortDescription}
                </p>

                {/* Key Metrics HUD */}
                {featuredProject.statistics && featuredProject.statistics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl border border-white/6 bg-[#08090d]">
                    {featuredProject.statistics.slice(0, 3).map((st) => (
                      <div key={st.label} className="text-center">
                        <div className="text-base sm:text-lg font-bold font-mono text-cyan-400">{st.value}</div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mt-0.5">{st.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {featuredProject.technologies.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/30 text-cyan-300/80 border border-cyan-500/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    to={`/projects/${featuredProject.slug}`}
                    className="btn-cyber-primary px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {featuredProject.githubUrl && (
                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-white/8 bg-white/4 text-gray-400 hover:text-white hover:border-white/15 transition-all duration-300"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  {featuredProject.liveUrl && (
                    <a
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-white/8 bg-white/4 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${filterCategory === c
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_18px_rgba(34,211,238,0.45)]'
                : 'border border-white/8 bg-[#0d1117] text-gray-500 hover:border-white/15 hover:text-white'
                }`}
            >
              {c === 'all' ? 'All Deployments' : c}
            </button>
          ))}
        </div>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project._id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.4) }}
              className="group rounded-2xl border border-white/6 bg-[#0d1117] overflow-hidden flex flex-col hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)] transition-all duration-300"
            >
              {/* Thumbnail */}
              <Link to={`/projects/${project.slug}`} className="relative h-48 overflow-hidden block flex-shrink-0">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-600 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-70" />
                {/* Top image accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent group-hover:via-cyan-400/50 transition-all" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/85 border border-emerald-400/30 text-emerald-300 backdrop-blur-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{project.status || 'Live'}</span>
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#08090d]/85 border border-white/8 text-cyan-300/80 backdrop-blur-md">
                  {project.category}
                </span>
              </Link>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <Link to={`/projects/${project.slug}`}>
                    <h4 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {project.title}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-500 font-sans line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#111620] text-gray-400 border border-white/6"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 text-xs font-mono">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Details & Architecture</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-cyan-400 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
