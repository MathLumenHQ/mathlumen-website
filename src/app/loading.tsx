import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Skeleton className="h-12 w-64 mb-8" />
      <Skeleton className="h-6 w-96 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
