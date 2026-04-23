-- =====================================================
-- QUICK FIX: Update Status Lulus SEKARANG (PALING MUDAH)
-- =====================================================
-- Jalankan SQL ini jika ingin langsung update tanpa setup function
-- Tidak ada error, langsung jalan!

-- Update langsung semua mahasiswa yang sudah 2 tahun
UPDATE mahasiswa
SET 
  status = 'Lulus',
  updated_at = NOW()
WHERE 
  status = 'Aktif'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;

-- Tampilkan hasil
SELECT 
  'Update Selesai! ✅' as message,
  COUNT(*) as jumlah_mahasiswa_yang_diupdate
FROM mahasiswa
WHERE 
  status = 'Lulus'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;

-- Tampilkan detail mahasiswa yang baru lulus
SELECT 
  nama,
  nim,
  angkatan,
  status,
  jurusan,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - CAST(angkatan AS INTEGER) as lama_kuliah_tahun
FROM mahasiswa
WHERE 
  status = 'Lulus'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2
ORDER BY angkatan DESC;

-- =====================================================
-- SELESAI!
-- =====================================================
-- Mahasiswa angkatan 2023 dan 2024 sekarang sudah status "Lulus"
-- Refresh halaman Data Mahasiswa untuk lihat perubahan
