-- Buat tabel admin jika belum ada
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin default dengan password yang di-hash
INSERT INTO admin (email, hashed_password, nama) 
VALUES ('admin@diskominfo.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator')
ON CONFLICT (email) DO NOTHING;