"use server";

import { redirect } from "next/navigation";
import { createStudentSession, clearStudentSession } from "@/lib/student-session-server";
import { verifyStudentCredentials } from "@/lib/student-auth";
import { getErrorMessage } from "@/lib/utils";
import type { FormActionState } from "@/types/action-state";

export async function studentLoginAction(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const nim = typeof formData.get("nim") === "string" ? String(formData.get("nim")).trim() : "";
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";

  if (!nim || !password) {
    return {
      status: "error",
      message: "NIM dan kata sandi mahasiswa wajib diisi.",
    };
  }

  try {
    const authenticatedStudent = await verifyStudentCredentials(nim, password);

    if (!authenticatedStudent) {
      return {
        status: "error",
        message: "NIM atau kata sandi mahasiswa tidak valid.",
      };
    }

    await createStudentSession({
      accountId: authenticatedStudent.account.id,
      mustChangePassword: authenticatedStudent.account.mustChangePassword,
      nim: authenticatedStudent.account.nim,
    });
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error, "Login mahasiswa gagal."),
    };
  }

  redirect("/student");
}

export async function studentLogoutAction() {
  await clearStudentSession();
  redirect("/student/login");
}
