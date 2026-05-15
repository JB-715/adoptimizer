'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardFilters from './components/DashboardFilters';
import KPIBentoGrid from './components/KPIBentoGrid';
import TrendAreaChart from './components/TrendAreaChart';
import ClusterScatterChart from './components/ClusterScatterChart';
import CampaignBarChart from './components/CampaignBarChart';
import ClusterTierSummary from './components/ClusterTierSummary';

export interface DashboardFilterState {
  dateRange: string;
  clusterFilter: string;
  ctrMin: number;
  crMin: number;
}

export default function AdPerformanceDashboard() {
  const [filters, setFilters] = useState<DashboardFilterState>({
    dateRange: '30d',
    clusterFilter: 'all',
    ctrMin: 0,
    crMin: 0,
  });

  return (
    <AppLayout activeRoute="/">
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Ad Performance Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              K-means cluster analysis across all active campaigns · Last updated May 13, 2026 at
              08:44
            </p>
          </div>
        </div>

        {/* Filters */}
        <DashboardFilters filters={filters} onChange={setFilters} />

        {/* KPI Bento Grid */}
        <KPIBentoGrid filters={filters} />

        {/* Charts row 1: trend + scatter */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3">
            <TrendAreaChart filters={filters} />
          </div>
          <div className="xl:col-span-2">
            <ClusterScatterChart filters={filters} />
          </div>
        </div>

        {/* Charts row 2: bar + cluster summary */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3">
            <CampaignBarChart filters={filters} />
          </div>
          <div className="xl:col-span-2">
            <ClusterTierSummary filters={filters} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
