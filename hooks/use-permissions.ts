import { useUserProfile } from "@/hooks/use-user-profile";

export type Permission = 
  | "view_dashboard"
  | "manage_students"
  | "verify_students"
  | "generate_ktm"
  | "manage_admins"
  | "manage_jurusan"
  | "manage_angkatan"
  | "manage_settings"
  | "view_profile";

const ROLE_PERMISSIONS: Record<"admin" | "super_admin", Permission[]> = {
  admin: [
    "view_dashboard",
    "manage_students",
    "verify_students",
    "generate_ktm",
    "view_profile",
  ],
  super_admin: [
    "view_dashboard",
    "manage_students",
    "verify_students",
    "generate_ktm",
    "manage_admins",
    "manage_jurusan",
    "manage_angkatan",
    "manage_settings",
    "view_profile",
  ],
};

export function usePermissions() {
  const { profile, isLoading } = useUserProfile();

  const hasPermission = (permission: Permission): boolean => {
    if (!profile) return false;
    
    // Normalize role to lowercase for comparison
    const normalizedRole = profile.role?.toLowerCase().replace(/\s+/g, '_') as "admin" | "super_admin";
    
    const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // Normalize role for comparison
  const normalizedRole = profile?.role?.toLowerCase().replace(/\s+/g, '_');
  const isSuperAdmin = normalizedRole === "super_admin";
  const isAdmin = normalizedRole === "admin";

  // Debug log
  if (typeof window !== "undefined" && profile) {
    console.log("User role (original):", profile.role);
    console.log("User role (normalized):", normalizedRole);
    console.log("User permissions:", ROLE_PERMISSIONS[normalizedRole as "admin" | "super_admin"] || []);
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    isAdmin,
    role: profile?.role,
    isLoading,
  };
}
