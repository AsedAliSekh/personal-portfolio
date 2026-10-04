import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, Code2, Briefcase, FolderGit2, 
  BookOpen, MessageSquare, Image, Settings, LogOut, 
  ExternalLink, ShieldCheck, ChevronRight, GraduationCap, Zap,
  Menu, X 
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close mobile navigation drawer whenever route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

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
      {/* ======================================================== */}
      {/* MOBILE SCREEN NAVBAR (Three-line Hamburger Navigation Bar) */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-gray-800/80 px-4 py-3 flex items-center justify-between shadow-lg">
        {/* Brand & Active Section */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/90 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-[0_0_12px_rgba(34,211,238,0.25)] shrink-0">
            AS
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xs text-white tracking-wide">
                ADMIN CMS
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 text-[9px] font-mono text-cyan-400 truncate max-w-[110px]">
                {activeSection}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 block truncate">
              Mainframe Console
            </span>
          </div>
        </div>

        {/* Right Controls: Live Site Link + 3-Line Menu Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            className="p-2 rounded-xl border border-gray-800 bg-[#08090B] text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Three-line Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.15)] flex items-center justify-center"
            aria-label={isMobileNavOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            title={isMobileNavOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-cyan-300" />}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE NAVIGATION DRAWER & BACKDROP OVERLAY              */}
      {/* ======================================================== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isMobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[290px] max-w-[85vw] bg-[#0d1117] border-r border-cyan-500/30 z-50 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-[#08090B]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/90 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              AS
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm text-white tracking-wide block">
                ADMIN CMS
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Navigation Menu
              </span>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Drawer Footer with User & Logout */}
        <div className="p-4 border-t border-gray-800/80 bg-[#08090B]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center font-mono text-xs text-cyan-300 shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-mono font-bold text-white truncate">{user?.name || 'Ased'}</div>
              <div className="text-[10px] font-mono text-gray-500 truncate">{user?.email || 'admin@dev'}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsMobileNavOpen(false);
              handleLogout();
            }}
            className="p-2 rounded-lg text-rose-400 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (Visible on md: and larger screens)        */}
      {/* ======================================================== */}
      <aside className="hidden md:flex md:w-64 bg-[#0d1117] border-r border-gray-800/80 flex-col shrink-0 min-h-screen sticky top-0 h-screen">
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

      {/* ======================================================== */}
      {/* MAIN ADMIN CONTENT VIEW                                   */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Topbar Header */}
        <header className="hidden md:flex h-16 bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-800 px-6 items-center justify-between shrink-0">
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

        {/* Content Body: Clean padding on mobile (p-3.5 sm:p-5 md:p-8) */}
        <main className="p-3.5 sm:p-5 md:p-8 flex-1 min-w-0 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
