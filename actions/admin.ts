"use server";

import { revalidatePath } from "next/cache";
import { ensureAuthenticatedAdmin, getAuthErrorMessage } from "@/lib/auth";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import type { FormActionState } from "@/types/action-state";

export async function getAdminList() {
  try {
    const { profile, user } = await ensureAuthenticatedAdmin();
    const supabase = createServiceRoleSupabaseClient();
    
    // Get all user profiles with their auth data
    const { data: profiles, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profileError) {
      throw profileError;
    }

    // Get auth users to get email
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    // Merge profile data with email from auth
    const admins = profiles.map((profile) => {
      const authUser = users.find((u) => u.id === profile.id);
      return {
        id: profile.id,
        username: profile.username,
        email: authUser?.email ?? "N/A",
        role: profile.role,
        created_at: profile.created_at,
      };
    });

    return {
      data: admins,
      error: null,
      canManage: profile?.role === "super_admin",
      currentUserId: user.id,
    };
  } catch (error) {
    return {
      data: [],
      error: getAuthErrorMessage(error, "Gagal mengambil data admin."),
      canManage: false,
      currentUserId: undefined,
    };
  }
}

export async function createAdminAction(
  _: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const username = typeof formData.get("username") === "string" ? String(formData.get("username")).trim() : "";
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")).trim() : "";
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const role = typeof formData.get("role") === "string" ? String(formData.get("role")) : "admin";

  // Validation
  if (!username || !email || !password) {
    return {
      status: "error",
      message: "Semua field wajib diisi.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Password minimal 8 karakter.",
    };
  }

  if (!["admin", "super_admin"].includes(role)) {
    return {
      status: "error",
      message: "Role tidak valid.",
    };
  }

  try {
    // Ensure current user is super admin
    const { profile } = await ensureAuthenticatedAdmin();
    
    if (profile?.role !== "super_admin") {
      return {
        status: "error",
        message: "Hanya super admin yang dapat membuat akun admin baru.",
      };
    }

    const supabase = createServiceRoleSupabaseClient();

    // Create user in Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
      },
      app_metadata: {
        role,
      },
    });

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error("Gagal membuat user.");
    }

    // Insert into user_profiles (trigger should handle this, but we ensure it)
    const { error: profileError } = await supabase.from("user_profiles").upsert({
      id: userData.user.id,
      username,
      role: role as "admin" | "super_admin",
    });

    if (profileError) {
      throw profileError;
    }

    revalidatePath("/admin-management");

    return {
      status: "success",
      message: `Admin ${username} berhasil dibuat.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: getAuthErrorMessage(error, "Gagal membuat admin baru."),
    };
  }
}

export async function deleteAdminAction(adminId: string): Promise<FormActionState> {
  try {
    // Ensure current user is super admin
    const { profile, user } = await ensureAuthenticatedAdmin();
    
    if (profile?.role !== "super_admin") {
      return {
        status: "error",
        message: "Hanya super admin yang dapat menghapus akun admin.",
      };
    }

    // Prevent self-deletion
    if (user.id === adminId) {
      return {
        status: "error",
        message: "Anda tidak dapat menghapus akun Anda sendiri.",
      };
    }

    const supabase = createServiceRoleSupabaseClient();

    // Delete user from auth (cascade will delete profile)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(adminId);

    if (deleteError) {
      throw deleteError;
    }

    revalidatePath("/admin-management");

    return {
      status: "success",
      message: "Admin berhasil dihapus.",
    };
  } catch (error) {
    return {
      status: "error",
      message: getAuthErrorMessage(error, "Gagal menghapus admin."),
    };
  }
}

export async function updateAdminRoleAction(
  adminId: string,
  newRole: "admin" | "super_admin"
): Promise<FormActionState> {
  try {
    // Ensure current user is super admin
    const { profile, user } = await ensureAuthenticatedAdmin();
    
    if (profile?.role !== "super_admin") {
      return {
        status: "error",
        message: "Hanya super admin yang dapat mengubah role admin.",
      };
    }

    // Prevent changing own role
    if (user.id === adminId) {
      return {
        status: "error",
        message: "Anda tidak dapat mengubah role Anda sendiri.",
      };
    }

    const supabase = createServiceRoleSupabaseClient();

    // Update user_profiles
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ role: newRole })
      .eq("id", adminId);

    if (updateError) {
      throw updateError;
    }

    // Update app_metadata
    const { error: metadataError } = await supabase.auth.admin.updateUserById(adminId, {
      app_metadata: { role: newRole },
    });

    if (metadataError) {
      throw metadataError;
    }

    revalidatePath("/admin-management");

    return {
      status: "success",
      message: "Role admin berhasil diubah.",
    };
  } catch (error) {
    return {
      status: "error",
      message: getAuthErrorMessage(error, "Gagal mengubah role admin."),
    };
  }
}
