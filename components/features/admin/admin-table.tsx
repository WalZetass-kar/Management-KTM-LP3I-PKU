"use client";

import { useState } from "react";
import { Trash2, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { DeleteAdminDialog } from "./delete-admin-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";

interface Admin {
  id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
}

interface AdminTableProps {
  admins: Admin[];
  canManage: boolean;
  currentUserId?: string;
}

export function AdminTable({ admins, canManage, currentUserId }: AdminTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleRoleClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setRoleDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (admins.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-foreground">Belum ada admin</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tambahkan admin pertama untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dibuat Pada
                </th>
                {canManage && (
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin) => {
                const isCurrentUser = admin.id === currentUserId;
                
                return (
                  <tr key={admin.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {admin.username}
                        </p>
                        {isCurrentUser && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Anda
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={admin.role} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(admin.created_at)}
                      </p>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRoleClick(admin)}
                            disabled={isCurrentUser}
                            className="h-8 gap-2"
                          >
                            <UserCog className="h-4 w-4" />
                            Ubah Role
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(admin)}
                            disabled={isCurrentUser}
                            className="h-8 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAdmin && (
        <>
          <DeleteAdminDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            admin={selectedAdmin}
          />
          <ChangeRoleDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            admin={selectedAdmin}
          />
        </>
      )}
    </>
  );
}
