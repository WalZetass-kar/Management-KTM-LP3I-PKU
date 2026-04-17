import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityFeedItem } from "@/types/dashboard";

const statusClasses = {
  success: "bg-green-500",
  pending: "bg-amber-500",
  info: "bg-blue-500",
};

interface RecentActivityListProps {
  activities: ActivityFeedItem[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Riwayat singkat proses KTM dan pembaruan mahasiswa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada aktivitas untuk ditampilkan.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 border-b border-border/80 pb-4 last:border-b-0 last:pb-0">
              <span className={`mt-2 h-2.5 w-2.5 rounded-full ${statusClasses[activity.status]}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{activity.fullName}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{activity.nim}</p>
                <p className="mt-2 text-sm text-muted-foreground">{activity.action}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.timeLabel}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
