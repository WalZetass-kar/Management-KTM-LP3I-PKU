import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession, getCurrentUser, getCurrentUserProfile } from "@/lib/auth";
import { getMahasiswaList } from "@/lib/mahasiswa";

export default async function SupabaseTestPage() {
  const [currentUser, session, profile, mahasiswaResult] = await Promise.all([
    getCurrentUser(),
    getCurrentSession(),
    getCurrentUserProfile(),
    getMahasiswaList(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Connection Test
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Supabase Integration Check
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Halaman ini memverifikasi sesi aktif, profil admin, dan akses baca ke tabel
          `mahasiswa`.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Auth User</CardTitle>
            <CardDescription>Status user dari `supabase.auth.getUser()`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-foreground">User ID:</span>{" "}
              <span className="text-muted-foreground">{currentUser?.id ?? "Tidak ada sesi"}</span>
            </p>
            <p>
              <span className="font-semibold text-foreground">Email:</span>{" "}
              <span className="text-muted-foreground">{currentUser?.email ?? "-"}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>
              Snapshot dari sesi saat ini untuk kebutuhan debug non-otorisasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-foreground">Access Token:</span>{" "}
              <span className="text-muted-foreground">
                {session?.accessToken ? `${session.accessToken.slice(0, 18)}...` : "Tidak ada"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-foreground">Expires At:</span>{" "}
              <span className="text-muted-foreground">{session?.expiresAt ?? "-"}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Data role dari tabel `user_profiles`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-foreground">Username:</span>{" "}
              <span className="text-muted-foreground">{profile?.username ?? "-"}</span>
            </p>
            <p>
              <span className="font-semibold text-foreground">Role:</span>{" "}
              <span className="text-muted-foreground">{profile?.role ?? "-"}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Mahasiswa Data</CardTitle>
          <CardDescription>
            Hasil query `select * from mahasiswa order by created_at desc`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mahasiswaResult.error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mahasiswaResult.error}
            </div>
          ) : mahasiswaResult.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Koneksi berhasil, tetapi tabel `mahasiswa` belum memiliki data.
            </p>
          ) : (
            <ul className="space-y-3">
              {mahasiswaResult.data.map((student) => (
                <li
                  key={student.id}
                  className="rounded-2xl border border-border/80 bg-slate-50 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-foreground">{student.fullName}</span>
                  <span className="text-muted-foreground"> · {student.nim}</span>
                  <span className="text-muted-foreground"> · {student.studyProgram}</span>
                  <span className="text-muted-foreground"> · {student.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
