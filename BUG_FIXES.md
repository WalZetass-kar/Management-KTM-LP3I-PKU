# 🐛 Bug Fixes - Laporan Lengkap

## 📋 Ringkasan
Dokumen ini berisi daftar lengkap bug yang ditemukan dan diperbaiki dalam aplikasi Student ID Card Management.

---

## 🔴 Bug Kritis yang Diperbaiki

### 1. **RLS Policies Menggunakan Fungsi yang Salah**
**Lokasi:** 
- `supabase/create-jurusan-table.sql`
- `supabase/create-mahasiswa-angkatan-table.sql`
- `supabase/fix-rls-policies.sql`

**Masalah:**
```sql
-- ❌ SALAH - auth.role() tidak valid di Supabase
CREATE POLICY "Allow authenticated users to read jurusan" ON jurusan
  FOR SELECT USING (auth.role() = 'authenticated');
```

**Perbaikan:**
```sql
-- ✅ BENAR - Menggunakan fungsi is_admin_user()
CREATE POLICY "Admins can read jurusan" ON jurusan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));
```

**Dampak:** Tanpa perbaikan ini, semua operasi CRUD pada tabel `jurusan`, `mahasiswa_angkatan`, dan `angkatan` akan gagal dengan error permission denied.

---

### 2. **Import createClient yang Salah**
**Lokasi:**
- `lib/angkatan.ts`
- `lib/mahasiswa-angkatan.ts`

**Masalah:**
```typescript
// ❌ SALAH - createClient tidak di-export dari server.ts
import { createClient } from "@/lib/supabase/server";
```

**Perbaikan:**
```typescript
// ✅ BENAR - Menggunakan createServerSupabaseClient
import { createServerSupabaseClient } from "@/lib/supabase/server";
```

**Dampak:** Aplikasi akan crash dengan error "createClient is not exported" saat mengakses halaman angkatan atau mahasiswa angkatan.

---

### 3. **Bug di Delete Jurusan Action**
**Lokasi:** `actions/jurusan.ts`

**Masalah:**
```typescript
// ❌ SALAH - Menggunakan .select() dengan count yang mengembalikan data, bukan count
const { data: mahasiswaCount, error: countError } = await supabase
  .from("mahasiswa")
  .select("id", { count: "exact", head: true })
  .eq("jurusan_id", jurusanId);

if (mahasiswaCount && mahasiswaCount.length > 0) {
  // Bug: mahasiswaCount adalah null, bukan array
}
```

**Perbaikan:**
```typescript
// ✅ BENAR - Menggunakan count langsung
const { count, error: countError } = await supabase
  .from("mahasiswa")
  .select("id", { count: "exact", head: true })
  .eq("jurusan_id", jurusanId);

if (count && count > 0) {
  // Benar: count adalah number
}
```

**Dampak:** Validasi penghapusan jurusan tidak berfungsi dengan benar, bisa menghapus jurusan yang masih digunakan.

---

### 4. **Bug di Delete Angkatan**
**Lokasi:** `lib/angkatan.ts`

**Masalah:**
```typescript
// ❌ SALAH - Memanggil async function di dalam query
const { data: mahasiswaCount, error: countError } = await supabase
  .from("mahasiswa")
  .select("id", { count: "exact", head: true })
  .eq("angkatan", (await getAngkatanById(id)).data?.tahun);
```

**Perbaikan:**
```typescript
// ✅ BENAR - Ambil data dulu, baru query
const angkatanData = await getAngkatanById(id);
if (angkatanData.error || !angkatanData.data) {
  return { error: "Angkatan tidak ditemukan" };
}

const { count, error: countError } = await supabase
  .from("mahasiswa")
  .select("id", { count: "exact", head: true })
  .eq("angkatan", angkatanData.data.tahun);
```

**Dampak:** Validasi penghapusan angkatan tidak berfungsi, bisa menghapus angkatan yang masih digunakan.

---

## 🟡 Bug Sedang yang Diperbaiki

### 5. **RLS Policies Tidak Konsisten**
**Lokasi:** Semua file SQL

**Masalah:** Beberapa tabel menggunakan RLS yang di-disable, beberapa menggunakan policies yang salah.

**Perbaikan:** Semua tabel sekarang menggunakan RLS yang benar dengan fungsi `is_admin_user()`.

---

### 6. **Missing Indexes**
**Lokasi:** Database

**Masalah:** Tidak ada index pada kolom yang sering di-query seperti `jurusan_id`, `status`, `angkatan`.

**Perbaikan:** Ditambahkan indexes di `supabase/fix-all-issues.sql`:
```sql
CREATE INDEX IF NOT EXISTS idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_status ON mahasiswa(status);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan ON mahasiswa(angkatan);
```

**Dampak:** Performa query akan lebih cepat, terutama untuk dashboard dan filtering.

---

## 📝 File yang Dimodifikasi

### SQL Files
1. ✅ `supabase/fix-rls-policies.sql` - Diperbaiki semua RLS policies
2. ✅ `supabase/create-jurusan-table.sql` - Diperbaiki policies
3. ✅ `supabase/create-mahasiswa-angkatan-table.sql` - Diperbaiki policies
4. ✅ `supabase/fix-all-issues.sql` - **BARU** - Script komprehensif untuk fix semua

### TypeScript Files
5. ✅ `lib/angkatan.ts` - Diperbaiki import dan delete logic
6. ✅ `lib/mahasiswa-angkatan.ts` - Diperbaiki import
7. ✅ `actions/jurusan.ts` - Diperbaiki delete validation

---

## 🚀 Cara Menjalankan Perbaikan

### Opsi 1: Jalankan Script Komprehensif (RECOMMENDED)
```bash
# Di Supabase SQL Editor, jalankan:
supabase/fix-all-issues.sql
```

Script ini akan:
- ✅ Membuat/update semua fungsi helper
- ✅ Memperbaiki semua RLS policies
- ✅ Membuat semua tabel yang belum ada
- ✅ Menambahkan indexes untuk performa
- ✅ Memperbaiki storage bucket policies

### Opsi 2: Jalankan Script Satu per Satu
```bash
# 1. Jalankan schema utama
supabase/schema.sql

# 2. Buat tabel-tabel
supabase/create-jurusan-table.sql
supabase/create-angkatan-table.sql
supabase/create-mahasiswa-angkatan-table.sql

# 3. Fix RLS policies
supabase/fix-rls-policies.sql

# 4. Setup storage
supabase/create-storage-bucket.sql
```

---

## ✅ Verifikasi Perbaikan

### 1. Test RLS Policies
```sql
-- Login sebagai admin, lalu test:
SELECT * FROM jurusan; -- Harus berhasil
INSERT INTO jurusan (nama_jurusan) VALUES ('Test'); -- Harus berhasil
```

### 2. Test CRUD Operations
- ✅ Buka halaman `/jurusan` - harus bisa melihat data
- ✅ Tambah jurusan baru - harus berhasil
- ✅ Edit jurusan - harus berhasil
- ✅ Hapus jurusan (yang tidak digunakan) - harus berhasil
- ✅ Hapus jurusan (yang digunakan) - harus ditolak dengan pesan error

### 3. Test Angkatan
- ✅ Buka halaman `/mahasiswa-angkatan` - harus bisa melihat data
- ✅ Tambah angkatan baru - harus berhasil
- ✅ Edit angkatan - harus berhasil
- ✅ Hapus angkatan - harus berhasil

### 4. Test Dashboard
- ✅ Buka halaman `/dashboard` - harus menampilkan statistik
- ✅ Chart harus muncul tanpa error

---

## 🔍 Cara Debugging Jika Masih Ada Masalah

### 1. Cek RLS Policies
```sql
-- Lihat semua policies untuk tabel jurusan
SELECT * FROM pg_policies WHERE tablename = 'jurusan';

-- Lihat semua policies untuk tabel angkatan
SELECT * FROM pg_policies WHERE tablename = 'angkatan';
```

### 2. Cek Fungsi Helper
```sql
-- Test fungsi is_admin_user
SELECT public.is_admin_user();
-- Harus return true jika login sebagai admin
```

### 3. Cek User Profile
```sql
-- Lihat profile user yang sedang login
SELECT * FROM user_profiles WHERE id = auth.uid();
-- Pastikan role adalah 'admin' atau 'super_admin'
```

### 4. Cek Browser Console
- Buka Developer Tools (F12)
- Lihat tab Console untuk error JavaScript
- Lihat tab Network untuk error API

---

## 📊 Status Perbaikan

| Bug | Severity | Status | File |
|-----|----------|--------|------|
| RLS Policies salah | 🔴 Critical | ✅ Fixed | `supabase/*.sql` |
| Import createClient salah | 🔴 Critical | ✅ Fixed | `lib/angkatan.ts`, `lib/mahasiswa-angkatan.ts` |
| Delete jurusan validation | 🔴 Critical | ✅ Fixed | `actions/jurusan.ts` |
| Delete angkatan validation | 🔴 Critical | ✅ Fixed | `lib/angkatan.ts` |
| Missing indexes | 🟡 Medium | ✅ Fixed | `supabase/fix-all-issues.sql` |
| Inconsistent RLS | 🟡 Medium | ✅ Fixed | `supabase/fix-all-issues.sql` |

---

## 🎯 Kesimpulan

Semua bug kritis telah diperbaiki. Aplikasi sekarang harus berjalan dengan lancar:

✅ **RLS Policies** - Semua menggunakan fungsi yang benar
✅ **Import Statements** - Semua menggunakan createServerSupabaseClient
✅ **Validation Logic** - Delete operations sekarang benar
✅ **Performance** - Indexes ditambahkan untuk query yang lebih cepat
✅ **Consistency** - Semua tabel menggunakan pattern yang sama

---

## 📞 Jika Masih Ada Masalah

1. Pastikan sudah menjalankan `supabase/fix-all-issues.sql`
2. Pastikan user sudah login sebagai admin
3. Clear browser cache dan reload
4. Cek Supabase logs di dashboard
5. Cek browser console untuk error

---

**Dibuat:** 2026-04-22
**Versi:** 1.0.0
**Status:** ✅ Semua bug diperbaiki
