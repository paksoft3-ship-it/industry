import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function KombinListeLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />
      <Skeleton className="h-9 w-56 mb-8" variant="rect" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" variant="rect" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-6 w-3/4" variant="text" />
              <Skeleton className="h-4 w-full" variant="text" />
              <Skeleton className="h-4 w-2/3" variant="text" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-24" variant="text" />
                <Skeleton className="h-9 w-28 rounded-lg" variant="rect" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
