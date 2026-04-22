# Setup Database - Mahasiswa Angkatan

## Langkah-langkah Setup Database

### 1. Buat Tabel Jurusan
Jalankan SQL script berikut di Supabase SQL Editor:

```sql
-- File: supabase/create-jurusan-table.sql
-- Buat tabel jurusan dengan data sample
```

### 2. Buat Tabel Mahasiswa Angkatan
Jalankan SQL script berikut di Supabase SQL Editor:

```sql
-- File: supabase/create-mahasiswa-angkatan-table.sql
-- Buat tabel mahasiswa_angkatan dengan data sample
```

### 3. Verifikasi Tabel
Pastikan kedua tabel sudah terbuat dengan menjalankan query:

```sql
-- Cek tabel jurusan
SELECT * FROM jurusan;

-- Cek tabel mahasiswa_angkatan
SELECT * FROM mahasiswa_angkatan;
```

### 4. Konfigurasi Environment
Pastikan file `.env.local` sudah berisi konfigurasi Supabase yang benar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bmxvtnlkneyrpnfyxkqg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### Error: Table doesn't exist
- Pastikan sudah menjalankan SQL script untuk membuat tabel
- Periksa nama tabel di Supabase dashboard

### Error: Permission denied
- Pastikan RLS policies sudah dibuat dengan benar
- Periksa authentication user

### Error: Function not found
- Pastikan semua import sudah benar
- Restart development server setelah perubahan

## Testing

### 1. Test Menu Mahasiswa Angkatan
- Buka aplikasi
- Login sebagai admin
- Klik menu "Mahasiswa Angkatan" di sidebar
- Pilih angkatan (2025-2027)

### 2. Test Tambah Mahasiswa
- Klik tombol "Tambah Mahasiswa"
- Isi form dengan data lengkap
- Pilih status: Menunggu, Aktif, Tidak Aktif, Lulus, atau Cuti
- Simpan data

### 3. Test Filter dan Search
- Gunakan filter berdasarkan angkatan
- Coba search berdasarkan nama atau NIM
- Periksa hasil yang ditampilkan

## Data Sample

### Jurusan Sample:
- Teknik Informatika
- Sistem Informasi
- Teknik Komputer
- Manajemen Informatika
- Rekayasa Perangkat Lunak
- Keamanan Siber
- Data Science
- Multimedia dan Jaringan

### Mahasiswa Angkatan Sample:
- Ahmad Rizki Pratama (2025, Teknik Informatika, Aktif)
- Siti Nurhaliza (2025, Sistem Informasi, Aktif)
- Budi Santoso (2026, Teknik Komputer, Menunggu)
- Dewi Sartika (2026, Manajemen Informatika, Aktif)
- Eko Prasetyo (2027, Teknik Informatika, Menunggu)