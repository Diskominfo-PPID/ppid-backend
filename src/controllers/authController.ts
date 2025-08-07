// src/controllers/authController.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi." });
  }

  try {
    let user: any = null;
    let role: string = "";
    let userId: string | number = "";

    // 1. Cek di tabel admin
    const { data: adminUser } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();
    if (adminUser) {
      user = adminUser;
      role = "Admin";
      userId = adminUser.id;
    }

    // 2. Jika bukan admin, cek di tabel ppid (PPID Utama)
    if (!user) {
      const { data: ppidUser } = await supabase
        .from("ppid")
        .select("*")
        .eq("email", email)
        .single();
      if (ppidUser) {
        user = ppidUser;
        role = "PPID";
        userId = ppidUser.no_pegawai;
      }
    }

    // 3. Jika bukan juga, cek di tabel atasan_ppid
    if (!user) {
      const { data: atasanUser } = await supabase
        .from("atasan_ppid")
        .select("*")
        .eq("email", email)
        .single();
      if (atasanUser) {
        user = atasanUser;
        role = "Atasan_PPID";
        userId = atasanUser.no_pengawas;
      }
    }

    if (!user) {
      return res
        .status(404)
        .json({ error: "Pengguna dengan email tersebut tidak ditemukan." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah." });
    }

    const token = jwt.sign(
      { userId, email: user.email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.status(200).json({ message: "Login berhasil", token });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Terjadi kesalahan pada server: " + err.message });
  }
};
