import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardStat, ActivityFeedItem, StudentGrowthPoint } from "@/types/dashboard";

export async function getDashboardStats() {
  try {
    const supabase = await createServerSupabaseClient();

    // Sekarang hanya query dari tabel mahasiswa
    const { count: totalCount, error: totalError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    // Get mahasiswa menunggu verifikasi
    const { count: pendingCount, error: pendingError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Menunggu");

    if (pendingError) throw pendingError;

    // Get mahasiswa aktif (termasuk yang sudah lulus)
    const { count: activeCount, error: activeError } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .in("status", ["Aktif", "Lulus"]);

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
        change: "0%",
        trend: "neutral",
        icon: "pending",
      },
      {
        title: "Terverifikasi",
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
          change: "0%",
          trend: "neutral" as const,
          icon: "pending" as const,
        },
        {
          title: "Terverifikasi",
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

    // Query dari tabel mahasiswa, urutkan berdasarkan updated_at untuk menangkap perubahan status
    const { data: students, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    const activities: ActivityFeedItem[] = (students || []).map((student) => {
      // Gunakan updated_at jika ada, fallback ke created_at
      const activityDate = student.updated_at ? new Date(student.updated_at) : new Date(student.created_at);
      const createdDate = new Date(student.created_at);
      const now = new Date();
      const diffMs = now.getTime() - activityDate.getTime();
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

      // Tentukan action berdasarkan status
      let action = "";
      let status: "success" | "pending" | "info" = "info";

      if (student.status === "Aktif" || student.status === "Lulus") {
        action = "Data mahasiswa terverifikasi";
        status = "success";
      } else if (student.status === "Menunggu") {
        action = "Menunggu verifikasi admin";
        status = "pending";
      } else if (student.status === "Cuti") {
        action = "Status mahasiswa: Cuti";
        status = "info";
      } else if (student.status === "Tidak Aktif") {
        action = "Status mahasiswa: Tidak Aktif";
        status = "pending";
      } else {
        action = "Data mahasiswa diperbarui";
        status = "info";
      }

      return {
        id: student.id,
        fullName: student.nama,
        nim: student.nim,
        action,
        timeLabel,
        status,
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


// Get mahasiswa per jurusan per tahun angkatan
export async function getStudentsByJurusanAndYear(year?: number) {
  try {
    const supabase = await createServerSupabaseClient();
    const targetYear = year ?? new Date().getFullYear();

    // Get data jurusan
    const { data: jurusanList, error: jurusanError } = await supabase
      .from("jurusan")
      .select("id, nama_jurusan")
      .order("nama_jurusan", { ascending: true });

    if (jurusanError) {
      console.log("Jurusan table not available:", jurusanError);
      return { data: [], error: null }; // Return empty data instead of error
    }

    // Get mahasiswa count per jurusan untuk angkatan tertentu
    const results = await Promise.all(
      (jurusanList || []).map(async (jurusan) => {
        // Query dari tabel mahasiswa berdasarkan ANGKATAN, bukan created_at
        const { count, error } = await supabase
          .from("mahasiswa")
          .select("*", { count: "exact", head: true })
          .eq("jurusan", jurusan.nama_jurusan)
          .eq("angkatan", String(targetYear)); // Filter by angkatan column

        if (error) {
          console.error("Error counting mahasiswa for jurusan:", error);
        }

        return {
          jurusan: jurusan.nama_jurusan,
          count: count ?? 0,
        };
      })
    );

    return { data: results, error: null };
  } catch (error) {
    console.error("Error fetching students by jurusan:", error);
    return {
      data: [],
      error: null, // Return null error to prevent UI breaking
    };
  }
}

// Get available years from angkatan table or mahasiswa.angkatan column
export async function getAvailableYears() {
  try {
    const supabase = await createServerSupabaseClient();

    // Try to get from angkatan table first (master data)
    const { data: angkatanData, error: angkatanError } = await supabase
      .from("angkatan")
      .select("tahun")
      .eq("status", "Aktif")
      .order("tahun", { ascending: false });

    if (!angkatanError && angkatanData && angkatanData.length > 0) {
      const years = angkatanData.map(item => parseInt(item.tahun)).filter(year => !isNaN(year));
      return { data: years, error: null };
    }

    // Fallback: get from mahasiswa.angkatan column
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("angkatan")
      .not("angkatan", "is", null)
      .order("angkatan", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return { data: [new Date().getFullYear()], error: null };
    }

    const years = new Set<number>();
    data.forEach((item) => {
      if (item.angkatan) {
        const year = parseInt(item.angkatan);
        if (!isNaN(year)) {
          years.add(year);
        }
      }
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a);

    // If no years found, return current year
    if (sortedYears.length === 0) {
      return { data: [new Date().getFullYear()], error: null };
    }

    return { data: sortedYears, error: null };
  } catch (error) {
    console.error("Error fetching available years:", error);
    return {
      data: [new Date().getFullYear()],
      error: null, // Return null error to prevent UI breaking
    };
  }
}
