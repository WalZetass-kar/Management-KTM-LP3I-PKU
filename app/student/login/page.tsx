import { redirect } from "next/navigation";
import { StudentLoginForm } from "@/features/auth/components/student-login-form";
import { getStudentPortalData } from "@/lib/student-auth";
import { clearStudentSession, getStudentSession } from "@/lib/student-session-server";

export const dynamic = "force-dynamic";

export default async function StudentLoginPage() {
  const studentSession = await getStudentSession();

  if (studentSession) {
    try {
      const studentPortalData = await getStudentPortalData(studentSession.nim);

      if (studentPortalData) {
        redirect("/student");
      }
    } catch {
      // Ignore portal lookup errors here so the user can attempt login again.
    }

    await clearStudentSession();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(135deg,#0f1f4a,#1e3a8a_52%,#2563eb)] px-4 py-10">
      <StudentLoginForm />
    </main>
  );
}
