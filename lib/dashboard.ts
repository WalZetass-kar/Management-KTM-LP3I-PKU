import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardStat, ActivityFeedItem, StudentGrowthPoint } from "@/types/dashboard";

export async function getDashboardStats() {
  try {
    const supabase = await createServerSupabaseClient();

    // Try mahasiswa_angkatan first, fallback to mahasiswa
    let totalCount = 0;
    let pendingCount = 0;
    let activeCount = 0;
    let thisMonthCount = 0;

    // Try mahasiswa_angkatan table first
    try {
      const { count: totalCountAngkatan, error: totalErrorAngkatan } = await supabase
        .from("mahasiswa_angkatan")
        .select("*", { count: "exact", head: true });

      if (!totalErrorAngkatan) {
        totalCount = totalCountAngkatan ?? 0;

        // Get mahasiswa menunggu
        const { count: pendingCountAngkatan, error: pendingErrorAngkatan } = await supabase
          .from("mahasiswa_angkatan")
          .select("*", { count: "exact", head: true })
          .eq("status", "Menunggu");

        if (!pendingErrorAngkatan) pendingCount = pendingCountAngkatan ?? 0;

        // Get mahasiswa aktif
        const { count: activeCountAngkatan, error: activeErrorAngkatan } = await supabase
          .from("mahasiswa_angkatan")
          .select("*", { count: "exact", head: true })
          .eq("status", "Aktif");

        if (!activeErrorAngkatan) activeCount = activeCountAngkatan ?? 0;

        // Get mahasiswa bulan ini
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: thisMonthCountAngkatan, error: monthErrorAngkatan } = await supabase
          .from("mahasiswa_angkatan")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString());

        if (!monthErrorAngkatan) thisMonthCount = thisMonthCountAngkatan ?? 0;
      }
    } catch (angkatanError) {
      console.log("mahasiswa_angkatan table not available, trying mahasiswa table");
      
      // Fallback to mahasiswa table
      try {
        const { count: totalCountMhs, error: totalErrorMhs } = await supabase
          .from("mahasiswa")
          .select("*", { count: "exact", head: true });

        if (!totalErrorMhs) totalCount = totalCountMhs ?? 0;

        const { count: pendingCountMhs, error: pendingErrorMhs } = await supabase
          .from("mahasiswa")
          .select("*", { count: "exact", head: true })
          .eq("status", "Menunggu");

        if (!pendingErrorMhs) pendingCount = pendingCountMhs ?? 0;

        const { count: activeCountMhs, error: activeErrorMhs } = await supabase
          .from("mahasiswa")
          .select("*", { count: "exact", head: true })
          .eq("status", "Aktif");

        if (!activeErrorMhs) activeCount = activeCountMhs ?? 0;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: thisMonthCountMhs, error: monthErrorMhs } = await supabase
          .from("mahasiswa")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString());

        if (!monthErrorMhs) thisMonthCount = thisMonthCountMhs ?? 0;
      } catch (mahasiswaError) {
        console.log("Both tables not available, using default values");
      }
    }

    const stats: DashboardStat[] = [
      {
        title: "Total Mahasiswa",
        value: String(totalCount),
        change: "+0%",
        trend: "increase",
        icon: "students",
      },
      {
        title: "Menunggu Verifikasi",
        value: String(pendingCount),
        change: "-0%",
        trend: "decrease",
        icon: "pending",
      },
      {
        title: "Disetujui",
        value: String(activeCount),
        change: "+0%",
        trend: "increase",
        icon: "approved",
      },
      {
        title: "Baru Bulan Ini",
        value: String(thisMonthCount),
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

    let students: any[] = [];

    // Try mahasiswa_angkatan first
    try {
      const { data: studentsAngkatan, error: errorAngkatan } = await supabase
        .from("mahasiswa_angkatan")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!errorAngkatan && studentsAngkatan) {
        students = studentsAngkatan.map(s => ({
          ...s,
          nama: s.full_name, // Map full_name to nama for consistency
        }));
      }
    } catch (angkatanError) {
      console.log("mahasiswa_angkatan not available, trying mahasiswa");
      
      // Fallback to mahasiswa table
      try {
        const { data: studentsMhs, error: errorMhs } = await supabase
          .from("mahasiswa")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (!errorMhs && studentsMhs) {
          students = studentsMhs;
        }
      } catch (mahasiswaError) {
        console.log("Both tables not available");
      }
    }

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
        fullName: student.nama || student.full_name,
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


// Get mahasiswa per jurusan per tahun
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

    // Get mahasiswa count per jurusan untuk tahun tertentu
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const results = await Promise.all(
      (jurusanList || []).map(async (jurusan) => {
        let count = 0;

        // Try mahasiswa_angkatan first
        try {
          const { count: countAngkatan, error: errorAngkatan } = await supabase
            .from("mahasiswa_angkatan")
            .select("*", { count: "exact", head: true })
            .eq("study_program", jurusan.nama_jurusan)
            .gte("created_at", startDate.toISOString())
            .lte("created_at", endDate.toISOString());

          if (!errorAngkatan) {
            count = countAngkatan ?? 0;
          }
        } catch (angkatanError) {
          // Fallback to mahasiswa table
          try {
            const { count: countMhs, error: errorMhs } = await supabase
              .from("mahasiswa")
              .select("*", { count: "exact", head: true })
              .eq("jurusan", jurusan.nama_jurusan)
              .gte("created_at", startDate.toISOString())
              .lte("created_at", endDate.toISOString());

            if (!errorMhs) {
              count = countMhs ?? 0;
            }
          } catch (mahasiswaError) {
            console.log("Both tables not available for jurusan data");
          }
        }

        return {
          jurusan: jurusan.nama_jurusan,
          count,
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

// Get available years from mahasiswa data
export async function getAvailableYears() {
  try {
    const supabase = await createServerSupabaseClient();

    let data: any[] = [];

    // Try mahasiswa_angkatan first
    try {
      const { data: dataAngkatan, error: errorAngkatan } = await supabase
        .from("mahasiswa_angkatan")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (!errorAngkatan && dataAngkatan) {
        data = dataAngkatan;
      }
    } catch (angkatanError) {
      // Fallback to mahasiswa table
      try {
        const { data: dataMhs, error: errorMhs } = await supabase
          .from("mahasiswa")
          .select("created_at")
          .order("created_at", { ascending: true });

        if (!errorMhs && dataMhs) {
          data = dataMhs;
        }
      } catch (mahasiswaError) {
        console.log("Both tables not available for years");
      }
    }

    if (!data || data.length === 0) {
      return { data: [new Date().getFullYear()], error: null };
    }

    const years = new Set<number>();
    data.forEach((item) => {
      const year = new Date(item.created_at).getFullYear();
      years.add(year);
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a);

    return { data: sortedYears, error: null };
  } catch (error) {
    console.error("Error fetching available years:", error);
    return {
      data: [new Date().getFullYear()],
      error: null, // Return null error to prevent UI breaking
    };
  }
}
