"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AngkatanFormModal } from "./angkatan-form-modal";
import { DeleteAngkatanDialog } from "./delete-angkatan-dialog";
import type { Angkatan } from "@/types/angkatan";

interface AngkatanTableProps {
  angkatanList: Angkatan[];
}

export function AngkatanTable({ angkatanList }: AngkatanTableProps) {
  const [selectedAngkatan, setSelectedAngkatan] = useState<Angkatan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  function handleEdit(angkatan: Angkatan) {
    setSelectedAngkatan(angkatan);
    setModalMode("edit");
    setIsModalOpen(true);
  }

  function handleAdd() {
    setSelectedAngkatan(null);
    setModalMode("create");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedAngkatan(null);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Manajemen Tahun Angkatan</h2>
            <p className="text-sm text-gray-600">
              Kelola tahun angkatan yang tersedia dalam sistem
            </p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Tahun Angkatan
          </Button>
        </div>

        {angkatanList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">Belum ada tahun angkatan yang terdaftar</p>
            <Button onClick={handleAdd} className="mt-4">
              Tambah Tahun Angkatan Pertama
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Tahun
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Nama Angkatan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Keterangan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Dibuat
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {angkatanList.map((angkatan, index) => (
                    <tr key={angkatan.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {angkatan.tahun}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {angkatan.nama_angkatan}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={angkatan.status === "Aktif" ? "success" : "neutral"}
                        >
                          {angkatan.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {angkatan.keterangan || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(angkatan.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(angkatan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DeleteAngkatanDialog angkatan={angkatan} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AngkatanFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        angkatan={selectedAngkatan}
        mode={modalMode}
      />
    </>
  );
}