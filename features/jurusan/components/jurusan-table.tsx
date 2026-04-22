"use client";

import { useState, useTransition } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteJurusanAction } from "@/actions/jurusan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JurusanFormModal } from "@/features/jurusan/components/jurusan-form-modal";
import type { JurusanRecord } from "@/types/jurusan";

const itemsPerPage = 10;

interface JurusanTableProps {
  jurusanList: JurusanRecord[];
  errorMessage?: string | null;
  noticeMessage?: string | null;
}

export function JurusanTable({
  jurusanList,
  errorMessage = null,
  noticeMessage = null,
}: JurusanTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState(errorMessage ?? noticeMessage ?? "");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">(
    errorMessage ? "error" : "success",
  );
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJurusan, setEditingJurusan] = useState<JurusanRecord | null>(null);

  const filteredJurusan = jurusanList.filter((jurusan) =>
    jurusan.namaJurusan.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filteredJurusan.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleJurusan = filteredJurusan.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (jurusan: JurusanRecord) => {
    if (!window.confirm(`Hapus jurusan "${jurusan.namaJurusan}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteJurusanAction(jurusan.id);
      setFeedbackMessage(result.message);
      setFeedbackTone(result.status === "error" ? "error" : "success");
      router.refresh();
    });
  };

  const handleEdit = (jurusan: JurusanRecord) => {
    setEditingJurusan(jurusan);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingJurusan(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJurusan(null);
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
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
              placeholder="Cari jurusan..."
            />
          </div>

          <Button onClick={handleAdd} className="w-full xl:w-auto">
            <Plus className="h-4 w-4" />
            Tambah Jurusan
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">No</TableHead>
                <TableHead>Nama Jurusan</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Diperbarui</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleJurusan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    {searchTerm
                      ? "Tidak ada jurusan yang cocok dengan pencarian."
                      : "Belum ada data jurusan."}
                  </TableCell>
                </TableRow>
              ) : null}
              {visibleJurusan.map((jurusan, index) => (
                <TableRow key={jurusan.id}>
                  <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <p className="font-semibold text-foreground">{jurusan.namaJurusan}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(jurusan.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {jurusan.updatedAt
                      ? new Date(jurusan.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(jurusan)}
                        disabled={isPending}
                        aria-label={`Edit ${jurusan.namaJurusan}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isPending}
                        className="text-destructive hover:bg-red-50 hover:text-destructive"
                        aria-label={`Hapus ${jurusan.namaJurusan}`}
                        onClick={() => handleDelete(jurusan)}
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

        {filteredJurusan.length > itemsPerPage ? (
          <div className="flex flex-col gap-4 border-t px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredJurusan.length === 0 ? 0 : startIndex + 1} sampai{" "}
              {Math.min(startIndex + itemsPerPage, filteredJurusan.length)} dari{" "}
              {filteredJurusan.length} jurusan.
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
                  disabled={isPending}
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
        ) : null}
      </Card>

      <JurusanFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingJurusan={editingJurusan}
      />
    </section>
  );
}
