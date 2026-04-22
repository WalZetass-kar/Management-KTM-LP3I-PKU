-- ============================================
-- MERGE MAHASISWA TABLES
-- Menggabungkan tabel mahasiswa dan mahasiswa_angkatan
-- menjadi satu tabel mahasiswa yang lebih lengkap
-- ============================================

-- 1. Backup data dari kedua tabel (opsional, untuk safety)
CREATE TABLE IF NOT EXISTS mahasiswa_backup AS SELECT * FROM mahasiswa;
CREATE TABLE IF NOT EXISTS mahasiswa_angkatan_backup AS SELECT * FROM mahasiswa_angkatan;

-- 2. Drop tabel mahasiswa_angkatan (kita akan gunakan tabel mahasiswa saja)
DROP TABLE IF EXISTS mahasiswa_angkatan CASCADE;

-- 3. Recreate tabel mahasiswa dengan struktur yang lebih lengkap
DROP TABLE IF EXISTS mahasiswa CASCADE;

CREATE TABLE mahasiswa (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Data Pribadi
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  foto_url text,
  
  -- Data Akademik
  jurusan_id integer REFERENCES jurusan(id) ON DELETE RESTRICT,
  jurusan text NOT NULL, -- Tetap simpan nama jurusan untuk backward compatibility
  angkatan text NOT NULL, -- Format: "2024", "2025", dll
  
  -- Status
  status text NOT NULL DEFAULT 'Menunggu' 
    CHECK (status IN ('Aktif', 'Menunggu', 'Tidak Aktif', 'Lulus', 'Cuti')),
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

-- 4. Buat indexes untuk performa
CREATE INDEX idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
CREATE INDEX idx_mahasiswa_jurusan ON mahasiswa(jurusan);
CREATE INDEX idx_mahasiswa_angkatan ON mahasiswa(angkatan);
CREATE INDEX idx_mahasiswa_status ON mahasiswa(status);
CREATE INDEX idx_mahasiswa_created_at ON mahasiswa(created_at);

-- 5. Enable RLS
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;

-- 6. Buat RLS Policies
DROP POLICY IF EXISTS "Admins can read mahasiswa" ON mahasiswa;
DROP POLICY IF EXISTS "Admins can insert mahasiswa" ON mahasiswa;
DROP POLICY IF EXISTS "Admins can update mahasiswa" ON mahasiswa;
DROP POLICY IF EXISTS "Admins can delete mahasiswa" ON mahasiswa;

CREATE POLICY "Admins can read mahasiswa" ON mahasiswa
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert mahasiswa" ON mahasiswa
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update mahasiswa" ON mahasiswa
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete mahasiswa" ON mahasiswa
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- 7. Grant permissions
GRANT ALL ON mahasiswa TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_id_seq TO authenticated;

-- 8. Migrate data dari backup tables
-- Dari mahasiswa_backup
INSERT INTO mahasiswa (nama, nim, alamat, no_hp, foto_url, jurusan, jurusan_id, angkatan, status, created_at)
SELECT 
  nama,
  nim,
  alamat,
  no_hp,
  foto_url,
  jurusan,
  jurusan_id,
  COALESCE(angkatan, EXTRACT(YEAR FROM created_at)::text), -- Jika angkatan null, gunakan tahun created_at
  status,
  created_at
FROM mahasiswa_backup
ON CONFLICT (nim) DO NOTHING;

-- Dari mahasiswa_angkatan_backup
INSERT INTO mahasiswa (nama, nim, alamat, no_hp, foto_url, jurusan, angkatan, status, created_at, updated_at)
SELECT 
  full_name,
  nim,
  address,
  phone_number,
  photo_url,
  study_program,
  angkatan,
  status,
  created_at,
  updated_at
FROM mahasiswa_angkatan_backup
ON CONFLICT (nim) DO UPDATE SET
  nama = EXCLUDED.nama,
  alamat = EXCLUDED.alamat,
  no_hp = EXCLUDED.no_hp,
  foto_url = COALESCE(EXCLUDED.foto_url, mahasiswa.foto_url),
  jurusan = EXCLUDED.jurusan,
  angkatan = EXCLUDED.angkatan,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

-- 9. Update jurusan_id berdasarkan nama jurusan (jika belum ada)
UPDATE mahasiswa m
SET jurusan_id = j.id
FROM jurusan j
WHERE m.jurusan = j.nama_jurusan
  AND m.jurusan_id IS NULL;

-- 10. Buat function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_mahasiswa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Buat trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_mahasiswa_updated_at ON mahasiswa;
CREATE TRIGGER trigger_update_mahasiswa_updated_at
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION update_mahasiswa_updated_at();

-- 12. Buat view untuk backward compatibility (opsional)
CREATE OR REPLACE VIEW mahasiswa_angkatan AS
SELECT 
  id,
  nama as full_name,
  nim,
  angkatan,
  jurusan as study_program,
  status,
  foto_url as photo_url,
  alamat as address,
  no_hp as phone_number,
  created_at,
  updated_at
FROM mahasiswa;

-- 13. Insert sample data jika tabel kosong
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan, alamat, no_hp, status)
SELECT 
  'Ahmad Rizki Pratama', '2025001001', 'Teknik Informatika', '2025', 
  'Jl. Sudirman No. 123, Pekanbaru', '081234567890', 'Aktif'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa LIMIT 1)
UNION ALL
SELECT 
  'Siti Nurhaliza', '2025001002', 'Sistem Informasi', '2025',
  'Jl. Ahmad Yani No. 456, Pekanbaru', '081234567891', 'Aktif'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa LIMIT 1)
UNION ALL
SELECT 
  'Budi Santoso', '2026001001', 'Teknik Komputer', '2026',
  'Jl. Diponegoro No. 789, Pekanbaru', '081234567892', 'Menunggu'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa LIMIT 1)
UNION ALL
SELECT 
  'Dewi Sartika', '2026001002', 'Manajemen Informatika', '2026',
  'Jl. Gajah Mada No. 321, Pekanbaru', '081234567893', 'Aktif'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa LIMIT 1)
UNION ALL
SELECT 
  'Eko Prasetyo', '2027001001', 'Teknik Informatika', '2027',
  'Jl. Kartini No. 654, Pekanbaru', '081234567894', 'Menunggu'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa LIMIT 1);

-- 14. Drop backup tables (uncomment jika sudah yakin data sudah aman)
-- DROP TABLE IF EXISTS mahasiswa_backup;
-- DROP TABLE IF EXISTS mahasiswa_angkatan_backup;

-- 15. Summary
DO $$
DECLARE
  total_mahasiswa INTEGER;
  total_angkatan INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_mahasiswa FROM mahasiswa;
  SELECT COUNT(DISTINCT angkatan) INTO total_angkatan FROM mahasiswa;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MERGE MAHASISWA TABLES - SELESAI';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Mahasiswa: %', total_mahasiswa;
  RAISE NOTICE 'Total Angkatan: %', total_angkatan;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Tabel mahasiswa dan mahasiswa_angkatan berhasil digabung!';
  RAISE NOTICE '✅ Sekarang hanya ada 1 tabel: mahasiswa';
  RAISE NOTICE '✅ Filter berdasarkan angkatan: SELECT * FROM mahasiswa WHERE angkatan = ''2025''';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  PENTING: Update kode aplikasi untuk menggunakan tabel mahasiswa saja';
  RAISE NOTICE '========================================';
END $$;
