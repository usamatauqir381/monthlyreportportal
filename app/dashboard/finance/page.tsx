'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepartmentMetrics } from '@/components/dashboard/department-metrics';
import { SubmissionForm } from '@/components/dashboard/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function FinanceDashboardPage() {
  const [userName, setUserName] = useState('Finance Team');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setUserName('David Finance');
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

  const financeMetrics = [
    {
      label: 'Monthly Revenue',
      value: 562500,
      unit: '$',
      trend: 6.2,
      status: 'green' as const,
    },
    {
      label: 'Operating Expenses',
      value: 285000,
      unit: '$',
      trend: -3.1,
    },
    {
      label: 'Net Profit',
      value: 277500,
      unit: '$',
      trend: 12.8,
      status: 'green' as const,
    },
    {
      label: 'Profit Margin',
      value: 49.3,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'Cash Balance',
      value: 892500,
      unit: '$',
      trend: 8.4,
      status: 'green' as const,
    },
    {
      label: 'Days Cash on Hand',
      value: 94,
      unit: 'days',
      status: 'green' as const,
    },
  ];

  const financeFormFields = [
    {
      id: 'monthlyRevenue',
      label: 'Monthly Revenue ($)',
      type: 'number' as const,
      placeholder: '562500',
      required: true,
    },
    {
      id: 'operatingExpenses',
      label: 'Operating Expenses ($)',
      type: 'number' as const,
      placeholder: '285000',
      required: true,
    },
    {
      id: 'netProfit',
      label: 'Net Profit ($)',
      type: 'number' as const,
      placeholder: '277500',
      required: true,
    },
    {
      id: 'profitMargin',
      label: 'Profit Margin (%)',
      type: 'number' as const,
      placeholder: '49.3',
      required: true,
    },
    {
      id: 'cashBalance',
      label: 'Cash Balance ($)',
      type: 'number' as const,
      placeholder: '892500',
      required: true,
    },
    {
      id: 'daysCashOnHand',
      label: 'Days Cash on Hand',
      type: 'number' as const,
      placeholder: '94',
      required: true,
    },
  ];

  return (
    <DashboardLayout userRole="DEPARTMENT_HEAD" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Finance & Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor financial performance and budgets</p>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Current Month Metrics</h2>
          <DepartmentMetrics metrics={financeMetrics} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submission">Monthly Submission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Net Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">$277.5K</p>
                  <p className="text-sm text-green-700 dark:text-green-300">+12.8% MoM</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">$562.5K</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">+6.2% MoM</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Cash Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">$892.5K</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">94 days on hand</p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget Breakdown</CardTitle>
                <CardDescription>Expense allocation by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Salaries & Benefits', amount: 145000, percentage: 50.9 },
                    { category: 'Technology & Infrastructure', amount: 56000, percentage: 19.6 },
                    { category: 'Marketing & Sales', amount: 42000, percentage: 14.7 },
                    { category: 'Operations & Admin', amount: 28000, percentage: 9.8 },
                    { category: 'Training & Development', amount: 14000, percentage: 4.9 },
                  ].map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{item.category}</span>
                        <span className="text-sm font-semibold text-foreground">
                          ${(item.amount / 1000).toFixed(0)}K ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual (YTD)</CardTitle>
                <CardDescription>Performance against annual budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: 'Revenue', budget: 1150000, actual: 1125000, variance: -2.2 },
                    { item: 'Operating Expenses', budget: 580000, actual: 570000, variance: -1.7 },
                    { item: 'Marketing Spend', budget: 92000, actual: 84000, variance: -8.7 },
                    { item: 'Headcount Costs', budget: 290000, actual: 290000, variance: 0 },
                  ].map((item) => (
                    <div key={item.item} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Budget: ${(item.budget / 1000).toFixed(0)}K | Actual: ${(item.actual / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.variance < -5 ? 'default' : item.variance > 5 ? 'destructive' : 'secondary'
                        }
                      >
                        {item.variance > 0 ? '+' : ''}{item.variance}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health Indicators</CardTitle>
                <CardDescription>Key financial ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Gross Margin', value: '68.5%', status: 'good' },
                    { label: 'Operating Margin', value: '49.3%', status: 'good' },
                    { label: 'Current Ratio', value: '2.1x', status: 'good' },
                    { label: 'Debt-to-Equity', value: '0.3x', status: 'good' },
                  ].map((metric) => (
                    <div key={metric.label} className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <Badge className="mt-2" variant="secondary">
                        Healthy
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission" className="mt-6">
            <SubmissionForm
              departmentId="finance"
              departmentName="Finance & Admin"
              fields={financeFormFields}
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
                      status: 'approved',
                      submittedDate: '1 day ago',
                    },
                    {
                      month: 'January 2025',
                      status: 'approved',
                      submittedDate: '1 month ago',
                    },
                    {
                      month: 'December 2024',
                      status: 'approved',
                      submittedDate: '2 months ago',
                    },
                  ].map((submission) => (
                    <div
                      key={submission.month}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition"
                    >
                      <div>
                        <p className="font-medium text-foreground">{submission.month}</p>
                        <p className="text-sm text-muted-foreground">Submitted {submission.submittedDate}</p>
                      </div>
                      <Badge variant="default">{submission.status}</Badge>
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
