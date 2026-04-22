-- ============================================
-- VERIFY ALL FIXES
-- Script untuk memverifikasi semua perbaikan
-- ============================================

-- 1. Cek apakah fungsi helper ada
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user') THEN
    RAISE NOTICE '✅ Fungsi is_admin_user() ada';
  ELSE
    RAISE WARNING '❌ Fungsi is_admin_user() TIDAK ADA!';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_super_admin_user') THEN
    RAISE NOTICE '✅ Fungsi is_super_admin_user() ada';
  ELSE
    RAISE WARNING '❌ Fungsi is_super_admin_user() TIDAK ADA!';
  END IF;
END $$;

-- 2. Cek apakah semua tabel ada
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_profiles') THEN
    RAISE NOTICE '✅ Tabel user_profiles ada';
  ELSE
    RAISE WARNING '❌ Tabel user_profiles TIDAK ADA!';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'mahasiswa') THEN
    RAISE NOTICE '✅ Tabel mahasiswa ada';
  ELSE
    RAISE WARNING '❌ Tabel mahasiswa TIDAK ADA!';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'jurusan') THEN
    RAISE NOTICE '✅ Tabel jurusan ada';
  ELSE
    RAISE WARNING '❌ Tabel jurusan TIDAK ADA!';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'angkatan') THEN
    RAISE NOTICE '✅ Tabel angkatan ada';
  ELSE
    RAISE WARNING '❌ Tabel angkatan TIDAK ADA!';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'mahasiswa_angkatan') THEN
    RAISE NOTICE '✅ Tabel mahasiswa_angkatan ada';
  ELSE
    RAISE WARNING '❌ Tabel mahasiswa_angkatan TIDAK ADA!';
  END IF;
END $$;

-- 3. Cek RLS status
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'mahasiswa', 'jurusan', 'angkatan', 'mahasiswa_angkatan')
ORDER BY tablename;

-- 4. Cek policies untuk jurusan
SELECT 
  '✅ Policy: ' || policyname as policy_info,
  cmd as command_type
FROM pg_policies
WHERE tablename = 'jurusan'
ORDER BY policyname;

-- 5. Cek policies untuk angkatan
SELECT 
  '✅ Policy: ' || policyname as policy_info,
  cmd as command_type
FROM pg_policies
WHERE tablename = 'angkatan'
ORDER BY policyname;

-- 6. Cek policies untuk mahasiswa_angkatan
SELECT 
  '✅ Policy: ' || policyname as policy_info,
  cmd as command_type
FROM pg_policies
WHERE tablename = 'mahasiswa_angkatan'
ORDER BY policyname;

-- 7. Cek indexes
SELECT 
  '✅ Index: ' || indexname as index_info,
  tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('mahasiswa', 'jurusan', 'angkatan', 'mahasiswa_angkatan')
ORDER BY tablename, indexname;

-- 8. Cek storage bucket
SELECT 
  '✅ Bucket: ' || name as bucket_info,
  CASE WHEN public THEN 'Public' ELSE 'Private' END as access_type,
  file_size_limit / 1024 / 1024 || ' MB' as max_file_size
FROM storage.buckets
WHERE name = 'foto-mahasiswa';

-- 9. Cek storage policies
SELECT 
  '✅ Storage Policy: ' || policyname as policy_info,
  operation
FROM storage.policies
WHERE bucket_id = 'foto-mahasiswa'
ORDER BY policyname;

-- 10. Cek jumlah data
SELECT 
  'jurusan' as tabel,
  COUNT(*) as jumlah_data
FROM jurusan
UNION ALL
SELECT 
  'angkatan' as tabel,
  COUNT(*) as jumlah_data
FROM angkatan
UNION ALL
SELECT 
  'mahasiswa_angkatan' as tabel,
  COUNT(*) as jumlah_data
FROM mahasiswa_angkatan
UNION ALL
SELECT 
  'mahasiswa' as tabel,
  COUNT(*) as jumlah_data
FROM mahasiswa;

-- 11. Summary
DO $$
DECLARE
  total_policies INTEGER;
  total_indexes INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_policies
  FROM pg_policies
  WHERE tablename IN ('jurusan', 'angkatan', 'mahasiswa_angkatan', 'mahasiswa');

  SELECT COUNT(*) INTO total_indexes
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename IN ('mahasiswa', 'jurusan', 'angkatan', 'mahasiswa_angkatan');

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUMMARY VERIFIKASI';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Policies: %', total_policies;
  RAISE NOTICE 'Total Indexes: %', total_indexes;
  RAISE NOTICE '';
  
  IF total_policies >= 16 THEN
    RAISE NOTICE '✅ Semua policies sudah lengkap!';
  ELSE
    RAISE WARNING '⚠️  Policies kurang dari yang diharapkan (minimal 16)';
  END IF;

  IF total_indexes >= 8 THEN
    RAISE NOTICE '✅ Indexes sudah cukup!';
  ELSE
    RAISE WARNING '⚠️  Indexes kurang dari yang diharapkan (minimal 8)';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
