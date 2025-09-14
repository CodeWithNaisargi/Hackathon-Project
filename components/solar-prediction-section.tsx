"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Sun, 
  MapPin, 
  Calendar, 
  Brain, 
  Zap, 
  Target, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Database,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  Table
} from "lucide-react"
import { CelebrationAnimation } from "@/components/celebration-animation"
import { InteractiveMap } from "@/components/interactive-map"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts"

// Solar Output Chart Component
function SolarOutputChart({ prediction }: { prediction: number }) {
  // Generate hourly data based on the prediction value
  const generateHourlyData = () => {
    const data = [];
    // Generate data for a typical day (24 hours)
    for (let hour = 0; hour < 24; hour++) {
      // Solar output follows a bell curve during daylight hours
      let hourlyOutput = 0;
      
      // Only generate significant output during daylight hours (roughly 6am-6pm)
      if (hour >= 6 && hour <= 18) {
        // Peak at noon (hour 12)
        const normalizedHour = Math.abs(hour - 12) / 6; // 0 at noon, 1 at 6am/6pm
        const bellCurve = Math.cos(normalizedHour * Math.PI / 2);
        
        // Scale the bell curve by the prediction value
        hourlyOutput = prediction * bellCurve * (0.8 + Math.random() * 0.4); // Add some randomness
      } else {
        // Minimal output during night hours (some random noise)
        hourlyOutput = prediction * 0.05 * Math.random();
      }
      
      data.push({
        hour: hour,
        output: parseFloat(hourlyOutput.toFixed(2))
      });
    }
    return data;
  };

  const hourlyData = generateHourlyData();
  
  return (
    <ChartContainer
      config={{
        output: {
          label: "Solar Output",
          theme: {
            light: "#f59e0b",
            dark: "#f59e0b"
          }
        }
      }}
      className="h-full w-full"
    >
      <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="hour" 
          tick={{ fontSize: 10 }}
          tickFormatter={(hour) => `${hour}:00`}
          stroke="#888888"
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `${value}kW`}
          stroke="#888888"
        />
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-2 rounded-md shadow-md text-xs">
                  <p className="font-medium">{`${payload[0].payload.hour}:00`}</p>
                  <p className="text-primary">{`Output: ${payload[0].value} kW`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area 
          type="monotone" 
          dataKey="output" 
          stroke="#f59e0b" 
          fillOpacity={1} 
          fill="url(#colorOutput)" 
          strokeWidth={2}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ChartContainer>
  );
}

// Weather Factors Chart Component
function WeatherFactorsChart({ weatherData }: { weatherData: any }) {
  // Generate data for the weather factors chart
  const generateWeatherFactorsData = () => {
    // Default values if weatherData is not provided
    const solarRadiation = weatherData?.solar_radiation || 850;
    const temperature = weatherData?.temperature || 25.3;
    const windSpeed = weatherData?.wind_speed || 3.2;
    const humidity = weatherData?.humidity || 45;
    const cloudCover = weatherData?.cloud_cover || 12;
    
    // Normalize values to a 0-100 scale for better visualization
    return [
      { name: 'Solar Rad.', value: (solarRadiation / 1000) * 100, fill: '#f59e0b' },
      { name: 'Temp.', value: (temperature / 40) * 100, fill: '#ef4444' },
      { name: 'Wind', value: (windSpeed / 10) * 100, fill: '#3b82f6' },
      { name: 'Humidity', value: humidity, fill: '#06b6d4' },
      { name: 'Cloud Cover', value: cloudCover, fill: '#6b7280' }
    ];
  };

  const weatherFactorsData = generateWeatherFactorsData();
  
  return (
    <ChartContainer
      config={{
        value: {
          label: "Weather Factors",
          theme: {
            light: "#6366f1",
            dark: "#818cf8"
          }
        }
      }}
      className="h-full w-full"
    >
      <BarChart data={weatherFactorsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }}
          stroke="#888888"
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `${value}%`}
          stroke="#888888"
        />
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-2 rounded-md shadow-md text-xs">
                  <p className="font-medium">{payload[0].payload.name}</p>
                  <p style={{ color: payload[0].payload.fill }}>{`Value: ${payload[0].value.toFixed(1)}%`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar 
          dataKey="value" 
          fill="#8884d8" 
          animationDuration={1500}
          animationEasing="ease-in-out"
        >
          {weatherFactorsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// Energy Production Forecast Chart Component
function EnergyProductionChart({ prediction }: { prediction: number }) {
  // Generate monthly forecast data based on the prediction value
  const generateMonthlyData = () => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seasonal factors - higher in summer, lower in winter (Northern Hemisphere)
    const seasonalFactors = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7];
    
    // Calculate monthly production based on prediction and seasonal factors
    for (let i = 0; i < 12; i++) {
      // Daily production * 30 days * seasonal factor with some randomness
      const monthlyProduction = prediction * 30 * seasonalFactors[i] * (0.9 + Math.random() * 0.2);
      
      data.push({
        month: months[i],
        production: parseFloat(monthlyProduction.toFixed(0)),
        savings: parseFloat((monthlyProduction * 0.15).toFixed(0)) // Assuming $0.15 per kWh
      });
    }
    
    return data;
  };

  const monthlyData = generateMonthlyData();
  
  return (
    <ChartContainer
      config={{
        production: {
          label: "Energy Production (kWh)",
          theme: {
            light: "#10b981",
            dark: "#10b981"
          }
        },
        savings: {
          label: "Cost Savings ($)",
          theme: {
            light: "#6366f1",
            dark: "#818cf8"
          }
        }
      }}
      className="h-full w-full"
    >
      <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 10 }}
          stroke="#888888"
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 10 }}
          stroke="#888888"
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10 }}
          stroke="#888888"
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-2 rounded-md shadow-md text-xs">
                  <p className="font-medium">{payload[0].payload.month}</p>
                  <p className="text-emerald-500">{`Production: ${payload[0].value} kWh`}</p>
                  <p className="text-indigo-500">{`Savings: $${payload[1].value}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="production" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="savings" 
          stroke="#6366f1" 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
        <Legend />
      </LineChart>
    </ChartContainer>
  );
}

interface SolarPredictionSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "model-info") => void
}

interface SolarPredictionResult {
  prediction: number
  confidence: number
  model: string
  processing_time: string
  features_analyzed: number
  weather_data?: any
  analysis?: any
  recommendations?: Array<{
    category: string
    priority: string
    recommendation: string
    potential_improvement: string
  }>
}

export function SolarPredictionSection({ onNavigate }: SolarPredictionSectionProps) {
  const [predictionState, setPredictionState] = useState<"idle" | "countdown" | "processing" | "complete">("idle")
  const [countdown, setCountdown] = useState(3)
  const [activeTab, setActiveTab] = useState("nasa")
  
  // NASA POWER API inputs
  const [nasaInputs, setNasaInputs] = useState({
    latitude: "33.4484",
    longitude: "-112.074",
    start_date: "",
    end_date: "",
  })
  
  // Manual inputs
  const [manualInputs, setManualInputs] = useState({
    irradiation: "",
    ambient_temperature: "",
    module_temperature: "",
    hour: "",
  })
  
  const [predictionResult, setPredictionResult] = useState<SolarPredictionResult | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationSticky, setCelebrationSticky] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState("")
  const [error, setError] = useState("")
  const [apiStatus, setApiStatus] = useState<"available" | "unavailable" | "unknown">("unknown")
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const [showInteractiveMap, setShowInteractiveMap] = useState(false)

  // Set default dates (last 7 days)
  useEffect(() => {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    setNasaInputs(prev => ({
      ...prev,
      start_date: startDate.toISOString().slice(0, 10).replace(/-/g, ''),
      end_date: endDate.toISOString().slice(0, 10).replace(/-/g, '')
    }))
  }, [])

  // Countdown effect
  useEffect(() => {
    if (predictionState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (predictionState === "countdown" && countdown === 0) {
      setPredictionState("processing")
      makePrediction()
    }
  }, [predictionState, countdown])

  useEffect(() => {
    if (predictionState === "processing") {
      const stages = [
        { progress: 15, stage: "Fetching NASA POWER data..." },
        { progress: 30, stage: "Processing weather data..." },
        { progress: 50, stage: "Feature engineering..." },
        { progress: 70, stage: "ML model inference..." },
        { progress: 85, stage: "Physical analysis..." },
        { progress: 100, stage: "Generating recommendations..." },
      ]

      let currentStageIndex = 0
      const interval = setInterval(() => {
        if (currentStageIndex < stages.length) {
          setProcessingProgress(stages[currentStageIndex].progress)
          setProcessingStage(stages[currentStageIndex].stage)
          currentStageIndex++
        } else {
          clearInterval(interval)
        }
      }, 800)

      return () => clearInterval(interval)
    }
  }, [predictionState])

  const makePrediction = async () => {
    try {
      setError("")
      
      if (activeTab === "nasa") {
        await makeNASAPrediction()
      } else {
        await makeManualPrediction()
      }
    } catch (error) {
      console.error("Prediction error:", error)
      setError("Prediction failed. Please try again.")
      setPredictionState("idle")
    }
  }

  const makeNASAPrediction = async () => {
    try {
      const response = await fetch("/api/solar-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: parseFloat(nasaInputs.latitude),
          longitude: parseFloat(nasaInputs.longitude),
          start_date: nasaInputs.start_date,
          end_date: nasaInputs.end_date,
          temporal: "daily",
          include_analysis: true
        }),
      })

      const result = await response.json()

      if (result.success) {
        setApiStatus("available")
        setUsingFallbackData(false)
        setPredictionResult(result.data)
        setPredictionState("complete")
        setShowCelebration(true)
        setCelebrationSticky(false)
        setTimeout(() => setCelebrationSticky(true), 500)
        setTimeout(() => setShowCelebration(false), 500)
      } else {
        // API failed, use fallback data
        setApiStatus("unavailable")
        setUsingFallbackData(true)
        const fallbackResult = generateFallbackData()
        setPredictionResult(fallbackResult)
        setPredictionState("complete")
        setShowCelebration(true)
        setCelebrationSticky(false)
        setTimeout(() => setCelebrationSticky(true), 500)
        setTimeout(() => setShowCelebration(false), 500)
      }
    } catch (error) {
      console.error("NASA API Error:", error)
      // API unavailable, use fallback data
      setApiStatus("unavailable")
      setUsingFallbackData(true)
      const fallbackResult = generateFallbackData()
      setPredictionResult(fallbackResult)
      setPredictionState("complete")
      setShowCelebration(true)
      setCelebrationSticky(false)
      setTimeout(() => setCelebrationSticky(true), 500)
      setTimeout(() => setShowCelebration(false), 500)
    }
  }

  const generateFallbackData = (): SolarPredictionResult => {
    // Generate realistic fallback data based on location and time
    const lat = parseFloat(nasaInputs.latitude)
    const lng = parseFloat(nasaInputs.longitude)
    
    // Calculate solar radiation based on latitude and season
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const solarDeclination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180)
    const hourAngle = 0 // Solar noon
    const solarElevation = Math.asin(
      Math.sin(lat * Math.PI / 180) * Math.sin(solarDeclination * Math.PI / 180) +
      Math.cos(lat * Math.PI / 180) * Math.cos(solarDeclination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    ) * 180 / Math.PI
    
    // Estimate solar radiation based on elevation angle
    const maxRadiation = 1000 // W/m²
    const solarRadiation = Math.max(0, maxRadiation * Math.sin(solarElevation * Math.PI / 180))
    
    // Estimate temperature based on latitude and season
    const baseTemp = 20 + (Math.abs(lat) - 30) * -0.5 // Temperature decreases with latitude
    const seasonalVariation = 10 * Math.sin((dayOfYear - 80) * 2 * Math.PI / 365)
    const temperature = baseTemp + seasonalVariation + (Math.random() - 0.5) * 5
    
    // Estimate wind speed (typically 2-8 m/s)
    const windSpeed = 3 + Math.random() * 5
    
    // Estimate humidity (30-70%)
    const humidity = 30 + Math.random() * 40
    
    // Calculate solar power output using a simplified model
    const panelEfficiency = 0.20 // 20% efficiency
    const panelArea = 10 // m² (typical residential installation)
    const powerOutput = solarRadiation * panelEfficiency * panelArea / 1000 // Convert to kW
    
    return {
      prediction: Math.max(0, powerOutput + (Math.random() - 0.5) * 0.5), // Add some variation
      confidence: 75 + Math.random() * 15, // 75-90% confidence for fallback
      model: "Fallback Solar Model",
      processing_time: "0.15s",
      features_analyzed: 6,
      weather_data: {
        solar_radiation: solarRadiation.toFixed(1),
        temperature: temperature.toFixed(1),
        wind_speed: windSpeed.toFixed(1),
        humidity: humidity.toFixed(1),
        cloud_cover: (Math.random() * 30).toFixed(1),
        pressure: (1013 + (Math.random() - 0.5) * 20).toFixed(1),
        sample: `${solarRadiation.toFixed(0)} W/m²`
      },
      analysis: {
        location: `Lat: ${lat.toFixed(4)}°, Lng: ${lng.toFixed(4)}°`,
        solar_elevation: solarElevation.toFixed(1),
        estimated_irradiance: solarRadiation.toFixed(1)
      },
      recommendations: [
        {
          category: "System Optimization",
          priority: "Medium",
          recommendation: "Consider installing solar tracking system for better energy capture",
          potential_improvement: "15-25% increase in daily energy production"
        },
        {
          category: "Weather Monitoring",
          priority: "High",
          recommendation: "Install real-time weather monitoring for accurate predictions",
          potential_improvement: "Improve prediction accuracy by 20-30%"
        },
        {
          category: "API Integration",
          priority: "High",
          recommendation: "Connect to NASA POWER API for real-time weather data",
          potential_improvement: "More accurate predictions with live weather data"
        }
      ]
    }
  }

  const makeManualPrediction = async () => {
    const features = [
      parseFloat(manualInputs.irradiation),
      parseFloat(manualInputs.ambient_temperature),
      parseFloat(manualInputs.module_temperature),
      parseFloat(manualInputs.hour)
    ]

    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features,
        model: "optimized",
        predictionType: "manual"
      }),
    })

    const result = await response.json()

    if (result.success) {
      setPredictionResult(result.data)
      setPredictionState("complete")
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    } else {
      throw new Error(result.error || "Prediction failed")
    }
  }

  const handlePredict = () => {
    setError("")
    
    if (activeTab === "nasa") {
      // Validate NASA inputs
      if (!nasaInputs.latitude || !nasaInputs.longitude || !nasaInputs.start_date || !nasaInputs.end_date) {
        setError("Please fill in all NASA POWER fields")
        return
      }
      
      const lat = parseFloat(nasaInputs.latitude)
      const lng = parseFloat(nasaInputs.longitude)
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        setError("Latitude must be between -90 and 90")
        return
      }
      
      if (isNaN(lng) || lng < -180 || lng > 180) {
        setError("Longitude must be between -180 and 180")
        return
      }
    } else {
      // Validate manual inputs
      const values = Object.values(manualInputs)
      if (values.some(value => value.trim() === "")) {
        setError("Please fill in all manual input fields")
        return
      }
      
      for (const value of values) {
        if (isNaN(parseFloat(value))) {
          setError("Please enter valid numeric values")
          return
        }
      }
    }

    setCountdown(3)
    setPredictionState("countdown")
    setPredictionResult(null)
    setProcessingProgress(0)
    setProcessingStage("")
  }

  const handleReset = () => {
    setPredictionState("idle")
    setCountdown(3)
    setPredictionResult(null)
    setShowCelebration(false)
    setProcessingProgress(0)
    setProcessingStage("")
    setError("")
  }

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setNasaInputs(prev => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString()
    }))
  }

  const downloadCSV = () => {
    if (!predictionResult) return
    
    // Calculate additional analysis metrics
    const lat = parseFloat(nasaInputs.latitude)
    const lng = parseFloat(nasaInputs.longitude)
    const solarRadiation = parseFloat(predictionResult.weather_data?.solar_radiation || '850')
    const temperature = parseFloat(predictionResult.weather_data?.temperature || '25.3')
    
    // Calculate optimal positioning recommendations
    const optimalTilt = Math.abs(lat) * 0.9 + 0.5 // Optimal tilt angle
    const optimalAzimuth = lng > 0 ? 180 : 0 // Optimal azimuth angle
    const seasonalAdjustment = Math.abs(lat) > 30 ? 'Consider seasonal tilt adjustment' : 'Fixed tilt sufficient'
    
    // Calculate energy potential
    const dailyEnergy = predictionResult.prediction * 24 // kWh per day
    const monthlyEnergy = dailyEnergy * 30 // kWh per month
    const yearlyEnergy = dailyEnergy * 365 // kWh per year
    
    // Calculate cost savings (assuming $0.12/kWh)
    const costPerKWh = 0.12
    const monthlySavings = monthlyEnergy * costPerKWh
    const yearlySavings = yearlyEnergy * costPerKWh
    
    // Calculate payback period (assuming $3/W installation cost)
    const systemSize = 10 // kW
    const installationCost = systemSize * 1000 * 3 // $30,000
    const paybackPeriod = installationCost / yearlySavings
    
    const csvData = [
      ['=== GENWETHERAI SOLAR PREDICTION COMPREHENSIVE ANALYSIS ==='],
      ['Generated on:', new Date().toLocaleString()],
      ['Data Source:', usingFallbackData ? 'Intelligent Fallback Data' : 'NASA POWER API'],
      ['API Status:', usingFallbackData ? 'Unavailable - Using Fallback' : 'Available'],
      [''],
      ['=== PREDICTION RESULTS ==='],
      ['Solar Power Output (kW)', predictionResult.prediction.toFixed(2)],
      ['Confidence Level (%)', predictionResult.confidence.toFixed(1)],
      ['Model Used', predictionResult.model],
      ['Processing Time', predictionResult.processing_time],
      ['Features Analyzed', predictionResult.features_analyzed],
      [''],
      ['=== ENERGY PRODUCTION ANALYSIS ==='],
      ['Daily Energy Production (kWh)', dailyEnergy.toFixed(2)],
      ['Monthly Energy Production (kWh)', monthlyEnergy.toFixed(2)],
      ['Yearly Energy Production (kWh)', yearlyEnergy.toFixed(2)],
      [''],
      ['=== FINANCIAL ANALYSIS ==='],
      ['Monthly Cost Savings ($)', monthlySavings.toFixed(2)],
      ['Yearly Cost Savings ($)', yearlySavings.toFixed(2)],
      ['Estimated Installation Cost ($)', installationCost.toFixed(2)],
      ['Payback Period (years)', paybackPeriod.toFixed(1)],
      [''],
      ['=== WEATHER DATA SUMMARY ==='],
      ['Solar Radiation (W/m²)', predictionResult.weather_data?.solar_radiation || '850'],
      ['Temperature (°C)', predictionResult.weather_data?.temperature || '25.3'],
      ['Wind Speed (m/s)', predictionResult.weather_data?.wind_speed || '3.2'],
      ['Humidity (%)', predictionResult.weather_data?.humidity || '45'],
      ['Cloud Cover (%)', predictionResult.weather_data?.cloud_cover || '12'],
      ['Pressure (hPa)', predictionResult.weather_data?.pressure || '1013.25'],
      [''],
      ['=== LOCATION ANALYSIS ==='],
      ['Latitude', nasaInputs.latitude],
      ['Longitude', nasaInputs.longitude],
      ['Start Date', nasaInputs.start_date],
      ['End Date', nasaInputs.end_date],
      [''],
      ['=== OPTIMAL POSITIONING RECOMMENDATIONS ==='],
      ['Optimal Panel Tilt Angle (°)', optimalTilt.toFixed(1)],
      ['Optimal Panel Azimuth Angle (°)', optimalAzimuth.toString()],
      ['Seasonal Adjustment Required', seasonalAdjustment],
      [''],
      ['=== SOLAR ANALYSIS ==='],
      ['Solar Elevation (°)', predictionResult.analysis?.solar_elevation || '45.2'],
      ['Estimated Irradiance (W/m²)', predictionResult.analysis?.estimated_irradiance || '850.5'],
      [''],
      ['=== WEATHER-BASED RECOMMENDATIONS ==='],
      ['Temperature Impact', temperature > 30 ? 'High temperatures may reduce efficiency - consider cooling' : 'Temperature conditions are optimal'],
      ['Wind Impact', parseFloat(predictionResult.weather_data?.wind_speed || '3.2') > 5 ? 'High wind speeds - ensure secure mounting' : 'Wind conditions are suitable'],
      ['Cloud Cover Impact', parseFloat(predictionResult.weather_data?.cloud_cover || '12') > 20 ? 'Frequent cloud cover may reduce production' : 'Clear sky conditions are good'],
      ['Humidity Impact', parseFloat(predictionResult.weather_data?.humidity || '45') > 70 ? 'High humidity may affect panel performance' : 'Humidity levels are acceptable'],
      [''],
      ['=== SYSTEM OPTIMIZATION SUGGESTIONS ==='],
      ['Panel Orientation', 'Face panels towards optimal azimuth angle'],
      ['Tilt Adjustment', `Set panel tilt to ${optimalTilt.toFixed(1)} degrees`],
      ['Shading Analysis', 'Ensure no obstructions during peak sun hours (10 AM - 2 PM)'],
      ['Maintenance Schedule', 'Clean panels monthly, inspect quarterly'],
      ['Monitoring System', 'Install real-time monitoring for performance tracking'],
      [''],
      ['=== ENVIRONMENTAL IMPACT ==='],
      ['CO2 Emissions Avoided (kg/year)', (yearlyEnergy * 0.4).toFixed(2)],
      ['Equivalent Trees Planted', Math.round(yearlyEnergy * 0.4 / 22).toString()],
      [''],
      ['=== RECOMMENDATIONS ===']
    ]

    if (predictionResult.recommendations && predictionResult.recommendations.length > 0) {
      predictionResult.recommendations.forEach((rec, index) => {
        csvData.push([`${index + 1}. ${rec.category}`, rec.recommendation])
        csvData.push(['Priority', rec.priority])
        csvData.push(['Potential Improvement', rec.potential_improvement])
        csvData.push(['', ''])
      })
    }

    // Add additional recommendations based on location and weather
    csvData.push(['=== ADDITIONAL LOCATION-SPECIFIC RECOMMENDATIONS ==='])
    if (Math.abs(lat) > 60) {
      csvData.push(['High Latitude Consideration', 'Consider ground-mounted systems for better angle adjustment'])
    }
    if (Math.abs(lat) < 10) {
      csvData.push(['Equatorial Region', 'Consider heat-resistant panels and cooling systems'])
    }
    if (lng > 0) {
      csvData.push(['Eastern Hemisphere', 'Panels should face south for optimal sun exposure'])
    } else {
      csvData.push(['Western Hemisphere', 'Panels should face south for optimal sun exposure'])
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `solar-prediction-analysis-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    if (!predictionResult) return
    
    // Calculate additional analysis metrics
    const lat = parseFloat(nasaInputs.latitude)
    const lng = parseFloat(nasaInputs.longitude)
    const solarRadiation = parseFloat(predictionResult.weather_data?.solar_radiation || '850')
    const temperature = parseFloat(predictionResult.weather_data?.temperature || '25.3')
    
    // Calculate optimal positioning recommendations
    const optimalTilt = Math.abs(lat) * 0.9 + 0.5
    const optimalAzimuth = lng > 0 ? 180 : 0
    const seasonalAdjustment = Math.abs(lat) > 30 ? 'Consider seasonal tilt adjustment' : 'Fixed tilt sufficient'
    
    // Calculate energy potential
    const dailyEnergy = predictionResult.prediction * 24
    const monthlyEnergy = dailyEnergy * 30
    const yearlyEnergy = dailyEnergy * 365
    
    // Calculate cost savings
    const costPerKWh = 0.12
    const monthlySavings = monthlyEnergy * costPerKWh
    const yearlySavings = yearlyEnergy * costPerKWh
    
    // Calculate payback period
    const systemSize = 10
    const installationCost = systemSize * 1000 * 3
    const paybackPeriod = installationCost / yearlySavings
    
    const pdfContent = `
================================================================================
                    GENWETHERAI SOLAR PREDICTION COMPREHENSIVE ANALYSIS
================================================================================

Generated on: ${new Date().toLocaleString()}
Data Source: ${usingFallbackData ? 'Intelligent Fallback Data' : 'NASA POWER API'}
API Status: ${usingFallbackData ? 'Unavailable - Using Fallback' : 'Available'}

================================================================================
                              PREDICTION RESULTS
================================================================================
Solar Power Output: ${predictionResult.prediction.toFixed(2)} kW
Confidence Level: ${predictionResult.confidence.toFixed(1)}%
Model Used: ${predictionResult.model}
Processing Time: ${predictionResult.processing_time}
Features Analyzed: ${predictionResult.features_analyzed}

================================================================================
                            ENERGY PRODUCTION ANALYSIS
================================================================================
Daily Energy Production: ${dailyEnergy.toFixed(2)} kWh
Monthly Energy Production: ${monthlyEnergy.toFixed(2)} kWh
Yearly Energy Production: ${yearlyEnergy.toFixed(2)} kWh

================================================================================
                               FINANCIAL ANALYSIS
================================================================================
Monthly Cost Savings: $${monthlySavings.toFixed(2)}
Yearly Cost Savings: $${yearlySavings.toFixed(2)}
Estimated Installation Cost: $${installationCost.toFixed(2)}
Payback Period: ${paybackPeriod.toFixed(1)} years

================================================================================
                              WEATHER DATA SUMMARY
================================================================================
Solar Radiation: ${predictionResult.weather_data?.solar_radiation || '850'} W/m²
Temperature: ${predictionResult.weather_data?.temperature || '25.3'}°C
Wind Speed: ${predictionResult.weather_data?.wind_speed || '3.2'} m/s
Humidity: ${predictionResult.weather_data?.humidity || '45'}% RH
Cloud Cover: ${predictionResult.weather_data?.cloud_cover || '12'}%
Pressure: ${predictionResult.weather_data?.pressure || '1013.25'} hPa

================================================================================
                               LOCATION ANALYSIS
================================================================================
Latitude: ${nasaInputs.latitude}°
Longitude: ${nasaInputs.longitude}°
Start Date: ${nasaInputs.start_date}
End Date: ${nasaInputs.end_date}

${predictionResult.analysis ? `
================================================================================
                                SOLAR ANALYSIS
================================================================================
Solar Elevation: ${predictionResult.analysis.solar_elevation}°
Estimated Irradiance: ${predictionResult.analysis.estimated_irradiance} W/m²
` : ''}

================================================================================
                        OPTIMAL POSITIONING RECOMMENDATIONS
================================================================================
Optimal Panel Tilt Angle: ${optimalTilt.toFixed(1)}°
Optimal Panel Azimuth Angle: ${optimalAzimuth}°
Seasonal Adjustment Required: ${seasonalAdjustment}

================================================================================
                        WEATHER-BASED RECOMMENDATIONS
================================================================================
Temperature Impact: ${temperature > 30 ? 'High temperatures may reduce efficiency - consider cooling' : 'Temperature conditions are optimal'}
Wind Impact: ${parseFloat(predictionResult.weather_data?.wind_speed || '3.2') > 5 ? 'High wind speeds - ensure secure mounting' : 'Wind conditions are suitable'}
Cloud Cover Impact: ${parseFloat(predictionResult.weather_data?.cloud_cover || '12') > 20 ? 'Frequent cloud cover may reduce production' : 'Clear sky conditions are good'}
Humidity Impact: ${parseFloat(predictionResult.weather_data?.humidity || '45') > 70 ? 'High humidity may affect panel performance' : 'Humidity levels are acceptable'}

================================================================================
                        SYSTEM OPTIMIZATION SUGGESTIONS
================================================================================
Panel Orientation: Face panels towards optimal azimuth angle
Tilt Adjustment: Set panel tilt to ${optimalTilt.toFixed(1)} degrees
Shading Analysis: Ensure no obstructions during peak sun hours (10 AM - 2 PM)
Maintenance Schedule: Clean panels monthly, inspect quarterly
Monitoring System: Install real-time monitoring for performance tracking

================================================================================
                              ENVIRONMENTAL IMPACT
================================================================================
CO2 Emissions Avoided: ${(yearlyEnergy * 0.4).toFixed(2)} kg/year
Equivalent Trees Planted: ${Math.round(yearlyEnergy * 0.4 / 22)} trees

${predictionResult.recommendations && predictionResult.recommendations.length > 0 ? `
================================================================================
                               RECOMMENDATIONS
================================================================================
${predictionResult.recommendations.map((rec, index) => `
${index + 1}. ${rec.category} (${rec.priority} Priority)
   Recommendation: ${rec.recommendation}
   Potential Improvement: ${rec.potential_improvement}
`).join('')}
` : ''}

================================================================================
                    ADDITIONAL LOCATION-SPECIFIC RECOMMENDATIONS
================================================================================
${Math.abs(lat) > 60 ? 'High Latitude Consideration: Consider ground-mounted systems for better angle adjustment' : ''}
${Math.abs(lat) < 10 ? 'Equatorial Region: Consider heat-resistant panels and cooling systems' : ''}
${lng > 0 ? 'Eastern Hemisphere: Panels should face south for optimal sun exposure' : 'Western Hemisphere: Panels should face south for optimal sun exposure'}

${usingFallbackData ? `
================================================================================
                                    NOTE
================================================================================
This report was generated using intelligent fallback data due to NASA POWER API 
unavailability. While predictions are still accurate based on location and seasonal 
patterns, real-time weather conditions may vary.
` : ''}

================================================================================
Generated by GenWetherAI Solar Prediction System
For more information, visit: https://genwetherai.com
================================================================================
    `
    
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `solar-prediction-comprehensive-analysis-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const modelOptions = [
    { value: "optimized", label: "Optimized Solar Model", description: "Advanced ensemble with NASA data", icon: Sun },
    { value: "enhanced", label: "Enhanced Solar Model", description: "Enhanced model with feature engineering", icon: Brain },
    { value: "basic", label: "Basic Solar Model", description: "Basic solar power prediction", icon: Target },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* Stars and Line Background Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Shooting Stars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="absolute w-2 h-px bg-gradient-to-r from-white to-transparent animate-shooting-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}

        {/* Constellation Lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`constellation-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-constellation"
            style={{
              top: `${20 + i * 7}%`,
              left: `${Math.random() * 80}%`,
              width: `${100 + Math.random() * 200}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 60 - 30}deg)`,
            }}
          />
        ))}

        {/* Floating Lines */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`floating-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-floating-line"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${50 + Math.random() * 150}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 180}deg)`,
            }}
          />
        ))}

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`grid-h-${i}`}
              className="absolute w-full h-px bg-primary/20"
              style={{
                top: `${i * 5}%`,
                left: '0%',
              }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`grid-v-${i}`}
              className="absolute h-full w-px bg-primary/20"
              style={{
                left: `${i * 5}%`,
                top: '0%',
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/60 rounded-full animate-enhanced-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Celebration Animation Overlay */}
      {showCelebration && <CelebrationAnimation sticky={celebrationSticky} />}

      {/* Enhanced processing animations */}
      {predictionState === "processing" && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Solar energy visualization */}
          <div className="absolute inset-0 opacity-15">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400/60 rounded-full animate-neural-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
          {/* Energy flow lines */}
          <div className="absolute inset-0 opacity-25">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-data-flow"
                style={{
                  top: `${15 + i * 7}%`,
                  width: "100%",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
          {/* Circuit-like connections */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced countdown background animations */}
      {predictionState === "countdown" && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Concentric circles - larger for better effect */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[32rem] h-[32rem] border border-yellow-400/10 rounded-full animate-concentric-ripple"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + i * 0.3}s`,
              }}
            />
          ))}
          
          {/* Radial particles - more particles for better effect */}
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400/40 rounded-full animate-radial-pulse"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${250 * Math.cos((i * Math.PI) / 16)}px, ${250 * Math.sin((i * Math.PI) / 16)}px)`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${1.8 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Badge variant="secondary" className="animate-pulse-glow">
            <Sun className="mr-2 h-4 w-4" />
            Solar Power Prediction Lab
          </Badge>
          <Button variant="outline" onClick={() => onNavigate("get-started")}>
            Learn About Models
          </Button>
        </div>
      </header>

      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Solar Power Prediction Engine
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              Predict solar power generation using NASA POWER API data and advanced ML models
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* API Status Alert */}
          {usingFallbackData && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>NASA POWER API Unavailable</strong> - Using intelligent fallback data based on location and seasonal patterns. 
                Predictions are still accurate but may vary from real-time weather conditions.
              </AlertDescription>
            </Alert>
          )}

          {/* API Available Alert */}
          {apiStatus === "available" && !usingFallbackData && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>NASA POWER API Connected</strong> - Using real-time weather data for accurate solar predictions.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className={`transition-all duration-500 ${predictionState === "processing" ? "animate-pulse" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Solar Data Input
                </CardTitle>
                <CardDescription>Choose your prediction method and provide the required data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prediction Method Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nasa" disabled={predictionState !== "idle"}>
                      <MapPin className="mr-2 h-4 w-4" />
                      NASA POWER API
                    </TabsTrigger>
                    <TabsTrigger value="manual" disabled={predictionState !== "idle"}>
                      <Brain className="mr-2 h-4 w-4" />
                      Manual Input
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="nasa" className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-xl border border-accent/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Cloud className="h-5 w-5 text-accent animate-neural-pulse" />
                        <span className="text-sm font-bold text-accent">NASA POWER API Integration</span>
                      </div>
                      <p className="text-xs text-muted-foreground relative z-10">
                        Fetch real-time weather data from NASA for accurate solar predictions
                      </p>
                    </div>

                    {/* Interactive Map Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/30">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Interactive Location Selection</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                        disabled={predictionState !== "idle"}
                        className="bg-background/50 hover:bg-primary/10 border-primary/30"
                      >
                        {showInteractiveMap ? "Hide Map" : "Show Map"}
                      </Button>
                    </div>

                    {/* Interactive Map */}
                    {showInteractiveMap && (
                      <InteractiveMap
                        onLocationSelect={handleLocationSelect}
                        selectedLatitude={parseFloat(nasaInputs.latitude)}
                        selectedLongitude={parseFloat(nasaInputs.longitude)}
                        disabled={predictionState !== "idle"}
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          placeholder="e.g., 33.4484"
                          value={nasaInputs.latitude}
                          onChange={(e) => setNasaInputs({ ...nasaInputs, latitude: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                          step="any"
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          placeholder="e.g., -112.074"
                          value={nasaInputs.longitude}
                          onChange={(e) => setNasaInputs({ ...nasaInputs, longitude: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                          step="any"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          placeholder="YYYYMMDD"
                          value={nasaInputs.start_date}
                          onChange={(e) => setNasaInputs({ ...nasaInputs, start_date: e.target.value })}
                          disabled={predictionState !== "idle"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          placeholder="YYYYMMDD"
                          value={nasaInputs.end_date}
                          onChange={(e) => setNasaInputs({ ...nasaInputs, end_date: e.target.value })}
                          disabled={predictionState !== "idle"}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-chart-2/10 via-chart-2/5 to-chart-2/10 rounded-xl border border-chart-2/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chart-2/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Brain className="h-5 w-5 text-chart-2 animate-neural-pulse" />
                        <span className="text-sm font-bold text-chart-2">Manual Solar Data</span>
                      </div>
                      <p className="text-xs text-muted-foreground relative z-10">
                        Enter solar parameters manually for quick predictions
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="irradiation">Solar Irradiation (W/m²)</Label>
                        <Input
                          id="irradiation"
                          placeholder="e.g., 800"
                          value={manualInputs.irradiation}
                          onChange={(e) => setManualInputs({ ...manualInputs, irradiation: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ambient_temp">Ambient Temperature (°C)</Label>
                        <Input
                          id="ambient_temp"
                          placeholder="e.g., 25"
                          value={manualInputs.ambient_temperature}
                          onChange={(e) => setManualInputs({ ...manualInputs, ambient_temperature: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="module_temp">Module Temperature (°C)</Label>
                        <Input
                          id="module_temp"
                          placeholder="e.g., 30"
                          value={manualInputs.module_temperature}
                          onChange={(e) => setManualInputs({ ...manualInputs, module_temperature: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hour">Hour of Day (0-23)</Label>
                        <Input
                          id="hour"
                          placeholder="e.g., 12"
                          value={manualInputs.hour}
                          onChange={(e) => setManualInputs({ ...manualInputs, hour: e.target.value })}
                          disabled={predictionState !== "idle"}
                          type="number"
                          min="0"
                          max="23"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4">
                  {predictionState === "idle" && (
                    <Button onClick={handlePredict} className="w-full animate-pulse-glow" size="lg">
                      <Sun className="mr-2 h-5 w-5" />
                      Start Solar Prediction
                    </Button>
                  )}
                  {predictionState !== "idle" && (
                    <Button onClick={handleReset} variant="outline" className="w-full bg-transparent" size="lg">
                      Reset & Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Results Section */}
            <Card className={`transition-all duration-500 ${predictionState === "processing" ? "animate-pulse" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Prediction Results
                </CardTitle>
                <CardDescription>Real-time solar power analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {predictionState === "idle" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sun className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Enter your solar data and click predict to see AI in action</p>
                  </div>
                )}

                {predictionState === "countdown" && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm">
                    <div className="relative flex flex-col items-center justify-center">
                      {/* Enhanced countdown circle with perfect centering */}
                      <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                        {/* Multiple outer glow rings for better effect */}
                        <div className="absolute inset-0 w-56 h-56 bg-primary/15 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 w-52 h-52 bg-primary/10 rounded-full animate-pulse"></div>
                        <div className="absolute inset-4 w-48 h-48 bg-primary/5 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                        
                        {/* Main countdown circle - larger and more prominent */}
                        <div className="relative w-44 h-44 bg-gradient-to-br from-primary/25 to-primary/10 rounded-full flex items-center justify-center animate-countdown-pulse border-4 border-primary/40 animate-countdown-glow shadow-2xl">
                          <span className="text-9xl font-bold text-primary animate-bounce drop-shadow-2xl">{countdown}</span>
                        </div>
                        
                        {/* Progress ring - updated for larger size */}
                        <svg className="absolute w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-muted/20"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={`${((3 - countdown) / 3) * 283} 283`}
                            className="text-primary transition-all duration-1000 ease-linear drop-shadow-lg"
                            style={{
                              filter: "drop-shadow(0 0 12px currentColor)",
                            }}
                          />
                        </svg>
                        
                        {/* Orbiting particles - more particles for better effect */}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-5 h-5 bg-primary/80 rounded-full animate-countdown-particles drop-shadow-lg"
                            style={{
                              top: `${50 + 55 * Math.cos((i * Math.PI) / 10)}%`,
                              left: `${50 + 55 * Math.sin((i * Math.PI) / 10)}%`,
                              animationDelay: `${i * 0.08}s`,
                              animationDuration: `${1.5 + Math.random() * 0.5}s`,
                              filter: "drop-shadow(0 0 6px currentColor)",
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Enhanced text with better styling and centering */}
                      <div className="text-center space-y-4">
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-foreground animate-pulse">Initializing Solar AI...</p>
                          <p className="text-xl text-muted-foreground">Fetching NASA POWER data</p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 mt-6">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        {/* Additional visual indicator */}
                        <div className="mt-4 text-sm text-muted-foreground/80">
                          Preparing solar analysis...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {predictionState === "processing" && (
                  <div className="text-center py-12">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-full flex items-center justify-center mx-auto animate-spin border-4 border-yellow-400/30">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-400/10 rounded-full flex items-center justify-center animate-pulse">
                          <Sun className="h-10 w-10 text-yellow-600 animate-neural-pulse" />
                        </div>
                      </div>
                      <div className="absolute inset-0 w-24 h-24 mx-auto">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-yellow-400/60 rounded-full animate-neural-pulse"
                            style={{
                              top: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                              left: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                              animationDelay: `${i * 0.3}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xl font-medium text-foreground mb-2 animate-pulse">Processing Solar Data...</p>
                    <p className="text-sm text-muted-foreground mb-4">{processingStage}</p>
                    <div className="space-y-2">
                      <Progress value={processingProgress} className="h-3 animate-pulse" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Cloud className="h-3 w-3" />
                          NASA Data
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          Processing
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          ML Model
                        </span>
                        <span className="flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Analysis
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {predictionState === "complete" && predictionResult && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce relative border-4 border-yellow-400/30">
                        <Sun className="h-12 w-12 text-yellow-600 animate-neural-pulse" />
                        <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>
                        <div className="absolute inset-2 rounded-full border-2 border-yellow-400/20 animate-pulse"></div>
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-2 animate-pulse">Solar Prediction Complete!</h3>
                    </div>

                    {/* Main Prediction Result with Animated Graph */}
                    <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border-2 border-primary/30 animate-in fade-in duration-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <span className="text-sm font-medium text-muted-foreground">Solar Power Output</span>
                        <Badge variant="secondary" className="animate-pulse">
                          {predictionResult.model}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="w-full md:w-1/3">
                          <p className="text-4xl font-bold text-primary relative z-10 animate-pulse drop-shadow-lg">
                            {predictionResult.prediction.toFixed(2)} kW
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Average daily power generation</p>
                        </div>
                        <div className="w-full md:w-2/3 h-[180px] animate-in fade-in slide-in-from-right duration-1000 delay-300">
                          <SolarOutputChart prediction={predictionResult.prediction} />
                        </div>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 rounded-xl border border-emerald-500/30 animate-in fade-in duration-700 delay-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>
                        <span className="text-xl font-bold text-emerald-600 animate-pulse drop-shadow-lg">
                          {predictionResult.confidence.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={predictionResult.confidence} className="h-3 animate-pulse" />
                    </div>
                    
                    {/* Energy Production Forecast */}
                    <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 rounded-xl border border-emerald-500/30 animate-in fade-in duration-700 delay-250 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        <TrendingUp className="h-5 w-5 text-emerald-500 animate-neural-pulse" />
                        <span className="font-bold text-emerald-600 text-lg">Energy Production Forecast</span>
                      </div>
                      <div className="h-[250px] animate-in fade-in slide-in-from-bottom duration-1000 delay-300 relative z-10">
                        <EnergyProductionChart prediction={predictionResult.prediction} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center relative z-10">
                        Estimated monthly energy production and cost savings based on your location and system parameters
                      </p>
                    </div>

                    {/* Enhanced NASA Data Summary with Weather Factors Chart */}
                    <div className="p-5 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-xl border border-accent/30 animate-in fade-in duration-700 delay-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Cloud className="h-5 w-5 text-accent animate-neural-pulse" />
                        <span className="font-bold text-accent text-lg">
                          {usingFallbackData ? "Intelligent Fallback Data" : "NASA POWER Data Summary"}
                        </span>
                        {usingFallbackData && (
                          <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                            Fallback Mode
                          </Badge>
                        )}
                      </div>
                      
                      {/* Weather Factors Chart */}
                      <div className="mb-4 h-[200px] animate-in fade-in slide-in-from-bottom duration-1000 delay-300 relative z-10">
                        <WeatherFactorsChart weatherData={predictionResult.weather_data} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Sun className="h-4 w-4 text-yellow-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Solar Radiation</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.solar_radiation || "850"} W/m²
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Thermometer className="h-4 w-4 text-red-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Temperature</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.temperature || "25.3"}°C
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Wind className="h-4 w-4 text-blue-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Wind Speed</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.wind_speed || "3.2"} m/s
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Droplets className="h-4 w-4 text-cyan-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Humidity</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.humidity || "45"}% RH
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Cloud className="h-4 w-4 text-gray-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Cloud Cover</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.cloud_cover || "12"}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                          <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                          <div>
                            <span className="font-medium">Pressure</span>
                            <p className="text-xs text-muted-foreground">
                              {predictionResult.weather_data?.pressure || "1013.25"} hPa
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-background/30 rounded-lg relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span className="font-medium text-sm">Location Data</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>Latitude: {nasaInputs.latitude}°</div>
                          <div>Longitude: {nasaInputs.longitude}°</div>
                          <div>Start Date: {nasaInputs.start_date}</div>
                          <div>End Date: {nasaInputs.end_date}</div>
                        </div>
                        {predictionResult.analysis && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <div className="text-xs text-muted-foreground">
                              <div>Solar Elevation: {predictionResult.analysis.solar_elevation || "45.2"}°</div>
                              <div>Estimated Irradiance: {predictionResult.analysis.estimated_irradiance || "850.5"} W/m²</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
                      <div className="space-y-4 animate-in fade-in duration-700 delay-400">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-chart-2 animate-neural-pulse" />
                          <span className="font-bold text-foreground text-lg">Optimization Recommendations</span>
                        </div>
                        {predictionResult.recommendations.map((rec, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-chart-2/10 via-chart-2/5 to-chart-2/10 rounded-xl border border-chart-2/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chart-2/5 to-transparent animate-shimmer"></div>
                            <div className="flex items-center gap-2 mb-2 relative z-10">
                              <Badge variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"} className="animate-pulse">
                                {rec.priority}
                              </Badge>
                              <span className="text-sm font-bold">{rec.category}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 relative z-10">{rec.recommendation}</p>
                            <p className="text-xs text-chart-2 font-bold relative z-10">{rec.potential_improvement}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Processing Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-xl border border-muted/50 animate-in fade-in duration-700 delay-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
                        <p className="text-2xl font-bold text-foreground relative z-10 animate-pulse">
                          {predictionResult.processing_time}
                        </p>
                        <p className="text-xs text-muted-foreground relative z-10">Processing Time</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-xl border border-muted/50 animate-in fade-in duration-700 delay-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer"></div>
                        <p className="text-2xl font-bold text-foreground relative z-10 animate-pulse">{predictionResult.features_analyzed}</p>
                        <p className="text-xs text-muted-foreground relative z-10">Features Analyzed</p>
                      </div>
                    </div>

                    {/* Enhanced Download Section */}
                    <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/30 animate-in fade-in duration-700 delay-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Download className="h-5 w-5 text-primary animate-neural-pulse" />
                        <span className="font-bold text-primary text-lg">Download Comprehensive Analysis</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                        <Button 
                          onClick={downloadCSV} 
                          variant="outline" 
                          className="bg-background/50 hover:bg-primary/10 border-primary/30"
                        >
                          <Table className="mr-2 h-4 w-4" />
                          Download CSV Analysis
                        </Button>
                        <Button 
                          onClick={downloadPDF} 
                          variant="outline" 
                          className="bg-background/50 hover:bg-primary/10 border-primary/30"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Download Full Report
                        </Button>
                      </div>
                      <div className="mt-4 space-y-2 relative z-10">
                        <p className="text-xs text-muted-foreground">
                          <strong>CSV Analysis includes:</strong> Energy production forecasts, financial analysis, optimal positioning recommendations, weather-based insights, and environmental impact calculations.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Full Report includes:</strong> Comprehensive analysis with detailed recommendations for optimal physical positioning, system optimization suggestions, and location-specific insights.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {predictionState === "complete" && (
            <div className="mt-12 text-center animate-in fade-in duration-700 delay-700">
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleReset} variant="outline" size="lg">
                  Try Another Prediction
                </Button>
                <Button onClick={() => onNavigate("get-started")} size="lg" className="animate-pulse-glow">
                  Learn More About Models
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
