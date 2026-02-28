import Skeleton from "@/components/ui/Skeleton";

export default function BlogPostCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      <Skeleton className="aspect-video w-full" variant="rect" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" variant="rect" />
          <Skeleton className="h-3 w-24" variant="text" />
        </div>
        <Skeleton className="h-6 w-full" variant="text" />
        <Skeleton className="h-6 w-4/5" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-3/4" variant="text" />
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Skeleton className="size-8" variant="circle" />
          <Skeleton className="h-4 w-28" variant="text" />
        </div>
      </div>
    </div>
  );
}
