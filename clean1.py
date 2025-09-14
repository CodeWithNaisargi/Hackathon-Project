import pandas as pd

def clean_solar_weather(file_path, output_path):
    # Load data
    df = pd.read_csv(file_path)

    # 1. Parse datetime
    df['DATE_TIME'] = pd.to_datetime(df['DATE_TIME'], dayfirst=True, errors='coerce')

    # 2. Drop unnecessary columns
    df = df.drop(columns=['PLANT_ID', 'SOURCE_KEY'])

    # 3. Drop missing values in important cols
    df = df.dropna(subset=['DATE_TIME', 'AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE', 'IRRADIATION'])

    # 4. Remove duplicates
    df = df.drop_duplicates()

    # 5. Clean ranges
    df = df[(df['AMBIENT_TEMPERATURE'] >= -20) & (df['AMBIENT_TEMPERATURE'] <= 80)]
    df = df[(df['MODULE_TEMPERATURE'] >= -20) & (df['MODULE_TEMPERATURE'] <= 100)]
    df.loc[df['IRRADIATION'] < 0, 'IRRADIATION'] = 0
    df.loc[df['IRRADIATION'] > 1400, 'IRRADIATION'] = 1400

    # 6. Extract datetime features
    df['HOUR'] = df['DATE_TIME'].dt.hour
    df['DAY'] = df['DATE_TIME'].dt.day
    df['MONTH'] = df['DATE_TIME'].dt.month
    df['WEEKDAY'] = df['DATE_TIME'].dt.weekday

    # 7. Save cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"✅ Cleaned weather data saved: {output_path}")
    return df


df_weather = clean_solar_weather("Plant_1_Weather_Sensor_Data.csv", "Plant_1_Weather_Cleaned.csv")
df_weather = clean_solar_weather("Plant_2_Weather_Sensor_Data.csv", "Plant_2_Weather_Cleaned.csv")
