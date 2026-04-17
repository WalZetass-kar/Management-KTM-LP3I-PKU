"use client";

import { useActionState, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMahasiswaAction, updateMahasiswaAction } from "@/actions/mahasiswa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { studyPrograms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { initialFormActionState } from "@/types/action-state";
import type { StudentFormValues, StudentRecord } from "@/types/student";

const initialValues: StudentFormValues = {
  fullName: "",
  nim: "",
  studyProgram: "",
  address: "",
  phoneNumber: "",
  status: "Menunggu",
};

interface StudentFormProps {
  mode: "create" | "update";
  student?: StudentRecord;
}

export function StudentForm({ mode, student }: StudentFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<StudentFormValues>(
    student
      ? {
          fullName: student.fullName,
          nim: student.nim,
          studyProgram: student.studyProgram,
          address: student.address,
          phoneNumber: student.phoneNumber,
          status: student.status,
        }
      : initialValues,
  );
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormValues, string>>>({});
  const action = mode === "create" ? createMahasiswaAction : updateMahasiswaAction;
  const [state, formAction, isPending] = useActionState(action, initialFormActionState);
  const isEditing = mode === "update";
  const displayedPhoto = selectedPhotoPreview ?? student?.photoUrl ?? null;

  function setFieldValue(field: keyof StudentFormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSelectedPhotoPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function getValidationErrors(values: StudentFormValues) {
    const nextErrors: Partial<Record<keyof StudentFormValues, string>> = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi.";
    }
    if (!values.nim.trim()) {
      nextErrors.nim = "NIM wajib diisi.";
    }
    if (!values.studyProgram) {
      nextErrors.studyProgram = "Jurusan wajib dipilih.";
    }
    if (!values.address.trim()) {
      nextErrors.address = "Alamat wajib diisi.";
    }
    if (!values.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Nomor HP wajib diisi.";
    } else if (!/^\d{10,13}$/.test(values.phoneNumber)) {
      nextErrors.phoneNumber = "Nomor HP harus terdiri dari 10 sampai 13 digit.";
    }

    return nextErrors;
  }

  function validateForm() {
    const nextErrors = getValidationErrors(formValues);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!validateForm()) {
      event.preventDefault();
    }
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/mahasiswa")}>
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Data Mahasiswa
      </Button>

      <Card className="mx-auto max-w-4xl bg-white">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Mahasiswa" : "Form Tambah Mahasiswa"}</CardTitle>
          <CardDescription>
            Lengkapi data inti mahasiswa untuk proses registrasi dan penerbitan KTM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            {student ? <input type="hidden" name="id" value={student.id} /> : null}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Foto Mahasiswa</label>
              <div className="flex flex-col gap-4 sm:flex-row">
                {displayedPhoto ? (
                  <div className="relative h-32 w-32 shrink-0">
                    <img
                      src={displayedPhoto}
                      alt="Pratinjau mahasiswa"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                    {selectedPhotoPreview ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPhotoPreview(null);
                          setPhotoInputKey((current) => current + 1);
                        }}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm transition hover:bg-destructive/92"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50 text-center">
                    <Upload className="mb-2 h-7 w-7 text-muted-foreground" />
                    <span className="px-3 text-xs font-medium text-muted-foreground">Belum ada foto</span>
                  </div>
                )}

                <div className="flex-1 rounded-2xl border bg-slate-50 p-4 text-sm leading-6 text-muted-foreground">
                  <p>
                    Gunakan foto dengan wajah terlihat jelas, latar bersih, dan ukuran file
                    maksimal 2MB. Format yang didukung adalah JPG, PNG, dan WEBP.
                  </p>
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary">
                    <Upload className="h-4 w-4" />
                    {displayedPhoto ? "Ganti Foto" : "Pilih Foto"}
                    <input
                      key={photoInputKey}
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={(event) => setFieldValue("fullName", event.target.value)}
                  className={cn(errors.fullName && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                  placeholder="Masukkan nama lengkap mahasiswa"
                />
                {errors.fullName ? <p className="text-sm text-destructive">{errors.fullName}</p> : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="nim" className="text-sm font-medium text-foreground">
                  NIM
                </label>
                <Input
                  id="nim"
                  name="nim"
                  value={formValues.nim}
                  onChange={(event) => setFieldValue("nim", event.target.value)}
                  className={cn(errors.nim && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                  placeholder="Masukkan NIM"
                />
                {errors.nim ? <p className="text-sm text-destructive">{errors.nim}</p> : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="studyProgram" className="text-sm font-medium text-foreground">
                  Jurusan
                </label>
                <Select
                  id="studyProgram"
                  name="studyProgram"
                  value={formValues.studyProgram}
                  onChange={(event) => setFieldValue("studyProgram", event.target.value)}
                  className={cn(errors.studyProgram && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                  placeholder="Pilih jurusan"
                  options={studyPrograms.map((program) => ({ label: program, value: program }))}
                />
                {errors.studyProgram ? <p className="text-sm text-destructive">{errors.studyProgram}</p> : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground">
                  Alamat
                </label>
                <Textarea
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={(event) => setFieldValue("address", event.target.value)}
                  className={cn(errors.address && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                  placeholder="Masukkan alamat lengkap"
                />
                {errors.address ? <p className="text-sm text-destructive">{errors.address}</p> : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                  Nomor HP
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formValues.phoneNumber}
                  onChange={(event) => setFieldValue("phoneNumber", event.target.value)}
                  className={cn(errors.phoneNumber && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                  placeholder="Contoh: 08123456789"
                />
                {errors.phoneNumber ? <p className="text-sm text-destructive">{errors.phoneNumber}</p> : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="status" className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select
                  id="status"
                  name="status"
                  value={formValues.status}
                  onChange={(event) => setFieldValue("status", event.target.value)}
                  options={[
                    { label: "Menunggu", value: "Menunggu" },
                    { label: "Aktif", value: "Aktif" },
                  ]}
                />
              </div>
            </div>

            {state.status === "error" ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.message}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => router.push("/mahasiswa")} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Menyimpan..."
                  : isEditing
                  ? "Perbarui Mahasiswa"
                  : "Simpan Mahasiswa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
