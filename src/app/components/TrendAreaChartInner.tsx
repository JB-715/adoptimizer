'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface Props {
  data: DataPoint[];
  activeMetrics: string[];
}

function formatNumber(val: number): string {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return String(val);
}

const METRIC_CONFIG = [
  { key: 'impressions', color: 'var(--chart-impressions)', gradId: 'grad-impressions' },
  { key: 'clicks', color: 'var(--chart-clicks)', gradId: 'grad-clicks' },
  { key: 'conversions', color: 'var(--chart-conversions)', gradId: 'grad-conversions' },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="card-elevated border border-border p-3 shadow-xl text-xs space-y-1.5 min-w-[140px]">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={`tip-${p.name}`} className="flex justify-between gap-4">
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="font-semibold tabular-nums" style={{ color: p.color }}>
            {formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendAreaChartInner({ data, activeMetrics }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          {METRIC_CONFIG.map((m) => (
            <linearGradient key={`lgdef-${m.gradId}`} id={m.gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={m.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={m.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatNumber}
        />
        <Tooltip content={<CustomTooltip />} />
        {METRIC_CONFIG.filter((m) => activeMetrics.includes(m.key)).map((m) => (
          <Area
            key={`area-${m.key}`}
            type="monotone"
            dataKey={m.key}
            stroke={m.color}
            strokeWidth={2}
            fill={`url(#${m.gradId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
