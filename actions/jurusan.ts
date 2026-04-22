"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureAuthenticatedAdmin } from "@/lib/auth";
import { normalizeJurusanFormValues, validateJurusanFormValues } from "@/lib/jurusan";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import type { FormActionState } from "@/types/action-state";
import type { JurusanRecord } from "@/types/jurusan";

function revalidateJurusanRoutes() {
  revalidatePath("/jurusan");
  revalidatePath("/mahasiswa");
  revalidatePath("/dashboard");
}

export async function getJurusan() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("jurusan")
      .select("*")
      .order("nama_jurusan", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      data: (data || []).map((row): JurusanRecord => ({
        id: row.id,
        namaJurusan: row.nama_jurusan,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: [] as JurusanRecord[],
      error: getErrorMessage(error, "Gagal memuat data jurusan dari Supabase."),
    };
  }
}

export async function createJurusanAction(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const values = normalizeJurusanFormValues(formData);
  const validationMessage = validateJurusanFormValues(values);

  if (validationMessage) {
    return { status: "error", message: validationMessage };
  }

  try {
    await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("jurusan").insert({
      nama_jurusan: values.namaJurusan,
    });

    if (error) {
      if (error.code === "23505") {
        return { status: "error", message: "Nama jurusan sudah ada." };
      }
      throw error;
    }

    revalidateJurusanRoutes();
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error, "Gagal menambahkan jurusan ke Supabase."),
    };
  }

  redirect("/jurusan?status=created");
}

export async function updateJurusanAction(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const rawId = formData.get("id");
  const jurusanId = Number(rawId);

  if (!Number.isFinite(jurusanId)) {
    return { status: "error", message: "ID jurusan tidak valid." };
  }

  const values = normalizeJurusanFormValues(formData);
  const validationMessage = validateJurusanFormValues(values);

  if (validationMessage) {
    return { status: "error", message: validationMessage };
  }

  try {
    await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("jurusan")
      .update({
        nama_jurusan: values.namaJurusan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jurusanId);

    if (error) {
      if (error.code === "23505") {
        return { status: "error", message: "Nama jurusan sudah ada." };
      }
      throw error;
    }

    revalidateJurusanRoutes();
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error, "Gagal memperbarui data jurusan."),
    };
  }

  redirect("/jurusan?status=updated");
}

export async function deleteJurusanAction(jurusanId: number) {
  try {
    await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();

    // Cek apakah jurusan masih digunakan oleh mahasiswa
    const { count, error: countError } = await supabase
      .from("mahasiswa")
      .select("id", { count: "exact", head: true })
      .eq("jurusan_id", jurusanId);

    if (countError) {
      throw countError;
    }

    if (count && count > 0) {
      return {
        status: "error" as const,
        message: "Jurusan tidak dapat dihapus karena masih digunakan oleh mahasiswa.",
      };
    }

    const { error } = await supabase.from("jurusan").delete().eq("id", jurusanId);

    if (error) {
      throw error;
    }

    revalidateJurusanRoutes();

    return {
      status: "success" as const,
      message: "Jurusan berhasil dihapus.",
    };
  } catch (error) {
    return {
      status: "error" as const,
      message: getErrorMessage(error, "Gagal menghapus jurusan."),
    };
  }
}
