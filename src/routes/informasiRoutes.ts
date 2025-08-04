import { Router } from 'express';
import { getAllInformasi, createInformasi } from '../controllers/informasiController';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();
router.get('/', getAllInformasi);
router.post('/', verifyToken, authorizeRole(['PPID']), createInformasi);

export default router;