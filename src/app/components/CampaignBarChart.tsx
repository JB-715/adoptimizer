'use client';
import dynamic from 'next/dynamic';
import { Campaign } from '@/lib/mockData';
import React, { useEffect, useState } from 'react';
import { runKMeans } from '@/lib/kmeans';
import type { DashboardFilterState } from '../page';

const BarChartInner = dynamic(() => import('./CampaignBarChartInner'), { ssr: false });

const CLUSTER_LABEL_MAP: Record<string, string> = {
  high: 'High Performer',
  mid: 'Needs Improvement',
  low: 'Low Performance',
};

interface Props {
  filters: DashboardFilterState;
}

export default function CampaignBarChart({ filters }: Props) {
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

  const { results } = runKMeans(points, Math.min(3, points.length || 1));

  const barData = filteredCampaigns
    .map((c) => {
      const r = results?.find((res) => res?.campaignId === c?.id);
      return {
        id: c.id,
        name: c.name.length > 22 ? c.name.slice(0, 22) + '…' : c.name,
        fullName: c.name,
        healthScore: c.healthScore,
        label: r?.label ?? 'Needs Improvement',
      };
    })
    .filter((c) => {
      if (clusterFilter === 'all') return true;
      return c.label === CLUSTER_LABEL_MAP[clusterFilter];
    })
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 10);

  return (
    <div className="card-elevated p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Campaign Health Ranking</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top {barData.length} by weighted funnel health score
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          Sorted: Highest → Lowest
        </span>
      </div>
      {barData.length === 0 ? (
        <div className="flex items-center justify-center h-[260px] text-xs text-muted-foreground">
          No campaigns match the current filters.
        </div>
      ) : (
        <BarChartInner data={barData} />
      )}
    </div>
  );
}
