import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";

/**
 * Membuat pengajuan keberatan baru.
 * Ini adalah endpoint publik yang bisa diakses oleh pemohon.
 */
export const createKeberatan = async (req: Request, res: Response) => {
  // Ambil data dari body request
  const { permintaan_id, alasan, bukti } = req.body;

  // Validasi input dasar
  if (!permintaan_id || !alasan) {
    return res
      .status(400)
      .json({ error: "ID Permohonan dan alasan wajib diisi." });
  }

  try {
    const no_registrasi_keberatan = `KEB-${Date.now()}`;

    // Lakukan operasi 'insert' ke tabel 'keberatan'
    const { data, error } = await supabase
      .from("keberatan") // Pastikan nama tabel huruf kecil
      .insert([
        {
          no_registrasi_keberatan,
          no_pendaftaran_permohonan: permintaan_id, // Sesuaikan dengan nama kolom di DB
          alasan_pengajuan_keberatan: alasan,
          bukti,
        },
      ])
      .select()
      .single();

    if (error) {
      // Tangani kasus jika permintaan_id tidak valid/tidak ada
      if (error.code === "23503") {
        // Foreign key violation
        return res.status(404).json({
          error: `Permohonan dengan ID ${permintaan_id} tidak ditemukan.`,
        });
      }
      throw error;
    }

    res.status(201).json({ message: "Keberatan berhasil dikirim", data });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengirim keberatan: " + err.message });
  }
};
