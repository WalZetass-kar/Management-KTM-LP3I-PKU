# 🗄️ Database Schema

## Files

- **schema.sql** - Main database schema (tables, policies, functions)

## Setup

### 1. Run Migration

Copy `schema.sql` content to Supabase Dashboard SQL Editor and run:

```
https://supabase.com/dashboard/project/YOUR_PROJECT/sql
```

### 2. Verify Tables

Check that these tables exist:
- `user_profiles` - Admin users
- `mahasiswa` - Student data

### 3. Verify Storage

Check that this bucket exists:
- `foto-mahasiswa` - Student photos (public, max 2MB)

## Schema Overview

### user_profiles
```sql
- id (uuid, FK to auth.users)
- username (text, unique)
- role (text: 'admin' | 'super_admin')
- created_at (timestamptz)
```

### mahasiswa
```sql
- id (bigint, auto-increment)
- nama (text)
- nim (text, unique)
- jurusan (text)
- alamat (text)
- no_hp (text)
- foto_url (text, nullable)
- status (text: 'Aktif' | 'Menunggu')
- created_at (timestamptz)
```

## Row Level Security (RLS)

All tables have RLS enabled with policies:
- Admins can read all data
- Super admins can manage admin users
- Admins can manage mahasiswa data

## Functions

- `handle_new_user()` - Auto-create profile on user signup
- `is_admin_user()` - Check if user is admin or super_admin
- `is_super_admin_user()` - Check if user is super_admin
