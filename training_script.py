
import pandas as pd
import numpy as np
import sklearn
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost
import joblib

print("All libraries installed successfully")
import sys
print(sys.executable)
import matplotlib
print(matplotlib.__version__)
pip install pandas numpy scikit-learn xgboost joblib
!pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

df_summary = pd.read_csv("manuf-ai-dashboard/Summary.csv")
df_batch_data = pd.read_csv("manuf-ai-dashboard/BatchData.csv")
df_summary = pd.read_csv("manuf-ai-dashboard/Summary.csv")
df_batch_data = pd.read_csv("manuf-ai-dashboard/BatchData.csv")
df_summary = pd.read_csv("./manuf-ai-dashboard/Summary.csv")
df_batch_data = pd.read_csv("./manuf-ai-dashboard/BatchData.csv")
df_merged_data = pd.merge(
    df_summary,
    df_batch_data,
    on="Batch_ID",
    how="left"
)
df_numeric = df_merged_data.drop(columns=['Batch_ID'])

df_numeric.corr()
df_merged_data.columns
df_merged_data.info()

X = df_merged_data[
[
'Material_A_Quantity',
'Material_B_Quantity',
'Process_Duration_Hours'
]
]

y = df_merged_data[
[
'Hardness',
'Friability',
'Dissolution_Rate'
]
]
import pandas as pd
import numpy as np
import os
X = df_merged_data[
    [
        "Material_A_Quantity",
        "Material_B_Quantity",
        "Process_Duration_Hours"
    ]
]

y = df_merged_data[
    [
        "Hardness",
        "Friability",
        "Dissolution_Rate"
    ]
]
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
from xgboost import XGBRegressor

model = XGBRegressor()

model.fit(X_train, y_train)
from sklearn.metrics import r2_score

pred = model.predict(X_test)

print(r2_score(y_test, pred))
import pandas as pd

df_process = pd.read_csv(
    "mock_batch_data/_h_batch_process_data.csv",
    encoding="latin1",
    sep=";",
    engine="python",
    on_bad_lines="skip"
)

df_production = pd.read_csv(
    "mock_batch_data/_h_batch_production_data.csv",
    encoding="latin1",
    sep=";",
    engine="python",
    on_bad_lines="skip"
)
import pandas as pd

df_process = pd.read_excel("mock_batch_data/_h_batch_process_data.csv")
df_production = pd.read_excel("mock_batch_data/_h_batch_production_data.csv")
df_production.columns
import pandas as pd
import numpy as np
import os

# Create a directory for batch files if it doesn't exist
if not os.path.exists('mock_batch_data'):
    os.makedirs('mock_batch_data')

# Generate 60 mock Batch_Txxx.csv files
for i in range(1, 61):
    batch_id = f'T{i:03d}'
    num_rows = 100

    data = {
        'Batch_ID': [batch_id] * num_rows,
        'Time_Stamp': pd.to_datetime(pd.date_range('2023-01-01', periods=num_rows, freq='min')),
        'Temperature_C': np.random.uniform(80, 120, num_rows),
        'Pressure_Bar': np.random.uniform(5, 15, num_rows),
        'Power_Consumption_kW': np.random.uniform(50, 200, num_rows),
        'Vibration_mm_s': np.random.uniform(0.1, 5, num_rows)
    }
    df_batch = pd.DataFrame(data)
    df_batch.to_csv(f'mock_batch_data/Batch_{batch_id}.csv', index=False)

print("Generated 60 mock Batch_Txxx.csv files in 'mock_batch_data' directory.")

df_merged_data.head()
df_numeric = df_merged_data.drop(columns=['Batch_ID'])
df_merged_data['Energy_Pattern_Ratio'] = (
    df_merged_data['Material_A_Quantity'] /
    df_merged_data['Process_Duration_Hours']
)
X = df_merged_data.drop(columns=[
    'Batch_ID',
    'Hardness',
    'Friability',
    'Dissolution_Rate',
    'Energy_Pattern_Ratio'
])

y = df_merged_data[['Hardness','Friability','Dissolution_Rate','Energy_Pattern_Ratio']]
print(df_merged_data.columns)
corr_matrix = df_numeric.corr()
print(corr_matrix)
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(12,10))

sns.heatmap(
    corr_matrix,
    annot=True,
    cmap="coolwarm",
    fmt=".2f",
    linewidths=0.5
)

plt.title("Correlation Matrix")
plt.show()
df_numeric = df_merged_data.drop(columns=['Batch_ID'])
df_numeric = df_merged_data.select_dtypes(include=['float64','int64'])
plt.figure(figsize=(12,8))
sns.heatmap(corr_matrix, cmap="coolwarm")
plt.title("Feature Correlation Matrix")
plt.show()
df_merged_data.info()
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
X = df_merged_data.drop(columns=['Batch_ID','Hardness'])
y = df_merged_data['Hardness']
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
df_merged_data["Material_Ratio"] = (
    df_merged_data["Material_A_Quantity"] /
    df_merged_data["Material_B_Quantity"]
)

df_merged_data["Production_Efficiency"] = (
    (df_merged_data["Material_A_Quantity"] + df_merged_data["Material_B_Quantity"]) /
    df_merged_data["Process_Duration_Hours"]
)

df_merged_data["Material_Total"] = (
    df_merged_data["Material_A_Quantity"] +
    df_merged_data["Material_B_Quantity"]
)
X = df_merged_data[
[
"Material_A_Quantity",
"Material_B_Quantity",
"Process_Duration_Hours",
"Material_Ratio",
"Production_Efficiency",
"Material_Total"
]
]

y = df_merged_data["Hardness"]   # start with one target first
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=6,
    random_state=42
)

model.fit(X_train, y_train)
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("MSE:", mse)
print("RMSE:", rmse)
print("MAE:", mae)
print("R2 Score:", r2)
print(df_merged_data.columns)
X = df_merged_data[
[
'Material_A_Quantity',
'Material_B_Quantity',
'Process_Duration_Hours'
]]

y = df_merged_data[['Hardness','Friability','Dissolution_Rate']]
# features
X = df_merged_data[['Material_A_Quantity','Material_B_Quantity','Process_Duration_Hours']]

# targets
y = df_merged_data[['Hardness','Friability','Dissolution_Rate']]
df_merged_data.head()
batch_ids = [f'T{i:03d}' for i in range(1, 61)]
summary_data = {
    'Batch_ID': batch_ids,
    'Material_A_Quantity': np.random.uniform(100, 500, 60),
    'Material_B_Quantity': np.random.uniform(50, 250, 60),
    'Process_Duration_Hours': np.random.uniform(8, 24, 60)
}
df_summary = pd.DataFrame(summary_data)
df_summary.to_csv('Summary.csv', index=False)

print("Generated mock Summary.csv file.")

X = df_merged_data[['Material_A_Quantity',
                    'Material_B_Quantity',
                    'Process_Duration_Hours']]

y = df_merged_data['Hardness']

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

print("MSE:", mean_squared_error(y_test, y_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))
X = df_merged_data[['Material_A_Quantity',
                    'Material_B_Quantity',
                    'Process_Duration_Hours']]
y = df_merged_data['Hardness']
X = df_merged_data[['Material_A_Quantity',
                    'Material_B_Quantity',
                    'Process_Duration_Hours']]

y = df_merged_data['Hardness']
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

print("MSE:", mean_squared_error(y_test, y_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))

import joblib

joblib.dump(model, "manufacturing_model.pkl")
y = df_merged_data[['Hardness','Friability','Dissolution_Rate']]
y = df_merged_data[['Hardness','Friability','Dissolution_Rate']]
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor

model = MultiOutputRegressor(XGBRegressor())

model.fit(X_train, y_train)

print("Model training complete")
X = df_merged_data[
[
'Material_A_Quantity',
'Material_B_Quantity',
'Process_Duration_Hours'
]
]

y = df_merged_data[
[
'Hardness',
'Friability',
'Dissolution_Rate'
]
]
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
X, y, test_size=0.2, random_state=42
)
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor

model = MultiOutputRegressor(XGBRegressor())

model.fit(X_train, y_train)

print("Model training complete")
y_pred = model.predict(X_test)
from sklearn.metrics import mean_squared_error, r2_score

print("MSE:", mean_squared_error(y_test, y_pred))
print("R2:", r2_score(y_test, y_pred))
print(model)
batch_ids = [f'T{i:03d}' for i in range(1, 61)]
batch_data_metrics = {
    'Batch_ID': batch_ids,
    'Hardness': np.random.uniform(50, 100, 60),
    'Friability': np.random.uniform(0.1, 1.0, 60),
    'Dissolution_Rate': np.random.uniform(70, 99, 60)
}
df_batch_data = pd.DataFrame(batch_data_metrics)
df_batch_data.to_csv('BatchData.csv', index=False)

print("Generated mock BatchData.csv file.")
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

print("R2 Score:", r2_score(y_test, y_pred))

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print("RMSE:", rmse)
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)
aggregated_data = []
sensor_columns = ['Temperature_C', 'Pressure_Bar', 'Power_Consumption_kW', 'Vibration_mm_s']

for i in range(1, 61):
    batch_id = f'T{i:03d}'
    file_path = f'mock_batch_data/Batch_{batch_id}.csv'

    try:
        df_batch = pd.read_csv(file_path)
        batch_stats = {'Batch_ID': batch_id}

        for col in sensor_columns:
            batch_stats[f'{col}_mean'] = df_batch[col].mean()
            batch_stats[f'{col}_max'] = df_batch[col].max()
            batch_stats[f'{col}_std'] = df_batch[col].std()

        aggregated_data.append(batch_stats)
    except FileNotFoundError:
        print(f"Warning: File {file_path} not found. Skipping batch {batch_id}.")

df_aggregated_sensors = pd.DataFrame(aggregated_data)
print("Aggregated sensor data successfully generated.")
print(df_aggregated_sensors.head())
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor

model = MultiOutputRegressor(RandomForestRegressor(n_estimators=200))

model.fit(X_train, y_train)
df_summary = pd.read_csv('Summary.csv')
df_batch_data = pd.read_csv('BatchData.csv')

df_merged_data = pd.merge(df_aggregated_sensors, df_summary, on='Batch_ID', how='left')
df_merged_data = pd.merge(df_merged_data, df_batch_data, on='Batch_ID', how='left')

print("Merged data successfully generated.")
print(df_merged_data.head())
golden_signature = X.mean()

print("Golden Signature:")
print(golden_signature)
import numpy as np

deviation = np.linalg.norm(X - golden_signature, axis=1)

df_merged_data['Deviation_From_Golden'] = deviation
threshold = deviation.mean() + 2 * deviation.std()

df_merged_data['Anomaly'] = df_merged_data['Deviation_From_Golden'] > threshold
df_merged_data['Energy_Pattern_Ratio'] = df_merged_data['Power_Consumption_kW_max'] / df_merged_data['Power_Consumption_kW_mean']

print("Generated 'Energy_Pattern_Ratio' feature.")
print(df_merged_data.head())
import matplotlib.pyplot as plt

plt.figure(figsize=(10,5))
plt.plot(df_merged_data['Deviation_From_Golden'], marker='o')
plt.axhline(threshold, color='red', linestyle='--')
plt.title("Batch Deviation from Golden Signature")
plt.xlabel("Batch Index")
plt.ylabel("Deviation Score")
plt.show()
y = df_merged_data['Hardness']
print("Missing values before imputation:")
print(df_merged_data.isnull().sum())

# Impute missing values with the median of each column
for col in df_merged_data.columns:
    if df_merged_data[col].isnull().any():
        if pd.api.types.is_numeric_dtype(df_merged_data[col]):
            df_merged_data[col].fillna(df_merged_data[col].median(), inplace=True)

print("\nMissing values after imputation:")
print(df_merged_data.isnull().sum())
target_columns = ['Hardness', 'Friability', 'Dissolution_Rate', 'Power_Consumption_kW_mean', 'Vibration_mm_s_mean']
y = df_merged_data[target_columns]

X = df_merged_data.drop(columns=['Batch_ID'] + target_columns)

print("Target variables (y) defined:")
print(y.head())
print("\nFeature variables (X) defined:")
print(X.head())
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Convert X_scaled back to a DataFrame for better readability and to preserve column names
X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

print("Feature data scaled successfully:")
print(X_scaled.head())
X = df_merged_data.drop(columns=[
    'Batch_ID',
    'Hardness',
    'Friability',
    'Dissolution_Rate',
    'Energy_Pattern_Ratio'
])

y = df_merged_data['Hardness']
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print("Data split into training and testing sets:")
print(f"X_train shape: {X_train.shape}")
print(f"X_test shape: {X_test.shape}")
print(f"y_train shape: {y_train.shape}")
print(f"y_test shape: {y_test.shape}")
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=400,
    max_depth=6,
    random_state=42
)

scores = cross_val_score(model, X, y, cv=5, scoring="r2")

print("R2 scores:", scores)
print("Average R2:", scores.mean())
df_numeric = df_merged_data.drop(columns=['Batch_ID'])

df_numeric.corr()['Hardness'].sort_values(ascending=False)
top_features = [
    'Energy_Pattern_Ratio',
    'Temperature_C_max',
    'Temperature_C_mean',
    'Vibration_mm_s_std',
    'Pressure_Bar_mean',
    'Process_Duration_Hours'
]

X = df_merged_data[top_features]
y = df_merged_data['Hardness']
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=500,
    max_depth=5,
    random_state=42
)

scores = cross_val_score(model, X, y, cv=5, scoring="r2")

print("R2 scores:", scores)
print("Average R2:", scores.mean())
print(y_train.shape)
print(type(y_train))
y = df_merged_data[['Hardness','Friability','Dissolution_Rate']]
y = df_merged_data['Hardness']
from sklearn.model_selection import train_test_split

X = df_merged_data[['Material_A_Quantity',
                    'Material_B_Quantity',
                    'Process_Duration_Hours']]

y = df_merged_data[['Hardness',
                    'Friability',
                    'Dissolution_Rate']]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor

xgb = XGBRegressor()

multi_output_model = MultiOutputRegressor(xgb)
multi_output_model.fit(X_train, y_train)

print("Model trained successfully")
y_pred = multi_output_model.predict(X_test)
y_pred = multi_output_model.predict(X_test)
from sklearn.metrics import mean_squared_error, r2_score

print("MSE:", mean_squared_error(y_test, y_pred))
print("R2:", r2_score(y_test, y_pred))
print(multi_output_model)
model.fit(X, y)
import pandas as pd
import matplotlib.pyplot as plt

importance = model.feature_importances_

feature_importance = pd.Series(importance, index=X.columns)

feature_importance.sort_values().plot(kind="barh", figsize=(8,6))

plt.title("Feature Importance")
plt.show()
y_pred = model.predict(X)
import matplotlib.pyplot as plt

plt.figure(figsize=(6,6))

plt.scatter(y, y_pred)

plt.plot(
    [y.min(), y.max()],
    [y.min(), y.max()],
    color="red"
)

plt.xlabel("Actual Hardness")
plt.ylabel("Predicted Hardness")
plt.title("Actual vs Predicted Hardness")

plt.show()

golden_signature = X.mean()

import numpy as np

deviation = np.linalg.norm(X - golden_signature, axis=1)

df_merged_data['Deviation_From_Golden'] = deviation
threshold = deviation.mean() + 2 * deviation.std()

df_merged_data['Anomaly'] = df_merged_data['Deviation_From_Golden'] > threshold

threshold = deviation.mean() + 2 * deviation.std()

df_merged_data['Anomaly'] = df_merged_data['Deviation_From_Golden'] > threshold
import matplotlib.pyplot as plt

plt.figure(figsize=(10,5))

plt.plot(df_merged_data['Deviation_From_Golden'], marker='o')

plt.axhline(
    threshold,
    color='red',
    linestyle='--',
    label='Anomaly Threshold'
)

plt.title("Batch Deviation from Golden Signature")
plt.xlabel("Batch Index")
plt.ylabel("Deviation Score")

plt.legend()

plt.show()

print(df_merged_data.columns)
import pandas as pd

df_process = pd.read_csv(
    "mock_batch_data/_h_batch_process_data.csv",
    encoding="latin1",
    sep=None,
    engine="python",
    on_bad_lines="skip"
)

df_production = pd.read_csv(
    "mock_batch_data/_h_batch_production_data.csv",
    encoding="latin1",
    sep=None,
    engine="python",
    on_bad_lines="skip"
)

print("Process data loaded:", df_process.shape)
print("Production data loaded:", df_production.shape)

print(df_process.head())
print(df_production.head())
import pandas as pd

df_process = pd.read_excel("mock_batch_data/_h_batch_process_data.csv")

df_production = pd.read_excel("mock_batch_data/_h_batch_production_data.csv")

print(df_process.head())
print(df_production.head())
print(df_process.columns)
print(df_production.columns)
df_merged_data = pd.merge(
    df_process,
    df_production,
    on="Batch_ID",
    how="inner"
)

print(df_merged_data.head())

list(df_merged_data.columns)
# FEATURES
X = df_merged_data.drop(columns=[
    'Batch_ID',
    'Phase',
    'Hardness',
    'Friability',
    'Dissolution_Rate',
    'Content_Uniformity'
])

# TARGETS
y = df_merged_data[['Hardness','Friability','Dissolution_Rate','Content_Uniformity']]
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor

model = MultiOutputRegressor(XGBRegressor())

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
from sklearn.metrics import mean_squared_error

print("MSE:", mean_squared_error(y_test, y_pred))

df_merged_data.columns = df_merged_data.columns.str.strip()
df_merged_data.columns = df_merged_data.columns.str.strip()
print(df_merged_data.columns)
df_merged_data.columns = df_merged_data.columns.str.strip()
for col in df_merged_data.columns:
    print(f"[{col}]")
df_merged_data.columns = df_merged_data.columns.str.strip()
print('Power_Consumption_kw' in df_merged_data.columns)
for col in df_merged_data.columns:
    if "Power" in col:
        print(col)
power_col = [c for c in df_merged_data.columns if "Power" in c][0]

df_merged_data['Power_Consumption_kW'] = (
    df_merged_data.groupby('Batch_ID')[power_col]
    .transform('mean')
)
print(df_merged_data.head())
df_merged_data['Power_Consumption_kW_mean'] = (
    df_merged_data
    .groupby('Batch_ID')['Power_Consumption_kw']
    .transform('mean')
)
print(df_merged_data.columns.tolist())
power_cols = [c for c in df_merged_data.columns if "Power" in c]
print(power_cols)
power_col = [c for c in df_merged_data.columns if "Power" in c][0]

df_merged_data['Power_Consumption_kW_mean'] = (
    df_merged_data.groupby('Batch_ID')[power_col]
    .transform('mean')
)
df_merged_data['Energy_Efficiency'] = (
    df_merged_data['Power_Consumption_kW_mean'] /
    (df_merged_data['Time_Minutes'] + 1e-6)
)
print(df_merged_data[['Power_Consumption_kW_mean','Energy_Efficiency']].head())
# Clean column names
df_merged_data.columns = df_merged_data.columns.str.strip()
# Detect power column automatically
power_col = [c for c in df_merged_data.columns if "Power" in c][0]

print("Detected Power Column:", power_col)
# Mean power consumption per batch
df_merged_data['Power_Consumption_kW_mean'] = (
    df_merged_data.groupby('Batch_ID')[power_col]
    .transform('mean')
)
df_merged_data['Energy_Efficiency'] = (
    df_merged_data['Power_Consumption_kW_mean'] /
    (df_merged_data['Time_Minutes'] + 1e-6)
)
X = df_merged_data.drop(columns=[
    'Batch_ID','Phase',
    'Hardness','Friability',
    'Dissolution_Rate','Content_Uniformity'
])

y = df_merged_data[['Hardness','Friability','Dissolution_Rate','Content_Uniformity']]
import joblib

joblib.dump(model, "ai_manufacturing_model.pkl")

# Carbon emission calculation
EMISSION_FACTOR = 0.82  # kg CO2 per kWh

df_merged_data['Carbon_Emission'] = (
    df_merged_data['Power_Consumption_kW'] * EMISSION_FACTOR
)
df_merged_data[['Power_Consumption_kW','Carbon_Emission']].head()

