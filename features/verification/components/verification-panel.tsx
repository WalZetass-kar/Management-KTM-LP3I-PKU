"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, User, Calendar, GraduationCap, Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateMahasiswaAction } from "@/actions/mahasiswa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentRecord } from "@/types/student";

interface VerificationPanelProps {
  students: StudentRecord[];
  errorMessage?: string | null;
  noticeMessage?: string | null;
}

export function VerificationPanel({
  students,
  errorMessage = null,
  noticeMessage = null,
}: VerificationPanelProps) {
  const router = useRouter();
  const [feedbackMessage, setFeedbackMessage] = useState(errorMessage ?? noticeMessage ?? "");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">(
    errorMessage ? "error" : "success",
  );
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleVerify = (student: StudentRecord, newStatus: "Aktif" | "Tidak Aktif") => {
    if (!window.confirm(`${newStatus === "Aktif" ? "Verifikasi" : "Tolak"} mahasiswa ${student.fullName}?`)) {
      return;
    }

    setProcessingId(student.id);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(student.id));
      formData.append("fullName", student.fullName);
      formData.append("nim", student.nim);
      formData.append("studyProgram", student.studyProgram);
      formData.append("address", student.address);
      formData.append("phoneNumber", student.phoneNumber);
      formData.append("status", newStatus);
      formData.append("angkatan", student.angkatan || "");

      const result = await updateMahasiswaAction({ status: "idle", message: "" }, formData);
      
      if (result.status === "error") {
        setFeedbackMessage(result.message);
        setFeedbackTone("error");
      } else {
        setFeedbackMessage(`Mahasiswa ${student.fullName} berhasil ${newStatus === "Aktif" ? "diverifikasi" : "ditolak"}.`);
        setFeedbackTone("success");
        router.refresh();
      }
      
      setProcessingId(null);
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verifikasi Mahasiswa</h1>
        <p className="text-muted-foreground mt-2">
          Tinjau dan verifikasi data mahasiswa yang baru didaftarkan.
        </p>
      </div>

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
        <CardHeader>
          <CardTitle>Daftar Menunggu Verifikasi</CardTitle>
          <CardDescription>
            {students.length} mahasiswa menunggu untuk diverifikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-semibold text-foreground">Semua Terverifikasi!</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tidak ada mahasiswa yang menunggu verifikasi saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <Card key={student.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.fullName}
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-100"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                            {student.fullName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{student.fullName}</h3>
                          <p className="text-sm text-muted-foreground">NIM: {student.nim}</p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>{student.studyProgram}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Angkatan {student.angkatan || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{student.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{student.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Didaftarkan {new Date(student.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:justify-center">
                        <Button
                          onClick={() => handleVerify(student, "Aktif")}
                          disabled={isPending}
                          className="gap-2"
                        >
                          {processingId === student.id ? (
                            "Memproses..."
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Verifikasi
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleVerify(student, "Tidak Aktif")}
                          disabled={isPending}
                          variant="outline"
                          className="gap-2 text-destructive hover:bg-red-50 hover:text-destructive border-destructive/30"
                        >
                          {processingId === student.id ? (
                            "Memproses..."
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Tolak
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
