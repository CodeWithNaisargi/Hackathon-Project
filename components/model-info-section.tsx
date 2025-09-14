"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Target,
  Zap,
  Code,
  BarChart3,
  Settings,
  Database,
  Activity,
  TrendingUp,
  GitBranch,
  Layers,
  Sun,
  Cloud,
  Thermometer,
  Wind,
  MapPin,
  Lightbulb,
} from "lucide-react"

interface ModelInfoSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "solar-prediction" | "model-info") => void
}

export function ModelInfoSection({ onNavigate }: ModelInfoSectionProps) {
  const [selectedModel, setSelectedModel] = useState<"neural" | "forest" | "svm" | "solar-optimized" | "solar-enhanced" | "solar-basic" | "solar-xgboost" | "solar-lightgbm">("solar-optimized")

  const modelData = {
    neural: {
      name: "Neural Network",
      type: "Deep Learning",
      icon: Brain,
      color: "primary",
      accuracy: 96.8,
      speed: 45,
      confidence: 94.2,
      description:
        "A sophisticated multi-layer perceptron with advanced backpropagation algorithm. Features three hidden layers with ReLU activation functions and dropout regularization for optimal performance.",
      architecture: {
        inputLayer: 10,
        hiddenLayers: [64, 32, 16],
        outputLayer: 1,
        activation: "ReLU",
        optimizer: "Adam",
        learningRate: 0.001,
      },
      features: [
        "Automatic feature scaling and normalization",
        "Dropout regularization (0.2) to prevent overfitting",
        "Early stopping with patience of 10 epochs",
        "Batch normalization for stable training",
        "L2 regularization (alpha=0.0001)",
      ],
      useCases: [
        "Complex pattern recognition in high-dimensional data",
        "Non-linear relationship modeling",
        "Image and signal processing applications",
        "Time series forecasting with temporal dependencies",
      ],
    },
    forest: {
      name: "Random Forest",
      type: "Ensemble Method",
      icon: Target,
      color: "accent",
      accuracy: 94.5,
      speed: 28,
      confidence: 92.8,
      description:
        "An ensemble of 100 decision trees using bootstrap aggregation and random feature selection. Provides robust predictions with built-in feature importance analysis and excellent generalization.",
      architecture: {
        nEstimators: 100,
        maxDepth: 10,
        minSamplesSplit: 2,
        minSamplesLeaf: 1,
        criterion: "gini",
        bootstrap: true,
      },
      features: [
        "Bootstrap aggregating (bagging) for variance reduction",
        "Random feature selection at each split",
        "Out-of-bag (OOB) error estimation",
        "Feature importance ranking",
        "Handles missing values automatically",
      ],
      useCases: [
        "Tabular data classification and regression",
        "Feature selection and importance analysis",
        "Robust predictions with uncertainty quantification",
        "Large-scale data processing with parallel training",
      ],
    },
    svm: {
      name: "Support Vector Machine",
      type: "Kernel Method",
      icon: Zap,
      color: "chart-2",
      accuracy: 93.2,
      speed: 62,
      confidence: 91.5,
      description:
        "A powerful kernel-based classifier using Radial Basis Function (RBF) kernel. Optimized for high-dimensional data with complex decision boundaries and excellent margin maximization.",
      architecture: {
        kernel: "RBF",
        C: 1.0,
        gamma: "auto",
        degree: 3,
        coef0: 0.0,
        shrinking: true,
      },
      features: [
        "RBF kernel for non-linear decision boundaries",
        "Automatic gamma scaling based on feature variance",
        "Support vector identification for model interpretability",
        "Probability calibration using Platt scaling",
        "Memory-efficient sparse representation",
      ],
      useCases: [
        "High-dimensional data classification",
        "Text classification and sentiment analysis",
        "Bioinformatics and genomic data analysis",
        "Computer vision and image recognition tasks",
      ],
    },
    "solar-optimized": {
      name: "Random Forest Solar Model",
      type: "Ensemble Solar Prediction",
      icon: Sun,
      color: "yellow",
      accuracy: 99.13,
      speed: 25,
      confidence: 99.13,
      description:
        "Our best-performing Random Forest model with 99.13% accuracy. Achieves exceptional R² score of 0.999966 with minimal RMSE (2.33) and MAE (0.84). Optimized for solar power prediction with NASA POWER API integration.",
      architecture: {
        algorithm: "Random Forest Regressor",
        r2Score: 0.999966,
        rmse: 2.326190,
        mae: 0.841490,
        features: 35,
        nasaIntegration: "Real-time weather data",
        physicalAnalysis: "Temperature effects, efficiency metrics",
        optimization: "Hyperparameter tuned",
        dataSource: "NASA POWER API + Historical data",
      },
      features: [
        "Real-time NASA POWER API integration",
        "Physical analysis of solar panel performance",
        "Temperature coefficient effects (-0.4% per °C)",
        "Irradiance efficiency optimization",
        "Atmospheric conditions analysis",
        "Performance optimization recommendations",
        "Global weather data coverage",
        "Advanced feature engineering",
      ],
      useCases: [
        "Solar farm power generation forecasting",
        "Residential solar panel optimization",
        "Grid integration planning",
        "Energy storage optimization",
        "Weather-dependent energy trading",
        "Solar panel maintenance scheduling",
      ],
    },
    "solar-enhanced": {
      name: "Gradient Boosting Solar Model",
      type: "Gradient Boosting Solar",
      icon: Cloud,
      color: "blue",
      accuracy: 61.70,
      speed: 30,
      confidence: 61.70,
      description:
        "High-performance Gradient Boosting model with R² score of 0.999951. Achieves RMSE of 2.80 and MAE of 1.48. Features advanced ensemble learning with excellent generalization capabilities.",
      architecture: {
        algorithm: "Gradient Boosting Regressor",
        r2Score: 0.999951,
        rmse: 2.796509,
        mae: 1.483441,
        features: 28,
        timeFeatures: "Cyclical encoding",
        rollingFeatures: "3-day moving averages",
        lagFeatures: "Previous day values",
        weatherFeatures: "Humidity, wind speed, pressure",
      },
      features: [
        "Cyclical time feature encoding",
        "Rolling average calculations",
        "Lag feature engineering",
        "Weather condition indicators",
        "Seasonal pattern recognition",
        "Temperature interaction effects",
        "Irradiance transformation features",
        "Efficiency ratio calculations",
      ],
      useCases: [
        "Medium-term solar forecasting",
        "Seasonal energy planning",
        "Weather pattern analysis",
        "Solar panel performance monitoring",
        "Energy production optimization",
        "Climate impact assessment",
      ],
    },
    "solar-basic": {
      name: "Voting Ensemble Solar Model",
      type: "Voting Ensemble Solar",
      icon: Thermometer,
      color: "green",
      accuracy: 62.05,
      speed: 35,
      confidence: 62.05,
      description:
        "Voting Ensemble model combining multiple algorithms with R² score of 0.999963. Achieves RMSE of 2.44 and MAE of 1.04. Provides robust predictions through ensemble voting.",
      architecture: {
        algorithm: "Voting Ensemble",
        r2Score: 0.999963,
        rmse: 2.438418,
        mae: 1.036700,
        features: 12,
        trees: 100,
        maxDepth: 15,
        minSamplesSplit: 5,
        minSamplesLeaf: 2,
        bootstrap: true,
      },
      features: [
        "Solar radiation prediction",
        "Temperature-based modeling",
        "Time-based features (hour, day, month)",
        "Basic weather integration",
        "Simple feature interactions",
        "Robust outlier handling",
        "Feature importance analysis",
        "Fast inference speed",
      ],
      useCases: [
        "Quick solar power estimates",
        "Basic energy planning",
        "Educational demonstrations",
        "Prototype development",
        "Baseline model comparison",
        "Resource-constrained environments",
      ],
    },
    "solar-xgboost": {
      name: "XGBoost Solar Model",
      type: "XGBoost Solar Prediction",
      icon: Wind,
      color: "purple",
      accuracy: 61.35,
      speed: 28,
      confidence: 61.35,
      description:
        "XGBoost model with R² score of 0.999848. Achieves RMSE of 4.92 and MAE of 1.81. Features gradient boosting with advanced regularization and parallel processing capabilities.",
      architecture: {
        algorithm: "XGBoost Regressor",
        r2Score: 0.999848,
        rmse: 4.923431,
        mae: 1.807164,
        features: 25,
        maxDepth: 6,
        learningRate: 0.1,
        nEstimators: 100,
        subsample: 0.8,
        colsampleBytree: 0.8,
      },
      features: [
        "Gradient boosting optimization",
        "Advanced regularization techniques",
        "Parallel processing capabilities",
        "Built-in cross-validation",
        "Feature importance analysis",
        "Early stopping prevention",
        "Handles missing values",
        "GPU acceleration support",
      ],
      useCases: [
        "High-performance solar forecasting",
        "Large-scale data processing",
        "Real-time prediction systems",
        "Competition-level accuracy",
        "Production deployment",
        "Feature importance analysis",
      ],
    },
    "solar-lightgbm": {
      name: "LightGBM Solar Model",
      type: "LightGBM Solar Prediction",
      icon: MapPin,
      color: "orange",
      accuracy: 60.76,
      speed: 22,
      confidence: 60.76,
      description:
        "LightGBM model with R² score of 0.999878. Achieves RMSE of 4.40 and MAE of 1.93. Features fast training with leaf-wise tree growth and memory efficiency.",
      architecture: {
        algorithm: "LightGBM Regressor",
        r2Score: 0.999878,
        rmse: 4.402819,
        mae: 1.934687,
        features: 25,
        maxDepth: 6,
        learningRate: 0.1,
        nEstimators: 100,
        numLeaves: 31,
        featureFraction: 0.8,
        baggingFraction: 0.8,
      },
      features: [
        "Leaf-wise tree growth",
        "Memory efficient training",
        "Fast prediction speed",
        "Categorical feature support",
        "Built-in feature selection",
        "GPU acceleration",
        "Handles large datasets",
        "Low memory usage",
      ],
      useCases: [
        "Fast solar predictions",
        "Memory-constrained environments",
        "Real-time applications",
        "Large dataset processing",
        "Categorical feature handling",
        "Production systems",
      ],
    },
  }

  const currentModel = modelData[selectedModel]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden bg-3d-element">
      {/* 3D Background Elements */}
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
        
        {/* 3D Floating Elements */}
        {Array.from({ length: 20 }).map((_, i) => (
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("home")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold">Model Information Center</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Model Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-balance">Explore Our AI Model Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Object.entries(modelData).map(([key, model]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedModel === key ? "ring-2 ring-primary shadow-lg scale-105" : "hover:scale-102"
                }`}
                onClick={() => setSelectedModel(key as "neural" | "forest" | "svm" | "solar-optimized" | "solar-enhanced" | "solar-basic" | "solar-xgboost" | "solar-lightgbm")}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 bg-${model.color}/10 rounded-xl`}>
                      <model.icon className={`h-8 w-8 text-${model.color} animate-neural-pulse`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <Badge variant="secondary">{model.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Model Information */}
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-${currentModel.color}/10 rounded-xl`}>
                  <currentModel.icon className={`h-10 w-10 text-${currentModel.color} animate-neural-pulse`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentModel.name}</CardTitle>
                  <CardDescription className="text-lg mt-2">{currentModel.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentModel.accuracy}%</div>
                    <Progress value={currentModel.accuracy} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">Tested on 10,000 validation samples</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentModel.speed}ms</div>
                    <Progress value={100 - currentModel.speed} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">Average inference time per prediction</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentModel.confidence}%</div>
                    <Progress value={currentModel.confidence} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">Average prediction confidence score</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelData).map(([key, model]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-sm text-muted-foreground">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Model Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(currentModel.architecture).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <Badge variant="outline">{Array.isArray(value) ? value.join(", ") : String(value)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Training Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Training Parameters</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Batch Size: 32</li>
                        <li>• Epochs: 100 (with early stopping)</li>
                        <li>• Validation Split: 20%</li>
                        <li>• Cross-Validation: 5-fold</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Data Preprocessing</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Feature Scaling: StandardScaler</li>
                        <li>• Missing Values: Median imputation</li>
                        <li>• Categorical Encoding: One-hot</li>
                        <li>• Outlier Detection: IQR method</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Key Features & Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentModel.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="p-1 bg-primary/10 rounded-full mt-1">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="use-cases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Real-World Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentModel.useCases.map((useCase, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Database className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Use Case {index + 1}</h4>
                            <p className="text-sm text-muted-foreground">{useCase}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Implementation Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">
                      {selectedModel === "neural" &&
                        `# Neural Network Implementation
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

# Initialize model
model = MLPClassifier(
    hidden_layer_sizes=(64, 32, 16),
    activation='relu',
    solver='adam',
    learning_rate_init=0.001,
    max_iter=100
)

# Train model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)
model.fit(X_scaled, y_train)`}
                      {selectedModel === "forest" &&
                        `# Random Forest Implementation
from sklearn.ensemble import RandomForestClassifier

# Initialize model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=2,
    min_samples_leaf=1,
    bootstrap=True,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

# Get feature importance
importance = model.feature_importances_`}
                      {selectedModel === "svm" &&
                        `# Support Vector Machine Implementation
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

# Initialize model
model = SVC(
    kernel='rbf',
    C=1.0,
    gamma='auto',
    probability=True,
    random_state=42
)

# Train model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)
model.fit(X_scaled, y_train)`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => onNavigate("solar-prediction")} className="animate-pulse-glow">
              <Sun className="mr-2 h-5 w-5" />
              Try Solar Prediction Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
