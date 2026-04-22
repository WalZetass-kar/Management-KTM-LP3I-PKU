# Dokumentasi Sistem Manajemen KTM Politeknik LP3I Pekanbaru

## 📋 Daftar Isi
1. [Ringkasan Sistem](#ringkasan-sistem)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Fitur Utama](#fitur-utama)
5. [Struktur Database](#struktur-database)
6. [Alur Kerja Sistem](#alur-kerja-sistem)
7. [Keamanan](#keamanan)
8. [Deployment](#deployment)

---

## 🎯 Ringkasan Sistem

**Sistem Manajemen Kartu Tanda Mahasiswa (KTM) Digital** adalah aplikasi web modern yang dirancang khusus untuk Politeknik LP3I Pekanbaru. Sistem ini memfasilitasi pengelolaan data mahasiswa, pembuatan KTM digital, dan verifikasi identitas mahasiswa secara terpusat dan efisien.

### Tujuan Sistem
- Digitalisasi proses pembuatan dan pengelolaan KTM
- Mempermudah verifikasi identitas mahasiswa
- Centralisasi data mahasiswa dalam satu platform
- Meningkatkan efisiensi administrasi kampus

### Pengguna Sistem
1. **Super Admin**: Akses penuh ke semua fitur termasuk manajemen admin
2. **Admin**: Mengelola data mahasiswa, generate KTM, dan verifikasi
3. **Mahasiswa**: Melihat data pribadi dan KTM digital (read-only)

---

## 💻 Teknologi yang Digunakan

### Frontend
- **Next.js 15.5.15**: Framework React untuk server-side rendering dan static site generation
- **React 19**: Library JavaScript untuk membangun user interface
- **TypeScript**: Superset JavaScript dengan type safety
- **Tailwind CSS**: Utility-first CSS framework untuk styling
- **Lucide React**: Icon library modern dan lightweight

### Backend & Database
- **Supabase**: Backend-as-a-Service (BaaS) yang menyediakan:
  - **PostgreSQL Database**: Database relational untuk menyimpan data
  - **Authentication**: Sistem autentikasi bawaan dengan JWT
  - **Row Level Security (RLS)**: Keamanan tingkat baris untuk kontrol akses
  - **Storage**: Penyimpanan file untuk foto mahasiswa dan admin
  - **Real-time**: Kemampuan real-time untuk update data

### Tools & Libraries
- **Server Actions**: Next.js server actions untuk form handling
- **Middleware**: Next.js middleware untuk route protection
- **Image Optimization**: Next.js Image component untuk optimasi gambar
- **Date Formatting**: JavaScript Date API untuk format tanggal

---

## 🏗️ Arsitektur Sistem

### Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                  │  │
│  │  - Pages & Components                             │  │
│  │  - Client-side State Management                   │  │
│  │  - UI/UX dengan Tailwind CSS                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (Edge Runtime)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  - Server Components                              │  │
│  │  - Server Actions (Form Handling)                 │  │
│  │  - Middleware (Auth & Route Protection)           │  │
│  │  - API Routes                                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ API Calls
┌─────────────────────────────────────────────────────────┐
│                  Supabase Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ PostgreSQL   │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │   (JWT)      │  │   (Files)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Struktur Folder

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, etc)
│   ├── dashboard/           # Dashboard admin
│   ├── mahasiswa/           # Manajemen mahasiswa
│   ├── generate-ktm/        # Generate KTM
│   ├── verifikasi/          # Verifikasi mahasiswa
│   ├── admin-management/    # Manajemen admin
│   ├── profile/             # Profil admin
│   └── settings/            # Pengaturan
├── components/              # Reusable components
│   ├── ui/                  # UI components (Button, Input, etc)
│   ├── layout/              # Layout components (Sidebar, Topbar)
│   └── landing/             # Landing page components
├── features/                # Feature-based modules
│   ├── auth/                # Authentication features
│   ├── students/            # Student management features
│   ├── ktm/                 # KTM generation features
│   ├── verification/        # Verification features
│   ├── dashboard/           # Dashboard features
│   └── admin-profile/       # Admin profile features
├── lib/                     # Utility libraries
│   ├── supabase/            # Supabase client & config
│   ├── auth.ts              # Authentication logic
│   └── mahasiswa.ts         # Student data logic
├── types/                   # TypeScript type definitions
├── actions/                 # Server actions
└── middleware.ts            # Next.js middleware
```

---

## ✨ Fitur Utama

### 1. **Autentikasi & Otorisasi**
- Login admin dengan email & password
- Login mahasiswa dengan NIM & password
- Role-based access control (Super Admin, Admin, Mahasiswa)
- Session management dengan JWT
- Protected routes dengan middleware

### 2. **Dashboard Admin**
- Statistik real-time:
  - Total mahasiswa
  - Mahasiswa aktif
  - KTM yang digenerate
  - Verifikasi pending
- Grafik pertumbuhan mahasiswa
- Activity feed terbaru
- Quick actions

### 3. **Manajemen Mahasiswa**
- **CRUD Operations**:
  - Create: Tambah mahasiswa baru
  - Read: Lihat daftar & detail mahasiswa
  - Update: Edit data mahasiswa
  - Delete: Hapus data mahasiswa
- **Fitur Pencarian & Filter**:
  - Search by nama atau NIM
  - Filter by jurusan
  - Filter by status (Aktif/Menunggu/Nonaktif)
- **Upload Foto**: Upload foto mahasiswa untuk KTM
- **Validasi Data**: Validasi NIM, email, nomor HP

### 4. **Generate KTM**
- **Desain KTM Modern**:
  - Layout landscape profesional
  - Logo Politeknik LP3I Pekanbaru
  - Informasi lengkap: NIM, Nama, Jurusan
  - Foto mahasiswa
  - Periode berlaku (4 tahun)
  - Elemen dekoratif (wave shapes, globe)
- **Preview Real-time**: Lihat preview sebelum generate
- **Export Options**: Download sebagai gambar atau PDF
- **Batch Generation**: Generate multiple KTM sekaligus

### 5. **Verifikasi Mahasiswa**
- Input NIM untuk verifikasi
- Tampilkan informasi mahasiswa
- Status verifikasi (Valid/Invalid)
- Riwayat verifikasi
- QR Code scanning (future feature)

### 6. **Manajemen Admin** (Super Admin Only)
- Tambah admin baru
- Edit role admin (Admin/Super Admin)
- Hapus admin
- Lihat aktivitas admin
- Audit log

### 7. **Profil Admin**
- Upload foto profil
- Edit informasi profil
- Lihat informasi akun
- Riwayat login

### 8. **Landing Page**
- Hero section dengan search NIM
- Preview KTM
- Fitur-fitur sistem
- Cara kerja sistem
- About section
- Contact information

---

## 🗄️ Struktur Database

### Tabel: `mahasiswa`
Menyimpan data mahasiswa.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | ID unik mahasiswa |
| nama | VARCHAR(255) | Nama lengkap mahasiswa |
| nim | VARCHAR(20) UNIQUE | Nomor Induk Mahasiswa |
| jurusan | VARCHAR(100) | Program studi mahasiswa |
| alamat | TEXT | Alamat lengkap |
| no_hp | VARCHAR(20) | Nomor HP |
| email | VARCHAR(255) | Email mahasiswa |
| foto_url | TEXT | URL foto mahasiswa |
| status | VARCHAR(20) | Status (Aktif/Menunggu/Nonaktif) |
| created_at | TIMESTAMP | Tanggal dibuat |
| updated_at | TIMESTAMP | Tanggal diupdate |

**Jurusan yang Tersedia:**
1. Hubungan Masyarakat
2. Administrasi Bisnis
3. Komputerisasi Akuntansi
4. Manajemen Informatika

### Tabel: `user_profiles`
Menyimpan profil admin.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PRIMARY KEY | ID user (foreign key ke auth.users) |
| username | VARCHAR(100) | Username admin |
| role | VARCHAR(20) | Role (admin/super_admin) |
| photo_url | TEXT | URL foto profil |
| created_at | TIMESTAMP | Tanggal dibuat |
| updated_at | TIMESTAMP | Tanggal diupdate |

### Tabel: `student_accounts`
Menyimpan akun login mahasiswa.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | ID unik |
| mahasiswa_id | INTEGER | Foreign key ke mahasiswa |
| nim | VARCHAR(20) UNIQUE | NIM untuk login |
| password_hash | TEXT | Password ter-hash |
| created_at | TIMESTAMP | Tanggal dibuat |

### Row Level Security (RLS)

**Mahasiswa Table:**
```sql
-- Admin dapat melakukan semua operasi
CREATE POLICY "Admin can do everything" ON mahasiswa
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Mahasiswa hanya bisa read data sendiri
CREATE POLICY "Students can read own data" ON mahasiswa
  FOR SELECT USING (
    nim = (SELECT nim FROM student_accounts WHERE id = auth.uid())
  );
```

**User Profiles Table:**
```sql
-- Super admin dapat manage semua admin
CREATE POLICY "Super admin can manage admins" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Admin dapat read semua profil
CREATE POLICY "Admin can read profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
```

---

## 🔄 Alur Kerja Sistem

### 1. Alur Login Admin

```
User → Login Page → Input Email & Password
  ↓
Server Action (loginAction)
  ↓
Supabase Auth → Verify Credentials
  ↓
Create Session (JWT Token)
  ↓
Sync User Profile (user_profiles table)
  ↓
Redirect to Dashboard
```

### 2. Alur Tambah Mahasiswa

```
Admin → Mahasiswa Page → Click "Tambah Mahasiswa"
  ↓
Fill Form (Nama, NIM, Jurusan, dll)
  ↓
Upload Foto (Optional)
  ↓
Submit Form → Server Action (createStudentAction)
  ↓
Validate Data (NIM unique, email format, etc)
  ↓
Upload Foto to Supabase Storage
  ↓
Insert Data to mahasiswa table
  ↓
Create Student Account (student_accounts table)
  ↓
Return Success → Redirect to Mahasiswa List
```

### 3. Alur Generate KTM

```
Admin → Generate KTM Page
  ↓
Select Mahasiswa from Dropdown
  ↓
Preview KTM (Real-time)
  ↓
Click "Generate KTM"
  ↓
Render KTM Component
  ↓
Convert to Image/PDF
  ↓
Download File
```

### 4. Alur Verifikasi Mahasiswa

```
User → Verifikasi Page
  ↓
Input NIM
  ↓
Click "Verifikasi"
  ↓
Server Action (verifyStudentAction)
  ↓
Query mahasiswa table by NIM
  ↓
Return Student Data + Status
  ↓
Display Verification Result
```

---

## 🔒 Keamanan

### 1. **Authentication**
- JWT-based authentication dengan Supabase
- Secure password hashing (bcrypt)
- Session expiration (7 days default)
- Refresh token rotation

### 2. **Authorization**
- Role-based access control (RBAC)
- Middleware protection untuk routes
- Server-side permission checks
- Row Level Security (RLS) di database

### 3. **Data Protection**
- Input validation & sanitization
- SQL injection prevention (Supabase ORM)
- XSS protection (React escaping)
- CSRF protection (Next.js built-in)

### 4. **File Upload Security**
- File type validation (images only)
- File size limit (5MB)
- Secure file storage (Supabase Storage)
- Signed URLs untuk akses file

### 5. **Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🚀 Deployment

### Requirements
- Node.js 18+ 
- npm atau yarn
- Supabase account
- Vercel account (recommended)

### Environment Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd ktm-management-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local dengan credentials Supabase
```

4. **Run Database Migrations**
```bash
# Jalankan SQL files di Supabase SQL Editor:
# 1. supabase/schema.sql
# 2. supabase/add-photo-url-column.sql
```

5. **Run Development Server**
```bash
npm run dev
```

6. **Build for Production**
```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

```bash
vercel --prod
```

---

## 📊 Monitoring & Maintenance

### Logging
- Server actions logging
- Error tracking
- User activity logging
- Database query logging (Supabase Dashboard)

### Backup
- Automatic database backup (Supabase)
- Manual backup via Supabase CLI
- File storage backup

### Performance
- Next.js Image optimization
- Server-side rendering (SSR)
- Static generation untuk landing page
- Edge caching dengan Vercel

---

## 📞 Support & Contact

Untuk pertanyaan atau bantuan teknis:
- Email: support@lp3i-pekanbaru.ac.id
- Phone: (0761) 123456
- Website: https://lp3i-pekanbaru.ac.id

---

## 📝 Changelog

### Version 1.0.0 (2026)
- ✅ Initial release
- ✅ Authentication system
- ✅ Student management (CRUD)
- ✅ KTM generation with new design
- ✅ Verification system
- ✅ Admin management
- ✅ Admin profile with photo upload
- ✅ Landing page
- ✅ Dashboard with statistics

### Future Features
- 🔄 QR Code scanning untuk verifikasi
- 🔄 Batch import mahasiswa (Excel/CSV)
- 🔄 Email notifications
- 🔄 Mobile app (React Native)
- 🔄 Advanced reporting & analytics
- 🔄 Integration dengan sistem akademik

---

**Dibuat dengan ❤️ untuk Politeknik LP3I Pekanbaru**
