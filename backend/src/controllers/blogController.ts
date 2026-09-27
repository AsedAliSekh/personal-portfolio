import { Request, Response } from 'express';
import { dbRepository } from '../services/dbRepository.js';
import type { IBlogPost } from '../types/index.js';

export const getBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag, search, featured, publishedOnly, page = '1', limit = '10' } = req.query;
    let posts = await dbRepository.getCollection<IBlogPost>('blogPosts');

    if (publishedOnly === 'true' || publishedOnly === undefined) {
      posts = posts.filter(p => p.isPublished !== false);
    }

    if (category && typeof category === 'string' && category !== 'All' && category !== 'all') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (tag && typeof tag === 'string') {
      posts = posts.filter(p => p.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (featured === 'true') {
      posts = posts.filter(p => p.isFeatured);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort descending by publish date
    posts.sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const total = posts.length;
    const paginated = posts.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    // Extract unique categories and tags
    const allPosts = await dbRepository.getCollection<IBlogPost>('blogPosts');
    const allCategories = Array.from(new Set(allPosts.map(p => p.category)));
    const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags || [])));

    res.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        categories: allCategories,
        tags: allTags
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const post = await dbRepository.getBlogPostBySlug(slug);

    if (!post) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    await dbRepository.incrementBlogViews(slug);

    // Related posts
    const allPosts = await dbRepository.getCollection<IBlogPost>('blogPosts');
    const related = allPosts
      .filter(p => p.slug !== slug && (p.category === post.category || p.isFeatured))
      .slice(0, 3);

    res.json({ success: true, data: { ...post, views: (post.views || 0) + 1, related } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, excerpt, content } = req.body;
    if (!title || !slug || !excerpt || !content) {
      res.status(400).json({ success: false, message: 'Title, slug, excerpt, and content are required.' });
      return;
    }

    const existing = await dbRepository.getBlogPostBySlug(slug);
    if (existing) {
      res.status(409).json({ success: false, message: 'An article with this slug already exists.' });
      return;
    }

    // Auto calculate reading time (~200 words per minute)
    const words = content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const newPost: Partial<IBlogPost> = {
      title: req.body.title,
      slug: req.body.slug,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage || '',
      author: req.body.author || 'Ased',
      category: req.body.category || 'Engineering',
      tags: req.body.tags || [],
      readTimeMinutes,
      publishDate: req.body.publishDate || new Date().toISOString().split('T')[0],
      isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
      isFeatured: Boolean(req.body.isFeatured),
      seoTitle: req.body.seoTitle || req.body.title,
      seoDescription: req.body.seoDescription || req.body.excerpt,
      views: 0
    };

    const created = await dbRepository.addItem<IBlogPost>('blogPosts', newPost);
    res.status(201).json({ success: true, data: created, message: 'Article created successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates = { ...req.body };

    if (updates.content) {
      const words = updates.content.trim().split(/\s+/).length;
      updates.readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    }

    const updated = await dbRepository.updateItem<IBlogPost>('blogPosts', id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    res.json({ success: true, data: updated, message: 'Article updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const success = await dbRepository.deleteItem('blogPosts', id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
