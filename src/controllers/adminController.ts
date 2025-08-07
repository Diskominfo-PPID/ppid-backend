import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import bcrypt from "bcryptjs";

export const createPpidPelaksana = async (req: Request, res: Response) => {
  const { no_pegawai, nama, no_hp, alamat, unit_kerja, email, password } =
    req.body;

  if (!no_pegawai || !nama || !unit_kerja || !email || !password) {
    return res.status(400).json({
      error: "Data wajib diisi: no_pegawai, nama, unit_kerja, email, password.",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Di aplikasi nyata, PPID Pelaksana juga perlu tabel user sendiri untuk login
    // Untuk skema ini, kita asumsikan mereka tidak login, hanya sebagai penanggung jawab
    const { data, error } = await supabase
      .from("ppid_pelaksana")
      .insert([
        {
          no_pegawai,
          nama,
          no_hp,
          alamat,
          unit_kerja_satuan_kerja: unit_kerja,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Akun PPID Pelaksana berhasil dibuat", data });
  } catch (err: any) {
    // Tangani error jika no_pegawai sudah ada
    if (err.code === "23505") {
      return res.status(409).json({ error: "Nomor Pegawai sudah terdaftar." });
    }
    res.status(500).json({ error: err.message });
  }
};
