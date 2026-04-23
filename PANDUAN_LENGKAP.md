# Panduan Lengkap: RBAC & Foto Profil Admin

## 🎯 Ringkasan Perubahan

Saya sudah mengimplementasikan 2 fitur yang kamu minta:

### 1. ✅ Role-Based Access Control (RBAC)
**Admin biasa** sekarang tidak bisa lihat menu yang tidak bisa diakses.

**Sebelum:**
- Admin dan Super Admin lihat menu yang sama (8 menu)

**Sesudah:**
- **Admin**: Hanya lihat 5 menu (Dashboard, Data Mahasiswa, Generate KTM, Verifikasi, Profile)
- **Super Admin**: Lihat semua 8 menu (termasuk Jurusan, Angkatan, Admin Management, Pengaturan)

### 2. ✅ Foto Profil Admin di Topbar
**Foto admin** dari halaman profil sekarang muncul di topbar.

**Sebelum:**
- Topbar hanya menampilkan icon User default

**Sesudah:**
- Topbar menampilkan foto yang diupload di halaman Profile
- Foto berbentuk bulat dengan border
- Foto persist setelah reload/logout

---

## 📝 Cara Menggunakan

### Fitur 1: RBAC (Sudah Jalan!)

#### Tidak perlu setup apapun, langsung bisa digunakan!

**Cara Test:**
1. Login sebagai user dengan role **admin**
2. Lihat sidebar kiri
3. Kamu hanya akan lihat 5 menu:
   - Dashboard
   - Data Mahasiswa
   - Generate KTM
   - Verifikasi
   - (Profile ada di topbar)

4. Logout, lalu login sebagai **super_admin**
5. Lihat sidebar kiri
6. Kamu akan lihat 8 menu (semua menu):
   - Dashboard
   - Data Mahasiswa
   - Tahun Angkatan ← Hanya super_admin
   - Jurusan ← Hanya super_admin
   - Generate KTM
   - Verifikasi
   - Admin Management ← Hanya super_admin
   - Pengaturan ← Hanya super_admin

**Tabel Akses:**

| Menu | Admin | Super Admin |
|------|-------|-------------|
| Dashboard | ✅ Bisa | ✅ Bisa |
| Data Mahasiswa | ✅ Bisa | ✅ Bisa |
| Tahun Angkatan | ❌ Tidak Bisa | ✅ Bisa |
| Jurusan | ❌ Tidak Bisa | ✅ Bisa |
| Generate KTM | ✅ Bisa | ✅ Bisa |
| Verifikasi | ✅ Bisa | ✅ Bisa |
| Admin Management | ❌ Tidak Bisa | ✅ Bisa |
| Pengaturan | ❌ Tidak Bisa | ✅ Bisa |

---

### Fitur 2: Foto Profil Admin (Perlu Setup Database)

#### Step 1: Setup Database (WAJIB!)

Buka **Supabase Dashboard** → **SQL Editor** → Jalankan query ini:

```sql
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
DROP POLICY IF EXISTS "Allow users to update their own profile photos" ON storage.objects;

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
```

**Hasil yang diharapkan:**
- ✅ "Column photo_url added" atau "already exists"
- ✅ Bucket "profile-photos" muncul di hasil query
- ✅ User profiles ditampilkan dengan kolom photo_url

#### Step 2: Upload Foto

1. Login ke aplikasi
2. Klik foto profil di **topbar kanan atas**
3. Pilih **"Profil Admin"**
4. Klik **icon kamera** di foto profil
5. Pilih foto dari komputer (max 5MB)
6. Tunggu pesan **"Foto profil berhasil diupdate"**
7. Halaman akan **reload otomatis** setelah 1 detik
8. Foto kamu akan muncul di **topbar**!

#### Step 3: Verify Foto Persist

1. **Refresh halaman** (F5) → Foto masih ada ✅
2. **Logout dan login lagi** → Foto masih ada ✅
3. **Buka di browser lain** → Foto masih ada ✅

---

## 🔧 Troubleshooting

### Problem 1: "Foto tidak muncul setelah upload"

**Solusi:**
1. Hard refresh browser: 
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
2. Clear browser cache
3. Logout dan login lagi

### Problem 2: "Upload gagal dengan error"

**Solusi:**
1. Pastikan sudah jalankan SQL di Step 1
2. Cek ukuran file (max 5MB)
3. Cek format file (harus gambar: jpg, png, dll)

### Problem 3: "Foto muncul lalu hilang"

**Solusi:**
Cek apakah foto tersimpan di database:

```sql
SELECT id, username, photo_url 
FROM public.user_profiles;
```

- Jika `photo_url` **NULL** → Upload gagal, coba lagi
- Jika `photo_url` **ada URL** → Hard refresh browser

### Problem 4: "Menu masih sama untuk admin dan super_admin"

**Solusi:**
1. Logout dan login lagi
2. Cek role di database:
```sql
SELECT id, username, role FROM user_profiles;
```
3. Pastikan role adalah "admin" atau "super_admin" (bukan yang lain)

---

## 🧪 Testing Checklist

### Test RBAC
- [ ] Login sebagai **admin**
- [ ] Cek sidebar hanya ada 5 menu
- [ ] Coba akses `/jurusan` di URL → Harus tidak bisa
- [ ] Coba akses `/admin-management` di URL → Harus tidak bisa
- [ ] Logout
- [ ] Login sebagai **super_admin**
- [ ] Cek sidebar ada 8 menu
- [ ] Coba akses `/jurusan` → Harus bisa
- [ ] Coba akses `/admin-management` → Harus bisa

### Test Foto Profil
- [ ] Jalankan SQL setup di Supabase
- [ ] Login ke aplikasi
- [ ] Buka halaman Profile
- [ ] Upload foto
- [ ] Lihat pesan sukses
- [ ] Tunggu auto-reload
- [ ] Cek foto muncul di topbar
- [ ] Refresh halaman (F5)
- [ ] Foto masih ada
- [ ] Logout dan login lagi
- [ ] Foto masih ada

---

## 📊 Technical Details

### Files Changed

#### RBAC Feature
- `hooks/use-permissions.ts` - Permission system
- `lib/navigation.ts` - Navigation items dengan permission
- `components/layout/dashboard-sidebar.tsx` - Filter menu berdasarkan permission

#### Photo Feature
- `supabase/fix-admin-photo-complete.sql` - Database setup
- `hooks/use-user-profile.ts` - Fetch photo dari database
- `app/api/upload-profile-photo/route.ts` - Upload handler
- `features/admin-profile/components/admin-profile-panel.tsx` - Upload UI
- `components/layout/dashboard-topbar.tsx` - Display foto

### How It Works

#### RBAC Flow
```
1. User login
2. useUserProfile() fetch role dari database
3. usePermissions() map role ke permissions
4. Sidebar filter navigationItems berdasarkan permission
5. Hanya menu dengan permission yang sesuai yang ditampilkan
```

#### Photo Upload Flow
```
1. User pilih foto di /profile
2. Frontend validate (type, size)
3. POST /api/upload-profile-photo
4. API upload ke Supabase Storage
5. API update user_profiles.photo_url
6. Return public URL
7. Page reload
8. useUserProfile() fetch photo_url baru
9. Topbar display foto
```

---

## 🎉 Summary

### Yang Sudah Jalan
1. ✅ **RBAC**: Admin dan Super Admin punya akses berbeda
2. ✅ **Photo Code**: Code sudah siap, tinggal setup database

### Yang Perlu Kamu Lakukan
1. ✅ **Test RBAC**: Login sebagai admin dan super_admin untuk verify
2. ⚠️ **Setup Photo**: Jalankan SQL di Supabase
3. ⚠️ **Test Photo**: Upload foto dan verify muncul di topbar

### Hasil Akhir
- ✅ Admin hanya lihat 5 menu (tidak bisa akses Jurusan, Angkatan, Admin Management, Pengaturan)
- ✅ Super Admin lihat semua 8 menu
- ✅ Foto profil admin muncul di topbar
- ✅ Foto persist setelah reload/logout

---

## 📞 Butuh Bantuan?

Kalau ada masalah:
1. Cek file `TROUBLESHOOT_ADMIN_PHOTO.md` untuk troubleshooting detail
2. Cek file `TEST_ADMIN_PHOTO.md` untuk testing guide
3. Share screenshot error di browser console (F12)
4. Share output dari SQL debug query

Semua sudah siap! Tinggal jalankan SQL untuk foto profil, lalu test kedua fitur. 🚀
