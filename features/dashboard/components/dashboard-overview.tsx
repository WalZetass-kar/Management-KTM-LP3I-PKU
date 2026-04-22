"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity-list";
import { JurusanChart } from "@/features/dashboard/components/jurusan-chart";
import type { DashboardStat, ActivityFeedItem, JurusanChartData } from "@/types/dashboard";

interface DashboardOverviewProps {
  stats: DashboardStat[];
  activities: ActivityFeedItem[];
  jurusanData: JurusanChartData[];
  availableYears: number[];
  currentYear: number;
  errorMessage?: string | null;
}

export function DashboardOverview({ 
  stats, 
  activities, 
  jurusanData, 
  availableYears, 
  currentYear, 
  errorMessage 
}: DashboardOverviewProps) {
  return (
    <section className="space-y-8">
      {/* Landing Page Button */}
      <div className="flex justify-end">
        <Link href="/" target="_blank">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Lihat Landing Page
          </Button>
        </Link>
      </div>

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

      <div className="grid gap-6">
        <RecentActivityList activities={activities} />
      </div>

      {/* Grafik Jurusan */}
      <JurusanChart 
        data={jurusanData} 
        availableYears={availableYears} 
        currentYear={currentYear} 
      />
    </section>
  );
}
