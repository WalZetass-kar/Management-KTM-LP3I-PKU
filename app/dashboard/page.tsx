import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { 
  getDashboardStats, 
  getRecentActivities, 
  getStudentsByJurusanAndYear,
  getAvailableYears
} from "@/lib/dashboard";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams.year 
    ? parseInt(resolvedSearchParams.year) 
    : new Date().getFullYear();

  const [statsResult, activitiesResult, jurusanResult, yearsResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
    getStudentsByJurusanAndYear(selectedYear),
    getAvailableYears(),
  ]);

  return (
    <DashboardOverview
      stats={statsResult.data}
      activities={activitiesResult.data}
      jurusanData={jurusanResult.data}
      availableYears={yearsResult.data}
      currentYear={selectedYear}
      errorMessage={statsResult.error || activitiesResult.error || jurusanResult.error}
    />
  );
}
