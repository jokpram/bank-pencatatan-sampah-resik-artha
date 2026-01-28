import express from 'express';
import userController from '../controllers/userController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/stats', verifyToken, userController.getUserStats);

// Admin Routes (Can be here or adminRoutes, putting here for simplicity as requested)
// Admin Routes (Can be here or adminRoutes, putting here for simplicity as requested)
router.get('/', verifyToken, checkRole(['officer', 'admin']), userController.getAllUsers);

router.get('/leaderboard', verifyToken, userController.getLeaderboard);

export default router;
