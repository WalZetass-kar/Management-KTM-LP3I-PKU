-- ============================================
-- FIX ALL DATABASE ISSUES
-- Script komprehensif untuk memperbaiki semua bug
-- ============================================

-- 1. Pastikan fungsi helper sudah ada
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

-- ============================================
-- 2. FIX TABEL JURUSAN
-- ============================================

-- Drop semua policies lama
DROP POLICY IF EXISTS "Allow authenticated users to read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to delete jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can delete jurusan" ON jurusan;

-- Enable RLS
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;

-- Buat policies baru yang benar
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

-- Grant permissions
GRANT ALL ON jurusan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE jurusan_id_seq TO authenticated;

-- ============================================
-- 3. FIX TABEL MAHASISWA_ANGKATAN
-- ============================================

-- Drop semua policies lama
DROP POLICY IF EXISTS "Allow authenticated users to read mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to insert mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to update mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to delete mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can read mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can insert mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can update mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can delete mahasiswa_angkatan" ON mahasiswa_angkatan;

-- Enable RLS
ALTER TABLE mahasiswa_angkatan ENABLE ROW LEVEL SECURITY;

-- Buat policies baru yang benar
CREATE POLICY "Admins can read mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- Grant permissions
GRANT ALL ON mahasiswa_angkatan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_angkatan_id_seq TO authenticated;

-- ============================================
-- 4. FIX TABEL ANGKATAN
-- ============================================

-- Drop semua policies lama
DROP POLICY IF EXISTS "Admins can read angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can insert angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can update angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can delete angkatan" ON angkatan;

-- Enable RLS
ALTER TABLE angkatan ENABLE ROW LEVEL SECURITY;

-- Buat policies baru yang benar
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

-- Grant permissions
GRANT ALL ON angkatan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE angkatan_id_seq TO authenticated;

-- ============================================
-- 5. PASTIKAN TABEL MAHASISWA SUDAH BENAR
-- ============================================

-- Pastikan RLS enabled
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON mahasiswa TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_id_seq TO authenticated;

-- ============================================
-- 6. PASTIKAN STORAGE BUCKET SUDAH BENAR
-- ============================================

-- Pastikan bucket foto-mahasiswa ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'foto-mahasiswa',
  'foto-mahasiswa',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Drop policies lama untuk storage
DROP POLICY IF EXISTS "Admins can view mahasiswa photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload mahasiswa photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update mahasiswa photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete mahasiswa photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view mahasiswa photos" ON storage.objects;

-- Buat policies baru untuk storage
CREATE POLICY "Admins can view mahasiswa photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'foto-mahasiswa'
    AND (SELECT public.is_admin_user())
  );

CREATE POLICY "Public can view mahasiswa photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'foto-mahasiswa');

CREATE POLICY "Admins can upload mahasiswa photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'foto-mahasiswa'
    AND (SELECT public.is_admin_user())
  );

CREATE POLICY "Admins can update mahasiswa photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'foto-mahasiswa'
    AND (SELECT public.is_admin_user())
  )
  WITH CHECK (
    bucket_id = 'foto-mahasiswa'
    AND (SELECT public.is_admin_user())
  );

CREATE POLICY "Admins can delete mahasiswa photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'foto-mahasiswa'
    AND (SELECT public.is_admin_user())
  );

-- ============================================
-- 7. VERIFIKASI SEMUA TABEL ADA
-- ============================================

-- Pastikan tabel user_profiles ada
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Pastikan tabel mahasiswa ada
CREATE TABLE IF NOT EXISTS public.mahasiswa (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  jurusan text NOT NULL,
  jurusan_id integer REFERENCES jurusan(id),
  angkatan text,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  foto_url text,
  status text NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Aktif', 'Menunggu', 'Tidak Aktif', 'Lulus', 'Cuti')),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Pastikan tabel jurusan ada
CREATE TABLE IF NOT EXISTS public.jurusan (
  id serial PRIMARY KEY,
  nama_jurusan varchar(255) UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan tabel angkatan ada
CREATE TABLE IF NOT EXISTS public.angkatan (
  id serial PRIMARY KEY,
  tahun varchar(4) UNIQUE NOT NULL,
  nama_angkatan varchar(100) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Tidak Aktif')),
  keterangan text,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan tabel mahasiswa_angkatan ada
CREATE TABLE IF NOT EXISTS public.mahasiswa_angkatan (
  id serial PRIMARY KEY,
  full_name varchar(255) NOT NULL,
  nim varchar(50) UNIQUE NOT NULL,
  angkatan varchar(4) NOT NULL,
  study_program varchar(255) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'Menunggu',
  photo_url text,
  address text NOT NULL,
  phone_number varchar(20) NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. BUAT INDEX UNTUK PERFORMA
-- ============================================

CREATE INDEX IF NOT EXISTS idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_status ON mahasiswa(status);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan ON mahasiswa(angkatan);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_nim ON mahasiswa(nim);

CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_angkatan ON mahasiswa_angkatan(angkatan);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_status ON mahasiswa_angkatan(status);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_study_program ON mahasiswa_angkatan(study_program);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_nim ON mahasiswa_angkatan(nim);

CREATE INDEX IF NOT EXISTS idx_jurusan_nama ON jurusan(nama_jurusan);

CREATE INDEX IF NOT EXISTS idx_angkatan_tahun ON angkatan(tahun);
CREATE INDEX IF NOT EXISTS idx_angkatan_status ON angkatan(status);

-- ============================================
-- SELESAI
-- ============================================

-- Tampilkan pesan sukses
DO $$
BEGIN
  RAISE NOTICE 'Database berhasil diperbaiki! Semua policies, permissions, dan indexes sudah diupdate.';
END $$;
