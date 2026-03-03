'use client';

import { useRealtimeUpdates } from '@/hooks/use-realtime-updates';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

interface RealtimeStatusProps {
  departmentId?: string;
  enabled?: boolean;
}

export function RealtimeStatus({ departmentId, enabled = true }: RealtimeStatusProps) {
  const { isConnected, lastUpdate, events } = useRealtimeUpdates(departmentId, enabled);

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'submission:updated':
        return 'Submission Updated';
      case 'metrics:changed':
        return 'Metrics Updated';
      case 'approval:required':
        return 'Approval Required';
      case 'alert:new':
        return 'New Alert';
      default:
        return 'Update';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'submission:updated':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'metrics:changed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'approval:required':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'alert:new':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-muted';
    }
  };

  const recentEvent = events[0];
  const timeAgo = recentEvent
    ? Math.round((Date.now() - recentEvent.timestamp) / 1000)
    : null;

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-muted-foreground">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Offline</span>
          </>
        )}
      </div>

      {/* Recent Event */}
      {recentEvent && (
        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 ${getEventColor(recentEvent.type)}`}>
          {recentEvent.type === 'approval:required' ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <CheckCircle2 className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">{getEventLabel(recentEvent.type)}</span>
          {timeAgo !== null && timeAgo < 60 && (
            <span className="text-xs opacity-75">{timeAgo}s ago</span>
          )}
        </div>
      )}

      {/* Last Updated */}
      {!recentEvent && (
        <span className="text-xs text-muted-foreground">
          Last update: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
