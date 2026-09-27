import { Router } from 'express';
import { 
  getProjects, getProjectBySlug, 
  createProject, updateProject, deleteProject, reorderProjects 
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

router.post('/', authenticate, createProject);
router.post('/reorder', authenticate, reorderProjects);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;
