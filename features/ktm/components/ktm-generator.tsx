"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { KtmCardPreview } from "@/features/ktm/components/ktm-card-preview";
import type { StudentRecord } from "@/types/student";

interface KtmGeneratorProps {
  students: StudentRecord[];
  errorMessage?: string | null;
}

export function KtmGenerator({ students, errorMessage = null }: KtmGeneratorProps) {
  const [selectedNim, setSelectedNim] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedStudent = students.find((student) => student.nim === selectedNim) ?? null;

  function handleDownload() {
    if (!selectedStudent) {
      return;
    }

    setStatusMessage(`Pratinjau KTM untuk ${selectedStudent.fullName} siap diunduh dalam format PDF.`);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pilih Mahasiswa</CardTitle>
            <CardDescription>Gunakan daftar mahasiswa aktif untuk menyiapkan kartu identitas yang siap cetak.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="student-select" className="text-sm font-medium text-foreground">
                Mahasiswa
              </label>
              <Select
                id="student-select"
                value={selectedNim}
                onChange={(event) => {
                  setSelectedNim(event.target.value);
                  setStatusMessage("");
                }}
                placeholder="Pilih mahasiswa"
                options={students.map((student) => ({
                  label: `${student.fullName} - ${student.nim}`,
                  value: student.nim,
                }))}
              />
            </div>

            {!errorMessage && students.length === 0 ? (
              <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
                Belum ada data mahasiswa di Supabase. Tambahkan mahasiswa terlebih dahulu.
              </div>
            ) : null}

            {selectedStudent ? (
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-sm font-semibold text-foreground">Informasi Mahasiswa</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Nama</dt>
                    <dd className="font-medium text-foreground">{selectedStudent.fullName}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">NIM</dt>
                    <dd className="font-medium text-foreground">{selectedStudent.nim}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Jurusan</dt>
                    <dd className="font-medium text-foreground">{selectedStudent.studyProgram}</dd>
                  </div>
                </dl>
              </div>
            ) : null}

            <Button onClick={handleDownload} className="w-full" disabled={!selectedStudent}>
              <Download className="h-4 w-4" />
              Unduh KTM
            </Button>

            {statusMessage ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {statusMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-blue-50/70">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Catatan Produksi</h3>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-blue-900">
              <li>KTM mengikuti ukuran kartu standar untuk kebutuhan cetak kampus.</li>
              <li>QR code dapat dihubungkan ke data verifikasi mahasiswa.</li>
              <li>Template dibuat bersih agar mudah dilanjutkan ke integrasi PDF generator.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Preview</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Pratinjau KTM</h2>
        </div>
        <KtmCardPreview student={selectedStudent} />
      </div>
    </section>
  );
}
