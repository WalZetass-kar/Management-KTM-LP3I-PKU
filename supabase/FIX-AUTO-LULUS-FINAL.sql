-- =====================================================
-- FIX AUTO LULUS - FINAL VERSION
-- =====================================================
-- Jalankan SQL ini untuk fix error dan update status

-- STEP 1: Hapus function lama
DROP FUNCTION IF EXISTS auto_update_status_lulus();

-- STEP 2: Buat function baru dengan return type yang benar
CREATE FUNCTION auto_update_status_lulus()
RETURNS TABLE(updated_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_updated INTEGER;
BEGIN
  UPDATE mahasiswa
  SET 
    status = 'Lulus',
    updated_at = NOW()
  WHERE 
    status = 'Aktif'
    AND angkatan IS NOT NULL
    AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;
  
  GET DIAGNOSTICS count_updated = ROW_COUNT;
  RAISE NOTICE 'Berhasil update % mahasiswa menjadi Lulus', count_updated;
  
  RETURN QUERY SELECT count_updated;
END;
$$;

-- STEP 3: Buat trigger function
CREATE OR REPLACE FUNCTION check_and_update_graduation_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.angkatan IS NOT NULL 
     AND NEW.status = 'Aktif'
     AND CAST(NEW.angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2 
  THEN
    NEW.status := 'Lulus';
    NEW.updated_at := NOW();
    RAISE NOTICE 'Auto-update: Mahasiswa % (NIM: %) angkatan % otomatis status Lulus', NEW.nama, NEW.nim, NEW.angkatan;
  END IF;
  RETURN NEW;
END;
$$;

-- STEP 4: Buat trigger untuk INSERT (saat tambah data baru)
DROP TRIGGER IF EXISTS trigger_auto_graduation_insert ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_insert
  BEFORE INSERT ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- STEP 5: Buat trigger untuk UPDATE (saat edit data)
DROP TRIGGER IF EXISTS trigger_auto_graduation_update ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_update
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- STEP 5: JALANKAN UPDATE SEKARANG!
SELECT * FROM auto_update_status_lulus();

-- STEP 6: CEK HASIL
SELECT 
  nama,
  nim,
  angkatan,
  status,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - CAST(angkatan AS INTEGER) as lama_kuliah
FROM mahasiswa
WHERE angkatan IS NOT NULL
ORDER BY angkatan DESC, status;

-- =====================================================
-- SELESAI! SISTEM SEKARANG:
-- =====================================================
-- ✅ Update semua mahasiswa lama yang sudah 2 tahun
-- ✅ Otomatis set status "Lulus" saat TAMBAH mahasiswa baru dengan angkatan lama
-- ✅ Otomatis set status "Lulus" saat EDIT mahasiswa
--
-- CONTOH:
-- - Hari ini (2026) tambah mahasiswa angkatan 2023 → Otomatis "Lulus"
-- - Hari ini (2026) tambah mahasiswa angkatan 2024 → Otomatis "Lulus"  
-- - Hari ini (2026) tambah mahasiswa angkatan 2025 → Status "Aktif" (belum 2 tahun)
-- - Hari ini (2026) tambah mahasiswa angkatan 2026 → Status "Aktif" (baru masuk)
