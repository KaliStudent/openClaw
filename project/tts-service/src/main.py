"""
MainStreet AI — TTS Service
Custom voice text-to-speech using Coqui XTTS v2

Requirements:
- Python 3.10+
- PyTorch with CUDA (GPU) or CPU fallback
- ~4GB VRAM for GPU inference
"""

import os
import io
import re
import json
import uuid
import time
import shutil
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torchaudio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tts-service")

app = FastAPI(
    title="MainStreet AI TTS Service",
    description="Custom voice text-to-speech with voice cloning",
    version="0.1.0"
)

# CORS for platform integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
VOICES_DIR = Path(os.getenv("VOICES_DIR", "./voices"))
VOICES_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "./output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Global model reference
tts_model = None


# --- Models ---

class SynthesizeRequest(BaseModel):
    text: str
    voice_id: str = "default"
    language: str = "en"
    speed: float = 1.0
    output_format: str = "wav"


class VoiceInfo(BaseModel):
    id: str
    name: str
    language: str
    sample_duration_seconds: float
    created_at: str


class CloneResponse(BaseModel):
    voice_id: str
    name: str
    message: str


# --- Model Loading ---

def load_model():
    """Load XTTS v2 model (lazy initialization)"""
    global tts_model

    if tts_model is not None:
        return tts_model

    logger.info("Loading XTTS v2 model...")
    start = time.time()

    try:
        from TTS.api import TTS

        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")

        tts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

        elapsed = time.time() - start
        logger.info(f"Model loaded in {elapsed:.1f}s on {device}")

        return tts_model
    except ImportError:
        logger.error("TTS package not installed. Run: pip install TTS")
        raise RuntimeError("TTS package not available")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise RuntimeError(f"Model loading failed: {e}")


# --- Routes ---

@app.get("/health")
async def health():
    """Health check"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else None

    return {
        "status": "ok",
        "model_loaded": tts_model is not None,
        "device": device,
        "gpu": gpu_name,
        "voices_count": len(list(VOICES_DIR.glob("*"))),
    }


@app.get("/voices")
async def list_voices():
    """List available voice profiles"""
    voices = []

    for voice_dir in VOICES_DIR.iterdir():
        if voice_dir.is_dir():
            meta_file = voice_dir / "meta.json"
            sample_files = list(voice_dir.glob("*.wav")) + list(voice_dir.glob("*.mp3"))

            voices.append({
                "id": voice_dir.name,
                "name": voice_dir.name.replace("-", " ").replace("_", " ").title(),
                "samples": len(sample_files),
                "has_meta": meta_file.exists()
            })

    # Always include default
    if not any(v["id"] == "default" for v in voices):
        voices.insert(0, {
            "id": "default",
            "name": "Default (XTTS Built-in)",
            "samples": 0,
            "has_meta": False
        })

    return {"voices": voices}


@app.post("/voices/clone")
async def clone_voice(
    name: str = Form(...),
    language: str = Form(default="en"),
    files: list[UploadFile] = File(...)
):
    """
    Create a new voice profile from audio samples.

    Upload 1-3 audio files (WAV or MP3), 6-30 seconds total of clean speech.
    The cleaner and more consistent the samples, the better the clone.
    """
    if not files:
        raise HTTPException(400, "At least one audio file is required")

    if len(files) > 5:
        raise HTTPException(400, "Maximum 5 audio files per voice")

    # Create voice directory
    voice_id = name.lower().replace(" ", "-").replace("_", "-")
    voice_id = f"{voice_id}-{uuid.uuid4().hex[:6]}"
    voice_dir = VOICES_DIR / voice_id
    voice_dir.mkdir(parents=True, exist_ok=True)

    total_duration = 0.0
    saved_files = []

    try:
        for i, file in enumerate(files):
            # Validate file type
            if not file.filename.lower().endswith(('.wav', '.mp3', '.ogg', '.flac', '.m4a')):
                raise HTTPException(
                    400,
                    f"Unsupported format: {file.filename}. Use WAV, MP3, OGG, FLAC, or M4A."
                )

            # Save file
            file_path = voice_dir / f"sample_{i:02d}.wav"
            content = await file.read()

            with open(file_path, "wb") as wf:
                wf.write(content)

            # Get duration
            try:
                waveform, sample_rate = torchaudio.load(str(file_path))
                duration = waveform.shape[1] / sample_rate
                total_duration += duration
            except Exception as e:
                logger.warning(f"Could not read audio metadata for {file.filename}: {e}")

            saved_files.append(str(file_path))

        # Save metadata
        meta = {
            "id": voice_id,
            "name": name,
            "language": language,
            "samples": saved_files,
            "total_duration_seconds": total_duration,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }

        with open(voice_dir / "meta.json", "w") as mf:
            json.dump(meta, mf, indent=2)

        logger.info(f"Voice cloned: {voice_id} ({total_duration:.1f}s of audio)")

        return CloneResponse(
            voice_id=voice_id,
            name=name,
            message=f"Voice profile created with {len(saved_files)} samples ({total_duration:.1f}s total). Ready for synthesis."
        )

    except HTTPException:
        raise
    except Exception as e:
        # Cleanup on failure
        if voice_dir.exists():
            shutil.rmtree(voice_dir)
        logger.error(f"Voice cloning failed: {e}")
        raise HTTPException(500, f"Voice cloning failed: {str(e)}")


@app.post("/synthesize")
async def synthesize(request: SynthesizeRequest):
    """
    Generate speech from text using a voice profile.
    Returns WAV audio file.
    """
    model = load_model()

    if not request.text.strip():
        raise HTTPException(400, "Text cannot be empty")

    if len(request.text) > 5000:
        raise HTTPException(400, "Text too long. Maximum 5000 characters per request.")

    # Find voice reference audio
    speaker_wav = None
    if request.voice_id != "default":
        voice_dir = VOICES_DIR / request.voice_id
        if not voice_dir.exists():
            raise HTTPException(404, f"Voice '{request.voice_id}' not found")

        # Use first sample as reference
        samples = list(voice_dir.glob("*.wav")) + list(voice_dir.glob("*.mp3"))
        if not samples:
            raise HTTPException(400, f"Voice '{request.voice_id}' has no audio samples")
        speaker_wav = str(samples[0])

    try:
        start = time.time()

        # Generate speech
        output_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.wav"

        if speaker_wav:
            model.tts_to_file(
                text=request.text,
                file_path=str(output_path),
                speaker_wav=speaker_wav,
                language=request.language,
            )
        else:
            model.tts_to_file(
                text=request.text,
                file_path=str(output_path),
                language=request.language,
            )

        elapsed = time.time() - start
        logger.info(f"Synthesized {len(request.text)} chars in {elapsed:.2f}s (voice: {request.voice_id})")

        # Read and return audio
        audio_bytes = output_path.read_bytes()

        # Cleanup output file
        output_path.unlink(missing_ok=True)

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
            headers={
                "X-Processing-Time": f"{elapsed:.3f}s",
                "X-Voice-ID": request.voice_id,
                "X-Language": request.language
            }
        )

    except Exception as e:
        logger.error(f"Synthesis failed: {e}")
        raise HTTPException(500, f"Speech synthesis failed: {str(e)}")


@app.post("/synthesize/stream")
async def synthesize_stream(request: SynthesizeRequest):
    """
    Stream synthesized speech in chunks for real-time playback.
    Useful for phone calls and live chat where latency matters.

    Splits text into sentences and streams each as it's generated.
    """
    model = load_model()

    if not request.text.strip():
        raise HTTPException(400, "Text cannot be empty")

    # Find voice reference
    speaker_wav = None
    if request.voice_id != "default":
        voice_dir = VOICES_DIR / request.voice_id
        if voice_dir.exists():
            samples = list(voice_dir.glob("*.wav"))
            if samples:
                speaker_wav = str(samples[0])

    # Split text into sentences for streaming
    sentences = re.split(r'(?<=[.!?])\s+', request.text.strip())
    sentences = [s for s in sentences if s.strip()]

    async def audio_generator():
        for sentence in sentences:
            try:
                output_path = OUTPUT_DIR / f"stream_{uuid.uuid4().hex}.wav"

                if speaker_wav:
                    model.tts_to_file(
                        text=sentence,
                        file_path=str(output_path),
                        speaker_wav=speaker_wav,
                        language=request.language,
                    )
                else:
                    model.tts_to_file(
                        text=sentence,
                        file_path=str(output_path),
                        language=request.language,
                    )

                chunk = output_path.read_bytes()
                output_path.unlink(missing_ok=True)
                yield chunk

            except Exception as e:
                logger.error(f"Stream chunk failed: {e}")
                break

    return StreamingResponse(
        audio_generator(),
        media_type="audio/wav",
        headers={"X-Stream-Mode": "sentence-chunked"}
    )


@app.delete("/voices/{voice_id}")
async def delete_voice(voice_id: str):
    """Delete a voice profile"""
    voice_dir = VOICES_DIR / voice_id

    if not voice_dir.exists():
        raise HTTPException(404, f"Voice '{voice_id}' not found")

    shutil.rmtree(voice_dir)
    logger.info(f"Voice deleted: {voice_id}")

    return {"message": f"Voice '{voice_id}' deleted"}


# --- Startup ---

@app.on_event("startup")
async def startup():
    """Pre-load model on startup (optional — can lazy load)"""
    preload = os.getenv("PRELOAD_MODEL", "false").lower() == "true"
    if preload:
        load_model()
    else:
        logger.info("Model will load on first request (set PRELOAD_MODEL=true to load at startup)")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8100)))
