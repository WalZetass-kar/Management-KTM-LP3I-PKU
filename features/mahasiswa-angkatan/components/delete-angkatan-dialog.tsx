"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAngkatanAction } from "@/actions/angkatan";
import type { Angkatan } from "@/types/angkatan";

interface DeleteAngkatanDialogProps {
  angkatan: Angkatan;
  onSuccess?: () => void;
}

export function DeleteAngkatanDialog({ angkatan, onSuccess }: DeleteAngkatanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mahasiswaCount, setMahasiswaCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkMahasiswaUsage();
    }
  }, [isOpen]);

  async function checkMahasiswaUsage() {
    setIsLoadingCount(true);
    try {
      // Simulate checking mahasiswa count - you can implement actual API call here
      // For now, we'll use a placeholder
      setMahasiswaCount(0);
    } catch (error) {
      console.error("Error checking mahasiswa usage:", error);
    } finally {
      setIsLoadingCount(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", angkatan.id.toString());
      
      const result = await deleteAngkatanAction(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus angkatan");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleClose() {
    if (!isDeleting) {
      setIsOpen(false);
      setError(null);
      setMahasiswaCount(null);
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hapus Angkatan
                </h3>
                <p className="text-sm text-gray-600">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{angkatan.nama_angkatan}</p>
                    <p className="text-sm text-gray-600">Tahun {angkatan.tahun}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {isLoadingCount ? (
                        <span>...</span>
                      ) : (
                        <span>{mahasiswaCount || 0} mahasiswa</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Apakah Anda yakin ingin menghapus angkatan ini?
              </p>
              {mahasiswaCount !== null && mahasiswaCount > 0 && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-800">
                    ⚠️ Angkatan ini masih digunakan oleh {mahasiswaCount} mahasiswa dan tidak dapat dihapus.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting || (mahasiswaCount !== null && mahasiswaCount > 0)}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}