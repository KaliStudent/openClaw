const config = require('../config');
const { logger } = require('../config/logger');

/**
 * VoiceService — Integrates with TTS Service for speech synthesis
 * 
 * Handles: text-to-speech, voice selection, streaming for calls
 */
class VoiceService {

  static TTS_BASE_URL = process.env.TTS_SERVICE_URL || 'http://localhost:8100';

  /**
   * Synthesize text to speech audio
   * @returns {Buffer} WAV audio data
   */
  static async synthesize({ text, voiceId, language, speed }) {
    const response = await fetch(`${this.TTS_BASE_URL}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice_id: voiceId || 'default',
        language: language || 'en',
        speed: speed || 1.0,
        output_format: 'wav'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(`TTS failed: ${error.detail || response.statusText}`);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    
    logger.info(`TTS synthesized: ${text.length} chars, voice=${voiceId}, lang=${language}`);
    return audioBuffer;
  }

  /**
   * Stream synthesized speech (for real-time phone/chat)
   * Returns a readable stream of audio chunks
   */
  static async synthesizeStream({ text, voiceId, language }) {
    const response = await fetch(`${this.TTS_BASE_URL}/synthesize/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice_id: voiceId || 'default',
        language: language || 'en',
        speed: 1.0
      })
    });

    if (!response.ok) {
      throw new Error(`TTS stream failed: ${response.statusText}`);
    }

    return response.body; // ReadableStream
  }

  /**
   * List available voices from TTS service
   */
  static async listVoices() {
    const response = await fetch(`${this.TTS_BASE_URL}/voices`);
    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }
    return (await response.json()).voices;
  }

  /**
   * Clone a voice by uploading audio samples
   * @param {string} name - Voice name
   * @param {Buffer[]} audioFiles - Audio file buffers
   * @param {string} language - Primary language
   */
  static async cloneVoice({ name, audioFiles, language }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('language', language || 'en');
    
    audioFiles.forEach((file, i) => {
      const blob = new Blob([file], { type: 'audio/wav' });
      formData.append('files', blob, `sample_${i}.wav`);
    });

    const response = await fetch(`${this.TTS_BASE_URL}/voices/clone`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(`Voice cloning failed: ${error.detail}`);
    }

    const result = await response.json();
    logger.info(`Voice cloned: ${result.voice_id} (${name})`);
    return result;
  }

  /**
   * Check TTS service health
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${this.TTS_BASE_URL}/health`);
      if (!response.ok) return { status: 'unhealthy' };
      return await response.json();
    } catch (err) {
      return { status: 'unreachable', error: err.message };
    }
  }

  /**
   * Generate receptionist greeting audio (pre-cached)
   */
  static async generateGreeting({ businessName, voiceId, language }) {
    const greetings = {
      en: `Thank you for calling ${businessName}. How may I help you today?`,
      es: `Gracias por llamar a ${businessName}. ¿En qué puedo ayudarle?`
    };

    const text = greetings[language] || greetings.en;
    return this.synthesize({ text, voiceId, language });
  }
}

module.exports = VoiceService;
