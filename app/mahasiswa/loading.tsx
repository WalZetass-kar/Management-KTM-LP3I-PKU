import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function MahasiswaLoading() {
  return (
    <section className="space-y-6">
      {/* Search and Filter Card */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <Skeleton className="h-10 flex-1" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-full xl:w-40" />
        </div>
      </div>

      {/* Table */}
      <SkeletonTable rows={5} />
    </section>
  );
}
