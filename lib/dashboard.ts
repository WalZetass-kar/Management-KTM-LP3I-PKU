import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardStat, ActivityFeedItem, StudentGrowthPoint } from "@/types/dashboard";

export async function getDashboardStats() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get total mahasiswa
    const { count: totalCount, error: totalError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    // Get mahasiswa menunggu
    const { count: pendingCount, error: pendingError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Menunggu");

    if (pendingError) throw pendingError;

    // Get mahasiswa aktif
    const { count: activeCount, error: activeError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Aktif");

    if (activeError) throw activeError;

    // Get mahasiswa bulan ini
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: thisMonthCount, error: monthError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    if (monthError) throw monthError;

    const stats: DashboardStat[] = [
      {
        title: "Total Mahasiswa",
        value: String(totalCount ?? 0),
        change: "+0%",
        trend: "increase",
        icon: "students",
      },
      {
        title: "Menunggu Verifikasi",
        value: String(pendingCount ?? 0),
        change: "-0%",
        trend: "decrease",
        icon: "pending",
      },
      {
        title: "Disetujui",
        value: String(activeCount ?? 0),
        change: "+0%",
        trend: "increase",
        icon: "approved",
      },
      {
        title: "Baru Bulan Ini",
        value: String(thisMonthCount ?? 0),
        change: "+0%",
        trend: "increase",
        icon: "new",
      },
    ];

    return { data: stats, error: null };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      data: [
        {
          title: "Total Mahasiswa",
          value: "0",
          change: "+0%",
          trend: "increase" as const,
          icon: "students" as const,
        },
        {
          title: "Menunggu Verifikasi",
          value: "0",
          change: "-0%",
          trend: "decrease" as const,
          icon: "pending" as const,
        },
        {
          title: "Disetujui",
          value: "0",
          change: "+0%",
          trend: "increase" as const,
          icon: "approved" as const,
        },
        {
          title: "Baru Bulan Ini",
          value: "0",
          change: "+0%",
          trend: "increase" as const,
          icon: "new" as const,
        },
      ],
      error: "Gagal mengambil statistik dashboard",
    };
  }
}

export async function getRecentActivities() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get 10 mahasiswa terbaru
    const { data: students, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    const activities: ActivityFeedItem[] = students.map((student) => {
      const createdDate = new Date(student.created_at);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeLabel = "";
      if (diffMins < 1) {
        timeLabel = "Baru saja";
      } else if (diffMins < 60) {
        timeLabel = `${diffMins} menit lalu`;
      } else if (diffHours < 24) {
        timeLabel = `${diffHours} jam lalu`;
      } else {
        timeLabel = `${diffDays} hari lalu`;
      }

      return {
        id: student.id,
        fullName: student.nama,
        nim: student.nim,
        action: student.status === "Aktif" ? "Data mahasiswa disetujui" : "Menunggu verifikasi admin",
        timeLabel,
        status: student.status === "Aktif" ? ("success" as const) : ("pending" as const),
      };
    });

    return { data: activities, error: null };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return {
      data: [],
      error: "Gagal mengambil aktivitas terbaru",
    };
  }
}

export async function getStudentGrowth() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get data 6 bulan terakhir
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const currentMonth = new Date().getMonth();
    const growth: StudentGrowthPoint[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
      
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

      const { count, error } = await supabase
        .from("mahasiswa")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;

      growth.push({
        month: months[monthIndex],
        students: count ?? 0,
      });
    }

    return { data: growth, error: null };
  } catch (error) {
    console.error("Error fetching student growth:", error);
    return {
      data: [
        { month: "Jan", students: 0 },
        { month: "Feb", students: 0 },
        { month: "Mar", students: 0 },
        { month: "Apr", students: 0 },
        { month: "Mei", students: 0 },
        { month: "Jun", students: 0 },
      ],
      error: "Gagal mengambil data pertumbuhan mahasiswa",
    };
  }
}
