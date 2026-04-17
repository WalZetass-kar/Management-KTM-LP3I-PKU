import type { Metadata } from "next";
import { RouteShell } from "@/components/layout/route-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Student ID Card Management",
    template: "%s | Student ID Card Management",
  },
  description: "Administrative dashboard for managing student records, KTM generation, and verification workflows.",
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
