import express from 'express';
import { logFocusSession, getWeeklyAnalytics } from '../controllers/focusController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/focus-sessions', logFocusSession);
router.get('/analytics/weekly', getWeeklyAnalytics);

export default router;
