# Fitur Alumni - Sistem KTM LP3I Pekanbaru

## Overview
Fitur alumni memungkinkan sistem untuk mengelola data alumni dan generate KTM khusus alumni dengan desain berbeda dari mahasiswa aktif.

## Fitur Utama

### 1. KTM Alumni (Desain Biru LP3I)
- **Warna**: Gradient biru (#0047AB - #2E6FA5) khas LP3I
- **Badge**: Warna emas/amber untuk identitas alumni
- **Ukuran**: 85.6mm x 53.98mm (standar KTP)
- **Flip Card**: Bisa lihat depan-belakang
- **Info Tambahan**: Pekerjaan, perusahaan, lokasi

### 2. Dashboard Alumni
- Statistik: Total alumni, yang bekerja, belum bekerja, lulus tahun ini
- Daftar alumni lengkap dengan data pekerjaan
- Akses via menu sidebar: **Alumni**

### 3. Generate KTM Alumni
- Landing page: Tab "Alumni LP3I"
- Input NIM mahasiswa dengan status "Lulus"
- Download KTM format PNG

## Database Schema

### Kolom Baru di Tabel `mahasiswa`
```sql
- tahun_lulus VARCHAR(4)           -- Tahun kelulusan
- pekerjaan_saat_ini TEXT          -- Posisi/jabatan
- perusahaan_saat_ini TEXT         -- Nama perusahaan
- lokasi_saat_ini TEXT             -- Lokasi domisili
```

### Migration
Jalankan file: `supabase/add-alumni-columns.sql` di Supabase SQL Editor

## Cara Penggunaan

### A. Untuk Admin

#### 1. Ubah Status Mahasiswa Jadi Alumni & Input Data Alumni
1. Buka **Data Mahasiswa**
2. Klik **Edit** pada mahasiswa yang lulus
3. Ubah status ke **"Lulus"**
4. **Form data alumni akan muncul otomatis** (background kuning)
5. Isi data alumni:
   - **Tahun Lulus** (contoh: 2023)
   - **Lokasi Saat Ini** (contoh: Pekanbaru, Riau)
   - **Pekerjaan Saat Ini** (contoh: Software Engineer)
   - **Perusahaan Saat Ini** (contoh: PT Teknologi Indonesia)
6. Klik **Simpan**

> **Note**: Field alumni hanya muncul saat status = "Lulus"

#### 2. Lihat Dashboard Alumni
1. Klik menu **Alumni** di sidebar
2. Lihat statistik dan daftar alumni

### B. Untuk Publik (Landing Page)

#### Generate KTM Alumni
1. Buka landing page: `https://your-domain.com`
2. Klik tab **"Alumni LP3I"**
3. Masukkan NIM alumni
4. Klik **"Generate KTM"**
5. KTM alumni akan muncul dengan desain biru
6. Klik **"Unduh KTM"** untuk download PNG

## Perbedaan KTM Mahasiswa vs Alumni

| Aspek | Mahasiswa Aktif | Alumni |
|-------|----------------|--------|
| Warna Utama | Navy (#0f2847) | Biru LP3I (#0047AB) |
| Badge | Hijau "AKTIF" | Emas "ALUMNI" |
| Info Tambahan | Masa Berlaku | Tahun Lulus, Pekerjaan |
| Icon | CheckCircle | GraduationCap |

## API Endpoints

### GET /api/alumni?nim={nim}
Ambil data alumni berdasarkan NIM

**Response:**
```json
{
  "alumni": {
    "nim": "202001001",
    "fullName": "John Doe",
    "studyProgram": "Teknik Informatika",
    "graduationYear": "2023",
    "photoUrl": "https://...",
    "currentJob": "Software Engineer",
    "currentCompany": "PT ABC",
    "location": "Jakarta"
  }
}
```

## Komponen

### `<AlumniKTMCard />`
Komponen KTM alumni dengan desain biru LP3I

**Props:**
```typescript
interface AlumniKTMData {
  nama: string;
  nim: string;
  jurusan: string;
  tahunLulus: string;
  fotoUrl: string | null;
  pekerjaan?: string | null;
  perusahaan?: string | null;
  lokasi?: string | null;
}
```

**Mode:**
- `flip`: Interactive flip card (default)
- `front-only`: Hanya depan
- `back-only`: Hanya belakang

## Testing

### Test Checklist
- [ ] Migration SQL berhasil dijalankan
- [ ] Ubah status mahasiswa ke "Lulus"
- [ ] Generate KTM alumni di landing page
- [ ] Download KTM alumni (PNG)
- [ ] Dashboard alumni menampilkan statistik
- [ ] Daftar alumni muncul di dashboard

### Sample Data
Untuk testing, buat mahasiswa dengan:
- Status: "Lulus"
- Tahun Lulus: "2023"
- Pekerjaan: "Software Engineer"
- Perusahaan: "PT Teknologi Indonesia"
- Lokasi: "Pekanbaru, Riau"

## Troubleshooting

### KTM Alumni Tidak Muncul
- Pastikan status mahasiswa = "Lulus"
- Cek NIM sudah benar
- Lihat console browser untuk error

### Data Alumni Kosong
- Jalankan migration SQL terlebih dahulu
- Refresh browser setelah migration

### Styling Rusak
- Pastikan `globals.css` sudah benar (Google Fonts di baris pertama)
- Restart dev server: `npm run dev`

## Future Enhancements
- [ ] Form khusus input data alumni
- [ ] Export data alumni ke Excel
- [ ] Statistik alumni per jurusan
- [ ] Alumni directory dengan search
- [ ] Tracer study integration
