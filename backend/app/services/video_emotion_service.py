from __future__ import annotations

from functools import lru_cache

from app.pipelines.video_emotion.inference.predictor import (
    VideoEmotionPredictor,
    VideoEmotionResult,
)


@lru_cache(maxsize=1)
def get_video_emotion_predictor() -> VideoEmotionPredictor:
    return VideoEmotionPredictor()


def analyze_video_emotion(video_path) -> VideoEmotionResult:
    predictor = get_video_emotion_predictor()
    return predictor.predict_video(video_path)

