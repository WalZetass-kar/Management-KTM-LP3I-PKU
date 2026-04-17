"use client";

import { StatCard } from "@/features/dashboard/components/stat-card";
import { StudentGrowthChart } from "@/features/dashboard/components/student-growth-chart";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity-list";
import type { DashboardStat, ActivityFeedItem, StudentGrowthPoint } from "@/types/dashboard";

interface DashboardOverviewProps {
  stats: DashboardStat[];
  activities: ActivityFeedItem[];
  growth: StudentGrowthPoint[];
  errorMessage?: string | null;
}

export function DashboardOverview({ stats, activities, growth, errorMessage }: DashboardOverviewProps) {
  return (
    <section className="space-y-8">
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <StudentGrowthChart data={growth} />
        <RecentActivityList activities={activities} />
      </div>
    </section>
  );
}
