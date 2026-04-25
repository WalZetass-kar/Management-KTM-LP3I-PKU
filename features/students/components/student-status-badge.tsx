import { Badge } from "@/components/ui/badge";
import type { StudentStatus } from "@/types/student";

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const getVariant = () => {
    switch (status) {
      case "Aktif":
        return "success" as const;
      case "Lulus":
        return "info" as const;
      case "Cuti":
        return "warning" as const;
      case "Tidak Aktif":
        return "neutral" as const;
      case "Menunggu":
      default:
        return "warning" as const;
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
}
