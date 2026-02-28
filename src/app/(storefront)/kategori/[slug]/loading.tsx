import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />

      {/* Category hero banner */}
      <Skeleton className="w-full h-48 md:h-64 mb-10" variant="rect" />

      {/* Sub-category tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" variant="rect" />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <Skeleton className="h-7 w-24 mb-2" variant="rect" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" variant="rect" />
          ))}
        </aside>

        {/* Product grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
