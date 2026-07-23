from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import asyncio

app = FastAPI(title="CanineSense AI API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "CanineSense AI Backend is running"}

@app.post("/predict/final")
async def predict_final(file: UploadFile = File(...)):
    # Simulate processing delay to allow frontend animation
    await asyncio.sleep(5)
    
    # Mock data for demonstration based on the user's requirements
    return {
        "status": "success",
        "audio": {
            "emotion": "Happy",
            "confidence": 96
        },
        "visual": {
            "emotion": "Happy",
            "confidence": 93
        },
        "final": {
            "emotion": "Happy",
            "confidence": 95
        },
        "behaviour": ["Playful", "Friendly", "High Energy"],
        "explanation": "Your dog appears happy and relaxed. Tail movement and bark characteristics indicate positive excitement with high confidence."
    }
