# Setup Guide - KTM Management System

## Database Setup

### 1. Initial Schema
Jalankan file ini untuk setup database awal:
```sql
-- File: supabase/schema.sql
```

### 2. Foreign Keys & Relations
Jalankan file ini untuk setup relasi antar tabel:
```sql
-- File: supabase/add-foreign-keys-to-mahasiswa.sql
```

### 3. Admin Photo Feature
Jalankan file ini untuk enable foto profil admin:
```sql
-- File: supabase/fix-admin-photo-complete.sql
```

### 4. Role-Based Access Control (RBAC)
Jalankan file ini untuk fix role case sensitivity:
```sql
-- File: supabase/fix-role-case-sensitive.sql
```

---

## Features

### 1. Role-Based Access Control (RBAC)
- **Admin**: Akses terbatas (Dashboard, Data Mahasiswa, Generate KTM, Verifikasi)
- **Super Admin**: Akses penuh (semua menu)

### 2. Admin Photo Profile
- Upload foto profil di halaman Profile
- Foto muncul di topbar
- Max 5MB, format: jpg, png, dll

### 3. Auto-Graduate Status
- Mahasiswa otomatis status "Lulus" setelah 2 tahun dari angkatan
- Trigger otomatis saat insert/update

### 4. Verification System
- Admin bisa verifikasi mahasiswa baru
- Status: Menunggu → Aktif/Ditolak

### 5. Import/Export
- Import mahasiswa dari Excel/CSV
- Export data mahasiswa ke CSV
- Validasi otomatis saat import

---

## Quick Fixes

### Fix Role Case Sensitivity
Jika menu RBAC tidak berfungsi:
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE LOWER(role) = 'admin' AND role != 'admin';

UPDATE public.user_profiles
SET role = 'super_admin'
WHERE LOWER(REPLACE(role, ' ', '_')) = 'super_admin' AND role != 'super_admin';
```

### Check User Roles
```sql
SELECT username, role FROM public.user_profiles;
```

### Check Admin Photo
```sql
SELECT username, photo_url FROM public.user_profiles;
```

---

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Troubleshooting

### RBAC tidak berfungsi
1. Check role di database (harus lowercase: "admin" atau "super_admin")
2. Logout dan login lagi
3. Clear browser cache

### Foto tidak muncul
1. Jalankan `supabase/fix-admin-photo-complete.sql`
2. Hard refresh browser (Ctrl + Shift + R)
3. Check storage bucket di Supabase dashboard

### Import gagal
1. Check format Excel/CSV (harus ada kolom: nim, nama, jurusan, angkatan)
2. Check jurusan dan angkatan sudah ada di database
3. Check NIM tidak duplikat
