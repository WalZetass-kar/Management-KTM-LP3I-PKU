# Test Admin Photo Feature

## Quick Test Steps

### 1. Verify Database Setup
```sql
-- Run this in Supabase SQL Editor
-- File: supabase/fix-admin-photo-complete.sql
```

### 2. Check Current Data
```sql
-- Run this to see current state
-- File: supabase/debug-admin-photo.sql
```

### 3. Test Upload Flow

#### A. Open Profile Page
1. Navigate to `/profile`
2. Open browser console (F12)
3. Click camera icon to upload photo

#### B. Watch Console Logs
You should see:
```
Mengupload foto...
Profile updated successfully: [...]
Foto profil berhasil diupdate
Fetched profile data: { username: "...", role: "...", photoUrl: "..." }
```

#### C. Verify Topbar
After page reload (automatic after 1 second):
- Topbar should show uploaded photo
- Photo should be circular with border
- Hover should work

### 4. Manual Verification

#### Check Database
```sql
SELECT 
  id,
  username,
  role,
  photo_url,
  updated_at
FROM public.user_profiles
ORDER BY updated_at DESC;
```

Expected: `photo_url` should contain URL like:
```
https://[project-ref].supabase.co/storage/v1/object/public/profile-photos/profile-photos/[user-id]-[timestamp].jpg
```

#### Check Storage
1. Open Supabase Dashboard
2. Go to Storage > profile-photos
3. You should see uploaded files

#### Check Network Tab
1. Open browser console (F12)
2. Go to Network tab
3. Upload photo
4. Look for:
   - POST `/api/upload-profile-photo` → Should return 200 with URL
   - GET to Supabase storage → Should return 200 with image

### 5. Test Different Scenarios

#### Scenario A: Fresh Upload
- [ ] Upload new photo
- [ ] See success message
- [ ] Page reloads automatically
- [ ] Photo appears in topbar
- [ ] Photo appears in profile page

#### Scenario B: Replace Photo
- [ ] Upload different photo
- [ ] Old photo replaced
- [ ] New photo appears everywhere

#### Scenario C: After Logout/Login
- [ ] Logout
- [ ] Login again
- [ ] Photo still appears

#### Scenario D: Different Browser
- [ ] Open in different browser
- [ ] Login
- [ ] Photo appears (proves it's from database, not cache)

## Expected Results

### ✅ Success Indicators
1. Console shows "Profile updated successfully"
2. Database has `photo_url` value
3. Storage has file in `profile-photos` bucket
4. Topbar displays photo
5. Profile page displays photo
6. Photo persists after reload
7. Photo persists after logout/login

### ❌ Failure Indicators
1. Console shows error
2. Database `photo_url` is NULL
3. Storage has no files
4. Topbar shows default User icon
5. Photo disappears after reload

## Debugging Commands

### Check if column exists
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'photo_url';
```

### Check storage bucket
```sql
SELECT * FROM storage.buckets 
WHERE name = 'profile-photos';
```

### Check RLS policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage';
```

### Check uploaded files
```sql
SELECT name, bucket_id, created_at, metadata
FROM storage.objects
WHERE bucket_id = 'profile-photos'
ORDER BY created_at DESC
LIMIT 10;
```

## Troubleshooting

### Problem: Upload fails with 500 error
**Check**: Browser console for error details
**Solution**: Run `fix-admin-photo-complete.sql`

### Problem: Photo doesn't appear after upload
**Check**: Database `photo_url` value
**Solution**: Hard refresh browser (Ctrl+Shift+R)

### Problem: Photo appears then disappears
**Check**: Storage bucket public setting
**Solution**: Ensure bucket is public in SQL

### Problem: 403 Forbidden on photo URL
**Check**: RLS policies on storage.objects
**Solution**: Run `fix-admin-photo-complete.sql`

## Files Involved

### Frontend
- `hooks/use-user-profile.ts` - Fetch profile with photo
- `components/layout/dashboard-topbar.tsx` - Display photo
- `features/admin-profile/components/admin-profile-panel.tsx` - Upload photo

### Backend
- `app/api/upload-profile-photo/route.ts` - Handle upload

### Database
- `supabase/fix-admin-photo-complete.sql` - Complete setup
- `supabase/debug-admin-photo.sql` - Debug queries
