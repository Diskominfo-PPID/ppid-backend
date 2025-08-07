import { Router } from "express";
import {
  createPermintaan,
  getAllPermintaan,
  getPermintaanById,
  updatePermintaanStatus,
} from "../controllers/permintaanController";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// Rute publik untuk mengajukan permintaan
router.post("/", createPermintaan);

// --- Rute Admin ---
const adminRoles = ["PPID", "Atasan_PPID"];

// Rute admin untuk melihat semua permintaan
router.get("/", verifyToken, authorizeRole(adminRoles), getAllPermintaan);

// Rute admin untuk melihat detail satu permintaan
router.get("/:id", verifyToken, authorizeRole(adminRoles), getPermintaanById);

// Rute admin untuk mengubah status permintaan (hanya PPID)
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRole(["PPID"]),
  updatePermintaanStatus
);

export default router;
