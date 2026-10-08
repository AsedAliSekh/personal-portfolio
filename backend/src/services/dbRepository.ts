import {
  UserModel, ProfileModel, SkillModel, ExperienceModel,
  EducationModel, CertificationModel, ProjectModel, ResearchModel,
  AchievementModel, ServiceModel, TestimonialModel, BlogPostModel,
  MessageModel, SiteSettingsModel, AnalyticsModel, MediaModel
} from '../models/schemas.js';
import type {
  IUser, IProfile, ISkill, IExperience, IEducation,
  ICertification, IProject, IResearch, IAchievement,
  IService, ITestimonial, IBlogPost, IMessage,
  ISiteSettings, IAnalyticsEvent, IMediaItem
} from '../types/index.js';
import { store } from './store.js';
// Map collection names to corresponding Mongoose models
const modelMap: Record<string, any> = {
  skills: SkillModel,
  experience: ExperienceModel,
  education: EducationModel,
  certifications: CertificationModel,
  projects: ProjectModel,
  research: ResearchModel,
  achievements: AchievementModel,
  services: ServiceModel,
  testimonials: TestimonialModel,
  blogPosts: BlogPostModel,
  messages: MessageModel,
  media: MediaModel
};

export class DbRepository {
  // ================= USERS =================
  public async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean() as any;
    if (!user) return null;
    return { ...user, _id: user._id.toString() } as IUser;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id).lean() as any;
      if (!user) return null;
      return { ...user, _id: user._id.toString() } as IUser;
    } catch {
      return null;
    }
  }

  public async addUser(user: IUser): Promise<IUser> {
    const doc = await UserModel.create({ ...user, _id: undefined });
    return { ...doc.toObject(), _id: doc._id.toString() } as IUser;
  }

  public async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      const doc = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean() as any;
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() } as IUser;
    } catch {
      return null;
    }
  }

  // ================= PROFILE =================
  public async getProfile(): Promise<IProfile> {
    const doc = await ProfileModel.findOne().lean() as any;
    if (doc) {
      return { ...doc, _id: doc._id.toString() } as IProfile;
    }
    // Return default empty profile structure if not yet initialized
    return {
      _id: 'profile_default',
      name: 'Ased',
      initials: 'AS',
      title: 'Full Stack Engineer & Cyber Systems Architect',
      titles: ['Full Stack Engineer', 'Cyber Systems Architect', 'AI/ML Specialist'],
      bio: 'Engineering high-throughput systems and resilient architectures.',
      shortBio: 'Full Stack Engineer & Cyber Systems Architect',
      philosophy: 'Code as an art form, security as a fundamental axiom.',
      location: 'Global / Remote',
      email: 'admin@portfolio.dev',
      availabilityStatus: 'available',
      statusText: 'Accepting High-Impact Projects',
      avatarUrl: '',
      resumeUrl: '/uploads/sample_resume.pdf',
      yearsOfExperience: 5,
      stats: [
        { label: 'Years Experience', value: '5+', order: 0 },
        { label: 'Projects Completed', value: '24+', order: 1 }
      ],
      socialLinks: [],
      terminalWhoami: 'Ased // Full Stack & Cyber Systems Architect',
      updatedAt: new Date().toISOString()
    };
  }

  public async updateProfile(updates: Partial<IProfile>): Promise<IProfile> {
    const doc = await ProfileModel.findOneAndUpdate({}, updates, { new: true, upsert: true }).lean() as any;
    return { ...doc, _id: doc._id?.toString() || 'primary_profile' } as IProfile;
  }

  // ================= SITE SETTINGS =================
  public async getSettings(): Promise<ISiteSettings> {
    const doc = await SiteSettingsModel.findOne().lean() as any;
    if (doc) {
      return { ...doc, _id: doc._id.toString() } as ISiteSettings;
    }
    return {
      _id: 'default_settings',
      siteTitle: 'Ased // Full Stack & Cyber Systems Architect',
      metaDescription: 'High-performance portfolio engine powered by MongoDB Atlas.',
      keywords: ['Full Stack', 'Engineer', 'Developer', 'Security'],
      accentColor: '#22d3ee',
      ogImage: '',
      author: 'Ased',
      enabledSections: {
        hero: true,
        about: true,
        skills: true,
        techOrbit: true,
        experience: true,
        education: true,
        certifications: true,
        projects: true,
        research: true,
        cyberSecurity: true,
        achievements: true,
        services: true,
        testimonials: true,
        blog: true,
        terminal: true,
        contact: true
      },
      updatedAt: new Date().toISOString()
    };
  }

  public async updateSettings(updates: Partial<ISiteSettings>): Promise<ISiteSettings> {
    const doc = await SiteSettingsModel.findOneAndUpdate({}, updates, { new: true, upsert: true }).lean() as any;
    return { ...doc, _id: doc._id?.toString() || 'primary_settings' } as ISiteSettings;
  }

  // ================= GENERIC COLLECTIONS =================
  public async getCollection<T extends { _id: string; order?: number }>(key: string): Promise<T[]> {
    const Model = modelMap[key];
    if (!Model) return [];
    const docs = await Model.find().sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
  }

  public async getItem<T extends { _id: string }>(key: string, id: string): Promise<T | null> {
    const Model = modelMap[key];
    if (!Model) return null;
    try {
      const doc = await Model.findById(id).lean();
      if (!doc) return null;
      return { ...(doc as any), _id: (doc as any)._id.toString() };
    } catch {
      return null;
    }
  }

  public async addItem<T extends { _id: string; order?: number }>(key: string, item: any): Promise<T> {
    const Model = modelMap[key];
    if (!Model) throw new Error(`Collection model not found for ${key}`);
    const count = await Model.countDocuments();
    if (item.order === undefined) item.order = count;
    const { _id, ...rest } = item;
    const doc = await Model.create(rest);
    return { ...doc.toObject(), _id: doc._id.toString() };
  }

  public async updateItem<T extends { _id: string }>(key: string, id: string, updates: Partial<T>): Promise<T | null> {
    const Model = modelMap[key];
    if (!Model) return null;
    try {
      const { _id, ...cleanUpdates } = updates as any;
      const doc = await Model.findByIdAndUpdate(id, cleanUpdates, { new: true }).lean();
      if (!doc) return null;
      return { ...(doc as any), _id: (doc as any)._id.toString() };
    } catch {
      return null;
    }
  }

  public async deleteItem(key: string, id: string): Promise<boolean> {
    const Model = modelMap[key];
    if (!Model) return false;
    try {
      await Model.findByIdAndDelete(id);
      return true;
    } catch {
      return false;
    }
  }

  public async reorderCollection(key: string, orderedIds: string[]): Promise<boolean> {
    const Model = modelMap[key];
    if (Model) {
      const updates = orderedIds.map((id, index) => {
        try {
          return Model.findByIdAndUpdate(id, { order: index }).exec();
        } catch {
          return Promise.resolve();
        }
      });
      await Promise.allSettled(updates);
    }
    try {
      store.reorderCollection(key as any, orderedIds);
    } catch {
      // ignore
    }
    return true;
  }

  // ================= PROJECTS =================
  public async getProjectBySlug(slug: string): Promise<IProject | null> {
    const doc = await ProjectModel.findOne({ slug }).lean() as any;
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as IProject;
  }

  public async incrementProjectViews(slug: string): Promise<number> {
    const doc = await ProjectModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).lean() as any;
    return doc ? doc.views : 1;
  }

  // ================= BLOG =================
  public async getBlogPostBySlug(slug: string): Promise<IBlogPost | null> {
    const doc = await BlogPostModel.findOne({ slug }).lean() as any;
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as IBlogPost;
  }

  public async incrementBlogViews(slug: string): Promise<number> {
    const doc = await BlogPostModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).lean() as any;
    return doc ? doc.views : 1;
  }

  // ================= MESSAGES =================
  public async createMessage(msg: Omit<IMessage, '_id' | 'createdAt' | 'isRead' | 'isArchived'>): Promise<IMessage> {
    const doc = await MessageModel.create({
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      projectType: msg.projectType || 'General Consultation',
      budget: msg.budget || '',
      timeline: msg.timeline || '',
      isRead: false,
      isArchived: false
    });
    return { ...doc.toObject(), _id: doc._id.toString() } as IMessage;
  }

  // ================= ANALYTICS =================
  public async getVisitorCount(): Promise<{ totalVisitors: number; todayVisitors: number; uniqueVisitors: number }> {
    try {
      const totalViews = await AnalyticsModel.countDocuments({ eventType: 'pageview' });
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayViews = await AnalyticsModel.countDocuments({
        eventType: 'pageview',
        timestamp: { $gte: startOfToday }
      });

      const distinctAgents = await AnalyticsModel.distinct('userAgent', { eventType: 'pageview' });
      const uniqueVisitors = Math.max(distinctAgents.length, totalViews > 0 ? 1 : 0);

      return {
        totalVisitors: Math.max(totalViews, 1),
        todayVisitors: Math.max(todayViews, 1),
        uniqueVisitors
      };
    } catch {
      const summary = store.getAnalyticsSummary();
      return {
        totalVisitors: Math.max(summary.totalViews, 1),
        todayVisitors: Math.max(summary.todayViews, 1),
        uniqueVisitors: Math.max(summary.uniqueVisitors, 1)
      };
    }
  }

  public async recordAnalytics(event: Omit<IAnalyticsEvent, '_id' | 'timestamp'>): Promise<IAnalyticsEvent> {
    try {
      const doc = await AnalyticsModel.create(event);
      return { ...doc.toObject(), _id: doc._id.toString(), timestamp: doc.timestamp.toISOString() };
    } catch {
      return store.recordAnalytics(event);
    }
  }

  public async getAnalyticsSummary(): Promise<any> {
    try {
      const totalViews = await AnalyticsModel.countDocuments({ eventType: 'pageview' });
      const projectViews = await AnalyticsModel.countDocuments({ eventType: 'project_view' });
      const blogViews = await AnalyticsModel.countDocuments({ eventType: 'blog_view' });
      const contactSubmits = await MessageModel.countDocuments();

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayViews = await AnalyticsModel.countDocuments({
        eventType: 'pageview',
        timestamp: { $gte: startOfToday }
      });

      const distinctAgents = await AnalyticsModel.distinct('userAgent', { eventType: 'pageview' });
      const uniqueVisitors = Math.max(distinctAgents.length, totalViews > 0 ? 1 : 0);

      const popularPathsAgg = await AnalyticsModel.aggregate([
        { $match: { eventType: 'pageview' } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      const popularPaths = popularPathsAgg.map((p: any) => ({ path: p._id, count: p.count }));

      const recentEvents = await AnalyticsModel.find()
        .sort({ timestamp: -1 })
        .limit(20)
        .lean();

      return {
        totalViews,
        uniqueVisitors,
        todayViews,
        projectViews,
        blogViews,
        contactSubmits,
        popularPaths,
        recentEvents: recentEvents.map((e: any) => ({ ...e, _id: e._id.toString() }))
      };
    } catch {
      return store.getAnalyticsSummary();
    }
  }
}

export const dbRepository = new DbRepository();
