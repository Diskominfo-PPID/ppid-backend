import "dotenv/config";
import fetch from "node-fetch";

const checkSupabaseConnection = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    console.error("❌ GAGAL: SUPABASE_URL tidak ditemukan di file .env");
    return;
  }

  console.log(`Mencoba menghubungi URL Supabase: ${supabaseUrl}`);

  try {
    // Kita hanya mencoba mengakses URL dasar, tidak perlu path spesifik
    const response = await fetch(supabaseUrl, {
      method: "HEAD", // HEAD adalah cara cepat untuk cek koneksi tanpa download body
    });

    console.log(`✅ SUKSES! Server Supabase merespon.`);
    console.log(`Status Respon: ${response.status} ${response.statusText}`);

    console.log(
      "\nIni berarti koneksi jaringan dari komputer Anda ke Supabase BERHASIL."
    );
    console.log(
      "Jika skrip updatePassword masih gagal, masalahnya kemungkinan ada pada RLS atau permission key."
    );
  } catch (err: any) {
    console.error("❌ GAGAL KONEKSI JARINGAN.");
    console.error("----------------------------------------------------");
    console.error(
      "Penyebab paling umum adalah Firewall, Proxy, atau masalah koneksi internet."
    );
    console.error("Error detail:", err);
    console.error("----------------------------------------------------");
  }
};

checkSupabaseConnection();