
interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} style={style} />;
}

export function KPICardSkeleton() {
  return (
    <div className="card-elevated p-5">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="card-elevated p-5">
      <div className="flex justify-between mb-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <Skeleton className={`w-full rounded-lg`} style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="p-5 border-b border-border">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={`skel-row-${i + 1}`} className="flex items-center gap-4 px-5 py-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
