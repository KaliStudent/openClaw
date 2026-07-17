#!/bin/bash
# MainStreet AI — TTS Service Setup Script
# Run this on a machine with an NVIDIA GPU

set -e

echo "🎙️  MainStreet AI TTS Service — Setup"
echo "======================================"

# Check Python version
python_version=$(python3 --version 2>&1 | grep -oP '\d+\.\d+')
echo "Python version: $python_version"

# Check GPU
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA GPU detected:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
    echo "⚠️  No NVIDIA GPU detected. Service will run on CPU (slower)."
    echo "   For production, use a GPU instance (AWS g4dn.xlarge recommended)."
fi

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install PyTorch with CUDA
echo ""
echo "🔧 Installing PyTorch (CUDA)..."
pip install --upgrade pip
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install TTS and dependencies
echo ""
echo "🔧 Installing Coqui TTS and dependencies..."
pip install -r requirements.txt

# Create directories
mkdir -p voices output logs

# Download XTTS v2 model (first run)
echo ""
echo "📥 Downloading XTTS v2 model (this may take a few minutes)..."
python3 -c "from TTS.api import TTS; TTS('tts_models/multilingual/multi-dataset/xtts_v2')"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the service:"
echo "  source .venv/bin/activate"
echo "  python src/main.py"
echo ""
echo "Or with auto-reload for development:"
echo "  uvicorn src.main:app --reload --host 0.0.0.0 --port 8100"
echo ""
echo "API docs: http://localhost:8100/docs"
