import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, PolynomialFeatures, RobustScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor, VotingRegressor, StackingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.feature_selection import SelectKBest, f_regression, RFE
from sklearn.pipeline import Pipeline
import xgboost as xgb
import lightgbm as lgb
import pickle
import warnings
warnings.filterwarnings('ignore')

def advanced_feature_engineering(df):
    """Create advanced features for better model performance"""
    print("🔧 Creating advanced features...")
    
    # Convert to datetime
    df['DATE_TIME'] = pd.to_datetime(df['DATE_TIME'])
    
    # Basic time features
    df['HOUR'] = df['DATE_TIME'].dt.hour
    df['DAY'] = df['DATE_TIME'].dt.day
    df['MONTH'] = df['DATE_TIME'].dt.month
    df['WEEKDAY'] = df['DATE_TIME'].dt.weekday
    df['DAYOFYEAR'] = df['DATE_TIME'].dt.dayofyear
    
    # Cyclical encoding for time features
    df['HOUR_SIN'] = np.sin(2 * np.pi * df['HOUR'] / 24)
    df['HOUR_COS'] = np.cos(2 * np.pi * df['HOUR'] / 24)
    df['DAY_SIN'] = np.sin(2 * np.pi * df['DAY'] / 31)
    df['DAY_COS'] = np.cos(2 * np.pi * df['DAY'] / 31)
    df['MONTH_SIN'] = np.sin(2 * np.pi * df['MONTH'] / 12)
    df['MONTH_COS'] = np.cos(2 * np.pi * df['MONTH'] / 12)
    
    # Temperature features
    df['TEMP_DIFF'] = df['MODULE_TEMPERATURE'] - df['AMBIENT_TEMPERATURE']
    df['TEMP_RATIO'] = df['MODULE_TEMPERATURE'] / (df['AMBIENT_TEMPERATURE'] + 1e-8)
    df['TEMP_SQUARE'] = df['AMBIENT_TEMPERATURE'] ** 2
    df['MODULE_TEMP_SQUARE'] = df['MODULE_TEMPERATURE'] ** 2
    
    # Irradiation features
    df['IRRADIATION_SQUARE'] = df['IRRADIATION'] ** 2
    df['IRRADIATION_SQRT'] = np.sqrt(df['IRRADIATION'] + 1e-8)
    df['IRRADIATION_LOG'] = np.log1p(df['IRRADIATION'])
    
    # Interaction features
    df['IRR_TEMP_INTERACTION'] = df['IRRADIATION'] * df['AMBIENT_TEMPERATURE']
    df['IRR_MODULE_TEMP_INTERACTION'] = df['IRRADIATION'] * df['MODULE_TEMPERATURE']
    df['TEMP_INTERACTION'] = df['AMBIENT_TEMPERATURE'] * df['MODULE_TEMPERATURE']
    
    # Power efficiency features
    df['EFFICIENCY'] = df['AC_POWER'] / (df['IRRADIATION'] + 1e-8)
    df['DC_EFFICIENCY'] = df['DC_POWER'] / (df['IRRADIATION'] + 1e-8)
    
    # Rolling features (if we have time series data)
    df = df.sort_values('DATE_TIME')
    df['IRRADIATION_MA_3'] = df['IRRADIATION'].rolling(window=3, min_periods=1).mean()
    df['TEMP_MA_3'] = df['AMBIENT_TEMPERATURE'].rolling(window=3, min_periods=1).mean()
    df['IRRADIATION_STD_3'] = df['IRRADIATION'].rolling(window=3, min_periods=1).std()
    
    # Lag features
    df['IRRADIATION_LAG1'] = df['IRRADIATION'].shift(1)
    df['TEMP_LAG1'] = df['AMBIENT_TEMPERATURE'].shift(1)
    df['AC_POWER_LAG1'] = df['AC_POWER'].shift(1)
    
    # Fill NaN values from lag features
    df['IRRADIATION_LAG1'].fillna(df['IRRADIATION'], inplace=True)
    df['TEMP_LAG1'].fillna(df['AMBIENT_TEMPERATURE'], inplace=True)
    df['AC_POWER_LAG1'].fillna(df['AC_POWER'], inplace=True)
    
    # Weather conditions
    df['IS_DAYLIGHT'] = (df['IRRADIATION'] > 0).astype(int)
    df['IS_HIGH_IRRADIATION'] = (df['IRRADIATION'] > df['IRRADIATION'].quantile(0.8)).astype(int)
    df['IS_HOT'] = (df['AMBIENT_TEMPERATURE'] > df['AMBIENT_TEMPERATURE'].quantile(0.8)).astype(int)
    
    # Seasonal features
    df['IS_SUMMER'] = df['MONTH'].isin([6, 7, 8]).astype(int)
    df['IS_WINTER'] = df['MONTH'].isin([12, 1, 2]).astype(int)
    df['IS_WEEKEND'] = df['WEEKDAY'].isin([5, 6]).astype(int)
    
    print(f"✅ Created {len(df.columns)} features")
    return df

def load_and_prepare_enhanced_data():
    """Load and prepare enhanced solar data"""
    print("🔄 Loading and preparing enhanced data...")
    
    # Load datasets
    df1 = pd.read_csv('solar_merged_1.csv')
    df2 = pd.read_csv('solar_merged_2.csv')
    df = pd.concat([df1, df2], ignore_index=True)
    
    print(f"📊 Original dataset shape: {df.shape}")
    
    # Advanced feature engineering
    df = advanced_feature_engineering(df)
    
    # Select features for modeling
    feature_columns = [
        # Original features
        'IRRADIATION', 'AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE',
        'HOUR', 'DAY', 'MONTH', 'WEEKDAY', 'DAYOFYEAR',
        
        # Cyclical features
        'HOUR_SIN', 'HOUR_COS', 'DAY_SIN', 'DAY_COS', 'MONTH_SIN', 'MONTH_COS',
        
        # Temperature features
        'TEMP_DIFF', 'TEMP_RATIO', 'TEMP_SQUARE', 'MODULE_TEMP_SQUARE',
        
        # Irradiation features
        'IRRADIATION_SQUARE', 'IRRADIATION_SQRT', 'IRRADIATION_LOG',
        
        # Interaction features
        'IRR_TEMP_INTERACTION', 'IRR_MODULE_TEMP_INTERACTION', 'TEMP_INTERACTION',
        
        # Efficiency features
        'EFFICIENCY', 'DC_EFFICIENCY',
        
        # Rolling features
        'IRRADIATION_MA_3', 'TEMP_MA_3', 'IRRADIATION_STD_3',
        
        # Lag features
        'IRRADIATION_LAG1', 'TEMP_LAG1', 'AC_POWER_LAG1',
        
        # Weather conditions
        'IS_DAYLIGHT', 'IS_HIGH_IRRADIATION', 'IS_HOT',
        
        # Seasonal features
        'IS_SUMMER', 'IS_WINTER', 'IS_WEEKEND'
    ]
    
    # Target variable
    target_column = 'AC_POWER'
    
    # Prepare features and target
    X = df[feature_columns].copy()
    y = df[target_column].copy()
    
    # Remove any missing values
    mask = ~(X.isnull().any(axis=1) | y.isnull())
    X = X[mask]
    y = y[mask]
    
    print(f"📊 Enhanced dataset shape: X={X.shape}, y={y.shape}")
    print(f"🎯 Features used: {len(feature_columns)}")
    
    return X, y, feature_columns, target_column

def train_advanced_models(X, y):
    """Train advanced models with better performance"""
    print("\n🔄 Training advanced models...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Use RobustScaler for better outlier handling
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Define advanced models
    models = {
        'XGBoost': xgb.XGBRegressor(
            n_estimators=1000,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1
        ),
        'LightGBM': lgb.LGBMRegressor(
            n_estimators=1000,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            verbose=-1
        ),
        'Random Forest': RandomForestRegressor(
            n_estimators=500,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'Extra Trees': ExtraTreesRegressor(
            n_estimators=500,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingRegressor(
            n_estimators=500,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            random_state=42
        ),
        'Elastic Net': ElasticNet(
            alpha=0.1,
            l1_ratio=0.5,
            random_state=42,
            max_iter=2000
        )
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\n🔄 Training {name}...")
        
        # Use scaled data for linear models
        if name in ['Elastic Net']:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Calculate accuracy (percentage of predictions within 5% of actual value)
        accuracy = np.mean(np.abs((y_test - y_pred) / (y_test + 1e-8)) <= 0.05) * 100
        
        results[name] = {
            'model': model,
            'mse': mse,
            'rmse': rmse,
            'mae': mae,
            'r2': r2,
            'accuracy': accuracy,
            'y_pred': y_pred
        }
        
        print(f"✅ {name} - R²: {r2:.4f}, RMSE: {rmse:.2f}, MAE: {mae:.2f}, Accuracy: {accuracy:.2f}%")
    
    return results, X_test, y_test, scaler

def create_ensemble_models(X_train, y_train, X_test, y_test, scaler):
    """Create ensemble models for better performance"""
    print("\n🔄 Creating ensemble models...")
    
    # Individual models for ensemble
    rf = RandomForestRegressor(n_estimators=300, max_depth=15, random_state=42, n_jobs=-1)
    xgb_model = xgb.XGBRegressor(n_estimators=500, max_depth=6, learning_rate=0.1, random_state=42, n_jobs=-1)
    lgb_model = lgb.LGBMRegressor(n_estimators=500, max_depth=6, learning_rate=0.1, random_state=42, n_jobs=-1, verbose=-1)
    gb = GradientBoostingRegressor(n_estimators=300, max_depth=6, learning_rate=0.1, random_state=42)
    
    # Voting Regressor
    voting_regressor = VotingRegressor([
        ('rf', rf),
        ('xgb', xgb_model),
        ('lgb', lgb_model),
        ('gb', gb)
    ])
    
    # Stacking Regressor
    stacking_regressor = StackingRegressor(
        estimators=[
            ('rf', rf),
            ('xgb', xgb_model),
            ('lgb', lgb_model)
        ],
        final_estimator=Ridge(alpha=1.0),
        cv=5
    )
    
    ensemble_models = {
        'Voting Ensemble': voting_regressor,
        'Stacking Ensemble': stacking_regressor
    }
    
    results = {}
    
    for name, model in ensemble_models.items():
        print(f"\n🔄 Training {name}...")
        
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        accuracy = np.mean(np.abs((y_test - y_pred) / (y_test + 1e-8)) <= 0.05) * 100
        
        results[name] = {
            'model': model,
            'mse': mse,
            'rmse': rmse,
            'mae': mae,
            'r2': r2,
            'accuracy': accuracy,
            'y_pred': y_pred
        }
        
        print(f"✅ {name} - R²: {r2:.4f}, RMSE: {rmse:.2f}, MAE: {mae:.2f}, Accuracy: {accuracy:.2f}%")
    
    return results

def hyperparameter_tuning_advanced(best_model_name, X_train, y_train):
    """Advanced hyperparameter tuning"""
    print(f"\n🔄 Advanced hyperparameter tuning for {best_model_name}...")
    
    if best_model_name == 'XGBoost':
        param_grid = {
            'n_estimators': [500, 1000, 1500],
            'max_depth': [4, 6, 8],
            'learning_rate': [0.05, 0.1, 0.15],
            'subsample': [0.8, 0.9, 1.0],
            'colsample_bytree': [0.8, 0.9, 1.0]
        }
        model = xgb.XGBRegressor(random_state=42, n_jobs=-1)
    elif best_model_name == 'LightGBM':
        param_grid = {
            'n_estimators': [500, 1000, 1500],
            'max_depth': [4, 6, 8],
            'learning_rate': [0.05, 0.1, 0.15],
            'subsample': [0.8, 0.9, 1.0],
            'colsample_bytree': [0.8, 0.9, 1.0]
        }
        model = lgb.LGBMRegressor(random_state=42, n_jobs=-1, verbose=-1)
    elif best_model_name == 'Random Forest':
        param_grid = {
            'n_estimators': [300, 500, 700],
            'max_depth': [15, 20, 25, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        }
        model = RandomForestRegressor(random_state=42, n_jobs=-1)
    else:
        print("⚠️ Hyperparameter tuning not implemented for this model")
        return None
    
    # Use RandomizedSearchCV for faster tuning
    random_search = RandomizedSearchCV(
        model, param_grid, n_iter=20, cv=3, scoring='r2', 
        n_jobs=-1, random_state=42, verbose=1
    )
    random_search.fit(X_train, y_train)
    
    print(f"✅ Best parameters: {random_search.best_params_}")
    print(f"✅ Best cross-validation R²: {random_search.best_score_:.4f}")
    
    return random_search.best_estimator_

def save_enhanced_model_and_results(best_model, scaler, feature_columns, target_column, all_results, X_test, y_test):
    """Save the enhanced model and results"""
    print(f"\n💾 Saving enhanced model and results...")
    
    # Save the best model
    model_data = {
        'model': best_model,
        'scaler': scaler,
        'feature_columns': feature_columns,
        'target_column': target_column,
        'model_type': 'enhanced_solar_prediction'
    }
    
    with open('enhanced_solar_power_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✅ Enhanced model saved as 'enhanced_solar_power_model.pkl'")
    
    # Save results summary
    results_df = pd.DataFrame({
        'Model': list(all_results.keys()),
        'R² Score': [all_results[model]['r2'] for model in all_results.keys()],
        'RMSE': [all_results[model]['rmse'] for model in all_results.keys()],
        'MAE': [all_results[model]['mae'] for model in all_results.keys()],
        'Accuracy (%)': [all_results[model]['accuracy'] for model in all_results.keys()]
    }).sort_values('R² Score', ascending=False)
    
    results_df.to_csv('enhanced_model_evaluation_results.csv', index=False)
    print("✅ Enhanced results saved as 'enhanced_model_evaluation_results.csv'")
    
    return results_df

def main():
    """Main function for enhanced ML pipeline"""
    print("🚀 Starting Enhanced Solar Power Prediction ML Pipeline")
    print("=" * 60)
    
    # Load and prepare enhanced data
    X, y, feature_columns, target_column = load_and_prepare_enhanced_data()
    
    # Train advanced models
    results, X_test, y_test, scaler = train_advanced_models(X, y)
    
    # Create ensemble models
    X_train, X_test_split, y_train, y_test_split = train_test_split(X, y, test_size=0.2, random_state=42)
    ensemble_results = create_ensemble_models(X_train, y_train, X_test_split, y_test_split, scaler)
    
    # Combine all results
    all_results = {**results, **ensemble_results}
    
    # Find the best model
    best_model_name = max(all_results.keys(), key=lambda x: all_results[x]['r2'])
    best_model = all_results[best_model_name]['model']
    best_r2 = all_results[best_model_name]['r2']
    best_accuracy = all_results[best_model_name]['accuracy']
    
    print(f"\n🏆 Best Model: {best_model_name}")
    print(f"🏆 Best R² Score: {best_r2:.4f}")
    print(f"🏆 Best Accuracy: {best_accuracy:.2f}%")
    
    # Hyperparameter tuning for the best model
    if best_accuracy < 80:  # Only tune if accuracy is below target
        tuned_model = hyperparameter_tuning_advanced(best_model_name, X_train, y_train)
        
        if tuned_model is not None:
            # Evaluate tuned model
            if best_model_name in ['Elastic Net']:
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test_split)
                y_pred_tuned = tuned_model.predict(X_test_scaled)
            else:
                y_pred_tuned = tuned_model.predict(X_test_split)
            
            tuned_r2 = r2_score(y_test_split, y_pred_tuned)
            tuned_accuracy = np.mean(np.abs((y_test_split - y_pred_tuned) / (y_test_split + 1e-8)) <= 0.05) * 100
            
            print(f"🎯 Tuned Model R²: {tuned_r2:.4f}")
            print(f"🎯 Tuned Model Accuracy: {tuned_accuracy:.2f}%")
            
            # Use tuned model if it's better
            if tuned_r2 > best_r2:
                best_model = tuned_model
                print("✅ Using tuned model as the final model")
    
    # Save model and results
    results_df = save_enhanced_model_and_results(best_model, scaler, feature_columns, target_column, all_results, X_test, y_test)
    
    print("\n📊 Enhanced Results Summary:")
    print(results_df.to_string(index=False))
    
    print(f"\n🎉 Enhanced pipeline completed successfully!")
    print(f"📁 Files created:")
    print(f"   - enhanced_solar_power_model.pkl (enhanced trained model)")
    print(f"   - enhanced_model_evaluation_results.csv (enhanced evaluation results)")

if __name__ == "__main__":
    main()
