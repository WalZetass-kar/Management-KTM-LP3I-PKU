-- =====================================================
-- AUTO UPDATE STATUS MAHASISWA MENJADI LULUS
-- =====================================================
-- Mahasiswa otomatis berstatus "Lulus" setelah 2 tahun dari angkatan
-- Contoh: Angkatan 2025 → Lulus di 2027

-- 1. Buat fungsi untuk update status otomatis
CREATE OR REPLACE FUNCTION auto_update_status_lulus()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    
  RAISE NOTICE 'Status mahasiswa berhasil diupdate ke Lulus';
END;
$$;

-- 2. Buat fungsi yang dipanggil sebelum query (untuk real-time update)
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
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Buat trigger untuk auto-update saat data diakses/diupdate
DROP TRIGGER IF EXISTS trigger_auto_graduation ON mahasiswa;

-- Trigger untuk INSERT (saat tambah data baru)
DROP TRIGGER IF EXISTS trigger_auto_graduation_insert ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_insert
  BEFORE INSERT ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- Trigger untuk UPDATE (saat edit data)
DROP TRIGGER IF EXISTS trigger_auto_graduation_update ON mahasiswa;
CREATE TRIGGER trigger_auto_graduation_update
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_graduation_status();

-- 4. Jalankan update pertama kali untuk data yang sudah ada
SELECT auto_update_status_lulus();

-- =====================================================
-- CARA PENGGUNAAN:
-- =====================================================
-- 1. Jalankan SQL ini di Supabase SQL Editor
-- 2. Status akan otomatis update saat:
--    - Data mahasiswa di-update
--    - Atau jalankan manual: SELECT auto_update_status_lulus();
-- 3. Untuk cron job otomatis, gunakan pg_cron (lihat di bawah)

-- =====================================================
-- OPTIONAL: Setup Cron Job (Jika tersedia di Supabase)
-- =====================================================
-- Jalankan setiap hari jam 00:00 untuk update otomatis
-- SELECT cron.schedule(
--   'auto-graduate-students',
--   '0 0 * * *', -- Setiap hari jam 00:00
--   $$ SELECT auto_update_status_lulus(); $$
-- );

-- =====================================================
-- TESTING
-- =====================================================
-- Cek mahasiswa yang akan di-update
SELECT 
  id,
  nama,
  nim,
  angkatan,
  status,
  EXTRACT(YEAR FROM CURRENT_DATE) - CAST(angkatan AS INTEGER) as tahun_kuliah
FROM mahasiswa
WHERE 
  status = 'Aktif'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;

-- Cek hasil setelah update
SELECT 
  angkatan,
  status,
  COUNT(*) as jumlah
FROM mahasiswa
GROUP BY angkatan, status
ORDER BY angkatan DESC, status;
