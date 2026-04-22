import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import type { Database } from "@/types/supabase";
import type { StudentFormValues, StudentRecord } from "@/types/student";

const FOTO_BUCKET = "foto-mahasiswa";
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type MahasiswaRow = Database["public"]["Tables"]["mahasiswa"]["Row"];
type MahasiswaInsert = Database["public"]["Tables"]["mahasiswa"]["Insert"];
type MahasiswaUpdate = Database["public"]["Tables"]["mahasiswa"]["Update"];

export function mapMahasiswaRowToStudentRecord(row: MahasiswaRow): StudentRecord {
  return {
    id: row.id,
    fullName: row.nama,
    nim: row.nim,
    studyProgram: row.jurusan,
    address: row.alamat,
    phoneNumber: row.no_hp,
    photoUrl: row.foto_url,
    status: row.status,
    angkatan: row.angkatan || undefined,
    createdAt: row.created_at,
  };
}

export function mapStudentToFormValues(student: StudentRecord): StudentFormValues {
  return {
    fullName: student.fullName,
    nim: student.nim,
    studyProgram: student.studyProgram,
    address: student.address,
    phoneNumber: student.phoneNumber,
    status: student.status,
    angkatan: student.angkatan || "2025",
  };
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeStudentFormValues(formData: FormData): StudentFormValues {
  const status = readString(formData, "status");

  return {
    fullName: readString(formData, "fullName"),
    nim: readString(formData, "nim"),
    studyProgram: readString(formData, "studyProgram"),
    address: readString(formData, "address"),
    phoneNumber: readString(formData, "phoneNumber"),
    status: status === "Aktif" ? "Aktif" : "Menunggu",
    angkatan: readString(formData, "angkatan") || "2025",
  };
}

export function validateStudentFormValues(values: StudentFormValues) {
  if (!values.fullName) {
    return "Nama lengkap wajib diisi.";
  }
  if (!values.nim) {
    return "NIM wajib diisi.";
  }
  if (!values.studyProgram) {
    return "Jurusan wajib dipilih.";
  }
  if (!values.address) {
    return "Alamat wajib diisi.";
  }
  if (!values.phoneNumber) {
    return "Nomor HP wajib diisi.";
  }
  if (!/^\d{10,13}$/.test(values.phoneNumber)) {
    return "Nomor HP harus terdiri dari 10 sampai 13 digit.";
  }

  return null;
}

export function readStudentPhoto(formData: FormData) {
  const value = formData.get("photo");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getFileExtension(file: File) {
  const filenameExtension = file.name.split(".").pop()?.toLowerCase();

  if (filenameExtension) {
    return filenameExtension;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function validateStudentPhoto(file: File | null) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Foto mahasiswa harus berformat JPG, PNG, atau WEBP.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "Ukuran foto mahasiswa maksimal 2MB.";
  }

  return null;
}

export async function uploadStudentPhoto(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
) {
  const fileExtension = getFileExtension(file);
  const objectPath = `${userId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(FOTO_BUCKET).upload(objectPath, fileBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal mengunggah foto mahasiswa: ${error.message}`);
  }

  const { data } = supabase.storage.from(FOTO_BUCKET).getPublicUrl(objectPath);

  return data.publicUrl;
}

export function extractStoragePathFromPublicUrl(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${FOTO_BUCKET}/`;

    if (!url.pathname.includes(marker)) {
      return null;
    }

    const objectPath = url.pathname.split(marker)[1];
    return objectPath ? decodeURIComponent(objectPath) : null;
  } catch {
    return null;
  }
}

export async function deleteStudentPhoto(
  supabase: SupabaseClient<Database>,
  publicUrl: string | null,
) {
  if (!publicUrl) {
    return;
  }

  const objectPath = extractStoragePathFromPublicUrl(publicUrl);

  if (!objectPath) {
    return;
  }

  const { error } = await supabase.storage.from(FOTO_BUCKET).remove([objectPath]);

  if (error) {
    throw new Error(`Data mahasiswa terhapus, tetapi file foto gagal dibersihkan: ${error.message}`);
  }
}

export function buildMahasiswaInsert(values: StudentFormValues, photoUrl: string | null): MahasiswaInsert {
  return {
    nama: values.fullName,
    nim: values.nim,
    jurusan: values.studyProgram,
    alamat: values.address,
    no_hp: values.phoneNumber,
    foto_url: photoUrl,
    status: values.status,
    angkatan: values.angkatan,
    // Foreign keys will be auto-synced by trigger
  };
}

export function buildMahasiswaUpdate(values: StudentFormValues, photoUrl: string | null): MahasiswaUpdate {
  return {
    nama: values.fullName,
    nim: values.nim,
    jurusan: values.studyProgram,
    alamat: values.address,
    no_hp: values.phoneNumber,
    foto_url: photoUrl,
    status: values.status,
    angkatan: values.angkatan,
    // Foreign keys will be auto-synced by trigger
  };
}

export async function getMahasiswaList() {
  noStore();

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: data.map(mapMahasiswaRowToStudentRecord),
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: [] as StudentRecord[],
      error: getErrorMessage(error, "Gagal memuat data mahasiswa dari Supabase."),
    };
  }
}

export async function getMahasiswaByFilter(filters: {
  angkatan?: string;
  search?: string;
  jurusan?: string;
}) {
  noStore();

  try {
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from("mahasiswa")
      .select("*");

    // Apply filters
    if (filters.angkatan) {
      query = query.eq("angkatan", filters.angkatan);
    }

    if (filters.search) {
      query = query.or(`nama.ilike.%${filters.search}%,nim.ilike.%${filters.search}%`);
    }

    if (filters.jurusan) {
      query = query.eq("jurusan", filters.jurusan);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: data.map(mapMahasiswaRowToStudentRecord),
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: [] as StudentRecord[],
      error: getErrorMessage(error, "Gagal memuat data mahasiswa dari Supabase."),
    };
  }
}

export async function getAvailableAngkatanFromMahasiswa() {
  noStore();

  try {
    const supabase = await createServerSupabaseClient();
    
    // Get active angkatan from the new angkatan table
    const { data, error } = await supabase
      .from("angkatan")
      .select("tahun")
      .eq("status", "Aktif")
      .order("tahun", { ascending: false });

    if (error) {
      throw error;
    }

    const angkatanList = data.map(item => item.tahun);
    
    // Add default angkatan if table is empty
    if (angkatanList.length === 0) {
      return {
        data: ["2025", "2026", "2027"],
        error: null as string | null,
      };
    }

    return {
      data: angkatanList,
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: ["2025", "2026", "2027"] as string[],
      error: getErrorMessage(error, "Gagal mengambil daftar angkatan."),
    };
  }
}

export async function getMahasiswaById(id: number) {
  noStore();

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      data: data ? mapMahasiswaRowToStudentRecord(data) : null,
      error: null as string | null,
    };
  } catch (error) {
    return {
      data: null as StudentRecord | null,
      error: getErrorMessage(error, "Gagal memuat data mahasiswa."),
    };
  }
}
