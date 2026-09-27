import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PortfolioDataProvider, usePortfolioData } from './contexts/PortfolioDataContext';
import { LoadingScreen } from './components/loader/LoadingScreen';
import { CustomCursor } from './components/cursor/CustomCursor';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin CMS Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminExperiencePage } from './pages/admin/AdminExperiencePage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminCyberPage } from './pages/admin/AdminCyberPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top helper with manual restoration
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-cyan-400 text-xs">
        <span className="animate-pulse">VERIFYING MAINFRAME CREDENTIALS...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};

// Inner App with telemetry and dynamic SEO
const AppContent: React.FC = () => {
  const { profile, siteSettings } = usePortfolioData();
  const navigate = useNavigate();

  // Stealth Global Admin Shortcut: Ctrl + Shift + A (or Cmd + Shift + A / Ctrl + Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isShiftOrAlt = e.shiftKey || e.altKey;
      if (isCmdOrCtrl && isShiftOrAlt && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigate('/malikhaihum/cockpit');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    // Dynamic Page Title
    if (siteSettings?.siteTitle) {
      document.title = siteSettings.siteTitle;
    } else if (profile?.name) {
      document.title = `${profile.name} // Futuristic Portfolio & Research`;
    }

    // Dynamic Meta Description
    if (siteSettings?.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', siteSettings.metaDescription);
    }
  }, [siteSettings, profile]);

  return (
    <>
      <ScrollToTop />
      <LoadingScreen initials={profile?.initials || 'AS'} />
      <CustomCursor />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostDetailPage />} />

        {/* Unique Stealth Admin Cockpit Route */}
        <Route path="/malikhaihum/cockpit" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedAdminRoute>
              <AdminProjectsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <ProtectedAdminRoute>
              <AdminSkillsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/experience"
          element={
            <ProtectedAdminRoute>
              <AdminExperiencePage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/education"
          element={
            <ProtectedAdminRoute>
              <AdminEducationPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cyber"
          element={
            <ProtectedAdminRoute>
              <AdminCyberPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedAdminRoute>
              <AdminServicesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedAdminRoute>
              <AdminBlogPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedAdminRoute>
              <AdminMessagesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <ProtectedAdminRoute>
              <AdminMediaPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettingsPage />
            </ProtectedAdminRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioDataProvider>
          <AppContent />
        </PortfolioDataProvider>
      </AuthProvider>
    </Router>
  );
}
