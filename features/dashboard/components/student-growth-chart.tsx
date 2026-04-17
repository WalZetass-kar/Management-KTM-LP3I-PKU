import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentGrowthPoint } from "@/types/dashboard";

interface StudentGrowthChartProps {
  data: StudentGrowthPoint[];
}

export function StudentGrowthChart({ data }: StudentGrowthChartProps) {
  const maxStudents = Math.max(...data.map((item) => item.students), 1);

  function getBarHeightClass(studentCount: number) {
    const percentage = (studentCount / maxStudents) * 100;

    if (percentage >= 95) return "h-[95%]";
    if (percentage >= 85) return "h-[85%]";
    if (percentage >= 75) return "h-[75%]";
    if (percentage >= 65) return "h-[65%]";
    if (percentage >= 55) return "h-[55%]";
    if (percentage >= 45) return "h-[45%]";
    if (percentage >= 35) return "h-[35%]";
    if (percentage >= 25) return "h-[25%]";
    if (percentage >= 15) return "h-[15%]";
    return "h-[5%]";
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Mahasiswa Baru Tahun Ini</CardTitle>
        <CardDescription>Visualisasi pertumbuhan mahasiswa baru per bulan.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 || data.every((item) => item.students === 0) ? (
          <div className="rounded-3xl border border-dashed border-border bg-slate-50 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada data mahasiswa untuk ditampilkan.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-slate-50 p-5">
            <div className="grid h-72 grid-cols-6 items-end gap-4">
              {data.map((item) => (
                <div key={item.month} className="flex h-full flex-col items-center justify-end gap-3">
                  <div className="flex h-full w-full items-end justify-center rounded-2xl bg-white px-2 py-3 shadow-xs">
                    <div className={`w-full rounded-t-2xl bg-gradient-to-t from-primary to-blue-400 ${getBarHeightClass(item.students)}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{item.students}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
