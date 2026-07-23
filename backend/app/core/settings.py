from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
TMP_DIR = DATA_DIR / "tmp"

VIDEO_EMOTION_MODEL_PATH = (
    BACKEND_DIR
    / "models"
    / "video_emotion"
    / "dog_emotion_multiscale_b3_20260723_0645_acc0.832.pth"
)

LOCAL_YOLO_DIR = BACKEND_DIR / "models" / "shared" / "yolo"
LOCAL_YOLO_PATH = LOCAL_YOLO_DIR / "yolov8n.pt"

# Ultralytics can load a named pretrained model or a local path.
VIDEO_EMOTION_DETECTOR_PATH = (
    str(LOCAL_YOLO_PATH) if LOCAL_YOLO_PATH.exists() else "yolov8n.pt"
)

VIDEO_FRAME_STRIDE = 2
VIDEO_SMOOTHING_WINDOW = 5
VIDEO_CROP_PADDING_RATIO = 0.15
YOLO_DOG_CLASS_ID = 16
