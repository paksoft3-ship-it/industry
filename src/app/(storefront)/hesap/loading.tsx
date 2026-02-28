import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function HesapLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />

      {/* Avatar + name */}
      <div className="flex items-center gap-5 mb-10">
        <Skeleton className="size-16" variant="circle" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" variant="rect" />
          <Skeleton className="h-4 w-56" variant="text" />
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" variant="rect" />
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-36" variant="rect" />
        </div>
        <div className="px-6">
          <div className="flex gap-4 py-3 border-b border-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" variant="text" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="flex gap-4 py-4 border-b border-gray-50">
              {Array.from({ length: 5 }).map((_, col) => (
                <Skeleton key={col} className="h-4 flex-1" variant="text" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
