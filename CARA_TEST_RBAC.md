# Cara Test RBAC (Role-Based Access Control)

## Yang Harus Terjadi

### Jika Login sebagai ADMIN (role: "admin")
**Sidebar hanya menampilkan 5 menu:**
1. ✅ Dashboard
2. ✅ Data Mahasiswa
3. ✅ Generate KTM
4. ✅ Verifikasi
5. ❌ **Tahun Angkatan** - TIDAK MUNCUL
6. ❌ **Jurusan** - TIDAK MUNCUL
7. ❌ **Admin Management** - TIDAK MUNCUL
8. ❌ **Pengaturan** - TIDAK MUNCUL

### Jika Login sebagai SUPER ADMIN (role: "super_admin")
**Sidebar menampilkan SEMUA 8 menu:**
1. ✅ Dashboard
2. ✅ Data Mahasiswa
3. ✅ Tahun Angkatan
4. ✅ Jurusan
5. ✅ Generate KTM
6. ✅ Verifikasi
7. ✅ Admin Management
8. ✅ Pengaturan

---

## Cara Test

### Step 1: Check Role User Saat Ini

Buka Supabase SQL Editor, jalankan:

```sql
SELECT 
  id,
  username,
  role
FROM public.user_profiles
ORDER BY created_at DESC;
```

**Lihat role user yang kamu gunakan untuk login.**

### Step 2: Buat User Test dengan Role Admin

Jika semua user adalah super_admin, buat user admin:

```sql
-- Ganti 'USERNAME_YANG_MAU_DIJADIKAN_ADMIN' dengan username yang ada
UPDATE public.user_profiles
SET role = 'admin'
WHERE username = 'USERNAME_YANG_MAU_DIJADIKAN_ADMIN';

-- Verify
SELECT username, role FROM public.user_profiles;
```

### Step 3: Test Login sebagai Admin

1. **Logout** dari aplikasi
2. **Login** dengan user yang role-nya "admin"
3. **Lihat sidebar** - Harus hanya ada 5 menu
4. **Buka browser console (F12)** - Lihat log:
   ```
   === SIDEBAR DEBUG ===
   User role: admin
   Total menu items: 8
   Visible items: 5
   Hidden items: 3
   Visible menu: Dashboard, Data Mahasiswa, Generate KTM, Verifikasi
   ===================
   ```
5. **Lihat bagian bawah sidebar** - Ada info:
   ```
   Role: admin
   Menu: 5/8
   ```

### Step 4: Test Login sebagai Super Admin

1. **Logout** dari aplikasi
2. **Login** dengan user yang role-nya "super_admin"
3. **Lihat sidebar** - Harus ada 8 menu (semua menu)
4. **Buka browser console (F12)** - Lihat log:
   ```
   === SIDEBAR DEBUG ===
   User role: super_admin
   Total menu items: 8
   Visible items: 8
   Hidden items: 0
   Visible menu: Dashboard, Data Mahasiswa, Tahun Angkatan, Jurusan, Generate KTM, Verifikasi, Admin Management, Pengaturan
   ===================
   ```
5. **Lihat bagian bawah sidebar** - Ada info:
   ```
   Role: super_admin
   Menu: 8/8
   ```

---

## Troubleshooting

### Problem: Semua menu muncul padahal login sebagai admin

**Kemungkinan penyebab:**
1. Role di database sebenarnya "super_admin" bukan "admin"
2. Browser cache belum clear

**Solusi:**
```sql
-- Check role
SELECT username, role FROM public.user_profiles WHERE username = 'USERNAME_KAMU';

-- Jika role salah, update:
UPDATE public.user_profiles
SET role = 'admin'
WHERE username = 'USERNAME_KAMU';
```

Lalu:
1. Logout
2. Clear cache (Ctrl + Shift + Delete)
3. Close browser
4. Open browser lagi
5. Login lagi

### Problem: Menu tidak muncul sama sekali

**Kemungkinan penyebab:**
1. Role di database tidak valid (bukan "admin" atau "super_admin")
2. Profile belum ter-load

**Solusi:**
```sql
-- Check dan fix role
SELECT username, role FROM public.user_profiles;

-- Update role yang salah
UPDATE public.user_profiles
SET role = 'admin'  -- atau 'super_admin'
WHERE username = 'USERNAME_KAMU';
```

Lalu hard refresh: Ctrl + Shift + R

### Problem: Menu muncul sebentar lalu hilang

**Solusi:**
1. Buka browser console (F12)
2. Lihat error message
3. Share screenshot error

---

## Quick Check

### Cara Cepat Cek Role Kamu

Paste ini di browser console (F12):

```javascript
// Check role dari localStorage
const checkRole = async () => {
  const { data: { user } } = await window.supabase.auth.getUser();
  console.log("User ID:", user?.id);
  
  // Fetch profile
  const { data: profile } = await window.supabase
    .from('user_profiles')
    .select('username, role')
    .eq('id', user?.id)
    .single();
  
  console.log("Profile:", profile);
  console.log("Role:", profile?.role);
};

checkRole();
```

---

## Expected Screenshots

### Admin Login (5 menu)
```
Sidebar:
├── Dashboard
├── Data Mahasiswa
├── Generate KTM
└── Verifikasi

Status Sistem:
Role: admin
Menu: 5/8
```

### Super Admin Login (8 menu)
```
Sidebar:
├── Dashboard
├── Data Mahasiswa
├── Tahun Angkatan
├── Jurusan
├── Generate KTM
├── Verifikasi
├── Admin Management
└── Pengaturan

Status Sistem:
Role: super_admin
Menu: 8/8
```

---

## Summary

1. ✅ Code sudah benar
2. ✅ Filter sudah berfungsi
3. ⚠️ **Pastikan role di database benar** ("admin" atau "super_admin")
4. ⚠️ **Test dengan 2 user berbeda** (1 admin, 1 super_admin)
5. ⚠️ **Lihat browser console** untuk debug info
6. ⚠️ **Lihat bagian bawah sidebar** untuk info role dan menu count

Jika masih semua menu muncul, berarti user yang login adalah **super_admin**, bukan admin biasa! 🎯
