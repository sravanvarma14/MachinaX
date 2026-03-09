import streamlit as st
import pandas as pd
import joblib
import numpy as np
import plotly.express as px

st.set_page_config(page_title="AI Manufacturing Intelligence", layout="wide")

# Load the comprehensive model
@st.cache_resource
def load_model():
    return joblib.load("ai_manufacturing_model.pkl")

try:
    model = load_model()
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

st.title("🏭 AI-Driven Manufacturing Intelligence System")
st.markdown("Real-time Production Monitoring & Comprehensive Quality Prediction")

# Sidebar inputs
st.sidebar.header("Production Parameters")

material_a = st.sidebar.slider("Material A Quantity", 100.0, 500.0, 300.0)
material_b = st.sidebar.slider("Material B Quantity", 50.0, 300.0, 120.0)
duration = st.sidebar.slider("Process Duration (Hours)", 5.0, 30.0, 15.0)

# Prepare input
input_data = pd.DataFrame([{
    "Material_A_Quantity": material_a,
    "Material_B_Quantity": material_b,
    "Process_Duration_Hours": duration
}])

# Execute prediction
try:
    pred = model.predict(input_data)[0]
    
    # Model predictions (base logic from test_pred.py/api.py)
    hardness = float(pred[0])
    energy = float(pred[1])
    vibration = float(pred[2])
    
    # Derived features
    friability = float(0.5 + vibration * 0.1) 
    dissolution = float(90.0 + (hardness / 100))
    disintegration = float(12.0 - (energy / 50))
    uniformity = float(98.5 + (vibration * 1.5))
    
    # Carbon emission features
    energy_computed = float(hardness * 2.1)
    carbon = float(energy_computed * 0.82)
    
    st.subheader("Predicted Quality Outcomes")
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Hardness (kP)", f"{hardness:.2f}")
    col2.metric("Friability (%)", f"{friability:.4f}")
    col3.metric("Dissolution Rate (%)", f"{dissolution:.2f}")
    
    col4, col5, col6 = st.columns(3)
    col4.metric("Disintegration Time (min)", f"{disintegration:.2f}")
    col5.metric("Content Uniformity (%)", f"{uniformity:.2f}")
    col6.metric("Carbon Emission (kg CO₂e)", f"{carbon:.2f}")

    # Anomaly Detection for Hardness
    if hardness < 60:
        st.error("⚠️ Quality anomaly detected: Hardness too low!")
    else:
        st.success("Production within optimal range")
        
    st.subheader("AI Recommendation")
    if hardness < 70:
        st.warning("Increase material ratio or adjust process duration.")
    else:
        st.success("Process parameters optimized.")
        
except Exception as e:
    st.error(f"Prediction failed. Error: {str(e)}")

# Simulated production data
data = pd.DataFrame({
    "Time":range(10),
    "Energy":[np.random.uniform(50,100) for _ in range(10)],
    "Vibration":[np.random.uniform(0.2,1.0) for _ in range(10)],
    "Temperature":[np.random.uniform(60,120) for _ in range(10)]
})

st.subheader("📊 Real-Time Production Monitoring")

fig1 = px.line(data, x="Time", y="Energy", title="Energy Consumption")
fig2 = px.line(data, x="Time", y="Vibration", title="Machine Vibration")
fig3 = px.line(data, x="Time", y="Temperature", title="Process Temperature")

c1, c2, c3 = st.columns(3)

c1.plotly_chart(fig1, use_container_width=True)
c2.plotly_chart(fig2, use_container_width=True)
c3.plotly_chart(fig3, use_container_width=True)