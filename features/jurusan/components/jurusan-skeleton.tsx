import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export function JurusanSkeleton() {
  return (
    <section className="space-y-6">
      {/* Search and Add Button */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full xl:w-40" />
        </div>
      </div>

      {/* Table */}
      <SkeletonTable rows={5} />
    </section>
  );
}
