const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { logger } = require('../config/logger');
const AgentService = require('../services/agent-service');

const router = express.Router();

// Conversation history store (in-memory, replace with DB)
const conversations = new Map();

/**
 * POST /api/chat/message
 * Send a message to an agent and get a response
 */
router.post('/message', authenticate, async (req, res) => {
  const { agent_id, message, language, session_id } = req.body;

  if (!agent_id || !message) {
    return res.status(400).json({ error: 'agent_id and message are required' });
  }

  try {
    // Get or create conversation session
    const convId = session_id || uuidv4();
    let history = conversations.get(convId) || [];

    // Add user message to history
    history.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Get agent response
    const response = await AgentService.chat({
      agentId: agent_id,
      message,
      history,
      language: language || 'auto',
      channel: 'web_chat'
    });

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString()
    });

    // Keep last 50 messages
    if (history.length > 50) {
      history = history.slice(-50);
    }
    conversations.set(convId, history);

    res.json({
      session_id: convId,
      message: response.message,
      language: response.language,
      metadata: response.metadata
    });
  } catch (err) {
    logger.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

/**
 * GET /api/chat/history/:session_id
 * Get conversation history
 */
router.get('/history/:session_id', authenticate, (req, res) => {
  const history = conversations.get(req.params.session_id) || [];
  res.json({ session_id: req.params.session_id, messages: history });
});

/**
 * POST /api/chat/voice
 * Handle voice input (audio → text → response → audio)
 */
router.post('/voice', authenticate, async (req, res) => {
  const { agent_id, audio_base64, language, session_id } = req.body;

  if (!agent_id || !audio_base64) {
    return res.status(400).json({ error: 'agent_id and audio_base64 are required' });
  }

  try {
    // TODO: Implement voice pipeline
    // 1. STT: Convert audio to text (Deepgram/Whisper)
    // 2. Process: Send text through chat pipeline
    // 3. TTS: Convert response to audio (OpenAI TTS / ElevenLabs)
    
    res.json({
      session_id: session_id || uuidv4(),
      text_response: 'Voice processing not yet implemented',
      audio_response_base64: null,
      language: language || 'en'
    });
  } catch (err) {
    logger.error('Voice chat error:', err);
    res.status(500).json({ error: 'Voice processing failed' });
  }
});

module.exports = router;
