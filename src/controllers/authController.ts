import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  // 1. Ambil email dan password dari body request
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi." });
  }

  try {
    let user: any = null;
    let role: string = "";

    // 2. Coba cari pengguna di tabel 'ppid' (huruf kecil)
    const { data: ppidUser, error: ppidError } = await supabase
      .from("ppid") // Menggunakan nama tabel huruf kecil
      .select("*")
      .eq("email", email)
      .single();

    if (ppidUser) {
      user = ppidUser;
      role = "PPID";
    } else if (ppidError && ppidError.code !== "PGRST116") {
      // PGRST116 adalah error "row not found", yang kita abaikan
      throw ppidError;
    }

    // 3. Jika tidak ditemukan, cari di tabel 'atasan_ppid' (huruf kecil)
    if (!user) {
      const { data: atasanUser, error: atasanError } = await supabase
        .from("atasan_ppid") // Menggunakan nama tabel huruf kecil
        .select("*")
        .eq("email", email)
        .single();

      if (atasanUser) {
        user = atasanUser;
        role = "Atasan_PPID";
      } else if (atasanError && atasanError.code !== "PGRST116") {
        throw atasanError;
      }
    }

    // 4. Jika pengguna tetap tidak ditemukan, kirim error
    if (!user) {
      return res
        .status(404)
        .json({ error: "Pengguna dengan email tersebut tidak ditemukan." });
    }

    // 5. Bandingkan password yang diberikan dengan hash di database
    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah." });
    }

    // 6. Jika password valid, buat JSON Web Token (JWT)
    const tokenPayload = {
      userId: user.no_pegawai || user.no_pengawas, // Ambil ID unik dari salah satu tabel
      email: user.email,
      role: role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" } // Token berlaku selama 8 jam
    );

    // 7. Kirim token sebagai respon sukses
    res.status(200).json({
      message: "Login berhasil",
      token: token,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Terjadi kesalahan pada server: " + err.message });
  }
};
