# 🔄 Panduan Menggabungkan Tabel Mahasiswa

## 📌 Tujuan
Menggabungkan tabel `mahasiswa` dan `mahasiswa_angkatan` menjadi **satu tabel `mahasiswa`** yang lebih sederhana.

### Keuntungan:
✅ Struktur database lebih sederhana  
✅ Tidak ada duplikasi data  
✅ Mudah filter berdasarkan angkatan  
✅ Lebih mudah maintenance  

---

## 🚀 Langkah 1: Jalankan Migration Database

### 1.1 Backup Data (Safety First!)
```bash
# Di Supabase Dashboard → SQL Editor
# Jalankan query ini untuk backup:
CREATE TABLE mahasiswa_backup AS SELECT * FROM mahasiswa;
CREATE TABLE mahasiswa_angkatan_backup AS SELECT * FROM mahasiswa_angkatan;
```

### 1.2 Jalankan Script Merge
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Buka file `supabase/merge-mahasiswa-tables.sql`
3. Copy semua isi file
4. Paste di SQL Editor
5. Klik **Run**

Script ini akan:
- ✅ Backup data otomatis
- ✅ Menggabungkan kedua tabel
- ✅ Migrate semua data
- ✅ Membuat indexes
- ✅ Setup RLS policies

---

## 📝 Langkah 2: Update Kode Aplikasi

Sekarang kita perlu update semua file yang menggunakan `mahasiswa_angkatan` untuk menggunakan `mahasiswa` saja.

### File yang Perlu Diupdate:

1. ✅ `lib/mahasiswa-angkatan.ts` → Hapus atau update
2. ✅ `actions/angkatan.ts` → Update query
3. ✅ `app/mahasiswa-angkatan/page.tsx` → Update atau redirect
4. ✅ `features/mahasiswa-angkatan/` → Update komponen
5. ✅ `lib/dashboard.ts` → Update query

---

## 🎯 Struktur Tabel Baru

### Tabel `mahasiswa` (Unified)
```sql
CREATE TABLE mahasiswa (
  id bigint PRIMARY KEY,
  
  -- Data Pribadi
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  foto_url text,
  
  -- Data Akademik
  jurusan_id integer REFERENCES jurusan(id),
  jurusan text NOT NULL,
  angkatan text NOT NULL,  -- "2024", "2025", dll
  
  -- Status
  status text NOT NULL DEFAULT 'Menunggu',
  
  -- Timestamps
  created_at timestamptz NOT NULL,
  updated_at timestamptz
);
```

### Query Examples:
```sql
-- Semua mahasiswa
SELECT * FROM mahasiswa;

-- Mahasiswa angkatan 2025
SELECT * FROM mahasiswa WHERE angkatan = '2025';

-- Mahasiswa per jurusan dan angkatan
SELECT * FROM mahasiswa 
WHERE jurusan = 'Teknik Informatika' 
  AND angkatan = '2025';

-- Count per angkatan
SELECT angkatan, COUNT(*) as total
FROM mahasiswa
GROUP BY angkatan
ORDER BY angkatan DESC;
```

---

## 🔧 Update Kode TypeScript

Saya akan membuat file-file yang sudah diupdate untuk Anda.

---

**Status:** Siap untuk dijalankan!  
**Estimasi Waktu:** 10-15 menit  
**Risk Level:** 🟡 Medium (ada backup otomatis)
