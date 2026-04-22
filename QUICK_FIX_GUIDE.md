# 🚀 Quick Fix Guide - Master Data Implementation

## ✅ Masalah yang Diperbaiki

**MASALAH:** Form tambah mahasiswa hanya menampilkan 4 jurusan (hardcoded), padahal di database ada lebih banyak.

**SOLUSI:** Sistem sekarang mengambil data jurusan dan angkatan langsung dari database, sehingga admin bisa menambah jurusan/angkatan baru dan otomatis muncul di form.

---

## 📋 Langkah-Langkah Implementasi

### 1️⃣ Jalankan Migration SQL

Buka **Supabase SQL Editor** dan jalankan file ini:

```bash
supabase/add-foreign-keys-to-mahasiswa.sql
```

**Apa yang dilakukan:**
- ✅ Menambahkan kolom `angkatan_id` dan `jurusan_id` (foreign keys)
- ✅ Menambahkan kolom `angkatan` dan `jurusan` (text, backward compatibility)
- ✅ Membuat trigger auto-sync bidirectional
- ✅ Membuat VIEW untuk query dengan JOIN
- ✅ Sync data existing

### 2️⃣ Verifikasi Migration

Jalankan test script untuk memastikan semuanya berfungsi:

```bash
supabase/test-foreign-keys.sql
```

**Expected Output:**
```
✅ Kolom angkatan_id dan jurusan_id sudah ada
✅ Trigger trigger_sync_mahasiswa_text_columns aktif
✅ Semua mahasiswa memiliki FK lengkap
```

### 3️⃣ Test di Aplikasi

1. **Tambah Jurusan Baru:**
   - Buka `/jurusan`
   - Klik "Tambah Jurusan"
   - Isi: "Sistem Informasi"
   - Simpan

2. **Tambah Angkatan Baru:**
   - Buka `/mahasiswa-angkatan`
   - Klik "Tambah Angkatan"
   - Isi: Tahun "2028", Nama "Angkatan 2028"
   - Simpan

3. **Cek Form Mahasiswa:**
   - Buka `/mahasiswa/tambah`
   - Dropdown jurusan harus menampilkan **SEMUA** jurusan dari database (termasuk "Sistem Informasi")
   - Dropdown angkatan harus menampilkan **SEMUA** angkatan aktif (termasuk "Angkatan 2028")

4. **Tambah Mahasiswa:**
   - Pilih jurusan dan angkatan dari dropdown
   - Isi data lainnya
   - Simpan
   - ✅ Data tersimpan dengan foreign keys yang benar

---

## 🔧 File yang Diubah

### Backend/Database:
1. ✅ `supabase/add-foreign-keys-to-mahasiswa.sql` - Migration script (NEW)
2. ✅ `supabase/test-foreign-keys.sql` - Test script (NEW)

### Frontend:
3. ✅ `features/students/components/student-form.tsx` - Form component
   - Menambahkan props `jurusanList` dan `angkatanList`
   - Mengganti hardcoded options dengan dynamic data

4. ✅ `app/mahasiswa/tambah/page.tsx` - Add page
   - Fetch jurusan dan angkatan dari database
   - Pass ke StudentForm sebagai props

5. ✅ `app/mahasiswa/[id]/edit/page.tsx` - Edit page
   - Fetch jurusan dan angkatan dari database
   - Pass ke StudentForm sebagai props

### Library (Tidak perlu diubah):
- ✅ `lib/mahasiswa.ts` - Sudah support trigger auto-sync
- ✅ `actions/mahasiswa.ts` - Sudah support trigger auto-sync
- ✅ `lib/jurusan.ts` - Sudah ada `getJurusanList()`
- ✅ `lib/angkatan.ts` - Sudah ada `getAngkatanList()`

---

## 🎯 Cara Kerja Sistem Baru

### Alur Data:

```
1. Admin tambah jurusan di /jurusan
   ↓
2. Data tersimpan di tabel `jurusan`
   ↓
3. Form mahasiswa fetch data dengan getJurusanList()
   ↓
4. Dropdown otomatis menampilkan jurusan baru
   ↓
5. User pilih jurusan dan submit form
   ↓
6. Data tersimpan dengan kolom `jurusan` (text)
   ↓
7. Trigger otomatis set `jurusan_id` (FK)
   ↓
8. Data konsisten antara text dan FK
```

### Auto-Sync Trigger:

```sql
-- Ketika insert dengan TEXT
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan, ...)
VALUES ('Ahmad', '2025001', 'Teknik Informatika', '2025', ...);
-- Trigger otomatis set: jurusan_id dan angkatan_id ✅

-- Ketika insert dengan FK
INSERT INTO mahasiswa (nama, nim, jurusan_id, angkatan_id, ...)
VALUES ('Ahmad', '2025001', 1, 5, ...);
-- Trigger otomatis set: jurusan dan angkatan (text) ✅
```

---

## 🐛 Troubleshooting

### Problem: Dropdown jurusan masih kosong

**Solusi:**
```sql
-- Cek apakah ada data di tabel jurusan
SELECT * FROM jurusan;

-- Jika kosong, tambah data sample
INSERT INTO jurusan (nama_jurusan) VALUES
  ('Teknik Informatika'),
  ('Sistem Informasi'),
  ('Manajemen Informatika'),
  ('Komputerisasi Akuntansi');
```

### Problem: Dropdown angkatan masih kosong

**Solusi:**
```sql
-- Cek apakah ada data angkatan aktif
SELECT * FROM angkatan WHERE status = 'Aktif';

-- Jika kosong, tambah data sample
INSERT INTO angkatan (tahun, nama_angkatan, status) VALUES
  ('2024', 'Angkatan 2024', 'Aktif'),
  ('2025', 'Angkatan 2025', 'Aktif'),
  ('2026', 'Angkatan 2026', 'Aktif');
```

### Problem: Foreign key tidak ter-set

**Solusi:**
```sql
-- Cek apakah trigger aktif
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_sync_mahasiswa_text_columns';

-- Jika tidak ada, jalankan ulang migration:
-- supabase/add-foreign-keys-to-mahasiswa.sql
```

### Problem: Data existing tidak punya FK

**Solusi:**
```sql
-- Sync manual semua data existing
UPDATE mahasiswa m
SET angkatan_id = a.id
FROM angkatan a
WHERE m.angkatan = a.tahun
  AND m.angkatan_id IS NULL;

UPDATE mahasiswa m
SET jurusan_id = j.id
FROM jurusan j
WHERE m.jurusan = j.nama_jurusan
  AND m.jurusan_id IS NULL;
```

---

## 📊 Verifikasi Sukses

Jalankan query ini untuk memastikan semuanya berfungsi:

```sql
-- 1. Cek struktur tabel
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'mahasiswa'
  AND column_name IN ('angkatan', 'angkatan_id', 'jurusan', 'jurusan_id');

-- 2. Cek trigger aktif
SELECT trigger_name 
FROM information_schema.triggers
WHERE trigger_name = 'trigger_sync_mahasiswa_text_columns';

-- 3. Cek data mahasiswa dengan FK
SELECT 
  nama, 
  jurusan, 
  jurusan_id, 
  angkatan, 
  angkatan_id
FROM mahasiswa
LIMIT 5;

-- 4. Cek VIEW
SELECT * FROM v_mahasiswa_lengkap LIMIT 5;
```

**Expected Result:**
- ✅ Kolom `angkatan_id` dan `jurusan_id` ada
- ✅ Trigger `trigger_sync_mahasiswa_text_columns` aktif
- ✅ Semua mahasiswa punya `jurusan_id` dan `angkatan_id` yang valid
- ✅ VIEW `v_mahasiswa_lengkap` berfungsi

---

## 🎉 Kesimpulan

Sistem sekarang **100% dinamis**:
- ✅ Admin bisa tambah jurusan baru → otomatis muncul di form
- ✅ Admin bisa tambah angkatan baru → otomatis muncul di form
- ✅ Data konsisten dengan auto-sync trigger
- ✅ Backward compatible dengan kode existing
- ✅ Scalable untuk pertumbuhan data

**Tidak ada lagi hardcoded list!** 🚀
