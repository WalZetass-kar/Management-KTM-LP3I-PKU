# Changelog: KTM Card V2 Integration

## Tanggal: 18 April 2026

### Perubahan Utama

Desain KTM telah diperbarui dari desain lama (dengan wave shapes biru/kuning) ke desain baru modern bergaya KTP dengan latar belakang gelap dan aksen emas.

### Desain Baru (V2)

**Karakteristik:**
- Background: Gradient biru gelap (from-blue-900 via-blue-800 to-blue-950)
- Top bar: Gradient amber/emas (from-amber-500 to-amber-600)
- Pattern: Grid pattern overlay untuk tekstur
- Layout: Foto di kiri (32%), informasi di kanan (68%)
- Teks: Putih di atas background gelap untuk kontras tinggi
- Label: Warna amber untuk label field
- Validity period: Container frosted glass dengan backdrop blur
- Bottom accent: Strip emas di bagian bawah
- Ukuran: Landscape format seperti KTP (aspect ratio 1.586:1)

### File yang Dibuat

1. **`components/ui/ktm-card-v2.tsx`**
   - Komponen reusable dengan props interface sederhana
   - Fitur download PNG menggunakan html2canvas
   - Menerima props: nama, nim, prodi, foto, berlaku, sampai

2. **`features/ktm/components/ktm-card-preview-v2.tsx`**
   - Preview component untuk halaman generate KTM
   - Mendukung format data Mahasiswa dan StudentRecord
   - Auto-calculate validity period (4 tahun dari created_at)

3. **`components/landing/ktm-preview-card-v2.tsx`**
   - Preview component untuk landing page
   - Fitur download PDF menggunakan html2canvas + jsPDF
   - Format PDF: Landscape A6 (148mm width)

### File yang Diupdate

1. **`features/ktm/components/ktm-generator.tsx`**
   - Import diubah dari `KtmCardPreview` ke `KtmCardPreviewV2`
   - Sekarang menggunakan desain baru

2. **`app/student/page.tsx`**
   - Import diubah dari `KtmCardPreview` ke `KtmCardPreviewV2`
   - Portal mahasiswa sekarang menampilkan desain baru

3. **`components/landing/hero-section.tsx`**
   - Import diubah dari `KtmPreviewCard` ke `KtmPreviewCardV2`
   - Landing page sekarang menampilkan desain baru dengan download PDF

### Data yang Digunakan

Semua input data tetap sama:
- **nama**: Nama lengkap mahasiswa
- **nim**: Nomor Induk Mahasiswa
- **prodi/jurusan**: Program studi (Hubungan Masyarakat, Administrasi Bisnis, Komputerisasi Akuntansi, Manajemen Informatika)
- **foto**: URL foto profil atau null (akan menampilkan initial)
- **berlaku**: Tanggal mulai berlaku (format MM/YY)
- **sampai**: Tanggal berakhir (format MM/YY)

### File Lama (V1)

File-file berikut masih ada tetapi tidak lagi digunakan:
- `components/ui/ktm-card.tsx` (desain lama dengan wave shapes)
- `features/ktm/components/ktm-card-preview.tsx` (preview lama)
- `components/landing/ktm-preview-card.tsx` (landing preview lama)

File-file ini dapat dihapus jika tidak diperlukan lagi, atau disimpan sebagai backup.

### Testing

Untuk menguji desain baru:
1. **Generate KTM**: Buka `/generate-ktm` dan pilih mahasiswa
2. **Portal Mahasiswa**: Login sebagai mahasiswa di `/student/login`
3. **Landing Page**: Buka `/` dan cari mahasiswa dengan NIM

### Dependencies

Tidak ada dependency baru yang ditambahkan. Masih menggunakan:
- `html2canvas` - untuk convert HTML ke canvas/image
- `jspdf` - untuk generate PDF (hanya di landing page)

### Catatan

- Desain V2 lebih modern dan profesional
- Kontras lebih baik untuk readability
- Ukuran sesuai standar KTP Indonesia
- Semua fitur download (PNG/PDF) tetap berfungsi
- Tidak ada breaking changes pada data structure
