// src/routes/tanggapanRoutes.ts

import { Router } from "express";
import { createTanggapan } from "../controllers/tanggapanController";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// Rute ini dilindungi dan hanya bisa diakses oleh Atasan PPID
router.post(
  "/:no_registrasi_keberatan",
  verifyToken,
  authorizeRole(["Atasan_PPID"]),
  createTanggapan
);

export default router;
