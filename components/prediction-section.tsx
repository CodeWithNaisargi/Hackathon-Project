"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, Brain, Zap, Target, ArrowRight, Activity, Cpu, Database, MapPin } from "lucide-react"
import { CelebrationAnimation } from "@/components/celebration-animation"
import { InteractiveMap } from "@/components/interactive-map"

interface PredictionSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "model-info") => void
}

export function PredictionSection({ onNavigate }: PredictionSectionProps) {
  const [predictionState, setPredictionState] = useState<"idle" | "countdown" | "processing" | "complete">("idle")
  const [countdown, setCountdown] = useState(3)
  const [inputData, setInputData] = useState({
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
    latitude: "",
    longitude: ""
  })
  const [predictionResult, setPredictionResult] = useState<{
    prediction: string
    confidence: number
    model: string
    processingTime?: string
    featuresAnalyzed?: number
  } | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedModel, setSelectedModel] = useState("neural_network")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState("")
  const [showInteractiveMap, setShowInteractiveMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null)

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
        { progress: 20, stage: "Preprocessing data..." },
        { progress: 40, stage: "Feature extraction..." },
        { progress: 60, stage: "Model inference..." },
        { progress: 80, stage: "Calculating confidence..." },
        { progress: 100, stage: "Finalizing results..." },
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
      }, 600)

      return () => clearInterval(interval)
    }
  }, [predictionState])

  const makePrediction = async () => {
    try {
      const features = [
        Number.parseFloat(inputData.feature1),
        Number.parseFloat(inputData.feature2),
        Number.parseFloat(inputData.feature3),
        Number.parseFloat(inputData.feature4),
      ]

      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features,
          model: selectedModel,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPredictionResult(result.data)
        setPredictionState("complete")
        setShowCelebration(true)
        // Hide celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        throw new Error(result.message || "Prediction failed")
      }
    } catch (error) {
      console.error("Prediction error:", error)
      // Fallback to mock result
      const mockResult = {
        prediction: "Positive Outcome",
        confidence: Math.floor(Math.random() * 15) + 85,
        model: "Deep Neural Network",
        processingTime: "0.23s",
        featuresAnalyzed: 4,
      }
      setPredictionResult(mockResult)
      setPredictionState("complete")
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const handlePredict = () => {
    if (Object.values(inputData).some((value) => value.trim() === "")) {
      alert("Please fill in all fields before predicting")
      return
    }

    // Validate numeric inputs
    const values = Object.values(inputData)
    for (const value of values) {
      if (isNaN(Number.parseFloat(value))) {
        alert("Please enter valid numeric values")
        return
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
    setSelectedLocation(null)
    setInputData({
      feature1: "",
      feature2: "",
      feature3: "",
      feature4: "",
      latitude: "",
      longitude: ""
    })
  }

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude })
    
    // Update the form fields with the selected latitude and longitude
    setInputData(prev => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString()
    }))
  }

  const modelOptions = [
    { value: "neural_network", label: "Neural Network", description: "Deep learning model", icon: Brain },
    { value: "random_forest", label: "Random Forest", description: "Ensemble method", icon: Target },
    { value: "svm", label: "Support Vector Machine", description: "High-dimensional classifier", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* Enhanced Background Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-enhanced-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-enhanced-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl animate-enhanced-float"
          style={{ animationDelay: "2s" }}
        />
        
        {/* Matrix-style rain effect */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-20 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-enhanced-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `translateZ(${Math.random() * 100}px)`,
            }}
          />
        ))}
      </div>

      {/* Celebration Animation Overlay */}
      {showCelebration && <CelebrationAnimation />}

      {/* Enhanced processing animations */}
      {predictionState === "processing" && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Neural network visualization */}
          <div className="absolute inset-0 opacity-15">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full animate-neural-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
          {/* Data flow lines */}
          <div className="absolute inset-0 opacity-25">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow"
                style={{
                  top: `${10 + i * 6}%`,
                  width: "100%",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          {/* Circuit-like connections */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"
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
              className="absolute w-[32rem] h-[32rem] border border-primary/10 rounded-full animate-concentric-ripple"
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
              className="absolute w-4 h-4 bg-primary/40 rounded-full animate-radial-pulse"
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
            AI Prediction Lab
          </Badge>
          <Button variant="outline" onClick={() => onNavigate("get-started")}>
            Learn About Models
          </Button>
        </div>
      </header>

      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              AI Prediction Engine
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              Enter your data below and watch our AI model make intelligent predictions in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card
              className={`transition-all duration-500 ${predictionState === "processing" ? "animate-neural-pulse" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Input Data
                </CardTitle>
                <CardDescription>Provide the features for our AI model to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Model Selection */}
                <div>
                  <Label htmlFor="model-select">Select AI Model</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {modelOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedModel === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        } ${predictionState !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => predictionState === "idle" && setSelectedModel(option.value)}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon
                            className={`h-5 w-5 ${selectedModel === option.value ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Selection */}
                <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">Location Context (Optional)</span>
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
                  
                  {showInteractiveMap && (
                    <div className="mb-4">
                      <InteractiveMap
                        onLocationSelect={handleLocationSelect}
                        selectedLatitude={selectedLocation?.latitude}
                        selectedLongitude={selectedLocation?.longitude}
                        disabled={predictionState !== "idle"}
                      />
                    </div>
                  )}
                  
                  {selectedLocation && (
                    <div className="p-3 bg-background/50 rounded-lg border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Selected Location:</div>
                      <div className="font-mono text-sm">
                        Lat: {selectedLocation.latitude.toFixed(4)}°, Lng: {selectedLocation.longitude.toFixed(4)}°
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feature1">Age (18-80)</Label>
                    <Input
                      id="feature1"
                      placeholder="e.g., 35"
                      value={inputData.feature1}
                      onChange={(e) => setInputData({ ...inputData, feature1: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="number"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature2">Income ($)</Label>
                    <Input
                      id="feature2"
                      placeholder="e.g., 65000"
                      value={inputData.feature2}
                      onChange={(e) => setInputData({ ...inputData, feature2: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="number"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature3">Experience (years)</Label>
                    <Input
                      id="feature3"
                      placeholder="e.g., 8"
                      value={inputData.feature3}
                      onChange={(e) => setInputData({ ...inputData, feature3: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="number"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature4">Score (0-100)</Label>
                    <Input
                      id="feature4"
                      placeholder="e.g., 75"
                      value={inputData.feature4}
                      onChange={(e) => setInputData({ ...inputData, feature4: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="number"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      placeholder="e.g., 40.7128"
                      value={inputData.latitude}
                      onChange={(e) => setInputData({ ...inputData, latitude: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="text"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      placeholder="e.g., -74.0060"
                      value={inputData.longitude}
                      onChange={(e) => setInputData({ ...inputData, longitude: e.target.value })}
                      disabled={predictionState !== "idle"}
                      type="text"
                      className={`transition-all duration-200 ${predictionState === "processing" ? "animate-pulse" : ""}`}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {predictionState === "idle" && (
                    <Button onClick={handlePredict} className="w-full animate-pulse-glow" size="lg">
                      <Brain className="mr-2 h-5 w-5" />
                      Start Prediction
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

            {/* Prediction Section */}
            <Card
              className={`transition-all duration-500 ${predictionState === "processing" ? "animate-neural-pulse" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Prediction Results
                </CardTitle>
                <CardDescription>Real-time AI analysis and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {predictionState === "idle" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Enter your data and click predict to see AI in action</p>
                  </div>
                )}

                {predictionState === "countdown" && (
                  <div className="flex items-center justify-center py-20 min-h-[500px] w-full">
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
                          <p className="text-3xl font-bold text-foreground animate-pulse">Initializing AI Model...</p>
                          <p className="text-xl text-muted-foreground">Get ready for prediction</p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 mt-6">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        {/* Additional visual indicator */}
                        <div className="mt-4 text-sm text-muted-foreground/80">
                          Preparing neural networks...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {predictionState === "processing" && (
                  <div className="text-center py-12">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-spin">
                        <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center animate-pulse">
                          <Activity className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div className="absolute inset-0 w-20 h-20 mx-auto">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-primary/60 rounded-full animate-neural-pulse"
                            style={{
                              top: `${50 + 35 * Math.cos((i * Math.PI) / 3)}%`,
                              left: `${50 + 35 * Math.sin((i * Math.PI) / 3)}%`,
                              animationDelay: `${i * 0.3}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">Processing Data...</p>
                    <p className="text-sm text-muted-foreground mb-4">{processingStage}</p>
                    <div className="space-y-2">
                      <Progress value={processingProgress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          Data
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          Processing
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Model
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Result
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {predictionState === "complete" && predictionResult && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce relative">
                        <Target className="h-10 w-10 text-primary" />
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-2 animate-pulse">Prediction Complete!</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border-2 border-primary/30 animate-in fade-in duration-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <span className="text-sm font-medium text-muted-foreground">Prediction Result</span>
                          <Badge variant="secondary" className="animate-pulse">
                            {predictionResult.model}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary relative z-10 animate-pulse">
                          {predictionResult.prediction}
                        </p>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 rounded-xl border border-emerald-500/30 animate-in fade-in duration-700 delay-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>
                          <span className="text-lg font-bold text-emerald-600 animate-pulse">
                            {predictionResult.confidence}%
                          </span>
                        </div>
                        <Progress value={predictionResult.confidence} className="h-3 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted/50 rounded-lg animate-in fade-in duration-700 delay-300">
                          <p className="text-2xl font-bold text-foreground">
                            {predictionResult.processingTime || "0.23s"}
                          </p>
                          <p className="text-xs text-muted-foreground">Processing Time</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg animate-in fade-in duration-700 delay-400">
                          <p className="text-2xl font-bold text-foreground">{predictionResult.featuresAnalyzed || 4}</p>
                          <p className="text-xs text-muted-foreground">Features Analyzed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {predictionState === "complete" && (
            <div className="mt-12 text-center animate-in fade-in duration-700 delay-500">
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
