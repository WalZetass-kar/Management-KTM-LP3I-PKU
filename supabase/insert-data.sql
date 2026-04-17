-- ============================================
-- INSERT DATA SAMPLE
-- ============================================

-- ============================================
-- 1. INSERT DATA MAHASISWA
-- ============================================

-- Insert 10 mahasiswa sample
INSERT INTO public.mahasiswa (nama, nim, jurusan, alamat, no_hp, foto_url, status)
VALUES 
  (
    'Ahmad Fadli',
    '2024010101',
    'Teknik Informatika',
    'Jl. Harapan No. 10, Pekanbaru',
    '081234567890',
    NULL,
    'Aktif'
  ),
  (
    'Siti Nurhaliza',
    '2024010102',
    'Akuntansi',
    'Jl. Melati No. 18, Pekanbaru',
    '081234567891',
    NULL,
    'Aktif'
  ),
  (
    'Budi Santoso',
    '2024010103',
    'Manajemen',
    'Jl. Garuda No. 6, Pekanbaru',
    '081234567892',
    NULL,
    'Aktif'
  ),
  (
    'Dewi Lestari',
    '2024010104',
    'Teknik Informatika',
    'Jl. Anggrek No. 24, Pekanbaru',
    '081234567893',
    NULL,
    'Menunggu'
  ),
  (
    'Rudi Hermawan',
    '2024010105',
    'Akuntansi',
    'Jl. Rajawali No. 2, Pekanbaru',
    '081234567894',
    NULL,
    'Aktif'
  ),
  (
    'Rina Wijaya',
    '2024010106',
    'Manajemen',
    'Jl. Sudirman No. 88, Pekanbaru',
    '081234567895',
    NULL,
    'Aktif'
  ),
  (
    'Andi Pratama',
    '2024010107',
    'Administrasi Bisnis',
    'Jl. Diponegoro No. 45, Pekanbaru',
    '081234567896',
    NULL,
    'Aktif'
  ),
  (
    'Maya Sari',
    '2024010108',
    'Teknik Informatika',
    'Jl. Veteran No. 12, Pekanbaru',
    '081234567897',
    NULL,
    'Menunggu'
  ),
  (
    'Doni Setiawan',
    '2024010109',
    'Akuntansi',
    'Jl. Imam Bonjol No. 33, Pekanbaru',
    '081234567898',
    NULL,
    'Aktif'
  ),
  (
    'Lina Marlina',
    '2024010110',
    'Manajemen',
    'Jl. Jendral Sudirman No. 67, Pekanbaru',
    '081234567899',
    NULL,
    'Aktif'
  )
ON CONFLICT (nim) DO NOTHING;

-- ============================================
-- 2. VERIFIKASI DATA
-- ============================================

-- Cek jumlah mahasiswa
SELECT COUNT(*) as total_mahasiswa FROM public.mahasiswa;

-- Cek mahasiswa per status
SELECT status, COUNT(*) as jumlah 
FROM public.mahasiswa 
GROUP BY status;

-- Cek mahasiswa per jurusan
SELECT jurusan, COUNT(*) as jumlah 
FROM public.mahasiswa 
GROUP BY jurusan
ORDER BY jumlah DESC;

-- Tampilkan semua mahasiswa
SELECT 
  id,
  nama,
  nim,
  jurusan,
  status,
  created_at
FROM public.mahasiswa 
ORDER BY created_at DESC;
