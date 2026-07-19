# TTS Service — Custom Voice Text-to-Speech

## Overview

Self-hosted TTS service using Coqui XTTS v2 for custom voice cloning and speech generation. Supports MainStreet AI's phone receptionist, chat voice responses, and general utility TTS.

## Use Cases

1. **Phone Receptionist** — Real-time TTS for live call answering (low latency)
2. **Chat Voice Responses** — Voice output option in web/app chat
3. **Utility TTS** — Document reading, notifications, content narration
4. **Automated Outreach** — Pre-generated voice for cold calls and promo messages

## Architecture

```
┌─────────────────────┐
│  MainStreet AI      │
│  Platform           │
└──────────┬──────────┘
           │ API calls
           ▼
┌─────────────────────┐
│  TTS Service API    │ ← FastAPI (Python)
│  /synthesize        │
│  /voices            │
│  /clone             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  XTTS v2 Engine     │ ← Model inference (GPU accelerated)
│  Voice Profiles     │
│  Audio Processing   │
└─────────────────────┘
```

## Technology

- **Model:** Coqui XTTS v2
- **Runtime:** Python 3.10+ with PyTorch (CUDA)
- **API:** FastAPI + Uvicorn
- **Audio:** WAV/MP3 output, streaming support
- **Languages:** English, Spanish (+ 15 others supported)
- **Voice Cloning:** ~6 seconds of reference audio needed

## Infrastructure Options

### Development (Your PC)
- Any NVIDIA GPU with 4GB+ VRAM
- Model runs in ~2-4GB VRAM
- Response time: ~1-3 seconds per sentence

### Production (AWS)

| Instance | GPU | VRAM | Cost (on-demand) | Cost (spot) | Notes |
|----------|-----|------|-------------------|-------------|-------|
| g4dn.xlarge | T4 | 16GB | ~$0.53/hr | ~$0.16/hr | Best value, good for this |
| g5.xlarge | A10G | 24GB | ~$1.01/hr | ~$0.30/hr | Faster inference |
| g4dn.2xlarge | T4 | 16GB | ~$0.75/hr | ~$0.23/hr | More CPU/RAM |
| inf2.xlarge | Inferentia2 | — | ~$0.76/hr | — | AWS custom chip, needs conversion |

**Recommendation:** `g4dn.xlarge` — cheapest GPU instance, T4 handles XTTS v2 easily, ~$0.53/hr on-demand or ~$0.16/hr spot. For a service that's not running 24/7 initially, this is very affordable.

**Monthly estimates (if running 24/7):**
- g4dn.xlarge on-demand: ~$380/mo
- g4dn.xlarge spot: ~$115/mo
- g4dn.xlarge reserved (1yr): ~$250/mo

**Cost optimization:** Spin up only when needed, or use a queue + auto-scaling. For initial dev, your local GPU is free.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /synthesize | Generate speech from text |
| POST | /synthesize/stream | Stream audio chunks (for real-time) |
| GET | /voices | List available voice profiles |
| POST | /voices/clone | Create new voice from audio samples |
| DELETE | /voices/:id | Remove a voice profile |
| GET | /health | Service health check |

## Voice Cloning Workflow

1. Upload 1-3 audio samples (6-30 seconds total, clean speech)
2. Service processes and creates a voice profile (speaker embedding)
3. Profile is saved and available for all TTS requests
4. Any text can now be spoken in that voice

## Latency Targets

| Use Case | Target | Acceptable |
|----------|--------|-----------|
| Live phone call | <500ms | <1000ms |
| Chat voice | <2000ms | <3000ms |
| Batch/utility | No limit | — |
