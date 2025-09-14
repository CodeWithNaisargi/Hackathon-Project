"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  Play,
  Database,
  Cpu,
  BarChart3,
  Sparkles,
  Info,
  BookOpen,
  Users,
  Sun,
} from "lucide-react"
import { GetStartedSection } from "@/components/get-started-section"
import { PredictionSection } from "@/components/prediction-section"
import { SolarPredictionSection } from "@/components/solar-prediction-section"
import { TeamSection } from "@/components/team-section"
import { ModelInfoSection } from "@/components/model-info-section"
import { ContactSection } from "@/components/contact-section"
import { StarBackground } from "@/components/star-background"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<
    "home" | "get-started" | "prediction" | "solar-prediction" | "model-info" | "contact" | "team"
  >("home")

  if (currentSection === "get-started") {
    return <GetStartedSection onNavigate={setCurrentSection} />
  }

  if (currentSection === "prediction") {
    return <PredictionSection onNavigate={setCurrentSection} />
  }

  if (currentSection === "solar-prediction") {
    return <SolarPredictionSection onNavigate={setCurrentSection} />
  }

  if (currentSection === "model-info") {
    return <ModelInfoSection onNavigate={setCurrentSection} />
  }

  if (currentSection === "contact") {
    return <ContactSection onNavigate={setCurrentSection} />
  }

  if (currentSection === "team") {
    return <TeamSection onNavigate={setCurrentSection} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative animate-page-fade-in bg-3d-element">
      <StarBackground />
      
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-3d" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float-3d"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl animate-float-3d"
          style={{ animationDelay: "2s" }}
        />
        
        {/* 3D Floating Particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-drift-3d"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-slide-up">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg animate-scale-in">
              <Brain className="h-6 w-6 text-primary animate-neural-pulse" />
            </div>
            <span className="text-xl font-bold">AI Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSection("model-info")}
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Info className="mr-2 h-4 w-4" />
              Model Info
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSection("get-started")}
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSection("team")}
              className="animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
            <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-32 sm:py-40 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 25 }).map((_, i) => (
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
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium animate-pulse-glow animate-slide-up">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Hackathon 2025 - Next Generation ML
          </Badge>

          <h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Predict the Future with
            <span className="text-primary block mt-2 animate-neural-pulse">Advanced AI Models</span>
          </h1>

          <p
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            Experience cutting-edge machine learning models powered by neural networks, ensemble methods, and deep
            learning. Our platform combines multiple AI algorithms to deliver unprecedented prediction accuracy.
          </p>

          <div
            className="mt-10 flex items-center justify-center gap-x-6 flex-wrap animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button size="lg" className="animate-pulse-glow" onClick={() => setCurrentSection("solar-prediction")}>
              <Sun className="mr-2 h-5 w-5" />
              Solar Power Prediction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSection("get-started")}>
              <BookOpen className="mr-2 h-5 w-5" />
              Learn About Models
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSection("team")}>
              <Users className="mr-2 h-5 w-5" />
              Meet Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Model Showcase Section */}
      <section className="py-24 px-6 lg:px-8 animate-slide-up" style={{ animationDelay: "0.8s" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Advanced AI Model Arsenal
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Three powerful machine learning models working in harmony to deliver exceptional predictions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Neural Network",
                badge: "Deep Learning",
                description:
                  "Multi-layer perceptron with advanced backpropagation. Capable of learning complex non-linear patterns with 95%+ accuracy on structured data.",
                tech: "3 Hidden Layers • ReLU Activation",
                techIcon: Cpu,
                borderColor: "border-primary/20 hover:border-primary/40",
                delay: "0s",
              },
              {
                icon: Target,
                title: "Random Forest",
                badge: "Ensemble Method",
                description:
                  "Ensemble of 100 decision trees with bootstrap aggregation. Provides robust predictions with built-in feature importance analysis.",
                tech: "100 Trees • Gini Impurity",
                techIcon: Database,
                borderColor: "border-accent/20 hover:border-accent/40",
                delay: "0.2s",
              },
              {
                icon: Zap,
                title: "Support Vector Machine",
                badge: "Kernel Method",
                description:
                  "RBF kernel SVM optimized for high-dimensional data. Excellent for classification tasks with complex decision boundaries.",
                tech: "RBF Kernel • C=1.0 • γ=auto",
                techIcon: BarChart3,
                borderColor: "border-chart-2/20 hover:border-chart-2/40",
                delay: "0.4s",
              },
            ].map((model, index) => (
              <Card
                key={model.title}
                className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${model.borderColor} animate-scale-in`}
                style={{ animationDelay: model.delay }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <model.icon
                        className="h-8 w-8 text-primary animate-neural-pulse"
                        style={{ animationDelay: `${index * 0.3}s` }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{model.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {model.badge}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{model.description}</CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <model.techIcon className="h-4 w-4" />
                    <span>{model.tech}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section className="py-24 px-6 lg:px-8 bg-muted/30 animate-slide-up" style={{ animationDelay: "1s" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Performance Metrics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Real-world performance statistics from our production models
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Prediction Accuracy", value: "96.8%", icon: Target },
              { label: "Processing Speed", value: "<50ms", icon: Zap },
              { label: "Model Confidence", value: "94.2%", icon: Brain },
              { label: "Data Points Trained", value: "1M+", icon: Database },
            ].map((metric, index) => (
              <Card key={metric.label} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <metric.icon
                        className="h-8 w-8 text-primary animate-neural-pulse"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 relative z-10 animate-slide-up" style={{ animationDelay: "1.2s" }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Ready to Experience AI in Action?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Start with our interactive demo, explore model details, or meet the team behind the innovation.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6 flex-wrap">
            <Button size="lg" className="animate-pulse-glow" onClick={() => setCurrentSection("solar-prediction")}>
              <Sun className="mr-2 h-5 w-5" />
              Start Solar Prediction
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSection("model-info")}>
              <Info className="mr-2 h-5 w-5" />
              Explore Model Details
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSection("team")}>
              <Users className="mr-2 h-5 w-5" />
              Meet Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
