import Skeleton from "@/components/ui/Skeleton";

export default function AdminDashboardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6">
      {/* 4 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" variant="text" />
              <Skeleton className="h-8 w-20" variant="rect" />
            </div>
            <Skeleton className="size-12" variant="rect" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders panel (col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Skeleton className="h-6 w-36" variant="rect" />
            <Skeleton className="h-4 w-20" variant="text" />
          </div>
          {/* Table rows */}
          <div className="px-6">
            {/* Header */}
            <div className="flex gap-4 py-3 border-b border-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 flex-1" variant="text" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="flex gap-4 py-4 border-b border-gray-50">
                {Array.from({ length: 5 }).map((_, col) => (
                  <Skeleton key={col} className="h-4 flex-1" variant="text" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Skeleton className="h-6 w-32 mb-6 mx-auto" variant="rect" />
          <div className="space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-2 mt-1.5 shrink-0" variant="circle" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" variant="text" />
                  <Skeleton className="h-3 w-3/4" variant="text" />
                  <Skeleton className="h-3 w-12" variant="text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
