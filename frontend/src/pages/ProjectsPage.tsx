import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ExternalLink, ArrowRight, ArrowLeft, Star, Layers, Activity } from 'lucide-react';
import { GithubIcon as Github } from '../components/icons/SocialIcons';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';

export const ProjectsPage: React.FC = () => {
  const { projects, profile } = usePortfolioData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = ['all', 'Cyber Security & AI', 'AI / ML & Full Stack', 'Three.js & Graphics', 'Backend & Cloud'];

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA]">
      <Navbar initials={profile?.initials || 'AS'} resumeUrl={profile?.resumeUrl} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Mainframe Root</span>
        </Link>

        {/* Page Title */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>PRODUCTION REPOSITORY &amp; ARTIFACTS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Complete Project Archive
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-2xl">
            A comprehensive record of deployed web applications, distributed consensus brokers, and neural architectures.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedCat === c
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'border border-gray-800 bg-[#0d1117] text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                {c === 'all' ? 'All Deployments' : c}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies, titles..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-800 bg-[#0d1117] text-xs font-mono text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <motion.div
              key={project._id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden flex flex-col hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-all group"
            >
              <Link to={`/projects/${project.slug}`} className="relative h-52 overflow-hidden block">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#08090B]/80 border border-white/10 text-cyan-300 backdrop-blur-md">
                  {project.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-400 font-sans line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#11151c] text-gray-300 border border-gray-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:text-white text-gray-400"
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
                        className="p-1.5 rounded-md hover:text-cyan-400 text-gray-400"
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
      </main>

      <Footer profile={profile} />
    </div>
  );
};
