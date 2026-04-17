"use client";

import { usePathname } from "next/navigation";
import { getRouteContent } from "@/lib/navigation";

export function useRouteTitle() {
  const pathname = usePathname();

  return getRouteContent(pathname);
}
