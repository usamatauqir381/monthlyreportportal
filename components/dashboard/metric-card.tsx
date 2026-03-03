'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMetricValue } from '@/lib/metrics';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  trend?: number;
  status?: 'green' | 'yellow' | 'red';
  category?: 'students' | 'revenue' | 'operations' | 'risk';
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  status,
  category = 'operations',
}: MetricCardProps) {
  const statusColors = {
    green: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    red: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  };

  const statusIconColor = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  };

  const trendColor = trend && trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <Card
      className={cn(
        'p-6 border-2 transition-all hover:shadow-lg',
        status && statusColors[status]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {formatMetricValue(value, unit)}
            </p>
            {trend !== undefined && (
              <div className={cn('flex items-center gap-1', trendColor)}>
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-xs font-semibold">
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {status && (
          <div className={cn('flex-shrink-0', statusIconColor[status])}>
            {status === 'red' && <AlertCircle className="w-6 h-6" />}
            {status === 'green' && <CheckCircle2 className="w-6 h-6" />}
            {status === 'yellow' && (
              <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
