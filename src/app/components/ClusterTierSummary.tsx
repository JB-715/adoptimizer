import { Campaign } from '@/lib/mockData';
import React, { useEffect, useState } from 'react';
import { runKMeans } from '@/lib/kmeans';
import { TrendingUp, AlertTriangle, TrendingDown, Cpu } from 'lucide-react';
import type { DashboardFilterState } from '../page';
import Icon from '@/components/ui/AppIcon';

const CLUSTER_LABEL_MAP: Record<string, string> = {
  high: 'High Performer',
  mid: 'Needs Improvement',
  low: 'Low Performance',
};

interface Props {
  filters: DashboardFilterState;
}

export default function ClusterTierSummary({ filters }: Props) {
  const { clusterFilter, ctrMin, crMin } = filters;

  const ctrThreshold = ctrMin / 1000;
  const crThreshold = crMin / 1000;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem('adoptimizer-campaigns');
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch {
        setCampaigns([]);
      }
    }
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    if (c.ctr < ctrThreshold) return false;
    if (c.cr < crThreshold) return false;
    return true;
  });

  const points = filteredCampaigns.map((c) => ({
    id: c.id,
    name: c.name,
    ctr: c.ctr,
    cr: c.cr,
    healthScore: c.healthScore,
    impressions: c.impressions,
    clicks: c.clicks,
    conversions: c.conversions,
  }));

  const { centroids, iterations, converged } = runKMeans(points, Math.min(3, points.length || 1));

  const filteredCentroids = centroids.filter((cent) => {
    if (clusterFilter === 'all') return true;
    return cent.label === CLUSTER_LABEL_MAP[clusterFilter];
  });

  const TIER_CONFIG = {
    'High Performer': {
      icon: TrendingUp,
      color: 'text-cluster-high',
      bg: 'bg-cluster-high/10',
      border: 'border-cluster-high/20',
    },
    'Needs Improvement': {
      icon: AlertTriangle,
      color: 'text-cluster-mid',
      bg: 'bg-cluster-mid/10',
      border: 'border-cluster-mid/20',
    },
    'Low Performance': {
      icon: TrendingDown,
      color: 'text-cluster-low',
      bg: 'bg-cluster-low/10',
      border: 'border-cluster-low/20',
    },
  } as const;

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cluster Tier Summary</h3>
          <p className="text-xs text-muted-foreground mt-0.5">K-means centroid analysis</p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
          <Cpu size={11} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            {iterations} iter · {converged ? 'Converged' : 'Max iter'}
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {filteredCentroids.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground py-8">
            No tiers match the current filters.
          </div>
        ) : (
          filteredCentroids
            .sort((a, b) => b.healthScore - a.healthScore)
            .map((cent) => {
              const cfg = TIER_CONFIG[cent.label as keyof typeof TIER_CONFIG];
              const Icon = cfg?.icon ?? TrendingUp;
              return (
                <div
                  key={`tier-card-${cent.clusterId}`}
                  className={`rounded-lg border p-4 ${cfg?.bg ?? ''} ${cfg?.border ?? 'border-border'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={cfg?.color ?? 'text-foreground'} />
                      <span className={`text-xs font-semibold ${cfg?.color ?? 'text-foreground'}`}>
                        {cent.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold tabular-nums ${cfg?.color ?? 'text-foreground'}`}
                    >
                      {cent.campaignCount} campaigns
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Centroid CTR</p>
                      <p
                        className={`text-sm font-bold tabular-nums ${cfg?.color ?? 'text-foreground'}`}
                      >
                        {(cent.ctr * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Centroid CR</p>
                      <p
                        className={`text-sm font-bold tabular-nums ${cfg?.color ?? 'text-foreground'}`}
                      >
                        {(cent.cr * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Health Avg</p>
                      <p
                        className={`text-sm font-bold tabular-nums ${cfg?.color ?? 'text-foreground'}`}
                      >
                        {cent.healthScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          K-means++ initialization · 3 clusters · Euclidean distance · Features: CTR, CR, Health
          Score
        </p>
      </div>
    </div>
  );
}
