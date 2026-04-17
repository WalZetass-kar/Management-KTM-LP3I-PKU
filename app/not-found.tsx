import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-10 w-10" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Halaman Tidak Ditemukan
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-foreground">404</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Rute yang Anda tuju tidak tersedia atau sudah dipindahkan ke lokasi yang baru.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/dashboard">Kembali ke Dashboard</Button>
          <Button href="/mahasiswa" variant="outline">
            Buka Data Mahasiswa
          </Button>
        </div>
      </div>
    </section>
  );
}
