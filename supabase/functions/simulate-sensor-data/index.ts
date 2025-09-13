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

    // Generate realistic sensor data for multiple sectors
    const sectors = ['Sector A', 'Sector B', 'Sector C']
    const sensorData = []

    for (const sector of sectors) {
      // Simulate realistic sensor readings with some variation
      const baseVibration = 0.2 + Math.random() * 0.3
      const baseTemperature = 20 + Math.random() * 15
      const baseMoisture = 40 + Math.random() * 30

      sensorData.push({
        sector,
        vibration: Math.round(baseVibration * 1000) / 1000,
        temperature: Math.round(baseTemperature * 100) / 100,
        moisture: Math.round(baseMoisture * 100) / 100
      })
    }

    // Process the simulated data using the process-sensor-data function
    const processResponse = await fetch(`${Denv.get('SUPABASE_URL')}/functions/v1/process-sensor-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Denv.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ sensorData })
    })

    if (!processResponse.ok) {
      throw new Error('Failed to process sensor data')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sensor data simulated and processed',
        data: sensorData 
      }),
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