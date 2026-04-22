import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import type { JurusanRecord, JurusanFormValues } from "@/types/jurusan";

export function normalizeJurusanFormValues(formData: FormData): JurusanFormValues {
  const namaJurusan = formData.get("namaJurusan");
  return {
    namaJurusan: typeof namaJurusan === "string" ? namaJurusan.trim() : "",
  };
}

export function validateJurusanFormValues(values: JurusanFormValues) {
  if (!values.namaJurusan) {
    return "Nama jurusan wajib diisi.";
  }
  if (values.namaJurusan.length < 3) {
    return "Nama jurusan minimal 3 karakter.";
  }
  if (values.namaJurusan.length > 100) {
    return "Nama jurusan maksimal 100 karakter.";
  }
  return null;
}

export async function getJurusanList() {
  noStore();

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

export async function getJurusanById(id: number) {
  noStore();

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("jurusan")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        data: null,
        error: "Jurusan tidak ditemukan.",
      };
    }

    return {
      data: {
        id: data.id,
        namaJurusan: data.nama_jurusan,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as JurusanRecord,
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: null as JurusanRecord | null,
      error: getErrorMessage(error, "Gagal memuat data jurusan."),
    };
  }
}
