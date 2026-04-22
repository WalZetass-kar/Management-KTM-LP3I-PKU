# Perubahan Sistem Mahasiswa dengan Master Data

## 📋 Ringkasan Perubahan

Sistem telah diperbarui untuk menggunakan **master data** dengan **foreign keys** untuk mengelola data mahasiswa, jurusan, dan angkatan. Sekarang ketika admin menambahkan jurusan atau angkatan baru, data tersebut otomatis muncul di semua dropdown form.

## 🎯 Masalah yang Diperbaiki

### ❌ Sebelumnya:
- Form mahasiswa menggunakan **hardcoded list** jurusan (hanya 4 jurusan)
- Angkatan juga hardcoded (2023-2027)
- Admin tidak bisa menambah jurusan/angkatan baru secara dinamis
- Data tidak konsisten antara tabel

### ✅ Sekarang:
- Form mahasiswa mengambil data dari **database** (tabel `jurusan` dan `angkatan`)
- Admin bisa menambah jurusan baru di `/jurusan` → otomatis muncul di form
- Admin bisa menambah angkatan baru di `/mahasiswa-angkatan` → otomatis muncul di form
- Data konsisten dengan **foreign keys** dan **auto-sync trigger**

## 🗄️ Struktur Database

### Tabel Master:
1. **`angkatan`** - Master data tahun angkatan
   - `id` (PK)
   - `tahun` (e.g., "2025")
   - `nama_angkatan` (e.g., "Angkatan 2025")
   - `status` ("Aktif" / "Tidak Aktif")

2. **`jurusan`** - Master data jurusan
   - `id` (PK)
   - `nama_jurusan` (e.g., "Teknik Informatika")

### Tabel Transaksi:
3. **`mahasiswa`** - Data mahasiswa dengan foreign keys
   - `id` (PK)
   - `nama`, `nim`, `alamat`, `no_hp`, `foto_url`, `status`
   - **Text columns** (backward compatibility):
     - `angkatan` (text) - e.g., "2025"
     - `jurusan` (text) - e.g., "Teknik Informatika"
   - **Foreign keys** (relational):
     - `angkatan_id` → `angkatan(id)`
     - `jurusan_id` → `jurusan(id)`

## 🔄 Auto-Sync Trigger (Bidirectional)

Trigger `sync_mahasiswa_text_columns()` otomatis menyinkronkan data:

### Text → FK:
```sql
-- Ketika insert/update dengan kolom text
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan) 
VALUES ('Ahmad', '2025001', 'Teknik Informatika', '2025');
-- Trigger otomatis set: jurusan_id dan angkatan_id
```

### FK → Text:
```sql
-- Ketika insert/update dengan foreign key
INSERT INTO mahasiswa (nama, nim, jurusan_id, angkatan_id) 
VALUES ('Ahmad', '2025001', 1, 5);
-- Trigger otomatis set: jurusan dan angkatan (text)
```

## 📝 Perubahan Kode

### 1. **Student Form Component** (`features/students/components/student-form.tsx`)

**Sebelum:**
```tsx
// Hardcoded angkatan
options={[
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  // ...
]}

// Hardcoded jurusan dari mock-data.ts
options={studyPrograms.map((program) => ({ label: program, value: program }))}
```

**Sesudah:**
```tsx
// Dynamic dari database
interface StudentFormProps {
  mode: "create" | "update";
  student?: StudentRecord;
  jurusanList: JurusanRecord[];  // ← Dari database
  angkatanList: Angkatan[];      // ← Dari database
}

// Angkatan dropdown
options={angkatanList.map((angkatan) => ({ 
  label: angkatan.nama_angkatan,  // "Angkatan 2025"
  value: angkatan.tahun           // "2025"
}))}

// Jurusan dropdown
options={jurusanList.map((jurusan) => ({ 
  label: jurusan.namaJurusan,     // "Teknik Informatika"
  value: jurusan.namaJurusan      // "Teknik Informatika"
}))}
```

### 2. **Add Student Page** (`app/mahasiswa/tambah/page.tsx`)

**Sebelum:**
```tsx
export default async function AddStudentPage() {
  return <StudentForm mode="create" />;
}
```

**Sesudah:**
```tsx
export default async function AddStudentPage() {
  const [jurusanResult, angkatanResult] = await Promise.all([
    getJurusanList(),    // Fetch dari database
    getAngkatanList(),   // Fetch dari database
  ]);

  return (
    <StudentForm 
      mode="create" 
      jurusanList={jurusanResult.data}
      angkatanList={angkatanResult.data}
    />
  );
}
```

### 3. **Edit Student Page** (`app/mahasiswa/[id]/edit/page.tsx`)

**Sebelum:**
```tsx
const { data: student } = await getMahasiswaById(studentId);
return <StudentForm mode="update" student={student} />;
```

**Sesudah:**
```tsx
const [{ data: student }, jurusanResult, angkatanResult] = await Promise.all([
  getMahasiswaById(studentId),
  getJurusanList(),
  getAngkatanList(),
]);

return (
  <StudentForm 
    mode="update" 
    student={student}
    jurusanList={jurusanResult.data}
    angkatanList={angkatanResult.data}
  />
);
```

## 🚀 Cara Menggunakan

### 1. **Jalankan Migration SQL**
```bash
# Di Supabase SQL Editor, jalankan:
supabase/add-foreign-keys-to-mahasiswa.sql
```

### 2. **Tambah Angkatan Baru**
1. Buka `/mahasiswa-angkatan`
2. Klik "Tambah Angkatan"
3. Isi tahun (e.g., "2028") dan nama (e.g., "Angkatan 2028")
4. Simpan
5. ✅ Angkatan otomatis muncul di form tambah mahasiswa

### 3. **Tambah Jurusan Baru**
1. Buka `/jurusan`
2. Klik "Tambah Jurusan"
3. Isi nama jurusan (e.g., "Sistem Informasi")
4. Simpan
5. ✅ Jurusan otomatis muncul di form tambah mahasiswa

### 4. **Tambah Mahasiswa**
1. Buka `/mahasiswa/tambah`
2. Pilih angkatan dari dropdown (data dari tabel `angkatan`)
3. Pilih jurusan dari dropdown (data dari tabel `jurusan`)
4. Isi data lainnya
5. Simpan
6. ✅ Data tersimpan dengan foreign keys yang benar

## 🔍 Query untuk Verifikasi

### Lihat mahasiswa dengan relasi lengkap:
```sql
SELECT * FROM v_mahasiswa_lengkap;
```

### Lihat mahasiswa dengan foreign keys:
```sql
SELECT 
  m.id,
  m.nama,
  m.nim,
  m.angkatan,      -- text
  m.angkatan_id,   -- FK
  m.jurusan,       -- text
  m.jurusan_id,    -- FK
  a.nama_angkatan,
  j.nama_jurusan
FROM mahasiswa m
LEFT JOIN angkatan a ON m.angkatan_id = a.id
LEFT JOIN jurusan j ON m.jurusan_id = j.id;
```

### Cek trigger berfungsi:
```sql
-- Insert dengan text columns
INSERT INTO mahasiswa (nama, nim, jurusan, angkatan, alamat, no_hp, status)
VALUES ('Test User', '2025999', 'Teknik Informatika', '2025', 'Test', '08123456789', 'Aktif');

-- Cek apakah FK ter-set otomatis
SELECT nama, jurusan, jurusan_id, angkatan, angkatan_id 
FROM mahasiswa 
WHERE nim = '2025999';
```

## 📊 Keuntungan Sistem Baru

1. ✅ **Dinamis** - Admin bisa tambah jurusan/angkatan kapan saja
2. ✅ **Konsisten** - Data selalu sinkron antara text dan FK
3. ✅ **Relational** - Bisa query dengan JOIN untuk laporan
4. ✅ **Backward Compatible** - Kode lama tetap berfungsi
5. ✅ **Scalable** - Mudah tambah master data baru

## 🐛 Troubleshooting

### Dropdown kosong?
```sql
-- Cek apakah ada data di tabel master
SELECT * FROM angkatan WHERE status = 'Aktif';
SELECT * FROM jurusan;
```

### Foreign key tidak ter-set?
```sql
-- Cek apakah trigger aktif
SELECT * FROM pg_trigger WHERE tgname = 'trigger_sync_mahasiswa_text_columns';

-- Test trigger manual
UPDATE mahasiswa SET jurusan = 'Teknik Informatika' WHERE id = 1;
SELECT jurusan, jurusan_id FROM mahasiswa WHERE id = 1;
```

### Data tidak sinkron?
```sql
-- Re-sync manual semua data
UPDATE mahasiswa m
SET 
  angkatan_id = a.id,
  jurusan_id = j.id
FROM angkatan a, jurusan j
WHERE m.angkatan = a.tahun
  AND m.jurusan = j.nama_jurusan;
```

## 📚 File yang Diubah

1. ✅ `supabase/add-foreign-keys-to-mahasiswa.sql` - Migration script
2. ✅ `features/students/components/student-form.tsx` - Form component
3. ✅ `app/mahasiswa/tambah/page.tsx` - Add page
4. ✅ `app/mahasiswa/[id]/edit/page.tsx` - Edit page
5. ✅ `lib/mahasiswa.ts` - Helper functions (sudah support trigger)
6. ✅ `actions/mahasiswa.ts` - Server actions (sudah support trigger)
7. ✅ `types/supabase.ts` - Type definitions

## ✨ Kesimpulan

Sistem sekarang menggunakan **master data dengan foreign keys** yang memungkinkan admin mengelola jurusan dan angkatan secara dinamis. Semua perubahan di tabel master otomatis muncul di form mahasiswa. Data tetap konsisten dengan **bidirectional auto-sync trigger**.
