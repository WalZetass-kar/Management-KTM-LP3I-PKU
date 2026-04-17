import "server-only";

import bcrypt from "bcryptjs";
import { mapMahasiswaRowToStudentRecord } from "@/lib/mahasiswa";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import type { StudentRecord } from "@/types/student";

export interface StudentAccountSnapshot {
  id: string;
  mahasiswaId: string;
  mustChangePassword: boolean;
  nim: string;
}

export interface AuthenticatedStudent {
  account: StudentAccountSnapshot;
  student: StudentRecord;
}

function isMissingStudentAccountTableError(message: string | undefined) {
  return typeof message === "string" && message.includes("public.student_accounts");
}

export async function verifyStudentCredentials(nim: string, password: string) {
  const supabase = createServiceRoleSupabaseClient();
  const normalizedNim = nim.trim();

  const { data: account, error: accountError } = await supabase
    .from("student_accounts")
    .select("id, mahasiswa_id, nim, password_hash, must_change_password")
    .eq("nim", normalizedNim)
    .maybeSingle();

  if (accountError) {
    if (isMissingStudentAccountTableError(accountError.message)) {
      throw new Error(
        "Tabel student_accounts belum tersedia pada project Supabase yang terhubung. Pastikan project dan schema yang dipakai sudah benar.",
      );
    }

    throw new Error(`Gagal membaca akun mahasiswa: ${accountError.message}`);
  }

  if (!account) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, account.password_hash).catch(() => false);

  if (!passwordMatches) {
    return null;
  }

  const { data: studentRow, error: studentError } = await supabase
    .from("mahasiswa")
    .select("*")
    .eq("nim", normalizedNim)
    .maybeSingle();

  if (studentError) {
    throw new Error(`Gagal membaca profil mahasiswa: ${studentError.message}`);
  }

  if (!studentRow) {
    throw new Error("Akun mahasiswa ditemukan, tetapi data mahasiswa dengan NIM tersebut belum ada.");
  }

  return {
    account: {
      id: account.id,
      mahasiswaId: account.mahasiswa_id,
      mustChangePassword: account.must_change_password,
      nim: account.nim,
    },
    student: mapMahasiswaRowToStudentRecord(studentRow),
  } satisfies AuthenticatedStudent;
}

export async function getStudentPortalData(nim: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { data: account, error: accountError } = await supabase
    .from("student_accounts")
    .select("id, mahasiswa_id, nim, must_change_password")
    .eq("nim", nim)
    .maybeSingle();

  if (accountError) {
    if (isMissingStudentAccountTableError(accountError.message)) {
      throw new Error(
        "Tabel student_accounts belum tersedia pada project Supabase yang terhubung. Pastikan schema Supabase mahasiswa sudah aktif.",
      );
    }

    throw new Error(`Gagal membaca sesi mahasiswa: ${accountError.message}`);
  }

  if (!account) {
    return null;
  }

  const { data: studentRow, error: studentError } = await supabase
    .from("mahasiswa")
    .select("*")
    .eq("nim", nim)
    .maybeSingle();

  if (studentError) {
    throw new Error(`Gagal membaca data mahasiswa: ${studentError.message}`);
  }

  if (!studentRow) {
    return null;
  }

  return {
    account: {
      id: account.id,
      mahasiswaId: account.mahasiswa_id,
      mustChangePassword: account.must_change_password,
      nim: account.nim,
    },
    student: mapMahasiswaRowToStudentRecord(studentRow),
  } satisfies AuthenticatedStudent;
}
