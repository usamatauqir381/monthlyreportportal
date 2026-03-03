'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepartmentMetrics } from '@/components/dashboard/department-metrics';
import { SubmissionForm } from '@/components/dashboard/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users } from 'lucide-react';

export default function SalesDashboardPage() {
  const [userName, setUserName] = useState('Sales Team');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setUserName('Mike Sales');
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/v1/submissions?month=' + new Date().toISOString().split('T')[0]);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const salesMetrics = [
    {
      label: 'Leads Generated',
      value: 145,
      unit: 'count',
      trend: 12.3,
      status: 'green' as const,
    },
    {
      label: 'Conversion Rate',
      value: 12.4,
      unit: '%',
      trend: 2.8,
      status: 'green' as const,
    },
    {
      label: 'Deals Closed',
      value: 18,
      unit: 'count',
      status: 'green' as const,
    },
    {
      label: 'Pipeline Value',
      value: 425000,
      unit: '$',
      trend: 18.5,
      status: 'green' as const,
    },
    {
      label: 'Average Deal Size',
      value: 23611,
      unit: '$',
      status: 'green' as const,
    },
    {
      label: 'Sales Cycle',
      value: 32,
      unit: 'days',
      trend: -5.2,
    },
  ];

  const salesFormFields = [
    {
      id: 'leadsGenerated',
      label: 'Leads Generated',
      type: 'number' as const,
      placeholder: '145',
      required: true,
    },
    {
      id: 'conversionRate',
      label: 'Conversion Rate (%)',
      type: 'number' as const,
      placeholder: '12.4',
      required: true,
    },
    {
      id: 'dealsClosed',
      label: 'Deals Closed',
      type: 'number' as const,
      placeholder: '18',
      required: true,
    },
    {
      id: 'pipelineValue',
      label: 'Pipeline Value ($)',
      type: 'number' as const,
      placeholder: '425000',
      required: true,
    },
    {
      id: 'avgDealSize',
      label: 'Average Deal Size ($)',
      type: 'number' as const,
      placeholder: '23611',
      required: true,
    },
    {
      id: 'salesCycle',
      label: 'Sales Cycle (days)',
      type: 'number' as const,
      placeholder: '32',
      required: true,
    },
  ];

  return (
    <DashboardLayout userRole="DEPARTMENT_HEAD" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Sales & Marketing Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor sales pipeline and marketing performance</p>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Current Month Metrics</h2>
          <DepartmentMetrics metrics={salesMetrics} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submission">Monthly Submission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Lead Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">+12.3%</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">vs last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Pipeline Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">$425K</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Total value</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">12.4%</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Current rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Rep Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Rep Performance</CardTitle>
                <CardDescription>Individual metrics for current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Alex Chen', deals: 5, revenue: 142000, status: 'exceeding' },
                    { name: 'Jessica Martinez', deals: 4, revenue: 95000, status: 'on-track' },
                    { name: 'David Kumar', deals: 4, revenue: 98000, status: 'on-track' },
                    { name: 'Sarah Wilson', deals: 5, revenue: 90000, status: 'exceeding' },
                  ].map((rep) => (
                    <div key={rep.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{rep.name}</p>
                        <p className="text-sm text-muted-foreground">{rep.deals} deals closed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${(rep.revenue / 1000).toFixed(0)}K</p>
                        <Badge variant={rep.status === 'exceeding' ? 'default' : 'secondary'}>
                          {rep.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Stages */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Distribution by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { stage: 'Prospecting', deals: 48, value: 85000 },
                    { stage: 'Qualification', deals: 32, value: 125000 },
                    { stage: 'Proposal', deals: 15, value: 95000 },
                    { stage: 'Negotiation', deals: 8, value: 120000 },
                  ].map((item) => (
                    <div key={item.stage} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{item.stage}</span>
                          <span className="text-sm text-muted-foreground">{item.deals} deals</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${(item.deals / 48) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-semibold text-foreground">${(item.value / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission" className="mt-6">
            <SubmissionForm
              departmentId="sales"
              departmentName="Sales & Marketing"
              fields={salesFormFields}
              onSubmit={fetchSubmissions}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission History</CardTitle>
                <CardDescription>Recent submissions and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      month: 'February 2025',
                      status: 'submitted',
                      submittedDate: '2 days ago',
                      approvedDate: 'Pending',
                    },
                    {
                      month: 'January 2025',
                      status: 'approved',
                      submittedDate: '1 month ago',
                      approvedDate: '4 weeks ago',
                    },
                    {
                      month: 'December 2024',
                      status: 'approved',
                      submittedDate: '2 months ago',
                      approvedDate: '7 weeks ago',
                    },
                  ].map((submission) => (
                    <div
                      key={submission.month}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition"
                    >
                      <div>
                        <p className="font-medium text-foreground">{submission.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {submission.submittedDate}
                        </p>
                      </div>
                      <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
