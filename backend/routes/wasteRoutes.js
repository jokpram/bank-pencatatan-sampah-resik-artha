//routes/wasteRoutes.js
import express from 'express';
import wasteController from '../controllers/wasteController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// User records waste
router.post('/', verifyToken, checkRole(['user']), upload.single('foto'), wasteController.createRecord);

// Update record (User/Officer before validation)
router.put('/:id', verifyToken, upload.single('foto'), wasteController.updateRecord);

// Get records (User sees own, Officer sees all)
router.get('/', verifyToken, wasteController.getRecords);

// Officer validates
router.patch('/:id/validate', verifyToken, checkRole(['officer']), wasteController.validateRecord);

// Officer cancels
router.patch('/:id/cancel', verifyToken, checkRole(['officer']), wasteController.cancelRecord);

// Get Waste Types (Public or Authenticated? authenticated is safer)
router.get('/types', verifyToken, wasteController.getWasteTypes);

// Get Waste Stats
router.get('/stats', verifyToken, wasteController.getStats);

export default router;
