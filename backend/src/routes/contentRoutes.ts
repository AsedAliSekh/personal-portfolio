import { Router } from 'express';
import { 
  getProfile, updateProfile,
  skillsCrud, experienceCrud, educationCrud, certificationCrud,
  researchCrud, achievementCrud, serviceCrud, testimonialCrud,
  getSettings, updateSettings,
  recordAnalytics, getAnalyticsSummary
} from '../controllers/contentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Profile
router.get('/profile', getProfile);
router.put('/profile', authenticate, updateProfile);

// Skills
router.get('/skills', skillsCrud.getAll);
router.post('/skills', authenticate, skillsCrud.create);
router.post('/skills/reorder', authenticate, skillsCrud.reorder);
router.put('/skills/:id', authenticate, skillsCrud.update);
router.delete('/skills/:id', authenticate, skillsCrud.delete);

// Experience
router.get('/experience', experienceCrud.getAll);
router.post('/experience', authenticate, experienceCrud.create);
router.post('/experience/reorder', authenticate, experienceCrud.reorder);
router.put('/experience/:id', authenticate, experienceCrud.update);
router.delete('/experience/:id', authenticate, experienceCrud.delete);

// Education
router.get('/education', educationCrud.getAll);
router.post('/education', authenticate, educationCrud.create);
router.post('/education/reorder', authenticate, educationCrud.reorder);
router.put('/education/:id', authenticate, educationCrud.update);
router.delete('/education/:id', authenticate, educationCrud.delete);

// Certifications
router.get('/certifications', certificationCrud.getAll);
router.post('/certifications', authenticate, certificationCrud.create);
router.post('/certifications/reorder', authenticate, certificationCrud.reorder);
router.put('/certifications/:id', authenticate, certificationCrud.update);
router.delete('/certifications/:id', authenticate, certificationCrud.delete);

// Research
router.get('/research', researchCrud.getAll);
router.post('/research', authenticate, researchCrud.create);
router.post('/research/reorder', authenticate, researchCrud.reorder);
router.put('/research/:id', authenticate, researchCrud.update);
router.delete('/research/:id', authenticate, researchCrud.delete);

// Achievements
router.get('/achievements', achievementCrud.getAll);
router.post('/achievements', authenticate, achievementCrud.create);
router.put('/achievements/:id', authenticate, achievementCrud.update);
router.delete('/achievements/:id', authenticate, achievementCrud.delete);

// Services
router.get('/services', serviceCrud.getAll);
router.post('/services', authenticate, serviceCrud.create);
router.put('/services/:id', authenticate, serviceCrud.update);
router.delete('/services/:id', authenticate, serviceCrud.delete);

// Testimonials
router.get('/testimonials', testimonialCrud.getAll);
router.post('/testimonials', authenticate, testimonialCrud.create);
router.put('/testimonials/:id', authenticate, testimonialCrud.update);
router.delete('/testimonials/:id', authenticate, testimonialCrud.delete);

// Settings
router.get('/settings', getSettings);
router.put('/settings', authenticate, updateSettings);

// Analytics
router.post('/analytics', recordAnalytics);
router.get('/analytics/summary', authenticate, getAnalyticsSummary);

export default router;
