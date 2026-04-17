"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getMahasiswaByNim(nim: string) {
  try {
    if (!nim || nim.trim() === "") {
      return {
        data: null,
        error: "NIM tidak boleh kosong",
      };
    }

    // Validate NIM format (should be numeric)
    if (!/^\d+$/.test(nim.trim())) {
      return {
        data: null,
        error: "NIM harus berupa angka",
      };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("nim", nim.trim())
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          data: null,
          error: "Data mahasiswa tidak ditemukan",
        };
      }
      throw error;
    }

    return {
      data: {
        id: data.id,
        nama: data.nama,
        nim: data.nim,
        jurusan: data.jurusan,
        alamat: data.alamat,
        no_hp: data.no_hp,
        foto_url: data.foto_url,
        status: data.status,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    return {
      data: null,
      error: "Terjadi kesalahan saat mengambil data mahasiswa",
    };
  }
}
