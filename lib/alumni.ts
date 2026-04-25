import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AlumniStats {
  totalAlumni: number;
  bekerja: number;
  belumBekerja: number;
  tahunIni: number;
}

export interface AlumniRecord {
  id: number;
  fullName: string;
  nim: string;
  studyProgram: string;
  graduationYear: string;
  currentJob?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  photoUrl?: string | null;
}

export async function getAlumniStats(): Promise<{ data: AlumniStats; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { count: totalCount, error: totalError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Lulus");

    if (totalError) throw totalError;

    const { count: bekerjaCount, error: bekerjaError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Lulus")
      .not("pekerjaan_saat_ini", "is", null);

    if (bekerjaError) throw bekerjaError;

    const currentYear = new Date().getFullYear().toString();
    const { count: tahunIniCount, error: tahunIniError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Lulus")
      .eq("tahun_lulus", currentYear);

    if (tahunIniError) throw tahunIniError;

    return {
      data: {
        totalAlumni: totalCount ?? 0,
        bekerja: bekerjaCount ?? 0,
        belumBekerja: (totalCount ?? 0) - (bekerjaCount ?? 0),
        tahunIni: tahunIniCount ?? 0,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching alumni stats:", error);
    return {
      data: {
        totalAlumni: 0,
        bekerja: 0,
        belumBekerja: 0,
        tahunIni: 0,
      },
      error: "Gagal mengambil statistik alumni",
    };
  }
}

export async function getAlumniList(): Promise<{ data: AlumniRecord[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("status", "Lulus")
      .order("tahun_lulus", { ascending: false });

    if (error) throw error;

    const alumni = (data || []).map((item) => ({
      id: item.id,
      fullName: item.nama,
      nim: item.nim,
      studyProgram: item.jurusan ?? "",
      graduationYear: item.tahun_lulus ?? (item.angkatan ? (parseInt(item.angkatan) + 3).toString() : ""),
      currentJob: item.pekerjaan_saat_ini,
      currentCompany: item.perusahaan_saat_ini,
      location: item.lokasi_saat_ini,
      photoUrl: item.foto_url,
    }));

    return { data: alumni, error: null };
  } catch (error) {
    console.error("Error fetching alumni list:", error);
    return { data: [], error: "Gagal mengambil data alumni" };
  }
}
