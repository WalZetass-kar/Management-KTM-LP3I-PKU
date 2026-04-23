"use client";

import { useState, useTransition, useRef } from "react";
import { Edit, Filter, Plus, Search, Trash2, Upload, Loader2, CheckCircle2, AlertCircle, FileSpreadsheet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteMahasiswaAction } from "@/actions/mahasiswa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentStatusBadge } from "@/features/students/components/student-status-badge";
import type { StudentRecord } from "@/types/student";
import type { JurusanRecord } from "@/types/jurusan";

const itemsPerPage = 5;

interface StudentDirectoryProps {
  students: StudentRecord[];
  availableAngkatan: string[];
  availableJurusan: JurusanRecord[];
  currentFilters: {
    angkatan: string;
    search: string;
    jurusan: string;
  };
  errorMessage?: string | null;
  noticeMessage?: string | null;
}

export function StudentDirectory({
  students,
  availableAngkatan,
  availableJurusan,
  currentFilters,
  errorMessage = null,
  noticeMessage = null,
}: StudentDirectoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [selectedProgram, setSelectedProgram] = useState(currentFilters.jurusan || "all");
  const [selectedAngkatan, setSelectedAngkatan] = useState(currentFilters.angkatan || "all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState(errorMessage ?? noticeMessage ?? "");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">(
    errorMessage ? "error" : "success",
  );
  const [isPending, startTransition] = useTransition();
  
  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle filter changes with URL updates
  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value && value !== "all") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    router.push(url.toString());
  };

  const handleSearch = () => {
    const url = new URL(window.location.href);
    if (searchTerm.trim()) {
      url.searchParams.set("search", searchTerm.trim());
    } else {
      url.searchParams.delete("search");
    }
    router.push(url.toString());
  };

  // Client-side filtering for status only (since it's not in URL params yet)
  const filteredStudents = students.filter((student) => {
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Import handlers
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: null, message: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import-mahasiswa", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal import data");
      }

      setImportStatus({
        type: "success",
        message: `Berhasil import ${data.imported} mahasiswa!`,
      });

      // Refresh page after 2 seconds
      setTimeout(() => {
        setShowImportModal(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownloadTemplate = () => {
    const template = `nama,nim,jurusan,angkatan,alamat,no_hp,status
John Doe,2024010101,Teknik Informatika,2024,Jl. Contoh No. 1,08123456789,Aktif
Jane Smith,2024010102,Sistem Informasi,2024,Jl. Contoh No. 2,08123456790,Aktif`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-mahasiswa.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <section className="space-y-6">
      {feedbackMessage ? (
        <div
          className={
            feedbackTone === "error"
              ? "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              : "rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          }
        >
          {feedbackMessage}
        </div>
      ) : null}

      <Card className="bg-white">
        <CardContent className="flex flex-col gap-4 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
                placeholder="Cari berdasarkan nama atau NIM"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={selectedAngkatan}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedAngkatan(value);
                    setCurrentPage(1);
                    handleFilterChange("angkatan", value);
                  }}
                  className="pl-9"
                  options={[
                    { label: "Semua Angkatan", value: "all" },
                    ...availableAngkatan.map((angkatan) => ({ 
                      label: `Angkatan ${angkatan}`, 
                      value: angkatan 
                    })),
                  ]}
                />
              </div>

              <Select
                value={selectedProgram}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedProgram(value);
                  setCurrentPage(1);
                  handleFilterChange("jurusan", value);
                }}
                options={[
                  { label: "Semua Jurusan", value: "all" },
                  ...availableJurusan.map((jurusan) => ({ 
                    label: jurusan.namaJurusan, 
                    value: jurusan.namaJurusan 
                  })),
                ]}
              />

              <Select
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(event.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Semua Status", value: "all" },
                  { label: "Menunggu", value: "Menunggu" },
                  { label: "Aktif", value: "Aktif" },
                  { label: "Tidak Aktif", value: "Tidak Aktif" },
                  { label: "Lulus", value: "Lulus" },
                  { label: "Cuti", value: "Cuti" },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2 w-full xl:w-auto">
            <Button 
              onClick={() => setShowImportModal(true)} 
              variant="outline" 
              className="flex-1 xl:flex-initial"
            >
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
            <Button href="/mahasiswa/tambah" className="flex-1 xl:flex-initial">
              <Plus className="h-4 w-4" />
              Tambah Mahasiswa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold">Import Mahasiswa (Excel/CSV)</h2>
                </div>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportStatus({ type: null, message: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Upload file Excel atau CSV untuk menambahkan mahasiswa secara massal
              </p>

              {/* Status Message */}
              {importStatus.type && (
                <div
                  className={`p-4 rounded-lg border flex items-start gap-3 mb-4 ${
                    importStatus.type === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {importStatus.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{importStatus.message}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  📋 Format File:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
                  <li>File harus berformat .xlsx, .xls, atau .csv</li>
                  <li>Kolom wajib: nama, nim, jurusan, angkatan, alamat, no_hp, status</li>
                  <li>Jurusan dan angkatan harus sudah terdaftar di sistem</li>
                  <li>Status: Aktif, Menunggu, Tidak Aktif, Lulus, atau Cuti</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="flex-1"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Download Template
                </Button>

                <label className="flex-1">
                  <Button
                    className="w-full"
                    disabled={isImporting}
                    asChild
                  >
                    <span>
                      {isImporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </>
                      )}
                    </span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImportExcel}
                    disabled={isImporting}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    Tidak ada data mahasiswa yang cocok dengan filter saat ini.
                  </TableCell>
                </TableRow>
              ) : null}
              {visibleStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={student.fullName}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {student.fullName.slice(0, 1)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground">{student.fullName}</p>
                      <p className="text-sm text-muted-foreground">{student.phoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.nim}</TableCell>
                  <TableCell>
                    {student.angkatan ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {student.angkatan}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{student.studyProgram}</TableCell>
                  <TableCell>
                    <StudentStatusBadge status={student.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(student.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        href={`/mahasiswa/${student.id}/edit`}
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit data ${student.fullName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isPending}
                        className="text-destructive hover:bg-red-50 hover:text-destructive"
                        aria-label={`Hapus data ${student.fullName}`}
                        onClick={() => {
                          if (!window.confirm(`Hapus data mahasiswa ${student.fullName}?`)) {
                            return;
                          }

                          startTransition(async () => {
                            const result = await deleteMahasiswaAction(student.id);
                            setFeedbackMessage(result.message);
                            setFeedbackTone(result.status === "error" ? "error" : "success");
                            router.refresh();
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredStudents.length === 0 ? 0 : startIndex + 1} sampai{" "}
            {Math.min(startIndex + itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} mahasiswa.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1 || isPending}
            >
              Sebelumnya
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === safePage ? "primary" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages || isPending}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
