import type { Metadata } from "next";
import { RouteShell } from "@/components/layout/route-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KTM Management - Politeknik LP3I Pekanbaru",
    template: "%s | Politeknik LP3I Pekanbaru",
  },
  description: "Sistem manajemen kartu tanda mahasiswa digital untuk Politeknik LP3I Pekanbaru. Kelola data mahasiswa, generate KTM, dan verifikasi identitas dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <RouteShell>{children}</RouteShell>
      </body>
    </html>
  );
}
