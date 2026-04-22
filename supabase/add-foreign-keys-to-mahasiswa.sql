-- ============================================
-- ADD FOREIGN KEYS TO MAHASISWA TABLE
-- Menambahkan angkatan_id, jurusan_id, dan kolom text untuk backward compatibility
-- ============================================

-- 0. Drop views yang bergantung pada tabel mahasiswa
DROP VIEW IF EXISTS mahasiswa_angkatan CASCADE;
DROP VIEW IF EXISTS v_mahasiswa_lengkap CASCADE;

-- 1. Tambahkan kolom angkatan (text) jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mahasiswa' AND column_name = 'angkatan'
  ) THEN
    ALTER TABLE mahasiswa ADD COLUMN angkatan text;
    RAISE NOTICE '✅ Kolom angkatan (text) ditambahkan';
  ELSE
    RAISE NOTICE '⚠️  Kolom angkatan sudah ada';
  END IF;
END $$;

-- 2. Tambahkan kolom jurusan (text) jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mahasiswa' AND column_name = 'jurusan'
  ) THEN
    ALTER TABLE mahasiswa ADD COLUMN jurusan text;
    RAISE NOTICE '✅ Kolom jurusan (text) ditambahkan';
  ELSE
    RAISE NOTICE '⚠️  Kolom jurusan sudah ada';
  END IF;
END $$;

-- 3. Tambahkan kolom angkatan_id jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mahasiswa' AND column_name = 'angkatan_id'
  ) THEN
    ALTER TABLE mahasiswa ADD COLUMN angkatan_id integer REFERENCES angkatan(id) ON DELETE RESTRICT;
    RAISE NOTICE '✅ Kolom angkatan_id ditambahkan';
  ELSE
    RAISE NOTICE '⚠️  Kolom angkatan_id sudah ada';
  END IF;
END $$;

-- 4. Pastikan kolom jurusan_id sudah ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mahasiswa' AND column_name = 'jurusan_id'
  ) THEN
    ALTER TABLE mahasiswa ADD COLUMN jurusan_id integer REFERENCES jurusan(id) ON DELETE RESTRICT;
    RAISE NOTICE '✅ Kolom jurusan_id ditambahkan';
  ELSE
    RAISE NOTICE '⚠️  Kolom jurusan_id sudah ada';
  END IF;
END $$;

-- 5. Update angkatan_id berdasarkan kolom angkatan (text) jika ada data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM mahasiswa WHERE angkatan IS NOT NULL AND angkatan_id IS NULL
  ) THEN
    UPDATE mahasiswa m
    SET angkatan_id = a.id
    FROM angkatan a
    WHERE m.angkatan = a.tahun
      AND m.angkatan_id IS NULL;
    RAISE NOTICE '✅ angkatan_id di-sync dari kolom angkatan';
  END IF;
END $$;

-- 6. Update jurusan_id berdasarkan kolom jurusan (text) jika ada data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM mahasiswa WHERE jurusan IS NOT NULL AND jurusan_id IS NULL
  ) THEN
    UPDATE mahasiswa m
    SET jurusan_id = j.id
    FROM jurusan j
    WHERE m.jurusan = j.nama_jurusan
      AND m.jurusan_id IS NULL;
    RAISE NOTICE '✅ jurusan_id di-sync dari kolom jurusan';
  END IF;
END $$;

-- 7. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_id ON mahasiswa(angkatan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan ON mahasiswa(angkatan);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_jurusan ON mahasiswa(jurusan);

-- 8. Buat VIEW untuk query dengan JOIN
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
  COALESCE(m.jurusan_id, 0) as jurusan_id,
  COALESCE(j.nama_jurusan, m.jurusan, '') as nama_jurusan,
  COALESCE(m.angkatan_id, 0) as angkatan_id,
  COALESCE(a.tahun, m.angkatan, '') as angkatan,
  COALESCE(a.nama_angkatan, 'Angkatan ' || m.angkatan, '') as nama_angkatan
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id;

-- 9. Recreate mahasiswa_angkatan VIEW untuk backward compatibility
CREATE OR REPLACE VIEW mahasiswa_angkatan AS
SELECT 
  m.id,
  m.nama as full_name,
  m.nim,
  COALESCE(a.tahun, m.angkatan, '') as angkatan,
  COALESCE(j.nama_jurusan, m.jurusan, '') as study_program,
  m.status,
  m.foto_url as photo_url,
  m.alamat as address,
  m.no_hp as phone_number,
  m.created_at,
  m.updated_at
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id;

-- 10. Buat function untuk auto-sync kolom text dengan foreign key (BIDIRECTIONAL)
CREATE OR REPLACE FUNCTION sync_mahasiswa_text_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- SYNC TEXT -> FK: Jika jurusan (text) diisi, sync ke jurusan_id
  IF NEW.jurusan IS NOT NULL AND NEW.jurusan != '' THEN
    SELECT id INTO NEW.jurusan_id
    FROM jurusan
    WHERE nama_jurusan = NEW.jurusan
    LIMIT 1;
  END IF;

  -- SYNC TEXT -> FK: Jika angkatan (text) diisi, sync ke angkatan_id
  IF NEW.angkatan IS NOT NULL AND NEW.angkatan != '' THEN
    SELECT id INTO NEW.angkatan_id
    FROM angkatan
    WHERE tahun = NEW.angkatan
    LIMIT 1;
  END IF;

  -- SYNC FK -> TEXT: Jika jurusan_id diisi, sync ke jurusan (text)
  IF NEW.jurusan_id IS NOT NULL THEN
    SELECT nama_jurusan INTO NEW.jurusan
    FROM jurusan
    WHERE id = NEW.jurusan_id;
  END IF;

  -- SYNC FK -> TEXT: Jika angkatan_id diisi, sync ke angkatan (text)
  IF NEW.angkatan_id IS NOT NULL THEN
    SELECT tahun INTO NEW.angkatan
    FROM angkatan
    WHERE id = NEW.angkatan_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Buat trigger untuk auto-sync
DROP TRIGGER IF EXISTS trigger_sync_mahasiswa_text_columns ON mahasiswa;
CREATE TRIGGER trigger_sync_mahasiswa_text_columns
  BEFORE INSERT OR UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION sync_mahasiswa_text_columns();

-- 12. Summary
DO $$
DECLARE
  total_mahasiswa INTEGER;
  mahasiswa_with_angkatan_id INTEGER;
  mahasiswa_with_jurusan_id INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_mahasiswa FROM mahasiswa;
  SELECT COUNT(*) INTO mahasiswa_with_angkatan_id FROM mahasiswa WHERE angkatan_id IS NOT NULL;
  SELECT COUNT(*) INTO mahasiswa_with_jurusan_id FROM mahasiswa WHERE jurusan_id IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ADD FOREIGN KEYS - SELESAI';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Mahasiswa: %', total_mahasiswa;
  RAISE NOTICE 'Mahasiswa dengan angkatan_id: %', mahasiswa_with_angkatan_id;
  RAISE NOTICE 'Mahasiswa dengan jurusan_id: %', mahasiswa_with_jurusan_id;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Kolom angkatan dan jurusan (text) sudah ada!';
  RAISE NOTICE '✅ Kolom angkatan_id dan jurusan_id sudah ditambahkan!';
  RAISE NOTICE '✅ Data sudah di-sync dari kolom text';
  RAISE NOTICE '✅ Trigger auto-sync BIDIRECTIONAL sudah aktif';
  RAISE NOTICE '✅ VIEW v_mahasiswa_lengkap sudah dibuat';
  RAISE NOTICE '✅ VIEW mahasiswa_angkatan sudah dibuat (backward compatibility)';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Query mahasiswa lengkap:';
  RAISE NOTICE '   SELECT * FROM v_mahasiswa_lengkap;';
  RAISE NOTICE '';
  RAISE NOTICE 'ℹ️  Sekarang Anda bisa:';
  RAISE NOTICE '   - Insert dengan kolom text (angkatan, jurusan) -> FK auto-sync';
  RAISE NOTICE '   - Insert dengan FK (angkatan_id, jurusan_id) -> text auto-sync';
  RAISE NOTICE '   - Form bisa menggunakan dropdown dari tabel master';
  RAISE NOTICE '   - Kode lama tetap berfungsi dengan VIEW mahasiswa_angkatan';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
