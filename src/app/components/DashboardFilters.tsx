'use client';
import React, { useState } from 'react';
import { Calendar, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { DashboardFilterState } from '../page';

const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This quarter', value: 'q' },
];

const CLUSTER_FILTERS = [
  { label: 'All tiers', value: 'all' },
  { label: 'High Performer', value: 'high' },
  { label: 'Needs Improvement', value: 'mid' },
  { label: 'Low Performance', value: 'low' },
];

interface Props {
  filters: DashboardFilterState;
  onChange: (filters: DashboardFilterState) => void;
}

export default function DashboardFilters({ filters, onChange }: Props) {
  const { dateRange, clusterFilter, ctrMin, crMin } = filters;
  const [showSliders, setShowSliders] = React.useState(false);

  const update = (partial: Partial<DashboardFilterState>) => onChange({ ...filters, ...partial });

  return (
    <div className="card-elevated p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Date range */}
        <div className="flex items-center gap-1.5 bg-muted rounded-lg p-1">
          <Calendar size={14} className="text-muted-foreground ml-1" />
          {DATE_RANGES?.map((r) => (
            <button
              key={`dr-${r?.value}`}
              onClick={() => update({ dateRange: r.value })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                dateRange === r?.value
                  ? 'bg-secondary text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r?.label}
            </button>
          ))}
        </div>

        {/* Cluster filter */}
        <div className="flex items-center gap-1.5 bg-muted rounded-lg p-1">
          <Filter size={14} className="text-muted-foreground ml-1" />
          {CLUSTER_FILTERS?.map((f) => (
            <button
              key={`cf-${f?.value}`}
              onClick={() => update({ clusterFilter: f.value })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                clusterFilter === f?.value
                  ? 'bg-secondary text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f?.label}
            </button>
          ))}
        </div>

        {/* Threshold sliders toggle */}
        <button
          onClick={() => setShowSliders(!showSliders)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 btn-secondary ${showSliders ? 'ring-1 ring-primary/40' : ''}`}
        >
          <SlidersHorizontal size={13} />
          Thresholds
          <ChevronDown
            size={12}
            className={`transition-transform duration-150 ${showSliders ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {/* Sliders panel */}
      {showSliders && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-border animate-slide-up">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Min CTR Threshold</label>
              <span className="text-xs font-semibold text-primary tabular-nums">
                {(ctrMin / 10)?.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={ctrMin}
              onChange={(e) => update({ ctrMin: Number(e.target.value) })}
              className="w-full h-1 appearance-none rounded-full cursor-pointer accent-primary"
              aria-label="Minimum CTR threshold"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0%</span>
              <span className="text-xs text-muted-foreground">10%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Min CR Threshold</label>
              <span className="text-xs font-semibold text-primary tabular-nums">
                {(crMin / 10)?.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={crMin}
              onChange={(e) => update({ crMin: Number(e.target.value) })}
              className="w-full h-1 appearance-none rounded-full cursor-pointer accent-primary"
              aria-label="Minimum CR threshold"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0%</span>
              <span className="text-xs text-muted-foreground">10%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
