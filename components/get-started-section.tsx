"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Database,
  Cpu,
  BarChart3,
  Play,
  ArrowRight,
  Zap,
  Target,
  Activity,
  TrendingUp,
  Layers,
  Sun,
  Cloud,
  Thermometer,
  Wind,
  MapPin,
  Lightbulb,
} from "lucide-react"
import { StarBackground } from "@/components/star-background"

interface GetStartedSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "solar-prediction" | "model-info" | "contact" | "team") => void
}

export function GetStartedSection({ onNavigate }: GetStartedSectionProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [animationStage, setAnimationStage] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [modelComparison, setModelComparison] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStage((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const models = [
    {
      id: "neural-network",
      name: "Deep Neural Network",
      type: "Deep Learning",
      accuracy: 94.2,
      speed: 45,
      complexity: 85,
      description:
        "Advanced deep learning model with multi-layer architecture for complex pattern recognition and classification tasks.",
      features: ["Multi-layer perceptron", "Backpropagation training", "Dropout regularization", "Batch normalization"],
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      useCases: ["Image recognition", "Natural language processing", "Time series forecasting"],
    },
    {
      id: "random-forest",
      name: "Random Forest",
      type: "Ensemble Method",
      accuracy: 91.8,
      speed: 28,
      complexity: 60,
      description:
        "Ensemble learning method that combines multiple decision trees for robust and interpretable predictions.",
      features: ["Bootstrap aggregating", "Feature randomness", "Overfitting resistance", "Feature importance"],
      icon: Database,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      useCases: ["Tabular data analysis", "Feature selection", "Risk assessment"],
    },
    {
      id: "svm",
      name: "Support Vector Machine",
      type: "Kernel Method",
      accuracy: 89.5,
      speed: 62,
      complexity: 70,
      description:
        "Powerful algorithm that finds optimal decision boundaries in high-dimensional spaces using kernel methods.",
      features: ["Kernel trick", "Margin maximization", "Non-linear separation", "Support vectors"],
      icon: Cpu,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      borderColor: "border-chart-2/20",
      useCases: ["Text classification", "Bioinformatics", "Computer vision"],
    },
    {
      id: "solar-optimized",
      name: "Random Forest Solar Model",
      type: "Solar Prediction",
      accuracy: 99.13,
      speed: 25,
      complexity: 90,
      description:
        "Best-performing Random Forest model with 99.13% accuracy. R² score: 0.999966, RMSE: 2.33, MAE: 0.84. NASA POWER API integration.",
      features: ["NASA API Integration", "Physical Analysis", "Temperature Effects", "Performance Optimization"],
      icon: Sun,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      useCases: ["Solar Farm Forecasting", "Residential Solar", "Grid Integration", "Energy Trading"],
    },
    {
      id: "solar-enhanced",
      name: "Gradient Boosting Solar Model",
      type: "Gradient Boosting Solar",
      accuracy: 61.70,
      speed: 30,
      complexity: 75,
      description:
        "Gradient Boosting model with R² score: 0.999951, RMSE: 2.80, MAE: 1.48. Advanced ensemble learning with excellent generalization.",
      features: ["Cyclical Encoding", "Rolling Averages", "Weather Analysis", "Seasonal Patterns"],
      icon: Cloud,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      useCases: ["Medium-term Forecasting", "Weather Analysis", "Performance Monitoring", "Climate Assessment"],
    },
    {
      id: "solar-basic",
      name: "Voting Ensemble Solar Model",
      type: "Voting Ensemble Solar",
      accuracy: 62.05,
      speed: 35,
      complexity: 50,
      description:
        "Voting Ensemble model with R² score: 0.999963, RMSE: 2.44, MAE: 1.04. Combines multiple algorithms for robust predictions.",
      features: ["Solar Radiation", "Temperature Modeling", "Time Features", "Fast Inference"],
      icon: Thermometer,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      useCases: ["Quick Estimates", "Basic Planning", "Educational Demo", "Prototype Development"],
    },
  ]

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
    setTimeout(() => setIsVideoPlaying(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden animate-page-fade-in bg-3d-element">
      <StarBackground />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-3d" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float-3d"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl animate-float-3d"
          style={{ animationDelay: "2s" }}
        />
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-drift-3d"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-border/50 bg-background/80 backdrop-blur-md animate-slide-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Badge variant="secondary" className="animate-pulse-glow">
            AI Models Overview
          </Badge>
          <Button onClick={() => onNavigate("prediction")} className="animate-pulse-glow">
            Try Prediction
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance animate-slide-up">
            Meet Our AI Models
          </h1>
          <p
            className="mt-6 text-lg leading-8 text-muted-foreground text-pretty animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Discover the cutting-edge machine learning algorithms powering our prediction system. Each model is trained
            on extensive datasets and optimized for accuracy.
          </p>

          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { label: "Models Trained", value: "6", icon: Brain },
              { label: "Solar Accuracy", value: "95%", icon: Sun },
              { label: "Predictions Made", value: "10K+", icon: TrendingUp },
            ].map((stat, index) => (
              <Card
                key={stat.label}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <stat.icon
                        className="h-6 w-6 text-primary animate-neural-pulse"
                        style={{ animationDelay: `${index * 0.3}s` }}
                      />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="relative z-10 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card
            className="overflow-hidden group hover:shadow-xl transition-all duration-500 animate-scale-in"
            style={{ animationDelay: "0.8s" }}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                How Our AI Works
              </CardTitle>
              <CardDescription>Watch this demonstration of our machine learning pipeline in action</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center cursor-pointer group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500"
                onClick={handleVideoPlay}
              >
                {!isVideoPlaying ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                    <p className="text-muted-foreground font-medium">Interactive AI Demo Video</p>
                    <p className="text-sm text-muted-foreground mt-1">Click to see our models in action</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center space-x-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-500 ${
                              animationStage >= i ? "bg-primary animate-pulse" : "bg-muted"
                            }`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-primary">AI Pipeline Processing...</div>
                        <div className="text-sm text-muted-foreground">
                          {animationStage === 0 && "Data Preprocessing"}
                          {animationStage === 1 && "Feature Extraction"}
                          {animationStage === 2 && "Model Training"}
                          {animationStage === 3 && "Prediction Generation"}
                        </div>
                        <Progress value={(animationStage + 1) * 25} className="w-64 mx-auto" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Model Comparison Toggle */}
      <section className="relative z-10 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <Button
            variant="outline"
            onClick={() => setModelComparison(!modelComparison)}
            className="animate-pulse-glow animate-scale-in"
            style={{ animationDelay: "1s" }}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {modelComparison ? "Hide" : "Show"} Model Comparison
          </Button>
        </div>
      </section>

      {/* Model Comparison Chart */}
      {modelComparison && (
        <section className="relative z-10 px-6 py-8 lg:px-8 animate-slide-up">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Performance Comparison</CardTitle>
                <CardDescription className="text-center">
                  Compare accuracy, speed, and complexity across all models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["accuracy", "speed", "complexity"].map((metric) => (
                    <div key={metric} className="space-y-3">
                      <h4 className="font-semibold capitalize">{metric}</h4>
                      <div className="space-y-2">
                        {models.map((model) => (
                          <div key={model.id} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium">{model.name}</div>
                            <div className="flex-1">
                              <Progress value={model[metric as keyof typeof model] as number} className="h-2" />
                            </div>
                            <div className="w-12 text-sm text-muted-foreground">
                              {metric === "accuracy"
                                ? `${model[metric]}%`
                                : metric === "speed"
                                  ? `${model[metric]}ms`
                                  : `${model[metric]}%`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Models Grid */}
      <section className="relative z-10 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: "1.2s" }}>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Our Model Arsenal
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Click on any model to learn more about its architecture and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model, index) => {
              const Icon = model.icon
              const isSelected = selectedModel === model.id

              return (
                <Card
                  key={model.id}
                  className={`cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-scale-in ${
                    isSelected ? "ring-2 ring-primary shadow-xl scale-105" : ""
                  } ${model.borderColor}`}
                  style={{ animationDelay: `${1.4 + index * 0.2}s` }}
                  onClick={() => setSelectedModel(isSelected ? null : model.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 ${model.bgColor} rounded-xl transition-all duration-300 ${isSelected ? "scale-110" : ""}`}
                        >
                          <Icon
                            className={`h-6 w-6 ${model.color} animate-neural-pulse`}
                            style={{ animationDelay: `${index * 0.3}s` }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {model.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 leading-relaxed">{model.description}</CardDescription>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-sm font-semibold">{model.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-sm font-semibold">{model.speed}ms</div>
                        <div className="text-xs text-muted-foreground">Speed</div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-sm font-semibold">{model.complexity}%</div>
                        <div className="text-xs text-muted-foreground">Complexity</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Key Features:
                          </h4>
                          <ul className="space-y-1">
                            {model.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in duration-300"
                                style={{ animationDelay: `${featureIndex * 100}ms` }}
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Use Cases:
                          </h4>
                          <ul className="space-y-1">
                            {model.useCases.map((useCase, useCaseIndex) => (
                              <li
                                key={useCaseIndex}
                                className="text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in duration-300"
                                style={{ animationDelay: `${useCaseIndex * 100 + 300}ms` }}
                              >
                                <Zap className="h-3 w-3 text-primary" />
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          className="w-full mt-4 animate-pulse-glow"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigate(model.id.startsWith("solar") ? "solar-prediction" : "prediction")
                          }}
                        >
                          {model.id.startsWith("solar") ? "Try Solar Prediction" : "Use This Model"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance animate-slide-up"
            style={{ animationDelay: "2s" }}
          >
            Ready to Make Predictions?
          </h2>
          <p
            className="mt-4 text-lg text-muted-foreground text-pretty animate-slide-up"
            style={{ animationDelay: "2.2s" }}
          >
            Now that you understand our models, let's put them to work on real data.
          </p>
          <div
            className="flex items-center justify-center gap-4 mt-8 animate-slide-up"
            style={{ animationDelay: "2.4s" }}
          >
            <Button size="lg" className="animate-pulse-glow" onClick={() => onNavigate("solar-prediction")}>
              <Sun className="mr-2 h-5 w-5" />
              Start Solar Prediction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate("prediction")}>
              <Play className="mr-2 h-5 w-5" />
              General Prediction
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate("model-info")}>
              <Brain className="mr-2 h-5 w-5" />
              Deep Dive into Models
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate("team")}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
