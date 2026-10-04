import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import { IBlogPost } from '../types';

interface BlogPreviewSectionProps {
  posts: IBlogPost[];
}

export const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ posts }) => {
  const publishedPosts = posts.filter(p => p.isPublished).slice(0, 3);

  return (
    <section id="blog" className="relative py-24 bg-[#08090B] border-t border-cyan-500/10 overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>11 // TECHNICAL JOURNALS </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineering Insights &nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                &amp; Deep Dives
              </span>
            </h2>
            <p className="text-sm font-mono text-gray-400 max-w-xl">
              In-depth architectural breakdowns on zero-trust security, real-time WebGL graphics, and localized AI models.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 self-start sm:self-auto py-2 border-b border-cyan-500/30 hover:border-cyan-400 transition-colors"
          >
            <span>Browse Full Editorial Journal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedPosts.map((post, i) => (
            <motion.article
              key={post._id || post.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden flex flex-col hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-all group"
            >
              <Link to={`/blog/${post.slug}`} className="relative h-48 overflow-hidden block">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#08090B]/80 border border-white/10 text-cyan-300 backdrop-blur-md">
                  {post.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-400 font-sans line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>{post.tags?.[0] || 'Tech'}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
