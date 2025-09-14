import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import os

class AIHackathonModels:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.model_info = {
            'neural_network': {
                'name': 'Deep Neural Network',
                'type': 'Classification',
                'description': 'Advanced deep learning model for complex pattern recognition'
            },
            'random_forest': {
                'name': 'Random Forest',
                'type': 'Ensemble',
                'description': 'Ensemble learning method combining multiple decision trees'
            },
            'svm': {
                'name': 'Support Vector Machine',
                'type': 'Classification',
                'description': 'Powerful algorithm for high-dimensional data classification'
            }
        }
    
    def generate_sample_data(self, n_samples=1000):
        """Generate sample dataset for demonstration"""
        print("Generating sample dataset...")
        
        # Create synthetic dataset with 4 features
        np.random.seed(42)
        
        # Feature 1: Age (18-80)
        feature1 = np.random.normal(40, 15, n_samples)
        feature1 = np.clip(feature1, 18, 80)
        
        # Feature 2: Income (20k-150k)
        feature2 = np.random.exponential(30000, n_samples) + 20000
        feature2 = np.clip(feature2, 20000, 150000)
        
        # Feature 3: Experience (0-40 years)
        feature3 = np.random.gamma(2, 5, n_samples)
        feature3 = np.clip(feature3, 0, 40)
        
        # Feature 4: Score (0-100)
        feature4 = np.random.beta(2, 2, n_samples) * 100
        
        # Create target based on features (with some noise)
        target = (
            (feature1 > 30) * 0.3 +
            (feature2 > 50000) * 0.4 +
            (feature3 > 5) * 0.2 +
            (feature4 > 60) * 0.1 +
            np.random.normal(0, 0.1, n_samples)
        )
        
        # Convert to binary classification
        target = (target > 0.5).astype(int)
        
        # Create DataFrame
        data = pd.DataFrame({
            'feature1': feature1,
            'feature2': feature2,
            'feature3': feature3,
            'feature4': feature4,
            'target': target
        })
        
        print(f"Generated {n_samples} samples with {len(data.columns)-1} features")
        print(f"Target distribution: {np.bincount(target)}")
        
        return data
    
    def train_models(self):
        """Train all ML models"""
        print("Starting model training process...")
        
        # Generate data
        data = self.generate_sample_data()
        
        # Prepare features and target
        X = data[['feature1', 'feature2', 'feature3', 'feature4']]
        y = data['target']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Store scaler
        self.scalers['standard'] = scaler
        
        # Define models
        models_config = {
            'neural_network': MLPClassifier(
                hidden_layer_sizes=(100, 50, 25),
                activation='relu',
                solver='adam',
                max_iter=1000,
                random_state=42
            ),
            'random_forest': RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            ),
            'svm': SVC(
                kernel='rbf',
                C=1.0,
                probability=True,
                random_state=42
            )
        }
        
        # Train and evaluate models
        results = {}
        
        for model_name, model in models_config.items():
            print(f"\nTraining {model_name}...")
            
            # Use scaled data for neural network and SVM
            if model_name in ['neural_network', 'svm']:
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
                y_pred_proba = model.predict_proba(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                y_pred_proba = model.predict_proba(X_test)
            
            # Calculate accuracy
            accuracy = accuracy_score(y_test, y_pred)
            
            # Store model
            self.models[model_name] = model
            
            # Store results
            results[model_name] = {
                'accuracy': accuracy,
                'predictions': y_pred.tolist(),
                'probabilities': y_pred_proba.tolist()
            }
            
            print(f"{model_name} accuracy: {accuracy:.3f}")
            print(f"Classification Report for {model_name}:")
            print(classification_report(y_test, y_pred))
        
        # Save models and scaler
        self.save_models()
        
        return results
    
    def save_models(self):
        """Save trained models and scalers"""
        print("Saving models...")
        
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        # Save each model
        for model_name, model in self.models.items():
            joblib.dump(model, f'models/{model_name}.pkl')
            print(f"Saved {model_name} model")
        
        # Save scaler
        joblib.dump(self.scalers['standard'], 'models/scaler.pkl')
        print("Saved scaler")
        
        # Save model info
        with open('models/model_info.json', 'w') as f:
            json.dump(self.model_info, f, indent=2)
        print("Saved model information")
    
    def load_models(self):
        """Load pre-trained models"""
        print("Loading models...")
        
        try:
            # Load models
            for model_name in self.model_info.keys():
                self.models[model_name] = joblib.load(f'models/{model_name}.pkl')
                print(f"Loaded {model_name} model")
            
            # Load scaler
            self.scalers['standard'] = joblib.load('models/scaler.pkl')
            print("Loaded scaler")
            
            return True
        except FileNotFoundError as e:
            print(f"Model files not found: {e}")
            return False
    
    def predict(self, features, model_name='neural_network'):
        """Make prediction using specified model"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        # Convert features to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features if needed
        if model_name in ['neural_network', 'svm']:
            features_scaled = self.scalers['standard'].transform(features_array)
            prediction = self.models[model_name].predict(features_scaled)[0]
            probability = self.models[model_name].predict_proba(features_scaled)[0]
        else:
            prediction = self.models[model_name].predict(features_array)[0]
            probability = self.models[model_name].predict_proba(features_array)[0]
        
        # Get confidence (probability of predicted class)
        confidence = probability[prediction] * 100
        
        # Convert prediction to human-readable format
        prediction_text = "Positive Outcome" if prediction == 1 else "Negative Outcome"
        
        return {
            'prediction': prediction_text,
            'confidence': round(confidence, 1),
            'model': self.model_info[model_name]['name'],
            'raw_prediction': int(prediction),
            'probabilities': probability.tolist()
        }

# Main execution
if __name__ == "__main__":
    print("AI Hackathon ML Models Training Script")
    print("=" * 50)
    
    # Initialize model trainer
    ml_trainer = AIHackathonModels()
    
    # Train models
    results = ml_trainer.train_models()
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    
    # Test prediction
    print("\nTesting prediction with sample data...")
    test_features = [35, 65000, 8, 75]  # age, income, experience, score
    
    for model_name in ml_trainer.model_info.keys():
        result = ml_trainer.predict(test_features, model_name)
        print(f"\n{model_name} prediction:")
        print(f"  Result: {result['prediction']}")
        print(f"  Confidence: {result['confidence']}%")
        print(f"  Model: {result['model']}")
    
    print("\nAll models trained and saved successfully!")
