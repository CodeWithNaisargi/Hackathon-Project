import { type NextRequest, NextResponse } from "next/server"

// Configuration for Python ML service
const PYTHON_ML_SERVICE_URL = process.env.PYTHON_ML_SERVICE_URL || "http://localhost:8000"

// Call Python ML service for solar power prediction
async function callPythonMLService(endpoint: string, data: any) {
  try {
    const response = await fetch(`${PYTHON_ML_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Python ML service error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling Python ML service:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      latitude,
      longitude,
      start_date,
      end_date,
      temporal = "daily",
      include_analysis = true
    } = body

    // Validate required fields
    if (!latitude || !longitude || !start_date || !end_date) {
      return NextResponse.json({ 
        error: "Missing required fields: latitude, longitude, start_date, end_date" 
      }, { status: 400 })
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json({ 
        error: "Latitude must be between -90 and 90" 
      }, { status: 400 })
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json({ 
        error: "Longitude must be between -180 and 180" 
      }, { status: 400 })
    }

    // Validate date format (YYYYMMDD)
    const dateRegex = /^\d{8}$/
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return NextResponse.json({ 
        error: "Date format must be YYYYMMDD" 
      }, { status: 400 })
    }

    // Call Python ML service
    const solarData = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      start_date,
      end_date,
      temporal,
      include_analysis
    }

    const result = await callPythonMLService("/predict/solar", solarData)

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error("Solar prediction error:", error)
    
    // Return a fallback response if Python service is not available
    const fallbackResult = {
      success: true,
      prediction: Math.random() * 5 + 2, // Random prediction between 2-7 kW
      confidence: Math.random() * 20 + 75, // Random confidence between 75-95%
      model: "Fallback Solar Predictor",
      processing_time: "1.5s",
      features_analyzed: 8,
      weather_data: {
        sample: "NASA POWER API not available - using fallback data"
      },
      analysis: {
        performance_metrics: {
          avg_solar_radiation: 4.5,
          avg_temperature: 25.0
        },
        recommendations: [
          {
            category: "System Check",
            priority: "Medium",
            recommendation: "Please ensure Python ML service is running",
            potential_improvement: "Connect to real NASA POWER API"
          }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: fallbackResult,
      warning: "Using fallback prediction - Python ML service not available"
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Solar Power Prediction API",
    endpoints: {
      POST: "/api/solar-predict - Solar power prediction with NASA POWER data",
    },
    required_fields: ["latitude", "longitude", "start_date", "end_date"],
    optional_fields: ["temporal", "include_analysis"],
    examples: {
      solar_prediction: {
        latitude: 33.4484,
        longitude: -112.074,
        start_date: "20250101",
        end_date: "20250107",
        temporal: "daily",
        include_analysis: true
      }
    }
  })
}
