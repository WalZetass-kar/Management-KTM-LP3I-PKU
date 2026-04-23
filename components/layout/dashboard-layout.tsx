"use client";

import { useState, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePendingCount } from "@/hooks/use-pending-count";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useUserProfile();
  const { pendingCount } = usePendingCount();

  return (
    <div className="min-h-screen bg-background lg:pl-72">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <DashboardTopbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          userProfile={profile}
          pendingCount={pendingCount}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
