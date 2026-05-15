'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { generateTrendData } from '@/lib/mockData';
import type { DashboardFilterState } from '../page';

const AreaChartComponent = dynamic(() => import('./TrendAreaChartInner'), { ssr: false });

const METRICS = [
  { key: 'impressions', label: 'Impressions', color: 'var(--chart-impressions)' },
  { key: 'clicks', label: 'Clicks', color: 'var(--chart-clicks)' },
  { key: 'conversions', label: 'Conversions', color: 'var(--chart-conversions)' },
];

const DATE_RANGE_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  q: 91,
};

interface Props {
  filters: DashboardFilterState;
}

export default function TrendAreaChart({ filters }: Props) {
  const [activeMetrics, setActiveMetrics] = useState(['impressions', 'clicks', 'conversions']);
  const days = DATE_RANGE_DAYS[filters.dateRange] ?? 30;
  const data = generateTrendData(days);

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const dateLabel: Record<string, string> = {
    '7d': 'last 7 days',
    '30d': 'last 30 days',
    '90d': 'last 90 days',
    q: 'this quarter',
  };

  return (
    <div className="card-elevated p-5 h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Performance Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily metrics over {dateLabel[filters.dateRange] ?? 'last 30 days'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {METRICS.map((m) => (
            <button
              key={`legend-${m.key}`}
              onClick={() => toggleMetric(m.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 border ${
                activeMetrics.includes(m.key)
                  ? 'bg-muted border-border text-foreground'
                  : 'border-transparent text-muted-foreground opacity-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <AreaChartComponent data={data} activeMetrics={activeMetrics} />
    </div>
  );
}
