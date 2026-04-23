# Fix RBAC Sekarang - Menu Masih Semua Muncul

## Masalah
User dengan role "Admin" masih bisa lihat semua menu (Tahun Angkatan, Jurusan, dll).

## Penyebab
Role di database adalah "Admin" (huruf kapital), bukan "admin" (lowercase).

## Solusi Cepat (2 Menit)

### Step 1: Fix Role di Database
Buka Supabase SQL Editor, jalankan:

```sql
-- File: supabase/fix-role-case-sensitive.sql
-- Copy semua isi file dan jalankan
```

Atau copy-paste ini:

```sql
-- Fix all roles to lowercase
UPDATE public.user_profiles
SET role = 'admin'
WHERE LOWER(role) = 'admin' AND role != 'admin';

UPDATE public.user_profiles
SET role = 'super_admin'
WHERE LOWER(REPLACE(role, ' ', '_')) = 'super_admin' AND role != 'super_admin';

-- Verify
SELECT username, role FROM public.user_profiles;
```

### Step 2: Logout dan Login Lagi
1. Logout dari aplikasi
2. Close browser
3. Open browser lagi
4. Login lagi

### Step 3: Verify
Setelah login:
1. Buka browser console (F12)
2. Lihat log:
   ```
   User role (original): admin
   User role (normalized): admin
   User permissions: ["view_dashboard", "manage_students", ...]
   
   === SIDEBAR DEBUG ===
   User role: admin
   Visible items: 5
   Hidden items: 3
   ```

3. Lihat sidebar - Harus hanya 5 menu:
   - ✅ Dashboard
   - ✅ Data Mahasiswa
   - ✅ Generate KTM
   - ✅ Verifikasi
   - ❌ Tahun Angkatan (HILANG)
   - ❌ Jurusan (HILANG)

4. Lihat bagian bawah sidebar:
   ```
   Role: admin
   Menu: 5/8
   ```

---

## Jika Masih Tidak Berhasil

### Check 1: Verify Role di Database
```sql
SELECT username, role, 
  CASE 
    WHEN role = 'admin' THEN '✅ Correct'
    WHEN role = 'super_admin' THEN '✅ Correct'
    ELSE '❌ Wrong: ' || role
  END as status
FROM public.user_profiles;
```

Role HARUS:
- ✅ "admin" (lowercase, tanpa spasi)
- ✅ "super_admin" (lowercase, dengan underscore)

BUKAN:
- ❌ "Admin" (huruf kapital)
- ❌ "ADMIN" (semua kapital)
- ❌ "Super Admin" (dengan spasi)
- ❌ "superadmin" (tanpa underscore)

### Check 2: Clear Browser Cache
1. Tekan Ctrl + Shift + Delete
2. Pilih "Cached images and files"
3. Clear
4. Close browser
5. Open lagi
6. Login lagi

### Check 3: Hard Refresh
Tekan Ctrl + Shift + R (Windows) atau Cmd + Shift + R (Mac)

---

## Expected Result

### Admin Login
**Sidebar (5 menu):**
```
✅ Dashboard
✅ Data Mahasiswa
✅ Generate KTM
✅ Verifikasi
```

**Console Log:**
```
User role (original): admin
User role (normalized): admin
=== SIDEBAR DEBUG ===
User role: admin
Visible items: 5
Hidden items: 3
Visible menu: Dashboard, Data Mahasiswa, Generate KTM, Verifikasi
```

**Bagian Bawah Sidebar:**
```
Role: admin
Menu: 5/8
```

### Super Admin Login
**Sidebar (8 menu):**
```
✅ Dashboard
✅ Data Mahasiswa
✅ Tahun Angkatan
✅ Jurusan
✅ Generate KTM
✅ Verifikasi
✅ Admin Management
✅ Pengaturan
```

**Console Log:**
```
User role (original): super_admin
User role (normalized): super_admin
=== SIDEBAR DEBUG ===
User role: super_admin
Visible items: 8
Hidden items: 0
```

**Bagian Bawah Sidebar:**
```
Role: super_admin
Menu: 8/8
```

---

## Summary

1. ✅ Jalankan SQL fix: `supabase/fix-role-case-sensitive.sql`
2. ✅ Logout dan login lagi
3. ✅ Check browser console untuk debug info
4. ✅ Verify hanya 5 menu untuk admin
5. ✅ Verify 8 menu untuk super_admin

Setelah fix SQL, admin TIDAK akan lihat:
- ❌ Tahun Angkatan
- ❌ Jurusan
- ❌ Admin Management
- ❌ Pengaturan

Menu tersebut akan **HILANG** dari sidebar! 🎯
