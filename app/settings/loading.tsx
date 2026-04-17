import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <section className="space-y-6">
      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-6 space-y-4">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-1 h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-1 h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
