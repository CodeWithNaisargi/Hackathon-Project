"""
NASA POWER API Integration Module for Solar Power Prediction
This module integrates NASA POWER API data with solar power prediction models
and provides physical analysis for performance optimization.
"""

import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import pickle
import warnings
warnings.filterwarnings('ignore')

class NASAPowerAPI:
    """NASA POWER API integration class"""
    
    def __init__(self):
        self.base_url = "https://power.larc.nasa.gov/api/temporal"
        self.parameters = {
            'solar_radiation': 'ALLSKY_SFC_SW_DWN',
            'temperature': 'T2M',
            'humidity': 'RH2M',
            'wind_speed': 'WS2M',
            'pressure': 'PS',
            'precipitation': 'PRECTOTCORR'
        }
    
    def fetch_weather_data(self, latitude, longitude, start_date, end_date, temporal='daily'):
        """
        Fetch weather data from NASA POWER API
        
        Args:
            latitude (float): Latitude coordinate
            longitude (float): Longitude coordinate
            start_date (str): Start date in YYYYMMDD format
            end_date (str): End date in YYYYMMDD format
            temporal (str): Temporal resolution ('hourly', 'daily', 'monthly')
        
        Returns:
            pd.DataFrame: Weather data
        """
        print(f"🌤️ Fetching NASA POWER data for coordinates ({latitude}, {longitude})")
        print(f"📅 Date range: {start_date} to {end_date}")
        
        # Define parameters to fetch (using only standard parameters)
        param_list = [
            self.parameters['solar_radiation'],
            self.parameters['temperature'],
            self.parameters['humidity'],
            self.parameters['wind_speed']
        ]
        
        parameters_str = ','.join(param_list)
        
        # Construct API URL
        url = f"{self.base_url}/{temporal}/point"
        params = {
            'parameters': parameters_str,
            'latitude': latitude,
            'longitude': longitude,
            'start': start_date,
            'end': end_date,
            'format': 'JSON',
            'community': 'RE'  # Required parameter for renewable energy community
        }
        
        try:
            print("🔄 Making API request...")
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract and process data
            if 'properties' in data and 'parameter' in data['properties']:
                weather_df = self._process_api_response(data['properties']['parameter'])
                print(f"✅ Successfully fetched {len(weather_df)} records")
                return weather_df
            else:
                print("❌ No data found in API response")
                return pd.DataFrame()
                
        except requests.exceptions.RequestException as e:
            print(f"❌ API request failed: {e}")
            return pd.DataFrame()
        except Exception as e:
            print(f"❌ Error processing API response: {e}")
            return pd.DataFrame()
    
    def _process_api_response(self, parameter_data):
        """Process NASA POWER API response into DataFrame"""
        processed_data = []
        
        for param_name, param_data in parameter_data.items():
            for date_str, value in param_data.items():
                processed_data.append({
                    'DATE': date_str,
                    'PARAMETER': param_name,
                    'VALUE': value
                })
        
        df = pd.DataFrame(processed_data)
        
        if not df.empty:
            # Pivot to have parameters as columns
            df_pivot = df.pivot(index='DATE', columns='PARAMETER', values='VALUE')
            df_pivot.reset_index(inplace=True)
            
            # Rename columns to more readable names
            column_mapping = {
                'ALLSKY_SFC_SW_DWN': 'SOLAR_RADIATION',
                'T2M': 'TEMPERATURE',
                'RH2M': 'HUMIDITY',
                'WS2M': 'WIND_SPEED'
            }
            
            df_pivot.rename(columns=column_mapping, inplace=True)
            
            # Convert DATE to datetime
            df_pivot['DATE'] = pd.to_datetime(df_pivot['DATE'])
            
            # Add derived features
            df_pivot = self._add_derived_features(df_pivot)
            
        return df_pivot
    
    def _add_derived_features(self, df):
        """Add derived features from NASA POWER data"""
        # Convert temperature from Kelvin to Celsius
        if 'TEMPERATURE' in df.columns:
            df['TEMPERATURE_C'] = df['TEMPERATURE'] - 273.15
        
        # Add time-based features
        df['YEAR'] = df['DATE'].dt.year
        df['MONTH'] = df['DATE'].dt.month
        df['DAY'] = df['DATE'].dt.day
        df['DAYOFYEAR'] = df['DATE'].dt.dayofyear
        df['WEEKDAY'] = df['DATE'].dt.weekday
        
        # Seasonal features
        df['IS_SUMMER'] = df['MONTH'].isin([6, 7, 8]).astype(int)
        df['IS_WINTER'] = df['MONTH'].isin([12, 1, 2]).astype(int)
        
        # Solar efficiency indicators (using solar radiation as base efficiency indicator)
        if 'SOLAR_RADIATION' in df.columns:
            # Calculate efficiency based on solar radiation intensity
            df['SOLAR_EFFICIENCY'] = df['SOLAR_RADIATION'] / df['SOLAR_RADIATION'].max()
        
        # Weather conditions
        if 'SOLAR_RADIATION' in df.columns:
            df['IS_DAYLIGHT'] = (df['SOLAR_RADIATION'] > 0).astype(int)
            df['IS_HIGH_RADIATION'] = (df['SOLAR_RADIATION'] > df['SOLAR_RADIATION'].quantile(0.8)).astype(int)
        
        if 'TEMPERATURE_C' in df.columns:
            df['IS_HOT'] = (df['TEMPERATURE_C'] > df['TEMPERATURE_C'].quantile(0.8)).astype(int)
        
        return df

class PhysicalAnalysis:
    """Physical analysis for solar panel performance optimization"""
    
    def __init__(self):
        self.standard_test_conditions = {
            'irradiance': 1000,  # W/m²
            'temperature': 25,   # °C
            'air_mass': 1.5
        }
    
    def analyze_solar_performance(self, weather_data, predicted_power=None):
        """
        Perform physical analysis of solar panel performance
        
        Args:
            weather_data (pd.DataFrame): NASA POWER weather data
            predicted_power (pd.Series): ML model predictions (optional)
        
        Returns:
            dict: Analysis results and recommendations
        """
        print("🔬 Performing physical analysis...")
        
        analysis = {
            'performance_metrics': {},
            'efficiency_analysis': {},
            'weather_impact': {},
            'recommendations': []
        }
        
        if weather_data.empty:
            return analysis
        
        # Performance metrics
        analysis['performance_metrics'] = self._calculate_performance_metrics(weather_data, predicted_power)
        
        # Efficiency analysis
        analysis['efficiency_analysis'] = self._analyze_efficiency(weather_data)
        
        # Weather impact analysis
        analysis['weather_impact'] = self._analyze_weather_impact(weather_data)
        
        # Generate recommendations
        analysis['recommendations'] = self._generate_recommendations(analysis)
        
        return analysis
    
    def _calculate_performance_metrics(self, weather_data, predicted_power=None):
        """Calculate key performance metrics"""
        metrics = {}
        
        if 'SOLAR_RADIATION' in weather_data.columns:
            metrics['avg_solar_radiation'] = weather_data['SOLAR_RADIATION'].mean()
            metrics['max_solar_radiation'] = weather_data['SOLAR_RADIATION'].max()
            metrics['solar_radiation_std'] = weather_data['SOLAR_RADIATION'].std()
        
        if 'TEMPERATURE_C' in weather_data.columns:
            metrics['avg_temperature'] = weather_data['TEMPERATURE_C'].mean()
            metrics['max_temperature'] = weather_data['TEMPERATURE_C'].max()
            metrics['temperature_range'] = weather_data['TEMPERATURE_C'].max() - weather_data['TEMPERATURE_C'].min()
        
        # Calculate clear sky consistency based on solar radiation variability
        if 'SOLAR_RADIATION' in weather_data.columns:
            metrics['radiation_consistency'] = 1 - (weather_data['SOLAR_RADIATION'].std() / weather_data['SOLAR_RADIATION'].mean())
        
        if predicted_power is not None:
            metrics['avg_predicted_power'] = predicted_power.mean()
            metrics['max_predicted_power'] = predicted_power.max()
            metrics['power_consistency'] = 1 - (predicted_power.std() / predicted_power.mean())
        
        return metrics
    
    def _analyze_efficiency(self, weather_data):
        """Analyze solar panel efficiency factors"""
        efficiency = {}
        
        if 'SOLAR_RADIATION' in weather_data.columns and 'TEMPERATURE_C' in weather_data.columns:
            # Temperature coefficient effect (typically -0.4% per °C above 25°C)
            temp_coefficient = -0.004
            temp_effect = (weather_data['TEMPERATURE_C'] - 25) * temp_coefficient
            efficiency['temperature_efficiency_loss'] = temp_effect.mean()
            
            # Irradiance efficiency (higher irradiance = better efficiency up to a point)
            irradiance_efficiency = np.minimum(weather_data['SOLAR_RADIATION'] / 1000, 1.0)
            efficiency['irradiance_efficiency'] = irradiance_efficiency.mean()
        
        # Calculate atmospheric efficiency based on solar radiation consistency
        if 'SOLAR_RADIATION' in weather_data.columns:
            # Higher consistency indicates better atmospheric conditions
            efficiency['atmospheric_efficiency'] = 1 - (weather_data['SOLAR_RADIATION'].std() / weather_data['SOLAR_RADIATION'].mean())
        
        if 'HUMIDITY' in weather_data.columns:
            # High humidity can reduce efficiency
            humidity_effect = np.maximum(0, (weather_data['HUMIDITY'] - 60) * 0.001)
            efficiency['humidity_efficiency_loss'] = humidity_effect.mean()
        
        return efficiency
    
    def _analyze_weather_impact(self, weather_data):
        """Analyze weather conditions impact on performance"""
        impact = {}
        
        # Cloud cover impact (based on solar radiation levels)
        if 'SOLAR_RADIATION' in weather_data.columns:
            # Days with low solar radiation indicate cloudy conditions
            cloudy_threshold = weather_data['SOLAR_RADIATION'].quantile(0.3)
            cloudy_days = weather_data[weather_data['SOLAR_RADIATION'] < cloudy_threshold]
            impact['cloudy_days_count'] = len(cloudy_days)
            impact['cloudy_days_percentage'] = len(cloudy_days) / len(weather_data) * 100
        
        # Temperature impact
        if 'TEMPERATURE_C' in weather_data.columns:
            hot_days = weather_data[weather_data['TEMPERATURE_C'] > 35]
            impact['hot_days_count'] = len(hot_days)
            impact['hot_days_percentage'] = len(hot_days) / len(weather_data) * 100
        
        # Solar radiation variability
        if 'SOLAR_RADIATION' in weather_data.columns:
            impact['radiation_variability'] = weather_data['SOLAR_RADIATION'].std() / weather_data['SOLAR_RADIATION'].mean()
        
        return impact
    
    def _generate_recommendations(self, analysis):
        """Generate performance optimization recommendations"""
        recommendations = []
        
        # Temperature-related recommendations
        if 'temperature_efficiency_loss' in analysis['efficiency_analysis']:
            temp_loss = analysis['efficiency_analysis']['temperature_efficiency_loss']
            if temp_loss < -0.05:  # More than 5% loss
                recommendations.append({
                    'category': 'Temperature Management',
                    'priority': 'High',
                    'recommendation': 'Consider installing cooling systems or improving ventilation around solar panels',
                    'potential_improvement': f"{abs(temp_loss)*100:.1f}% efficiency gain"
                })
        
        # Irradiance-related recommendations
        if 'irradiance_efficiency' in analysis['efficiency_analysis']:
            irradiance_eff = analysis['efficiency_analysis']['irradiance_efficiency']
            if irradiance_eff < 0.8:
                recommendations.append({
                    'category': 'Panel Positioning',
                    'priority': 'Medium',
                    'recommendation': 'Optimize panel tilt and azimuth angles for better sun exposure',
                    'potential_improvement': f"{(0.8 - irradiance_eff)*100:.1f}% efficiency gain"
                })
        
        # Atmospheric conditions
        if 'atmospheric_efficiency' in analysis['efficiency_analysis']:
            atm_eff = analysis['efficiency_analysis']['atmospheric_efficiency']
            if atm_eff < 0.7:
                recommendations.append({
                    'category': 'Environmental Factors',
                    'priority': 'Low',
                    'recommendation': 'Consider cleaning panels more frequently or installing anti-soiling coatings',
                    'potential_improvement': f"{(0.7 - atm_eff)*100:.1f}% efficiency gain"
                })
        
        # Weather variability recommendations
        if 'radiation_variability' in analysis['weather_impact']:
            variability = analysis['weather_impact']['radiation_variability']
            if variability > 0.3:
                recommendations.append({
                    'category': 'Energy Storage',
                    'priority': 'Medium',
                    'recommendation': 'Consider installing battery storage to smooth power output during variable weather',
                    'potential_improvement': 'Improved grid stability and energy utilization'
                })
        
        return recommendations

class EnhancedSolarPredictor:
    """Enhanced solar power predictor combining ML model with NASA POWER data"""
    
    def __init__(self, model_path='optimized_solar_power_model.pkl'):
        """Initialize with trained ML model"""
        self.model_data = None
        self.nasa_api = NASAPowerAPI()
        self.physical_analyzer = PhysicalAnalysis()
        
        # Load the trained model
        try:
            with open(model_path, 'rb') as f:
                self.model_data = pickle.load(f)
            print(f"✅ Loaded trained model from {model_path}")
        except FileNotFoundError:
            print(f"⚠️ Model file {model_path} not found. Please train a model first.")
    
    def predict_with_nasa_data(self, latitude, longitude, start_date, end_date, 
                              temporal='daily', include_analysis=True):
        """
        Make solar power predictions using NASA POWER data
        
        Args:
            latitude (float): Latitude coordinate
            longitude (float): Longitude coordinate
            start_date (str): Start date in YYYYMMDD format
            end_date (str): End date in YYYYMMDD format
            temporal (str): Temporal resolution ('hourly', 'daily', 'monthly')
            include_analysis (bool): Whether to include physical analysis
        
        Returns:
            dict: Predictions and analysis results
        """
        print("🚀 Starting enhanced solar power prediction...")
        
        # Fetch NASA POWER data
        weather_data = self.nasa_api.fetch_weather_data(
            latitude, longitude, start_date, end_date, temporal
        )
        
        if weather_data.empty:
            return {'error': 'Failed to fetch weather data'}
        
        # Prepare features for ML model
        ml_features = self._prepare_ml_features(weather_data)
        
        # Make predictions using ML model
        predictions = None
        if self.model_data is not None and not ml_features.empty:
            predictions = self._make_ml_predictions(ml_features)
        
        # Perform physical analysis
        analysis = None
        if include_analysis:
            analysis = self.physical_analyzer.analyze_solar_performance(
                weather_data, predictions
            )
        
        return {
            'weather_data': weather_data,
            'predictions': predictions,
            'analysis': analysis,
            'metadata': {
                'coordinates': (latitude, longitude),
                'date_range': (start_date, end_date),
                'temporal_resolution': temporal,
                'model_used': self.model_data['model_type'] if self.model_data else None
            }
        }
    
    def _prepare_ml_features(self, weather_data):
        """Prepare features for ML model from NASA POWER data"""
        if self.model_data is None:
            return pd.DataFrame()
        
        feature_columns = self.model_data['feature_columns']
        prepared_features = pd.DataFrame()
        
        # Map NASA POWER data to ML model features
        feature_mapping = {
            'IRRADIATION': 'SOLAR_RADIATION',
            'AMBIENT_TEMPERATURE': 'TEMPERATURE_C',
            'MODULE_TEMPERATURE': 'TEMPERATURE_C',  # Approximate with ambient temp
            'HOUR': 'HOUR',
            'DAY': 'DAY',
            'MONTH': 'MONTH',
            'WEEKDAY': 'WEEKDAY',
            'DAYOFYEAR': 'DAYOFYEAR'
        }
        
        # Create basic features
        for ml_feature, nasa_feature in feature_mapping.items():
            if nasa_feature in weather_data.columns and ml_feature in feature_columns:
                prepared_features[ml_feature] = weather_data[nasa_feature]
        
        # Add derived features if they exist in the model
        if 'TEMP_DIFF' in feature_columns:
            prepared_features['TEMP_DIFF'] = 0  # No module temp data
        
        if 'TEMP_RATIO' in feature_columns:
            prepared_features['TEMP_RATIO'] = 1.0  # Default ratio
        
        if 'IRRADIATION_SQUARE' in feature_columns and 'SOLAR_RADIATION' in weather_data.columns:
            prepared_features['IRRADIATION_SQUARE'] = weather_data['SOLAR_RADIATION'] ** 2
        
        if 'IS_SUMMER' in feature_columns:
            prepared_features['IS_SUMMER'] = weather_data['IS_SUMMER']
        
        if 'IS_WINTER' in feature_columns:
            prepared_features['IS_WINTER'] = weather_data['IS_WINTER']
        
        # Fill missing features with defaults
        for feature in feature_columns:
            if feature not in prepared_features.columns:
                if 'SIN' in feature or 'COS' in feature:
                    prepared_features[feature] = 0.0
                elif 'IS_' in feature:
                    prepared_features[feature] = 0
                else:
                    prepared_features[feature] = 0.0
        
        return prepared_features[feature_columns]
    
    def _make_ml_predictions(self, features):
        """Make predictions using the trained ML model"""
        if self.model_data is None:
            return None
        
        model = self.model_data['model']
        scaler = self.model_data['scaler']
        
        # Scale features if needed
        if scaler is not None:
            features_scaled = scaler.transform(features)
            predictions = model.predict(features_scaled)
        else:
            predictions = model.predict(features)
        
        return predictions

def demo_nasa_integration():
    """Demonstration of NASA POWER API integration"""
    print("🌟 NASA POWER API Integration Demo")
    print("=" * 50)
    
    # Example coordinates (San Francisco)
    latitude = 37.7749
    longitude = -122.4194
    
    # Date range (last 30 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    start_date_str = start_date.strftime('%Y%m%d')
    end_date_str = end_date.strftime('%Y%m%d')
    
    # Initialize enhanced predictor
    predictor = EnhancedSolarPredictor()
    
    # Make predictions
    results = predictor.predict_with_nasa_data(
        latitude, longitude, start_date_str, end_date_str
    )
    
    if 'error' in results:
        print(f"❌ Error: {results['error']}")
        return
    
    # Display results
    print("\n📊 Weather Data Summary:")
    weather_data = results['weather_data']
    print(weather_data.describe())
    
    if results['predictions'] is not None:
        print(f"\n🔮 Power Predictions:")
        print(f"Average predicted power: {results['predictions'].mean():.2f} kW")
        print(f"Maximum predicted power: {results['predictions'].max():.2f} kW")
    
    if results['analysis']:
        print(f"\n🔬 Physical Analysis:")
        analysis = results['analysis']
        
        print(f"\n📈 Performance Metrics:")
        for metric, value in analysis['performance_metrics'].items():
            print(f"  {metric}: {value:.2f}")
        
        print(f"\n⚡ Efficiency Analysis:")
        for metric, value in analysis['efficiency_analysis'].items():
            print(f"  {metric}: {value:.4f}")
        
        print(f"\n🌤️ Weather Impact:")
        for metric, value in analysis['weather_impact'].items():
            print(f"  {metric}: {value:.2f}")
        
        print(f"\n💡 Recommendations:")
        for i, rec in enumerate(analysis['recommendations'], 1):
            print(f"  {i}. [{rec['priority']}] {rec['category']}: {rec['recommendation']}")
            print(f"     Potential improvement: {rec['potential_improvement']}")

if __name__ == "__main__":
    demo_nasa_integration()
