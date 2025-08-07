-- Update database schema untuk mendukung PPID Pelaksana
-- Tambahkan kolom role ke tabel ppid
ALTER TABLE ppid ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'PPID';

-- Insert PPID Pelaksana
INSERT INTO ppid (no_pegawai, email, hashed_password, nama, role) 
VALUES ('PPID002', 'ppid.pelaksana@diskominfo.go.id', '$2a$10$example_hash', 'PPID Pelaksana', 'PPID_Pelaksana')
ON CONFLICT (no_pegawai) DO UPDATE SET
  email = EXCLUDED.email,
  nama = EXCLUDED.nama,
  role = EXCLUDED.role;