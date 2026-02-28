import Skeleton from "@/components/ui/Skeleton";

export default function AyarlarLoading() {
  return (
    <div aria-hidden="true" className="space-y-6">
      <Skeleton className="h-8 w-36" variant="rect" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-6 w-48" variant="rect" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <Skeleton className="h-4 w-24" variant="text" />
                <Skeleton className="h-11 w-full rounded-lg" variant="rect" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Skeleton className="h-11 w-32 rounded-lg" variant="rect" />
    </div>
  );
}
