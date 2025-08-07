import { Router } from "express";
import { createPpidPelaksana } from "../controllers/adminController";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// Endpoint ini hanya bisa diakses oleh user dengan role 'Admin'
router.post(
  "/create-ppid-pelaksana",
  verifyToken,
  authorizeRole(["Admin"]),
  createPpidPelaksana
);

export default router;
