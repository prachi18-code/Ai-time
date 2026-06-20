import express from 'express';
import { generateSchedule, chatWithCoach } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate-schedule', generateSchedule);
router.post('/chat', chatWithCoach);

export default router;
