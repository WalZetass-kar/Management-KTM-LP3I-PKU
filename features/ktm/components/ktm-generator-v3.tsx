"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { KTMGeneratorFlip } from "@/features/ktm/components/ktm-generator-flip";
import type { StudentRecord } from "@/types/student";

interface KtmGeneratorV3Props {
  students: StudentRecord[];
  errorMessage?: string | null;
}

// Convert StudentRecord to Mahasiswa format
function convertToMahasiswa(student: StudentRecord) {
  return {
    id: student.id,
    nama: student.fullName,
    nim: student.nim,
    jurusan: student.studyProgram,
    alamat: student.address,
    no_hp: student.phoneNumber,
    foto_url: student.photoUrl,
    status: student.status,
    created_at: student.createdAt,
  };
}

export function KtmGeneratorV3({ students, errorMessage = null }: KtmGeneratorV3Props) {
  const [selectedNim, setSelectedNim] = useState("");

  const selectedStudent = students.find((student) => student.nim === selectedNim) ?? null;

  return (
    <section className="space-y-8">
      {/* Selection Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Generate Kartu Tanda Mahasiswa</CardTitle>
          <CardDescription>
            Pilih mahasiswa untuk membuat KTM dengan desain modern (depan & belakang)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="student-select" className="text-sm font-medium text-foreground">
              Pilih Mahasiswa
            </label>
            <Select
              id="student-select"
              value={selectedNim}
              onChange={(event) => {
                setSelectedNim(event.target.value);
              }}
              placeholder="Pilih mahasiswa untuk generate KTM"
              options={students.map((student) => ({
                label: `${student.fullName} - ${student.nim} - ${student.studyProgram}`,
                value: student.nim,
              }))}
            />
          </div>

          {!errorMessage && students.length === 0 ? (
            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              Belum ada data mahasiswa. Tambahkan mahasiswa terlebih dahulu.
            </div>
          ) : null}

          {selectedStudent ? (
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-900">Mahasiswa Terpilih</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-20 text-blue-700">Nama</dt>
                      <dd className="font-semibold text-blue-900">{selectedStudent.fullName}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-blue-700">NIM</dt>
                      <dd className="font-mono font-semibold text-blue-900">{selectedStudent.nim}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-blue-700">Jurusan</dt>
                      <dd className="font-semibold text-blue-900">{selectedStudent.studyProgram}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-blue-700">Status</dt>
                      <dd>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {selectedStudent.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900">
            ℹ️ Informasi KTM
          </h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-500">•</span>
              <span>Kartu memiliki <strong>2 sisi</strong>: depan (data mahasiswa) dan belakang (info kampus + QR)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-500">•</span>
              <span><strong>Klik kartu</strong> untuk melihat sisi depan dan belakang</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-500">•</span>
              <span>Download tersedia dalam format <strong>PNG</strong> (per sisi atau keduanya) dan <strong>PDF</strong> (2 halaman)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-500">•</span>
              <span>QR Code otomatis di-generate untuk verifikasi kartu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-500">•</span>
              <span>Ukuran kartu mengikuti standar KTP (aspect ratio 1.586:1)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Preview & Download Section */}
      {selectedStudent && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Preview & Download KTM
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Klik kartu untuk flip dan lihat kedua sisi
            </p>
          </div>
          
          <KTMGeneratorFlip mahasiswa={convertToMahasiswa(selectedStudent)} />
        </div>
      )}

      {/* Empty State */}
      {!selectedStudent && students.length > 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Pilih Mahasiswa
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Pilih mahasiswa dari dropdown di atas untuk melihat preview KTM
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
