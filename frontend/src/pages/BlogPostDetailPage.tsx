import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Clock, Tag, Share2,
  Check, ArrowRight, User, BookOpen
} from 'lucide-react';
import { portfolioApi } from '../services/api';
import { IBlogPost } from '../types';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import { RichMarkdownRenderer } from '../components/markdown/RichMarkdownRenderer';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile, blogPosts } = usePortfolioData();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      // 1. Immediately use context post if available to prevent black screen / flash
      const cached = blogPosts.find((b) => b.slug === slug);
      if (cached) {
        setPost(cached);
        setIsLoading(false);
      }

      try {
        const data = await portfolioApi.getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
        }
        portfolioApi.trackView({ eventType: 'blog_view', path: `/blog/${slug}`, targetId: slug });
      } catch (err) {
        console.error('Failed to load blog post via API:', err);
        // Fallback to local blog post if not already set
        if (!cached) {
          const fallback = blogPosts.find((b) => b.slug === slug);
          if (fallback) setPost(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, blogPosts]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>DECRYPTING EDITORIAL JOURNAL...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-2xl font-mono text-rose-400">404 // DISPATCH NOT FOUND</h2>
        <p className="text-gray-400 text-xs font-mono">
          The requested technical publication could not be resolved in the secure registry.
        </p>
        <Link to="/blog" className="text-cyan-400 underline font-mono text-sm hover:text-cyan-300">
          Return to Engineering Journal
        </Link>
      </div>
    );
  }

  const related = blogPosts.filter((b) => b.slug !== post.slug && b.isPublished).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA]">
      <Navbar initials={profile?.initials || 'AS'} resumeUrl={profile?.resumeUrl} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Engineering Journal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
              {post.category}
            </span>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {post.publishDate}
            </span>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {post.readTimeMinutes || 1} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-gray-300 font-sans italic border-l-2 border-cyan-400 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Author & Share Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                {profile?.initials || 'AS'}
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-white">{post.author}</div>
                <div className="text-[11px] font-mono text-gray-500">Security &amp; Full Stack Researcher</div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-[#0d1117] text-xs font-mono text-gray-300 hover:text-cyan-300 hover:border-cyan-400/30 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Uplink Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 h-64 sm:h-96">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Content Body Rendered via Advanced Markdown Parser */}
        <div className="py-2">
          <RichMarkdownRenderer content={post.content || ''} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-gray-500 mr-2">TAXONOMY //</span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-md text-xs font-mono bg-[#0d1117] text-cyan-300 border border-cyan-500/20"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h3 className="font-heading font-bold text-xl text-white">
              Related Journals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="p-5 rounded-xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 block transition-all group"
                >
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="font-heading font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-sans">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
};
