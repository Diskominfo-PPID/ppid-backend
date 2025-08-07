import { Router } from "express";
import { createKeberatan } from "../controllers/keberatanController";

const router = Router();

// Rute ini bersifat publik, karena pemohon mengajukan keberatan tanpa perlu login
router.post("/", createKeberatan);

// Di masa depan, Anda bisa menambahkan rute GET di sini untuk admin
// Contoh: router.get('/', verifyToken, authorizeRole(['Atasan_PPID']), getAllKeberatan);

export default router;
