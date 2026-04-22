"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MahasiswaAngkatanFormValues } from "@/types/mahasiswa-angkatan";

export async function createMahasiswaAngkatan(formData: MahasiswaAngkatanFormValues) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("mahasiswa_angkatan")
      .insert([
        {
          full_name: formData.fullName,
          nim: formData.nim,
          angkatan: formData.angkatan,
          study_program: formData.studyProgram,
          address: formData.address,
          phone_number: formData.phoneNumber,
          status: formData.status,
          photo_url: formData.photoUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating mahasiswa angkatan:", error);
      return {
        success: false,
        error: "Gagal menyimpan data mahasiswa angkatan",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error creating mahasiswa angkatan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan data",
    };
  }
}

export async function getMahasiswaAngkatan() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("mahasiswa_angkatan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mahasiswa angkatan:", error);
      return {
        data: [],
        error: "Gagal mengambil data mahasiswa angkatan",
      };
    }

    const formattedData = data.map((item) => ({
      id: item.id,
      fullName: item.full_name,
      nim: item.nim,
      angkatan: item.angkatan,
      studyProgram: item.study_program,
      status: item.status,
      photoUrl: item.photo_url,
      address: item.address,
      phoneNumber: item.phone_number,
      createdAt: item.created_at,
    }));

    return {
      data: formattedData,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching mahasiswa angkatan:", error);
    return {
      data: [],
      error: "Terjadi kesalahan saat mengambil data",
    };
  }
}