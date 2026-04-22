"use client";

import { useActionState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createJurusanAction, updateJurusanAction } from "@/actions/jurusan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JurusanRecord } from "@/types/jurusan";
import type { FormActionState } from "@/types/action-state";

interface JurusanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJurusan: JurusanRecord | null;
}

export function JurusanFormModal({ isOpen, onClose, editingJurusan }: JurusanFormModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = !!editingJurusan;

  const [createState, createFormAction, isCreating] = useActionState(createJurusanAction, {
    status: "idle" as const,
    message: "",
  });

  const [updateState, updateFormAction, isUpdating] = useActionState(updateJurusanAction, {
    status: "idle" as const,
    message: "",
  });

  const state = isEditMode ? updateState : createState;
  const formAction = isEditMode ? updateFormAction : createFormAction;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEditMode ? "Edit Jurusan" : "Tambah Jurusan"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditMode
                ? "Perbarui informasi jurusan yang sudah ada."
                : "Tambahkan jurusan baru ke dalam sistem."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-slate-100"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="mt-6 space-y-4">
          {isEditMode && (
            <input type="hidden" name="id" value={editingJurusan.id} />
          )}

          {state.status === "error" && state.message ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </div>
          ) : null}

          <div>
            <label htmlFor="namaJurusan" className="mb-2 block text-sm font-semibold text-foreground">
              Nama Jurusan <span className="text-red-500">*</span>
            </label>
            <Input
              id="namaJurusan"
              name="namaJurusan"
              type="text"
              placeholder="Contoh: Teknik Informatika"
              defaultValue={editingJurusan?.namaJurusan ?? ""}
              required
              disabled={isPending}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Masukkan nama jurusan atau program studi.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Menyimpan..." : isEditMode ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
