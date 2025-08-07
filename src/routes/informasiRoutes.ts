import { Router } from 'express';
import { getAllInformasi, createInformasi } from '../controllers/informasiController';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Public endpoints
router.get('/', getAllInformasi);
router.get('/public', getAllInformasi);

// Protected endpoints
router.post('/', verifyToken, authorizeRole(['PPID']), createInformasi);

export default router;