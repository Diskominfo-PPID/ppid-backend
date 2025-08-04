import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// --- GANTI DENGAN KUNCI YANG BARU ANDA SALIN ---
const supabaseUrl = "https://hgrrlfgrjhywkxchcvtx.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncnJsZmdyamh5d2t4Y2hjdnR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDI4ODc5NCwiZXhwIjoyMDY5ODY0Nzk0fQ.g2fA6Wxl7cIwoMULSwiUNjPdTaECLmW3eXsJKGW_4oc";
// ---------------------------------------------

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const emailToUpdate = "rudi.hartono@garutkab.go.id";
const newPlainTextPassword = "ppidgarut123";

const updatePassword = async () => {
  console.log(`Mencoba memperbarui password untuk: ${emailToUpdate}`);

  try {
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPlainTextPassword, salt);
    console.log("Hash baru berhasil dibuat.");

    console.log("Mengirim permintaan UPDATE ke Supabase...");
    const { data, error } = await supabase
      .from("ppid") // Pastikan nama tabel ini 'PPID'
      .update({ hashed_password: newHashedPassword }) // Pastikan nama kolom ini 'hashed_password'
      .eq("email", emailToUpdate) // Pastikan nama kolom ini 'email'
      .select();

    console.log("Respon dari Supabase diterima.");

    // Cetak respon mentah dari Supabase
    console.log("Data yang dikembalikan:", data);
    console.log("Error yang dikembalikan:", JSON.stringify(error, null, 2));

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      console.log("✅ SUKSES! Password di database telah diperbarui.");
    } else {
      console.error(
        "❌ GAGAL: Tidak ada data yang diupdate. Cek kembali apakah email pengguna sudah benar."
      );
    }
  } catch (err: any) {
    console.error("❌ ERROR SAAT EKSEKUSI:", err);
  }
};

updatePassword();
