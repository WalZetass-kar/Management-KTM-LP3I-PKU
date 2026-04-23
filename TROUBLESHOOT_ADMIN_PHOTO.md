# Troubleshooting: Admin Photo Not Showing

## Problem
Foto admin tidak muncul di topbar setelah upload, meskipun SQL sudah dijalankan.

## Root Causes (Possible)
1. ❌ Kolom `photo_url` belum ada di database
2. ❌ Storage bucket `profile-photos` belum dibuat
3. ❌ RLS policies untuk storage belum diatur
4. ❌ Browser cache menyimpan data lama
5. ❌ Photo URL tidak tersimpan ke database setelah upload
6. ❌ Hook `useUserProfile` tidak refresh setelah upload

## Solution Steps

### Step 1: Run Complete Fix SQL
Jalankan file SQL ini untuk memastikan semua setup benar:
```bash
# File: supabase/fix-admin-photo-complete.sql
```

File ini akan:
- ✅ Membuat kolom `photo_url` jika belum ada
- ✅ Membuat storage bucket `profile-photos`
- ✅ Setup RLS policies untuk storage
- ✅ Verify semua setup

### Step 2: Debug Current State
Jalankan file SQL ini untuk melihat kondisi saat ini:
```bash
# File: supabase/debug-admin-photo.sql
```

File ini akan menampilkan:
- Kolom yang ada di `user_profiles`
- Data user profiles saat ini
- Storage bucket yang ada
- File yang ada di storage

### Step 3: Test Upload
1. Buka halaman `/profile`
2. Upload foto baru
3. Buka browser console (F12)
4. Lihat log:
   - "Fetched profile data: ..." (dari useUserProfile)
   - "Profile updated successfully: ..." (dari API)
5. Setelah 1 detik, halaman akan auto-reload

### Step 4: Clear Browser Cache
Jika foto masih tidak muncul:
1. Hard refresh: `Ctrl + Shift + R` (Windows/Linux) atau `Cmd + Shift + R` (Mac)
2. Clear browser cache dan cookies
3. Logout dan login kembali

### Step 5: Verify Database
Cek apakah photo_url tersimpan di database:
```sql
SELECT id, username, role, photo_url 
FROM public.user_profiles 
WHERE id = 'YOUR_USER_ID';
```

Jika `photo_url` NULL atau kosong, berarti upload gagal.

### Step 6: Check Storage Permissions
Pastikan storage bucket public:
```sql
SELECT id, name, public 
FROM storage.buckets 
WHERE name = 'profile-photos';
```

Kolom `public` harus `true`.

### Step 7: Check Storage Files
Lihat file yang berhasil diupload:
```sql
SELECT name, bucket_id, created_at 
FROM storage.objects 
WHERE bucket_id = 'profile-photos' 
ORDER BY created_at DESC 
LIMIT 5;
```

## Changes Made

### 1. Updated `hooks/use-user-profile.ts`
- ✅ Added `refresh()` function untuk manual refresh
- ✅ Added `refreshKey` state untuk trigger re-fetch
- ✅ Added console.log untuk debug

### 2. Updated `app/api/upload-profile-photo/route.ts`
- ✅ Added `.select()` untuk return updated data
- ✅ Added console.log untuk debug
- ✅ Return updated data di response

### 3. Profile Panel Already Has
- ✅ Auto-reload setelah 1 detik
- ✅ Success message
- ✅ Error handling

## Testing Checklist

- [ ] Run `supabase/fix-admin-photo-complete.sql`
- [ ] Run `supabase/debug-admin-photo.sql` dan verify output
- [ ] Upload foto di `/profile`
- [ ] Check browser console untuk log
- [ ] Verify foto muncul setelah reload
- [ ] Check database: `photo_url` terisi
- [ ] Check storage: file ada di bucket
- [ ] Hard refresh browser
- [ ] Logout dan login kembali
- [ ] Verify foto masih muncul

## Expected Behavior

### Before Upload
- Topbar menampilkan icon User (default)
- Profile page menampilkan icon User (default)

### After Upload
- API response: `{ url: "...", message: "...", data: [...] }`
- Console log: "Profile updated successfully: ..."
- Success message: "Foto profil berhasil diupdate"
- Page auto-reload setelah 1 detik
- Topbar menampilkan foto yang diupload
- Profile page menampilkan foto yang diupload

### After Refresh/Reload
- Foto tetap muncul di topbar
- Foto tetap muncul di profile page
- Console log: "Fetched profile data: { ..., photoUrl: '...' }"

## Common Issues

### Issue 1: "Failed to upload file"
**Cause**: Storage bucket tidak ada atau RLS policy salah
**Solution**: Run `supabase/fix-admin-photo-complete.sql`

### Issue 2: "Failed to update profile"
**Cause**: Kolom `photo_url` tidak ada
**Solution**: Run `supabase/fix-admin-photo-complete.sql`

### Issue 3: Foto tidak muncul setelah upload
**Cause**: Browser cache
**Solution**: Hard refresh (`Ctrl + Shift + R`)

### Issue 4: Foto hilang setelah reload
**Cause**: Photo URL tidak tersimpan ke database
**Solution**: Check database dan run debug SQL

### Issue 5: 403 Forbidden saat akses foto
**Cause**: Storage bucket tidak public atau RLS policy salah
**Solution**: Run `supabase/fix-admin-photo-complete.sql`

## Next Steps

Jika masih tidak berfungsi setelah semua langkah di atas:
1. Share screenshot browser console
2. Share output dari `debug-admin-photo.sql`
3. Share screenshot network tab (F12 > Network) saat upload
4. Check Supabase dashboard > Storage > profile-photos
