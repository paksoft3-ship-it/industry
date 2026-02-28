import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: image + thumbnails */}
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded-2xl" variant="rect" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-20 rounded-xl" variant="rect" />
            ))}
          </div>
        </div>

        {/* Right: title / price / specs / CTA */}
        <div className="space-y-5">
          <Skeleton className="h-5 w-24" variant="text" />
          <Skeleton className="h-10 w-full" variant="rect" />
          <Skeleton className="h-10 w-3/4" variant="rect" />
          <Skeleton className="h-6 w-32" variant="text" />
          <Skeleton className="h-10 w-36" variant="rect" />
          <div className="space-y-2 pt-4 border-t border-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-28" variant="text" />
                <Skeleton className="h-4 w-40" variant="text" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" variant="rect" />
            <Skeleton className="h-12 w-12 rounded-xl" variant="rect" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28" variant="rect" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" variant="rect" />
    </div>
  );
}
