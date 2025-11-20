import { LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  loading?: boolean;
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  error: 'bg-error-100 text-error-600',
  info: 'bg-info-100 text-info-600',
  secondary: 'bg-secondary-100 text-secondary-600',
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  loading = false,
}: StatsCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 mb-1 truncate" title={title}>
            {title}
          </p>
          <p
            className="text-3xl font-bold text-neutral-900 tabular-nums"
            aria-live="polite"
          >
            {loading ? (
              <span className="inline-block h-9 w-24 animate-pulse bg-neutral-200 rounded" />
            ) : (
              value
            )}
          </p>
          {trend && !loading && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium mt-2',
                trend.positive ? 'text-success-600' : 'text-error-600'
              )}
              aria-label={`Trend: ${trend.value}`}
            >
              {trend.positive ? (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'p-4 rounded-xl transition-transform duration-200 hover:scale-105',
            colorClasses[color]
          )}
          aria-hidden="true"
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </Card>
  );
}
