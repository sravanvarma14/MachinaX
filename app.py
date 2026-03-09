import streamlit as st
import joblib
import numpy as np

st.title("⚙️ MachinaX AI Manufacturing Intelligence")

model = joblib.load("ai_manufacturing_model.pkl")

st.header("Enter Machine Parameters")

Time_Minutes = st.number_input("Time Minutes")
Temperature_C = st.number_input("Temperature C")
Pressure_Bar = st.number_input("Pressure Bar")
Humidity_Percent = st.number_input("Humidity Percent")
Motor_Speed_RPM = st.number_input("Motor Speed RPM")
Compression_Force_kN = st.number_input("Compression Force kN")
Flow_Rate_LPM = st.number_input("Flow Rate LPM")
Power_Consumption_kw = st.number_input("Power Consumption kW")
Vibration_mm_s = st.number_input("Vibration mm/s")
Granulation_Time = st.number_input("Granulation Time")
Binder_Amount = st.number_input("Binder Amount")
Drying_Temp = st.number_input("Drying Temperature")
Drying_Time = st.number_input("Drying Time")
Compression_Force = st.number_input("Compression Force")
Machine_Speed = st.number_input("Machine Speed")
Lubricant_Conc = st.number_input("Lubricant Concentration")
Moisture_Content = st.number_input("Moisture Content")
Tablet_Weight = st.number_input("Tablet Weight")

if st.button("Predict"):

    features = np.array([[ 
        Time_Minutes, Temperature_C, Pressure_Bar, Humidity_Percent,
        Motor_Speed_RPM, Compression_Force_kN, Flow_Rate_LPM,
        Power_Consumption_kw, Vibration_mm_s, Granulation_Time,
        Binder_Amount, Drying_Temp, Drying_Time, Compression_Force,
        Machine_Speed, Lubricant_Conc, Moisture_Content, Tablet_Weight
    ]])

    prediction = model.predict(features)

    st.subheader("Prediction Results")

    st.write("Hardness:", prediction[0][0])
    st.write("Friability:", prediction[0][1])
    st.write("Dissolution Rate:", prediction[0][2])
    st.write("Content Uniformity:", prediction[0][3])
