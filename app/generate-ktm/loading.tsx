import { Skeleton, SkeletonKTMCard } from "@/components/ui/skeleton";

export default function GenerateKtmLoading() {
  return (
    <section className="space-y-6">
      {/* Search and Filter */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full lg:w-48" />
          <Skeleton className="h-10 w-full lg:w-48" />
        </div>
      </div>

      {/* KTM Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonKTMCard />
        <SkeletonKTMCard />
        <SkeletonKTMCard />
        <SkeletonKTMCard />
        <SkeletonKTMCard />
        <SkeletonKTMCard />
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
      </div>
    </section>
  );
}
