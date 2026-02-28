import Skeleton from "@/components/ui/Skeleton";

export default function DosyaMerkeziLoading() {
  return (
    <div aria-hidden="true" className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-44" variant="rect" />
        <Skeleton className="h-10 w-32" variant="rect" />
      </div>

      {/* Upload zone */}
      <Skeleton className="h-36 w-full rounded-2xl" variant="rect" />

      {/* Filter / search bar */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" variant="rect" />
        <Skeleton className="h-10 w-28" variant="rect" />
      </div>

      {/* Media grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" variant="rect" />
        ))}
      </div>
    </div>
  );
}
