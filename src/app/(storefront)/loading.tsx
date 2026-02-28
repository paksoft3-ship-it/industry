import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

export default function HomeLoading() {
  return (
    <div aria-hidden="true">
      {/* Hero banner */}
      <Skeleton className="w-full h-[420px] md:h-[520px] rounded-none" variant="rect" />

      {/* Trust badges overlay strip */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <Skeleton className="h-20 w-full rounded-2xl" variant="rect" />
      </div>

      {/* Category circles */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-48 mb-8" variant="rect" />
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="size-16 md:size-20" variant="circle" />
              <Skeleton className="h-3 w-16" variant="text" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-56 mb-8" variant="rect" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Brand logos strip */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-40 mb-8 mx-auto" variant="rect" />
        <div className="flex gap-8 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-28 shrink-0" variant="rect" />
          ))}
        </div>
      </div>
    </div>
  );
}
