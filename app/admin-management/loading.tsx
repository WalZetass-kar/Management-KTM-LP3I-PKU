import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminManagementLoading() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-8 w-48" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Table */}
      <SkeletonTable rows={5} />
    </section>
  );
}
