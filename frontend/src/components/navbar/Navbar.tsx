import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  initials?: string;
  resumeUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ initials = 'AS', resumeUrl = '/uploads/sample_resume.pdf' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoPulse, setLogoPulse] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Secret Logo Multi-Click Tracker
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Blog', href: '#blog' },
    { name: 'Terminal', href: '#terminal' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        window.location.href = '/' + href;
        return;
      }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Secret Trigger: 5 rapid clicks on the logo navigates to /malikhaihum/cockpit
  const handleLogoClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;

    // Visual pulse when user is tapping secret trigger
    if (clickCountRef.current >= 3) {
      setLogoPulse(true);
      setTimeout(() => setLogoPulse(false), 300);
    }

    if (clickCountRef.current >= 5) {
      e.preventDefault();
      clickCountRef.current = 0;
      navigate('/malikhaihum/cockpit');
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setLogoPulse(false);
    }, 2500);

    // Standard behavior on normal click
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#08090B]/85 backdrop-blur-xl border-b border-cyan-500/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo with Stealth 5-Click Admin Access */}
        <div
          onClick={handleLogoClick}
          className="group flex items-center gap-3 focus:outline-none cursor-pointer select-none"
        >
          <div className={`relative w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-black text-cyan-300 transition-all ${
            logoPulse
              ? 'border-purple-400 bg-purple-950/60 shadow-[0_0_25px_#a855f7] scale-105'
              : 'border-cyan-400/40 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_#22d3ee]'
          }`}>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-400" />
            {initials}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-[#0d1117]/60 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="px-3 py-1 text-xs font-mono tracking-wide text-gray-300 hover:text-cyan-300 transition-colors rounded-full hover:bg-white/5"
              >
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1 text-xs font-mono tracking-wide text-gray-300 hover:text-cyan-300 transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              >
                {link.name}
              </button>
            )
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono px-4 py-2 rounded-lg border border-cyan-400/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>

          {/* Admin CMS indicator - ONLY shown if currently authenticated */}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-cyan-400/40 bg-cyan-950/30 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all"
              title="CMS Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>CMS</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg border border-cyan-400/30 bg-[#0d1117] text-cyan-300 hover:border-cyan-400 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#08090B]/98 border-b border-cyan-500/20 px-6 py-6 overflow-hidden backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-mono text-gray-300 hover:text-cyan-300 py-2 border-b border-gray-800/50 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-gray-600">→</span>
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left text-sm font-mono text-gray-300 hover:text-cyan-300 py-2 border-b border-gray-800/50 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-gray-600">#</span>
                  </button>
                )
              ))}

              <div className="pt-4 flex flex-col gap-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyan-400/40 bg-cyan-950/20 text-cyan-300 text-xs font-mono"
                >
                  <FileText className="w-4 h-4" /> Download Resume
                </a>
                {/* Admin CMS link in drawer ONLY if authenticated */}
                {isAuthenticated && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-mono"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
