"use client";

import { useState } from "react";
import { UserCog, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { updateAdminRoleAction } from "@/actions/admin";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: {
    id: string;
    username: string;
    email: string;
    role: "admin" | "super_admin";
  };
}

export function ChangeRoleDialog({ open, onOpenChange, admin }: ChangeRoleDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "super_admin">(admin.role);

  const handleUpdate = async () => {
    if (selectedRole === admin.role) {
      onOpenChange(false);
      return;
    }

    setIsUpdating(true);
    setError(null);

    const result = await updateAdminRoleAction(admin.id, selectedRole);

    if (result.status === "error") {
      setError(result.message);
      setIsUpdating(false);
    } else {
      // Success - close dialog
      setTimeout(() => {
        onOpenChange(false);
        setIsUpdating(false);
      }, 500);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={() => !isUpdating && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-foreground">Ubah Role Admin</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ubah role untuk <strong>{admin.username}</strong> ({admin.email})
          </p>
        </div>

        {/* Role Select */}
        <div className="mt-6">
          <label htmlFor="role" className="block text-sm font-medium text-foreground">
            Role Baru
          </label>
          <Select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as "admin" | "super_admin")}
            disabled={isUpdating}
            className="mt-1.5"
            options={[
              { label: "Admin", value: "admin" },
              { label: "Super Admin", value: "super_admin" },
            ]}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Super Admin memiliki akses penuh untuk mengelola admin lain
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
            disabled={isUpdating}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || selectedRole === admin.role}
            className="flex-1 gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengubah...
              </>
            ) : (
              <>
                <UserCog className="h-4 w-4" />
                Ubah Role
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
