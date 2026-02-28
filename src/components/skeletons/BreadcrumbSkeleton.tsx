import Skeleton from "@/components/ui/Skeleton";

export default function BreadcrumbSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-center gap-2 mb-8">
      <Skeleton className="h-4 w-16" variant="text" />
      <Skeleton className="h-4 w-3" variant="text" />
      <Skeleton className="h-4 w-24" variant="text" />
      <Skeleton className="h-4 w-3" variant="text" />
      <Skeleton className="h-4 w-32" variant="text" />
    </div>
  );
}
