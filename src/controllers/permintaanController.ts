import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import { AuthenticatedRequest } from "../types/custom.types";
import { v4 as uuidv4 } from "uuid";

export const createPermintaan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Ambil ID pemohon dari token yang sudah diverifikasi oleh middleware
  const id_pemohon = req.user?.userId;

  if (!id_pemohon) {
    return res
      .status(403)
      .json({ error: "Akses ditolak. ID Pemohon tidak ditemukan di token." });
  }

  // Data pemohon tidak lagi diambil dari body
  const { informasi_diminta, tujuan } = req.body;

  if (!informasi_diminta || !tujuan) {
    return res
      .status(400)
      .json({ error: "Informasi yang diminta dan tujuan wajib diisi." });
  }

  try {
    const no_pendaftaran = `REQ-${Date.now()}`;

    const { data: permintaan, error } = await supabase
      .from("permohonan_informasi")
      .insert([
        {
          no_pendaftaran,
          id_pemohon: id_pemohon, // Gunakan ID dari token
          rincian_informasi_diminta: informasi_diminta,
          tujuan_penggunaan_informasi: tujuan,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Permintaan berhasil dikirim", data: permintaan });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal membuat permohonan: " + err.message });
  }
};

/**
 * Membuat permohonan informasi baru (public endpoint).
 */
export const createPermintaanPublic = async (req: Request, res: Response) => {
  const { nama_pemohon, nik, email, informasi_diminta, tujuan } = req.body;

  if (!nama_pemohon || !nik || !email || !informasi_diminta || !tujuan) {
    return res.status(400).json({ error: "Semua kolom wajib diisi." });
  }

  try {
    // Cari pemohon berdasarkan NIK/SK. Jika tidak ada, buat baru.
    let { data: pemohon } = await supabase
      .from("pemohon_informasi_publik")
      .select("id_pemohon")
      .eq("nik_sk_badan_hukum", nik)
      .single();

    if (!pemohon) {
      const { data: newPemohon, error: createError } = await supabase
        .from("pemohon_informasi_publik")
        .insert([{ nama: nama_pemohon, nik_sk_badan_hukum: nik, email }])
        .select("id_pemohon")
        .single();
      if (createError) throw createError;
      pemohon = newPemohon;
    }

    const no_pendaftaran = `REQ-${Date.now()}`;

    // Simpan data permohonan baru
    const { data: permintaan, error: permintaanError } = await supabase
      .from("permohonan_informasi")
      .insert([
        {
          no_pendaftaran,
          id_pemohon: pemohon!.id_pemohon,
          rincian_informasi_diminta: informasi_diminta,
          tujuan_penggunaan_informasi: tujuan,
        },
      ])
      .select()
      .single();

    if (permintaanError) throw permintaanError;

    res
      .status(201)
      .json({ message: "Permintaan berhasil dikirim", data: permintaan });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal membuat permohonan: " + err.message });
  }
};

/**
 * Mengambil semua data permohonan.
 * (Admin Only)
 */
export const getAllPermintaan = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("permohonan_informasi")
      .select(
        `
        *,
        pemohon_informasi_publik (*)
      `
      )
      .order("tanggal", { ascending: false }); // Urutkan dari yang terbaru

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mengambil satu data permohonan berdasarkan ID (nomor pendaftaran).
 * (Admin Only)
 */
export const getPermintaanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("permohonan_informasi")
      .select(`*, pemohon_informasi_publik (*)`)
      .eq("no_pendaftaran", id)
      .single();

    if (error) throw error;
    if (!data)
      return res.status(404).json({ error: "Permohonan tidak ditemukan." });

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Fungsi baru untuk PPID Utama menugaskan permohonan
export const assignPermohonan = async (req: Request, res: Response) => {
  const { id } = req.params; // no_pendaftaran
  const { no_pegawai_pelaksana } = req.body;

  if (!no_pegawai_pelaksana) {
    return res
      .status(400)
      .json({ error: "Nomor pegawai PPID Pelaksana wajib diisi." });
  }

  try {
    const { data, error } = await supabase
      .from("permohonan_informasi")
      .update({
        ditugaskan_kepada: no_pegawai_pelaksana,
        status_permohonan: "diteruskan_ke_pelaksana",
      })
      .eq("no_pendaftaran", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23503")
        return res
          .status(404)
          .json({ error: "PPID Pelaksana tidak ditemukan." });
      throw error;
    }
    if (!data)
      return res.status(404).json({ error: "Permohonan tidak ditemukan." });

    res.status(200).json({ message: "Permohonan berhasil ditugaskan", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const finalizePermohonan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, alasan_penolakan } = req.body;

  if (!status || !["disetujui", "ditolak"].includes(status)) {
    return res.status(400).json({
      error: 'Status tidak valid. Gunakan "disetujui" atau "ditolak".',
    });
  }
  if (status === "ditolak" && !alasan_penolakan) {
    return res.status(400).json({
      error: 'Alasan penolakan wajib diisi jika status adalah "ditolak".',
    });
  }

  try {
    const { data, error } = await supabase
      .from("permohonan_informasi")
      .update({
        status_permohonan: status,
        alasan_penolakan: status === "ditolak" ? alasan_penolakan : null,
      })
      .eq("no_pendaftaran", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return res.status(404).json({ error: "Permohonan tidak ditemukan." });

    res.status(200).json({
      message: `Status permohonan berhasil diubah menjadi ${status}`,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
