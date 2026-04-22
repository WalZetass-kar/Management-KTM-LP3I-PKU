# 🏗️ Struktur Database Final

## 📌 Konsep

Aplikasi menggunakan **3 tabel utama** dengan relasi yang jelas:

1. **`angkatan`** - Master data tahun angkatan (2023, 2024, 2025, dll)
2. **`jurusan`** - Master data jurusan (Teknik Informatika, Sistem Informasi, dll)
3. **`mahasiswa`** - Data mahasiswa dengan foreign key ke angkatan dan jurusan

---

## 🗂️ Struktur Tabel

### 1. Tabel `angkatan` (Master Data)

```sql
CREATE TABLE angkatan (
  id serial PRIMARY KEY,
  tahun varchar(4) UNIQUE NOT NULL,
  nama_angkatan varchar(100) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'Aktif',
  keterangan text,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);
```

**Fungsi:**
- Mengelola tahun angkatan yang tersedia
- Admin bisa tambah/edit/hapus angkatan
- Ketika angkatan baru ditambah, otomatis muncul di semua dropdown

**Contoh Data:**
| id | tahun | nama_angkatan | status |
|----|-------|---------------|--------|
| 1  | 2023  | Angkatan 2023 | Aktif  |
| 2  | 2024  | Angkatan 2024 | Aktif  |
| 3  | 2025  | Angkatan 2025 | Aktif  |

---

### 2. Tabel `jurusan` (Master Data)

```sql
CREATE TABLE jurusan (
  id serial PRIMARY KEY,
  nama_jurusan varchar(255) UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  updated_at timestamp WITH TIME ZONE DEFAULT NOW()
);
```

**Fungsi:**
- Mengelola jurusan yang tersedia
- Admin bisa tambah/edit/hapus jurusan
- Ketika jurusan baru ditambah, otomatis muncul di semua dropdown

**Contoh Data:**
| id | nama_jurusan          |
|----|-----------------------|
| 1  | Teknik Informatika    |
| 2  | Sistem Informasi      |
| 3  | Teknik Komputer       |

---

### 3. Tabel `mahasiswa` (Transaction Data)

```sql
CREATE TABLE mahasiswa (
  id bigint PRIMARY KEY,
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  foto_url text,
  
  -- Foreign Keys
  jurusan_id integer REFERENCES jurusan(id) ON DELETE RESTRICT,
  angkatan_id integer REFERENCES angkatan(id) ON DELETE RESTRICT,
  
  status text NOT NULL DEFAULT 'Menunggu',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);
```

**Fungsi:**
- Menyimpan data mahasiswa
- Menggunakan `jurusan_id` dan `angkatan_id` sebagai foreign key
- Tidak bisa hapus jurusan/angkatan yang masih digunakan (ON DELETE RESTRICT)

**Contoh Data:**
| id | nama                | nim        | jurusan_id | angkatan_id |
|----|---------------------|------------|------------|-------------|
| 1  | Ahmad Rizki Pratama | 2025001001 | 1          | 3           |
| 2  | Siti Nurhaliza      | 2025001002 | 2          | 3           |

---

## 🔗 Relasi Antar Tabel

```
┌─────────────┐         ┌──────────────┐
│  angkatan   │         │   jurusan    │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ tahun       │         │ nama_jurusan │
│ nama_angkatan│        └──────────────┘
│ status      │                │
└─────────────┘                │
       │                       │
       │ 1                     │ 1
       │                       │
       │ N                     │ N
       │                       │
       └───────┬───────────────┘
               │
        ┌──────────────┐
        │  mahasiswa   │
        ├──────────────┤
        │ id (PK)      │
        │ nama         │
        │ nim          │
        │ jurusan_id (FK) ──→ jurusan.id
        │ angkatan_id (FK) ──→ angkatan.id
        │ status       │
        └──────────────┘
```

**Penjelasan:**
- Satu angkatan bisa punya banyak mahasiswa (1:N)
- Satu jurusan bisa punya banyak mahasiswa (1:N)
- Satu mahasiswa hanya punya satu angkatan dan satu jurusan

---

## 📊 View untuk Kemudahan Query

```sql
CREATE VIEW v_mahasiswa_lengkap AS
SELECT 
  m.id,
  m.nama,
  m.nim,
  m.alamat,
  m.no_hp,
  m.foto_url,
  m.status,
  m.created_at,
  m.updated_at,
  j.id as jurusan_id,
  j.nama_jurusan,
  a.id as angkatan_id,
  a.tahun as angkatan,
  a.nama_angkatan
FROM mahasiswa m
LEFT JOIN jurusan j ON m.jurusan_id = j.id
LEFT JOIN angkatan a ON m.angkatan_id = a.id;
```

**Kegunaan:**
Query mahasiswa dengan nama jurusan dan angkatan tanpa perlu JOIN manual.

---

## 🎯 Alur Kerja

### 1. Admin Mengelola Master Data

#### Tambah Angkatan Baru
```
Admin → Halaman Mahasiswa Angkatan → Tambah Angkatan
Input: Tahun 2028, Nama "Angkatan 2028", Status "Aktif"
Result: Angkatan 2028 otomatis muncul di semua dropdown
```

#### Tambah Jurusan Baru
```
Admin → Halaman Jurusan → Tambah Jurusan
Input: "Artificial Intelligence"
Result: Jurusan AI otomatis muncul di semua dropdown
```

### 2. Admin Menambah Mahasiswa

```
Admin → Halaman Mahasiswa → Tambah Mahasiswa
Form:
- Nama: Ahmad Rizki
- NIM: 2028001001
- Jurusan: [Dropdown dari tabel jurusan] → Pilih "Teknik Informatika"
- Angkatan: [Dropdown dari tabel angkatan] → Pilih "2028"
- Alamat: ...
- No HP: ...

Result: Mahasiswa tersimpan dengan jurusan_id dan angkatan_id
```

### 3. Filter Mahasiswa

```
Admin → Generate KTM
Dropdown Angkatan: [2023, 2024, 2025, 2026, 2027, 2028]
Pilih: 2028
Result: Tampil semua mahasiswa dengan angkatan_id = (id angkatan 2028)
```

---

## 🔍 Query Examples

### Get Semua Mahasiswa dengan Detail
```sql
SELECT * FROM v_mahasiswa_lengkap
ORDER BY created_at DESC;
```

### Get Mahasiswa by Angkatan
```sql
SELECT m.*, j.nama_jurusan, a.tahun as angkatan
FROM mahasiswa m
JOIN jurusan j ON m.jurusan_id = j.id
JOIN angkatan a ON m.angkatan_id = a.id
WHERE a.tahun = '2025'
ORDER BY m.nama;
```

### Get Mahasiswa by Jurusan
```sql
SELECT m.*, j.nama_jurusan, a.tahun as angkatan
FROM mahasiswa m
JOIN jurusan j ON m.jurusan_id = j.id
JOIN angkatan a ON m.angkatan_id = a.id
WHERE j.nama_jurusan = 'Teknik Informatika'
ORDER BY m.nama;
```

### Count Mahasiswa per Angkatan
```sql
SELECT 
  a.tahun,
  a.nama_angkatan,
  COUNT(m.id) as total_mahasiswa
FROM angkatan a
LEFT JOIN mahasiswa m ON a.id = m.angkatan_id
GROUP BY a.id, a.tahun, a.nama_angkatan
ORDER BY a.tahun DESC;
```

### Count Mahasiswa per Jurusan
```sql
SELECT 
  j.nama_jurusan,
  COUNT(m.id) as total_mahasiswa
FROM jurusan j
LEFT JOIN mahasiswa m ON j.id = m.jurusan_id
GROUP BY j.id, j.nama_jurusan
ORDER BY total_mahasiswa DESC;
```

---

## 🚀 Cara Implementasi

### Step 1: Jalankan Migration
```bash
# Di Supabase SQL Editor
# Jalankan file: supabase/final-structure.sql
```

### Step 2: Verifikasi Data
```sql
-- Cek jumlah data
SELECT 
  (SELECT COUNT(*) FROM angkatan) as total_angkatan,
  (SELECT COUNT(*) FROM jurusan) as total_jurusan,
  (SELECT COUNT(*) FROM mahasiswa) as total_mahasiswa;

-- Cek relasi
SELECT * FROM v_mahasiswa_lengkap LIMIT 5;
```

### Step 3: Update Kode Aplikasi
File yang perlu diupdate akan saya buat di langkah berikutnya.

---

## ✅ Keuntungan Struktur Ini

### 1. **Centralized Master Data**
- Angkatan dan jurusan dikelola di satu tempat
- Perubahan langsung terlihat di semua fitur

### 2. **Data Integrity**
- Foreign key constraint mencegah data tidak valid
- Tidak bisa hapus angkatan/jurusan yang masih digunakan

### 3. **Konsistensi**
- Nama jurusan dan angkatan selalu konsisten
- Tidak ada typo atau variasi nama

### 4. **Fleksibilitas**
- Mudah tambah angkatan baru
- Mudah tambah jurusan baru
- Otomatis muncul di semua dropdown

### 5. **Performa**
- Query dengan JOIN lebih cepat dengan indexes
- View mempermudah query kompleks

---

## 🎯 Use Cases

### Use Case 1: Tambah Angkatan Baru
```
Scenario: Tahun ajaran baru 2028
Action: Admin tambah angkatan 2028 di halaman Mahasiswa Angkatan
Result: 
- Angkatan 2028 muncul di dropdown Generate KTM
- Angkatan 2028 muncul di form tambah mahasiswa
- Angkatan 2028 muncul di filter dashboard
```

### Use Case 2: Tambah Jurusan Baru
```
Scenario: Kampus buka jurusan baru "Cyber Security"
Action: Admin tambah jurusan di halaman Jurusan
Result:
- Jurusan Cyber Security muncul di form tambah mahasiswa
- Jurusan Cyber Security muncul di chart dashboard
- Jurusan Cyber Security muncul di filter
```

### Use Case 3: Hapus Angkatan
```
Scenario: Admin ingin hapus angkatan 2020
Check: Apakah masih ada mahasiswa dengan angkatan 2020?
- Jika YA: Error "Tidak bisa dihapus, masih ada X mahasiswa"
- Jika TIDAK: Berhasil dihapus
```

---

**Status:** ✅ **READY TO IMPLEMENT**

**Next Steps:**
1. Jalankan `supabase/final-structure.sql`
2. Update kode TypeScript untuk menggunakan foreign key
3. Update form tambah/edit mahasiswa dengan dropdown
4. Test semua fitur

