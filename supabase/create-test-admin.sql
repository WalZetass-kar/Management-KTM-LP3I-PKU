-- =====================================================
-- CREATE TEST ADMIN USER
-- =====================================================
-- Script untuk membuat user test dengan role admin

-- CARA MEMBUAT USER ADMIN:
-- 1. Buat user di Supabase Authentication Dashboard
-- 2. Copy user ID dari dashboard
-- 3. Jalankan query di bawah ini (ganti USER_ID)

-- Example: Update existing user to admin role
-- UPDATE public.user_profiles
-- SET role = 'admin'
-- WHERE id = 'USER_ID_DARI_SUPABASE_AUTH';

-- Check current users and their roles
SELECT 
  id,
  username,
  role,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- =====================================================
-- TESTING RBAC
-- =====================================================

-- Test 1: Check role distribution
SELECT 
  role,
  COUNT(*) as total_users
FROM public.user_profiles
GROUP BY role;

-- Test 2: Find admin users
SELECT 
  id,
  username,
  role
FROM public.user_profiles
WHERE role = 'admin';

-- Test 3: Find super_admin users
SELECT 
  id,
  username,
  role
FROM public.user_profiles
WHERE role = 'super_admin';

-- =====================================================
-- CHANGE USER ROLE
-- =====================================================

-- Change user to admin (GANTI USERNAME)
-- UPDATE public.user_profiles
-- SET role = 'admin'
-- WHERE username = 'GANTI_DENGAN_USERNAME';

-- Change user to super_admin (GANTI USERNAME)
-- UPDATE public.user_profiles
-- SET role = 'super_admin'
-- WHERE username = 'GANTI_DENGAN_USERNAME';

-- Verify change
-- SELECT username, role FROM public.user_profiles WHERE username = 'GANTI_DENGAN_USERNAME';
