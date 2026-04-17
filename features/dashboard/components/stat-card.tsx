import { CheckCircle2, Clock3, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardIconKey, DashboardStat } from "@/types/dashboard";

const iconMap: Record<DashboardIconKey, typeof Users> = {
  students: Users,
  pending: Clock3,
  approved: CheckCircle2,
  new: TrendingUp,
};

const accentClasses: Record<DashboardIconKey, string> = {
  students: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  new: "bg-violet-50 text-violet-700",
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = iconMap[stat.icon];

  return (
    <Card className="border-white/80 bg-white">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{stat.title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
          <p className={stat.trend === "increase" ? "text-sm text-green-600" : "text-sm text-red-600"}>
            {stat.change} dibanding bulan lalu
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[stat.icon]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
