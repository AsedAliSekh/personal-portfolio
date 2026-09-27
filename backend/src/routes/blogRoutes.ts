import { Router } from 'express';
import { 
  getBlogPosts, getBlogPostBySlug, 
  createBlogPost, updateBlogPost, deleteBlogPost 
} from '../controllers/blogController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

router.post('/', authenticate, createBlogPost);
router.put('/:id', authenticate, updateBlogPost);
router.delete('/:id', authenticate, deleteBlogPost);

export default router;
