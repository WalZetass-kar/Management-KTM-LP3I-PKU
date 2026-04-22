-- Fix RLS policies untuk semua tabel
-- Hapus policies lama dan buat yang baru dengan fungsi is_admin_user()

-- 1. DROP existing policies untuk jurusan
DROP POLICY IF EXISTS "Allow authenticated users to read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Allow authenticated users to delete jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can read jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can insert jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can update jurusan" ON jurusan;
DROP POLICY IF EXISTS "Admins can delete jurusan" ON jurusan;

-- 2. DROP existing policies untuk mahasiswa_angkatan
DROP POLICY IF EXISTS "Allow authenticated users to read mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to insert mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to update mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Allow authenticated users to delete mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can read mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can insert mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can update mahasiswa_angkatan" ON mahasiswa_angkatan;
DROP POLICY IF EXISTS "Admins can delete mahasiswa_angkatan" ON mahasiswa_angkatan;

-- 3. DROP existing policies untuk angkatan
DROP POLICY IF EXISTS "Admins can read angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can insert angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can update angkatan" ON angkatan;
DROP POLICY IF EXISTS "Admins can delete angkatan" ON angkatan;

-- 4. Enable RLS untuk semua tabel
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE mahasiswa_angkatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE angkatan ENABLE ROW LEVEL SECURITY;

-- 5. Buat policies baru yang benar untuk jurusan
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

-- 6. Buat policies baru yang benar untuk mahasiswa_angkatan
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

-- 7. Policies untuk angkatan sudah benar di create-angkatan-table.sql
-- Tapi kita pastikan lagi di sini
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

-- 8. Pastikan tabel bisa diakses
GRANT ALL ON jurusan TO authenticated;
GRANT ALL ON mahasiswa_angkatan TO authenticated;
GRANT ALL ON angkatan TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE jurusan_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE mahasiswa_angkatan_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE angkatan_id_seq TO authenticated;