# CanineSense AI Backend

This backend is the inference layer for the CanineSense AI full-stack project.

The frontend uploads one video file. The backend receives that file and runs one or more AI inference pipelines on it. Training does not happen here. All models are trained separately outside this repository and only the inference logic is integrated into the backend.

## Current Status

Implemented now:

- Video emotion inference is integrated and connected to the frontend.
- The frontend can upload a video and receive a real prediction from the backend.
- The backend keeps the existing `POST /predict/final` flow working for the current UI.

Not implemented yet:

- Audio emotion inference
- Multimodal fusion between video emotion and audio emotion
- Behaviour recognition integration

## High-Level Architecture

One uploaded video is the shared input to multiple future pipelines.

Current intended architecture:

1. Frontend uploads one video file to the backend.
2. Backend stores it temporarily.
3. Video emotion pipeline reads the video and predicts dog emotion from visual frames.
4. Audio emotion pipeline will later read the same uploaded video and extract/process audio separately.
5. Fusion logic will later combine video emotion + audio emotion into one final emotion result.
6. Behaviour recognition will later run independently and should remain separate from the emotion pipeline.

Important design rule:

- Behaviour recognition is not part of emotion fusion.
- Audio and video emotion are parallel pipelines.
- The final emotion result should eventually come from both emotion pipelines together.

## Current Backend Flow

Right now the backend does this when a video is uploaded:

1. FastAPI receives the uploaded video.
2. The video is saved temporarily under `backend/data/uploads/`.
3. The video emotion predictor loads the trained checkpoint.
4. Frames are sampled from the video with stride `2`.
5. YOLOv8 detects the dog in each sampled frame.
6. The largest dog bounding box is selected.
7. The dog ROI is cropped with padding.
8. The crop is resized and normalized using the same inference preprocessing as the Colab notebook.
9. The EfficientNet-B3 multi-scale model predicts a softmax distribution for each valid dog-detected frame.
10. Temporal smoothing is applied to frame labels.
11. The final video emotion label is selected from the smoothed frame votes.
12. A full-video probability distribution is computed by averaging frame-level softmax vectors across valid detected frames.
13. The backend returns the result to the frontend.

## Folder Structure

### Runtime code

- [backend/main.py](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/main.py:1)
  Main FastAPI entrypoint and API routes.

- [backend/app/core/settings.py](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/core/settings.py:1)
  Shared backend paths and inference configuration.

- [backend/app/services/video_emotion_service.py](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/services/video_emotion_service.py:1)
  Lazy-loads and reuses the video emotion predictor.

- [backend/app/schemas/video_emotion.py](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/schemas/video_emotion.py:1)
  Pydantic response models used by the API.

- [backend/app/pipelines/video_emotion/inference/predictor.py](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/pipelines/video_emotion/inference/predictor.py:1)
  Production video emotion inference logic.

### Model and notebook assets

- [backend/models/video_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/video_emotion:1)
  Video emotion model checkpoints and related visual model assets.

- [backend/models/shared/yolo](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/shared/yolo:1)
  Shared YOLO detector weights. Place `yolov8n.pt` here if you want to keep it local and explicit.

- [backend/notebooks/video_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/notebooks/video_emotion:1)
  Reference Colab/notebook material. Not used directly by the backend at runtime.

### Reserved for future integration

- [backend/app/pipelines/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/pipelines/audio_emotion:1)
  Future audio emotion inference code.

- [backend/app/pipelines/behaviour_recognition](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/pipelines/behaviour_recognition:1)
  Future behaviour recognition inference code.

- [backend/models/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/audio_emotion:1)
  Audio emotion checkpoints and assets.

- [backend/models/behaviour_recognition](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/behaviour_recognition:1)
  Behaviour recognition checkpoints and assets.

- [backend/notebooks/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/notebooks/audio_emotion:1)
  Audio teammate’s reference notebooks.

- [backend/notebooks/behaviour_recognition](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/notebooks/behaviour_recognition:1)
  Behaviour recognition reference notebooks.

- [backend/tests/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/tests/audio_emotion:1)
  Future audio tests.

- [backend/tests/behaviour_recognition](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/tests/behaviour_recognition:1)
  Future behaviour tests.

## Video Emotion Implementation Details

### Model architecture

The backend preserves the trained model architecture exactly as used in Colab:

- `efficientnet_b3`
- `features_only=True`
- `out_indices=(1, 3, 4)`
- multi-scale pooled feature concatenation
- classifier head unchanged

The backend does not retrain or modify the network.

### Checkpoint usage

The backend loads:

- `class_names` from the checkpoint
- `config` from the checkpoint
- `model_state_dict` from the checkpoint

This means class labels are not hardcoded in the backend.

### Preprocessing

The runtime preprocessing matches inference from the notebook:

- resize to `CONFIG["image_size"]`
- ImageNet normalization
- tensor conversion via `ToTensorV2`

### Detection

The backend uses YOLOv8 to detect the dog in each sampled frame.

Current behavior:

- detect only COCO dog class `16`
- select the largest dog box in the frame
- crop with padding ratio `0.15`

### Sequential processing

The notebook-style version initially stored all sampled frames in memory.

The backend now processes sampled frames sequentially instead. This was an intentional runtime improvement:

- same inference logic
- much better memory behavior on longer videos
- safer for backend/API usage

This does not change the model or prediction method. It only changes how frames are handled in memory.

## Final Emotion and Probability Logic

### Current final label

The current final video emotion label is produced from:

1. frame-level predictions
2. temporal smoothing
3. majority vote over smoothed frame emotions

This follows the notebook’s intended decision logic.

### Current probability distribution

The backend returns a full-video probability distribution by:

- taking the softmax vector from each valid dog-detected frame
- averaging those softmax vectors across the video

Why this is used:

- the model is frame-based, not video-temporal
- each valid frame already produces a class probability distribution
- averaging them is the cleanest way to summarize overall class belief across the full video without retraining or changing the model

Current meaning:

- `emotion`: chosen from smoothed majority-vote label logic
- `probabilities`: averaged frame-level softmax summary for the video
- `confidence`: probability value corresponding to the chosen final emotion

Important:

- the final label and the highest averaged probability can disagree in edge cases, because they come from two related but not identical aggregation strategies
- if future product decisions require exact alignment, the team should agree on one single final aggregation rule for both `emotion` and `confidence`

## API Endpoints

### Health check

`GET /`

Returns:

```json
{
  "status": "CanineSense AI Backend is running"
}
```

### Video-only endpoint

`POST /predict/video-emotion`

Request:

- multipart form-data
- field name: `file`
- value: uploaded video file

Response:

```json
{
  "emotion": "Happy",
  "confidence": 0.94,
  "probabilities": {
    "Relaxed": 0.02,
    "Sad": 0.01,
    "Happy": 0.94,
    "Aggressive": 0.03
  }
}
```

### Frontend-compatible endpoint

`POST /predict/final`

This exists to keep the current frontend working while audio is not integrated yet.

Current behavior:

- `visual` contains the real video emotion result
- `final` currently mirrors `visual`
- `audio` is placeholder-only for now
- `behaviour` is currently empty

Current response shape:

```json
{
  "status": "success",
  "audio": {
    "emotion": "Pending",
    "confidence": 0.0,
    "probabilities": null
  },
  "visual": {
    "emotion": "Happy",
    "confidence": 94.0,
    "probabilities": {
      "Relaxed": 0.02,
      "Sad": 0.01,
      "Happy": 0.94,
      "Aggressive": 0.03
    }
  },
  "final": {
    "emotion": "Happy",
    "confidence": 94.0,
    "probabilities": {
      "Relaxed": 0.02,
      "Sad": 0.01,
      "Happy": 0.94,
      "Aggressive": 0.03
    }
  },
  "behaviour": [],
  "explanation": "Video emotion inferred from sampled dog-detected frames."
}
```

## Frontend Integration Notes

The current frontend already uploads the video correctly to:

- `http://localhost:8000/predict/final`

The frontend results UI was also updated so that:

- the probability distribution now reads the real backend `probabilities`
- old hardcoded demo values are no longer used

This matters for teammates:

- if you change the backend probability object shape, you must update the frontend results mapping too
- the frontend now expects `data.final.probabilities` or `data.visual.probabilities`

## Windows Compatibility Fix

One important integration issue was already solved.

Problem:

- the checkpoint was created in Google Colab/Linux
- the saved checkpoint contained a `pathlib.PosixPath`
- Windows could not deserialize that object during `torch.load()`

Error seen:

- `pathlib.UnsupportedOperation: cannot instantiate 'PosixPath' on your system`

Fix:

- the backend now loads the checkpoint through a compatibility wrapper that temporarily maps Linux `PosixPath` to `PurePosixPath` during unpickling

This does not modify:

- the model weights
- the checkpoint file
- the network architecture

It only fixes cross-platform loading.

## YOLO Weight Handling

The backend checks for a local YOLO file first.

Recommended local placement:

- [backend/models/shared/yolo/yolov8n.pt](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/shared/yolo/yolov8n.pt:1)

If the file is not there, Ultralytics may try to use/download `yolov8n.pt`.

In practice, keeping the weight file locally is better because:

- it avoids download issues
- it makes setup more reproducible for teammates
- it avoids confusion about which detector weight is being used

Note:

- there is currently also a `backend/yolov8n.pt` file in the project directory
- the current backend settings prefer `backend/models/shared/yolo/yolov8n.pt`
- if the team wants one single standard location, move the file there and keep that as the documented convention

## How the Audio Teammate Should Integrate Later

The audio teammate should not modify the video predictor directly.

Recommended path:

1. Add audio inference code under [backend/app/pipelines/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/app/pipelines/audio_emotion:1)
2. Add audio model files under [backend/models/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/models/audio_emotion:1)
3. If needed, keep their notebook reference under [backend/notebooks/audio_emotion](C:/Users/KKK%20SANILS/Desktop/Internship/Canine_Sense/backend/notebooks/audio_emotion:1)
4. Build an audio service similar to the video emotion service
5. Update `POST /predict/final` so it:
   - runs video emotion
   - runs audio emotion
   - fuses both outputs
   - returns separate `audio`, `visual`, and fused `final`

Recommended future audio response block:

```json
{
  "emotion": "Happy",
  "confidence": 91.0,
  "probabilities": {
    "Relaxed": 0.03,
    "Sad": 0.02,
    "Happy": 0.91,
    "Aggressive": 0.04
  }
}
```

Important integration rule:

- `visual` should remain the video-only result
- `audio` should remain the audio-only result
- `final` should become the fused emotion result

## How Behaviour Recognition Should Integrate Later

Behaviour recognition should remain independent from emotion fusion.

Recommended future behavior:

- run it as a separate pipeline
- return it as additional output beside emotion
- do not mix it into the final fused emotion score unless the team explicitly redesigns the product requirements

Possible future expansion:

- keep `behaviour` as a list for simple UI compatibility
- or later evolve it into a richer object if needed

## Run the Project Locally

### Backend

From repo root:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Frontend

From another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

- `http://localhost:5173`

## Testing Notes

For best visual emotion testing:

- use a video where the dog is clearly visible
- avoid videos where the dog is tiny or mostly occluded
- expect an error if the detector cannot find the dog in sampled frames

Current AI insight text in the UI explains:

- sampled frame count
- dog-detected frame count
- that temporal smoothing was used

## Known Limitations

- Audio inference is not integrated yet.
- Behaviour recognition is not integrated yet.
- The final frontend response is still temporarily video-only.
- The model is frame-based, so video-level confidence is still an aggregation strategy rather than a native sequence-model output.
- If the detector misses the dog in important frames, final emotion quality will drop.

## Recommended Next Steps

For the current owner of video emotion:

- test on multiple videos with known expected emotions
- inspect cases where majority vote and averaged probabilities disagree
- decide whether future final confidence should follow:
  - majority-vote label confidence
  - averaged probabilities
  - or a unified aggregation rule

For the audio teammate:

- mirror the same integration structure in `audio_emotion`
- keep the endpoint contract stable
- plug audio into `/predict/final` without breaking `visual`

For the full team:

- define the exact fusion rule before shipping multimodal final emotion
- define the future API shape for behaviour output
