import { Request, Response } from 'express';
import { dbRepository } from '../services/dbRepository.js';

// Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await dbRepository.getProfile();
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbRepository.updateProfile(req.body);
    res.json({ success: true, data: updated, message: 'Profile updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generic CRUD factory
const createCrudHandlers = (collectionKey: string, itemName: string) => {
  return {
    getAll: async (req: Request, res: Response): Promise<void> => {
      try {
        const items = await dbRepository.getCollection(collectionKey);
        res.json({ success: true, data: items });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const item = await dbRepository.getItem(collectionKey, req.params.id as string);
        if (!item) {
          res.status(404).json({ success: false, message: `${itemName} not found.` });
          return;
        }
        res.json({ success: true, data: item });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const created = await dbRepository.addItem(collectionKey, req.body);
        res.status(201).json({ success: true, data: created, message: `${itemName} created successfully.` });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const updated = await dbRepository.updateItem(collectionKey, req.params.id as string, req.body);
        if (!updated) {
          res.status(404).json({ success: false, message: `${itemName} not found.` });
          return;
        }
        res.json({ success: true, data: updated, message: `${itemName} updated successfully.` });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
    delete: async (req: Request, res: Response): Promise<void> => {
      try {
        const success = await dbRepository.deleteItem(collectionKey, req.params.id as string);
        if (!success) {
          res.status(404).json({ success: false, message: `${itemName} not found.` });
          return;
        }
        res.json({ success: true, message: `${itemName} deleted successfully.` });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
    reorder: async (req: Request, res: Response): Promise<void> => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
          res.status(400).json({ success: false, message: 'Array of item IDs required.' });
          return;
        }
        await dbRepository.reorderCollection(collectionKey, ids);
        res.json({ success: true, message: `${itemName} order updated successfully.` });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };
};

export const skillsCrud = createCrudHandlers('skills', 'Skill');
export const experienceCrud = createCrudHandlers('experience', 'Experience');
export const educationCrud = createCrudHandlers('education', 'Education');
export const certificationCrud = createCrudHandlers('certifications', 'Certification');
export const researchCrud = createCrudHandlers('research', 'Research');
export const achievementCrud = createCrudHandlers('achievements', 'Achievement');
export const serviceCrud = createCrudHandlers('services', 'Service');
export const testimonialCrud = createCrudHandlers('testimonials', 'Testimonial');

// Settings
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await dbRepository.getSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbRepository.updateSettings(req.body);
    res.json({ success: true, data: updated, message: 'Settings updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analytics
export const recordAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, path, targetId, referrer } = req.body;
    if (!eventType || !path) {
      res.status(400).json({ success: false, message: 'eventType and path are required.' });
      return;
    }
    const event = await dbRepository.recordAnalytics({
      eventType,
      path,
      targetId,
      referrer,
      userAgent: req.headers['user-agent']
    });
    const counts = await dbRepository.getVisitorCount();
    res.status(201).json({ success: true, data: event, ...counts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVisitorCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const counts = await dbRepository.getVisitorCount();
    res.json({ success: true, data: counts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await dbRepository.getAnalyticsSummary();
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
