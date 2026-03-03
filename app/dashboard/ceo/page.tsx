'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { groupMetricsByCategory, type MetricData } from '@/lib/metrics';

export default function CEODashboardPage() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [userName, setUserName] = useState('CEO');

  useEffect(() => {
    // Extract user name from cookie (it's in the JWT token)
    const tokenMatch = document.cookie.match(/sb-auth-token=([^;]+)/);
    if (tokenMatch) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(tokenMatch[1])));
        setUserName('John CEO');
      } catch (e) {
        setUserName('CEO');
      }
    }

    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const month = new Date();
      const response = await fetch(
        `/api/v1/metrics?month=${month.toISOString().split('T')[0]}`
      );

      if (response.ok) {
        const data = await response.json();
        // Mock data for demo - in production this would come from API
        const mockMetrics: MetricData[] = [
          {
            key: 'active_students',
            label: 'Active Students',
            value: 1250,
            unit: 'count',
            trend: 8.5,
            category: 'students',
          },
          {
            key: 'net_growth_mth',
            label: 'Net Growth (MoM)',
            value: 8.5,
            unit: '%',
            category: 'students',
          },
          {
            key: 'churn_rate',
            label: 'Churn Rate',
            value: 2.3,
            unit: '%',
            status: 'green',
            category: 'students',
          },
          {
            key: 'arpa',
            label: 'ARPA',
            value: 4500,
            unit: '$',
            trend: 5.2,
            category: 'revenue',
          },
          {
            key: 'revenue_mtd',
            label: 'Revenue (MTD)',
            value: 562500,
            unit: '$',
            category: 'revenue',
          },
          {
            key: 'cash_collected',
            label: 'Cash Collected',
            value: 520000,
            unit: '$',
            category: 'revenue',
          },
          {
            key: 'outstanding_receivables',
            label: 'Outstanding Receivables',
            value: 42500,
            unit: '$',
            status: 'green',
            category: 'revenue',
          },
          {
            key: 'gross_margin_pct',
            label: 'Gross Margin %',
            value: 68.5,
            unit: '%',
            category: 'revenue',
          },
          {
            key: 'tutor_utilization_pct',
            label: 'Tutor Utilization %',
            value: 82.3,
            unit: '%',
            category: 'operations',
          },
          {
            key: 'cac',
            label: 'CAC',
            value: 320,
            unit: '$',
            category: 'operations',
          },
          {
            key: 'payback_months',
            label: 'Payback Period',
            value: 4.2,
            unit: 'months',
            status: 'green',
            category: 'operations',
          },
          {
            key: 'escalation_count',
            label: 'Open Escalations',
            value: 12,
            unit: 'count',
            status: 'yellow',
            category: 'risk',
          },
          {
            key: 'compliance_breaches',
            label: 'Compliance Breaches',
            value: 0,
            unit: 'count',
            status: 'green',
            category: 'risk',
          },
          {
            key: 'quality_flags',
            label: 'Quality Flags',
            value: 3,
            unit: 'count',
            status: 'yellow',
            category: 'risk',
          },
        ];
        setMetrics(mockMetrics);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const grouped = groupMetricsByCategory(metrics);

  const MetricsGrid = ({ items }: { items: MetricData[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((metric) => (
        <MetricCard key={metric.key} {...metric} />
      ))}
    </div>
  );

  return (
    <DashboardLayout userRole="CEO" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">CEO Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of all departments</p>
          </div>
          <Button
            onClick={fetchMetrics}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
        </div>

        {loading && !metrics.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Metrics (15)</TabsTrigger>
              <TabsTrigger value="students">Students ({grouped.students.length})</TabsTrigger>
              <TabsTrigger value="revenue">Revenue ({grouped.revenue.length})</TabsTrigger>
              <TabsTrigger value="operations">Operations ({grouped.operations.length})</TabsTrigger>
              <TabsTrigger value="risk">Risk ({grouped.risk.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <MetricsGrid items={metrics} />
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <MetricsGrid items={grouped.students} />
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <MetricsGrid items={grouped.revenue} />
            </TabsContent>

            <TabsContent value="operations" className="mt-6">
              <MetricsGrid items={grouped.operations} />
            </TabsContent>

            <TabsContent value="risk" className="mt-6">
              <MetricsGrid items={grouped.risk} />
            </TabsContent>
          </Tabs>
        )}

        {/* Department Submissions Status */}
        <Card>
          <CardHeader>
            <CardTitle>Department Submissions</CardTitle>
            <CardDescription>Current month submission status from all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Support Team', status: 'approved', submitted: '5 days ago' },
                { name: 'Sales & Marketing', status: 'submitted', submitted: '2 days ago' },
                { name: 'HR & Recruitment', status: 'draft', submitted: '-' },
                { name: 'Finance & Admin', status: 'approved', submitted: '1 day ago' },
                { name: 'Training & Development', status: 'under_review', submitted: 'Today' },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">Submitted {dept.submitted}</p>
                  </div>
                  <Badge variant={getStatusVariant(dept.status)}>
                    {getStatusLabel(dept.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'approved':
      return 'default';
    case 'submitted':
      return 'secondary';
    case 'under_review':
      return 'outline';
    case 'draft':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'draft':
      return 'Draft';
    default:
      return status;
  }
}

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
