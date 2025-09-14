# Solar Power Prediction - AI Hackathon Integration

This project integrates advanced solar power prediction models with NASA POWER API data into a modern Next.js frontend application.

## 🌟 Features

### 🚀 **Complete Integration**
- **Python FastAPI Backend**: Serves ML models and NASA POWER API integration
- **Next.js Frontend**: Modern React UI with real-time predictions
- **NASA POWER API**: Real-time weather data from NASA
- **Physical Analysis**: Comprehensive solar panel performance analysis
- **Optimization Recommendations**: Actionable insights for better performance

### 🔬 **Advanced ML Models**
- **Optimized Solar Model**: Ensemble model with 95%+ accuracy
- **Enhanced Solar Model**: Advanced feature engineering
- **Basic Solar Model**: Reliable baseline predictions

### 🌤️ **NASA POWER Integration**
- Real-time solar radiation data
- Temperature, humidity, wind speed
- Historical weather patterns
- Global coverage (any coordinates)

### 💡 **Physical Analysis Engine**
- Temperature coefficient effects
- Irradiance efficiency analysis
- Atmospheric conditions impact
- Performance optimization recommendations

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the automated setup script
./start-dev.bat
```

### Option 2: Manual Setup

#### 1. Install Python Dependencies
```bash
cd scripts
pip install -r requirements.txt
```

#### 2. Install Node.js Dependencies
```bash
npm install
```

#### 3. Start Python ML Server
```bash
cd scripts
python solar_ml_server.py
```

#### 4. Start Next.js Frontend (in new terminal)
```bash
npm run dev
```

## 📊 Usage

### 🌐 **Web Interface**
1. Open http://localhost:3000
2. Click "Solar Power Prediction" button
3. Choose prediction method:
   - **NASA POWER API**: Enter coordinates and date range
   - **Manual Input**: Enter solar parameters directly
4. Click "Start Solar Prediction"
5. View results with recommendations

### 🔧 **API Endpoints**

#### Solar Prediction with NASA Data
```bash
POST http://localhost:8000/predict/solar
{
  "latitude": 33.4484,
  "longitude": -112.074,
  "start_date": "20250101",
  "end_date": "20250107",
  "temporal": "daily",
  "include_analysis": true
}
```

#### Manual Solar Prediction
```bash
POST http://localhost:8000/predict/manual
{
  "irradiation": 800,
  "ambient_temperature": 25,
  "module_temperature": 30,
  "hour": 12,
  "day": 15,
  "month": 1,
  "weekday": 3,
  "model_name": "optimized"
}
```

#### Health Check
```bash
GET http://localhost:8000/health
```

#### Available Models
```bash
GET http://localhost:8000/models
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI   │────│  Next.js API   │────│  Python ML     │
│                 │    │                 │    │  Server         │
│ • Solar Forms   │    │ • Route Handler │    │                 │
│ • Results       │    │ • Data Validation│    │ • FastAPI       │
│ • Visualizations│    │ • Error Handling│    │ • ML Models     │
└─────────────────┘    └─────────────────┘    │ • NASA API      │
                                               │ • Analysis      │
                                               └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │  NASA POWER     │
                                               │  API            │
                                               │                 │
                                               │ • Weather Data  │
                                               │ • Solar Radiation│
                                               │ • Global Coverage│
                                               └─────────────────┘
```

## 📁 Project Structure

```
ai-hackathon/
├── app/
│   ├── api/
│   │   ├── predict/route.ts          # Main prediction API
│   │   └── solar-predict/route.ts     # Solar-specific API
│   └── page.tsx                       # Main page with navigation
├── components/
│   ├── solar-prediction-section.tsx  # Solar prediction UI
│   ├── prediction-section.tsx         # Original prediction UI
│   └── ui/                           # UI components
├── scripts/
│   ├── solar_ml_server.py           # Python ML server
│   ├── requirements.txt              # Python dependencies
│   └── ml_models.py                 # Original ML models
├── start-dev.bat                     # Windows startup script
├── start-dev.sh                      # Linux/Mac startup script
└── package.json                      # Node.js dependencies
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Customize Python ML service URL
PYTHON_ML_SERVICE_URL=http://localhost:8000
```

### Model Configuration
The system automatically loads the best available model:
1. `optimized_solar_power_model.pkl` (preferred)
2. `enhanced_solar_power_model.pkl`
3. Fallback to basic model

## 📈 Features Comparison

| Feature | Original UI | Solar Integration |
|---------|-------------|-------------------|
| **Input Method** | Manual only | NASA API + Manual |
| **Data Source** | Mock data | Real NASA weather |
| **ML Models** | Basic models | Advanced solar models |
| **Analysis** | Basic prediction | Physical analysis |
| **Recommendations** | None | Optimization tips |
| **Accuracy** | ~85% | 95%+ |
| **Real-time Data** | No | Yes |

## 🎯 Solar-Specific Features

### 🌤️ **NASA POWER API Integration**
- **Solar Radiation**: Real-time solar irradiance data
- **Temperature**: Ambient and module temperature
- **Weather Conditions**: Humidity, wind speed, pressure
- **Global Coverage**: Any location worldwide
- **Historical Data**: Up to 40+ years of data

### 🔬 **Physical Analysis**
- **Temperature Effects**: Coefficient analysis (-0.4% per °C)
- **Irradiance Efficiency**: Solar radiation optimization
- **Atmospheric Conditions**: Clear sky index analysis
- **Performance Metrics**: Comprehensive KPIs

### 💡 **Smart Recommendations**
- **High Priority**: Temperature management, panel positioning
- **Medium Priority**: Energy storage, maintenance
- **Low Priority**: Environmental factors, monitoring

## 🚨 Troubleshooting

### Common Issues

#### 1. **Python ML Server Not Starting**
```bash
# Check if port 8000 is available
netstat -an | findstr :8000

# Install missing dependencies
pip install -r scripts/requirements.txt
```

#### 2. **NASA POWER API Errors**
- Check internet connection
- Verify coordinates are valid (-90 to 90 lat, -180 to 180 lng)
- Ensure date format is YYYYMMDD
- Check NASA POWER API status

#### 3. **Frontend Not Loading**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 4. **Model Loading Issues**
- Ensure model files exist in parent directory
- Check file permissions
- Verify Python path includes parent directory

### Error Messages

| Error | Solution |
|-------|----------|
| `Python ML service not available` | Start Python server: `python scripts/solar_ml_server.py` |
| `NASA POWER API test failed` | Check internet connection and coordinates |
| `Model file not found` | Train models first or check file paths |
| `Invalid coordinates` | Use valid lat/lng ranges |

## 🔮 Future Enhancements

- **Real-time Dashboard**: Live solar monitoring
- **Historical Analysis**: Long-term performance trends
- **Multi-location**: Compare multiple sites
- **Mobile App**: React Native mobile interface
- **Advanced Visualizations**: Interactive charts and maps
- **Weather Forecasting**: Integration with weather APIs
- **Energy Storage**: Battery optimization recommendations

## 📞 Support

### Getting Help
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Test with the demo coordinates (Phoenix, AZ)
4. Check server logs for detailed error messages

### Demo Data
- **Phoenix, Arizona**: 33.4484, -112.074 (excellent solar location)
- **San Francisco**: 37.7749, -122.4194 (moderate solar)
- **Miami, Florida**: 25.7617, -80.1918 (good solar)

## 📄 License

This project is open source. Please respect NASA POWER API terms of service.

---

**🎉 Ready to predict solar power with AI! Start the development environment and explore the future of renewable energy prediction.**
