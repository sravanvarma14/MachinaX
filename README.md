# MachinaX - AI Manufacturing Dashboard

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/new?repository=sravanvarma14/MachanaX&branch=main&main_module=manuf-ai-dashboard/app.py)

MachinaX is a premium AI-driven dashboard for manufacturing process monitoring, predictive analytics, and quality control. It provides real-time insights into production performance, equipment health, and quality outcomes.

## 🚀 Features

- **Real-time Monitoring**: Track vibration, power consumption, and environmental factors.
- **Predictive Analytics**: Forecasting quality outcomes and potential downtime.
- **Asset Health Scoring**: Comprehensive health metrics for manufacturing assets.
- **Carbon Footprint Analysis**: Energy efficiency and sustainability reporting.
- **Interactive UI**: A modern, responsive dashboard with rich visualizations.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Lucide Icons, Recharts
- **ML/Backend**: Python, FastAPI, XGBoost, Scikit-learn
- **Data Analysis**: Pandas, NumPy

## 📦 Project Structure

```text
├── manuf-ai-dashboard/   # React Frontend (Vite)
├── api.py                # Python API (FastAPI)
├── ai_manufacturing_model.pkl # Pre-trained ML Model
└── BatchData.csv         # Sample Manufacturing Data
```

## 🚥 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)

### Installation

1. **Frontend Setup**:
   ```bash
   cd manuf-ai-dashboard
   npm install
   npm run dev
   ```

2. **API Setup**:
   ```bash
   pip install fastapi uvicorn pandas scikit-learn
   python api.py
   ```

## 📄 License

This project is licensed under the MIT License.
