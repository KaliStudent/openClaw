FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# System deps
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    ffmpeg libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip3 install --no-cache-dir torch torchaudio --index-url https://download.pytorch.org/whl/cu121
RUN pip3 install --no-cache-dir -r requirements.txt

# Download model at build time (baked into image)
RUN python3 -c "from TTS.api import TTS; TTS('tts_models/multilingual/multi-dataset/xtts_v2')"

# Copy app
COPY src/ ./src/
COPY voices/ ./voices/

# Directories
RUN mkdir -p output logs

# Environment
ENV PORT=8100
ENV PRELOAD_MODEL=true
ENV VOICES_DIR=/app/voices
ENV OUTPUT_DIR=/app/output

EXPOSE 8100

CMD ["python3", "src/main.py"]
