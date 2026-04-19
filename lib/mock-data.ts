import type { ActivityFeedItem, DashboardStat, StudentGrowthPoint } from "@/types/dashboard";
import type { StudentRecord, VerificationRecord } from "@/types/student";

export const studyPrograms = [
  "Hubungan Masyarakat",
  "Administrasi Bisnis",
  "Komputerisasi Akuntansi",
  "Manajemen Informatika",
] as const;

export const students: StudentRecord[] = [
  {
    id: 1,
    fullName: "Ahmad Fadli",
    nim: "2024010101",
    studyProgram: "Teknik Informatika",
    status: "Aktif",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    address: "Jl. Harapan No. 10, Pekanbaru",
    phoneNumber: "081234567890",
    createdAt: "2026-01-10T08:00:00.000Z",
  },
  {
    id: 2,
    fullName: "Siti Nurhaliza",
    nim: "2024010102",
    studyProgram: "Akuntansi",
    status: "Aktif",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    address: "Jl. Melati No. 18, Pekanbaru",
    phoneNumber: "081234567891",
    createdAt: "2026-01-12T08:00:00.000Z",
  },
  {
    id: 3,
    fullName: "Budi Santoso",
    nim: "2024010103",
    studyProgram: "Manajemen",
    status: "Aktif",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    address: "Jl. Garuda No. 6, Pekanbaru",
    phoneNumber: "081234567892",
    createdAt: "2026-01-14T08:00:00.000Z",
  },
  {
    id: 4,
    fullName: "Dewi Lestari",
    nim: "2024010104",
    studyProgram: "Teknik Informatika",
    status: "Menunggu",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    address: "Jl. Anggrek No. 24, Pekanbaru",
    phoneNumber: "081234567893",
    createdAt: "2026-01-16T08:00:00.000Z",
  },
  {
    id: 5,
    fullName: "Rudi Hermawan",
    nim: "2024010105",
    studyProgram: "Akuntansi",
    status: "Aktif",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    address: "Jl. Rajawali No. 2, Pekanbaru",
    phoneNumber: "081234567894",
    createdAt: "2026-01-18T08:00:00.000Z",
  },
  {
    id: 6,
    fullName: "Rina Wijaya",
    nim: "2024010106",
    studyProgram: "Manajemen",
    status: "Aktif",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    address: "Jl. Sudirman No. 88, Pekanbaru",
    phoneNumber: "081234567895",
    createdAt: "2026-01-20T08:00:00.000Z",
  },
];

export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Mahasiswa",
    value: "1.284",
    change: "+12,5%",
    trend: "increase",
    icon: "students",
  },
  {
    title: "Menunggu Verifikasi",
    value: "48",
    change: "-8,2%",
    trend: "decrease",
    icon: "pending",
  },
  {
    title: "Disetujui",
    value: "1.236",
    change: "+18,3%",
    trend: "increase",
    icon: "approved",
  },
  {
    title: "Baru Bulan Ini",
    value: "142",
    change: "+24,1%",
    trend: "increase",
    icon: "new",
  },
];

export const studentGrowth: StudentGrowthPoint[] = [
  { month: "Jan", students: 65 },
  { month: "Feb", students: 89 },
  { month: "Mar", students: 112 },
  { month: "Apr", students: 98 },
  { month: "Mei", students: 125 },
  { month: "Jun", students: 142 },
];

export const recentActivities: ActivityFeedItem[] = [
  {
    id: 1,
    fullName: "Ahmad Fadli",
    nim: "2024010101",
    action: "KTM berhasil dibuat",
    timeLabel: "2 menit lalu",
    status: "success",
  },
  {
    id: 2,
    fullName: "Siti Nurhaliza",
    nim: "2024010102",
    action: "Menunggu verifikasi admin",
    timeLabel: "15 menit lalu",
    status: "pending",
  },
  {
    id: 3,
    fullName: "Budi Santoso",
    nim: "2024010103",
    action: "Data mahasiswa disetujui",
    timeLabel: "1 jam lalu",
    status: "success",
  },
  {
    id: 4,
    fullName: "Dewi Lestari",
    nim: "2024010104",
    action: "Profil mahasiswa diperbarui",
    timeLabel: "2 jam lalu",
    status: "info",
  },
];

export const verificationRecord: VerificationRecord = {
  ...students[0],
  validUntil: "Desember 2027",
  issuedDate: "Januari 2024",
};
