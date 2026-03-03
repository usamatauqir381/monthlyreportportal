'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepartmentMetrics } from '@/components/dashboard/department-metrics';
import { SubmissionForm } from '@/components/dashboard/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, TrendingDown } from 'lucide-react';

export default function HRDashboardPage() {
  const [userName, setUserName] = useState('HR Team');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setUserName('Lisa HR');
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

  const hrMetrics = [
    {
      label: 'Open Positions',
      value: 7,
      unit: 'count',
      status: 'yellow' as const,
    },
    {
      label: 'Applications Received',
      value: 156,
      unit: 'count',
      trend: 23.5,
      status: 'green' as const,
    },
    {
      label: 'Interviews Scheduled',
      value: 28,
      unit: 'count',
      status: 'green' as const,
    },
    {
      label: 'Offers Extended',
      value: 5,
      unit: 'count',
      status: 'green' as const,
    },
    {
      label: 'Acceptance Rate',
      value: 80,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'Time to Hire',
      value: 32,
      unit: 'days',
      trend: -8.3,
    },
  ];

  const hrFormFields = [
    {
      id: 'openPositions',
      label: 'Open Positions',
      type: 'number' as const,
      placeholder: '7',
      required: true,
    },
    {
      id: 'applicationsReceived',
      label: 'Applications Received',
      type: 'number' as const,
      placeholder: '156',
      required: true,
    },
    {
      id: 'interviewsScheduled',
      label: 'Interviews Scheduled',
      type: 'number' as const,
      placeholder: '28',
      required: true,
    },
    {
      id: 'offersExtended',
      label: 'Offers Extended',
      type: 'number' as const,
      placeholder: '5',
      required: true,
    },
    {
      id: 'acceptanceRate',
      label: 'Offer Acceptance Rate (%)',
      type: 'number' as const,
      placeholder: '80',
      required: true,
    },
    {
      id: 'timeToHire',
      label: 'Average Time to Hire (days)',
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
          <h1 className="text-4xl font-bold text-foreground">HR & Recruitment Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage recruitment and HR metrics</p>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Current Month Metrics</h2>
          <DepartmentMetrics metrics={hrMetrics} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submission">Monthly Submission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    New Hires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">4</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Total Headcount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">142</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Full time</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Attrition Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">2.1%</p>
                  <p className="text-sm text-red-700 dark:text-red-300">YTD</p>
                </CardContent>
              </Card>
            </div>

            {/* Open Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>Current open roles by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { role: 'Senior Software Engineer', department: 'Engineering', applications: 32, stage: 'Interviews' },
                    { role: 'Product Manager', department: 'Product', applications: 18, stage: 'Screening' },
                    { role: 'Sales Executive', department: 'Sales', applications: 28, stage: 'Interviews' },
                    { role: 'Content Writer', department: 'Marketing', applications: 24, stage: 'Screening' },
                    { role: 'Data Analyst', department: 'Analytics', applications: 16, stage: 'Final Round' },
                    { role: 'Support Agent', department: 'Support', applications: 38, stage: 'Screening' },
                    { role: 'Tutor', department: 'Training', applications: 52, stage: 'Screening' },
                  ].map((position) => (
                    <div key={position.role} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{position.role}</p>
                        <p className="text-sm text-muted-foreground">{position.department}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{position.applications} apps</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{position.stage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Funnel</CardTitle>
                <CardDescription>Conversion rates by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Applications', count: 156, percentage: 100 },
                    { stage: 'Screening', count: 68, percentage: 43.6 },
                    { stage: 'Interviews', count: 28, percentage: 41.2 },
                    { stage: 'Final Round', count: 8, percentage: 28.6 },
                    { stage: 'Offers', count: 5, percentage: 62.5 },
                  ].map((item) => (
                    <div key={item.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{item.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
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
              departmentId="hr"
              departmentName="HR & Recruitment"
              fields={hrFormFields}
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
                      status: 'draft',
                      submittedDate: 'Not submitted',
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
                        <p className="text-sm text-muted-foreground">{submission.submittedDate}</p>
                      </div>
                      <Badge variant={submission.status === 'approved' ? 'default' : 'outline'}>
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
