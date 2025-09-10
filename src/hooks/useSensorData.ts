import { useState, useEffect } from 'react';

interface SensorReading {
  time: string;
  vibration: number;
  temperature: number;
  moisture: number;
}

interface Alert {
  id: string;
  type: 'safe' | 'caution' | 'danger';
  message: string;
  timestamp: string;
  sector: string;
}

interface RiskData {
  sensorRisk: number;
  imageRisk: number;
  overallRisk: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export function useSensorData() {
  const [data, setData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskData, setRiskData] = useState<RiskData>({
    sensorRisk: 23,
    imageRisk: 15,
    overallRisk: 19,
    riskLevel: 'LOW'
  });

  useEffect(() => {
    // Initialize with some historical data
    const now = new Date();
    const initialData: SensorReading[] = [];
    
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30000);
      initialData.push({
        time: time.toLocaleTimeString(),
        vibration: 0.2 + Math.random() * 0.3,
        temperature: 22 + Math.random() * 8,
        moisture: 45 + Math.random() * 20
      });
    }
    
    setData(initialData);

    // Add initial alerts
    setAlerts([
      {
        id: '1',
        type: 'safe',
        message: 'All sensors operating within normal parameters',
        timestamp: '10:30 AM',
        sector: 'Sector A'
      },
      {
        id: '2', 
        type: 'caution',
        message: 'Minor vibration increase detected in monitoring zone',
        timestamp: '10:15 AM',
        sector: 'Sector C'
      }
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newReading: SensorReading = {
          time: new Date().toLocaleTimeString(),
          vibration: 0.2 + Math.random() * 0.4,
          temperature: 22 + Math.random() * 8,
          moisture: 45 + Math.random() * 20
        };

        const updatedData = [...prevData.slice(1), newReading];
        
        // Update risk based on latest readings
        const avgVibration = updatedData.slice(-5).reduce((sum, d) => sum + d.vibration, 0) / 5;
        const sensorRisk = Math.min(100, avgVibration * 100);
        const imageRisk = 15 + Math.random() * 10; // Simulated image analysis
        const overallRisk = Math.round((sensorRisk + imageRisk) / 2);
        
        let riskLevel: RiskData['riskLevel'] = 'LOW';
        if (overallRisk > 70) riskLevel = 'CRITICAL';
        else if (overallRisk > 50) riskLevel = 'HIGH';
        else if (overallRisk > 30) riskLevel = 'MODERATE';

        setRiskData({
          sensorRisk: Math.round(sensorRisk),
          imageRisk: Math.round(imageRisk),
          overallRisk,
          riskLevel
        });

        // Generate alerts based on risk
        if (sensorRisk > 60 && Math.random() > 0.8) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            type: 'danger',
            message: 'High vibration levels detected - Potential rockfall risk',
            timestamp: new Date().toLocaleTimeString(),
            sector: ['Sector A', 'Sector B', 'Sector C'][Math.floor(Math.random() * 3)]
          };
          
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        }

        return updatedData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { data, alerts, riskData };
}