-- ============================================
-- TEST FOREIGN KEYS & AUTO-SYNC TRIGGER
-- Script untuk testing apakah foreign keys dan trigger berfungsi
-- ============================================

-- 1. Cek struktur tabel mahasiswa
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'mahasiswa'
  AND column_name IN ('angkatan', 'angkatan_id', 'jurusan', 'jurusan_id')
ORDER BY column_name;

-- 2. Cek apakah trigger aktif
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_sync_mahasiswa_text_columns';

-- 3. Lihat data angkatan yang tersedia
SELECT id, tahun, nama_angkatan, status FROM angkatan ORDER BY tahun DESC;

-- 4. Lihat data jurusan yang tersedia
SELECT id, nama_jurusan FROM jurusan ORDER BY nama_jurusan;

-- 5. Test INSERT dengan TEXT columns (trigger harus set FK otomatis)
-- Ganti nilai jurusan dan angkatan sesuai data yang ada di database Anda
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan, alamat, no_hp, status)
VALUES (
  'Test User Auto-Sync', 
  'TEST-' || FLOOR(RANDOM() * 10000)::TEXT, 
  (SELECT nama_jurusan FROM jurusan LIMIT 1),  -- Ambil jurusan pertama
  (SELECT tahun FROM angkatan WHERE status = 'Aktif' LIMIT 1),  -- Ambil angkatan aktif pertama
  'Alamat Test', 
  '08123456789', 
  'Menunggu'
)
RETURNING id, nama, nim, jurusan, jurusan_id, angkatan, angkatan_id;

-- 6. Verifikasi data yang baru diinsert
SELECT 
  id,
  nama,
  nim,
  jurusan as jurusan_text,
  jurusan_id as jurusan_fk,
  angkatan as angkatan_text,
  angkatan_id as angkatan_fk
FROM mahasiswa
WHERE nama = 'Test User Auto-Sync';

-- 7. Test UPDATE dengan FK (trigger harus update TEXT otomatis)
UPDATE mahasiswa
SET 
  jurusan_id = (SELECT id FROM jurusan ORDER BY id LIMIT 1 OFFSET 1),
  angkatan_id = (SELECT id FROM angkatan WHERE status = 'Aktif' ORDER BY id LIMIT 1 OFFSET 1)
WHERE nama = 'Test User Auto-Sync'
RETURNING id, nama, jurusan, jurusan_id, angkatan, angkatan_id;

-- 8. Verifikasi setelah update
SELECT 
  id,
  nama,
  nim,
  jurusan as jurusan_text,
  jurusan_id as jurusan_fk,
  angkatan as angkatan_text,
  angkatan_id as angkatan_fk
FROM mahasiswa
WHERE nama = 'Test User Auto-Sync';

-- 9. Lihat data lengkap dengan JOIN
SELECT 
  m.id,
  m.nama,
  m.nim,
  m.jurusan as jurusan_text,
  j.nama_jurusan as jurusan_from_fk,
  m.angkatan as angkatan_text,
  a.tahun as angkatan_from_fk,
  a.nama_angkatan
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id
WHERE m.nama = 'Test User Auto-Sync';

-- 10. Test VIEW v_mahasiswa_lengkap
SELECT * FROM v_mahasiswa_lengkap
WHERE nama = 'Test User Auto-Sync';

-- 11. Cleanup - Hapus data test
DELETE FROM mahasiswa WHERE nama = 'Test User Auto-Sync';

-- 12. Summary
DO $$
DECLARE
  total_mahasiswa INTEGER;
  mahasiswa_with_fk INTEGER;
  mahasiswa_without_fk INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_mahasiswa FROM mahasiswa;
  SELECT COUNT(*) INTO mahasiswa_with_fk FROM mahasiswa WHERE angkatan_id IS NOT NULL AND jurusan_id IS NOT NULL;
  SELECT COUNT(*) INTO mahasiswa_without_fk FROM mahasiswa WHERE angkatan_id IS NULL OR jurusan_id IS NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Mahasiswa: %', total_mahasiswa;
  RAISE NOTICE 'Mahasiswa dengan FK lengkap: %', mahasiswa_with_fk;
  RAISE NOTICE 'Mahasiswa tanpa FK: %', mahasiswa_without_fk;
  RAISE NOTICE '';
  
  IF mahasiswa_without_fk > 0 THEN
    RAISE NOTICE '⚠️  Ada % mahasiswa tanpa FK, jalankan sync manual:', mahasiswa_without_fk;
    RAISE NOTICE '   UPDATE mahasiswa m SET angkatan_id = a.id FROM angkatan a WHERE m.angkatan = a.tahun;';
    RAISE NOTICE '   UPDATE mahasiswa m SET jurusan_id = j.id FROM jurusan j WHERE m.jurusan = j.nama_jurusan;';
  ELSE
    RAISE NOTICE '✅ Semua mahasiswa memiliki FK lengkap!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
