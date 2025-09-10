import React from 'react';
import { SensorChart } from '@/components/SensorChart';
import { AlertPanel } from '@/components/AlertPanel';
import { RiskAssessment } from '@/components/RiskAssessment';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSensorData } from '@/hooks/useSensorData';
import { Badge } from '@/components/ui/badge';
import { Mountain, Zap, Thermometer, Droplets, Camera, Brain } from 'lucide-react';

const Index = () => {
  const { data, alerts, riskData } = useSensorData();

  const latestReading = data[data.length - 1] || {
    vibration: 0,
    temperature: 0,
    moisture: 0
  };

  const getVibrationStatus = (value: number) => {
    if (value < 0.3) return 'safe';
    if (value < 0.5) return 'caution';
    return 'danger';
  };

  const getTemperatureStatus = (value: number) => {
    if (value > 15 && value < 30) return 'safe';
    if (value < 35) return 'caution';
    return 'danger';
  };

  const getMoistureStatus = (value: number) => {
    if (value < 70) return 'safe';
    if (value < 85) return 'caution';
    return 'danger';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Mountain className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AI Rockfall Prediction System
                </h1>
                <p className="text-muted-foreground">Open-Pit Mine Safety Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <StatusIndicator 
                status={riskData.riskLevel === 'LOW' ? 'safe' : riskData.riskLevel === 'MODERATE' ? 'caution' : 'danger'}
                label="System Status"
                value="Online"
                size="lg"
              />
              <Badge variant={riskData.riskLevel === 'LOW' ? 'default' : 'destructive'}>
                Risk Level: {riskData.riskLevel}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Risk Assessment Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RiskAssessment riskData={riskData} />
          </div>
          <div className="lg:col-span-2">
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* Sensor Data Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SensorChart
            title="Vibration Levels"
            data={data.map(d => ({ time: d.time, value: d.vibration }))}
            color="hsl(var(--chart-vibration))"
            unit="m/s²"
            currentValue={latestReading.vibration}
            status={getVibrationStatus(latestReading.vibration)}
          />
          <SensorChart
            title="Temperature"
            data={data.map(d => ({ time: d.time, value: d.temperature }))}
            color="hsl(var(--chart-temperature))"
            unit="°C"
            currentValue={latestReading.temperature}
            status={getTemperatureStatus(latestReading.temperature)}
          />
          <SensorChart
            title="Moisture Level"
            data={data.map(d => ({ time: d.time, value: d.moisture }))}
            color="hsl(var(--chart-moisture))"
            unit="%"
            currentValue={latestReading.moisture}
            status={getMoistureStatus(latestReading.moisture)}
          />
        </div>

        {/* AI Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Camera className="w-5 h-5" />
                Image Analysis (CNN)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crack Detection</span>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Surface Stability</span>
                  <span className="text-sm text-status-safe">92% Stable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Analysis</span>
                  <span className="text-sm text-muted-foreground">2 min ago</span>
                </div>
                <div className="h-32 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Camera Feed Preview</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Brain className="w-5 h-5" />
                ML Model Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Random Forest Model</span>
                  <StatusIndicator status="safe" label="" size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CNN Model</span>
                  <StatusIndicator status="safe" label="" size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Prediction Accuracy</span>
                  <span className="text-sm font-semibold text-status-safe">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Data Points Processed</span>
                  <span className="text-sm text-muted-foreground">2.3M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Active Monitoring Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-chart-vibration" />
                <div>
                  <div className="font-medium text-foreground">Sector A - North Wall</div>
                  <div className="text-sm text-muted-foreground">12 active sensors</div>
                </div>
                <StatusIndicator status="safe" label="" size="sm" />
              </div>
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-chart-temperature" />
                <div>
                  <div className="font-medium text-foreground">Sector B - East Slope</div>
                  <div className="text-sm text-muted-foreground">8 active sensors</div>
                </div>
                <StatusIndicator status="caution" label="" size="sm" />
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-chart-moisture" />
                <div>
                  <div className="font-medium text-foreground">Sector C - South Ridge</div>
                  <div className="text-sm text-muted-foreground">10 active sensors</div>
                </div>
                <StatusIndicator status="safe" label="" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
