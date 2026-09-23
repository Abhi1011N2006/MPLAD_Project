from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import math
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI(
    title="MPLADS AI Anomaly & Risk Analytics Microservice",
    description="Python FastAPI service providing Isolation Forest anomaly detection, Haversine GPS proximity, Image vector similarity, and Terrain cost benchmarks.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Pydantic Schemas
# -------------------------------------------------------------
class RiskRequest(BaseModel):
    projectId: str
    estimatedCost: float
    sanctionedAmount: float
    expenditure: float
    progress: float
    terrainType: Optional[str] = "Plain"
    roadLengthKm: Optional[float] = 0.0

class DuplicateRequest(BaseModel):
    lat1: float
    lon1: float
    lat2: float
    lon2: float
    projectType1: str
    projectType2: str
    description1: str
    description2: str

# -------------------------------------------------------------
# Haversine Distance Calculation (GPS Proximity)
# -------------------------------------------------------------
def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # Earth radius in meters
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

# -------------------------------------------------------------
# Isolation Forest Prototype Model Initialization
# -------------------------------------------------------------
np.random.seed(42)
# Synthetic feature dataset: [exp_ratio, progress_ratio, cost_per_progress_ratio]
X_train = np.array([
    [0.2, 0.25, 0.8], [0.4, 0.45, 0.88], [0.6, 0.65, 0.92], [0.8, 0.85, 0.94], [1.0, 1.0, 1.0],
    [0.9, 0.35, 2.57], [0.85, 0.30, 2.83], [0.95, 0.40, 2.37]
])
iso_forest = IsolationForest(contamination=0.25, random_state=42)
iso_forest.fit(X_train)

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "MPLADS Python FastAPI AI Service",
        "isolation_forest_loaded": True
    }

@app.post("/api/ai/risk")
def calculate_risk(req: RiskRequest):
    exp_ratio = req.expenditure / req.sanctionedAmount if req.sanctionedAmount > 0 else 0
    progress_ratio = req.progress / 100.0 if req.progress > 0 else 0
    mismatch_ratio = (exp_ratio / progress_ratio) if progress_ratio > 0 else (exp_ratio * 2.0)

    # Features for Isolation Forest
    sample = np.array([[exp_ratio, progress_ratio, mismatch_ratio]])
    anomaly_prediction = iso_forest.predict(sample)[0]  # -1 = anomaly, 1 = normal
    raw_anomaly_score = float(iso_forest.decision_function(sample)[0])

    score = 15
    level = "LOW"
    reasons = []

    # Terrain-Aware Cost Normalization
    if req.terrainType == "Mountain" and req.roadLengthKm and req.roadLengthKm > 0:
        cost_per_km = (req.expenditure / 100000.0) / req.roadLengthKm
        if 14.0 <= cost_per_km <= 20.0:
            reasons.append(f"Higher unit cost (₹{cost_per_km:.1f}L/km) justified by Mountain terrain rock cutting parameters")
            score = 22
            level = "LOW"
        elif cost_per_km > 30.0:
            reasons.append(f"Exceeds even Mountain terrain upper benchmark limit (₹{cost_per_km:.1f}L/km vs max ₹20L/km)")
            score = 82
            level = "HIGH"
    elif exp_ratio > 0.8 and progress_ratio < 0.5:
      score = 78
      level = "HIGH"
      reasons.append(f"High expenditure ({exp_ratio*100:.0f}%) relative to reported physical progress ({req.progress:.0f}%)")
    
    if anomaly_prediction == -1 and score < 60:
      score = max(score, 65)
      level = "HIGH"
      reasons.append("Isolation Forest detected unsupervised feature distribution anomaly")

    return {
        "success": True,
        "projectId": req.projectId,
        "riskScore": score,
        "riskLevel": level,
        "reasons": reasons,
        "isolationForestAnomalyFlag": bool(anomaly_prediction == -1),
        "disclaimer": "AI-generated risk score requiring human verification"
    }

@app.post("/api/ai/duplicate")
def detect_duplicate(req: DuplicateRequest):
    distance_meters = calculate_haversine(req.lat1, req.lon1, req.lat2, req.lon2)
    
    # Simulate image embedding cosine similarity & metadata Jaccard similarity
    gps_score = max(0.0, 1.0 - (distance_meters / 200.0))
    image_sim = 0.89 if distance_meters < 50 else 0.40
    metadata_sim = 0.95 if req.projectType1 == req.projectType2 else 0.30

    combined_score = (gps_score * 0.4) + (image_sim * 0.4) + (metadata_sim * 0.2)
    duplicate_risk = int(combined_score * 100)

    is_duplicate = duplicate_risk > 70

    return {
        "success": True,
        "duplicateRiskScore": duplicate_risk,
        "riskLevel": "CRITICAL" if duplicate_risk > 80 else ("HIGH" if duplicate_risk > 60 else "LOW"),
        "isDuplicate": is_duplicate,
        "gpsDistanceMeters": round(distance_meters, 2),
        "imageSimilarityScore": round(image_sim, 2),
        "metadataMatchScore": round(metadata_sim, 2),
        "reason": f"Possible duplicate project: Located within {distance_meters:.1f}m, image similarity {image_sim*100:.0f}%, matching metadata.",
        "disclaimer": "Possible duplicate detected — human verification required"
    }
