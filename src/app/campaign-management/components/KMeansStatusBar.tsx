import { Cpu, CheckCircle } from 'lucide-react';
import type { EnrichedCampaign } from './CampaignManagementClient';

interface Props {
  campaigns: EnrichedCampaign[];
  isRerunning: boolean;
}

export default function KMeansStatusBar({ campaigns, isRerunning }: Props) {
  const high = campaigns.filter((c) => c.clusterLabel === 'High Performer').length;
  const mid = campaigns.filter((c) => c.clusterLabel === 'Needs Improvement').length;
  const low = campaigns.filter((c) => c.clusterLabel === 'Low Performance').length;
  const total = campaigns.length;

  return (
    <div className="card-elevated p-4 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-primary" />
        <span className="text-xs font-semibold text-foreground">K-means Status</span>
        {isRerunning ? (
          <span className="text-xs text-accent animate-pulse">Running…</span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-cluster-high">
            <CheckCircle size={11} />
            Converged
          </span>
        )}
      </div>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div
          className="h-2 rounded-l-full bg-cluster-high transition-all duration-500"
          style={{ width: total > 0 ? `${(high / total) * 100}%` : '0%' }}
        />
        <div
          className="h-2 bg-cluster-mid transition-all duration-500"
          style={{ width: total > 0 ? `${(mid / total) * 100}%` : '0%' }}
        />
        <div
          className="h-2 rounded-r-full bg-cluster-low transition-all duration-500"
          style={{ width: total > 0 ? `${(low / total) * 100}%` : '0%' }}
        />
      </div>

      <div className="flex items-center gap-4 text-xs flex-shrink-0">
        <span className="text-cluster-high font-medium">{high} High</span>
        <span className="text-cluster-mid font-medium">{mid} Mid</span>
        <span className="text-cluster-low font-medium">{low} Low</span>
        <span className="text-muted-foreground">· {total} total</span>
      </div>
    </div>
  );
}
