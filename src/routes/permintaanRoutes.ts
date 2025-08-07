import { Router } from "express";
import {
  createPermintaan,
  getAllPermintaan,
  getPermintaanById,
  assignPermohonan,
  finalizePermohonan,
} from "../controllers/permintaanController";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// Rute ini sekarang dilindungi
router.post("/", verifyToken, authorizeRole(["Pemohon"]), createPermintaan);

// Rute untuk Monitoring (Atasan PPID & Admin)
router.get(
  "/",
  verifyToken,
  authorizeRole(["Atasan_PPID", "Admin", "PPID"]),
  getAllPermintaan
);
router.get(
  "/:id",
  verifyToken,
  authorizeRole(["Atasan_PPID", "Admin", "PPID"]),
  getPermintaanById
);

// Rute Aksi untuk PPID Utama
router.post(
  "/:id/tugaskan",
  verifyToken,
  authorizeRole(["PPID"]),
  assignPermohonan
);
router.patch(
  "/:id/finalisasi",
  verifyToken,
  authorizeRole(["PPID"]),
  finalizePermohonan
);

export default router;
