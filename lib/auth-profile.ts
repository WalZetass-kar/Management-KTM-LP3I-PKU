import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export type AdminRole = Database["public"]["Tables"]["user_profiles"]["Row"]["role"];

export interface AdminProfileSeed {
  role: AdminRole;
  username: string;
}

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "admin" || value === "super_admin";
}

export function getDefaultUsername(email: string | null | undefined) {
  if (!email) {
    return "admin";
  }

  return email.split("@")[0] || "admin";
}

export function deriveAdminProfileFromUser(
  user: Pick<User, "email" | "app_metadata" | "user_metadata"> | null | undefined,
): AdminProfileSeed | null {
  if (!user) {
    return null;
  }

  const role = user.app_metadata?.role;

  if (!isAdminRole(role)) {
    return null;
  }

  const username =
    typeof user.user_metadata?.username === "string" && user.user_metadata.username.trim()
      ? user.user_metadata.username.trim()
      : getDefaultUsername(user.email);

  return {
    username,
    role,
  };
}
