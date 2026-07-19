# MainStreet AI — TTS Service

Custom voice text-to-speech service using Coqui XTTS v2. Supports voice cloning from short audio samples and multilingual synthesis (English, Spanish, + 15 more languages).

## Quick Start

### Prerequisites
- Python 3.10+
- NVIDIA GPU with 4GB+ VRAM (recommended) or CPU (slower)
- ~2GB disk for model weights

### Setup
```bash
cd tts-service
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Run
```bash
source .venv/bin/activate
python src/main.py
```

Service starts at `http://localhost:8100`
API docs at `http://localhost:8100/docs`

### Docker (Production)
```bash
docker build -t mainstreet-tts .
docker run --gpus all -p 8100:8100 -v ./voices:/app/voices mainstreet-tts
```

## Usage Examples

### Synthesize Speech
```bash
curl -X POST http://localhost:8100/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, welcome to our business!", "voice_id": "default", "language": "en"}' \
  --output greeting.wav
```

### Clone a Voice
```bash
curl -X POST http://localhost:8100/voices/clone \
  -F "name=My Custom Voice" \
  -F "language=en" \
  -F "files=@sample1.wav" \
  -F "files=@sample2.wav"
```

### Synthesize with Cloned Voice
```bash
curl -X POST http://localhost:8100/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Now speaking in the cloned voice!", "voice_id": "my-custom-voice-a3f2b1", "language": "en"}' \
  --output cloned_speech.wav
```

### Spanish Synthesis
```bash
curl -X POST http://localhost:8100/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Gracias por llamar. ¿En qué puedo ayudarle?", "voice_id": "default", "language": "es"}' \
  --output spanish.wav
```

### List Voices
```bash
curl http://localhost:8100/voices
```

## Voice Cloning Tips

For best results:
- **Duration:** 6-30 seconds of clean speech (more is better, diminishing returns after 30s)
- **Quality:** Clear recording, minimal background noise
- **Content:** Natural speaking voice, varied intonation
- **Format:** WAV preferred, MP3/OGG/FLAC also accepted
- **Consistency:** Same mic, same distance, same environment across samples

## Integration with MainStreet AI Platform

The platform backend connects via `VoiceService` (`platform/backend/src/services/voice-service.js`).

Set in backend `.env`:
```
TTS_SERVICE_URL=http://localhost:8100
```

## AWS Deployment

For production on AWS `g4dn.xlarge` (~$0.53/hr):

```bash
# Launch with GPU-enabled AMI (Deep Learning AMI recommended)
# Install Docker + NVIDIA Container Toolkit
# Then:
docker build -t mainstreet-tts .
docker run -d --gpus all -p 8100:8100 \
  -v /data/voices:/app/voices \
  --restart unless-stopped \
  mainstreet-tts
```
