# 🎓 Sistem Manajemen Kartu Tanda Mahasiswa (KTM)

Sistem manajemen KTM digital untuk Politeknik LP3I Pekanbaru yang dibangun dengan Next.js, TypeScript, dan Supabase.

## ✨ Fitur Utama

- 🔐 **Autentikasi Admin** - Login aman dengan role-based access (Super Admin & Admin)
- 👥 **Manajemen Admin** - CRUD admin users (khusus Super Admin)
- 🎓 **Manajemen Mahasiswa** - Tambah, edit, hapus data mahasiswa
- 🖼️ **Upload Foto** - Upload foto mahasiswa ke Supabase Storage
- 🎫 **Generate KTM** - Generate kartu mahasiswa dengan QR code
- ✅ **Verifikasi KTM** - Scan QR code untuk verifikasi
- 📊 **Dashboard** - Statistik dan grafik pertumbuhan mahasiswa
- 🌐 **Landing Page** - Halaman publik untuk cek KTM dengan NIM
- 📱 **Responsive Design** - Mobile-first design dengan Tailwind CSS

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan credentials Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

SUPABASE_SUPER_ADMIN_EMAIL=admin@politeknik.ac.id
SUPABASE_SUPER_ADMIN_PASSWORD=Admin2024Secure!
SUPABASE_SUPER_ADMIN_USERNAME=admin.politeknik
```

### 3. Setup Database

Jalankan migration di Supabase Dashboard SQL Editor:

1. Buka: `https://supabase.com/dashboard/project/YOUR_PROJECT/sql`
2. Copy isi file `supabase/schema.sql`
3. Paste dan Run

### 4. Create Super Admin

```bash
npm run create:admin
```

### 5. Seed Sample Data (Optional)

```bash
npm run seed:sample-data
```

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
├── app/                    # Next.js App Router pages
│   ├── admin-management/   # Halaman manajemen admin
│   ├── dashboard/          # Dashboard admin
│   ├── generate-ktm/       # Generate KTM
│   ├── login/              # Login admin
│   ├── mahasiswa/          # CRUD mahasiswa
│   ├── settings/           # Settings
│   └── verifikasi/         # Verifikasi KTM
├── actions/                # Server actions
├── components/             # React components
│   ├── features/           # Feature-specific components
│   ├── landing/            # Landing page components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── features/               # Feature modules
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   └── supabase/           # Supabase clients
├── scripts/                # Utility scripts
├── supabase/               # Database schema & SQL
└── types/                  # TypeScript types
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database & Admin
npm run create:admin        # Create super admin
npm run fix:admin-role      # Fix admin roles
npm run seed:sample-data    # Seed sample mahasiswa data
```

## 🔑 Default Login

- **Email**: admin@politeknik.ac.id
- **Password**: Admin2024Secure!

## 🗄️ Database Schema

### Tables

- **user_profiles** - Admin user profiles dengan role (admin/super_admin)
- **mahasiswa** - Data mahasiswa (nama, NIM, jurusan, foto, status)

### Storage Buckets

- **foto-mahasiswa** - Storage untuk foto mahasiswa (max 2MB, JPEG/PNG/WebP)

## 🔐 Role-Based Access

### Super Admin
- Semua akses Admin
- Manage admin users (create, delete, change role)
- View admin list

### Admin
- Manage mahasiswa (CRUD)
- Generate KTM
- Verify KTM
- View dashboard & statistics

## 🌐 Public Routes

- `/` - Landing page dengan NIM search
- `/student/login` - Student login (future feature)

## 📝 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **QR Code**: qrcode package
- **UI Components**: Custom components with Tailwind

## 📄 License

MIT License - Politeknik LP3I Pekanbaru

## 👨‍💻 Development

Developed with ❤️ for Politeknik LP3I Pekanbaru
