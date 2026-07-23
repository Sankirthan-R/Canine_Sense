from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core import settings
from app.schemas.video_emotion import FinalPredictionResponse, VideoEmotionResponse
from app.services.video_emotion_service import analyze_video_emotion

app = FastAPI(title="CanineSense AI API")

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


def save_upload(upload: UploadFile) -> Path:
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(upload.filename or "upload.mp4").suffix or ".mp4"
    upload_path = settings.UPLOAD_DIR / f"{uuid4().hex}{suffix}"

    with upload_path.open("wb") as file_handle:
        while True:
            chunk = upload.file.read(1024 * 1024)
            if not chunk:
                break
            file_handle.write(chunk)

    return upload_path


@app.post("/predict/video-emotion", response_model=VideoEmotionResponse)
async def predict_video_emotion(file: UploadFile = File(...)):
    upload_path = save_upload(file)

    try:
        result = analyze_video_emotion(upload_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        if upload_path.exists():
            upload_path.unlink()

    return VideoEmotionResponse(
        emotion=result.emotion,
        confidence=result.confidence,
        probabilities=result.probabilities,
    )


@app.post("/predict/final", response_model=FinalPredictionResponse)
async def predict_final(file: UploadFile = File(...)):
    upload_path = save_upload(file)

    try:
        result = analyze_video_emotion(upload_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        if upload_path.exists():
            upload_path.unlink()

    visual_confidence_percent = round(result.confidence * 100, 2)
    explanation = (
        f"Video emotion inferred from {result.detected_frames} dog-detected frames out of "
        f"{result.total_sampled_frames} sampled frames, using temporally smoothed frame votes."
    )

    visual_block = {
        "emotion": result.emotion,
        "confidence": visual_confidence_percent,
        "probabilities": result.probabilities,
    }

    return FinalPredictionResponse(
        status="success",
        audio={
            "emotion": "Pending",
            "confidence": 0.0,
            "probabilities": None,
        },
        visual=visual_block,
        final=visual_block,
        behaviour=[],
        explanation=explanation,
    )
