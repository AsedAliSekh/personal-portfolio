import axios from 'axios';
import { 
  IProfile, ISkill, IExperience, IEducation, 
  ICertification, IProject, IResearch, IAchievement, 
  IService, ITestimonial, IBlogPost, IMessage, 
  ISiteSettings, IAnalyticsSummary, IMediaItem, IUser 
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      if (!window.location.pathname.includes('/malikhaihum/cockpit')) {
        localStorage.removeItem('portfolio_auth_token');
        localStorage.removeItem('portfolio_auth_user');
        window.location.href = '/malikhaihum/cockpit';
      }
    }
    return Promise.reject(error);
  }
);

export const portfolioApi = {
  // Public Portfolio Data
  getProfile: () => api.get<{ success: boolean; data: IProfile }>('/profile').then(r => r.data.data),
  getSkills: () => api.get<{ success: boolean; data: ISkill[] }>('/skills').then(r => r.data.data),
  getExperience: () => api.get<{ success: boolean; data: IExperience[] }>('/experience').then(r => r.data.data),
  getEducation: () => api.get<{ success: boolean; data: IEducation[] }>('/education').then(r => r.data.data),
  getCertifications: () => api.get<{ success: boolean; data: ICertification[] }>('/certifications').then(r => r.data.data),
  getProjects: () => api.get<{ success: boolean; data: IProject[] }>('/projects').then(r => r.data.data),
  getProjectBySlug: (slug: string) => api.get<{ success: boolean; data: IProject }>(`/projects/${slug}`).then(r => r.data.data),
  getResearch: () => api.get<{ success: boolean; data: IResearch[] }>('/research').then(r => r.data.data),
  getAchievements: () => api.get<{ success: boolean; data: IAchievement[] }>('/achievements').then(r => r.data.data),
  getServices: () => api.get<{ success: boolean; data: IService[] }>('/services').then(r => r.data.data),
  getTestimonials: () => api.get<{ success: boolean; data: ITestimonial[] }>('/testimonials').then(r => r.data.data),
  getBlogPosts: () => api.get<{ success: boolean; data: IBlogPost[] }>('/blog').then(r => r.data.data),
  getBlogPostBySlug: (slug: string) => api.get<{ success: boolean; data: IBlogPost }>(`/blog/${slug}`).then(r => r.data.data),
  getSettings: () => api.get<{ success: boolean; data: ISiteSettings }>('/settings').then(r => r.data.data),

  // Contact
  sendContactMessage: (data: { name: string; email: string; subject: string; message: string; projectType?: string; budget?: string; timeline?: string }) => 
    api.post<{ success: boolean; message: string }>('/contact', data).then(r => r.data),

  // Analytics View Tracker
  trackView: (data: { eventType: 'pageview' | 'project_view' | 'blog_view'; path: string; targetId?: string }) => 
    api.post('/analytics/track', data).catch(() => {}),

  // Admin Authentication
  login: (credentials: { email: string; password: string }) => 
    api.post<{ success: boolean; token: string; user: IUser; message: string }>('/auth/login', credentials).then(r => r.data),
  getMe: () => api.get<{ success: boolean; user: IUser }>('/auth/me').then(r => r.data.user),

  // Admin CMS CRUD Operations
  updateProfile: (data: Partial<IProfile>) => api.put<{ success: boolean; data: IProfile }>('/profile', data).then(r => r.data.data),
  updateSettings: (data: Partial<ISiteSettings>) => api.put<{ success: boolean; data: ISiteSettings }>('/settings', data).then(r => r.data.data),

  // Generic collection helpers for Admin
  getItems: <T>(collection: string) => api.get<{ success: boolean; data: T[] }>(`/${collection}`).then(r => r.data.data),
  createItem: <T>(collection: string, item: Partial<T>) => api.post<{ success: boolean; data: T }>(`/${collection}`, item).then(r => r.data.data),
  updateItem: <T>(collection: string, id: string, item: Partial<T>) => api.put<{ success: boolean; data: T }>(`/${collection}/${id}`, item).then(r => r.data.data),
  deleteItem: (collection: string, id: string) => api.delete<{ success: boolean }>(`/${collection}/${id}`).then(r => r.data),
  reorderItems: (collection: string, ids: string[]) => api.post<{ success: boolean }>(`/${collection}/reorder`, { ids }).then(r => r.data),

  // Admin Messages
  getMessages: () => api.get<{ success: boolean; data: IMessage[]; unreadCount: number }>('/contact/messages').then(r => r.data),
  markMessageRead: (id: string, isRead = true) => api.patch<{ success: boolean; data: IMessage }>(`/contact/messages/${id}/read`, { isRead }).then(r => r.data.data),
  deleteMessage: (id: string) => api.delete<{ success: boolean }>(`/contact/messages/${id}`).then(r => r.data),

  // Analytics Tracking & Admin Reporting
  recordAnalytics: (data: { eventType: string; path: string; referrer?: string; targetId?: string }) =>
    api.post<{ success: boolean }>('/analytics', data).then(r => r.data).catch(() => ({ success: false })),
  getAnalytics: () => api.get<{ success: boolean; data: IAnalyticsSummary }>('/analytics/summary').then(r => r.data.data),

  // Admin Media Upload
  getMedia: () => api.get<{ success: boolean; data: IMediaItem[] }>('/media').then(r => r.data.data),
  uploadMedia: (formData: FormData) => api.post<{ success: boolean; data: IMediaItem }>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data.data),
  deleteMedia: (id: string) => api.delete<{ success: boolean }>(`/media/${id}`).then(r => r.data),
};

export default api;
