import Skeleton from "@/components/ui/Skeleton";

export default function BrandCircleSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-3">
      <Skeleton className="size-24" variant="circle" />
      <Skeleton className="h-4 w-20" variant="text" />
      <Skeleton className="h-3 w-14" variant="text" />
    </div>
  );
}
