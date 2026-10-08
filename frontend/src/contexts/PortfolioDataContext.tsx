import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  IProfile, ISkill, IExperience, IEducation, 
  ICertification, IProject, IResearch, IAchievement, 
  IService, ITestimonial, IBlogPost, ISiteSettings 
} from '../types';
import { portfolioApi } from '../services/api';

interface PortfolioDataContextType {
  profile: IProfile | null;
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];
  projects: IProject[];
  research: IResearch[];
  achievements: IAchievement[];
  services: IService[];
  testimonials: ITestimonial[];
  blogPosts: IBlogPost[];
  siteSettings: ISiteSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [experience, setExperience] = useState<IExperience[]>([]);
  const [education, setEducation] = useState<IEducation[]>([]);
  const [certifications, setCertifications] = useState<ICertification[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [research, setResearch] = useState<IResearch[]>([]);
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<ISiteSettings | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [
        profileRes, skillsRes, expRes, eduRes, 
        certRes, projRes, resRes, achRes, 
        servRes, testRes, blogRes, setRes
      ] = await Promise.allSettled([
        portfolioApi.getProfile(),
        portfolioApi.getSkills(),
        portfolioApi.getExperience(),
        portfolioApi.getEducation(),
        portfolioApi.getCertifications(),
        portfolioApi.getProjects(),
        portfolioApi.getResearch(),
        portfolioApi.getAchievements(),
        portfolioApi.getServices(),
        portfolioApi.getTestimonials(),
        portfolioApi.getBlogPosts(),
        portfolioApi.getSettings()
      ]);

      if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
      if (skillsRes.status === 'fulfilled') {
        const sortedSkills = [...skillsRes.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSkills(sortedSkills);
      }
      if (expRes.status === 'fulfilled') {
        const sortedExp = [...expRes.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setExperience(sortedExp);
      }
      if (eduRes.status === 'fulfilled') setEducation(eduRes.value);
      if (certRes.status === 'fulfilled') setCertifications(certRes.value);
      if (projRes.status === 'fulfilled') setProjects(projRes.value);
      if (resRes.status === 'fulfilled') setResearch(resRes.value);
      if (achRes.status === 'fulfilled') setAchievements(achRes.value);
      if (servRes.status === 'fulfilled') setServices(servRes.value);
      if (testRes.status === 'fulfilled') setTestimonials(testRes.value);
      if (blogRes.status === 'fulfilled') setBlogPosts(blogRes.value);
      if (setRes.status === 'fulfilled') setSiteSettings(setRes.value);

    } catch (err: any) {
      console.error('Failed to load portfolio content', err);
      setError('Failed to synchronize dynamic portfolio database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <PortfolioDataContext.Provider
      value={{
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
        isLoading,
        error,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
