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

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile, blogPosts } = usePortfolioData();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const data = await portfolioApi.getBlogPostBySlug(slug);
        setPost(data);
        portfolioApi.trackView({ eventType: 'blog_view', path: `/blog/${slug}`, targetId: slug });
      } catch (err) {
        console.error('Failed to load blog post', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

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
          <span>DECRYPTING EDITORIAL ESSAY...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-mono text-rose-400">404 // DISPATCH NOT FOUND</h2>
        <Link to="/blog" className="text-cyan-400 underline font-mono text-sm">
          Return to Engineering Journal
        </Link>
      </div>
    );
  }

  const related = blogPosts.filter(b => b.slug !== post.slug && b.isPublished).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA]">
      <Navbar initials={profile?.initials || 'AS'} resumeUrl={profile?.resumeUrl} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
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
              {post.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-gray-300 font-sans italic border-l-2 border-cyan-400 pl-4">
            {post.excerpt}
          </p>

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
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 h-64 sm:h-96">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert prose-cyan max-w-none text-gray-200 font-sans leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-2xl font-heading font-bold text-white pt-6 border-b border-white/10 pb-2">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-heading font-semibold text-cyan-300 pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('```')) {
              const lines = paragraph.split('\n');
              const code = lines.slice(1, -1).join('\n');
              return (
                <pre key={idx} className="p-4 rounded-xl border border-gray-800 bg-[#08090B] font-mono text-xs text-cyan-200 overflow-x-auto shadow-inner">
                  <code>{code}</code>
                </pre>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
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
              Related Dispatches
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
