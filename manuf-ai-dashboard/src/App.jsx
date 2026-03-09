import { useState, useEffect, useRef } from "react";
import logoUrl from "./assets/machinax_logo_user.jpg";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from "recharts";

// ─── REAL DATA FROM ML PIPELINE ─────────────────────────────
// ─── REAL DATA FROM ML PIPELINE ─────────────────────────────
const PHASES = [
  ...Array(12).fill("Preparation"),
  ...Array(7).fill("Granulation"),
  ...Array(12).fill("Drying"),
  ...Array(7).fill("Milling"),
  ...Array(10).fill("Blending"),
  ...Array(25).fill("Compression"),
  ...Array(9).fill("Coating"),
  ...Array(18).fill("Quality_Testing")
];
const ANOMALY_TIMES = [32, 33, 35, 50, 52];

const PHASE_DATA = {
  Preparation: { power_mean: 2.19, power_std: 0.57, vib_mean: 0.09, energy_total: 54.7, duration: 12, time_start: 0, time_end: 11, health: 98 },
  Granulation: { power_mean: 15.12, power_std: 1.04, vib_mean: 2.54, energy_total: 226.8, duration: 7, time_start: 12, time_end: 18, health: 92 },
  Drying: { power_mean: 24.21, power_std: 3.08, vib_mean: 1.82, energy_total: 605.2, duration: 12, time_start: 19, time_end: 30, health: 88 },
  Milling: { power_mean: 36.01, power_std: 5.24, vib_mean: 8.07, energy_total: 540.2, duration: 7, time_start: 31, time_end: 37, health: 61 },
  Blending: { power_mean: 12.53, power_std: 2.15, vib_mean: 3.17, energy_total: 275.6, duration: 10, time_start: 38, time_end: 47, health: 85 },
  Compression: { power_mean: 44.65, power_std: 6.55, vib_mean: 5.34, energy_total: 2321.6, duration: 25, time_start: 48, time_end: 72, health: 79 },
  Coating: { power_mean: 20.19, power_std: 3.64, vib_mean: 2.06, energy_total: 403.8, duration: 9, time_start: 73, time_end: 81, health: 91 },
  Quality_Testing: { power_mean: 4.77, power_std: 0.91, vib_mean: 0.49, energy_total: 176.6, duration: 18, time_start: 82, time_end: 99, health: 96 },
};

const MODEL_METRICS = {
  Hardness: { r2: 0.998, mape: 1.11, accuracy: 98.9 },
  Friability: { r2: 0.997, mape: 1.53, accuracy: 98.5 },
  Disintegration_Time: { r2: 0.999, mape: 1.32, accuracy: 98.7 },
  Dissolution_Rate: { r2: 0.996, mape: 0.24, accuracy: 99.8 },
  Content_Uniformity: { r2: 0.997, mape: 0.14, accuracy: 99.9 },
};

const CV_RESULTS = { ridge_r2: 0.9775, rf_r2: 0.9837, gb_r2: 0.9849 };

const PROD_DATA = {
  Batch_ID: Array.from({ length: 60 }, (_, i) => `T${String(i + 1).padStart(3, '0')}`),
  Hardness: [95, 110, 85, 72, 125, 92, 102, 65, 108, 78, 88, 115, 70, 98, 105, 82, 118, 68, 112, 90, 75, 128, 95, 103, 87, 120, 73, 109, 83, 96, 115, 79, 106, 92, 125, 70, 98, 88, 112, 85, 102, 95, 108, 76, 92, 118, 84, 105, 91, 97, 110, 80, 122, 88, 93, 102, 115, 78, 108, 95],
  Dissolution_Rate: [89.3, 87.9, 91.5, 93.8, 85.1, 88.7, 86.4, 95.7, 88.9, 92.3, 90.1, 86.8, 94.2, 88.3, 87.1, 91.8, 85.6, 94.9, 86.7, 90.4, 93.2, 84.5, 89.1, 87.3, 91.6, 85.9, 93.5, 87.8, 91.9, 89.5, 86.2, 92.8, 88.1, 90.6, 84.8, 94.5, 89.3, 91.2, 86.5, 92.1, 88.7, 89.9, 87.4, 93.8, 90.2, 85.7, 92.4, 88.6, 90.8, 89.1, 87.3, 93.2, 85.1, 91.5, 90.4, 88.2, 86.6, 92.9, 87.7, 89.8],
  Content_Uniformity: [98.7, 101.2, 97.3, 95.9, 103.5, 99.1, 100.4, 94.8, 101.6, 97.8, 99.3, 102.1, 95.5, 100.2, 101.8, 97.4, 103.2, 94.9, 102.7, 99.6, 96.2, 104.1, 99.0, 100.8, 98.2, 102.8, 96.5, 101.3, 98.0, 100.1, 102.5, 96.8, 101.1, 99.7, 103.9, 95.3, 100.2, 99.4, 102.1, 97.6, 100.8, 99.2, 101.4, 96.4, 99.9, 102.7, 98.1, 100.6, 99.5, 100.3, 101.8, 97.2, 103.6, 98.9, 99.8, 100.7, 102.4, 96.7, 101.5, 99.6],
  Compression_Force: [12.5, 15.0, 10.8, 8.5, 16.2, 12.1, 13.8, 6.2, 14.9, 9.3, 11.5, 15.8, 7.4, 12.8, 14.2, 10.2, 16.5, 7.1, 15.3, 11.0, 8.8, 17.2, 12.3, 13.5, 11.2, 16.1, 8.1, 14.6, 10.5, 12.4, 15.5, 9.0, 14.0, 11.8, 17.0, 7.8, 12.7, 11.3, 15.1, 10.6, 13.7, 12.3, 14.5, 9.2, 11.9, 15.9, 10.1, 13.9, 11.7, 12.5, 14.8, 9.5, 16.8, 11.4, 12.2, 13.8, 15.2, 9.7, 14.6, 12.1],
  Moisture_Content: [2.1, 2.8, 1.9, 1.5, 3.2, 2.2, 2.5, 0.8, 2.7, 1.7, 2.0, 2.9, 1.2, 2.3, 2.6, 1.8, 3.1, 1.1, 2.8, 2.1, 1.4, 3.4, 2.2, 2.5, 2.0, 3.0, 1.3, 2.6, 1.8, 2.2, 2.9, 1.5, 2.6, 2.1, 3.3, 1.2, 2.3, 2.0, 2.8, 1.9, 2.5, 2.2, 2.7, 1.6, 2.1, 3.0, 1.8, 2.5, 2.0, 2.2, 2.7, 1.7, 3.2, 2.0, 2.2, 2.5, 2.8, 1.7, 2.6, 2.2],
  Binder_Amount: [8.5, 7.0, 9.2, 10.0, 6.5, 8.8, 8.1, 11.2, 7.4, 9.8, 8.9, 7.2, 10.8, 8.5, 7.8, 9.4, 6.8, 11.0, 7.3, 8.9, 10.3, 6.2, 8.7, 7.9, 9.1, 7.0, 10.6, 7.6, 9.5, 8.8, 7.3, 10.2, 7.8, 9.0, 6.4, 11.0, 8.6, 9.0, 7.4, 9.5, 8.0, 8.8, 7.7, 10.4, 8.9, 7.1, 9.6, 8.1, 9.0, 8.7, 7.5, 10.0, 6.6, 9.2, 8.8, 8.2, 7.4, 10.1, 7.8, 8.9],
};

const FEATURE_IMPORTANCE = {
  Binder_Amount: 17.6, Moisture_Content: 15.8, Compression_Force: 14.3,
  Machine_Speed: 13.2, Granulation_Time: 12.2, Drying_Time: 9.8,
  Lubricant_Conc: 8.1, Drying_Temp: 4.9, Tablet_Weight: 4.1
};

// ─── PHASE COLORS ────────────────────────────────────────────
const PHASE_COLORS = {
  Preparation: "#64748b", Granulation: "#3b82f6", Drying: "#f97316",
  Milling: "#ef4444", Blending: "#8b5cf6", Compression: "#ec4899",
  Coating: "#06b6d4", Quality_Testing: "#10b981"
};

const PHASE_ABBREV = {
  Preparation: "PREP", Granulation: "GRAN", Drying: "DRY",
  Milling: "MILL", Blending: "BLEND", Compression: "COMP",
  Coating: "COAT", Quality_Testing: "QT"
};

// ─── UTILS ───────────────────────────────────────────────────
const getPhaseColor = t => PHASE_COLORS[PHASES[t]] || "#64748b";

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const HEALTH_COLOR = s => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : s >= 40 ? "#f97316" : "#ef4444";
const HEALTH_STATUS = s => s >= 80 ? "HEALTHY" : s >= 60 ? "MONITOR" : s >= 40 ? "CAUTION" : "CRITICAL";

// ─── MINI COMPONENTS ─────────────────────────────────────────
function KpiCard({ label, value, unit, sub, accent = "#3b82f6", icon }) {
  return (
    <div style={{ background: "#0f172a", border: `1px solid ${accent}22`, borderTop: `2px solid ${accent}`, borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Mono',monospace", lineHeight: 1 }}>
        {value}<span style={{ fontSize: 13, color: accent, marginLeft: 4, fontWeight: 400 }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}


function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 4, height: 24, background: "linear-gradient(180deg,#3b82f6,#8b5cf6)", borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e8f0", letterSpacing: 0.5 }}>{children}</h2>
    </div>
  );
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────
function CustomTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>t={label} min · {PHASES[label]}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong> {p.name === "Power" ? "kW" : "mm/s"}
        </div>
      ))}
      {ANOMALY_TIMES.includes(label) && (
        <div style={{ color: "#ef4444", marginTop: 6, fontWeight: 700 }}>⚠ ANOMALY DETECTED</div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────
export default function TrackADashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPhase, setSelectedPhase] = useState("Compression");
  const [predInput, setPredInput] = useState({
    Material_A_Quantity: 300,
    Material_B_Quantity: 120,
    Process_Duration_Hours: 15
  });
  const [predResult, setPredResult] = useState(null);
  const [ticker, setTicker] = useState(0);

  // New states for AI Insights
  const [aiInsight, setAiInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const fetchAiInsight = async () => {
    setIsLoadingInsight(true);
    setAiInsight(null);
    try {
      const response = await fetch("http://localhost:8000/api/generate_insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Phase: selectedPhase,
          Power: PHASE_DATA[selectedPhase].power_mean,
          Vibration: PHASE_DATA[selectedPhase].vib_mean,
          Health: PHASE_DATA[selectedPhase].health
        })
      });
      const data = await response.json();
      setAiInsight(data.insight);
    } catch (err) {
      console.error(err);
      setAiInsight("Error connecting to Gemini API logic.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // New states for real API data
  const [fetchedHistoricalData, setFetchedHistoricalData] = useState(null);
  const [fetchedLiveData, setFetchedLiveData] = useState(null);
  const [fetchedKPIs, setFetchedKPIs] = useState(null);

  // Simulate live feed & grab actual data from FASTAPI
  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 2000);

    const loadRealData = async () => {
      try {
        const histRes = await fetch("http://localhost:8000/api/historical_batches");
        const histData = await histRes.json();
        setFetchedHistoricalData(histData);

        const liveRes = await fetch("http://localhost:8000/api/live_batch");
        const liveData = await liveRes.json();
        setFetchedLiveData(liveData);

        const kpiRes = await fetch("http://localhost:8000/api/aggregate_kpis");
        const kpiData = await kpiRes.json();
        setFetchedKPIs(kpiData);
      } catch (err) {
        console.error("Failed fetching live/historical data", err);
      }
    };

    loadRealData();

    return () => clearInterval(id);
  }, []);

  // Integrate with FastAPI backend for prediction
  const runPrediction = async () => {
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Material_A_Quantity: Number(predInput.Material_A_Quantity),
          Material_B_Quantity: Number(predInput.Material_B_Quantity),
          Process_Duration_Hours: Number(predInput.Process_Duration_Hours)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPredResult({
        Hardness: data.Hardness.toFixed(1),
        Friability: data.Friability.toFixed(3),
        Dissolution_Rate: data.Dissolution_Rate.toFixed(1),
        Disintegration_Time: data.Disintegration_Time.toFixed(1),
        Content_Uniformity: data.Content_Uniformity.toFixed(1),
        Carbon_Emission: data.Carbon_Emission.toFixed(1)
      });
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Failed to connect to the prediction API. Ensure the backend is running at http://localhost:8000.");
    }
  };

  // Build time-series data
  const tsData = fetchedLiveData ? fetchedLiveData.Time.map((t, i) => ({
    t: i,
    power: +(fetchedLiveData.Power[i]).toFixed(2),
    vib: +(fetchedLiveData.Vib[i]).toFixed(2),
    phase: PHASES[i] || "Unknown",
    isAnomaly: ANOMALY_TIMES.includes(i)
  })) : [];

  // Phase energy bars
  const energyBars = Object.entries(PHASE_DATA).map(([name, d]) => ({
    name: PHASE_ABBREV[name], full: name,
    energy: d.energy_total, pct: (d.energy_total / 4604.3 * 100).toFixed(1),
    carbon: (d.energy_total * 0.82).toFixed(0)
  }));

  // Feature importance bars
  const fiBars = Object.entries(FEATURE_IMPORTANCE)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ name: k.replace('_', ' '), value: v }));

  // Model CV radar
  const radarData = Object.entries(MODEL_METRICS).map(([k, v]) => ({
    target: k.replace('_', ' ').replace('Content Uniformity', 'C.U.'),
    r2_pct: (v.r2 * 100).toFixed(1),
    accuracy: v.accuracy,
  }));

  // Scatter: Compression Force vs Hardness
  const scatterData = (fetchedHistoricalData && fetchedHistoricalData.Compression_Force) ? fetchedHistoricalData.Compression_Force.map((cf, i) => ({
    cf: cf || 0,
    hardness: fetchedHistoricalData.Hardness[i] || 0,
    diss: fetchedHistoricalData.Dissolution_Rate[i] || 0,
    moisture: fetchedHistoricalData.Moisture_Content ? fetchedHistoricalData.Moisture_Content[i] || 0 : 0
  })) : [];

  // CUSUM for Compression phase power
  const compPower = tsData.filter(d => d.phase === "Compression").map(d => d.power);
  const compMean = compPower.length > 0 ? compPower.reduce((a, b) => a + b, 0) / compPower.length : 0;
  const compStd = compPower.length > 0 ? Math.sqrt(compPower.reduce((a, b) => a + (b - compMean) ** 2, 0) / compPower.length) : 0;
  let cp = 0, cn = 0;
  const cusumData = (compStd > 0 && compPower.length > 0) ? compPower.map((v, i) => {
    cp = Math.max(0, cp + (v - compMean) / compStd - 0.5);
    cn = Math.max(0, cn - (v - compMean) / compStd - 0.5);
    return { i, power: v, cusum_pos: +cp.toFixed(2), cusum_neg: +cn.toFixed(2) };
  }) : [];

  // Current live sim
  const liveT = fetchedLiveData ? ticker % fetchedLiveData.Phase_Count : 0;
  const livePower = fetchedLiveData ? fetchedLiveData.Power[liveT] : 0;
  const liveVib = fetchedLiveData ? fetchedLiveData.Vib[liveT] : 0;
  const livePhase = PHASES[liveT] || "Unknown";
  const isLiveAnomaly = ANOMALY_TIMES.includes(liveT);
  const health = PHASE_DATA[selectedPhase]?.health || 90;

  const NAV = [
    { id: "overview", label: "Overview" },
    { id: "timeseries", label: "Energy Patterns" },
    { id: "prediction", label: "Quality Prediction" },
    { id: "asset", label: "Asset Health" },
    { id: "carbon", label: "Carbon Analytics" },
    { id: "streamlit", label: "Legacy Dashboard" }
  ];

  const tabStyle = id => ({
    padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: activeTab === id ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "transparent",
    color: activeTab === id ? "#fff" : "#64748b",
    transition: "all 0.2s"
  });

  return (
    <div style={{ background: "#050d1a", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: "#e2e8f0", padding: 0 }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f172a 50%,#0a1628 100%)", borderBottom: "1px solid #1e293b", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoUrl} alt="MachinaX Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: "1px solid #3b82f644" }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MachinaX
            </div>
            <div style={{ fontSize: 12, fontFamily: "'Vidaloka', serif", color: "#94a3b8", fontStyle: "italic", letterSpacing: 1.5, marginTop: 2 }}>
              Predict · Optimize · Perform
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 1 }}>LIVE BATCH</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", fontFamily: "'Space Mono',monospace" }}>T001 · t={liveT}min</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: isLiveAnomaly ? "#7f1d1d22" : "#0f2318", border: `1px solid ${isLiveAnomaly ? "#ef4444" : "#10b981"}44`, borderRadius: 8, padding: "6px 14px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isLiveAnomaly ? "#ef4444" : "#10b981", boxShadow: `0 0 8px ${isLiveAnomaly ? "#ef4444" : "#10b981"}` }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isLiveAnomaly ? "#ef4444" : "#10b981" }}>{isLiveAnomaly ? "ANOMALY" : "NOMINAL"}</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ background: "#0a1628", borderBottom: "1px solid #1e293b", padding: "0 32px", display: "flex", gap: 4 }}>
        {NAV.map(n => (
          <button key={n.id} style={tabStyle(n.id)} onClick={() => setActiveTab(n.id)}>{n.label}</button>
        ))}
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1600, margin: "0 auto" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <KpiCard
                label="Active Phase"
                value={livePhase}
                sub={`t=${liveT} min`}
                accent="#3b82f6"
              />
              <KpiCard
                label="Current Power"
                value={livePower.toFixed(1)}
                unit="kW"
                sub={fetchedKPIs ? `Sector Avg: ${fetchedKPIs.Global_Power_Mean.toFixed(1)} kW` : "Loading..."}
                accent="#f59e0b"
              />
              <KpiCard
                label="Machine Vibration"
                value={liveVib.toFixed(2)}
                unit="mm/s"
                sub={fetchedKPIs ? `Floor Avg: ${fetchedKPIs.Global_Vib_Mean.toFixed(2)} mm/s` : "Loading..."}
                accent={liveVib > 5 ? "#ef4444" : "#10b981"}
              />
              <KpiCard
                label="Total Batch Energy"
                value={fetchedKPIs ? fetchedKPIs.Total_Energy_kWh.toLocaleString() : "..."}
                unit="kWh"
                sub="Aggregated from 60 batches"
                accent="#8b5cf6"
              />
              <KpiCard
                label="Production Rate"
                value="142"
                unit="kg/h"
                sub="Nominal yield speed"
                accent="#14b8a6"
              />
            </div>

            {/* Phase energy + model summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Phase Energy Distribution (kWh)</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={energyBars} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip content={({ active, payload }) => active && payload?.length ? (
                      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                        <div style={{ color: "#94a3b8", marginBottom: 4 }}>{payload[0]?.payload?.full}</div>
                        <div style={{ color: "#60a5fa" }}>Energy: {payload[0]?.value?.toFixed(1)} kWh</div>
                        <div style={{ color: "#ef4444" }}>Carbon: {payload[0]?.payload?.carbon} kg CO₂e</div>
                        <div style={{ color: "#94a3b8" }}>{payload[0]?.payload?.pct}% of total</div>
                      </div>
                    ) : null} />
                    <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                      {energyBars.map((e, i) => (
                        <Cell key={i} fill={PHASE_COLORS[e.full]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Multi-Target Model Performance</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  {Object.entries(MODEL_METRICS).map(([target, m]) => (
                    <div key={target} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 12, color: "#94a3b8", width: 180, flexShrink: 0 }}>{target.replace(/_/g, " ")}</div>
                      <div style={{ flex: 1, height: 20, background: "#1e293b", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                        <div style={{
                          width: `${m.accuracy}%`, height: "100%",
                          background: `linear-gradient(90deg,#3b82f6,#10b981)`,
                          borderRadius: 4, transition: "width 0.8s ease"
                        }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", width: 50, textAlign: "right", fontFamily: "'Space Mono',monospace" }}>{m.accuracy}%</div>
                      <div style={{ fontSize: 11, color: "#475569", width: 60, textAlign: "right" }}>R²={m.r2}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1e293b", display: "flex", gap: 16, justifyContent: "center" }}>
                  {Object.entries(CV_RESULTS).map(([k, v]) => (
                    <div key={k} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa", fontFamily: "'Space Mono',monospace" }}>{v.toFixed(4)}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{k.replace('_r2', '').replace('_', ' ').toUpperCase()} CV R²</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset health row */}
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
              <SectionTitle>Asset Health Scores by Phase</SectionTitle>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {Object.entries(PHASE_DATA).map(([phase, d]) => {
                  const h = d.health;
                  const col = HEALTH_COLOR(h);
                  const circumference = 2 * Math.PI * 22;
                  const offset = circumference - (h / 100) * circumference;
                  return (
                    <div key={phase} onClick={() => { setSelectedPhase(phase); setActiveTab("asset"); }}
                      style={{ flex: 1, minWidth: 100, background: "#0f172a", border: `1px solid ${col}22`, borderRadius: 10, padding: "16px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", ':hover': { transform: "translateY(-2px)" } }}>
                      <svg width={56} height={56} style={{ margin: "0 auto 8px" }}>
                        <circle cx={28} cy={28} r={22} fill="none" stroke="#1e293b" strokeWidth={4} />
                        <circle cx={28} cy={28} r={22} fill="none" stroke={col} strokeWidth={4}
                          strokeDasharray={circumference} strokeDashoffset={offset}
                          strokeLinecap="round" transform="rotate(-90 28 28)"
                          style={{ transition: "stroke-dashoffset 1s ease" }} />
                        <text x={28} y={33} textAnchor="middle" fill={col} fontSize={12} fontWeight={700}>{h}</text>
                      </svg>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{PHASE_ABBREV[phase]}</div>
                      <div style={{ fontSize: 10, color: col, fontWeight: 700 }}>{HEALTH_STATUS(h)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ENERGY PATTERNS ── */}
        {activeTab === "timeseries" && (
          <div>
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <SectionTitle>Real-Time Power & Vibration Signatures (Batch T001 — 211 minutes)</SectionTitle>
              {/* Phase bands */}
              <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
                {Object.entries(PHASE_DATA).map(([phase, d]) => (
                  <div key={phase} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: PHASE_COLORS[phase] }} />
                    {PHASE_ABBREV[phase]}({d.time_start}-{d.time_end})
                  </div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#ef4444" }}>
                  <div style={{ width: 10, height: 3, background: "#ef4444" }} />⚠ Anomaly
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={tsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Time (min)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }} />
                  <YAxis yAxisId="l" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Power (kW)", angle: -90, position: "insideLeft", fill: "#60a5fa", fontSize: 11 }} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Vib (mm/s)", angle: 90, position: "insideRight", fill: "#f97316", fontSize: 11 }} />
                  <Tooltip content={<CustomTip />} />
                  {/* Phase background references */}
                  <ReferenceLine yAxisId="l" x={25} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={40} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={65} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={80} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={102} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={154} stroke="#1e293b" strokeDasharray="4 2" />
                  <ReferenceLine yAxisId="l" x={174} stroke="#1e293b" strokeDasharray="4 2" />
                  {/* Anomaly markers */}
                  {ANOMALY_TIMES.map(t => (
                    <ReferenceLine key={t} yAxisId="l" x={t} stroke="#ef444444" strokeWidth={2} />
                  ))}
                  <Line yAxisId="l" type="monotone" dataKey="power" name="Power" stroke="#3b82f6" dot={false} strokeWidth={1.5} />
                  <Line yAxisId="r" type="monotone" dataKey="vib" name="Vibration" stroke="#f97316" dot={false} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Phase-level stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Vibration/Power Ratio by Phase (Asset Signature)</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(PHASE_DATA).map(([phase, d]) => {
                    const ratio = (d.vib_mean / d.power_mean * 100).toFixed(1);
                    const isHigh = d.vib_mean / d.power_mean > 0.20;
                    return (
                      <div key={phase} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 4, height: 32, borderRadius: 2, background: PHASE_COLORS[phase] }} />
                        <div style={{ width: 120, fontSize: 12, color: "#94a3b8" }}>{PHASE_ABBREV[phase]}</div>
                        <div style={{ flex: 1, height: 16, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{
                            width: `${Math.min(parseFloat(ratio), 30) / 30 * 100}%`, height: "100%",
                            background: isHigh ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#3b82f6,#10b981)",
                            borderRadius: 3
                          }} />
                        </div>
                        <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: isHigh ? "#ef4444" : "#10b981", fontFamily: "'Space Mono',monospace", textAlign: "right" }}>{ratio}</div>
                        {isHigh && <div style={{ fontSize: 10, color: "#ef4444" }}>⚠ HIGH</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>CUSUM Control — Compression Phase Power</SectionTitle>
                <div style={{ marginBottom: 8, fontSize: 12, color: "#64748b" }}>Detects sustained process shift · Alarm threshold h=5σ</div>
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={cusumData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="i" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Timestep", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }} />
                    <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="6 3" label={{ value: "ALARM", fill: "#ef4444", fontSize: 10 }} />
                    <Line type="monotone" dataKey="cusum_pos" name="CUSUM+" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="cusum_neg" name="CUSUM-" stroke="#f59e0b" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="power" name="Power" stroke="#475569" dot={false} strokeWidth={1} strokeDasharray="2 2" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anomaly table */}
            <div style={{ background: "#0a1628", border: "1px solid #7f1d1d44", borderRadius: 12, padding: 24 }}>
              <SectionTitle>Detected Anomalies — Isolation Forest + Z-Score</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
                {ANOMALY_TIMES.map(t => {
                  const phase = PHASES[t];
                  const pw = fetchedLiveData ? fetchedLiveData.Power[t] : 0;
                  const vb = fetchedLiveData ? fetchedLiveData.Vib[t] : 0;
                  const reason = phase === "Milling" ? "HIGH VIB (bearings)" : "HIGH POWER (punch wear)";
                  return (
                    <div key={t} style={{ background: "#7f1d1d18", border: "1px solid #ef444433", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>t={t} min</span>
                        <span style={{ fontSize: 10, color: PHASE_COLORS[phase], background: `${PHASE_COLORS[phase]}22`, padding: "1px 6px", borderRadius: 4 }}>{PHASE_ABBREV[phase]}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>⚡ {pw ? pw.toFixed(1) : 0} kW · 〰 {vb ? vb.toFixed(2) : 0} mm/s</div>
                      <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4 }}>→ {reason}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── QUALITY PREDICTION ── */}
        {activeTab === "prediction" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              {/* Input sliders */}
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Process Parameter Inputs</SectionTitle>
                {[
                  { key: "Material_A_Quantity", label: "Material A Quantity", unit: "", min: 100, max: 500, step: 1 },
                  { key: "Material_B_Quantity", label: "Material B Quantity", unit: "", min: 50, max: 300, step: 1 },
                  { key: "Process_Duration_Hours", label: "Process Duration", unit: "Hours", min: 5, max: 30, step: 1 },
                ].map(({ key, label, unit, min, max, step }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", fontFamily: "'Space Mono',monospace" }}>{predInput[key]} {unit}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={predInput[key]}
                      onChange={e => setPredInput(p => ({ ...p, [key]: parseFloat(e.target.value) }))}
                      style={{ width: "100%", accentColor: "#3b82f6" }} />
                  </div>
                ))}
                <button onClick={runPrediction}
                  style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8, letterSpacing: 0.5 }}>
                  ▶ RUN PREDICTION
                </button>
              </div>

              {/* Prediction output */}
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Predicted Quality Outcomes</SectionTitle>
                {predResult ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { key: "Hardness", label: "Hardness", unit: "kP", spec: [40, 150], good: "HIGH" },
                      { key: "Friability", label: "Friability", unit: "%", spec: [0, 15.0], good: "LOW" },
                      { key: "Dissolution_Rate", label: "Dissolution Rate", unit: "%", spec: [80, 100], good: "HIGH" },
                      { key: "Disintegration_Time", label: "Disintegration Time", unit: "min", spec: [0, 20], good: "LOW" },
                      { key: "Content_Uniformity", label: "Content Uniformity", unit: "%", spec: [90, 250], good: "MID" },
                      { key: "Carbon_Emission", label: "Carbon Emission", unit: "kg CO₂e", spec: [50, 300], good: "LOW" },
                    ].map(({ key, label, unit, spec, good }) => {
                      const val = parseFloat(predResult[key]);
                      let inSpec, color;
                      if (good === "HIGH") { inSpec = val >= spec[0] && val <= spec[1]; }
                      else if (good === "LOW") { inSpec = val <= spec[1]; }
                      else { inSpec = val >= spec[0] && val <= spec[1]; }
                      color = inSpec ? "#10b981" : "#ef4444";
                      const pct = good === "HIGH" ? clamp((val - spec[0]) / (spec[1] - spec[0]) * 100, 0, 100)
                        : good === "LOW" ? clamp((1 - val / spec[1]) * 100, 0, 100)
                          : clamp(50 - Math.abs((val - (spec[0] + spec[1]) / 2) / (spec[1] - spec[0]) * 100), 0, 100);
                      return (
                        <div key={key}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Space Mono',monospace" }}>{val} {unit}</span>
                              <span style={{ fontSize: 10, color, background: `${color}22`, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{inSpec ? "IN SPEC" : "OUT OF SPEC"}</span>
                            </div>
                          </div>
                          <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color}88,${color})`, borderRadius: 4, transition: "width 0.6s ease" }} />
                          </div>
                          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Spec: {spec[0]}–{spec[1]} {unit}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "#475569", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⚗</div>
                    <div style={{ fontSize: 14 }}>Adjust parameters and click</div>
                    <div style={{ fontSize: 14, color: "#60a5fa", fontWeight: 600 }}>RUN PREDICTION</div>
                    <div style={{ fontSize: 12, marginTop: 8 }}>to predict quality outcomes</div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature importance + scatter */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Feature Importance (Random Forest — Hardness)</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={fiBars} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} width={130} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }} formatter={v => [`${v}%`, "Importance"]} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {fiBars.map((_, i) => (
                        <Cell key={i} fill={`hsl(${220 + i * 15},80%,${65 - i * 4}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Compression Force vs Hardness (60 Batches)</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="cf" name="Compression Force" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Compression Force (kN)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }} />
                    <YAxis dataKey="hardness" name="Hardness" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Hardness (kP)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }}
                      formatter={(v, n) => [v, n === "cf" ? "Comp. Force (kN)" : "Hardness (kP)"]} />
                    <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── ASSET HEALTH ── */}
        {activeTab === "asset" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {Object.entries(PHASE_DATA).map(([phase, d]) => {
                const h = d.health, col = HEALTH_COLOR(h);
                return (
                  <button key={phase} onClick={() => setSelectedPhase(phase)}
                    style={{
                      padding: "10px 16px", borderRadius: 8, border: `1px solid ${selectedPhase === phase ? col : "#1e293b"}`,
                      background: selectedPhase === phase ? `${col}22` : "#0a1628", color: selectedPhase === phase ? col : "#64748b",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s"
                    }}>
                    {PHASE_ABBREV[phase]} · {h}
                  </button>
                );
              })}
            </div>

            {selectedPhase && PHASE_DATA[selectedPhase] && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
                  {[
                    { l: "Avg Power", v: PHASE_DATA[selectedPhase].power_mean.toFixed(1), u: "kW", a: "#3b82f6" },
                    { l: "Avg Vibration", v: PHASE_DATA[selectedPhase].vib_mean.toFixed(2), u: "mm/s", a: "#f97316" },
                    { l: "Phase Energy", v: PHASE_DATA[selectedPhase].energy_total.toFixed(0), u: "kWh", a: "#8b5cf6" },
                    { l: "Health Score", v: PHASE_DATA[selectedPhase].health, u: "/100", a: HEALTH_COLOR(PHASE_DATA[selectedPhase].health) },
                  ].map((k, i) => <KpiCard key={i} label={k.l} value={k.v} unit={k.u} accent={k.a} />)}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                    <SectionTitle>{selectedPhase} — Power Timeline</SectionTitle>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={tsData.filter(d => d.phase === selectedPhase)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }} />
                        <ReferenceLine y={PHASE_DATA[selectedPhase].power_mean} stroke="#10b981" strokeDasharray="4 2" label={{ value: "mean", fill: "#10b981", fontSize: 10 }} />
                        <Area type="monotone" dataKey="power" name="Power (kW)" stroke="#3b82f6" fill="url(#powerGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                    <SectionTitle>{selectedPhase} — Vibration Timeline</SectionTitle>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={tsData.filter(d => d.phase === selectedPhase)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }} />
                        <ReferenceLine y={PHASE_DATA[selectedPhase].vib_mean} stroke="#10b981" strokeDasharray="4 2" label={{ value: "mean", fill: "#10b981", fontSize: 10 }} />
                        {selectedPhase === "Milling" && <ReferenceLine y={11.5} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "alarm", fill: "#ef4444", fontSize: 10 }} />}
                        <Area type="monotone" dataKey="vib" name="Vibration (mm/s)" stroke="#f97316" fill="url(#vibGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Maintenance recommendation */}
                <div style={{ background: "#0a1628", border: `1px solid ${HEALTH_COLOR(health)}33`, borderRadius: 12, padding: 24 }}>
                  <SectionTitle>Maintenance Intelligence — {selectedPhase}</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#0f172a", borderRadius: 8, padding: 16 }}>
                      <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 8 }}>HEALTH STATUS</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: HEALTH_COLOR(health), fontFamily: "'Space Mono',monospace" }}>{health}/100</div>
                      <div style={{ fontSize: 13, color: HEALTH_COLOR(health), marginTop: 4, fontWeight: 600 }}>{HEALTH_STATUS(health)}</div>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 8, padding: 16 }}>
                      <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 8 }}>VIB/POWER RATIO</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "#f97316", fontFamily: "'Space Mono',monospace" }}>
                        {(PHASE_DATA[selectedPhase].vib_mean / PHASE_DATA[selectedPhase].power_mean).toFixed(3)}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>mm/s per kW · asset signature</div>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 8, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>AI INSIGHT (GEMINI)</div>
                        <button onClick={fetchAiInsight} disabled={isLoadingInsight} style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", borderRadius: 4, color: "#fff", fontSize: 10, padding: "4px 8px", cursor: isLoadingInsight ? "wait" : "pointer", fontWeight: "bold" }}>
                          {isLoadingInsight ? "ANALYZING..." : "GENERATE"}
                        </button>
                      </div>
                      <div style={{ fontSize: 12, color: aiInsight && aiInsight.includes("Error") ? "#ef4444" : "#e2e8f0", fontWeight: 500, lineHeight: 1.5 }}>
                        {aiInsight ? aiInsight : "Click 'Generate' to get real-time recommendations from Google Gemini."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CARBON ANALYTICS ── */}
        {activeTab === "carbon" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <KpiCard label="Batch Carbon" value="3,776" unit="kg CO₂e" sub="Batch T001 · India grid 0.82 kg/kWh" accent="#ef4444" />
              <KpiCard label="Q1-2026 Target" value="3,586" unit="kg CO₂e" sub="5% annual reduction applied" accent="#f59e0b" />
              <KpiCard label="Target Gap" value="+190" unit="kg" sub="189.7 kg above Q1 target" accent="#f97316" />
              <KpiCard label="Compression Share" value="50.4" unit="%" sub="2,321 kWh — highest phase" accent="#ec4899" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Phase Carbon Attribution (kg CO₂e)</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Object.entries(PHASE_DATA).map(([n, d]) => ({
                    name: PHASE_ABBREV[n], full: n,
                    carbon: parseFloat((d.energy_total * 0.82).toFixed(1)),
                    pct: parseFloat((d.energy_total / 4604.3 * 100).toFixed(1))
                  }))} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 12 }}
                      formatter={(v, _, p) => [`${v} kg CO₂e (${p.payload.pct}%)`, p.payload.full]} />
                    <Bar dataKey="carbon" name="Carbon" radius={[4, 4, 0, 0]}>
                      {Object.entries(PHASE_DATA).map(([n], i) => (
                        <Cell key={i} fill={PHASE_COLORS[n]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SectionTitle>Reduction Opportunity Analysis</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {[
                    { phase: "Compression", cv: 14.7, saving: 61.0, color: "#ec4899" },
                    { phase: "Drying", cv: 12.7, saving: 18.8, color: "#f97316" },
                    { phase: "Milling", cv: 14.5, saving: 19.3, color: "#ef4444" },
                    { phase: "Coating", cv: 18.0, saving: 17.8, color: "#06b6d4" },
                    { phase: "Blending", cv: 17.2, saving: 11.7, color: "#8b5cf6" },
                  ].map(o => (
                    <div key={o.phase} style={{ background: "#0f172a", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: o.color }}>{o.phase}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>▼ {o.saving} kg CO₂e/batch</span>
                      </div>
                      <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${o.cv / 20 * 100}%`, height: "100%", background: o.color, borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>Variability CV: {o.cv}% → optimization lever</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quarterly targets table */}
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
              <SectionTitle>Adaptive Carbon Target Roadmap — 5% Annual Reduction</SectionTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Quarter", "Target Energy (kWh)", "Target Carbon (kg CO₂e)", "Reduction vs Baseline", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #334155", color: "#64748b", fontSize: 11, letterSpacing: 1, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { q: "Q1 2026", e: 4493, c: 3684, r: 2.4, status: "⚡ CURRENT TARGET" },
                      { q: "Q2 2026", e: 4383, c: 3594, r: 4.8, status: "UPCOMING" },
                      { q: "Q3 2026", e: 4275, c: 3505, r: 7.2, status: "UPCOMING" },
                      { q: "Q4 2026", e: 4168, c: 3418, r: 9.5, status: "UPCOMING" },
                      { q: "Q1 2027", e: 3960, c: 3247, r: 13.9, status: "FUTURE" },
                      { q: "Q4 2027", e: 3760, c: 3083, r: 18.5, status: "FUTURE" },
                    ].map((row, i) => (
                      <tr key={row.q} style={{ background: i === 0 ? "#0d2040" : "transparent" }}>
                        <td style={{ padding: "10px 16px", color: i === 0 ? "#60a5fa" : "#e2e8f0", fontWeight: i === 0 ? 700 : 400, borderBottom: "1px solid #1e293b" }}>{row.q}</td>
                        <td style={{ padding: "10px 16px", color: "#94a3b8", fontFamily: "'Space Mono',monospace", fontSize: 12, borderBottom: "1px solid #1e293b" }}>{row.e.toLocaleString()}</td>
                        <td style={{ padding: "10px 16px", color: "#94a3b8", fontFamily: "'Space Mono',monospace", fontSize: 12, borderBottom: "1px solid #1e293b" }}>{row.c.toLocaleString()}</td>
                        <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 60, height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${row.r / 20 * 100}%`, height: "100%", background: "#10b981", borderRadius: 3 }} />
                            </div>
                            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>{row.r}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", color: i === 0 ? "#f59e0b" : "#475569", fontSize: 12, fontWeight: i === 0 ? 600 : 400, borderBottom: "1px solid #1e293b" }}>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── LEGACY DASHBOARD ── */}
        {activeTab === "streamlit" && (
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 0, overflow: "hidden", height: "800px" }}>
            <iframe src="http://localhost:8502/?embed=true" width="100%" height="100%" style={{ border: 0 }} title="Legacy Streamlit Dashboard" />
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <div style={{ fontSize: 11, color: "#334155" }}>MANUF-AI Track A · Predictive Modelling · Hackathon 2026</div>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#475569" }}>
          <span>Models: Ridge+PCA · RandomForest · GradientBoosting</span>
          <span>CV R² 0.985</span>
          <span>Anomaly: IsolationForest + CUSUM</span>
        </div>
      </div>
    </div>
  );
}
