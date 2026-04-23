-- =====================================================
-- FIX ROLE CASE SENSITIVITY
-- =====================================================
-- Role harus lowercase: "admin" atau "super_admin"
-- Bukan "Admin" atau "Super Admin"

-- Check current roles (case sensitive)
SELECT 
  id,
  username,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Correct'
    WHEN role = 'super_admin' THEN '✅ Correct'
    WHEN LOWER(role) = 'admin' THEN '❌ Wrong case (should be lowercase)'
    WHEN LOWER(role) = 'super_admin' THEN '❌ Wrong case (should be lowercase)'
    ELSE '❌ Invalid role'
  END as status
FROM public.user_profiles
ORDER BY created_at DESC;

-- Fix all roles to lowercase
UPDATE public.user_profiles
SET role = LOWER(REPLACE(role, ' ', '_'))
WHERE role != LOWER(REPLACE(role, ' ', '_'));

-- Specifically fix common issues
UPDATE public.user_profiles
SET role = 'admin'
WHERE LOWER(role) = 'admin' AND role != 'admin';

UPDATE public.user_profiles
SET role = 'super_admin'
WHERE LOWER(REPLACE(role, ' ', '_')) = 'super_admin' AND role != 'super_admin';

-- Verify fix
SELECT 
  id,
  username,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Admin (5 menu)'
    WHEN role = 'super_admin' THEN '✅ Super Admin (8 menu)'
    ELSE '❌ Invalid role'
  END as expected_behavior
FROM public.user_profiles
ORDER BY created_at DESC;
