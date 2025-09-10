import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RiskData {
  sensorRisk: number;
  imageRisk: number;
  overallRisk: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

interface RiskAssessmentProps {
  riskData: RiskData;
}

export function RiskAssessment({ riskData }: RiskAssessmentProps) {
  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'bg-status-safe';
    if (risk < 50) return 'bg-status-caution';
    return 'bg-status-danger';
  };

  const getRiskLevelColor = (level: RiskData['riskLevel']) => {
    switch (level) {
      case 'LOW':
        return 'text-status-safe';
      case 'MODERATE':
        return 'text-status-caution';
      case 'HIGH':
      case 'CRITICAL':
        return 'text-status-danger';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">AI Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getRiskLevelColor(riskData.riskLevel)}`}>
            {riskData.overallRisk}%
          </div>
          <div className={`text-lg font-semibold ${getRiskLevelColor(riskData.riskLevel)}`}>
            {riskData.riskLevel} RISK
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Sensor Analysis</span>
              <span className="text-sm text-muted-foreground">{riskData.sensorRisk}%</span>
            </div>
            <Progress 
              value={riskData.sensorRisk} 
              className="h-3"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Image Analysis</span>
              <span className="text-sm text-muted-foreground">{riskData.imageRisk}%</span>
            </div>
            <Progress 
              value={riskData.imageRisk} 
              className="h-3"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between mb-2">
              <span className="text-base font-semibold text-foreground">Overall Risk</span>
              <span className="text-base font-bold text-foreground">{riskData.overallRisk}%</span>
            </div>
            <Progress 
              value={riskData.overallRisk} 
              className="h-4"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}