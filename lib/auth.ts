import type { User } from "@supabase/supabase-js";
import { deriveAdminProfileFromUser, isAdminRole } from "@/lib/auth-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { getErrorMessage } from "@/lib/utils";
import type { Database } from "@/types/supabase";

export interface AuthSessionSnapshot {
  accessToken: string;
  expiresAt: number | null;
  userId: string;
}

export type AuthenticatedAdminProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export interface AuthenticatedAdmin {
  user: User;
  profile: AuthenticatedAdminProfile;
}

async function readUserProfile(userId: string) {
  try {
    const supabaseAdmin = createServiceRoleSupabaseClient();
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }
}

export async function syncAuthenticatedUserProfile(user: User) {
  const metadataProfile = deriveAdminProfileFromUser(user);
  const existingProfile = await readUserProfile(user.id);

  if (existingProfile && !metadataProfile) {
    return existingProfile;
  }

  if (existingProfile && metadataProfile) {
    if (
      existingProfile.username === metadataProfile.username &&
      existingProfile.role === metadataProfile.role
    ) {
      return existingProfile;
    }

    try {
      const supabaseAdmin = createServiceRoleSupabaseClient();
      const { data, error } = await supabaseAdmin
        .from("user_profiles")
        .update(metadataProfile)
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch {
      return existingProfile;
    }
  }

  if (!metadataProfile) {
    return null;
  }

  try {
    const supabaseAdmin = createServiceRoleSupabaseClient();
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: user.id,
        username: metadataProfile.username,
        role: metadataProfile.role,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    return {
      accessToken: session.access_token,
      expiresAt: session.expires_at ?? null,
      userId: session.user.id,
    } satisfies AuthSessionSnapshot;
  } catch {
    return null;
  }
}

export async function getCurrentUserProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    return await syncAuthenticatedUserProfile(user);
  } catch {
    return null;
  }
}

export async function ensureAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Sesi Anda tidak ditemukan. Silakan login kembali.");
  }

  const profile = await getCurrentUserProfile();

  if (!profile || !isAdminRole(profile.role)) {
    throw new Error("Akun ini tidak memiliki izin admin untuk mengelola data mahasiswa.");
  }

  return { user, profile };
}

export function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  return getErrorMessage(error, fallbackMessage);
}
