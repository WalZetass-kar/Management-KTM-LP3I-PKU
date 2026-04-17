"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const publicRoutes = ["/", "/login"];

function isPublicStudentRoute(pathname: string) {
  return pathname === "/student" || pathname === "/student/login";
}

export function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute =
    isPublicStudentRoute(pathname) ||
    publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isPublicRoute) {
    return children;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
