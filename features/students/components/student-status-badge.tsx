import { Badge } from "@/components/ui/badge";
import type { StudentStatus } from "@/types/student";

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return <Badge variant={status === "Aktif" ? "success" : "warning"}>{status}</Badge>;
}
