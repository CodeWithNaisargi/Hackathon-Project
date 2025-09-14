from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class ModelServer:
    def __init__(self):
        self.models = {}
        self.scaler = None
        self.model_info = {}
        self.load_models()
    
    def load_models(self):
        """Load all trained models"""
        try:
            # Load model info
            with open('models/model_info.json', 'r') as f:
                self.model_info = json.load(f)
            
            # Load models
            for model_name in self.model_info.keys():
                model_path = f'models/{model_name}.pkl'
                if os.path.exists(model_path):
                    self.models[model_name] = joblib.load(model_path)
                    print(f"Loaded {model_name} model")
            
            # Load scaler
            scaler_path = 'models/scaler.pkl'
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                print("Loaded scaler")
            
            print(f"Successfully loaded {len(self.models)} models")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            print("Please run ml_models.py first to train the models")
    
    def predict(self, features, model_name='neural_network'):
        """Make prediction using specified model"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not available")
        
        if self.scaler is None:
            raise ValueError("Scaler not loaded")
        
        # Convert features to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features for neural network and SVM
        if model_name in ['neural_network', 'svm']:
            features_scaled = self.scaler.transform(features_array)
            prediction = self.models[model_name].predict(features_scaled)[0]
            probability = self.models[model_name].predict_proba(features_scaled)[0]
        else:
            prediction = self.models[model_name].predict(features_array)[0]
            probability = self.models[model_name].predict_proba(features_array)[0]
        
        # Get confidence
        confidence = probability[prediction] * 100
        
        # Convert prediction to readable format
        prediction_text = "Positive Outcome" if prediction == 1 else "Negative Outcome"
        
        return {
            'prediction': prediction_text,
            'confidence': round(confidence, 1),
            'model': self.model_info[model_name]['name'],
            'raw_prediction': int(prediction),
            'probabilities': probability.tolist()
        }

# Initialize model server
model_server = ModelServer()

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        model_name = data.get('model', 'neural_network')
        
        # Validate features
        if not isinstance(features, list) or len(features) != 4:
            return jsonify({'error': 'Features must be a list of 4 numbers'}), 400
        
        # Convert to float
        try:
            features = [float(f) for f in features]
        except ValueError:
            return jsonify({'error': 'All features must be numeric'}), 400
        
        # Make prediction
        result = model_server.predict(features, model_name)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models and their info"""
    return jsonify({
        'models': model_server.model_info,
        'available': list(model_server.models.keys())
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': len(model_server.models),
        'scaler_loaded': model_server.scaler is not None
    })

if __name__ == '__main__':
    print("Starting AI Hackathon Model Server...")
    print(f"Loaded {len(model_server.models)} models")
    print("Server running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
