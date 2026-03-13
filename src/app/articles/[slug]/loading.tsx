import { Skeleton } from "@/components/ui/Skeleton";

export default function ArticleLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-20 mb-4" />
      <Skeleton className="h-12 w-full mb-2" />
      <Skeleton className="h-12 w-3/4 mb-6" />
      <Skeleton className="h-4 w-48 mb-10" />
      <Skeleton className="h-64 md:h-96 w-full mb-10" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-8 w-64 mt-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
