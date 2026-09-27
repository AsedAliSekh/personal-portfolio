import { Request, Response } from 'express';
import { dbRepository } from '../services/dbRepository.js';
import type { IProject } from '../types/index.js';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, featured, publishedOnly } = req.query;
    let projects = await dbRepository.getCollection<IProject>('projects');

    // Filter for public vs admin view
    if (publishedOnly === 'true' || publishedOnly === undefined) {
      projects = projects.filter(p => p.published !== false);
    }

    if (category && typeof category === 'string' && category !== 'All' && category !== 'all') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      projects = projects.filter(p => p.isFeatured);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.shortDescription.toLowerCase().includes(q) ||
        p.technologies?.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const project = await dbRepository.getProjectBySlug(slug);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    // Increment view count in background
    await dbRepository.incrementProjectViews(slug);

    // Fetch related projects
    const allProjects = await dbRepository.getCollection<IProject>('projects');
    const related = allProjects
      .filter(p => p.slug !== slug && (p.category === project.category || p.isFeatured))
      .slice(0, 3);

    res.json({ success: true, data: { ...project, views: (project.views || 0) + 1, related } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, shortDescription } = req.body;
    if (!title || !slug || !shortDescription) {
      res.status(400).json({ success: false, message: 'Title, slug, and short description are required.' });
      return;
    }

    const existing = await dbRepository.getProjectBySlug(slug);
    if (existing) {
      res.status(409).json({ success: false, message: 'A project with this slug already exists.' });
      return;
    }

    const newProject: Partial<IProject> = {
      title: req.body.title,
      slug: req.body.slug,
      shortDescription: req.body.shortDescription,
      detailedDescription: req.body.detailedDescription || '',
      category: req.body.category || 'Full Stack',
      thumbnail: req.body.thumbnail || '',
      gallery: req.body.gallery || [],
      technologies: req.body.technologies || [],
      githubUrl: req.body.githubUrl || '',
      liveUrl: req.body.liveUrl || '',
      caseStudyUrl: req.body.caseStudyUrl || '',
      isFeatured: Boolean(req.body.isFeatured),
      completionDate: req.body.completionDate || '',
      clientType: req.body.clientType || 'Personal Project',
      challenges: req.body.challenges || '',
      solution: req.body.solution || '',
      results: req.body.results || '',
      architectureDiagram: req.body.architectureDiagram || '',
      statistics: req.body.statistics || [],
      order: req.body.order ?? 0,
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
      views: 0
    };

    const created = await dbRepository.addItem<IProject>('projects', newProject);
    res.status(201).json({ success: true, data: created, message: 'Project created successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updated = await dbRepository.updateItem<IProject>('projects', id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.json({ success: true, data: updated, message: 'Project updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const success = await dbRepository.deleteItem('projects', id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      res.status(400).json({ success: false, message: 'Array of project IDs required.' });
      return;
    }
    await dbRepository.reorderCollection('projects', ids);
    res.json({ success: true, message: 'Projects order updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
