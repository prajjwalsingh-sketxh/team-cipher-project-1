import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorData {
  time: string;
  value: number;
}

interface SensorChartProps {
  title: string;
  data: SensorData[];
  color: string;
  unit: string;
  currentValue: number;
  status: 'safe' | 'caution' | 'danger';
}

export function SensorChart({ title, data, color, unit, currentValue, status }: SensorChartProps) {
  const statusColors = {
    safe: 'text-status-safe',
    caution: 'text-status-caution', 
    danger: 'text-status-danger'
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <span className="text-lg">{title}</span>
          <div className="text-right">
            <div className={`text-2xl font-bold ${statusColors[status]}`}>
              {currentValue.toFixed(1)} {unit}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}