"use client";

import { useActionState, useEffect, useState } from "react";
import { X, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createAdminAction } from "@/actions/admin";

interface AdminFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  status: "idle" as const,
  message: "",
};

export function AdminFormModal({ open, onOpenChange }: AdminFormModalProps) {
  const [state, formAction, isPending] = useActionState(createAdminAction, initialState);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.status === "success") {
      // Reset form and close modal
      setFormKey((prev) => prev + 1);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }
  }, [state.status, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={() => !isPending && onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Tambah Admin Baru</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Buat akun admin atau super admin baru untuk sistem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form key={formKey} action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground">
              Nama <span className="text-red-500">*</span>
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              disabled={isPending}
              placeholder="Contoh: Ahmad Fauzi"
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder="admin@example.com"
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password <span className="text-red-500">*</span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              placeholder="Minimal 8 karakter"
              className="mt-1.5"
              minLength={8}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Password minimal 8 karakter
            </p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground">
              Role <span className="text-red-500">*</span>
            </label>
            <Select
              id="role"
              name="role"
              required
              disabled={isPending}
              className="mt-1.5"
              defaultValue="admin"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Super Admin", value: "super_admin" },
              ]}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Super Admin memiliki akses penuh untuk mengelola admin lain
            </p>
          </div>

          {/* Status Message */}
          {state.message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                state.status === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {state.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Buat Admin
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
