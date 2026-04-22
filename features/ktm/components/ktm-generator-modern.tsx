"use client";

import { useRef, useState } from "react";
import {
  Download,
  Loader2,
  FileImage,
  FileText,
  CreditCard,
  User,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { KTMCardModern } from "@/components/ui/ktm-card-modern";
import type { StudentRecord } from "@/types/student";

interface KtmGeneratorModernProps {
  students: StudentRecord[];
  availableAngkatan: string[];
  currentAngkatan: string;
  errorMessage?: string | null;
}

// Helper: convert StudentRecord → KTM props
function formatMasaBerlaku(createdAt: string) {
  const base = new Date(createdAt);
  const safe = Number.isNaN(base.getTime()) ? new Date() : base;
  const end = new Date(safe);
  end.setFullYear(end.getFullYear() + 4);
  return `${safe.getFullYear()} - ${end.getFullYear()}`;
}

export function KtmGeneratorModern({
  students,
  availableAngkatan,
  currentAngkatan,
  errorMessage = null,
}: KtmGeneratorModernProps) {
  const [selectedNim, setSelectedNim] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"front" | "back" | "both" | "pdf">("both");

  // Handle angkatan change
  const handleAngkatanChange = (angkatan: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("angkatan", angkatan);
    window.location.href = url.toString();
  };

  const selectedStudent =
    students.find((s) => s.nim === selectedNim) ?? null;

  const studentData = selectedStudent
    ? {
        nama: selectedStudent.fullName,
        nim: selectedStudent.nim,
        jurusan: selectedStudent.studyProgram,
        masaBerlaku: formatMasaBerlaku(selectedStudent.createdAt),
        fotoUrl: selectedStudent.photoUrl,
      }
    : null;

  const qrUrl = selectedStudent
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedStudent.nim)}`
    : undefined;

  // ── Download Handlers ──
  const handleDownloadPNG = async (type: "front" | "back" | "both") => {
    setIsDownloading(true);
    setDownloadType(type);

    try {
      const html2canvas = (await import("html2canvas")).default;

      if (type === "both" || type === "front") {
        const el = document.querySelector(
          '[data-ktm-download="front"]'
        ) as HTMLElement;
        if (el) {
          const canvas = await html2canvas(el, {
            scale: 4,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });
          const link = document.createElement("a");
          link.download = `KTM-${selectedStudent!.nim}-${selectedStudent!.fullName}-DEPAN.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }

      if (type === "both" || type === "back") {
        if (type === "both") {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
        const el = document.querySelector(
          '[data-ktm-download="back"]'
        ) as HTMLElement;
        if (el) {
          const canvas = await html2canvas(el, {
            scale: 4,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });
          const link = document.createElement("a");
          link.download = `KTM-${selectedStudent!.nim}-${selectedStudent!.fullName}-BELAKANG.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadType("pdf");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const frontEl = document.querySelector(
        '[data-ktm-download="front"]'
      ) as HTMLElement;
      if (frontEl) {
        const canvas = await html2canvas(frontEl, {
          scale: 4,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          (297 - imgWidth) / 2,
          (210 - imgHeight) / 2,
          imgWidth,
          imgHeight
        );
      }

      pdf.addPage();

      const backEl = document.querySelector(
        '[data-ktm-download="back"]'
      ) as HTMLElement;
      if (backEl) {
        const canvas = await html2canvas(backEl, {
          scale: 4,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          (297 - imgWidth) / 2,
          (210 - imgHeight) / 2,
          imgWidth,
          imgHeight
        );
      }

      pdf.save(
        `KTM-${selectedStudent!.nim}-${selectedStudent!.fullName}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* ── Filter Section ── */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Generate KTM
              </CardTitle>
              <CardDescription>
                Pilih angkatan untuk generate kartu mahasiswa
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Angkatan
              </label>
              <Select
                value={currentAngkatan}
                onChange={(e) => handleAngkatanChange(e.target.value)}
                options={availableAngkatan.map(angkatan => ({
                  label: `Angkatan ${angkatan}`,
                  value: angkatan
                }))}
              />
            </div>

            <div className="flex items-end">
              <div className="rounded-lg bg-primary/5 px-3 py-2">
                <p className="text-sm font-medium text-primary">
                  {students.length} mahasiswa tersedia
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Top Section: Select + Info ── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Student Selection Card */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Generate KTM</CardTitle>
                  <CardDescription>
                    Pilih mahasiswa untuk membuat kartu identitas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="student-select-modern"
                  className="text-sm font-medium text-foreground"
                >
                  Mahasiswa Angkatan {currentAngkatan}
                </label>
                <Select
                  id="student-select-modern"
                  value={selectedNim}
                  onChange={(e) => setSelectedNim(e.target.value)}
                  placeholder={`Pilih mahasiswa angkatan ${currentAngkatan} untuk generate KTM`}
                  options={students.map((s) => ({
                    label: `${s.fullName} — ${s.nim} — ${s.studyProgram}`,
                    value: s.nim,
                  }))}
                />
              </div>

              {!errorMessage && students.length === 0 && (
                <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
                  Belum ada data mahasiswa untuk angkatan {currentAngkatan}. Tambahkan mahasiswa angkatan terlebih dahulu.
                </div>
              )}

              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="rounded-2xl border-2 border-primary/10 bg-primary/[0.03] p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <User className="h-4 w-4" />
                    Mahasiswa Terpilih
                  </div>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-20 text-muted-foreground">Nama</dt>
                      <dd className="font-semibold text-foreground">
                        {selectedStudent.fullName}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-muted-foreground">NIM</dt>
                      <dd className="font-mono font-semibold text-foreground">
                        {selectedStudent.nim}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-muted-foreground">Jurusan</dt>
                      <dd className="font-semibold text-foreground">
                        {selectedStudent.studyProgram}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-muted-foreground">Angkatan</dt>
                      <dd className="font-semibold text-primary">
                        {currentAngkatan}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 text-muted-foreground">Status</dt>
                      <dd>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {selectedStudent.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-primary/10 bg-gradient-to-br from-primary/[0.04] to-white">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                <CreditCard className="h-4 w-4" />
                Informasi KTM
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    Filter berdasarkan <strong className="text-foreground">angkatan</strong> untuk memudahkan pencarian mahasiswa
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    Kartu memiliki <strong className="text-foreground">2 sisi</strong>: depan (data
                    mahasiswa) dan belakang (info kampus + QR)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Klik kartu</strong> untuk melihat sisi depan
                    dan belakang
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    Download format <strong className="text-foreground">PNG</strong> (per sisi atau
                    keduanya) dan <strong className="text-foreground">PDF</strong> (2 halaman)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Ukuran mengikuti standar KTP (85.6mm × 53.98mm)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Preview */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Pratinjau KTM
            </h2>
          </div>

          {selectedStudent && studentData ? (
            <>
              {/* Interactive flip preview */}
              <KTMCardModern
                student={studentData}
                qrUrl={qrUrl}
                mode="flip"
                showFlipHint
              />

              {/* Download Buttons */}
              <div className="space-y-4 rounded-2xl border bg-white p-6">
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Download className="h-4 w-4 text-primary" />
                  Download Kartu
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button
                    onClick={() => handleDownloadPNG("front")}
                    disabled={isDownloading}
                    variant="outline"
                    className="gap-2"
                  >
                    {isDownloading && downloadType === "front" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Proses...
                      </>
                    ) : (
                      <>
                        <FileImage className="h-4 w-4" />
                        Depan (PNG)
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDownloadPNG("back")}
                    disabled={isDownloading}
                    variant="outline"
                    className="gap-2"
                  >
                    {isDownloading && downloadType === "back" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Proses...
                      </>
                    ) : (
                      <>
                        <FileImage className="h-4 w-4" />
                        Belakang (PNG)
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDownloadPNG("both")}
                    disabled={isDownloading}
                    className="gap-2"
                  >
                    {isDownloading && downloadType === "both" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Proses...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Keduanya (PNG)
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    variant="secondary"
                    className="gap-2"
                  >
                    {isDownloading && downloadType === "pdf" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Proses...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        PDF (2 Halaman)
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  💡 Resolusi tinggi (4x scale) — siap cetak dalam ukuran KTP
                </p>
              </div>

              {/* Hidden render targets for download (non-flipped, full-size) */}
              <div className="pointer-events-none fixed left-[-9999px] top-0">
                <div data-ktm-download="front" className="w-[900px]">
                  <KTMCardModern
                    student={studentData}
                    qrUrl={qrUrl}
                    mode="front-only"
                    showFlipHint={false}
                  />
                </div>
                <div data-ktm-download="back" className="w-[900px]">
                  <KTMCardModern
                    student={studentData}
                    qrUrl={qrUrl}
                    mode="back-only"
                    showFlipHint={false}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <CreditCard className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  Pilih Mahasiswa
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  Pilih mahasiswa dari dropdown di sebelah kiri untuk melihat pratinjau KTM
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
