# 🔧 Fix: Admin Photo Not Showing

## Problem
Foto admin sudah diupload di halaman Profile, tapi tidak muncul di topbar.

## Possible Causes

### 1. Kolom `photo_url` Belum Ada di Database
**Solution**: Jalankan SQL untuk tambah kolom

**File**: `supabase/add-admin-photo-url.sql`
```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;
```

### 2. Foto Belum Tersimpan di Database
**Check**: Jalankan query untuk cek

**File**: `supabase/check-admin-photo.sql`
```sql
SELECT username, photo_url 
FROM user_profiles 
WHERE username = 'your-username';
```

**Expected**:
- Jika `photo_url` = NULL → Foto belum tersimpan
- Jika `photo_url` = URL → Foto sudah tersimpan

### 3. Browser Cache
**Solution**: Hard refresh browser
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

### 4. Hook Tidak Refresh
**Solution**: Sudah ditambahkan auto-reload setelah upload

## Step-by-Step Fix

### Step 1: Verify Database Column
```sql
-- Jalankan di Supabase SQL Editor
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'user_profiles';
```

**Expected Output:**
```
column_name
-----------
id
username
role
photo_url  ← Harus ada ini
created_at
```

**If `photo_url` not found:**
```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;
```

### Step 2: Check Photo URL in Database
```sql
SELECT 
  username,
  photo_url,
  CASE 
    WHEN photo_url IS NOT NULL THEN 'Ada'
    ELSE 'Tidak ada'
  END as status
FROM user_profiles;
```

**If photo_url is NULL:**
- Re-upload foto di halaman Profile
- Atau update manual (untuk testing):
```sql
UPDATE user_profiles
SET photo_url = 'https://your-photo-url.jpg'
WHERE username = 'your-username';
```

### Step 3: Hard Refresh Browser
1. Buka dashboard
2. Tekan **Ctrl + Shift + R** (Windows/Linux) atau **Cmd + Shift + R** (Mac)
3. Cek topbar

### Step 4: Re-upload Photo
1. Buka `/profile`
2. Klik icon kamera
3. Upload foto baru
4. Tunggu message "Foto profil berhasil diupdate"
5. Page akan auto-reload setelah 1 detik
6. Cek topbar

### Step 5: Check Console for Errors
1. Buka Developer Tools (F12)
2. Buka tab Console
3. Cek apakah ada error merah
4. Screenshot error dan share untuk debugging

## Testing Checklist

- [ ] Kolom `photo_url` ada di tabel `user_profiles`
- [ ] SQL `add-admin-photo-url.sql` sudah dijalankan
- [ ] Foto sudah diupload di halaman Profile
- [ ] Message "Foto profil berhasil diupdate" muncul
- [ ] Page auto-reload setelah upload
- [ ] Hard refresh browser (Ctrl + Shift + R)
- [ ] Cek database: `photo_url` tidak NULL
- [ ] Cek console: tidak ada error
- [ ] Logout dan login kembali
- [ ] Foto muncul di topbar ✅

## Debug Queries

### Check if column exists:
```sql
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'user_profiles' 
  AND column_name = 'photo_url'
) as column_exists;
```

### Check photo URL for current user:
```sql
SELECT 
  u.email,
  p.username,
  p.photo_url,
  LENGTH(p.photo_url) as url_length
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'your-email@example.com';
```

### Check storage bucket:
```sql
SELECT 
  name,
  id,
  created_at
FROM storage.buckets
WHERE name = 'profile-photos';
```

## Common Issues

### Issue 1: "Column photo_url does not exist"
**Solution**: Jalankan SQL add column
```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;
```

### Issue 2: Photo URL is NULL after upload
**Possible causes**:
- API error (check console)
- Storage bucket tidak ada
- RLS policy block update

**Solution**: Check API response
```javascript
// Di browser console setelah upload
// Cek Network tab → upload-profile-photo → Response
```

### Issue 3: Photo shows in Profile but not in Topbar
**Solution**: 
1. Hard refresh (Ctrl + Shift + R)
2. Clear browser cache
3. Logout dan login kembali

### Issue 4: Storage bucket not found
**Solution**: Create bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);
```

## Manual Update (For Testing)

Jika ingin test dengan foto dummy:

```sql
UPDATE user_profiles
SET photo_url = 'https://ui-avatars.com/api/?name=Admin&size=200'
WHERE username = 'your-username';
```

Lalu hard refresh browser.

## Expected Behavior

### After Upload:
1. Message "Foto profil berhasil diupdate" ✅
2. Page auto-reload setelah 1 detik ✅
3. Foto muncul di halaman Profile ✅
4. Foto muncul di topbar ✅

### In Topbar:
- **With Photo**: Foto rounded dengan border
- **Without Photo**: Icon User default

## Still Not Working?

### Collect Debug Info:
1. **Database**:
   ```sql
   SELECT * FROM user_profiles WHERE username = 'your-username';
   ```
   Screenshot hasil query

2. **Console Errors**:
   - Buka F12 → Console
   - Screenshot error (jika ada)

3. **Network**:
   - Buka F12 → Network
   - Upload foto
   - Cek response dari `/api/upload-profile-photo`
   - Screenshot response

4. **Browser**:
   - Browser: Chrome/Firefox/Safari?
   - Version?
   - Private/Incognito mode?

## Quick Fix Script

Jalankan semua ini di Supabase SQL Editor:

```sql
-- 1. Add column if not exists
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;

-- 2. Check current data
SELECT username, photo_url FROM user_profiles;

-- 3. Test with dummy photo (optional)
-- UPDATE user_profiles
-- SET photo_url = 'https://ui-avatars.com/api/?name=Admin&size=200'
-- WHERE username = 'your-username';
```

Lalu:
1. Hard refresh browser (Ctrl + Shift + R)
2. Logout dan login kembali
3. Cek topbar

## Success Indicators

✅ Kolom `photo_url` ada di database
✅ Photo URL tidak NULL
✅ Foto muncul di halaman Profile
✅ Foto muncul di topbar
✅ Tidak ada error di console
✅ Auto-reload setelah upload

Jika semua ✅, foto seharusnya muncul!
