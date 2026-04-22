# ✅ Checklist Implementasi Master Data

## 📋 Panduan Step-by-Step

Ikuti checklist ini untuk memastikan implementasi berjalan lancar.

---

## 🗄️ Database Setup

### Step 1: Jalankan Migration
- [ ] Buka Supabase Dashboard
- [ ] Masuk ke SQL Editor
- [ ] Copy isi file `supabase/add-foreign-keys-to-mahasiswa.sql`
- [ ] Paste dan jalankan
- [ ] Pastikan tidak ada error
- [ ] Cek output: Harus ada pesan "✅ ADD FOREIGN KEYS - SELESAI"

### Step 2: Verifikasi Struktur Tabel
```sql
-- Jalankan query ini
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'mahasiswa'
  AND column_name IN ('angkatan', 'angkatan_id', 'jurusan', 'jurusan_id')
ORDER BY column_name;
```

**Expected Result:**
- [ ] Kolom `angkatan` (text) ada
- [ ] Kolom `angkatan_id` (integer) ada
- [ ] Kolom `jurusan` (text) ada
- [ ] Kolom `jurusan_id` (integer) ada

### Step 3: Verifikasi Trigger
```sql
-- Jalankan query ini
SELECT trigger_name 
FROM information_schema.triggers
WHERE trigger_name = 'trigger_sync_mahasiswa_text_columns';
```

**Expected Result:**
- [ ] Trigger `trigger_sync_mahasiswa_text_columns` ada

### Step 4: Verifikasi VIEW
```sql
-- Jalankan query ini
SELECT * FROM v_mahasiswa_lengkap LIMIT 1;
```

**Expected Result:**
- [ ] Query berhasil (tidak error)
- [ ] Data mahasiswa muncul dengan kolom lengkap

---

## 🧪 Testing Database

### Step 5: Test Auto-Sync Trigger
```sql
-- Test INSERT dengan text columns
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan, alamat, no_hp, status)
VALUES (
  'Test User', 
  'TEST999', 
  (SELECT nama_jurusan FROM jurusan LIMIT 1),
  (SELECT tahun FROM angkatan WHERE status = 'Aktif' LIMIT 1),
  'Test Address', 
  '08123456789', 
  'Menunggu'
);

-- Cek apakah FK ter-set otomatis
SELECT nama, jurusan, jurusan_id, angkatan, angkatan_id 
FROM mahasiswa 
WHERE nim = 'TEST999';
```

**Expected Result:**
- [ ] `jurusan_id` tidak NULL (ter-set otomatis)
- [ ] `angkatan_id` tidak NULL (ter-set otomatis)

### Step 6: Cleanup Test Data
```sql
-- Hapus data test
DELETE FROM mahasiswa WHERE nim = 'TEST999';
```

**Expected Result:**
- [ ] Data test terhapus

---

## 📊 Data Master Setup

### Step 7: Cek Data Jurusan
```sql
SELECT * FROM jurusan ORDER BY nama_jurusan;
```

**Action:**
- [ ] Jika kosong atau kurang, tambah via UI di `/jurusan`
- [ ] Atau insert manual:
```sql
INSERT INTO jurusan (nama_jurusan) VALUES
  ('Teknik Informatika'),
  ('Sistem Informasi'),
  ('Manajemen Informatika'),
  ('Komputerisasi Akuntansi'),
  ('Administrasi Bisnis'),
  ('Hubungan Masyarakat');
```

### Step 8: Cek Data Angkatan
```sql
SELECT * FROM angkatan WHERE status = 'Aktif' ORDER BY tahun DESC;
```

**Action:**
- [ ] Jika kosong atau kurang, tambah via UI di `/mahasiswa-angkatan`
- [ ] Atau insert manual:
```sql
INSERT INTO angkatan (tahun, nama_angkatan, status) VALUES
  ('2024', 'Angkatan 2024', 'Aktif'),
  ('2025', 'Angkatan 2025', 'Aktif'),
  ('2026', 'Angkatan 2026', 'Aktif'),
  ('2027', 'Angkatan 2027', 'Aktif');
```

### Step 9: Sync Data Existing (Jika Ada)
```sql
-- Cek berapa mahasiswa yang belum punya FK
SELECT COUNT(*) 
FROM mahasiswa 
WHERE angkatan_id IS NULL OR jurusan_id IS NULL;
```

**Jika ada yang NULL:**
- [ ] Jalankan sync manual:
```sql
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

## 🖥️ Testing Aplikasi

### Step 10: Test Form Tambah Mahasiswa
- [ ] Buka `/mahasiswa/tambah`
- [ ] Cek dropdown angkatan: Harus menampilkan semua angkatan aktif
- [ ] Cek dropdown jurusan: Harus menampilkan semua jurusan dari database
- [ ] Pilih angkatan dan jurusan
- [ ] Isi data lainnya
- [ ] Submit form
- [ ] Pastikan data tersimpan tanpa error

### Step 11: Test Form Edit Mahasiswa
- [ ] Buka `/mahasiswa`
- [ ] Klik edit pada salah satu mahasiswa
- [ ] Cek dropdown angkatan: Harus menampilkan semua angkatan aktif
- [ ] Cek dropdown jurusan: Harus menampilkan semua jurusan dari database
- [ ] Ubah jurusan atau angkatan
- [ ] Submit form
- [ ] Pastikan data terupdate tanpa error

### Step 12: Test Filter Mahasiswa
- [ ] Buka `/mahasiswa`
- [ ] Cek dropdown filter jurusan: Harus menampilkan "Semua Jurusan" + semua jurusan
- [ ] Cek dropdown filter angkatan: Harus menampilkan "Semua Angkatan" + semua angkatan
- [ ] Pilih filter jurusan tertentu
- [ ] Pastikan data terfilter dengan benar
- [ ] Pilih filter angkatan tertentu
- [ ] Pastikan data terfilter dengan benar

### Step 13: Test Tambah Jurusan Baru
- [ ] Buka `/jurusan`
- [ ] Klik "Tambah Jurusan"
- [ ] Isi nama jurusan: "Desain Grafis"
- [ ] Submit
- [ ] Buka `/mahasiswa/tambah`
- [ ] Cek dropdown jurusan: "Desain Grafis" harus muncul ✅

### Step 14: Test Tambah Angkatan Baru
- [ ] Buka `/mahasiswa-angkatan`
- [ ] Klik "Tambah Angkatan"
- [ ] Isi tahun: "2028"
- [ ] Isi nama: "Angkatan 2028"
- [ ] Status: "Aktif"
- [ ] Submit
- [ ] Buka `/mahasiswa/tambah`
- [ ] Cek dropdown angkatan: "Angkatan 2028" harus muncul ✅

---

## 🔍 Verifikasi Final

### Step 15: Cek Data Integrity
```sql
-- Semua mahasiswa harus punya FK yang valid
SELECT 
  COUNT(*) as total,
  COUNT(jurusan_id) as with_jurusan_id,
  COUNT(angkatan_id) as with_angkatan_id
FROM mahasiswa;
```

**Expected Result:**
- [ ] `total` = `with_jurusan_id` = `with_angkatan_id`
- [ ] Semua mahasiswa punya FK lengkap

### Step 16: Cek Relational Query
```sql
-- Query dengan JOIN harus berfungsi
SELECT 
  m.nama,
  j.nama_jurusan,
  a.nama_angkatan
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id
LIMIT 5;
```

**Expected Result:**
- [ ] Query berhasil
- [ ] Data mahasiswa muncul dengan nama jurusan dan angkatan

### Step 17: Cek VIEW
```sql
-- VIEW harus menampilkan data lengkap
SELECT * FROM v_mahasiswa_lengkap LIMIT 5;
```

**Expected Result:**
- [ ] Query berhasil
- [ ] Data lengkap dengan relasi

---

## 📝 Final Checklist

### Database:
- [ ] Migration berhasil dijalankan
- [ ] Trigger aktif
- [ ] VIEW dibuat
- [ ] Data existing ter-sync
- [ ] Foreign keys valid

### Master Data:
- [ ] Tabel `jurusan` ada data
- [ ] Tabel `angkatan` ada data aktif
- [ ] Data bisa ditambah via UI

### Aplikasi:
- [ ] Form tambah mahasiswa: dropdown dinamis
- [ ] Form edit mahasiswa: dropdown dinamis
- [ ] Filter mahasiswa: dropdown dinamis
- [ ] Tambah jurusan baru: otomatis muncul di form
- [ ] Tambah angkatan baru: otomatis muncul di form

### Testing:
- [ ] Insert mahasiswa baru: berhasil
- [ ] Update mahasiswa: berhasil
- [ ] Filter mahasiswa: berhasil
- [ ] Trigger auto-sync: berfungsi
- [ ] Data integrity: valid

---

## 🎉 Selesai!

Jika semua checklist di atas ✅, maka implementasi **BERHASIL**!

### Dokumentasi Lengkap:
- 📖 `PERUBAHAN_MAHASISWA_ANGKATAN.md` - Penjelasan detail
- 🚀 `QUICK_FIX_GUIDE.md` - Panduan cepat
- ✅ `UPDATE_COMPLETE.md` - Summary update
- 📋 `CHECKLIST_IMPLEMENTASI.md` - Checklist ini

### Troubleshooting:
Jika ada masalah, lihat section "Troubleshooting" di:
- `PERUBAHAN_MAHASISWA_ANGKATAN.md`
- `QUICK_FIX_GUIDE.md`

### Support:
Jika masih ada error, jalankan:
```bash
supabase/test-foreign-keys.sql
```

Dan cek output untuk diagnosis masalah.

---

**Happy Coding! 🚀**
