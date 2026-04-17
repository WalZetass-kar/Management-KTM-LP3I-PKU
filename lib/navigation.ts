import {
  CreditCard,
  LayoutDashboard,
  Settings,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Ringkasan performa dan aktivitas terbaru.",
    icon: LayoutDashboard,
  },
  {
    label: "Data Mahasiswa",
    href: "/mahasiswa",
    description: "Kelola data mahasiswa dan status penerbitan KTM.",
    icon: Users,
  },
  {
    label: "Generate KTM",
    href: "/generate-ktm",
    description: "Pilih mahasiswa dan siapkan kartu untuk dicetak.",
    icon: CreditCard,
  },
  {
    label: "Verifikasi",
    href: "/verifikasi",
    description: "Validasi kartu mahasiswa melalui NIM atau QR.",
    icon: ShieldCheck,
  },
  {
    label: "Admin Management",
    href: "/admin-management",
    description: "Kelola akun admin dan super admin sistem.",
    icon: Shield,
  },
  {
    label: "Pengaturan",
    href: "/settings",
    description: "Atur preferensi admin, keamanan, dan sistem.",
    icon: Settings,
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
    matcher: (pathname: string) => pathname.startsWith("/mahasiswa"),
    title: "Data Mahasiswa",
    description: "Cari, filter, dan tinjau status mahasiswa dalam satu tempat.",
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
