from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from pathlib import Path
import pathlib

import albumentations as A
import cv2
import numpy as np
import timm
import torch
import torch.nn as nn
from albumentations.pytorch import ToTensorV2
from ultralytics import YOLO

from app.core import settings


class DogEmotionNet(nn.Module):
    def __init__(self, num_classes: int = 4, pretrained: bool = False) -> None:
        super().__init__()
        self.backbone = timm.create_model(
            "efficientnet_b3",
            pretrained=pretrained,
            features_only=True,
            out_indices=(1, 3, 4),
        )
        feat_channels = self.backbone.feature_info.channels()
        total_channels = sum(feat_channels)
        self.gap = nn.AdaptiveAvgPool2d(1)
        self.classifier = nn.Sequential(
            nn.Linear(total_channels, 1024),
            nn.BatchNorm1d(1024),
            nn.SiLU(),
            nn.Dropout(0.5),
            nn.Linear(1024, 512),
            nn.BatchNorm1d(512),
            nn.SiLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        low, mid, high = self.backbone(x)
        pooled = torch.cat(
            [
                self.gap(low).flatten(1),
                self.gap(mid).flatten(1),
                self.gap(high).flatten(1),
            ],
            dim=1,
        )
        return self.classifier(pooled)


@dataclass
class FramePrediction:
    frame_index: int
    emotion: str
    confidence: float
    probabilities: np.ndarray
    smoothed_emotion: str | None = None


@dataclass
class VideoEmotionResult:
    emotion: str
    confidence: float
    probabilities: dict[str, float]
    total_sampled_frames: int
    detected_frames: int


class VideoEmotionPredictor:
    def __init__(self) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.checkpoint = self._load_checkpoint(settings.VIDEO_EMOTION_MODEL_PATH)
        self.class_names = self.checkpoint["class_names"]
        self.config = self.checkpoint["config"]

        self.model = DogEmotionNet(num_classes=len(self.class_names)).to(self.device)
        self.model.load_state_dict(self.checkpoint["model_state_dict"])
        self.model.eval()

        self.transform = A.Compose(
            [
                A.Resize(self.config["image_size"], self.config["image_size"]),
                A.Normalize(
                    mean=(0.485, 0.456, 0.406),
                    std=(0.229, 0.224, 0.225),
                ),
                ToTensorV2(),
            ]
        )
        self.detector = YOLO(settings.VIDEO_EMOTION_DETECTOR_PATH)

    def _load_checkpoint(self, checkpoint_path: Path) -> dict:
        # The checkpoint was created in Google Colab/Linux, and pickle may contain
        # pathlib.PosixPath objects. Windows cannot instantiate PosixPath directly
        # during unpickling, so we temporarily map it to PurePosixPath.
        original_posix_path = pathlib.PosixPath
        pathlib.PosixPath = pathlib.PurePosixPath
        try:
            return torch.load(
                checkpoint_path,
                map_location=self.device,
                weights_only=False,
            )
        finally:
            pathlib.PosixPath = original_posix_path

    def predict_video(self, video_path: Path) -> VideoEmotionResult:
        frame_predictions, total_sampled_frames = self._process_video(video_path)
        valid_predictions = [prediction for prediction in frame_predictions if prediction is not None]
        if not valid_predictions:
            raise ValueError("No dog was detected in the uploaded video frames.")

        self._apply_temporal_smoothing(valid_predictions)

        final_emotions = [
            prediction.smoothed_emotion or prediction.emotion
            for prediction in valid_predictions
        ]
        emotion_counts = Counter(final_emotions)
        final_emotion = emotion_counts.most_common(1)[0][0]

        mean_probabilities = np.mean(
            [prediction.probabilities for prediction in valid_predictions],
            axis=0,
        )
        probabilities = {
            class_name: float(mean_probabilities[index])
            for index, class_name in enumerate(self.class_names)
        }

        return VideoEmotionResult(
            emotion=final_emotion,
            confidence=probabilities[final_emotion],
            probabilities=probabilities,
            total_sampled_frames=total_sampled_frames,
            detected_frames=len(valid_predictions),
        )

    def _process_video(
        self, video_path: Path
    ) -> tuple[list[FramePrediction | None], int]:
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        predictions: list[FramePrediction | None] = []
        frame_idx = 0
        sampled_frames = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % settings.VIDEO_FRAME_STRIDE == 0:
                sampled_frames += 1
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                detection = self._detect_dog(frame_rgb)
                if detection is None:
                    predictions.append(None)
                else:
                    predictions.append(self._predict_single_frame(frame_rgb, frame_idx, detection))
            frame_idx += 1

        cap.release()
        if total_frames > 0 and sampled_frames == 0:
            raise ValueError("The uploaded video did not yield any readable frames.")
        return predictions, sampled_frames

    def _detect_dog(self, frame: np.ndarray) -> tuple[int, int, int, int, float] | None:
        results = self.detector(
            frame,
            classes=[settings.YOLO_DOG_CLASS_ID],
            verbose=False,
        )[0]
        boxes = results.boxes
        if len(boxes) == 0:
            return None

        areas = [
            (box.xyxy[0][2] - box.xyxy[0][0]).item()
            * (box.xyxy[0][3] - box.xyxy[0][1]).item()
            for box in boxes
        ]
        largest_idx = int(np.argmax(areas))
        x1, y1, x2, y2 = boxes[largest_idx].xyxy[0].cpu().numpy()
        conf = float(boxes[largest_idx].conf[0].cpu().numpy())
        return (int(x1), int(y1), int(x2), int(y2), conf)

    def _predict_single_frame(
        self,
        frame: np.ndarray,
        frame_index: int,
        detection: tuple[int, int, int, int, float],
    ) -> FramePrediction:
        crop = self._crop_with_padding(
            frame=frame,
            box=detection,
            padding_ratio=settings.VIDEO_CROP_PADDING_RATIO,
            target_size=self.config["image_size"],
        )
        transformed = self.transform(image=crop)["image"]
        input_tensor = transformed.unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(input_tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            confidence, pred_idx = torch.max(probs, dim=0)

        return FramePrediction(
            frame_index=frame_index,
            emotion=self.class_names[pred_idx.item()],
            confidence=float(confidence.item()),
            probabilities=probs.cpu().numpy(),
        )

    def _apply_temporal_smoothing(self, predictions: list[FramePrediction]) -> None:
        raw_emotions = [prediction.emotion for prediction in predictions]
        smoothed_emotions: list[str | None] = []

        for index in range(len(raw_emotions)):
            start = max(0, index - settings.VIDEO_SMOOTHING_WINDOW // 2)
            end = min(len(raw_emotions), index + settings.VIDEO_SMOOTHING_WINDOW // 2 + 1)
            window = raw_emotions[start:end]
            smoothed_emotions.append(Counter(window).most_common(1)[0][0] if window else None)

        for prediction, smoothed_emotion in zip(predictions, smoothed_emotions):
            prediction.smoothed_emotion = smoothed_emotion

    @staticmethod
    def _crop_with_padding(
        frame: np.ndarray,
        box: tuple[int, int, int, int, float],
        padding_ratio: float,
        target_size: int,
    ) -> np.ndarray:
        x1, y1, x2, y2, _ = box
        height, width = frame.shape[:2]
        box_w, box_h = x2 - x1, y2 - y1
        pad_x = int(box_w * padding_ratio)
        pad_y = int(box_h * padding_ratio)
        x1_p = max(0, x1 - pad_x)
        y1_p = max(0, y1 - pad_y)
        x2_p = min(width, x2 + pad_x)
        y2_p = min(height, y2 + pad_y)
        crop = frame[y1_p:y2_p, x1_p:x2_p]
        return cv2.resize(crop, (target_size, target_size))
