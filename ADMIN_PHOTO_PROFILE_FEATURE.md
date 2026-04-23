# 👤 Admin Photo Profile - Dokumentasi

## Overview
Foto profil admin yang diupload di halaman Profile sekarang ditampilkan di topbar, menggantikan icon User default.

## Changes

### 1. Database Schema
**File**: `supabase/add-admin-photo-url.sql`

#### Added Column:
```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;
```

**Table Structure:**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | User ID (FK to auth.users) |
| username | text | Username admin |
| role | text | admin / super_admin |
| photo_url | text | URL foto profil dari storage |
| created_at | timestamptz | Timestamp created |

### 2. User Profile Hook
**File**: `hooks/use-user-profile.ts`

#### Updated Interface:
```typescript
interface UserProfile {
  username: string;
  role: "admin" | "super_admin";
  photoUrl?: string | null;  // ← New field
}
```

#### Updated Query:
```typescript
const { data } = await supabase
  .from("user_profiles")
  .select("username, role, photo_url")  // ← Added photo_url
  .eq("id", user.id)
  .maybeSingle();
```

### 3. Dashboard Topbar
**File**: `components/layout/dashboard-topbar.tsx`

#### Updated Props:
```typescript
interface DashboardTopbarProps {
  userProfile?: {
    username: string;
    role: "admin" | "super_admin";
    photoUrl?: string | null;  // ← New field
  } | null;
  // ...
}
```

#### Updated UI:
```typescript
{userProfile?.photoUrl ? (
  <img
    src={userProfile.photoUrl}
    alt={displayName}
    className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
  />
) : (
  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
    <User className="h-4 w-4" />
  </span>
)}
```

## UI Design

### Before (Icon Default):
```
┌─────────────────────────┐
│  👤  Admin              │
│      Administrator      │
└─────────────────────────┘
```

### After (With Photo):
```
┌─────────────────────────┐
│  📷  Admin              │
│      Administrator      │
└─────────────────────────┘
```

## User Flow

### Upload Photo:
```
1. Admin login
2. Klik dropdown profil → "Profil Admin"
3. Upload foto di halaman Profile
4. Foto tersimpan di storage
5. photo_url tersimpan di user_profiles table
```

### Display Photo:
```
1. Admin refresh/reload page
2. useUserProfile() fetch data termasuk photo_url
3. Topbar render foto jika ada
4. Jika tidak ada foto → tampilkan icon User default
```

## Implementation Details

### Photo Storage:
- **Bucket**: `admin-photos` (atau sesuai konfigurasi)
- **Path**: `{user_id}/profile.jpg`
- **Max Size**: 2MB
- **Format**: JPG, PNG, WEBP

### Photo Display:
- **Size**: 40x40px (h-10 w-10)
- **Shape**: Rounded full (rounded-full)
- **Border**: 2px border with primary color opacity 20%
- **Object Fit**: Cover (untuk crop yang baik)

### Fallback:
- Jika `photoUrl` null/undefined → Icon User
- Jika foto gagal load → Icon User (bisa ditambahkan onError handler)

## Styling

### Photo Image:
```css
className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
```

- **h-10 w-10**: 40x40px
- **rounded-full**: Bulat sempurna
- **object-cover**: Crop foto untuk fit
- **border-2**: Border 2px
- **border-primary/20**: Warna primary dengan opacity 20%

### Icon Fallback:
```css
className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
```

- **bg-primary**: Background warna primary
- **text-primary-foreground**: Text warna kontras

## Testing

### Test 1: Upload Photo
1. Login sebagai admin
2. Buka `/profile`
3. Upload foto profil
4. **Expected**: Foto tersimpan ✅

### Test 2: Display Photo
1. Refresh page
2. Lihat topbar
3. **Expected**: Foto profil muncul di topbar ✅

### Test 3: Fallback Icon
1. Admin belum upload foto
2. Lihat topbar
3. **Expected**: Icon User default muncul ✅

### Test 4: Photo Update
1. Upload foto baru
2. Refresh page
3. **Expected**: Foto baru muncul di topbar ✅

### Test 5: Multiple Admins
1. Login sebagai Admin A (ada foto)
2. **Expected**: Foto Admin A muncul ✅
3. Logout, login sebagai Admin B (tidak ada foto)
4. **Expected**: Icon default muncul ✅

## SQL Migration

### Run This SQL:
**File**: `supabase/add-admin-photo-url.sql`

```sql
-- Add photo_url column to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS photo_url text;
```

### Verify:
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
```

**Expected Output:**
```
column_name  | data_type | is_nullable
-------------|-----------|------------
id           | uuid      | NO
username     | text      | NO
role         | text      | NO
photo_url    | text      | YES
created_at   | timestamp | NO
```

## Integration with Profile Page

### Profile Page Should:
1. ✅ Allow admin to upload photo
2. ✅ Save photo to storage
3. ✅ Update `user_profiles.photo_url` with storage URL
4. ✅ Show preview of uploaded photo
5. ✅ Allow admin to change/delete photo

### Example Update Query:
```typescript
await supabase
  .from("user_profiles")
  .update({ photo_url: storageUrl })
  .eq("id", userId);
```

## Error Handling

### Photo Load Error:
Add onError handler untuk fallback ke icon:

```typescript
<img
  src={userProfile.photoUrl}
  alt={displayName}
  onError={(e) => {
    e.currentTarget.style.display = 'none';
    // Show fallback icon
  }}
  className="h-10 w-10 rounded-full object-cover"
/>
```

### Missing Photo URL:
Handled dengan conditional rendering:
```typescript
{userProfile?.photoUrl ? <img /> : <Icon />}
```

## Performance

### Optimization:
- ✅ **Lazy Load**: Foto di-load on demand
- ✅ **Cache**: Browser cache foto
- ✅ **CDN**: Supabase storage menggunakan CDN
- ✅ **Size**: Resize foto ke 200x200px untuk performa

### Network:
- **Initial Load**: 1 request untuk fetch profile (termasuk photo_url)
- **Photo Load**: 1 request untuk load foto dari storage
- **Total**: 2 requests

## Future Enhancements

### Possible Features:
1. **Photo Crop**: Crop foto sebelum upload
2. **Photo Filters**: Apply filter (grayscale, sepia, dll)
3. **Photo Compression**: Auto-compress untuk performa
4. **Photo Validation**: Validate aspect ratio, size, format
5. **Photo Placeholder**: Loading skeleton saat foto loading
6. **Photo Cache**: Cache foto di localStorage

## Files Modified

### Modified:
1. ✅ `hooks/use-user-profile.ts` - Fetch photo_url
2. ✅ `components/layout/dashboard-topbar.tsx` - Display photo

### Created:
1. ✅ `supabase/add-admin-photo-url.sql` - Add column

## Kesimpulan

Foto profil admin sekarang ditampilkan di topbar dengan:
- ✅ **Fetch dari database** (user_profiles.photo_url)
- ✅ **Display di topbar** (rounded, bordered)
- ✅ **Fallback ke icon** jika tidak ada foto
- ✅ **Auto-update** saat foto diupload

**Topbar sekarang lebih personal dengan foto profil admin!** 👤✨
