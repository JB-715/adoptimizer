import { Eye, MousePointerClick, Target, Percent, Activity, Flame } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import { Campaign } from '@/lib/mockData';
import React, { useEffect, useState } from 'react';
import { runKMeans } from '@/lib/kmeans';
import type { DashboardFilterState } from '../page';

const CLUSTER_LABEL_MAP: Record<string, string> = {
  high: 'High Performer',
  mid: 'Needs Improvement',
  low: 'Low Performance',
};

interface Props {
  filters: DashboardFilterState;
}

export default function KPIBentoGrid({ filters }: Props) {
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

  const campaignsWithLabels = filteredCampaigns.map((c) => {
    const r = results?.find((res) => res?.campaignId === c?.id);
    return { ...c, label: r?.label ?? 'Needs Improvement' };
  });

  const visibleCampaigns =
    clusterFilter === 'all'
      ? campaignsWithLabels
      : campaignsWithLabels.filter((c) => c.label === CLUSTER_LABEL_MAP[clusterFilter]);

  const totalImpressions = visibleCampaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = visibleCampaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = visibleCampaigns.reduce((s, c) => s + c.conversions, 0);
  const avgCTR =
    visibleCampaigns.length > 0
      ? visibleCampaigns.reduce((s, c) => s + c.ctr, 0) / visibleCampaigns.length
      : 0;
  const avgCR =
    visibleCampaigns.length > 0
      ? visibleCampaigns.reduce((s, c) => s + c.cr, 0) / visibleCampaigns.length
      : 0;
  const avgHealth =
    visibleCampaigns.length > 0
      ? visibleCampaigns.reduce((s, c) => s + c.healthScore, 0) / visibleCampaigns.length
      : 0;

  const highCount = campaignsWithLabels.filter((c) => c.label === 'High Performer').length;
  const midCount = campaignsWithLabels.filter((c) => c.label === 'Needs Improvement').length;
  const lowCount = campaignsWithLabels.filter((c) => c.label === 'Low Performance').length;

  function formatLarge(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString();
  }

  const campaignCount = visibleCampaigns.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {/* Hero: Total Impressions */}
      <div className="sm:col-span-2 lg:col-span-2 2xl:col-span-2">
        <MetricCard
          label="Total Impressions"
          value={formatLarge(totalImpressions)}
          subValue={`Across ${campaignCount} campaign${campaignCount !== 1 ? 's' : ''} · May 2026`}
          delta={8.4}
          deltaLabel="vs last 30d"
          icon={<Eye size={16} className="text-chart-impressions" />}
          accentClass="gradient-indigo"
          hero
        />
      </div>

      {/* Total Clicks */}
      <div>
        <MetricCard
          label="Total Clicks"
          value={formatLarge(totalClicks)}
          subValue={
            campaignCount > 0
              ? `Avg ${formatLarge(Math.round(totalClicks / campaignCount))} / campaign`
              : 'No campaigns'
          }
          delta={5.2}
          deltaLabel="vs last 30d"
          icon={<MousePointerClick size={16} className="text-cluster-high" />}
          accentClass="gradient-emerald"
        />
      </div>

      {/* Total Conversions */}
      <div>
        <MetricCard
          label="Total Conversions"
          value={formatLarge(totalConversions)}
          subValue={
            campaignCount > 0
              ? `Avg ${formatLarge(Math.round(totalConversions / campaignCount))} / campaign`
              : 'No campaigns'
          }
          delta={11.7}
          deltaLabel="vs last 30d"
          icon={<Target size={16} className="text-accent" />}
          accentClass="gradient-amber"
        />
      </div>

      {/* Avg CTR */}
      <div>
        <MetricCard
          label="Avg CTR"
          value={`${(avgCTR * 100).toFixed(2)}%`}
          subValue="Industry benchmark: 3.17%"
          delta={-4.3}
          deltaLabel="vs last 30d"
          icon={<Percent size={16} className="text-cluster-low" />}
          accentClass="gradient-rose"
        />
      </div>

      {/* Avg CR */}
      <div>
        <MetricCard
          label="Avg Conv. Rate"
          value={`${(avgCR * 100).toFixed(2)}%`}
          subValue="Clicks → Conversions"
          delta={2.8}
          deltaLabel="vs last 30d"
          icon={<Activity size={16} className="text-chart-impressions" />}
          accentClass="gradient-indigo"
        />
      </div>

      {/* Funnel Health Score */}
      <div className="sm:col-span-2 lg:col-span-3 2xl:col-span-3">
        <div className="card-elevated card-hover gradient-emerald p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2 rounded-md bg-muted/60">
            <Flame size={20} className="text-cluster-high" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Weighted Funnel Health Score
            </p>
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-bold text-foreground tabular-nums">
                {avgHealth.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
              <span className="text-xs font-medium text-cluster-high flex items-center gap-1 mb-1">
                +3.1% vs last period
              </span>
            </div>
          </div>
          {/* Mini tier distribution */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-lg font-bold text-cluster-high tabular-nums">{highCount}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-lg font-bold text-cluster-mid tabular-nums">{midCount}</div>
              <div className="text-xs text-muted-foreground">Mid</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-lg font-bold text-cluster-low tabular-nums">{lowCount}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </div>
          {/* Health bar */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Portfolio Health</span>
              <span className="text-cluster-high font-medium">{avgHealth.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cluster-high rounded-full transition-all duration-700"
                style={{ width: `${Math.min(avgHealth, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
