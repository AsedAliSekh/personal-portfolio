import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  IUser, IProfile, ISkill, IExperience, IEducation, 
  ICertification, IProject, IResearch, IAchievement, 
  IService, ITestimonial, IBlogPost, IMessage, 
  ISiteSettings, IAnalyticsEvent, IMediaItem 
} from '../types/index.js';

interface DatabaseSchema {
  users: IUser[];
  profile: IProfile;
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
  messages: IMessage[];
  siteSettings: ISiteSettings;
  analytics: IAnalyticsEvent[];
  media: IMediaItem[];
}

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'store.json');

class ResilientStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[Store] Error reading store.json, initializing empty state', e);
    }
    return this.getDefaults();
  }

  public save() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[Store] Error saving store.json', e);
    }
  }

  public getDefaults(): DatabaseSchema {
    return {
      users: [],
      profile: {
        _id: 'profile_default',
        name: 'Ased',
        initials: 'AS',
        title: 'Full Stack Developer & AI / Cyber Security Enthusiast',
        titles: [
          'Full Stack Developer',
          'AI / ML Practitioner',
          'Cyber Security Specialist',
          'System Architect'
        ],
        bio: 'Passionate computer science professional building scalable web architectures, intelligent AI models, and resilient security systems with precision craftsmanship.',
        shortBio: 'I build scalable web applications, intelligent systems and secure digital experiences.',
        philosophy: 'Code should be clean, resilient, and visually captivating. Technology is the bridge between human curiosity and tangible impact.',
        location: 'Bengaluru / Remote',
        email: 'ased@portfolio.dev',
        availabilityStatus: 'available',
        statusText: 'Available for high-impact opportunities',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        resumeUrl: '/api/media/resume.pdf',
        yearsOfExperience: 3,
        stats: [
          { label: 'Completed Projects', value: '18+', order: 1 },
          { label: 'Years Experience', value: '3+', order: 2 },
          { label: 'Open Source Repos', value: '25+', order: 3 },
          { label: 'Security Audits', value: '12+', order: 4 }
        ],
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com', icon: 'Github' },
          { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
          { platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter' },
          { platform: 'Email', url: 'mailto:ased@portfolio.dev', icon: 'Mail' }
        ],
        terminalWhoami: 'ased@mainframe:~$ Software Engineer & Cyber Researcher',
        updatedAt: new Date().toISOString()
      },
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      research: [],
      achievements: [],
      services: [],
      testimonials: [],
      blogPosts: [],
      messages: [],
      siteSettings: {
        _id: 'settings_default',
        siteTitle: 'Ased // Full Stack & Cyber Portfolio',
        metaDescription: 'Futuristic portfolio of Ased - Full Stack Developer, AI/ML Specialist, and Cyber Security Practitioner.',
        keywords: ['Full Stack', 'React', 'Three.js', 'Node.js', 'Cyber Security', 'AI/ML', 'Computer Science'],
        accentColor: '#22D3EE',
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
        customCss: '',
        updatedAt: new Date().toISOString()
      },
      analytics: [],
      media: []
    };
  }

  // Users
  public getUsers() { return this.data.users; }
  public getUserById(id: string) { return this.data.users.find(u => u._id === id); }
  public getUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  public addUser(user: IUser) { 
    this.data.users.push(user); 
    this.save(); 
    return user; 
  }
  public updateUser(id: string, updates: Partial<IUser>) {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // Profile
  public getProfile() { return this.data.profile; }
  public updateProfile(updates: Partial<IProfile>) {
    this.data.profile = { ...this.data.profile, ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.profile;
  }

  // Generic collection helpers
  public getCollection<T extends { _id: string; order?: number }>(key: keyof DatabaseSchema): T[] {
    const col = this.data[key] as unknown as T[];
    if (Array.isArray(col)) {
      return [...col].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return [];
  }

  public getItem<T extends { _id: string }>(key: keyof DatabaseSchema, id: string): T | undefined {
    const col = this.data[key] as unknown as T[];
    return col.find(item => item._id === id);
  }

  public addItem<T extends { _id: string; order?: number }>(key: keyof DatabaseSchema, item: T): T {
    const col = this.data[key] as unknown as T[];
    if (!item._id) {
      item._id = 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    }
    if (item.order === undefined) {
      item.order = col.length;
    }
    col.push(item);
    this.save();
    return item;
  }

  public updateItem<T extends { _id: string }>(key: keyof DatabaseSchema, id: string, updates: Partial<T>): T | null {
    const col = this.data[key] as unknown as T[];
    const idx = col.findIndex(item => item._id === id);
    if (idx !== -1) {
      col[idx] = { ...col[idx], ...updates };
      this.save();
      return col[idx];
    }
    return null;
  }

  public deleteItem<T extends { _id: string }>(key: keyof DatabaseSchema, id: string): boolean {
    const col = this.data[key] as unknown as T[];
    const idx = col.findIndex(item => item._id === id);
    if (idx !== -1) {
      col.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public reorderCollection<T extends { _id: string; order?: number }>(key: keyof DatabaseSchema, orderedIds: string[]): boolean {
    const col = this.data[key] as unknown as T[];
    orderedIds.forEach((id, index) => {
      const item = col.find(it => it._id === id);
      if (item) {
        item.order = index;
      }
    });
    this.save();
    return true;
  }

  // Site Settings
  public getSettings() { return this.data.siteSettings; }
  public updateSettings(updates: Partial<ISiteSettings>) {
    this.data.siteSettings = { ...this.data.siteSettings, ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.siteSettings;
  }

  // Analytics
  public recordEvent(event: Omit<IAnalyticsEvent, '_id' | 'timestamp'>) {
    const item: IAnalyticsEvent = {
      ...event,
      _id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString()
    };
    this.data.analytics.push(item);
    // Keep last 5000 events
    if (this.data.analytics.length > 5000) {
      this.data.analytics.shift();
    }
    this.save();
    return item;
  }

  public getAnalyticsSummary() {
    const totalViews = this.data.analytics.filter(e => e.eventType === 'pageview').length;
    const projectViews = this.data.analytics.filter(e => e.eventType === 'project_view').length;
    const blogViews = this.data.analytics.filter(e => e.eventType === 'blog_view').length;
    const contactSubmits = this.data.analytics.filter(e => e.eventType === 'contact_submit').length;

    // Aggregate by path
    const pathCounts: Record<string, number> = {};
    this.data.analytics.forEach(e => {
      pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
    });

    const popularPaths = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalViews,
      projectViews,
      blogViews,
      contactSubmits,
      popularPaths,
      recentEvents: this.data.analytics.slice(-20).reverse()
    };
  }

  public seedAll(data: Partial<DatabaseSchema>) {
    this.data = {
      ...this.getDefaults(),
      ...data
    };
    this.save();
  }
}

export const store = new ResilientStore();
