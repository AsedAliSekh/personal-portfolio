import mongoose, { Schema } from 'mongoose';

// User Schema
export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  avatarUrl: { type: String, default: '' },
}, { timestamps: true });

// Profile Schema
export const ProfileSchema = new Schema({
  name: { type: String, required: true },
  initials: { type: String, default: 'AS' },
  title: { type: String, required: true },
  titles: [{ type: String }],
  bio: { type: String, required: true },
  shortBio: { type: String, default: '' },
  philosophy: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, required: true },
  availabilityStatus: { 
    type: String, 
    enum: ['available', 'working', 'learning', 'building', 'busy', 'custom'],
    default: 'available' 
  },
  statusText: { type: String, default: 'Available for opportunities' },
  avatarUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  yearsOfExperience: { type: Number, default: 3 },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  terminalWhoami: { type: String, default: 'Full Stack Engineer & Cyber Security Specialist' }
}, { timestamps: true });

// Skill Schema
export const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['frontend', 'backend', 'database', 'programming', 'ai_ml', 'cyber_security', 'devops', 'tools'],
    required: true,
    index: true
  },
  proficiency: { type: Number, min: 0, max: 100, default: 85 },
  years: { type: Number, default: 2 },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Code' },
  logoUrl: { type: String, default: '' },
  order: { type: Number, default: 0, index: true },
  featured: { type: Boolean, default: true },
  orbitRadius: { type: Number, default: 5 },
  speed: { type: Number, default: 1 }
}, { timestamps: true });

// Experience Schema
export const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  employmentType: { type: String, default: 'Full-time' },
  location: { type: String, default: '' },
  startDate: { type: String, required: true },
  endDate: { type: String, default: 'Present' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
  responsibilities: [{ type: String }],
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  logoUrl: { type: String, default: '' },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// Education Schema
export const EducationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, default: '' },
  startYear: { type: String, required: true },
  endYear: { type: String, required: true },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
  coursework: [{ type: String }],
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// Certification Schema
export const CertificationSchema = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, required: true },
  expirationDate: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  certificateImageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// Project Schema
export const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: { type: String, required: true },
  detailedDescription: { type: String, default: '' },
  category: { type: String, default: 'Full Stack', index: true },
  thumbnail: { type: String, default: '' },
  gallery: [{ type: String }],
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  caseStudyUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false, index: true },
  completionDate: { type: String, default: '' },
  clientType: { type: String, default: 'Personal Project' },
  challenges: { type: String, default: '' },
  solution: { type: String, default: '' },
  results: { type: String, default: '' },
  architectureDiagram: { type: String, default: '' },
  statistics: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  order: { type: Number, default: 0, index: true },
  published: { type: Boolean, default: true, index: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Research Schema
export const ResearchSchema = new Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  researchQuestion: { type: String, default: '' },
  methodology: { type: String, default: '' },
  dataset: { type: String, default: '' },
  model: { type: String, default: '' },
  results: { type: String, default: '' },
  publicationStatus: { type: String, default: 'Preprint' },
  paperUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  datasetUrl: { type: String, default: '' },
  metrics: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  order: { type: Number, default: 0, index: true },
  published: { type: Boolean, default: true }
}, { timestamps: true });

// Achievement Schema
export const AchievementSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  url: { type: String, default: '' },
  category: { type: String, default: 'Hackathon' },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// Service Schema
export const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Zap' },
  features: [{ type: String }],
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// Testimonial Schema
export const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  content: { type: String, required: true },
  linkedinUrl: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// BlogPost Schema
export const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: String, default: 'Admin' },
  category: { type: String, default: 'Engineering', index: true },
  tags: [{ type: String }],
  readTimeMinutes: { type: Number, default: 5 },
  publishDate: { type: String, default: '' },
  isPublished: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Message Schema
export const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  projectType: { type: String, default: '' },
  budget: { type: String, default: '' },
  timeline: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// SiteSettings Schema
export const SiteSettingsSchema = new Schema({
  siteTitle: { type: String, default: 'Portfolio // Ased' },
  metaDescription: { type: String, default: 'Full Stack Engineer, AI/ML Specialist & Security Practitioner' },
  keywords: [{ type: String }],
  accentColor: { type: String, default: '#22D3EE' },
  ogImage: { type: String, default: '' },
  author: { type: String, default: 'Ased' },
  enabledSections: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    techOrbit: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    research: { type: Boolean, default: true },
    cyberSecurity: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    terminal: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },
  cyberSecurity: {
    badge: { type: String, default: '06 // DEFENSIVE ENGINEERING & APPLIED CYBERSECURITY' },
    headline: { type: String, default: 'Offensive Awareness • Defensive Fortification' },
    description: { type: String, default: 'Building software with an adversary-first mindset. Security is an architectural foundation, not an afterthought.' },
    pillars: [{
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      icon: { type: String, default: 'KeyRound' }
    }],
    arsenalTitle: { type: String, default: 'SECURITY TOOLCHAIN & AUDITING ARSENAL' },
    arsenalStatus: { type: String, default: 'THREAT INTELLIGENCE FEED: SYNCHRONIZED' },
    arsenalTools: [{ type: String }]
  },
  customCss: { type: String, default: '' }
}, { timestamps: true });

// Analytics Schema
export const AnalyticsSchema = new Schema({
  eventType: { type: String, required: true },
  path: { type: String, required: true },
  targetId: { type: String, default: '' },
  referrer: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

// Media Schema
export const MediaSchema = new Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  size: { type: Number, default: 0 },
  altText: { type: String, default: '' },
  width: { type: Number },
  height: { type: Number },
  uploadedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
export const EducationModel = mongoose.models.Education || mongoose.model('Education', EducationSchema);
export const CertificationModel = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const ResearchModel = mongoose.models.Research || mongoose.model('Research', ResearchSchema);
export const AchievementModel = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export const BlogPostModel = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
export const AnalyticsModel = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
export const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);

