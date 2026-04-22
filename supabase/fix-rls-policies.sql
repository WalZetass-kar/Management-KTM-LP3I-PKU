-- Fix RLS policies untuk semua tabel
-- Hapus policies lama dan buat yang baru

-- 1. DROP existing policies untuk jurusan
DROP POLICY IF EXISTS "Allow authenticated users to read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to delete jurusan" ON jurusan;

-- 2. DROP existing policies untuk mahasiswa_angkatan
DROP POLICY IF EXISTS "Allow authenticated users to read mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to insert mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to update mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to delete mahasiswa_angkatan" ON mahasiswa_angkatan;

-- 3. Disable RLS sementara untuk testing
ALTER TABLE jurusan DISABLE ROW LEVEL SECURITY;
ALTER TABLE mahasiswa_angkatan DISABLE ROW LEVEL SECURITY;

-- 4. Atau buat policies yang lebih permissive
-- ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mahasiswa_angkatan ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow all operations on jurusan" ON jurusan
--   FOR ALL USING (true) WITH CHECK (true);

-- CREATE POLICY "Allow all operations on mahasiswa_angkatan" ON mahasiswa_angkatan
--   FOR ALL USING (true) WITH CHECK (true);

-- 5. Pastikan tabel bisa diakses
GRANT ALL ON jurusan TO authenticated;
GRANT ALL ON mahasiswa_angkatan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE jurusan_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_angkatan_id_seq TO authenticated;