import express from 'express';
import { getUserDashboard, getLeaderboard } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { calculateFootprint } from '../controllers/userController.js';


const router = express.Router();

router.get('/dashboard', protect, getUserDashboard);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/calculate-footprint', protect, calculateFootprint);

export default router;
