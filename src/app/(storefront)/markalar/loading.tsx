import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import BrandCircleSkeleton from "@/components/skeletons/BrandCircleSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function MarkalarLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <BreadcrumbSkeleton />
      <Skeleton className="h-10 w-40 mb-10" variant="rect" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <BrandCircleSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
