-- Cek struktur tabel admin
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin';

-- Cek data admin yang ada
SELECT * FROM admin;