"use server";

import { revalidatePath } from "next/cache";
import { createAngkatan, updateAngkatan, deleteAngkatan } from "@/lib/angkatan";
import type { CreateAngkatanData, UpdateAngkatanData } from "@/types/angkatan";

export async function createAngkatanAction(formData: FormData) {
  const tahun = formData.get("tahun") as string;
  const nama_angkatan = formData.get("nama_angkatan") as string;
  const status = formData.get("status") as "Aktif" | "Tidak Aktif";
  const keterangan = formData.get("keterangan") as string;

  if (!tahun || !nama_angkatan || !status) {
    return { error: "Semua field wajib diisi" };
  }

  // Validate tahun format (4 digits)
  if (!/^\d{4}$/.test(tahun)) {
    return { error: "Tahun harus berupa 4 digit angka" };
  }

  const angkatanData: CreateAngkatanData = {
    tahun,
    nama_angkatan,
    status,
    keterangan: keterangan || undefined,
  };

  const result = await createAngkatan(angkatanData);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/mahasiswa-angkatan");
  revalidatePath("/mahasiswa");
  revalidatePath("/generate-ktm");
  return { success: true, data: result.data };
}

export async function updateAngkatanAction(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const tahun = formData.get("tahun") as string;
  const nama_angkatan = formData.get("nama_angkatan") as string;
  const status = formData.get("status") as "Aktif" | "Tidak Aktif";
  const keterangan = formData.get("keterangan") as string;

  if (!id || !tahun || !nama_angkatan || !status) {
    return { error: "Semua field wajib diisi" };
  }

  // Validate tahun format (4 digits)
  if (!/^\d{4}$/.test(tahun)) {
    return { error: "Tahun harus berupa 4 digit angka" };
  }

  const angkatanData: UpdateAngkatanData = {
    id,
    tahun,
    nama_angkatan,
    status,
    keterangan: keterangan || undefined,
  };

  const result = await updateAngkatan(angkatanData);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/mahasiswa-angkatan");
  revalidatePath("/mahasiswa");
  revalidatePath("/generate-ktm");
  return { success: true, data: result.data };
}

export async function deleteAngkatanAction(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  if (!id) {
    return { error: "ID angkatan tidak valid" };
  }

  const result = await deleteAngkatan(id);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/mahasiswa-angkatan");
  revalidatePath("/mahasiswa");
  revalidatePath("/generate-ktm");
  return { success: true };
}