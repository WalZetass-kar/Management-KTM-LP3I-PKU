"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createAngkatanAction, updateAngkatanAction } from "@/actions/angkatan";
import type { Angkatan } from "@/types/angkatan";

interface AngkatanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  angkatan?: Angkatan | null;
  mode: "create" | "edit";
}

export function AngkatanFormModal({ isOpen, onClose, angkatan, mode }: AngkatanFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = mode === "create" 
        ? await createAngkatanAction(formData)
        : await updateAngkatanAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (error) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Tambah Tahun Angkatan" : "Edit Tahun Angkatan"}
          </CardTitle>
          <CardDescription>
            {mode === "create" 
              ? "Tambahkan tahun angkatan baru untuk sistem"
              : "Perbarui informasi tahun angkatan"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {mode === "edit" && angkatan && (
              <input type="hidden" name="id" value={angkatan.id} />
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="tahun" className="text-sm font-medium">
                Tahun Angkatan *
              </label>
              <Input
                id="tahun"
                name="tahun"
                type="text"
                placeholder="2028"
                defaultValue={angkatan?.tahun || ""}
                maxLength={4}
                pattern="[0-9]{4}"
                required
              />
              <p className="text-xs text-gray-500">Format: 4 digit tahun (contoh: 2028)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_angkatan" className="text-sm font-medium">
                Nama Angkatan *
              </label>
              <Input
                id="nama_angkatan"
                name="nama_angkatan"
                type="text"
                placeholder="Angkatan 2028"
                defaultValue={angkatan?.nama_angkatan || ""}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status *
              </label>
              <Select
                id="status"
                name="status"
                defaultValue={angkatan?.status || "Aktif"}
                options={[
                  { label: "Aktif", value: "Aktif" },
                  { label: "Tidak Aktif", value: "Tidak Aktif" },
                ]}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="keterangan" className="text-sm font-medium">
                Keterangan
              </label>
              <Input
                id="keterangan"
                name="keterangan"
                type="text"
                placeholder="Keterangan tambahan (opsional)"
                defaultValue={angkatan?.keterangan || ""}
                maxLength={255}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting 
                  ? (mode === "create" ? "Menambah..." : "Memperbarui...")
                  : (mode === "create" ? "Tambah" : "Perbarui")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}