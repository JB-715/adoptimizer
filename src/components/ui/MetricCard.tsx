import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  delta?: number; // percentage change
  deltaLabel?: string;
  icon: React.ReactNode;
  accentClass?: string; // gradient class
  hero?: boolean;
}

export default function MetricCard({
  label,
  value,
  subValue,
  delta,
  deltaLabel,
  icon,
  accentClass = 'gradient-emerald',
  hero = false,
}: MetricCardProps) {
  const trendPositive = delta !== undefined && delta > 0;
  const trendNegative = delta !== undefined && delta < 0;
  const trendNeutral = delta === undefined || delta === 0;

  return (
    <div
      className={`card-elevated card-hover relative overflow-hidden p-5 ${accentClass} ${hero ? 'p-6' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <div className="p-1.5 rounded-md bg-muted/60">{icon}</div>
      </div>

      <div
        className={`tabular-nums font-bold text-foreground ${hero ? 'text-3xl' : 'text-2xl'} mb-1`}
      >
        {value}
      </div>

      {subValue && <p className="text-xs text-muted-foreground mb-2">{subValue}</p>}

      {delta !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${trendPositive ? 'text-cluster-high' : trendNegative ? 'text-cluster-low' : 'text-muted-foreground'}`}
        >
          {trendPositive && <TrendingUp size={12} />}
          {trendNegative && <TrendingDown size={12} />}
          {trendNeutral && <Minus size={12} />}
          <span>
            {trendPositive ? '+' : ''}
            {delta?.toFixed(1)}%
          </span>
          {deltaLabel && (
            <span className="text-muted-foreground font-normal ml-1">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
