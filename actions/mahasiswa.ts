"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureAuthenticatedAdmin } from "@/lib/auth";
import {
  buildMahasiswaInsert,
  buildMahasiswaUpdate,
  deleteStudentPhoto,
  normalizeStudentFormValues,
  readStudentPhoto,
  uploadStudentPhoto,
  validateStudentFormValues,
  validateStudentPhoto,
} from "@/lib/mahasiswa";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import type { FormActionState } from "@/types/action-state";

function parseStudentId(formData: FormData) {
  const rawId = formData.get("id");
  const studentId = Number(rawId);
  return Number.isFinite(studentId) ? studentId : null;
}

function revalidateMahasiswaRoutes() {
  revalidatePath("/mahasiswa");
  revalidatePath("/generate-ktm");
  revalidatePath("/verifikasi");
  revalidatePath("/supabase-test");
}

export async function createMahasiswaAction(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const values = normalizeStudentFormValues(formData);
  const validationMessage = validateStudentFormValues(values);
  const photo = readStudentPhoto(formData);
  const photoValidationMessage = validateStudentPhoto(photo);

  if (validationMessage) {
    return { status: "error", message: validationMessage };
  }

  if (photoValidationMessage) {
    return { status: "error", message: photoValidationMessage };
  }

  try {
    const { user } = await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();
    const photoUrl = photo ? await uploadStudentPhoto(supabase, user.id, photo) : null;

    const { error } = await supabase.from("mahasiswa").insert(buildMahasiswaInsert(values, photoUrl));

    if (error) {
      throw error;
    }

    revalidateMahasiswaRoutes();
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error, "Gagal menambahkan mahasiswa ke Supabase."),
    };
  }

  redirect("/mahasiswa?status=created");
}

export async function updateMahasiswaAction(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const studentId = parseStudentId(formData);
  const values = normalizeStudentFormValues(formData);
  const validationMessage = validateStudentFormValues(values);
  const photo = readStudentPhoto(formData);
  const photoValidationMessage = validateStudentPhoto(photo);

  if (!studentId) {
    return { status: "error", message: "ID mahasiswa tidak valid." };
  }

  if (validationMessage) {
    return { status: "error", message: validationMessage };
  }

  if (photoValidationMessage) {
    return { status: "error", message: photoValidationMessage };
  }

  try {
    const { user } = await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();
    const { data: existingStudent, error: existingStudentError } = await supabase
      .from("mahasiswa")
      .select("foto_url")
      .eq("id", studentId)
      .maybeSingle();

    if (existingStudentError) {
      throw existingStudentError;
    }

    const nextPhotoUrl = photo
      ? await uploadStudentPhoto(supabase, user.id, photo)
      : existingStudent?.foto_url ?? null;

    const { error } = await supabase
      .from("mahasiswa")
      .update(buildMahasiswaUpdate(values, nextPhotoUrl))
      .eq("id", studentId);

    if (error) {
      throw error;
    }

    if (photo && existingStudent?.foto_url && existingStudent.foto_url !== nextPhotoUrl) {
      await deleteStudentPhoto(supabase, existingStudent.foto_url);
    }

    revalidateMahasiswaRoutes();
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error, "Gagal memperbarui data mahasiswa."),
    };
  }

  redirect("/mahasiswa?status=updated");
}

export async function deleteMahasiswaAction(studentId: number) {
  try {
    await ensureAuthenticatedAdmin();
    const supabase = await createServerSupabaseClient();

    const { data: existingStudent, error: existingStudentError } = await supabase
      .from("mahasiswa")
      .select("foto_url")
      .eq("id", studentId)
      .maybeSingle();

    if (existingStudentError) {
      throw existingStudentError;
    }

    const { error } = await supabase.from("mahasiswa").delete().eq("id", studentId);

    if (error) {
      throw error;
    }

    if (existingStudent?.foto_url) {
      await deleteStudentPhoto(supabase, existingStudent.foto_url);
    }

    revalidateMahasiswaRoutes();

    return {
      status: "success" as const,
      message: "Data mahasiswa berhasil dihapus.",
    };
  } catch (error) {
    return {
      status: "error" as const,
      message: getErrorMessage(error, "Gagal menghapus data mahasiswa."),
    };
  }
}
