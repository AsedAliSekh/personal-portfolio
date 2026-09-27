import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';

export const BlogPage: React.FC = () => {
  const { blogPosts, profile } = usePortfolioData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const published = blogPosts.filter((b) => b.isPublished);

  // Extract all tags
  const allTags = Array.from(new Set(published.flatMap((b) => b.tags || [])));

  const filtered = published.filter((post) => {
    const matchesTag = selectedTag === 'all' || post.tags?.includes(selectedTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
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

        {/* Title */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>DISPATCHES &amp; TECHNICAL ESSAYS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Engineering Journal
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-2xl">
            Long-form essays on zero-trust cryptography, WebGL shader performance, distributed consensus, and local machine learning models.
          </p>
        </div>

        {/* Search & Tag Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'border border-gray-800 bg-[#0d1117] text-gray-400 hover:text-white'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'border border-gray-800 bg-[#0d1117] text-gray-400 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays, concepts..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-800 bg-[#0d1117] text-xs font-mono text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, i) => (
            <motion.article
              key={post._id || post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden flex flex-col hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-all group"
            >
              <Link to={`/blog/${post.slug}`} className="relative h-52 overflow-hidden block">
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
                    <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-400 font-sans line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[11px] font-mono text-gray-400">
                        #{t}
                      </span>
                    ))}
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
      </main>

      <Footer profile={profile} />
    </div>
  );
};
