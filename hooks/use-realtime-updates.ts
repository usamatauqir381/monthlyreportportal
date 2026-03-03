import { useEffect, useState, useCallback } from 'react';

export interface RealtimeEvent {
  type: 'submission:updated' | 'metrics:changed' | 'approval:required' | 'alert:new';
  data: any;
  timestamp: number;
}

/**
 * Hook to listen for real-time updates
 * In production, this would connect to a WebSocket server
 * For now, it simulates real-time updates with polling
 */
export function useRealtimeUpdates(
  departmentId?: string,
  enabled: boolean = true
) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate connecting to WebSocket server
  useEffect(() => {
    if (!enabled) return;

    // Simulate connection
    setIsConnected(true);

    // Simulate real-time updates with polling
    const pollInterval = setInterval(() => {
      // In production, this would be actual WebSocket data
      // For demo, generate random update events
      const random = Math.random();

      if (random > 0.7) {
        const newEvent: RealtimeEvent = {
          type: random > 0.85 ? 'submission:updated' : 'metrics:changed',
          data: {
            departmentId,
            message: 'Data updated',
          },
          timestamp: Date.now(),
        };

        setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
        setLastUpdate(new Date());
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(pollInterval);
      setIsConnected(false);
    };
  }, [enabled, departmentId]);

  const addEvent = useCallback((event: RealtimeEvent) => {
    setEvents((prev) => [event, ...prev.slice(0, 9)]);
    setLastUpdate(new Date());
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isConnected,
    lastUpdate,
    addEvent,
    clearEvents,
  };
}

/**
 * Hook for polling metrics updates
 */
export function useMetricsPolling(departmentId?: string, interval: number = 30000) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('month', new Date().toISOString().split('T')[0]);
      if (departmentId) {
        params.append('departmentId', departmentId);
      }

      const response = await fetch(`/api/v1/metrics?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.metrics || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Set up polling
    const pollInterval = setInterval(fetchMetrics, interval);

    return () => clearInterval(pollInterval);
  }, [fetchMetrics, interval]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook for polling submission updates
 */
export function useSubmissionsPolling(month?: string, interval: number = 30000) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (month) {
        params.append('month', month);
      } else {
        params.append('month', new Date().toISOString().split('T')[0]);
      }

      const response = await fetch(`/api/v1/submissions?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    // Initial fetch
    fetchSubmissions();

    // Set up polling
    const pollInterval = setInterval(fetchSubmissions, interval);

    return () => clearInterval(pollInterval);
  }, [fetchSubmissions, interval]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
  };
}
