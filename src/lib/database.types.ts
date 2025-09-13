export interface Database {
  public: {
    Tables: {
      sensor_readings: {
        Row: {
          id: string;
          sector: string;
          vibration: number;
          temperature: number;
          moisture: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sector: string;
          vibration: number;
          temperature: number;
          moisture: number;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sector?: string;
          vibration?: number;
          temperature?: number;
          moisture?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          type: 'safe' | 'caution' | 'danger';
          message: string;
          sector: string;
          timestamp: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'safe' | 'caution' | 'danger';
          message: string;
          sector: string;
          timestamp?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'safe' | 'caution' | 'danger';
          message?: string;
          sector?: string;
          timestamp?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      risk_assessments: {
        Row: {
          id: string;
          sensor_risk: number;
          image_risk: number;
          overall_risk: number;
          risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
          sector: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sensor_risk: number;
          image_risk: number;
          overall_risk: number;
          risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
          sector: string;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sensor_risk?: number;
          image_risk?: number;
          overall_risk?: number;
          risk_level?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
          sector?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}