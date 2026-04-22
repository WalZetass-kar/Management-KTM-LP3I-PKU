import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MahasiswaAngkatanRecord } from "@/types/mahasiswa-angkatan";

export async function getMahasiswaByAngkatan(
  angkatan: string,
  search?: string,
  jurusan?: string,
  status?: string
) {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("mahasiswa_angkatan")
      .select("*")
      .eq("angkatan", angkatan);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,nim.ilike.%${search}%`);
    }

    if (jurusan) {
      query = query.eq("study_program", jurusan);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mahasiswa by angkatan:", error);
      return {
        data: [],
        error: "Gagal mengambil data mahasiswa angkatan",
      };
    }

    const formattedData: MahasiswaAngkatanRecord[] = data.map((item) => ({
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
    console.error("Error fetching mahasiswa by angkatan:", error);
    return {
      data: [],
      error: "Terjadi kesalahan saat mengambil data",
    };
  }
}

export async function getAvailableAngkatan() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("mahasiswa_angkatan")
      .select("angkatan")
      .order("angkatan", { ascending: false });

    if (error) {
      console.error("Error fetching available angkatan:", error);
      return {
        data: ["2025", "2026", "2027"], // Default angkatan
        error: null,
      };
    }

    // Get unique angkatan values
    const uniqueAngkatan = [...new Set(data.map(item => item.angkatan))];
    
    // Add default angkatan if not present
    const defaultAngkatan = ["2023", "2024", "2025", "2026", "2027"];
    const allAngkatan = [...new Set([...uniqueAngkatan, ...defaultAngkatan])].sort((a, b) => b.localeCompare(a));

    return {
      data: allAngkatan,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching available angkatan:", error);
    return {
      data: ["2025", "2026", "2027"],
      error: null,
    };
  }
}