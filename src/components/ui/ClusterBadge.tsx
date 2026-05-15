import type { ClusterLabel } from '@/lib/kmeans';

interface ClusterBadgeProps {
  label: ClusterLabel | string;
  size?: 'sm' | 'md';
}

export default function ClusterBadge({ label, size = 'md' }: ClusterBadgeProps) {
  const cls =
    label === 'High Performer'
      ? 'cluster-badge-high'
      : label === 'Needs Improvement'
        ? 'cluster-badge-mid'
        : 'cluster-badge-low';

  const dot =
    label === 'High Performer'
      ? 'bg-cluster-high'
      : label === 'Needs Improvement'
        ? 'bg-cluster-mid'
        : 'bg-cluster-low';

  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium ${cls} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
