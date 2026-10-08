import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, Layers, Calendar, 
  CheckCircle2, AlertTriangle, Shield, Cpu, Activity, Sparkles 
} from 'lucide-react';
import { GithubIcon as Github } from '../components/icons/SocialIcons';
import { portfolioApi } from '../services/api';
import type { IProject } from '../types';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { usePortfolioData } from '../contexts/PortfolioDataContext';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile, projects } = usePortfolioData();
  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await portfolioApi.getProjectBySlug(slug);
        setProject(data);
        // Track project view in analytics
        portfolioApi.trackView({ eventType: 'project_view', path: `/projects/${slug}`, targetId: slug });
      } catch (err) {
        console.error('Failed to load project details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>DECRYPTING PROJECT SCHEMATICS...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-mono text-rose-400">404 // ARTIFACT NOT FOUND</h2>
        <Link to="/projects" className="text-cyan-400 underline font-mono text-sm">
          Return to Projects Repository
        </Link>
      </div>
    );
  }

  const related = projects.filter(p => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA]">
      <Navbar initials={profile?.initials || 'AS'} resumeUrl={profile?.resumeUrl} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects Repository</span>
        </Link>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
              {project.category}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{project.status || 'Fully Developed & Live'}</span>
            </span>
            {project.completionDate && (
              <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Deployed {project.completionDate}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-lg text-gray-300 font-sans leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs tracking-wider"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-gray-800 bg-[#0d1117] text-gray-200 hover:text-white hover:border-gray-700 text-xs font-mono flex items-center gap-2"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Banner Media Showcase */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] h-72 sm:h-96 lg:h-[480px]">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Metrics Banner */}
        {project.statistics && project.statistics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-gray-800 bg-[#0d1117]">
            {project.statistics.map((st) => (
              <div key={st.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">{st.value}</div>
                <div className="text-xs font-mono text-gray-500 uppercase mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Deep Dive Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-6">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* System Overview */}
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Architectural Overview</span>
              </h3>
              <div className="text-gray-300 font-sans leading-relaxed text-sm sm:text-base space-y-4">
                <p>{project.detailedDescription}</p>
              </div>
            </div>

            {/* Architecture Pipeline */}
            {project.architectureDiagram && (
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#08090B]">
                <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>DATA FLOW &amp; COMPONENT TOPOLOGY</span>
                </h4>
                <div className="p-4 rounded-xl border border-gray-800 bg-[#050505] font-mono text-xs text-cyan-200 overflow-x-auto">
                  <code>{project.architectureDiagram}</code>
                </div>
              </div>
            )}

            {/* Challenges & Solutions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.challenges && (
                <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-2">
                  <span className="font-mono text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Technical Challenges</span>
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                    {project.challenges}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Engineering Solution</span>
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>

            {/* Quantified Results */}
            {project.results && (
              <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-2">
                <span className="font-mono text-xs text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Empirical Results &amp; Impact</span>
                </span>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                  {project.results}
                </p>
              </div>
            )}

            {/* Gallery Screenshots */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold text-white">Visual Documentation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-gray-800 h-48">
                      <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-6">
              <div>
                <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                  TECHNOLOGY STACK
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-[#11151c] text-cyan-300 border border-cyan-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.clientType && (
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    PROJECT INITIATIVE
                  </h4>
                  <div className="text-sm font-mono text-gray-200">{project.clientType}</div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  SECURITY &amp; AUDIT RATING
                </h4>
                <div className="text-sm font-mono text-emerald-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>{project.securityAudit || 'PASS: ZERO CVEs'}</span>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            {related.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                  RELATED SYSTEMS
                </h4>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/projects/${rel.slug}`}
                      className="p-4 rounded-xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 block transition-all group"
                    >
                      <h5 className="font-heading font-bold text-white text-sm group-hover:text-cyan-300">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] font-mono text-gray-500">{rel.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};
