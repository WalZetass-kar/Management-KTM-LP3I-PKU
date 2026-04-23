"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, User, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useRouteTitle } from "@/hooks/use-route-title";

interface DashboardTopbarProps {
  onOpenSidebar: () => void;
  userProfile?: {
    username: string;
    role: "admin" | "super_admin";
    photoUrl?: string | null;
  } | null;
  pendingCount?: number;
}

export function DashboardTopbar({ onOpenSidebar, userProfile, pendingCount = 0 }: DashboardTopbarProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { title, description } = useRouteTitle();

  const displayName = userProfile?.username || "Admin";
  const displayRole = userProfile?.role === "super_admin" ? "Super Admin" : "Administrator";

  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button size="icon" variant="outline" onClick={onOpenSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Student ID Workspace</p>
            <h1 className="truncate text-2xl font-semibold text-foreground">{title}</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative"
              onClick={() => setIsNotificationOpen((current) => !current)}
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                </>
              )}
            </Button>

            {isNotificationOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(false)}
                  className="fixed inset-0 z-10"
                  aria-label="Tutup notifikasi"
                />
                <div className="absolute right-0 z-20 mt-3 w-80 rounded-2xl border bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold text-foreground">Notifikasi</h3>
                    <p className="text-xs text-muted-foreground">
                      {pendingCount > 0 
                        ? `${pendingCount} mahasiswa menunggu verifikasi` 
                        : "Tidak ada notifikasi baru"}
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {pendingCount > 0 ? (
                      <Link
                        href="/verifikasi"
                        onClick={() => setIsNotificationOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-secondary"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            Verifikasi Mahasiswa
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {pendingCount} mahasiswa baru menunggu untuk diverifikasi
                          </p>
                          <p className="text-xs text-primary mt-2 font-medium">
                            Klik untuk review →
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="py-8 text-center">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
                        <p className="text-sm font-semibold text-foreground">Semua Selesai!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tidak ada mahasiswa yang menunggu verifikasi
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountOpen((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 text-left shadow-xs transition hover:bg-secondary"
            >
              {userProfile?.photoUrl ? (
                <img
                  src={userProfile.photoUrl}
                  alt={displayName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </span>
              )}
              <span className="hidden sm:block">
                <span className="block text-sm font-semibold text-foreground">{displayName}</span>
                <span className="block text-xs text-muted-foreground">{displayRole}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>

            {isAccountOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(false)}
                  className="fixed inset-0 z-10"
                  aria-label="Tutup menu akun"
                />
                <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/profile";
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-secondary"
                  >
                    <User className="h-4 w-4" />
                    Profil Admin
                  </button>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </form>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
