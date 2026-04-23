# Quick Fix: RBAC Menu Tidak Muncul

## Masalah
Menu di sidebar hilang semua atau tidak sesuai dengan role.

## Quick Fix (5 Menit)

### Step 1: Check Role di Database
Buka Supabase SQL Editor, jalankan:

```sql
SELECT username, role FROM public.user_profiles;
```

**Pastikan:**
- Role adalah "admin" atau "super_admin" (lowercase, dengan underscore)
- Bukan "Admin", "ADMIN", "Super Admin", atau "superadmin"

### Step 2: Fix Role Jika Salah
Jika role salah, update dengan SQL ini:

```sql
-- Untuk admin biasa
UPDATE public.user_profiles
SET role = 'admin'
WHERE username = 'GANTI_DENGAN_USERNAME_ADMIN';

-- Untuk super admin
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE username = 'GANTI_DENGAN_USERNAME_SUPERADMIN';
```

### Step 3: Clear Cache & Reload
1. Logout dari aplikasi
2. Tekan Ctrl + Shift + R (hard refresh)
3. Login lagi

### Step 4: Verify
- **Admin** harus lihat 5 menu: Dashboard, Data Mahasiswa, Generate KTM, Verifikasi
- **Super Admin** harus lihat 8 menu (semua menu)

## Masih Tidak Berfungsi?

### Check Browser Console
1. Tekan F12
2. Lihat tab Console
3. Cari error atau warning
4. Share screenshot jika ada error

### Check Network Tab
1. Tekan F12
2. Go to Network tab
3. Reload halaman
4. Cari request ke Supabase
5. Check response dari `user_profiles`

## Expected Result

### Admin Login
```
Console log:
- User role: admin
- Sidebar - Visible items: 5 of 8

Sidebar menu:
✅ Dashboard
✅ Data Mahasiswa
✅ Generate KTM
✅ Verifikasi
❌ Tahun Angkatan (tidak muncul)
❌ Jurusan (tidak muncul)
❌ Admin Management (tidak muncul)
❌ Pengaturan (tidak muncul)
```

### Super Admin Login
```
Console log:
- User role: super_admin
- Sidebar - Visible items: 8 of 8

Sidebar menu:
✅ Dashboard
✅ Data Mahasiswa
✅ Tahun Angkatan
✅ Jurusan
✅ Generate KTM
✅ Verifikasi
✅ Admin Management
✅ Pengaturan
```

## Troubleshooting

Lihat file `TROUBLESHOOT_RBAC.md` untuk troubleshooting lengkap.
