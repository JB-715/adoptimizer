'use client';
import dynamic from 'next/dynamic';
import { Campaign } from '@/lib/mockData';
import React, { useEffect, useState } from 'react';
import { runKMeans } from '@/lib/kmeans';
import type { DashboardFilterState } from '../page';

const ScatterInner = dynamic(() => import('./ClusterScatterChartInner'), { ssr: false });

const CLUSTER_LABEL_MAP: Record<string, string> = {
  high: 'High Performer',
  mid: 'Needs Improvement',
  low: 'Low Performance',
};

interface Props {
  filters: DashboardFilterState;
}

export default function ClusterScatterChart({ filters }: Props) {
  const { clusterFilter, ctrMin, crMin } = filters;

  // Apply CTR/CR threshold filters (ctrMin/crMin are 0-100 representing 0%-10%)
  const ctrThreshold = ctrMin / 1000; // convert to decimal (e.g. 50 → 0.05)
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

  const { results, centroids } = runKMeans(points, Math.min(3, points.length || 1));

  const scatterData = filteredCampaigns
    .map((c) => {
      const r = results?.find((res) => res?.campaignId === c?.id);
      return {
        id: c.id,
        name: c.name,
        ctr: parseFloat((c.ctr * 100).toFixed(2)),
        cr: parseFloat((c.cr * 100).toFixed(2)),
        healthScore: c.healthScore,
        label: r?.label ?? 'Needs Improvement',
      };
    })
    .filter((c) => {
      if (clusterFilter === 'all') return true;
      return c.label === CLUSTER_LABEL_MAP[clusterFilter];
    });

  const centroidPoints = centroids?.map((cent) => ({
    id: `centroid-${cent?.clusterId}`,
    ctr: parseFloat((cent?.ctr * 100)?.toFixed(2)),
    cr: parseFloat((cent?.cr * 100)?.toFixed(2)),
    label: cent?.label,
    isCentroid: true,
  }));

  return (
    <div className="card-elevated p-5 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">K-means Cluster Map</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          CTR vs CR — colored by performance tier
        </p>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: 'High Performer', color: 'var(--cluster-high)' },
          { label: 'Needs Improvement', color: 'var(--cluster-mid)' },
          { label: 'Low Performance', color: 'var(--cluster-low)' },
          { label: 'Centroid ✕', color: '#ffffff' },
        ]?.map((l) => (
          <div key={`scatter-legend-${l?.label}`} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l?.color }} />
            <span className="text-xs text-muted-foreground">{l?.label}</span>
          </div>
        ))}
      </div>
      {scatterData.length === 0 ? (
        <div className="flex items-center justify-center h-[240px] text-xs text-muted-foreground">
          No campaigns match the current filters.
        </div>
      ) : (
        <ScatterInner campaigns={scatterData} centroids={centroidPoints} />
      )}
    </div>
  );
}
