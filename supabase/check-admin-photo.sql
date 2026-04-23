-- =====================================================
-- CHECK ADMIN PHOTO IN DATABASE
-- =====================================================
-- Query untuk cek apakah foto admin sudah tersimpan

-- Cek struktur tabel user_profiles
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Cek data admin dan foto mereka
SELECT 
  id,
  username,
  role,
  photo_url,
  created_at
FROM user_profiles
ORDER BY created_at DESC;

-- Cek admin yang sudah punya foto
SELECT 
  username,
  role,
  CASE 
    WHEN photo_url IS NOT NULL THEN '✓ Ada foto'
    ELSE '✗ Belum ada foto'
  END as status_foto,
  photo_url
FROM user_profiles
ORDER BY username;

-- Jika photo_url masih NULL, update manual untuk testing:
-- UPDATE user_profiles
-- SET photo_url = 'https://your-supabase-url.supabase.co/storage/v1/object/public/profile-photos/your-photo.jpg'
-- WHERE username = 'your-username';
