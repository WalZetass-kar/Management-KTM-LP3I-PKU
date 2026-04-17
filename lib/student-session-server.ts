import "server-only";

import { cookies } from "next/headers";
import {
  STUDENT_SESSION_COOKIE_NAME,
  createStudentSessionToken,
  verifyStudentSessionToken,
  type StudentSessionPayload,
} from "@/lib/student-session";

export async function createStudentSession(
  input: Pick<StudentSessionPayload, "accountId" | "mustChangePassword" | "nim">,
) {
  const cookieStore = await cookies();
  const token = await createStudentSessionToken(input);
  const payload = await verifyStudentSessionToken(token);

  cookieStore.set(STUDENT_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return payload;
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(STUDENT_SESSION_COOKIE_NAME);
}

export async function getStudentSession() {
  const cookieStore = await cookies();
  return verifyStudentSessionToken(cookieStore.get(STUDENT_SESSION_COOKIE_NAME)?.value);
}
