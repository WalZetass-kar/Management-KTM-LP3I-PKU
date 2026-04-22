import { createServerSupabaseClient } from "@/lib/supabase/server";

// Interface untuk mahasiswa (unified table)
export interface MahasiswaAngkatan {
  id: number;
  fullName: string;
  nim: string;
  angkatan: string;
  studyProgram: string;
  status: string;
  photoUrl?: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMahasiswaAngkatanData {
  fullName: string;
  nim: string;
  angkatan: string;
  studyProgram: string;
  status: string;
  photoUrl?: string;
  address: string;
  phoneNumber: string;
}

export interface UpdateMahasiswaAngkatanData extends CreateMahasiswaAngkatanData {
  id: number;
}

export async function getMahasiswaByAngkatan(angkatan: string): Promise<{ data: MahasiswaAngkatan[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Sekarang query dari tabel mahasiswa saja
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("angkatan", angkatan)
      .order("nama", { ascending: true });

    if (error) {
      console.error("Error fetching mahasiswa by angkatan:", error);
      return { data: [], error: error.message };
    }

    // Transform database fields to camelCase
    const transformedData = (data || []).map(item => ({
      id: item.id,
      fullName: item.nama,
      nim: item.nim,
      angkatan: item.angkatan,
      studyProgram: item.jurusan,
      status: item.status,
      photoUrl: item.foto_url,
      address: item.alamat,
      phoneNumber: item.no_hp,
      createdAt: item.created_at,
      updatedAt: item.updated_at || item.created_at,
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in getMahasiswaByAngkatan:", error);
    return { data: [], error: "Gagal mengambil data mahasiswa angkatan" };
  }
}

export async function getAvailableAngkatan(): Promise<{ data: string[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Query dari tabel mahasiswa
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("angkatan")
      .order("angkatan", { ascending: false });

    if (error) {
      console.error("Error fetching available angkatan:", error);
      return { data: [], error: error.message };
    }

    // Get unique angkatan values
    const uniqueAngkatan = [...new Set((data || []).map(item => item.angkatan))];

    return { data: uniqueAngkatan, error: null };
  } catch (error) {
    console.error("Error in getAvailableAngkatan:", error);
    return { data: [], error: "Gagal mengambil data angkatan" };
  }
}

export async function getAllMahasiswaAngkatan(): Promise<{ data: MahasiswaAngkatan[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Query dari tabel mahasiswa
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all mahasiswa angkatan:", error);
      return { data: [], error: error.message };
    }

    // Transform database fields to camelCase
    const transformedData = (data || []).map(item => ({
      id: item.id,
      fullName: item.nama,
      nim: item.nim,
      angkatan: item.angkatan,
      studyProgram: item.jurusan,
      status: item.status,
      photoUrl: item.foto_url,
      address: item.alamat,
      phoneNumber: item.no_hp,
      createdAt: item.created_at,
      updatedAt: item.updated_at || item.created_at,
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in getAllMahasiswaAngkatan:", error);
    return { data: [], error: "Gagal mengambil data mahasiswa angkatan" };
  }
}

export async function getMahasiswaAngkatanById(id: number): Promise<{ data: MahasiswaAngkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Query dari tabel mahasiswa
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching mahasiswa angkatan by id:", error);
      return { data: null, error: error.message };
    }

    // Transform database fields to camelCase
    const transformedData = {
      id: data.id,
      fullName: data.nama,
      nim: data.nim,
      angkatan: data.angkatan,
      studyProgram: data.jurusan,
      status: data.status,
      photoUrl: data.foto_url,
      address: data.alamat,
      phoneNumber: data.no_hp,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in getMahasiswaAngkatanById:", error);
    return { data: null, error: "Gagal mengambil data mahasiswa angkatan" };
  }
}

export async function createMahasiswaAngkatan(mahasiswaData: CreateMahasiswaAngkatanData): Promise<{ data: MahasiswaAngkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Transform camelCase to snake_case for database (tabel mahasiswa)
    const dbData = {
      nama: mahasiswaData.fullName,
      nim: mahasiswaData.nim,
      angkatan: mahasiswaData.angkatan,
      jurusan: mahasiswaData.studyProgram,
      status: mahasiswaData.status,
      foto_url: mahasiswaData.photoUrl,
      alamat: mahasiswaData.address,
      no_hp: mahasiswaData.phoneNumber,
    };

    const { data, error } = await supabase
      .from("mahasiswa")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("Error creating mahasiswa angkatan:", error);
      return { data: null, error: error.message };
    }

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      fullName: data.nama,
      nim: data.nim,
      angkatan: data.angkatan,
      studyProgram: data.jurusan,
      status: data.status,
      photoUrl: data.foto_url,
      address: data.alamat,
      phoneNumber: data.no_hp,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in createMahasiswaAngkatan:", error);
    return { data: null, error: "Gagal membuat mahasiswa angkatan baru" };
  }
}

export async function updateMahasiswaAngkatan(mahasiswaData: UpdateMahasiswaAngkatanData): Promise<{ data: MahasiswaAngkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Transform camelCase to snake_case for database (tabel mahasiswa)
    const dbData = {
      nama: mahasiswaData.fullName,
      nim: mahasiswaData.nim,
      angkatan: mahasiswaData.angkatan,
      jurusan: mahasiswaData.studyProgram,
      status: mahasiswaData.status,
      foto_url: mahasiswaData.photoUrl,
      alamat: mahasiswaData.address,
      no_hp: mahasiswaData.phoneNumber,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("mahasiswa")
      .update(dbData)
      .eq("id", mahasiswaData.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating mahasiswa angkatan:", error);
      return { data: null, error: error.message };
    }

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      fullName: data.nama,
      nim: data.nim,
      angkatan: data.angkatan,
      studyProgram: data.jurusan,
      status: data.status,
      photoUrl: data.foto_url,
      address: data.alamat,
      phoneNumber: data.no_hp,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in updateMahasiswaAngkatan:", error);
    return { data: null, error: "Gagal memperbarui mahasiswa angkatan" };
  }
}

export async function deleteMahasiswaAngkatan(id: number): Promise<{ error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Delete dari tabel mahasiswa
    const { error } = await supabase
      .from("mahasiswa")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting mahasiswa angkatan:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Error in deleteMahasiswaAngkatan:", error);
    return { error: "Gagal menghapus mahasiswa angkatan" };
  }
}