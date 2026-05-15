'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ClusterLabel } from '@/lib/kmeans';

interface BarDataPoint {
  id: string;
  name: string;
  fullName: string;
  healthScore: number;
  label: ClusterLabel;
}

const CLUSTER_COLORS: Record<string, string> = {
  'High Performer': 'var(--cluster-high)',
  'Needs Improvement': 'var(--cluster-mid)',
  'Low Performance': 'var(--cluster-low)',
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: BarDataPoint }[];
}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card-elevated border border-border p-3 shadow-xl text-xs min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{d.fullName}</p>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Health Score</span>
        <span className="font-bold tabular-nums" style={{ color: CLUSTER_COLORS[d.label] }}>
          {d.healthScore.toFixed(1)}
        </span>
      </div>
      <div className="flex justify-between gap-4 mt-1">
        <span className="text-muted-foreground">Tier</span>
        <span className="font-medium" style={{ color: CLUSTER_COLORS[d.label] }}>
          {d.label}
        </span>
      </div>
    </div>
  );
}

export default function CampaignBarChartInner({ data }: { data: BarDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 60 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 25]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="healthScore" radius={[3, 3, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={`bar-cell-${entry.id}`}
              fill={CLUSTER_COLORS[entry.label]}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
