'use client';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import type { ClusterLabel } from '@/lib/kmeans';

interface CampaignPoint {
  id: string;
  name: string;
  ctr: number;
  cr: number;
  healthScore: number;
  label: ClusterLabel;
}

interface CentroidPoint {
  id: string;
  ctr: number;
  cr: number;
  label: ClusterLabel;
  isCentroid: boolean;
}

interface Props {
  campaigns: CampaignPoint[];
  centroids: CentroidPoint[];
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
  payload?: { payload: CampaignPoint }[];
}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card-elevated border border-border p-3 shadow-xl text-xs min-w-[160px]">
      <p className="font-semibold text-foreground mb-2 truncate max-w-[200px]">{d.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">CTR</span>
          <span className="font-medium tabular-nums text-foreground">{d.ctr.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">CR</span>
          <span className="font-medium tabular-nums text-foreground">{d.cr.toFixed(2)}%</span>
        </div>
        {d.healthScore !== undefined && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Health</span>
            <span className="font-medium tabular-nums text-foreground">
              {d.healthScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClusterScatterChartInner({ campaigns, centroids }: Props) {
  const tiers: ClusterLabel[] = ['High Performer', 'Needs Improvement', 'Low Performance'];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ScatterChart margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="ctr"
          name="CTR"
          unit="%"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          label={{
            value: 'CTR (%)',
            position: 'insideBottom',
            offset: -2,
            style: { fontSize: 10, fill: 'var(--muted-foreground)' },
          }}
        />
        <YAxis
          type="number"
          dataKey="cr"
          name="CR"
          unit="%"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          label={{
            value: 'CR (%)',
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: 10, fill: 'var(--muted-foreground)' },
          }}
        />
        <ZAxis range={[40, 40]} />
        <Tooltip content={<CustomTooltip />} />
        {tiers.map((tier) => (
          <Scatter
            key={`scatter-${tier}`}
            name={tier}
            data={campaigns.filter((c) => c.label === tier)}
            fill={CLUSTER_COLORS[tier]}
            fillOpacity={0.8}
          />
        ))}
        {/* Centroids rendered as larger distinct markers */}
        <Scatter
          key="scatter-centroids"
          name="Centroids"
          data={centroids}
          fill="#ffffff"
          shape="cross"
          fillOpacity={1}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
