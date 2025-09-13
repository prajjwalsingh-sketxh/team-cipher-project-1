import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SensorReading {
  id: string;
  time: string;
  vibration: number;
  temperature: number;
  moisture: number;
  sector: string;
  timestamp: string;
}

interface Alert {
  id: string;
  type: 'safe' | 'caution' | 'danger';
  message: string;
  timestamp: string;
  sector: string;
  is_active: boolean;
}

interface RiskData {
  sensorRisk: number;
  imageRisk: number;
  overallRisk: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export function useSupabaseSensorData() {
  const [data, setData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskData, setRiskData] = useState<RiskData>({
    sensorRisk: 0,
    imageRisk: 0,
    overallRisk: 0,
    riskLevel: 'LOW'
  });
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      // Fetch recent sensor readings
      const { data: sensorReadings, error: sensorError } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (sensorError) throw sensorError;

      // Transform data for charts
      const transformedData = sensorReadings?.map(reading => ({
        ...reading,
        time: new Date(reading.timestamp).toLocaleTimeString()
      })) || [];

      setData(transformedData);

      // Fetch active alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (alertsError) throw alertsError;

      const transformedAlerts = alertsData?.map(alert => ({
        ...alert,
        timestamp: new Date(alert.timestamp).toLocaleTimeString()
      })) || [];

      setAlerts(transformedAlerts);

      // Fetch latest risk assessment
      const { data: riskAssessment, error: riskError } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (riskError) throw riskError;

      if (riskAssessment && riskAssessment[0]) {
        const latest = riskAssessment[0];
        setRiskData({
          sensorRisk: latest.sensor_risk,
          imageRisk: latest.image_risk,
          overallRisk: latest.overall_risk,
          riskLevel: latest.risk_level
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Simulate sensor data periodically
  const simulateSensorData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('simulate-sensor-data');
      if (error) throw error;
      console.log('Sensor data simulated:', data);
    } catch (error) {
      console.error('Error simulating sensor data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Set up real-time subscriptions
    const sensorChannel = supabase
      .channel('sensor_readings')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_readings'
      }, (payload) => {
        const newReading = {
          ...payload.new,
          time: new Date(payload.new.timestamp).toLocaleTimeString()
        } as SensorReading;
        
        setData(prev => [newReading, ...prev.slice(0, 49)]);
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts'
      }, (payload) => {
        const newAlert = {
          ...payload.new,
          timestamp: new Date(payload.new.timestamp).toLocaleTimeString()
        } as Alert;
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      })
      .subscribe();

    const riskChannel = supabase
      .channel('risk_assessments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'risk_assessments'
      }, (payload) => {
        setRiskData({
          sensorRisk: payload.new.sensor_risk,
          imageRisk: payload.new.image_risk,
          overallRisk: payload.new.overall_risk,
          riskLevel: payload.new.risk_level
        });
      })
      .subscribe();

    // Simulate sensor data every 10 seconds
    const simulationInterval = setInterval(simulateSensorData, 10000);

    return () => {
      supabase.removeChannel(sensorChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(riskChannel);
      clearInterval(simulationInterval);
    };
  }, []);

  return { data, alerts, riskData, loading };
}