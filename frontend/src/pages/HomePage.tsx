import React from 'react';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ResearchSection } from '../sections/ResearchSection';
import { CyberSecuritySection } from '../sections/CyberSecuritySection';
import { EducationCertificationsSection } from '../sections/EducationCertificationsSection';
import { ServicesTestimonialsSection } from '../sections/ServicesTestimonialsSection';
import { BlogPreviewSection } from '../sections/BlogPreviewSection';
import { TerminalSection } from '../sections/TerminalSection';
import { ContactSection } from '../sections/ContactSection';

export const HomePage: React.FC = () => {
  const {
    profile,
    skills,
    experience,
    education,
    certifications,
    projects,
    research,
    achievements,
    services,
    testimonials,
    blogPosts,
    siteSettings,
  } = usePortfolioData();

  const enabled = siteSettings?.enabledSections || {
    hero: true,
    about: true,
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    projects: true,
    research: true,
    cyberSecurity: true,
    services: true,
    testimonials: true,
    blog: true,
    terminal: true,
    contact: true,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA] relative selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar initials={profile?.initials || 'AS'} resumeUrl={profile?.resumeUrl} />

      <main>
        {enabled.hero !== false && <HeroSection profile={profile} />}
        {enabled.about !== false && <AboutSection profile={profile} />}
        {enabled.skills !== false && <SkillsSection skills={skills} />}
        {enabled.experience !== false && <ExperienceSection experience={experience} />}
        {enabled.projects !== false && <ProjectsSection projects={projects} />}
        {enabled.research !== false && <ResearchSection research={research} />}
        {enabled.cyberSecurity !== false && <CyberSecuritySection />}
        {(enabled.education !== false || enabled.certifications !== false) && (
          <EducationCertificationsSection
            education={education}
            certifications={certifications}
            showEducation={enabled.education !== false}
            showCertifications={enabled.certifications !== false}
          />
        )}
        {(enabled.services !== false || enabled.testimonials !== false) && (
          <ServicesTestimonialsSection
            services={services}
            testimonials={testimonials}
            showServices={enabled.services !== false}
            showTestimonials={enabled.testimonials !== false}
          />
        )}
        {enabled.blog !== false && <BlogPreviewSection posts={blogPosts} />}
        {enabled.terminal !== false && <TerminalSection profile={profile} skills={skills} projects={projects} />}
        {enabled.contact !== false && <ContactSection profile={profile} />}
      </main>

      <Footer profile={profile} />
    </div>
  );
};
