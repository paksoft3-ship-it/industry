import BreadcrumbSkeleton from "@/components/skeletons/BreadcrumbSkeleton";
import BlogPostCardSkeleton from "@/components/skeletons/BlogPostCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogCategoryLoading() {
  return (
    <div aria-hidden="true" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbSkeleton />
      <div className="mb-10 space-y-3">
        <Skeleton className="h-9 w-64" variant="rect" />
        <Skeleton className="h-5 w-96" variant="text" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogPostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
