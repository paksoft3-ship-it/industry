import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function IletisimLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />
      <Skeleton className="h-9 w-44 mb-10" variant="rect" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: form fields */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-lg" variant="rect" />
            <Skeleton className="h-12 rounded-lg" variant="rect" />
          </div>
          <Skeleton className="h-12 rounded-lg w-full" variant="rect" />
          <Skeleton className="h-12 rounded-lg w-full" variant="rect" />
          <Skeleton className="h-36 rounded-lg w-full" variant="rect" />
          <Skeleton className="h-12 rounded-lg w-40" variant="rect" />
        </div>

        {/* Right: info cards + map */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <Skeleton className="size-12 rounded-xl" variant="rect" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" variant="text" />
                <Skeleton className="h-4 w-48" variant="text" />
              </div>
            </div>
          ))}
          <Skeleton className="h-48 rounded-xl w-full mt-4" variant="rect" />
        </div>
      </div>
    </div>
  );
}
