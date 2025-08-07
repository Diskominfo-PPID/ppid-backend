# 🔐 Sistem Autentikasi PPID Backend

## Overview
Sistem autentikasi mendukung 4 role utama:
1. **PPID Utama** - Role utama untuk mengelola informasi publik
2. **PPID Pelaksana** - Role pelaksana untuk operasional harian
3. **Atasan PPID** - Role supervisor untuk approval dan monitoring
4. **Pemohon** - Role untuk masyarakat yang mengajukan permohonan informasi

## 📋 Default Login Credentials

### 1. PPID Utama
- **Email:** `ppid.utama@diskominfo.go.id`
- **Password:** `ppid2024`
- **Role:** `PPID`
- **Tabel:** `ppid`

### 2. PPID Pelaksana
- **Email:** `ppid.pelaksana@diskominfo.go.id`
- **Password:** `ppid2024`
- **Role:** `PPID_Pelaksana`
- **Tabel:** `ppid`

### 3. Atasan PPID
- **Email:** `atasan.ppid@diskominfo.go.id`
- **Password:** `ppid2024`
- **Role:** `Atasan_PPID`
- **Tabel:** `atasan_ppid`

### 4. Pemohon Test
- **Email:** `pemohon.test@gmail.com`
- **Password:** `ppid2024`
- **Role:** `Pemohon`
- **Tabel:** `pemohon`

## 🚀 Setup Instructions

### 1. Jalankan Seed Script
```bash
npm run seed
```

### 2. Update Database Schema (Jika Diperlukan)
Jika kolom `role` belum ada di tabel `ppid`, jalankan SQL berikut di Supabase:

```sql
ALTER TABLE ppid ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'PPID';

UPDATE ppid SET role = 'PPID_Pelaksana' 
WHERE no_pegawai = 'PPID002';
```

## 🔑 Authentication Flow

### Register Process (Khusus Pemohon)
1. User mengirim data ke `/api/auth/register`
2. System validasi email belum terdaftar
3. Hash password dan simpan ke tabel `pemohon`

### Login Process
1. User mengirim email & password ke `/api/auth/login`
2. System mencari user di 4 tabel secara berurutan:
   - `admin` (untuk Admin)
   - `ppid` (untuk PPID Utama & Pelaksana)
   - `atasan_ppid` (untuk Atasan PPID)
   - `pemohon` (untuk Pemohon)
3. Validasi password dengan bcrypt
4. Generate JWT token dengan payload:
   ```json
   {
     "userId": "user_id",
     "email": "user@email.com",
     "role": "PPID|PPID_Pelaksana|Atasan_PPID|Pemohon"
   }
   ```

### Authorization
- Middleware `verifyToken` memvalidasi JWT
- Middleware `authorizeRole` memeriksa role access
- Token berlaku selama 8 jam

## 📊 Database Schema

### Tabel `ppid`
```sql
CREATE TABLE ppid (
  no_pegawai VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'PPID',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabel `atasan_ppid`
```sql
CREATE TABLE atasan_ppid (
  no_pengawas VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabel `pemohon`
```sql
CREATE TABLE pemohon (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  no_telepon VARCHAR,
  alamat TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛡️ Security Features

- Password di-hash menggunakan bcrypt (salt rounds: 10)
- JWT token dengan expiry 8 jam
- Role-based access control
- Email unique constraint
- Environment variable untuk JWT secret

## 🧪 Testing

### Register Pemohon
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pemohon@example.com",
    "password": "password123",
    "nama": "John Doe",
    "no_telepon": "081234567890",
    "alamat": "Jl. Example No. 123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ppid.utama@diskominfo.go.id",
    "password": "ppid2024"
  }'
```

### Response Success
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔄 Role Permissions

| Role | Permissions |
|------|-------------|
| PPID | Create, Read, Update informasi publik |
| PPID_Pelaksana | Read, Update informasi publik |
| Atasan_PPID | Read, Approve informasi publik |
| Pemohon | Create permohonan, Read status permohonan |

## 📝 Notes

- Semua password default adalah `ppid2024`
- Ganti password default setelah first login
- JWT secret disimpan di environment variable
- Token harus disertakan di header: `Authorization: Bearer <token>`