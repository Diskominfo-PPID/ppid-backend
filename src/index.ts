import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";

// Impor rute
import authRoutes from "./routes/authRoutes";
import informasiRoutes from "./routes/informasiRoutes";
// import permintaanRoutes from './routes/permintaanRoutes';

import keberatanRoutes from "./routes/keberatanRoutes";

import adminRoutes from "./routes/adminRoutes";

import tanggapanRoutes from "./routes/tanggapanRoutes";

// Ubah const app menjadi export const app
export const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gunakan Rute
app.use("/api/auth", authRoutes);
app.use("/api/informasi", informasiRoutes);
// app.use('/api/permintaan', permintaanRoutes);

app.use("/api/keberatan", keberatanRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/tanggapan", tanggapanRoutes);

// Rute dasar untuk mengecek apakah server berjalan
app.get("/", (req: Request, res: Response) => {
  res.send("PPID Garut Backend API is running!");
});

// Hanya jalankan server jika bukan dalam mode tes
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `Server backend (TypeScript) berjalan di http://localhost:${PORT}`
    );
  });
}
