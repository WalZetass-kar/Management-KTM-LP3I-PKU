import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardStats, getRecentActivities, getStudentGrowth } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [statsResult, activitiesResult, growthResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
    getStudentGrowth(),
  ]);

  return (
    <DashboardOverview
      stats={statsResult.data}
      activities={activitiesResult.data}
      growth={growthResult.data}
      errorMessage={statsResult.error || activitiesResult.error || growthResult.error}
    />
  );
}
