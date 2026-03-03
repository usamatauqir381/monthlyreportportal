'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepartmentMetrics } from '@/components/dashboard/department-metrics';
import { SubmissionForm } from '@/components/dashboard/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function SupportDashboardPage() {
  const [userName, setUserName] = useState('Support Team');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setUserName('Sarah Support');
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

  const supportMetrics = [
    {
      label: 'Open Tickets',
      value: 24,
      unit: 'count',
      status: 'yellow' as const,
    },
    {
      label: 'Avg Resolution Time',
      value: 4.5,
      unit: 'hours',
      trend: -2.3,
    },
    {
      label: 'CSAT Score',
      value: 4.2,
      unit: '/5',
      status: 'green' as const,
      trend: 5.1,
    },
    {
      label: 'Response Rate',
      value: 95,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'Escalation Rate',
      value: 8,
      unit: '%',
      status: 'yellow' as const,
    },
    {
      label: 'Team Workload',
      value: 82,
      unit: '%',
      status: 'yellow' as const,
    },
  ];

  const supportFormFields = [
    {
      id: 'openTickets',
      label: 'Open Tickets',
      type: 'number' as const,
      placeholder: '24',
      required: true,
    },
    {
      id: 'avgResolutionTime',
      label: 'Avg Resolution Time (hours)',
      type: 'number' as const,
      placeholder: '4.5',
      required: true,
    },
    {
      id: 'csatScore',
      label: 'CSAT Score (0-5)',
      type: 'number' as const,
      placeholder: '4.2',
      required: true,
    },
    {
      id: 'responseRate',
      label: 'Response Rate (%)',
      type: 'number' as const,
      placeholder: '95',
      required: true,
    },
    {
      id: 'escalationRate',
      label: 'Escalation Rate (%)',
      type: 'number' as const,
      placeholder: '8',
      required: true,
    },
    {
      id: 'teamWorkload',
      label: 'Team Workload (%)',
      type: 'number' as const,
      placeholder: '82',
      required: true,
    },
  ];

  return (
    <DashboardLayout userRole="DEPARTMENT_HEAD" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Support Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track support metrics and manage submissions</p>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Current Month Metrics</h2>
          <DepartmentMetrics metrics={supportMetrics} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submission">Monthly Submission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Key Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-foreground">Strong CSAT</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer satisfaction at 4.2/5, up 5.1% from last month
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="font-semibold text-foreground">Monitor Escalations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Escalation rate at 8%, watch for trends
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Current support team size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'John Smith', role: 'Senior Support Agent', tickets: 8 },
                    { name: 'Emily Davis', role: 'Support Agent', tickets: 6 },
                    { name: 'Michael Brown', role: 'Support Agent', tickets: 5 },
                    { name: 'Sarah Johnson', role: 'Support Lead', tickets: 5 },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="secondary">{member.tickets} tickets</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission" className="mt-6">
            <SubmissionForm
              departmentId="support"
              departmentName="Support Team"
              fields={supportFormFields}
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
                      submittedDate: '5 days ago',
                      approvedDate: '2 days ago',
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
