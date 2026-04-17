import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: "admin" | "super_admin";
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const isSuperAdmin = role === "super_admin";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        isSuperAdmin
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700",
        className
      )}
    >
      {isSuperAdmin ? (
        <Shield className="h-3.5 w-3.5" />
      ) : (
        <User className="h-3.5 w-3.5" />
      )}
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}
