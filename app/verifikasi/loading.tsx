import { Skeleton } from "@/components/ui/skeleton";

export default function VerifikasiLoading() {
  return (
    <section className="space-y-6">
      {/* Input Card */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Result Card Placeholder */}
      <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-12 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-6 w-64" />
        <Skeleton className="mx-auto mt-2 h-4 w-96" />
      </div>
    </section>
  );
}
