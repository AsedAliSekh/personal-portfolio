import { Router } from 'express';
import { 
  createMessage, getMessages, 
  markMessageRead, toggleArchiveMessage, deleteMessage 
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public contact submission with rate limiting
router.post('/', contactRateLimiter, createMessage);

// Protected admin endpoints (supporting both / and /messages paths)
router.get('/', authenticate, getMessages);
router.get('/messages', authenticate, getMessages);

router.patch('/:id/read', authenticate, markMessageRead);
router.patch('/messages/:id/read', authenticate, markMessageRead);

router.patch('/:id/archive', authenticate, toggleArchiveMessage);
router.patch('/messages/:id/archive', authenticate, toggleArchiveMessage);

router.delete('/:id', authenticate, deleteMessage);
router.delete('/messages/:id', authenticate, deleteMessage);

export default router;
