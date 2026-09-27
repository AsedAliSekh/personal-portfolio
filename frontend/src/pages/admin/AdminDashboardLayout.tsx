import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, Code2, Briefcase, FolderGit2, 
  BookOpen, MessageSquare, Image, Settings, LogOut, 
  ExternalLink, ShieldCheck, ChevronRight, GraduationCap, Zap 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children, activeSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/malikhaihum/cockpit');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Skills & Tech', path: '/admin/skills', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Experience', path: '/admin/experience', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Education & Certs', path: '/admin/education', icon: <GraduationCap className="w-4 h-4" /> },
    { name: 'Cyber & Arsenal', path: '/admin/cyber', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { name: 'Services & Reviews', path: '/admin/services', icon: <Zap className="w-4 h-4" /> },
    { name: 'Blog CMS', path: '/admin/blog', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Media Uploads', path: '/admin/media', icon: <Image className="w-4 h-4" /> },
    { name: 'Settings & SEO', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F7FA] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0d1117] border-r border-gray-800/80 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              AS
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm text-white tracking-wide block">
                ADMIN CMS
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Mainframe Console
              </span>
            </div>
          </div>
          <Link to="/" target="_blank" className="text-gray-400 hover:text-white p-1" title="View Live Website">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-gray-800/80 bg-[#08090B]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center font-mono text-xs text-cyan-300">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-mono font-bold text-white truncate">{user?.name || 'Ased'}</div>
              <div className="text-[10px] font-mono text-gray-500 truncate">{user?.email || 'admin@dev'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
            <span>CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-cyan-400 uppercase">{activeSection}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-gray-800 hover:border-cyan-400/40 text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
