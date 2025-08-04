# PPID Backend API

API untuk pengelolaan informasi publik sesuai PERKI No. 1 Tahun 2021

## 📋 Daftar Isi

- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)

## 🔧 Persyaratan Sistem

Sebelum menginstal aplikasi, pastikan sistem Anda memiliki:

- **Node.js** versi 16.x atau lebih tinggi
- **npm** versi 8.x atau lebih tinggi (atau **yarn**)
- **Git** untuk cloning repository
- **Supabase Account** untuk database

### Verifikasi Instalasi

```bash
node --version
npm --version
git --version
```

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/diskominfo-ppid/ppid-backend.git
cd ppid-backend
```

### 2. Install Dependencies

```bash
npm install
```

atau menggunakan yarn:

```bash
yarn install
```

## ⚙️ Konfigurasi

### 1. Environment Variables

Buat file `.env` di root directory dan isi dengan konfigurasi berikut:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration (Optional)
PORT=3001
NODE_ENV=development
```

### 2. Database Setup

Pastikan Anda telah membuat tabel-tabel berikut di Supabase:

#### Tabel `ppid`
```sql
CREATE TABLE ppid (
  no_pegawai VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabel `atasan_ppid`
```sql
CREATE TABLE atasan_ppid (
  no_pengawas VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabel `informasi_publik`
```sql
CREATE TABLE informasi_publik (
  id SERIAL PRIMARY KEY,
  judul VARCHAR NOT NULL,
  klasifikasi VARCHAR NOT NULL,
  ringkasan_isi_informasi TEXT NOT NULL,
  file_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### Production Mode

1. Build aplikasi:
```bash
npm run build
```

2. Jalankan aplikasi:
```bash
npm start
```

### Testing

Jalankan unit tests:
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi. Token harus disertakan dalam header `Authorization` dengan format:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints

### POST /api/auth/login

Login untuk mendapatkan JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "error": "Email dan password wajib diisi."
}
```

**Response Error (404):**
```json
{
  "error": "Pengguna dengan email tersebut tidak ditemukan."
}
```

**Response Error (401):**
```json
{
  "error": "Password salah."
}
```

---

## 📄 Informasi Endpoints

### GET /api/informasi

Mengambil semua data informasi publik.

**Query Parameters:**
- `klasifikasi` (optional): Filter berdasarkan klasifikasi informasi

**Example Request:**
```bash
GET /api/informasi
GET /api/informasi?klasifikasi=berkala
```

**Response Success (200):**
```json
[
  {
    "id": 1,
    "judul": "Laporan Keuangan 2024",
    "klasifikasi": "berkala",
    "ringkasan_isi_informasi": "Laporan keuangan tahunan...",
    "file_url": "https://example.com/file.pdf",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/informasi

Menambahkan informasi publik baru.

**Authentication Required:** ✅ (Role: PPID)

**Request Body:**
```json
{
  "judul": "Judul Informasi",
  "klasifikasi": "berkala",
  "isi": "Ringkasan isi informasi...",
  "file_url": "https://example.com/file.pdf"
}
```

**Response Success (201):**
```json
{
  "message": "Informasi berhasil ditambahkan",
  "data": {
    "id": 1,
    "judul": "Judul Informasi",
    "klasifikasi": "berkala",
    "ringkasan_isi_informasi": "Ringkasan isi informasi...",
    "file_url": "https://example.com/file.pdf",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Judul, klasifikasi, dan isi wajib diisi."
}
```

**Response Error (401):**
```json
{
  "error": "Token tidak valid atau tidak ada."
}
```

**Response Error (403):**
```json
{
  "error": "Akses ditolak. Role tidak sesuai."
}
```

---

## 🔒 Authorization

### Roles
- **PPID**: Dapat membuat informasi publik baru
- **Atasan_PPID**: Role untuk atasan PPID (implementasi future)

### Middleware
- `verifyToken`: Memverifikasi JWT token
- `authorizeRole`: Memverifikasi role pengguna

---

## 📝 Error Responses

Semua error response mengikuti format:
```json
{
  "error": "Pesan error yang deskriptif"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

### Menjalankan Tests
```bash
npm test
```

### Test Coverage
Tests mencakup:
- Unit tests untuk controllers
- Integration tests untuk API endpoints
- Authentication middleware tests

---

## 🚀 Deployment

### Environment Variables untuk Production
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
JWT_SECRET=your_strong_jwt_secret
```

### Build untuk Production
```bash
npm run build
npm start
```

---

## 📁 Struktur Project

```
ppid-backend/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── authController.ts
│   │   └── informasiController.ts
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   └── informasiRoutes.ts
│   ├── lib/                 # External libraries config
│   │   └── supabaseClient.ts
│   ├── types/               # TypeScript type definitions
│   │   └── custom.types.ts
│   ├── __tests__/           # Test files
│   │   └── informasi.test.ts
│   └── index.ts             # Main application file
├── dist/                    # Compiled JavaScript files
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📞 Contact

Project Link: [https://github.com/diskominfo-ppid/ppid-backend](https://github.com/diskominfo-ppid/ppid-backend)

---

## 🔄 Changelog

### v1.0.0
- Initial release
- Authentication system dengan JWT
- CRUD operations untuk informasi publik
- Role-based access control
- Integration dengan Supabase