import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, BookOpen, MessageSquare, Code2, Eye, 
  Activity, ArrowUpRight, CheckCircle2, ShieldCheck, 
  Clock, TrendingUp, RefreshCw, Globe, Radio
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IAnalyticsSummary } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { projects, blogPosts } = usePortfolioData();
  const [analytics, setAnalytics] = useState<IAnalyticsSummary | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await portfolioApi.getAnalytics();
      setAnalytics(data);
      const msgRes = await portfolioApi.getMessages();
      setUnreadCount(msgRes.unreadCount || 0);
    } catch (e) {
      console.error('[AdminDashboard] Failed to fetch analytics telemetry:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    // Live auto-polling every 12 seconds so traffic updates dynamically as visitors visit
    const interval = setInterval(fetchAnalytics, 12000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // Real visitor metrics from database
  const totalTraffic = analytics?.totalViews ?? 0;
  const todayTraffic = analytics?.todayViews ?? 0;
  const uniqueVisitors = analytics?.uniqueVisitors ?? 0;

  return (
    <AdminDashboardLayout activeSection="Overview & Analytics">
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-[#0d1117] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>System Command Center</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 font-normal">
                v8.2 LIVE
              </span>
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Real-time portfolio metrics, live inbound visitor transmissions, and CMS inventory.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Poll live telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'SYNCING...' : 'LIVE REFRESH'}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono text-emerald-400 whitespace-nowrap">TELEMETRY: ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* TOTAL TRAFFIC CARD: Real Live Dynamic Visitor Counter */}
          <div className="p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#0d1117] to-cyan-950/20 space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.08)]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span className="text-cyan-300 font-semibold tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                TOTAL TRAFFIC
              </span>
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-heading text-white flex items-baseline gap-2">
              <span>{totalTraffic.toLocaleString()}</span>
              <span className="text-xs font-mono font-normal text-gray-400">pageviews</span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center justify-between pt-1 border-t border-cyan-500/10">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">+{todayTraffic} today</span>
              </div>
              <span className="text-gray-400">{uniqueVisitors} unique devices</span>
            </div>
          </div>

          {/* PROJECTS DEPLOYED */}
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

          {/* PUBLISHED ARTICLES */}
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

          {/* INBOX MESSAGES */}
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

        {/* Real-Time Inbound Visitor Stream Feed */}
        <div className="p-4 sm:p-6 rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 shrink-0">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Real-Time Inbound Visitor Stream
                </h3>
                <p className="text-xs font-mono text-gray-400">
                  Live transmission log of visitors accessing the portfolio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span className="text-xs font-mono text-cyan-300">
                {analytics?.recentEvents?.length || 0} RECENT HITS RECORDED
              </span>
            </div>
          </div>

          {(!analytics?.recentEvents || analytics.recentEvents.length === 0) ? (
            <div className="p-8 text-center font-mono text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">
              No recent visitor events recorded yet. Browse the public portfolio to see transmissions register live!
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 sm:mx-0 rounded-xl border border-gray-800/60">
              <table className="w-full min-w-[620px] text-left font-mono text-xs text-gray-300">
                <thead className="bg-[#08090B] text-gray-500 uppercase border-b border-gray-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Visited Path</th>
                    <th className="p-3">Inbound Origin / Referrer</th>
                    <th className="p-3">Device / User-Agent</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {analytics.recentEvents.slice(0, 10).map((evt) => (
                    <tr key={evt._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold">
                          {evt.eventType.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-white">
                        <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-cyan-400">
                          {evt.path}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">
                        {evt.referrer ? (
                          <span className="text-cyan-400 truncate max-w-[200px] inline-block font-mono text-[11px]">
                            {evt.referrer}
                          </span>
                        ) : (
                          <span className="text-gray-500 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-600" />
                            Direct Uplink
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-400 max-w-[220px] truncate" title={evt.userAgent}>
                        {evt.userAgent ? (
                          evt.userAgent.includes('Mobile') ? 'Mobile Device' :
                          evt.userAgent.includes('Chrome') ? 'Chrome Browser' :
                          evt.userAgent.includes('Safari') ? 'Safari Browser' :
                          evt.userAgent.includes('Firefox') ? 'Firefox Browser' :
                          evt.userAgent.split(' ')[0]
                        ) : 'Direct Client'}
                      </td>
                      <td className="p-3 text-gray-400 text-[11px]">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Short-links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/admin/projects"
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-sm sm:text-base group-hover:text-cyan-300">
                Manage Projects
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Add, modify, or reorder showcase architectures.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </Link>

          <Link
            to="/admin/blog"
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-sm sm:text-base group-hover:text-purple-300">
                Author Journal Entry
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Write &amp; publish markdown technical essays.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors shrink-0 ml-2" />
          </Link>

          <Link
            to="/admin/messages"
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-white text-sm sm:text-base group-hover:text-amber-300">
                View Contact Messages
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Read inquiries from recruiters and collaborators.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors shrink-0 ml-2" />
          </Link>
        </div>

        {/* Recent Projects Table Preview */}
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 bg-[#0d1117] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg">
              Active Project Inventory
            </h3>
            <Link to="/admin/projects" className="text-xs font-mono text-cyan-400 hover:underline">
              View All Projects →
            </Link>
          </div>

          <div className="overflow-x-auto -mx-1 sm:mx-0 rounded-xl border border-gray-800/60">
            <table className="w-full min-w-[540px] text-left font-mono text-xs text-gray-300">
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
