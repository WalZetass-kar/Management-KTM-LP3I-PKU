-- =====================================================
-- CHECK USER ROLES
-- =====================================================
-- Script untuk mengecek role semua user

-- Check all users and their roles
SELECT 
  id,
  username,
  role,
  created_at,
  updated_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- Count by role
SELECT 
  role,
  COUNT(*) as total
FROM public.user_profiles
GROUP BY role;

-- Check if there are any users without role
SELECT 
  id,
  username,
  role
FROM public.user_profiles
WHERE role IS NULL OR role NOT IN ('admin', 'super_admin');
