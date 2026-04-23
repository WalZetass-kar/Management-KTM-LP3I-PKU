-- =====================================================
-- JALANKAN SQL INI DI SUPABASE SQL EDITOR
-- =====================================================
-- Copy semua SQL di bawah ini dan paste di Supabase SQL Editor
-- Lalu klik "Run" atau tekan Ctrl+Enter

-- =====================================================
-- STEP 0: Hapus function lama jika ada (fix error)
-- =====================================================
DROP FUNCTION IF EXISTS auto_update_status_lulus();

-- =====================================================
-- STEP 1: Buat fungsi untuk update status otomatis
-- =====================================================
CREATE FUNCTION auto_update_status_lulus()
RETURNS TABLE(updated_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_updated INTEGER;
BEGIN
  -- Update mahasiswa yang sudah 2 tahun dari angkatan dan masih berstatus Aktif
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

-- =====================================================
-- STEP 2: Buat trigger untuk auto-update saat data diubah
-- =====================================================
CREATE OR REPLACE FUNCTION check_and_update_graduation_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Cek apakah mahasiswa sudah 2 tahun dari angkatan
  IF NEW.angkatan IS NOT NULL 
     AND NEW.status = 'Aktif'
     AND CAST(NEW.angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2 
  THEN
    NEW.status := 'Lulus';
    NEW.updated_at := NOW();
    RAISE NOTICE 'Auto-update: Mahasiswa % (NIM: %) status berubah menjadi Lulus', NEW.nama, NEW.nim;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Hapus trigger lama jika ada
DROP TRIGGER IF EXISTS trigger_auto_graduation ON mahasiswa;

-- Buat trigger baru untuk INSERT (saat tambah data baru)
DROP TRIGGER IF EXISTS trigger_auto_graduation_insert ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_insert
  BEFORE INSERT ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- Buat trigger baru untuk UPDATE (saat edit data)
DROP TRIGGER IF EXISTS trigger_auto_graduation_update ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_update
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- =====================================================
-- STEP 3: JALANKAN UPDATE SEKARANG!
-- =====================================================
-- Ini akan langsung update semua mahasiswa yang memenuhi syarat
SELECT * FROM auto_update_status_lulus();

-- =====================================================
-- STEP 4: CEK HASIL
-- =====================================================
-- Lihat mahasiswa yang baru saja di-update
SELECT 
  nama,
  nim,
  angkatan,
  status,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - CAST(angkatan AS INTEGER) as lama_kuliah_tahun
FROM mahasiswa
WHERE 
  angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2
ORDER BY angkatan DESC;

-- Lihat ringkasan per angkatan
SELECT 
  angkatan,
  status,
  COUNT(*) as jumlah
FROM mahasiswa
WHERE angkatan IS NOT NULL
GROUP BY angkatan, status
ORDER BY angkatan DESC, status;

-- =====================================================
-- SELESAI!
-- =====================================================
-- Sekarang sistem akan:
-- 1. ✅ Sudah update semua mahasiswa yang memenuhi syarat
-- 2. ✅ Otomatis set "Lulus" saat TAMBAH mahasiswa baru dengan angkatan lama
-- 3. ✅ Otomatis set "Lulus" saat EDIT data mahasiswa
-- 4. ✅ Bisa dijalankan manual dari Settings page
--
-- CONTOH PENGGUNAAN:
-- - Hari ini (2026) tambah mahasiswa angkatan 2023 → Otomatis "Lulus" ✅
-- - Hari ini (2026) tambah mahasiswa angkatan 2024 → Otomatis "Lulus" ✅
-- - Hari ini (2026) tambah mahasiswa angkatan 2025 → Status "Aktif" (belum 2 tahun)
-- - Hari ini (2026) tambah mahasiswa angkatan 2026 → Status "Aktif" (baru masuk)
