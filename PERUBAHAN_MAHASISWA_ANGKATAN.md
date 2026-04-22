# Perubahan Fitur Mahasiswa Angkatan

## Konsep Baru

Fitur "Mahasiswa Angkatan" telah diubah menjadi **"Tahun Angkatan"** dengan konsep:

1. **Tahun Angkatan** = Tempat untuk mengelola **tahun angkatan** saja (master data)
2. **Data Mahasiswa** = Tempat untuk menambah mahasiswa dengan memilih angkatan yang sudah ada

## Perubahan yang Dilakukan

### 1. Database
- **Tabel Baru**: `angkatan` untuk menyimpan master data tahun angkatan
- **Struktur Tabel**:
  ```sql
  - id (SERIAL PRIMARY KEY)
  - tahun (VARCHAR(4) UNIQUE)
  - nama_angkatan (VARCHAR(100))
  - status ('Aktif' | 'Tidak Aktif')
  - keterangan (TEXT, optional)
  - created_at, updated_at
  ```

### 2. Fitur Baru
- **CRUD Tahun Angkatan**: Tambah, edit, hapus tahun angkatan
- **Status Management**: Angkatan bisa diaktifkan/nonaktifkan
- **Validasi**: Tidak bisa hapus angkatan yang masih digunakan mahasiswa

### 3. Integrasi
- **Form Mahasiswa**: Dropdown angkatan mengambil dari tabel `angkatan` (status Aktif)
- **Generate KTM**: Filter angkatan menggunakan data dari tabel `angkatan`
- **Auto-sync**: Semua halaman otomatis update saat ada perubahan angkatan

## Cara Penggunaan

### Mengelola Tahun Angkatan
1. Masuk ke menu **"Tahun Angkatan"** di sidebar
2. Klik **"Tambah Tahun Angkatan"** untuk menambah tahun baru (misal: 2028)
3. Isi form:
   - **Tahun**: 2028
   - **Nama Angkatan**: Angkatan 2028
   - **Status**: Aktif
   - **Keterangan**: (opsional)
4. Klik **"Tambah"**

### Menambah Mahasiswa
1. Masuk ke menu **"Data Mahasiswa"**
2. Klik **"Tambah Mahasiswa"**
3. Pilih angkatan dari dropdown (hanya yang status Aktif)
4. Isi data mahasiswa lainnya
5. Simpan

## Keuntungan Sistem Baru

1. **Centralized**: Tahun angkatan dikelola di satu tempat
2. **Scalable**: Mudah menambah tahun baru (2028, 2029, dst)
3. **Flexible**: Bisa nonaktifkan angkatan lama tanpa hapus data
4. **Consistent**: Semua fitur menggunakan data angkatan yang sama
5. **Clean**: Pemisahan yang jelas antara master data dan data mahasiswa

## File yang Dibuat
- `supabase/create-angkatan-table.sql`
- `types/angkatan.ts`
- `lib/angkatan.ts`
- `actions/angkatan.ts`
- `features/mahasiswa-angkatan/components/angkatan-form-modal.tsx`
- `features/mahasiswa-angkatan/components/angkatan-table.tsx`

## File yang Diubah
- `app/mahasiswa-angkatan/page.tsx`
- `lib/navigation.ts`
- `lib/mahasiswa.ts`

## File yang Dihapus
- `actions/mahasiswa-angkatan.ts`
- `lib/mahasiswa-angkatan.ts`
- `types/mahasiswa-angkatan.ts`
- `features/mahasiswa-angkatan/components/mahasiswa-angkatan-*`
- `app/mahasiswa-angkatan/tambah/page.tsx`

## Setup Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- File: supabase/create-angkatan-table.sql
-- Akan membuat tabel angkatan dengan data sample 2023-2027
```

Setelah itu, sistem siap digunakan dengan konsep baru!