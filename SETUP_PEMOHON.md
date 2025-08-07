# Setup Role Pemohon

## 1. Buat Tabel Pemohon di Supabase

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tabel untuk pemohon
CREATE TABLE IF NOT EXISTS pemohon (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  no_telepon VARCHAR,
  alamat TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Jalankan Seed Script

```bash
npm run seed
```

## 3. Test Endpoints

### Register Pemohon Baru
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "pemohon@example.com",
  "password": "password123",
  "nama": "John Doe",
  "no_telepon": "081234567890",
  "alamat": "Jl. Example No. 123"
}
```

### Login Pemohon
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "pemohon.test@gmail.com",
  "password": "ppid2024"
}
```

## 4. Default Credentials

- **Email:** pemohon.test@gmail.com
- **Password:** ppid2024
- **Role:** Pemohon