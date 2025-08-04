import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";

export const getAllInformasi = async (req: Request, res: Response) => {
  const { klasifikasi } = req.query as { klasifikasi?: string };
  try {
    // UBAH DI SINI
    let query = supabase.from("informasi_publik").select("*");

    if (klasifikasi) {
      query = query.eq("klasifikasi", klasifikasi);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Gagal mengambil data informasi: " + err.message });
  }
};

export const createInformasi = async (req: Request, res: Response) => {
  const { judul, klasifikasi, isi, file_url } = req.body;
  if (!judul || !klasifikasi || !isi) {
    return res
      .status(400)
      .json({ error: "Judul, klasifikasi, dan isi wajib diisi." });
  }

  try {
    // DAN UBAH DI SINI
    const { data, error } = await supabase
      .from("informasi_publik")
      .insert([
        {
          judul,
          klasifikasi,
          ringkasan_isi_informasi: isi,
          file_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Informasi berhasil ditambahkan", data });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Gagal menambahkan informasi: " + err.message });
  }
};
