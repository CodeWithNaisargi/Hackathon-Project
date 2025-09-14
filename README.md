# 🌞 AI/ML-Based Solar Power Generation Prediction  
!DEMO (demo.jpg)
## 📌 Overview  
This project predicts **solar power generation** using **AI/ML techniques** by combining **historical datasets** from Kaggle with **real-time environmental data** from the **NASA POWER API**.  

It helps users and researchers get **accurate, site-specific predictions** of electricity generation from solar panels and provides **actionable recommendations** for panel orientation.  

---

## ✨ Features  
- 📊 **Data Sources**:  
  - Kaggle Solar Power Generation Dataset (`.csv`)  
  - Real-time irradiance & weather data from **NASA POWER API**  

- 🔬 **Data Processing & Analysis**:  
  - Pandas for preprocessing  
  - Matplotlib for visualization  

- 🤖 **Machine Learning**:  
  - Multiple ML algorithms tested using Scikit-learn  
  - **Random Forest Regression** selected as the most accurate  

- 🌐 **Frontend Dashboard**:  
  - Built with **Next.js**  
  - User inputs: location, panel details  
  - Charts for daily/weekly/monthly predictions  
  - Recommendations for **optimal tilt & azimuth**  

---

## ⚙️ Tech Stack  
- **Backend / ML**: Python, Pandas, Matplotlib, Scikit-learn  
- **Data Sources**: Kaggle CSV, NASA POWER API  
- **Frontend**: Next.js, Chart.js / Recharts  
- **Other Tools**: Git, GitHub  

---

## 📂 Project Structure  
├── backend
│ ├── data
│ │ ├── kaggle_solar_data.csv
│ ├── model
│ │ ├── random_forest_model.pkl
│ ├── scripts
│ │ ├── data_preprocessing.py
│ │ ├── model_training.py
│ │ ├── nasa_api_fetch.py
│ └── app.py
│
├── frontend
│ ├── pages
│ │ ├── index.js
│ │ ├── dashboard.js
│ ├── components
│ │ ├── InputForm.js
│ │ ├── ChartView.js
│ ├── styles
│ ├── globals.css
│
├── README.md
└── requirements.txt


---

## 🚀 How It Works  
1. **Collect Data**  
   - Load historical CSV dataset from Kaggle  
   - Fetch real-time weather/irradiance data via NASA POWER API  

2. **Preprocess & Engineer Features**  
   - Clean data, extract features like irradiance, temperature, humidity, tilt & azimuth  

3. **Train & Test Model**  
   - Tried Linear Regression, Decision Tree, Gradient Boosting  
   - **Random Forest Regression** performed best  

4. **Predict & Visualize**  
   - Generate hourly/daily predictions  
   - Display charts & insights in Next.js frontend  
   - Provide **optimal panel orientation** tips  

---

## 📊 Results  
- Random Forest Regression gave the **highest accuracy**  
- Predictions adapt to **real-time weather conditions**  
- Dashboard displays **daily, weekly, and monthly outputs**  

---

## 🔧 Installation  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/your-username/solar-prediction.git
cd solar-prediction




