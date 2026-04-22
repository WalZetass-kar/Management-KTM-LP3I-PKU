import { Badge } from "@/components/ui/badge";
import type { StudentStatus } from "@/types/student";

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const getVariant = () => {
    switch (status) {
      case "Aktif":
        return "success";
      case "Lulus":
        return "default";
      case "Cuti":
        return "warning";
      case "Tidak Aktif":
        return "destructive";
      case "Menunggu":
      default:
        return "warning";
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
}
