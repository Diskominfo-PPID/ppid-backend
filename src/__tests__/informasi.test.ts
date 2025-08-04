import request from "supertest";
import { app } from "../index"; // Impor aplikasi utama dari index.ts

describe("Pengujian Endpoint /api/informasi", () => {
  let adminToken: string; // Variabel untuk menyimpan token admin (PPID)

  // Blok ini berjalan sekali sebelum semua tes di file ini dijalankan
  // Tujuannya untuk login sebagai admin dan menyimpan tokennya
  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "rudi.hartono@garutkab.go.id",
      password: "ppidgarut123",
    });

    // Pastikan login berhasil dan token didapatkan
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    adminToken = response.body.token; // Simpan token untuk digunakan di tes lain
  });

  // --- PENGUJIAN UNTUK METHOD GET ---
  describe("GET /api/informasi", () => {
    it("Harus mengembalikan 200 OK dan sebuah array untuk rute publik", async () => {
      const response = await request(app).get("/api/informasi");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Harus mengembalikan data yang difilter berdasarkan klasifikasi "berkala"', async () => {
      const response = await request(app).get(
        "/api/informasi?klasifikasi=berkala"
      );

      expect(response.statusCode).toBe(200);
      // Memastikan semua item yang dikembalikan memiliki klasifikasi yang benar
      if (response.body.length > 0) {
        for (const item of response.body) {
          expect(item.klasifikasi).toBe("berkala");
        }
      }
    });
  });

  // --- PENGUJIAN UNTUK METHOD POST ---
  describe("POST /api/informasi", () => {
    it("Harus mengembalikan error 401 Unauthorized jika mencoba membuat informasi tanpa token", async () => {
      const response = await request(app).post("/api/informasi").send({
        judul: "Tes Tanpa Token",
        klasifikasi: "setiap-saat",
        isi: "Ini seharusnya gagal.",
      });

      expect(response.statusCode).toBe(401);
    });

    it("Harus mengembalikan error 400 Bad Request jika data yang dikirim tidak lengkap", async () => {
      const response = await request(app)
        .post("/api/informasi")
        .set("Authorization", `Bearer ${adminToken}`) // Gunakan token admin
        .send({
          // 'judul' sengaja tidak disertakan
          klasifikasi: "berkala",
          isi: "Data tidak lengkap.",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain("wajib diisi");
    });

    it("Harus berhasil membuat informasi baru (201 Created) jika menggunakan token admin dan data valid", async () => {
      const newData = {
        judul: `Informasi Tes Otomatis - ${Date.now()}`, // Judul unik
        klasifikasi: "setiap-saat",
        isi: "Konten ini dibuat secara otomatis oleh Jest.",
        file_url: "http://example.com/test.pdf",
      };

      const response = await request(app)
        .post("/api/informasi")
        .set("Authorization", `Bearer ${adminToken}`) // Gunakan token admin
        .send(newData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Informasi berhasil ditambahkan");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.judul).toBe(newData.judul);
    });
  });
});
