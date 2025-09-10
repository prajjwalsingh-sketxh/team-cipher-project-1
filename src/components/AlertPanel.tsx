import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'safe' | 'caution' | 'danger';
  message: string;
  timestamp: string;
  sector: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-status-safe" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-status-caution" />;
      case 'danger':
        return <XCircle className="w-5 h-5 text-status-danger" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case 'safe':
        return 'default';
      case 'caution':
        return 'secondary';
      case 'danger':
        return 'destructive';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No active alerts
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertBadgeVariant(alert.type)}>
                      {alert.sector}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}