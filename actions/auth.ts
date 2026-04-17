"use server";

import { redirect } from "next/navigation";
import { getAuthErrorMessage, syncAuthenticatedUserProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FormActionState } from "@/types/action-state";

export async function loginAction(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")).trim() : "";
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";

  if (!email || !password) {
    return {
      status: "error",
      message: "Email dan kata sandi wajib diisi.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Login berhasil, tetapi sesi pengguna tidak ditemukan.");
    }

    const profile = await syncAuthenticatedUserProfile(data.user);

    if (!profile) {
      await supabase.auth.signOut();

      return {
        status: "error",
        message:
          "Akun berhasil ditemukan, tetapi profil admin belum siap. Pastikan tabel user_profiles dan role admin sudah terkonfigurasi.",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: getAuthErrorMessage(error, "Login gagal. Periksa kembali kredensial Anda."),
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Best effort sign-out. The redirect below still clears the current UI flow.
  }

  redirect("/login");
}
