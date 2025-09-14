import pandas as pd

def clean_solar_generation(file_path, output_path):
    # Load data
    df = pd.read_csv(file_path)

    # 1. Parse datetime
    df['DATE_TIME'] = pd.to_datetime(df['DATE_TIME'], dayfirst=True, errors='coerce')

    # 2. Drop unnecessary columns
    df = df.drop(columns=['PLANT_ID', 'SOURCE_KEY', 'TOTAL_YIELD'])

    # 3. Drop missing values in critical cols
    df = df.dropna(subset=['DATE_TIME', 'DC_POWER', 'AC_POWER'])

    # 4. Remove duplicates
    df = df.drop_duplicates()

    # 5. Extract datetime features
    df['HOUR'] = df['DATE_TIME'].dt.hour
    df['DAY'] = df['DATE_TIME'].dt.day
    df['MONTH'] = df['DATE_TIME'].dt.month
    df['WEEKDAY'] = df['DATE_TIME'].dt.weekday

    # 6. Save cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"✅ Cleaned data saved: {output_path}")
    return df

# df1 = clean_solar_generation("Plant_1_Generation_Data.csv", "Plant_1_Cleaned.csv")
df2 = clean_solar_generation("Plant_2_Generation_Data.csv", "Plant_2_Cleaned.csv")
