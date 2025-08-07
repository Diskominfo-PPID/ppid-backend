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