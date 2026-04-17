import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudentStatusBadge } from "@/features/students/components/student-status-badge";
import type { VerificationRecord } from "@/types/student";

interface VerificationResultCardProps {
  record: VerificationRecord | null;
  onReset: () => void;
}

export function VerificationResultCard({ record, onReset }: VerificationResultCardProps) {
  if (!record) {
    return (
      <Card className="overflow-hidden bg-white">
        <div className="border-b border-red-200 bg-red-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Verifikasi Gagal</h3>
              <p className="text-sm text-red-700">NIM belum terdaftar atau belum memiliki data KTM yang valid.</p>
            </div>
          </div>
        </div>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm leading-6 text-muted-foreground">Pastikan NIM yang dimasukkan benar, atau gunakan QR code resmi pada kartu mahasiswa untuk verifikasi langsung.</p>
          <Button variant="outline" onClick={onReset} className="w-full">
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white">
      <div className="border-b border-green-200 bg-green-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Verifikasi Berhasil</h3>
            <p className="text-sm text-green-700">Kartu mahasiswa aktif dan data cocok dengan profil yang terdaftar.</p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {record.photoUrl ? (
            <img
              src={record.photoUrl}
              alt={record.fullName}
              className="h-40 w-40 rounded-3xl object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-slate-100 text-4xl font-semibold text-slate-500 shadow-sm">
              {record.fullName.slice(0, 1)}
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-2xl font-semibold text-foreground">{record.fullName}</h4>
            <p className="mt-2 text-muted-foreground">{record.studyProgram}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">NIM</p>
                <p className="mt-1 font-semibold text-foreground">{record.nim}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <div className="mt-2">
                  <StudentStatusBadge status={record.status} />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tanggal Diterbitkan</p>
                <p className="mt-1 font-semibold text-foreground">{record.issuedDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Berlaku Hingga</p>
                <p className="mt-1 font-semibold text-foreground">{record.validUntil}</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={onReset} className="w-full">
          Verifikasi Mahasiswa Lain
        </Button>
      </CardContent>
    </Card>
  );
}
