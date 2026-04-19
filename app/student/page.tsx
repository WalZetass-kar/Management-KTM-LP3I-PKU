import { redirect } from "next/navigation";
import { studentLogoutAction } from "@/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KtmCardPreviewV2 } from "@/features/ktm/components/ktm-card-preview-v2";
import { getStudentPortalData } from "@/lib/student-auth";
import { clearStudentSession, getStudentSession } from "@/lib/student-session-server";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentPortalPage() {
  const studentSession = await getStudentSession();

  if (!studentSession) {
    redirect("/student/login");
  }

  let studentPortalData;

  try {
    studentPortalData = await getStudentPortalData(studentSession.nim);
  } catch (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-4 py-8">
        <Card className="w-full max-w-2xl bg-white">
          <CardHeader>
            <CardTitle>Portal Mahasiswa Belum Siap</CardTitle>
            <CardDescription>
              Aplikasi gagal membaca akun mahasiswa dari tabel `student_accounts`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(error, "Terjadi kesalahan saat memuat portal mahasiswa.")}
            </div>
            <form action={studentLogoutAction}>
              <Button type="submit" variant="outline">
                Kembali ke Login Mahasiswa
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!studentPortalData) {
    await clearStudentSession();
    redirect("/student/login");
  }

  const { student, account } = studentPortalData;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-[linear-gradient(135deg,#0f1f4a,#1d4ed8)] px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                Portal Mahasiswa
              </p>
              <h1 className="mt-3 text-3xl font-semibold">Halo, {student.fullName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Halaman ini mengambil akun mahasiswa dari tabel `student_accounts` dan profil
                akademik dari tabel `mahasiswa` berdasarkan NIM.
              </p>
            </div>

            <form action={studentLogoutAction}>
              <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                Keluar
              </Button>
            </form>
          </div>

          {account.mustChangePassword ? (
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Akun ini masih bertanda `must_change_password = true`. Sebaiknya siapkan alur ganti
              kata sandi setelah login pertama.
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Data Mahasiswa</CardTitle>
              <CardDescription>
                Informasi ini diambil dari tabel `mahasiswa` menggunakan NIM yang cocok dengan akun
                mahasiswa.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="mt-1 font-semibold text-foreground">{student.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIM</p>
                <p className="mt-1 font-semibold text-foreground">{student.nim}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jurusan</p>
                <p className="mt-1 font-semibold text-foreground">{student.studyProgram}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="mt-1 font-semibold text-foreground">{student.status}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="mt-1 font-semibold text-foreground">{student.address}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Nomor HP</p>
                <p className="mt-1 font-semibold text-foreground">{student.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Preview KTM
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Kartu Mahasiswa Digital
              </h2>
            </div>
            <KtmCardPreviewV2 mahasiswa={student} />
          </div>
        </div>
      </section>
    </main>
  );
}
