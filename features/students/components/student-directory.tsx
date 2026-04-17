"use client";

import { useState, useTransition } from "react";
import { Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
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
import { studyPrograms } from "@/lib/mock-data";
import type { StudentRecord } from "@/types/student";

const itemsPerPage = 5;

interface StudentDirectoryProps {
  students: StudentRecord[];
  errorMessage?: string | null;
  noticeMessage?: string | null;
}

export function StudentDirectory({
  students,
  errorMessage = null,
  noticeMessage = null,
}: StudentDirectoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState(errorMessage ?? noticeMessage ?? "");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">(
    errorMessage ? "error" : "success",
  );
  const [isPending, startTransition] = useTransition();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm);
    const matchesProgram = selectedProgram === "all" || student.studyProgram === selectedProgram;
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesProgram && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

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
                className="pl-10"
                placeholder="Cari berdasarkan nama atau NIM"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={selectedProgram}
                  onChange={(event) => {
                    setSelectedProgram(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                  options={[
                    { label: "Semua Jurusan", value: "all" },
                    ...studyPrograms.map((program) => ({ label: program, value: program })),
                  ]}
                />
              </div>

              <Select
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(event.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Semua Status", value: "all" },
                  { label: "Aktif", value: "Aktif" },
                  { label: "Menunggu", value: "Menunggu" },
                ]}
              />
            </div>
          </div>

          <Button href="/mahasiswa/tambah" className="w-full xl:w-auto">
            <Plus className="h-4 w-4" />
            Tambah Mahasiswa
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
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
