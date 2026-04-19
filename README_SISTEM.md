# Sistem Manajemen KTM - Politeknik LP3I Pekanbaru

## 🎯 Apa itu Sistem Ini?

Sistem Manajemen Kartu Tanda Mahasiswa (KTM) Digital adalah aplikasi web untuk mengelola data mahasiswa dan membuat KTM digital secara otomatis untuk Politeknik LP3I Pekanbaru.

## 🚀 Teknologi Utama

- **Next.js 15**: Framework React modern untuk web app
- **TypeScript**: JavaScript dengan type safety
- **Supabase**: Database PostgreSQL + Authentication + Storage
- **Tailwind CSS**: Styling modern dan responsive

## 👥 Siapa yang Menggunakan?

1. **Super Admin**: Kelola semua (admin + mahasiswa)
2. **Admin**: Kelola data mahasiswa & generate KTM
3. **Mahasiswa**: Lihat data pribadi & KTM

## ✨ Fitur Utama

### 1. Dashboard
- Statistik real-time (total mahasiswa, KTM generated, dll)
- Grafik pertumbuhan
- Activity feed

### 2. Manajemen Mahasiswa
- Tambah, edit, hapus mahasiswa
- Upload foto mahasiswa
- Search & filter (nama, NIM, jurusan, status)
- 4 Jurusan:
  - Hubungan Masyarakat
  - Administrasi Bisnis
  - Komputerisasi Akuntansi
  - Manajemen Informatika

### 3. Generate KTM
- Desain KTM modern & profesional
- Logo Politeknik LP3I Pekanbaru
- Preview real-time
- Download sebagai gambar/PDF

### 4. Verifikasi
- Verifikasi mahasiswa by NIM
- Tampilkan info lengkap
- Status valid/invalid

### 5. Manajemen Admin (Super Admin)
- Tambah/edit/hapus admin
- Ubah role (Admin/Super Admin)

### 6. Profil Admin
- Upload foto profil
- Edit informasi
- Lihat riwayat login

## 🗄️ Database

### Tabel Utama

**mahasiswa**
- Data mahasiswa (nama, NIM, jurusan, foto, dll)
- Status: Aktif, Menunggu, Nonaktif

**user_profiles**
- Profil admin
- Role: admin, super_admin
- Foto profil

**student_accounts**
- Akun login mahasiswa
- NIM + password

## 🔒 Keamanan

- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Row Level Security (RLS)
- ✅ Password hashing
- ✅ Input validation
- ✅ File upload security

## 📱 Cara Kerja

### Login Admin
```
1. Buka /login
2. Masukkan email & password
3. Sistem verify → create session
4. Redirect ke dashboard
```

### Tambah Mahasiswa
```
1. Dashboard → Mahasiswa → Tambah
2. Isi form (nama, NIM, jurusan, dll)
3. Upload foto (optional)
4. Submit → data tersimpan
5. Akun mahasiswa otomatis dibuat
```

### Generate KTM
```
1. Dashboard → Generate KTM
2. Pilih mahasiswa
3. Preview KTM real-time
4. Click Generate
5. Download KTM
```

### Verifikasi
```
1. Buka /verifikasi atau landing page
2. Input NIM
3. Click Verifikasi
4. Lihat hasil (valid/invalid + info mahasiswa)
```

## 🎨 Desain KTM

### Elemen Desain
- **Header**: Biru (#0d4a7d) dengan wave shape
- **Logo**: Logo LP3I Pekanbaru (PNG asli)
- **Foto**: Border tosca (#14a1aa), rounded corner
- **Info**: NIM (besar), Nama, Jurusan (merah)
- **Periode**: Berlaku sejak & sampai dengan (4 tahun)
- **Dekorasi**: Wave shapes kuning & biru, globe background

### Warna Brand
- Biru: `#0d4a7d`
- Kuning: `#f7b62d`
- Tosca: `#14a1aa`
- Merah: `#ef4444`

## 📂 Struktur Folder

```
├── app/                    # Pages (Next.js App Router)
│   ├── dashboard/         # Dashboard admin
│   ├── mahasiswa/         # Manajemen mahasiswa
│   ├── generate-ktm/      # Generate KTM
│   ├── verifikasi/        # Verifikasi
│   ├── admin-management/  # Manajemen admin
│   └── profile/           # Profil admin
├── components/            # Reusable components
├── features/              # Feature modules
├── lib/                   # Utilities & logic
├── types/                 # TypeScript types
└── actions/               # Server actions
```

## 🔧 Setup & Run

### 1. Install
```bash
npm install
```

### 2. Environment
```bash
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials
```

### 3. Database
```bash
# Run SQL files di Supabase:
# 1. supabase/schema.sql
# 2. supabase/insert-data.sql
# 3. supabase/add-photo-url-column.sql
```

### 4. Run
```bash
npm run dev
# Buka http://localhost:3000
```

### 5. Build
```bash
npm run build
npm start
```

## 📊 Alur Data

```
User Input → Next.js Server Action → Validation
  ↓
Supabase Database (PostgreSQL)
  ↓
Row Level Security Check
  ↓
Return Data → Next.js → Render UI
```

## 🎯 Keunggulan Sistem

1. **Modern & Fast**: Next.js 15 dengan server components
2. **Secure**: Multi-layer security (Auth, RLS, Validation)
3. **Scalable**: Supabase backend yang powerful
4. **User-Friendly**: UI/UX modern dengan Tailwind CSS
5. **Responsive**: Mobile-friendly design
6. **Real-time**: Update data real-time
7. **Type-Safe**: TypeScript untuk menghindari bugs

## 📈 Statistik Sistem

- **Pages**: 15+ halaman
- **Components**: 50+ reusable components
- **Features**: 8 fitur utama
- **Database Tables**: 3 tabel utama
- **API Endpoints**: 20+ server actions
- **Security Policies**: 10+ RLS policies

## 🔮 Future Features

- QR Code scanning
- Batch import (Excel/CSV)
- Email notifications
- Mobile app
- Advanced analytics
- Integration sistem akademik

## 📞 Support

- Email: support@lp3i-pekanbaru.ac.id
- Phone: (0761) 123456

---

**Dokumentasi lengkap**: Lihat `DOKUMENTASI_SISTEM.md`

**Dibuat untuk Politeknik LP3I Pekanbaru** 🎓
