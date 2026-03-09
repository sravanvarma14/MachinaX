from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

# Load trained model
model = joblib.load("ai_manufacturing_model.pkl")

@app.get("/")
def home():
    return {"message": "AI Manufacturing Model Running"}

@app.post("/predict")
def predict(data: dict):

    features = np.array([
        data["Time_Minutes"],
        data["Temperature_C"],
        data["Pressure_Bar"],
        data["Humidity_Percent"],
        data["Motor_Speed_RPM"],
        data["Compression_Force_kN"],
        data["Flow_Rate_LPM"],
        data["Power_Consumption_kw"],
        data["Vibration_mm_s"],
        data["Granulation_Time"],
        data["Binder_Amount"],
        data["Drying_Temp"],
        data["Drying_Time"],
        data["Compression_Force"],
        data["Machine_Speed"],
        data["Lubricant_Conc"],
        data["Moisture_Content"],
        data["Tablet_Weight"]
    ]).reshape(1, -1)

    prediction = model.predict(features)

    return {
        "Hardness": float(prediction[0][0]),
        "Friability": float(prediction[0][1]),
        "Dissolution_Rate": float(prediction[0][2]),
        "Content_Uniformity": float(prediction[0][3])
    }
