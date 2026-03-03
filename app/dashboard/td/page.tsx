'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepartmentMetrics } from '@/components/dashboard/department-metrics';
import { SubmissionForm } from '@/components/dashboard/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award } from 'lucide-react';

export default function TrainingDashboardPage() {
  const [userName, setUserName] = useState('Training Team');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setUserName('Emily Training');
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

  const tdMetrics = [
    {
      label: 'Training Completion %',
      value: 87.5,
      unit: '%',
      status: 'green' as const,
      trend: 3.2,
    },
    {
      label: 'Active Learners',
      value: 126,
      unit: 'count',
      status: 'green' as const,
      trend: 8.5,
    },
    {
      label: 'Avg Assessment Score',
      value: 82.3,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'Shift Coverage',
      value: 94.2,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'No-Show Rate',
      value: 2.1,
      unit: '%',
      status: 'green' as const,
    },
    {
      label: 'Tutor Utilization',
      value: 85.6,
      unit: '%',
      status: 'green' as const,
    },
  ];

  const tdFormFields = [
    {
      id: 'completionRate',
      label: 'Training Completion Rate (%)',
      type: 'number' as const,
      placeholder: '87.5',
      required: true,
    },
    {
      id: 'activeLearners',
      label: 'Active Learners',
      type: 'number' as const,
      placeholder: '126',
      required: true,
    },
    {
      id: 'assessmentScore',
      label: 'Average Assessment Score (%)',
      type: 'number' as const,
      placeholder: '82.3',
      required: true,
    },
    {
      id: 'shiftCoverage',
      label: 'Shift Coverage (%)',
      type: 'number' as const,
      placeholder: '94.2',
      required: true,
    },
    {
      id: 'noShowRate',
      label: 'No-Show Rate (%)',
      type: 'number' as const,
      placeholder: '2.1',
      required: true,
    },
    {
      id: 'tutorUtilization',
      label: 'Tutor Utilization (%)',
      type: 'number' as const,
      placeholder: '85.6',
      required: true,
    },
  ];

  return (
    <DashboardLayout userRole="DEPARTMENT_HEAD" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Training & Development Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage training programs, shifts, and tutor performance</p>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Current Month Metrics</h2>
          <DepartmentMetrics metrics={tdMetrics} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="submission">Monthly Submission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">12</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Active programs</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Learners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">126</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Enrolled</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Certified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">98</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">This year</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">1,240</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Delivered</p>
                </CardContent>
              </Card>
            </div>

            {/* Training Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Active Training Programs</CardTitle>
                <CardDescription>Current enrollment and completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Python Fundamentals', enrolled: 28, completed: 24, progress: 85.7 },
                    { name: 'Advanced SQL', enrolled: 16, completed: 14, progress: 87.5 },
                    { name: 'Data Analysis Bootcamp', enrolled: 22, completed: 18, progress: 81.8 },
                    { name: 'Leadership Essentials', enrolled: 14, completed: 11, progress: 78.6 },
                    { name: 'Customer Success Skills', enrolled: 31, completed: 28, progress: 90.3 },
                    { name: 'Communication Mastery', enrolled: 15, completed: 13, progress: 86.7 },
                  ].map((program) => (
                    <div key={program.name} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{program.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {program.completed} / {program.enrolled} completed
                          </p>
                        </div>
                        <Badge variant="secondary">{program.progress}%</Badge>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${program.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tutor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Tutor Performance Ranking</CardTitle>
                <CardDescription>Quality metrics and student feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Alex Johnson', rating: 4.8, students: 24, sessions: 156 },
                    { name: 'Maria Garcia', rating: 4.7, students: 19, sessions: 128 },
                    { name: 'James Wilson', rating: 4.6, students: 22, sessions: 142 },
                    { name: 'Sarah Chen', rating: 4.5, students: 20, sessions: 135 },
                  ].map((tutor, idx) => (
                    <div key={tutor.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">#{idx + 1}</span>
                          <p className="font-medium text-foreground">{tutor.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tutor.students} students • {tutor.sessions} sessions
                        </p>
                      </div>
                      <Badge variant="secondary">★ {tutor.rating}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Submission Workflow</CardTitle>
                <CardDescription>Current month workflow status and timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: 'Draft Submission',
                      description: 'Department prepares monthly metrics',
                      status: 'completed',
                      dueDate: 'By 5th of month',
                    },
                    {
                      step: 2,
                      title: 'Submit for Review',
                      description: 'Team lead submits completed form',
                      status: 'completed',
                      dueDate: 'By 10th of month',
                    },
                    {
                      step: 3,
                      title: 'Department Head Review',
                      description: 'Manager reviews and validates data',
                      status: 'in-progress',
                      dueDate: 'By 15th of month',
                    },
                    {
                      step: 4,
                      title: 'CEO Approval',
                      description: 'Final approval by CEO/Admin',
                      status: 'pending',
                      dueDate: 'By 20th of month',
                    },
                    {
                      step: 5,
                      title: 'Archive & Report',
                      description: 'Store metrics and generate reports',
                      status: 'pending',
                      dueDate: 'By 25th of month',
                    },
                  ].map((step) => (
                    <div key={step.step} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                            step.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : step.status === 'in-progress'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 animate-pulse'
                                : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {step.status === 'completed' ? '✓' : step.step}
                        </div>
                        {step.step < 5 && (
                          <div
                            className={cn(
                              'w-0.5 h-12 mt-2',
                              step.status === 'completed' ? 'bg-green-300' : 'bg-muted'
                            )}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-4">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{step.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval History</CardTitle>
                <CardDescription>Timeline of approvals and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: 'Today at 10:30 AM',
                      action: 'Emily Training submitted the form',
                      user: 'Emily Training',
                      comment:
                        'Training completion rates are up this month due to new online platform launch.',
                    },
                    {
                      date: 'Yesterday at 3:45 PM',
                      action: 'Form created - Draft',
                      user: 'Emily Training',
                      comment: null,
                    },
                  ].map((entry, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{entry.action}</p>
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                        </div>
                        <Badge variant="outline">{entry.user}</Badge>
                      </div>
                      {entry.comment && <p className="text-sm text-foreground italic">"{entry.comment}"</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission" className="mt-6">
            <SubmissionForm
              departmentId="td"
              departmentName="Training & Development"
              fields={tdFormFields}
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
                      status: 'under_review',
                      submittedDate: 'Today',
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
                      <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                        {submission.status.replace('_', ' ')}
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

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
