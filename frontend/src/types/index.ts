export type UserRole = 'admin' | 'editor';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type AvailabilityStatus = 'available' | 'working' | 'learning' | 'building' | 'busy' | 'custom';

export interface IProfileStat {
  label: string;
  value: string;
  order: number;
}

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface IProfile {
  _id: string;
  name: string;
  initials: string;
  title: string;
  titles: string[];
  bio: string;
  shortBio: string;
  philosophy: string;
  location: string;
  email: string;
  availabilityStatus: AvailabilityStatus;
  statusText: string;
  avatarUrl: string;
  resumeUrl: string;
  yearsOfExperience: number;
  stats: IProfileStat[];
  socialLinks: ISocialLink[];
  terminalWhoami: string;
  updatedAt: string;
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'programming' 
  | 'ai_ml' 
  | 'cyber_security' 
  | 'devops' 
  | 'tools';

export interface ISkill {
  _id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  years: number;
  description: string;
  icon: string;
  logoUrl?: string;
  order: number;
  featured: boolean;
  orbitRadius?: number;
  speed?: number;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logoUrl?: string;
  order: number;
}

export interface IEducation {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description: string;
  coursework: string[];
  order: number;
}

export interface ICertification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateImageUrl?: string;
  description: string;
  order: number;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  status?: string;
  securityAudit?: string;
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  isFeatured: boolean;
  completionDate?: string;
  clientType?: string;
  challenges?: string;
  solution?: string;
  results?: string;
  architectureDiagram?: string;
  statistics: { label: string; value: string }[];
  order: number;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IResearch {
  _id: string;
  title: string;
  abstract: string;
  researchQuestion: string;
  methodology: string;
  dataset: string;
  model: string;
  results: string;
  publicationStatus: string;
  paperUrl?: string;
  githubUrl?: string;
  datasetUrl?: string;
  metrics: { label: string; value: string }[];
  order: number;
  published: boolean;
  createdAt: string;
}

export interface IAchievement {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  imageUrl?: string;
  url?: string;
  category: string;
  order: number;
}

export interface IService {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  enabled: boolean;
  order: number;
}

export interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  photoUrl?: string;
  content: string;
  linkedinUrl?: string;
  rating: number;
  published: boolean;
  order: number;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  publishDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface IMediaItem {
  _id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  altText?: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface IEnabledSections {
  [key: string]: boolean | undefined;
  hero: boolean;
  about: boolean;
  skills: boolean;
  techOrbit: boolean;
  experience: boolean;
  education: boolean;
  certifications: boolean;
  projects: boolean;
  research: boolean;
  cyberSecurity: boolean;
  achievements: boolean;
  services: boolean;
  testimonials: boolean;
  blog: boolean;
  terminal: boolean;
  contact: boolean;
}

export interface ISecurityPillar {
  title: string;
  description: string;
  icon?: string;
}

export interface ICyberSecurity {
  badge: string;
  headline: string;
  description: string;
  pillars: ISecurityPillar[];
  arsenalTitle: string;
  arsenalStatus: string;
  arsenalTools: string[];
}

export interface ISiteSettings {
  _id: string;
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  accentColor: string;
  ogImage: string;
  author: string;
  enabledSections: IEnabledSections;
  cyberSecurity?: ICyberSecurity;
  customCss?: string;
  updatedAt: string;
}

export interface IAnalyticsEvent {
  _id: string;
  eventType: string;
  path: string;
  targetId?: string;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
}

export interface IAnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  projectViews: number;
  blogViews: number;
  contactSubmits: number;
  popularPaths: { path: string; count: number }[];
  recentEvents?: IAnalyticsEvent[];
  activeProjects: number;
  publishedBlogs: number;
  unreadMessages: number;
}
