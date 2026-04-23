# Troubleshooting: RBAC Menu Hilang Semua

## Problem
Semua menu hilang di sidebar, atau menu yang seharusnya muncul untuk admin tidak muncul.

## Expected Behavior

### Admin (role: "admin")
Harus lihat 5 menu:
- ✅ Dashboard
- ✅ Data Mahasiswa
- ✅ Generate KTM
- ✅ Verifikasi
- ❌ Tahun Angkatan (TIDAK MUNCUL)
- ❌ Jurusan (TIDAK MUNCUL)
- ❌ Admin Management (TIDAK MUNCUL)
- ❌ Pengaturan (TIDAK MUNCUL)

### Super Admin (role: "super_admin")
Harus lihat 8 menu (SEMUA):
- ✅ Dashboard
- ✅ Data Mahasiswa
- ✅ Tahun Angkatan
- ✅ Jurusan
- ✅ Generate KTM
- ✅ Verifikasi
- ✅ Admin Management
- ✅ Pengaturan

## Debugging Steps

### Step 1: Check Browser Console
1. Buka aplikasi
2. Tekan F12 untuk buka Developer Tools
3. Lihat tab Console
4. Cari log:
   ```
   User role: admin (atau super_admin)
   User permissions: [...]
   Sidebar - User role: admin
   Sidebar - Visible items: 5 of 8
   Sidebar - Menu items: [...]
   ```

### Step 2: Check User Role in Database
Jalankan SQL ini di Supabase:

```sql
-- File: supabase/check-user-roles.sql
SELECT 
  id,
  username,
  role,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;
```

**Expected:**
- Role harus "admin" atau "super_admin" (lowercase)
- Bukan "Admin" atau "ADMIN" atau "Super Admin"

### Step 3: Verify Profile Loading
Tambahkan console.log di browser console:

```javascript
// Paste di browser console
localStorage.clear();
location.reload();
```

Ini akan clear cache dan reload halaman.

### Step 4: Check Network Tab
1. Buka Developer Tools (F12)
2. Go to Network tab
3. Reload halaman
4. Cari request ke Supabase
5. Check response dari `user_profiles` table

## Common Issues

### Issue 1: Semua menu hilang
**Cause**: Profile belum ter-load atau role tidak valid
**Solution**: 
1. Check browser console untuk error
2. Check database role dengan SQL di atas
3. Pastikan role adalah "admin" atau "super_admin" (lowercase)

### Issue 2: Menu muncul sebentar lalu hilang
**Cause**: Loading state issue
**Solution**: 
1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Logout dan login lagi

### Issue 3: Admin lihat semua menu (seperti super_admin)
**Cause**: Role di database adalah "super_admin" bukan "admin"
**Solution**: 
Update role di database:
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE username = 'USERNAME_ADMIN';
```

### Issue 4: Super Admin tidak lihat semua menu
**Cause**: Role di database salah atau typo
**Solution**: 
Check dan update role:
```sql
-- Check role
SELECT username, role FROM user_profiles WHERE username = 'USERNAME';

-- Update jika salah
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE username = 'USERNAME_SUPER_ADMIN';
```

## Fix Steps

### Fix 1: Update Role di Database
```sql
-- Set user sebagai admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE username = 'admin_username';

-- Set user sebagai super_admin
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE username = 'superadmin_username';

-- Verify
SELECT username, role FROM user_profiles;
```

### Fix 2: Clear Browser Cache
1. Logout dari aplikasi
2. Clear browser cache (Ctrl + Shift + Delete)
3. Close browser
4. Open browser lagi
5. Login lagi

### Fix 3: Hard Refresh
1. Tekan Ctrl + Shift + R (Windows/Linux)
2. Atau Cmd + Shift + R (Mac)
3. Atau Ctrl + F5

## Testing Checklist

- [ ] Run `supabase/check-user-roles.sql` untuk verify role
- [ ] Login sebagai admin
- [ ] Check browser console untuk log
- [ ] Verify hanya 5 menu yang muncul
- [ ] Logout
- [ ] Login sebagai super_admin
- [ ] Verify 8 menu muncul
- [ ] Hard refresh di kedua role
- [ ] Test di browser berbeda

## Expected Console Logs

### For Admin
```
Fetched profile data: { username: "admin", role: "admin", photoUrl: null }
User role: admin
User permissions: ["view_dashboard", "manage_students", "verify_students", "generate_ktm", "view_profile"]
Sidebar - User role: admin
Sidebar - Visible items: 5 of 8
Sidebar - Menu items: ["Dashboard", "Data Mahasiswa", "Generate KTM", "Verifikasi"]
```

### For Super Admin
```
Fetched profile data: { username: "superadmin", role: "super_admin", photoUrl: null }
User role: super_admin
User permissions: ["view_dashboard", "manage_students", "verify_students", "generate_ktm", "manage_admins", "manage_jurusan", "manage_angkatan", "manage_settings", "view_profile"]
Sidebar - User role: super_admin
Sidebar - Visible items: 8 of 8
Sidebar - Menu items: ["Dashboard", "Data Mahasiswa", "Tahun Angkatan", "Jurusan", "Generate KTM", "Verifikasi", "Admin Management", "Pengaturan"]
```

## Files to Check

- `hooks/use-permissions.ts` - Permission logic
- `hooks/use-user-profile.ts` - Profile fetching
- `components/layout/dashboard-sidebar.tsx` - Menu filtering
- `lib/navigation.ts` - Navigation items with permissions

## Quick Test

Paste ini di browser console untuk test permission system:

```javascript
// Check current user profile
const profile = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
console.log('Current user:', profile);

// Force reload profile
window.location.reload();
```
