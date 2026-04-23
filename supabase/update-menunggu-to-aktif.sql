-- =====================================================
-- UPDATE STATUS "MENUNGGU" JADI "AKTIF"
-- =====================================================
-- Jalankan SQL ini untuk update mahasiswa lama yang masih status "Menunggu"

-- Cek berapa mahasiswa yang masih "Menunggu"
SELECT 
  COUNT(*) as jumlah_menunggu,
  'mahasiswa dengan status Menunggu' as keterangan
FROM mahasiswa
WHERE status = 'Menunggu';

-- Update semua mahasiswa "Menunggu" jadi "Aktif"
UPDATE mahasiswa
SET 
  status = 'Aktif',
  updated_at = NOW()
WHERE status = 'Menunggu';

-- Tampilkan hasil update
SELECT 
  'Update Selesai!' as message,
  COUNT(*) as jumlah_yang_diupdate
FROM mahasiswa
WHERE status = 'Aktif'
  AND updated_at >= NOW() - INTERVAL '1 minute';

-- Cek ringkasan status setelah update
SELECT 
  status,
  COUNT(*) as jumlah
FROM mahasiswa
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'Aktif' THEN 1
    WHEN 'Lulus' THEN 2
    WHEN 'Cuti' THEN 3
    WHEN 'Tidak Aktif' THEN 4
    ELSE 5
  END;

-- =====================================================
-- SELESAI!
-- =====================================================
-- Sekarang tidak ada lagi mahasiswa dengan status "Menunggu"
-- Semua mahasiswa otomatis "Aktif" saat ditambahkan
