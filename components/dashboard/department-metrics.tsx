'use client';

import { MetricCard } from './metric-card';
import type { MetricData } from '@/lib/metrics';

interface DepartmentMetricsProps {
  metrics: Array<{
    label: string;
    value: number;
    unit: string;
    status?: 'green' | 'yellow' | 'red';
    trend?: number;
  }>;
}

export function DepartmentMetrics({ metrics }: DepartmentMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <MetricCard
          key={idx}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
          status={metric.status}
          trend={metric.trend}
          category="operations"
        />
      ))}
    </div>
  );
}
