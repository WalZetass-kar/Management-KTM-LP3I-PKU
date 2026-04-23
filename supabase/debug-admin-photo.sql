-- =====================================================
-- DEBUG ADMIN PHOTO ISSUE
-- =====================================================
-- Script untuk debug kenapa foto admin tidak muncul

-- 1. Check if photo_url column exists
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current user_profiles data
SELECT 
  id,
  username,
  role,
  photo_url,
  created_at,
  updated_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- 3. Check storage bucket exists
SELECT 
  id,
  name,
  public
FROM storage.buckets
WHERE name = 'profile-photos';

-- 4. Check if there are any files in storage
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'profile-photos'
ORDER BY created_at DESC
LIMIT 10;
