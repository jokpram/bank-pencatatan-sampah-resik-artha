//routes/withdrawalRoutes.js
import express from 'express';
import withdrawalController from '../controllers/withdrawalController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

// User requests withdrawal
router.post('/', verifyToken, checkRole(['user']), withdrawalController.createWithdrawal);

// Get withdrawals (User own, Officer all)
router.get('/', verifyToken, withdrawalController.getWithdrawals);

// Officer validates
router.patch('/:id/validate', verifyToken, checkRole(['officer']), withdrawalController.validateWithdrawal);

// Officer cancels
router.patch('/:id/cancel', verifyToken, checkRole(['officer']), withdrawalController.cancelWithdrawal);

export default router;
