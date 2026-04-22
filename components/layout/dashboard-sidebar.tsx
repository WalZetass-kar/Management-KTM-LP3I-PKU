"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { LogoLP3I } from "@/components/ui/logo-lp3i";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex items-start justify-between border-b border-sidebar-border px-6 py-7">
          <div className="flex items-center gap-4">
            <LogoLP3I variant="white" size="lg" className="h-14 w-14" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Admin Console</p>
              <h1 className="mt-2 text-xl font-bold">KTM Management</h1>
              <p className="mt-1 text-xs leading-5 text-blue-100/90">Politeknik LP3I Pekanbaru</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-blue-100 transition hover:bg-white/10 lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = isItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 rounded-2xl px-4 py-3 transition-all",
                  isActive ? "bg-white text-sidebar shadow-sm" : "text-blue-100 hover:bg-sidebar-accent hover:text-white",
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={cn("mt-1 text-xs leading-5", isActive ? "text-slate-600" : "text-blue-100/80")}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-6 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Status Sistem</p>
          <p className="mt-2 text-sm text-blue-50">Seluruh modul berjalan normal dan siap digunakan.</p>
        </div>
      </aside>
    </>
  );
}
