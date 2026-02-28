import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Image area */}
      <Skeleton className="aspect-square w-full" variant="rect" />
      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Skeleton className="h-3 w-16" variant="text" />
        <Skeleton className="h-5 w-full" variant="text" />
        <Skeleton className="h-5 w-3/4" variant="text" />
        <Skeleton className="h-3 w-24" variant="text" />
        <div className="mt-auto flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" variant="text" />
            <Skeleton className="h-6 w-24" variant="text" />
          </div>
          <Skeleton className="size-10" variant="rect" />
        </div>
      </div>
    </div>
  );
}
