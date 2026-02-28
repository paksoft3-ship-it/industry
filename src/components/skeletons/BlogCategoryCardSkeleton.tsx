import Skeleton from "@/components/ui/Skeleton";

export default function BlogCategoryCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <Skeleton className="aspect-video w-full" variant="rect" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        <Skeleton className="h-3 w-20" variant="text" />
      </div>
    </div>
  );
}
