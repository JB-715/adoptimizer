'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TrendAreaChartInner = dynamic(
  () => import('./TrendAreaChartInner'),
  { ssr: false }
);

interface Campaign {
  id?: string;
  name?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  createdAt?: string;
}

interface TrendAreaChartProps {
  filters: {
    dateRange: string;
    clusterFilter: string;
    ctrMin: number;
    crMin: number;
  };
}

export default function TrendAreaChart({
  filters,
}: TrendAreaChartProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [activeMetrics] = useState<string[]>([
    'impressions',
    'clicks',
    'conversions',
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('adoptimizer-campaigns');

    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch {
        setCampaigns([]);
      }
    }
  }, []);

  const trendData =
    campaigns.length === 0
      ? []
      : campaigns.map((campaign, index) => ({
          date: campaign.createdAt || `Day ${index + 1}`,
          impressions: Number(campaign.impressions || 0),
          clicks: Number(campaign.clicks || 0),
          conversions: Number(campaign.conversions || 0),
        }));

  return (
    <TrendAreaChartInner
      data={trendData}
      activeMetrics={activeMetrics}
    />
  );
}