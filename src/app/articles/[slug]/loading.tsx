import { Skeleton } from "@/components/ui/Skeleton";

export default function ArticleLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-14 w-full mb-2" />
        <Skeleton className="h-14 w-3/4 mb-6" />
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-px w-full mt-8" />
      </div>

      {/* Three-column skeleton */}
      <div className="lg:grid lg:grid-cols-[220px_1fr_280px] lg:gap-12">
        {/* Left sidebar */}
        <div className="hidden lg:block space-y-3">
          <Skeleton className="h-4 w-20 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Center content */}
        <div className="space-y-4">
          <Skeleton className="h-64 md:h-96 w-full mb-6" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />
          ))}
          <Skeleton className="h-8 w-64 mt-6" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`b${i}`} className="h-4 w-full" />
          ))}
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-4 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
