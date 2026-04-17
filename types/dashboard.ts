export type DashboardTrend = "increase" | "decrease";
export type DashboardIconKey = "students" | "pending" | "approved" | "new";
export type ActivityStatus = "success" | "pending" | "info";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: DashboardTrend;
  icon: DashboardIconKey;
}

export interface StudentGrowthPoint {
  month: string;
  students: number;
}

export interface ActivityFeedItem {
  id: number;
  fullName: string;
  nim: string;
  action: string;
  timeLabel: string;
  status: ActivityStatus;
}
