import { Router } from 'express';
import { upload, uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getMedia);
router.post('/upload', authenticate, upload.single('file'), uploadMedia);
router.delete('/:id', authenticate, deleteMedia);

export default router;
