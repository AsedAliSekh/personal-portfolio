import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, BookOpen, MessageSquare, Code2, Eye, 
  Activity, ArrowUpRight, CheckCircle2, ShieldCheck, 
  Clock, TrendingUp 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IAnalyticsSummary } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { projects, blogPosts, skills, experience } = usePortfolioData();
  const [analytics, setAnalytics] = useState<IAnalyticsSummary | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await portfolioApi.getAnalytics();
        setAnalytics(data);
        const msgRes = await portfolioApi.getMessages();
        setUnreadCount(msgRes.unreadCount || 0);
      } catch (e) {
        console.error('Failed to fetch analytics', e);
      }
    };
    fetchAnalytics();
  }, []);

  const totalViews = (analytics?.totalViews || 0) + (projects.reduce((acc, p) => acc + (p.views || 0), 0)) + (blogPosts.reduce((acc, b) => acc + (b.views || 0), 0));

  return (
    <AdminDashboardLayout activeSection="Overview & Analytics">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-[#0d1117] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl text-white">
              System Command Center
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Real-time portfolio metrics, content management status, and inbound visitor transmissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400">DATABASE: SYNCHRONIZED</span>
          </div>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>TOTAL TRAFFIC</span>
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Project &amp; Journal Telemetry</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>PROJECTS DEPLOYED</span>
              <FolderGit2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {projects.length}
            </div>
            <div className="text-[11px] font-mono text-gray-400">
              {projects.filter(p => p.isFeatured).length} Flagship Systems
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>PUBLISHED ARTICLES</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {blogPosts.filter(b => b.isPublished).length}
            </div>
            <div className="text-[11px] font-mono text-gray-400">
              {blogPosts.length} Total Drafts &amp; Essays
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>INBOX MESSAGES</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {unreadCount}
            </div>
            <div className="text-[11px] font-mono text-amber-400">
              Unread Visitor Transmissions
            </div>
          </div>
        </div>

        {/* Quick Management Short-links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/projects"
            className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-base group-hover:text-cyan-300">
                Manage Projects
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Add, modify, or reorder showcase architectures.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          </Link>

          <Link
            to="/admin/blog"
            className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-base group-hover:text-purple-300">
                Author Journal Entry
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Write &amp; publish markdown technical essays.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
          </Link>

          <Link
            to="/admin/messages"
            className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-base group-hover:text-amber-300">
                View Contact Messages
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Read inquiries from recruiters and collaborators.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
          </Link>
        </div>

        {/* Recent Projects Table Preview */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-lg">
              Active Project Inventory
            </h3>
            <Link to="/admin/projects" className="text-xs font-mono text-cyan-400 hover:underline">
              View All Projects →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-gray-300">
              <thead className="bg-[#08090B] text-gray-500 uppercase border-b border-gray-800">
                <tr>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {projects.slice(0, 5).map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">{p.title}</td>
                    <td className="p-3 text-cyan-400">{p.category}</td>
                    <td className="p-3">{p.isFeatured ? '★ Flagship' : 'Standard'}</td>
                    <td className="p-3">{p.views || 0}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};
