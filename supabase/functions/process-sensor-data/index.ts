import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Denv.get('SUPABASE_URL') ?? '',
      Denv.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { sensorData } = await req.json()
    
    // Calculate risk levels based on sensor data
    const calculateRisk = (vibration: number, temperature: number, moisture: number) => {
      // Risk calculation algorithm
      let sensorRisk = 0
      
      // Vibration risk (0.0-1.0 range, higher is more dangerous)
      if (vibration > 0.7) sensorRisk += 40
      else if (vibration > 0.5) sensorRisk += 25
      else if (vibration > 0.3) sensorRisk += 15
      else sensorRisk += 5
      
      // Temperature risk (extreme temperatures indicate instability)
      if (temperature > 35 || temperature < 0) sensorRisk += 30
      else if (temperature > 30 || temperature < 5) sensorRisk += 15
      else sensorRisk += 5
      
      // Moisture risk (high moisture weakens rock structure)
      if (moisture > 80) sensorRisk += 30
      else if (moisture > 60) sensorRisk += 15
      else sensorRisk += 5
      
      return Math.min(100, sensorRisk)
    }

    // Process each sensor reading
    for (const reading of sensorData) {
      const { sector, vibration, temperature, moisture } = reading
      
      // Insert sensor reading
      const { error: insertError } = await supabaseClient
        .from('sensor_readings')
        .insert({
          sector,
          vibration,
          temperature,
          moisture
        })
      
      if (insertError) throw insertError
      
      // Calculate risks
      const sensorRisk = calculateRisk(vibration, temperature, moisture)
      const imageRisk = Math.floor(Math.random() * 25) + 10 // Simulated image analysis
      const overallRisk = Math.round((sensorRisk + imageRisk) / 2)
      
      let riskLevel = 'LOW'
      if (overallRisk > 70) riskLevel = 'CRITICAL'
      else if (overallRisk > 50) riskLevel = 'HIGH'
      else if (overallRisk > 30) riskLevel = 'MODERATE'
      
      // Insert risk assessment
      const { error: riskError } = await supabaseClient
        .from('risk_assessments')
        .insert({
          sensor_risk: sensorRisk,
          image_risk: imageRisk,
          overall_risk: overallRisk,
          risk_level: riskLevel,
          sector
        })
      
      if (riskError) throw riskError
      
      // Generate alerts if necessary
      if (overallRisk > 60) {
        const alertType = overallRisk > 80 ? 'danger' : 'caution'
        let message = ''
        
        if (vibration > 0.6) {
          message = `High vibration levels detected in ${sector} - Potential rockfall risk`
        } else if (temperature > 30 || temperature < 5) {
          message = `Extreme temperature readings in ${sector} - Monitor for structural changes`
        } else if (moisture > 70) {
          message = `High moisture levels in ${sector} - Rock stability may be compromised`
        } else {
          message = `Elevated risk conditions detected in ${sector}`
        }
        
        const { error: alertError } = await supabaseClient
          .from('alerts')
          .insert({
            type: alertType,
            message,
            sector
          })
        
        if (alertError) throw alertError
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Sensor data processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})