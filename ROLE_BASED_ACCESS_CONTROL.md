# 🔐 Role-Based Access Control (RBAC) - Dokumentasi

## Overview
Sistem permission berdasarkan role untuk membatasi akses admin biasa dan memberikan full access ke super_admin.

## Roles & Permissions

### Admin (Role: `admin`)
**Akses Terbatas** - Hanya bisa manage mahasiswa dan verifikasi

| Permission | Akses | Deskripsi |
|------------|-------|-----------|
| `view_dashboard` | ✅ Yes | Lihat dashboard |
| `manage_students` | ✅ Yes | Kelola data mahasiswa |
| `verify_students` | ✅ Yes | Verifikasi mahasiswa |
| `generate_ktm` | ✅ Yes | Generate KTM |
| `view_profile` | ✅ Yes | Lihat profil sendiri |
| `manage_admins` | ❌ No | Kelola admin lain |
| `manage_jurusan` | ❌ No | Kelola jurusan |
| `manage_angkatan` | ❌ No | Kelola angkatan |
| `manage_settings` | ❌ No | Kelola settings |

**Menu yang Terlihat:**
- ✅ Dashboard
- ✅ Data Mahasiswa
- ✅ Generate KTM
- ✅ Verifikasi
- ❌ Tahun Angkatan (hidden)
- ❌ Jurusan (hidden)
- ❌ Admin Management (hidden)
- ❌ Pengaturan (hidden)

### Super Admin (Role: `super_admin`)
**Full Access** - Bisa akses semua fitur

| Permission | Akses | Deskripsi |
|------------|-------|-----------|
| `view_dashboard` | ✅ Yes | Lihat dashboard |
| `manage_students` | ✅ Yes | Kelola data mahasiswa |
| `verify_students` | ✅ Yes | Verifikasi mahasiswa |
| `generate_ktm` | ✅ Yes | Generate KTM |
| `view_profile` | ✅ Yes | Lihat profil sendiri |
| `manage_admins` | ✅ Yes | Kelola admin lain |
| `manage_jurusan` | ✅ Yes | Kelola jurusan |
| `manage_angkatan` | ✅ Yes | Kelola angkatan |
| `manage_settings` | ✅ Yes | Kelola settings |

**Menu yang Terlihat:**
- ✅ Dashboard
- ✅ Data Mahasiswa
- ✅ Tahun Angkatan
- ✅ Jurusan
- ✅ Generate KTM
- ✅ Verifikasi
- ✅ Admin Management
- ✅ Pengaturan

## Implementation

### 1. Permission Hook
**File**: `hooks/use-permissions.ts`

#### Usage:
```typescript
import { usePermissions } from "@/hooks/use-permissions";

function MyComponent() {
  const { hasPermission, isSuperAdmin, isAdmin } = usePermissions();

  if (!hasPermission("manage_admins")) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Management</div>;
}
```

#### Methods:
- `hasPermission(permission)` - Check single permission
- `hasAnyPermission([...])` - Check if has any of permissions
- `hasAllPermissions([...])` - Check if has all permissions
- `isSuperAdmin` - Boolean, true if super_admin
- `isAdmin` - Boolean, true if admin
- `role` - Current role string

### 2. Navigation Config
**File**: `lib/navigation.ts`

#### Structure:
```typescript
{
  label: "Admin Management",
  href: "/admin-management",
  description: "Kelola akun admin dan super admin sistem.",
  icon: Shield,
  permission: "manage_admins",  // ← Permission required
}
```

### 3. Sidebar Component
**File**: `components/layout/dashboard-sidebar.tsx`

#### Logic:
```typescript
const { hasPermission } = usePermissions();

// Filter menu based on permissions
const visibleItems = navigationItems.filter((item) => {
  if (!item.permission) return true;  // No permission = always visible
  return hasPermission(item.permission);
});
```

## UI Behavior

### Admin Login:
```
Sidebar Menu:
├── Dashboard ✅
├── Data Mahasiswa ✅
├── Generate KTM ✅
├── Verifikasi ✅
└── (Tahun Angkatan, Jurusan, Admin Management, Pengaturan hidden)
```

### Super Admin Login:
```
Sidebar Menu:
├── Dashboard ✅
├── Data Mahasiswa ✅
├── Tahun Angkatan ✅
├── Jurusan ✅
├── Generate KTM ✅
├── Verifikasi ✅
├── Admin Management ✅
└── Pengaturan ✅
```

## Page-Level Protection

### Protect Entire Page:
```typescript
// app/admin-management/page.tsx
import { usePermissions } from "@/hooks/use-permissions";
import { redirect } from "next/navigation";

export default function AdminManagementPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_admins")) {
    redirect("/dashboard");
  }

  return <AdminManagementPanel />;
}
```

### Protect Component:
```typescript
function DeleteButton() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_admins")) {
    return null;  // Hide button
  }

  return <Button>Delete Admin</Button>;
}
```

### Conditional Rendering:
```typescript
function SettingsPanel() {
  const { isSuperAdmin } = usePermissions();

  return (
    <div>
      <h1>Settings</h1>
      {isSuperAdmin && (
        <DangerZone />  // Only super admin can see
      )}
    </div>
  );
}
```

## Testing

### Test as Admin:
1. Login dengan role `admin`
2. **Expected**: Hanya lihat 4 menu (Dashboard, Data Mahasiswa, Generate KTM, Verifikasi)
3. **Expected**: Tidak bisa akses `/admin-management` (redirect)
4. **Expected**: Tidak bisa akses `/jurusan` (redirect)
5. **Expected**: Tidak bisa akses `/settings` (redirect)

### Test as Super Admin:
1. Login dengan role `super_admin`
2. **Expected**: Lihat semua 8 menu
3. **Expected**: Bisa akses semua halaman
4. **Expected**: Lihat semua fitur dan tombol

## Database

### Check User Role:
```sql
SELECT 
  username,
  role,
  CASE role
    WHEN 'super_admin' THEN 'Full Access'
    WHEN 'admin' THEN 'Limited Access'
  END as access_level
FROM user_profiles;
```

### Change User Role:
```sql
-- Promote admin to super_admin
UPDATE user_profiles
SET role = 'super_admin'
WHERE username = 'admin-username';

-- Demote super_admin to admin
UPDATE user_profiles
SET role = 'admin'
WHERE username = 'admin-username';
```

## Permission Matrix

| Feature | Admin | Super Admin |
|---------|-------|-------------|
| View Dashboard | ✅ | ✅ |
| Add/Edit/Delete Mahasiswa | ✅ | ✅ |
| Verify Mahasiswa | ✅ | ✅ |
| Generate KTM | ✅ | ✅ |
| Import/Export Mahasiswa | ✅ | ✅ |
| View Profile | ✅ | ✅ |
| Manage Jurusan | ❌ | ✅ |
| Manage Angkatan | ❌ | ✅ |
| Manage Admins | ❌ | ✅ |
| System Settings | ❌ | ✅ |
| Backup/Restore | ❌ | ✅ |

## Security

### Server-Side Protection:
```typescript
// actions/admin.ts
import { ensureAuthenticatedAdmin } from "@/lib/auth";

export async function deleteAdminAction(adminId: string) {
  const { user, profile } = await ensureAuthenticatedAdmin();

  // Check permission
  if (profile.role !== "super_admin") {
    return {
      status: "error",
      message: "Only super admin can delete admins",
    };
  }

  // Proceed with delete
  // ...
}
```

### Middleware Protection:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { profile } = await getAuthenticatedAdmin();

  // Protect admin-only routes
  if (request.nextUrl.pathname.startsWith("/admin-management")) {
    if (profile.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
```

## Future Enhancements

### Custom Permissions:
```typescript
// Allow granular permissions per admin
interface AdminPermissions {
  userId: string;
  permissions: Permission[];
  customPermissions?: string[];
}
```

### Permission Groups:
```typescript
const PERMISSION_GROUPS = {
  student_management: ["manage_students", "verify_students"],
  system_admin: ["manage_admins", "manage_settings"],
  master_data: ["manage_jurusan", "manage_angkatan"],
};
```

### Audit Log:
```typescript
// Log permission checks
logPermissionCheck({
  userId: user.id,
  permission: "manage_admins",
  granted: hasPermission("manage_admins"),
  timestamp: new Date(),
});
```

## Files Created/Modified

### Created:
1. ✅ `hooks/use-permissions.ts` - Permission hook

### Modified:
1. ✅ `lib/navigation.ts` - Add permission to menu items
2. ✅ `components/layout/dashboard-sidebar.tsx` - Filter menu by permission

## Kesimpulan

Sistem RBAC sekarang aktif dengan:
- ✅ **Admin**: Akses terbatas (4 menu)
- ✅ **Super Admin**: Full access (8 menu)
- ✅ **Dynamic Sidebar**: Menu auto-hide berdasarkan role
- ✅ **Permission Hook**: Easy to use di component
- ✅ **Type-Safe**: TypeScript support

**Admin biasa sekarang tidak bisa akses fitur super admin!** 🔐
