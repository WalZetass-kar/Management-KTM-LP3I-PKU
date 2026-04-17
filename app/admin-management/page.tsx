"use client";

import { useEffect, useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/features/admin/admin-table";
import { AdminFormModal } from "@/components/features/admin/admin-form-modal";
import { getAdminList } from "@/actions/admin";

interface Admin {
  id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAdmins = async () => {
    setIsLoading(true);
    const result = await getAdminList();
    
    if (result.error) {
      setError(result.error);
    } else {
      setAdmins(result.data);
      setCanManage(result.canManage);
      setCurrentUserId(result.currentUserId);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (!modalOpen) {
      void loadAdmins();
    }
  }, [modalOpen]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Manajemen Akses
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Admin Management
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Kelola akun admin dan super admin yang memiliki akses ke sistem.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Tambah Admin
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{admins.length}</p>
                  <p className="text-sm text-muted-foreground">Total Admin</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {admins.filter((a) => a.role === "super_admin").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Super Admin</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Shield className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {admins.filter((a) => a.role === "admin").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <AdminTable admins={admins} canManage={canManage} currentUserId={currentUserId} />

          {/* Info Box */}
          {!canManage && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4">
              <p className="text-sm text-blue-700">
                <strong>Info:</strong> Anda hanya memiliki akses untuk melihat data admin. 
                Hanya Super Admin yang dapat menambah, mengubah, atau menghapus akun admin.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AdminFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
