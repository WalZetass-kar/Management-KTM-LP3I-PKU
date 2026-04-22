-- ============================================
-- FINAL DATABASE STRUCTURE
-- Struktur akhir dengan relasi yang benar
-- ============================================

-- 1. Tabel ANGKATAN (Master Data)
-- Untuk mengelola tahun angkatan
CREATE TABLE IF NOT EXISTS angkatan (
  id serial PRIMARY KEY,
  tahun varchar(4) UNIQUE NOT NULL,
  nama_angkatan varchar(100) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Tidak Aktif')),
  keterangan text,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel JURUSAN (Master Data)
-- Untuk mengelola jurusan
CREATE TABLE IF NOT EXISTS jurusan (
  id serial PRIMARY KEY,
  nama_jurusan varchar(255) UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel MAHASISWA (Transaction Data)
-- Dengan foreign key ke angkatan dan jurusan
DROP TABLE IF EXISTS mahasiswa CASCADE;

CREATE TABLE mahasiswa (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Data Pribadi
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  foto_url text,
  
  -- Data Akademik (dengan foreign key)
  jurusan_id integer REFERENCES jurusan(id) ON DELETE RESTRICT,
  angkatan_id integer REFERENCES angkatan(id) ON DELETE RESTRICT,
  
  -- Status
  status text NOT NULL DEFAULT 'Menunggu' 
    CHECK (status IN ('Aktif', 'Menunggu', 'Tidak Aktif', 'Lulus', 'Cuti')),
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

-- 4. Buat indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_id ON mahasiswa(angkatan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_status ON mahasiswa(status);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_created_at ON mahasiswa(created_at);

CREATE INDEX IF NOT EXISTS idx_jurusan_nama ON jurusan(nama_jurusan);
CREATE INDEX IF NOT EXISTS idx_angkatan_tahun ON angkatan(tahun);
CREATE INDEX IF NOT EXISTS idx_angkatan_status ON angkatan(status);

-- 5. Enable RLS untuk semua tabel
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE angkatan ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies untuk MAHASISWA
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

-- 7. RLS Policies untuk JURUSAN
DROP POLICY IF EXISTS "Admins can read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can delete jurusan" ON jurusan;

CREATE POLICY "Admins can read jurusan" ON jurusan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert jurusan" ON jurusan
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update jurusan" ON jurusan
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete jurusan" ON jurusan
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- 8. RLS Policies untuk ANGKATAN
DROP POLICY IF EXISTS "Admins can read angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can insert angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can update angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can delete angkatan" ON angkatan;

CREATE POLICY "Admins can read angkatan" ON angkatan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert angkatan" ON angkatan
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update angkatan" ON angkatan
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete angkatan" ON angkatan
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- 9. Grant permissions
GRANT ALL ON mahasiswa TO authenticated;
GRANT ALL ON jurusan TO authenticated;
GRANT ALL ON angkatan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE jurusan_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE angkatan_id_seq TO authenticated;

-- 10. Buat function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Buat triggers untuk auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_mahasiswa_updated_at ON mahasiswa;
CREATE TRIGGER trigger_update_mahasiswa_updated_at
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_jurusan_updated_at ON jurusan;
CREATE TRIGGER trigger_update_jurusan_updated_at
  BEFORE UPDATE ON jurusan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_angkatan_updated_at ON angkatan;
CREATE TRIGGER trigger_update_angkatan_updated_at
  BEFORE UPDATE ON angkatan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 12. Insert sample data untuk JURUSAN
INSERT INTO jurusan (nama_jurusan) VALUES
('Teknik Informatika'),
('Sistem Informasi'),
('Teknik Komputer'),
('Manajemen Informatika'),
('Rekayasa Perangkat Lunak'),
('Keamanan Siber'),
('Data Science'),
('Multimedia dan Jaringan')
ON CONFLICT (nama_jurusan) DO NOTHING;

-- 13. Insert sample data untuk ANGKATAN
INSERT INTO angkatan (tahun, nama_angkatan, status, keterangan) VALUES
('2023', 'Angkatan 2023', 'Aktif', 'Angkatan tahun 2023'),
('2024', 'Angkatan 2024', 'Aktif', 'Angkatan tahun 2024'),
('2025', 'Angkatan 2025', 'Aktif', 'Angkatan tahun 2025'),
('2026', 'Angkatan 2026', 'Aktif', 'Angkatan tahun 2026'),
('2027', 'Angkatan 2027', 'Aktif', 'Angkatan tahun 2027')
ON CONFLICT (tahun) DO NOTHING;

-- 14. Insert sample data untuk MAHASISWA (dengan foreign key)
INSERT INTO mahasiswa (nama, nim, jurusan_id, angkatan_id, alamat, no_hp, status)
SELECT 
  'Ahmad Rizki Pratama', 
  '2025001001', 
  (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Informatika' LIMIT 1),
  (SELECT id FROM angkatan WHERE tahun = '2025' LIMIT 1),
  'Jl. Sudirman No. 123, Pekanbaru', 
  '081234567890', 
  'Aktif'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa WHERE nim = '2025001001')
UNION ALL
SELECT 
  'Siti Nurhaliza', 
  '2025001002', 
  (SELECT id FROM jurusan WHERE nama_jurusan = 'Sistem Informasi' LIMIT 1),
  (SELECT id FROM angkatan WHERE tahun = '2025' LIMIT 1),
  'Jl. Ahmad Yani No. 456, Pekanbaru', 
  '081234567891', 
  'Aktif'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa WHERE nim = '2025001002')
UNION ALL
SELECT 
  'Budi Santoso', 
  '2026001001', 
  (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Komputer' LIMIT 1),
  (SELECT id FROM angkatan WHERE tahun = '2026' LIMIT 1),
  'Jl. Diponegoro No. 789, Pekanbaru', 
  '081234567892', 
  'Menunggu'
WHERE NOT EXISTS (SELECT 1 FROM mahasiswa WHERE nim = '2026001001');

-- 15. Buat VIEW untuk kemudahan query (dengan JOIN)
CREATE OR REPLACE VIEW v_mahasiswa_lengkap AS
SELECT 
  m.id,
  m.nama,
  m.nim,
  m.alamat,
  m.no_hp,
  m.foto_url,
  m.status,
  m.created_at,
  m.updated_at,
  j.id as jurusan_id,
  j.nama_jurusan,
  a.id as angkatan_id,
  a.tahun as angkatan,
  a.nama_angkatan
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id;

-- 16. Summary
DO $$
DECLARE
  total_mahasiswa INTEGER;
  total_jurusan INTEGER;
  total_angkatan INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_mahasiswa FROM mahasiswa;
  SELECT COUNT(*) INTO total_jurusan FROM jurusan;
  SELECT COUNT(*) INTO total_angkatan FROM angkatan;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'FINAL DATABASE STRUCTURE - SELESAI';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Mahasiswa: %', total_mahasiswa;
  RAISE NOTICE 'Total Jurusan: %', total_jurusan;
  RAISE NOTICE 'Total Angkatan: %', total_angkatan;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Struktur database dengan relasi sudah siap!';
  RAISE NOTICE '✅ Tabel angkatan → Master data tahun angkatan';
  RAISE NOTICE '✅ Tabel jurusan → Master data jurusan';
  RAISE NOTICE '✅ Tabel mahasiswa → Data mahasiswa dengan foreign key';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Query mahasiswa lengkap:';
  RAISE NOTICE '   SELECT * FROM v_mahasiswa_lengkap;';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
