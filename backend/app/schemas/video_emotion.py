from pydantic import BaseModel, Field


class VideoEmotionResponse(BaseModel):
    emotion: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    probabilities: dict[str, float]


class FrontendEmotionBlock(BaseModel):
    emotion: str
    confidence: float
    probabilities: dict[str, float] | None = None


class FinalPredictionResponse(BaseModel):
    status: str
    audio: FrontendEmotionBlock
    visual: FrontendEmotionBlock
    final: FrontendEmotionBlock
    behaviour: list[str]
    explanation: str

