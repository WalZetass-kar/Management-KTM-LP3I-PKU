-- =====================================================
-- ADD PHOTO_URL TO USER_PROFILES TABLE
-- =====================================================
-- Tambah kolom photo_url untuk foto profil admin

-- Add photo_url column
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;

-- Add comment
COMMENT ON COLUMN public.user_profiles.photo_url IS 'URL foto profil admin dari storage';

-- Verify
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
