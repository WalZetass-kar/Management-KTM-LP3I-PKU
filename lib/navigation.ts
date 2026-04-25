import {
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
} from "lucide-react";
import type { Permission } from "@/hooks/use-permissions";

interface NavigationItem {
  label: string;
  href: string;
  description: string;
  icon: any;
  permission?: Permission;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Ringkasan performa dan aktivitas terbaru.",
    icon: LayoutDashboard,
    permission: "view_dashboard",
  },
  {
    label: "Data Mahasiswa",
    href: "/mahasiswa",
    description: "Kelola data mahasiswa dan status penerbitan KTM.",
    icon: Users,
    permission: "manage_students",
  },
  {
    label: "Tahun Angkatan",
    href: "/mahasiswa-angkatan",
    description: "Kelola tahun angkatan yang tersedia dalam sistem.",
    icon: GraduationCap,
    permission: "manage_angkatan",
  },
  {
    label: "Jurusan",
    href: "/jurusan",
    description: "Kelola data jurusan dan program studi.",
    icon: BookOpen,
    permission: "manage_jurusan",
  },
  {
    label: "Alumni",
    href: "/alumni",
    description: "Data dan statistik alumni LP3I Pekanbaru.",
    icon: UserCheck,
    permission: "view_dashboard",
  },
  {
    label: "Generate KTM",
    href: "/generate-ktm",
    description: "Pilih mahasiswa dan siapkan kartu untuk dicetak.",
    icon: CreditCard,
    permission: "generate_ktm",
  },
  {
    label: "Verifikasi",
    href: "/verifikasi",
    description: "Validasi kartu mahasiswa melalui NIM atau QR.",
    icon: ShieldCheck,
    permission: "verify_students",
  },
  {
    label: "Admin Management",
    href: "/admin-management",
    description: "Kelola akun admin dan super admin sistem.",
    icon: Shield,
    permission: "manage_admins",
  },
  {
    label: "Pengaturan",
    href: "/settings",
    description: "Atur preferensi admin, keamanan, dan sistem.",
    icon: Settings,
    permission: "manage_settings",
  },
];

const routeContent = [
  {
    matcher: (pathname: string) => pathname === "/dashboard",
    title: "Dashboard",
    description: "Pantau statistik mahasiswa dan aktivitas operasional terbaru.",
  },
  {
    matcher: (pathname: string) => pathname === "/mahasiswa/tambah",
    title: "Tambah Mahasiswa",
    description: "Lengkapi biodata mahasiswa sebelum proses verifikasi KTM.",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/mahasiswa") && !pathname.includes("angkatan"),
    title: "Data Mahasiswa",
    description: "Cari, filter, dan tinjau status mahasiswa dalam satu tempat.",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/mahasiswa-angkatan"),
    title: "Tahun Angkatan",
    description: "Kelola tahun angkatan yang tersedia dalam sistem.",
  },
  {
    matcher: (pathname: string) => pathname === "/jurusan",
    title: "Data Jurusan",
    description: "Kelola data jurusan dan program studi yang tersedia.",
  },
  {
    matcher: (pathname: string) => pathname === "/generate-ktm",
    title: "Generate KTM",
    description: "Siapkan pratinjau kartu mahasiswa sebelum diunduh atau dicetak.",
  },
  {
    matcher: (pathname: string) => pathname === "/verifikasi",
    title: "Verifikasi KTM",
    description: "Periksa keabsahan kartu mahasiswa secara cepat dan akurat.",
  },
  {
    matcher: (pathname: string) => pathname === "/admin-management",
    title: "Admin Management",
    description: "Kelola akun admin dan super admin yang memiliki akses ke sistem.",
  },
  {
    matcher: (pathname: string) => pathname === "/settings",
    title: "Pengaturan",
    description: "Sesuaikan preferensi admin, notifikasi, dan konfigurasi sistem.",
  },
];

export function getRouteContent(pathname: string) {
  return (
    routeContent.find((item) => item.matcher(pathname)) ?? {
      title: "Student ID Card Management",
      description: "Kelola data mahasiswa dan operasional kartu identitas kampus.",
    }
  );
}
