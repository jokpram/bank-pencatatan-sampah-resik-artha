//routes/reportRoutes.js
import express from 'express';
import reportController from '../controllers/reportController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/pdf', verifyToken, checkRole(['officer']), reportController.downloadReport);
router.get('/withdrawals-pdf', verifyToken, checkRole(['officer']), reportController.downloadWithdrawalReport);

export default router;
