"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { createMahasiswaAngkatan } from "@/actions/mahasiswa-angkatan";
import type { JurusanRecord } from "@/types/jurusan";
import type { StudentStatus } from "@/types/student";

interface MahasiswaAngkatanFormProps {
  jurusan: JurusanRecord[];
  errorMessage?: string | null;
}

const AVAILABLE_ANGKATAN = ["2023", "2024", "2025", "2026", "2027"];
const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: "Menunggu", label: "Menunggu" },
  { value: "Aktif", label: "Aktif" },
  { value: "Tidak Aktif", label: "Tidak Aktif" },
  { value: "Lulus", label: "Lulus" },
  { value: "Cuti", label: "Cuti" },
];

export function MahasiswaAngkatanForm({ jurusan, errorMessage }: MahasiswaAngkatanFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    nim: "",
    angkatan: "2025",
    studyProgram: "",
    address: "",
    phoneNumber: "",
    status: "Menunggu" as StudentStatus,
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WEBP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setSelectedPhotoPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoPreview(null);
    setPhotoFile(null);
    setPhotoInputKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = null;

      // Upload photo if selected
      if (photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('photo', photoFile);

        const uploadResponse = await fetch('/api/upload-student-photo', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          photoUrl = uploadResult.url;
        } else {
          console.error('Failed to upload photo');
          // Continue without photo
        }
      }

      const result = await createMahasiswaAngkatan({
        ...formData,
        photoUrl,
      });
      
      if (result.success) {
        router.push("/mahasiswa-angkatan");
        router.refresh();
      } else {
        alert(result.error || "Terjadi kesalahan saat menyimpan data");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Foto Mahasiswa</label>
          <div className="flex flex-col gap-4 sm:flex-row">
            {selectedPhotoPreview ? (
              <div className="relative h-32 w-32 shrink-0">
                <img
                  src={selectedPhotoPreview}
                  alt="Preview foto mahasiswa"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm transition hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
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
                {selectedPhotoPreview ? "Ganti Foto" : "Pilih Foto"}
                <input
                  key={photoInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">NIM *</label>
            <Input
              value={formData.nim}
              onChange={(e) => handleChange("nim", e.target.value)}
              placeholder="Masukkan NIM"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Angkatan *</label>
            <Select
              value={formData.angkatan}
              onChange={(e) => handleChange("angkatan", e.target.value)}
              options={AVAILABLE_ANGKATAN.map(angkatan => ({
                label: angkatan,
                value: angkatan
              }))}
              placeholder="Pilih Angkatan"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Program Studi *</label>
            <Select
              value={formData.studyProgram}
              onChange={(e) => handleChange("studyProgram", e.target.value)}
              options={jurusan.map(item => ({
                label: item.namaJurusan,
                value: item.namaJurusan
              }))}
              placeholder="Pilih Program Studi"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nomor Telepon *</label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status *</label>
            <Select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value as StudentStatus)}
              options={STATUS_OPTIONS}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alamat *</label>
          <Textarea
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Masukkan alamat lengkap"
            rows={3}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Card>
  );
}