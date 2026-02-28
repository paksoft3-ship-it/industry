import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function MarkaLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />

      {/* Brand header: logo + info */}
      <div className="flex items-center gap-6 mb-10 p-6 bg-white rounded-2xl border border-gray-100">
        <Skeleton className="size-24 rounded-xl" variant="rect" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" variant="rect" />
          <Skeleton className="h-4 w-64" variant="text" />
          <Skeleton className="h-4 w-40" variant="text" />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
