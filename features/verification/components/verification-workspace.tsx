"use client";

import { useState, type FormEvent } from "react";
import { QrCode, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VerificationResultCard } from "@/features/verification/components/verification-result-card";
import type { StudentRecord, VerificationRecord } from "@/types/student";

function buildVerificationRecord(students: StudentRecord[], nim: string): VerificationRecord | null {
  const student = students.find((candidate) => candidate.nim === nim);

  if (!student) {
    return null;
  }

  return {
    ...student,
    issuedDate: "Januari 2024",
    validUntil: "Desember 2027",
  };
}

interface VerificationWorkspaceProps {
  students: StudentRecord[];
  errorMessage?: string | null;
}

export function VerificationWorkspace({
  students,
  errorMessage = null,
}: VerificationWorkspaceProps) {
  const [nim, setNim] = useState("");
  const [result, setResult] = useState<VerificationRecord | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(buildVerificationRecord(students, nim));
    setHasSubmitted(true);
    setScanMessage("");
  }

  function handleReset() {
    setNim("");
    setResult(null);
    setHasSubmitted(false);
    setScanMessage("");
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Verifikasi Data Mahasiswa</CardTitle>
              <CardDescription>Masukkan NIM atau lanjutkan ke pemindai QR untuk memverifikasi keabsahan KTM.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={nim}
                onChange={(event) => setNim(event.target.value)}
                className="flex-1"
                placeholder="Masukkan NIM, contoh: 2024010101"
              />
              <Button type="submit" disabled={!nim}>
                <Search className="h-4 w-4" />
                Verifikasi
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setScanMessage("Mode pemindai QR siap diintegrasikan ke kamera atau scanner eksternal.")}
            >
              <QrCode className="h-4 w-4" />
              Gunakan Pemindai QR
            </Button>
          </form>

          {!errorMessage && students.length === 0 ? (
            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              Belum ada data mahasiswa di Supabase untuk diverifikasi.
            </div>
          ) : null}

          {scanMessage ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {scanMessage}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {hasSubmitted ? (
        <VerificationResultCard record={result} onReset={handleReset} />
      ) : (
        <Card className="bg-blue-50/70">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Cara Verifikasi</h3>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-blue-950">
              <li>Masukkan NIM mahasiswa yang ingin diverifikasi.</li>
              <li>Atau hubungkan tombol pemindai QR ke kamera perangkat.</li>
              <li>Sistem akan menampilkan status kartu, masa berlaku, dan identitas mahasiswa.</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
