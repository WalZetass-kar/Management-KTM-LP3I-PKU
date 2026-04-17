"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAdminAction } from "@/actions/admin";

interface DeleteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: {
    id: string;
    username: string;
    email: string;
    role: "admin" | "super_admin";
  };
}

export function DeleteAdminDialog({ open, onOpenChange, admin }: DeleteAdminDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteAdminAction(admin.id);

    if (result.status === "error") {
      setError(result.message);
      setIsDeleting(false);
    } else {
      // Success - close dialog
      setTimeout(() => {
        onOpenChange(false);
        setIsDeleting(false);
      }, 500);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={() => !isDeleting && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Content */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-foreground">Hapus Admin</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Apakah Anda yakin ingin menghapus admin <strong>{admin.username}</strong> ({admin.email})?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
