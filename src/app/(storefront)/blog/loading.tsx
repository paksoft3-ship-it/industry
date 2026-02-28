import BlogCategoryCardSkeleton from "@/components/skeletons/BlogCategoryCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Centered header */}
      <div className="text-center mb-12 space-y-3">
        <Skeleton className="h-10 w-48 mx-auto" variant="rect" />
        <Skeleton className="h-5 w-80 mx-auto" variant="text" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
