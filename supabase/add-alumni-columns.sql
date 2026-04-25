-- Add alumni-specific columns to mahasiswa table
-- Run this in Supabase SQL Editor

ALTER TABLE public.mahasiswa 
ADD COLUMN IF NOT EXISTS tahun_lulus VARCHAR(4),
ADD COLUMN IF NOT EXISTS pekerjaan_saat_ini TEXT,
ADD COLUMN IF NOT EXISTS perusahaan_saat_ini TEXT,
ADD COLUMN IF NOT EXISTS lokasi_saat_ini TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.mahasiswa.tahun_lulus IS 'Tahun kelulusan untuk alumni';
COMMENT ON COLUMN public.mahasiswa.pekerjaan_saat_ini IS 'Posisi/jabatan pekerjaan alumni saat ini';
COMMENT ON COLUMN public.mahasiswa.perusahaan_saat_ini IS 'Nama perusahaan tempat alumni bekerja';
COMMENT ON COLUMN public.mahasiswa.lokasi_saat_ini IS 'Lokasi domisili alumni saat ini';
