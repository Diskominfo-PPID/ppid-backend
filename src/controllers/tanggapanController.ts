import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";

/**
 * Menambahkan tanggapan atas keberatan.
 * (Atasan PPID Only)
 */
export const createTanggapan = async (req: Request, res: Response) => {
  const { no_registrasi_keberatan } = req.params;
  const { tanggapan } = req.body;

  if (!tanggapan) {
    return res.status(400).json({ error: "Tanggapan tidak boleh kosong." });
  }

  try {
    const { data, error } = await supabase
      .from("keberatan") // Kita update tabel 'keberatan'
      .update({
        tanggapan_atasan_ppid: tanggapan,
        tanggal_tanggapan_diberikan: new Date().toISOString(),
      })
      .eq("no_registrasi_keberatan", no_registrasi_keberatan)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return res.status(404).json({ error: "Data keberatan tidak ditemukan." });

    res
      .status(200)
      .json({ message: "Tanggapan atas keberatan berhasil disimpan", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
