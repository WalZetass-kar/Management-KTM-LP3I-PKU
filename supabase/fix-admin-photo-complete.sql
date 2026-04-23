-- =====================================================
-- COMPLETE FIX FOR ADMIN PHOTO FEATURE
-- =====================================================
-- Script lengkap untuk memastikan fitur foto admin berfungsi

-- Step 1: Ensure photo_url column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN photo_url text;
    RAISE NOTICE 'Column photo_url added to user_profiles';
  ELSE
    RAISE NOTICE 'Column photo_url already exists';
  END IF;
END $$;

-- Step 2: Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set up RLS policies for storage bucket
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile photos" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow authenticated users to upload profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow public to view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Allow users to delete their own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos');

CREATE POLICY "Allow users to update their own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos');

-- Step 4: Verify setup
SELECT 
  'user_profiles columns' as check_type,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
  'storage buckets' as check_type,
  id,
  name,
  public
FROM storage.buckets
WHERE name = 'profile-photos';

-- Step 5: Show current user profiles
SELECT 
  id,
  username,
  role,
  photo_url,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;
