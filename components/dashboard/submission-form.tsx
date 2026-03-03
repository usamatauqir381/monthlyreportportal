'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface SubmissionFormProps {
  departmentId: string;
  departmentName: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'number' | 'text' | 'textarea';
    placeholder?: string;
    required?: boolean;
  }>;
  onSubmit?: (data: Record<string, any>) => void;
}

export function SubmissionForm({
  departmentId,
  departmentName,
  fields,
  onSubmit,
}: SubmissionFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId,
          month: new Date().toISOString().split('T')[0],
          data: formData,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setStatus('error');
        setMessage(error.error || 'Failed to submit');
        setLoading(false);
        return;
      }

      const result = await response.json();
      setStatus('success');
      setMessage('Submission saved successfully!');
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
      );
      setNotes('');

      if (onSubmit) {
        onSubmit(result);
      }

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Submission - {departmentName}</CardTitle>
        <CardDescription>Submit department metrics for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'success' && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    rows={3}
                    disabled={loading}
                  />
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional context or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Submit'
              )}
            </Button>
            <Button type="button" variant="outline" disabled={loading}>
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
