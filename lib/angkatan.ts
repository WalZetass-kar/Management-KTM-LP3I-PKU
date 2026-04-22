import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Angkatan, CreateAngkatanData, UpdateAngkatanData } from "@/types/angkatan";

export async function getAngkatanList(): Promise<{ data: Angkatan[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("angkatan")
      .select("*")
      .order("tahun", { ascending: false });

    if (error) {
      console.error("Error fetching angkatan:", error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getAngkatanList:", error);
    return { data: [], error: "Gagal mengambil data angkatan" };
  }
}

export async function getActiveAngkatanList(): Promise<{ data: Angkatan[]; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("angkatan")
      .select("*")
      .eq("status", "Aktif")
      .order("tahun", { ascending: false });

    if (error) {
      console.error("Error fetching active angkatan:", error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getActiveAngkatanList:", error);
    return { data: [], error: "Gagal mengambil data angkatan aktif" };
  }
}

export async function getAngkatanById(id: number): Promise<{ data: Angkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("angkatan")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching angkatan by id:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getAngkatanById:", error);
    return { data: null, error: "Gagal mengambil data angkatan" };
  }
}

export async function createAngkatan(angkatanData: CreateAngkatanData): Promise<{ data: Angkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("angkatan")
      .insert([angkatanData])
      .select()
      .single();

    if (error) {
      console.error("Error creating angkatan:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in createAngkatan:", error);
    return { data: null, error: "Gagal membuat angkatan baru" };
  }
}

export async function updateAngkatan(angkatanData: UpdateAngkatanData): Promise<{ data: Angkatan | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("angkatan")
      .update({
        tahun: angkatanData.tahun,
        nama_angkatan: angkatanData.nama_angkatan,
        status: angkatanData.status,
        keterangan: angkatanData.keterangan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", angkatanData.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating angkatan:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in updateAngkatan:", error);
    return { data: null, error: "Gagal memperbarui angkatan" };
  }
}

export async function deleteAngkatan(id: number): Promise<{ error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if angkatan is being used by any mahasiswa
    const angkatanData = await getAngkatanById(id);
    if (angkatanData.error || !angkatanData.data) {
      return { error: "Angkatan tidak ditemukan" };
    }

    const { count, error: countError } = await supabase
      .from("mahasiswa")
      .select("id", { count: "exact", head: true })
      .eq("angkatan", angkatanData.data.tahun);

    if (countError) {
      console.error("Error checking mahasiswa count:", countError);
      return { error: "Gagal memeriksa penggunaan angkatan" };
    }

    if (count && count > 0) {
      return { error: "Angkatan tidak dapat dihapus karena masih digunakan oleh mahasiswa" };
    }

    const { error } = await supabase
      .from("angkatan")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting angkatan:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Error in deleteAngkatan:", error);
    return { error: "Gagal menghapus angkatan" };
  }
}