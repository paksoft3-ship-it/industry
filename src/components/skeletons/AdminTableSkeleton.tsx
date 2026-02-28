import Skeleton from "@/components/ui/Skeleton";

interface AdminTableSkeletonProps {
  cols?: number;
  rows?: number;
  showStatusTabs?: boolean;
}

export default function AdminTableSkeleton({
  cols = 6,
  rows = 8,
  showStatusTabs = false,
}: AdminTableSkeletonProps) {
  return (
    <div aria-hidden="true" className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" variant="rect" />
        <Skeleton className="h-10 w-36" variant="rect" />
      </div>

      {/* Status tabs */}
      {showStatusTabs && (
        <div className="flex gap-2 border-b border-gray-100 pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" variant="rect" />
          ))}
        </div>
      )}

      {/* Search / filter bar */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" variant="rect" />
        <Skeleton className="h-10 w-28" variant="rect" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Header row */}
        <div className="flex gap-4 px-6 py-3 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ flex: i === 0 ? 2 : 1 }} variant="text" />
          ))}
        </div>
        {/* Body rows */}
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-4 px-6 py-4 border-b border-gray-50">
            {Array.from({ length: cols }).map((_, col) => (
              <Skeleton key={col} className="h-4" style={{ flex: col === 0 ? 2 : 1 }} variant="text" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
