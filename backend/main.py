from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI(title="House Price Prediction API")

# CORS (for Vite React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = joblib.load("trained_model-0.1.0.pkl")

# Request schema
class Input(BaseModel):
    area_sqft: float
    bedrooms: float
    bathrooms: float
    floors: float
    house_age: float
    distance_city_km: float

# Health check
@app.get("/")
def root():
    return {"status": "API running"}

# Prediction endpoint
@app.post("/predict")
def predict(data: Input):
    features = [[
        data.area_sqft,
        data.bedrooms,
        data.bathrooms,
        data.floors,
        data.house_age,
        data.distance_city_km
    ]]
    pred = model.predict(features)
    return {"prediction": float(pred[0])}
