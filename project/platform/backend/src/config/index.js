module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'agent_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  llm: {
    provider: process.env.LLM_PROVIDER || 'openai', // openai | anthropic | groq | together
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    apiKey: process.env.LLM_API_KEY || '',
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.7
  },
  voice: {
    sttProvider: process.env.STT_PROVIDER || 'deepgram', // deepgram | whisper
    ttsProvider: process.env.TTS_PROVIDER || 'openai', // openai | elevenlabs
    telephonyProvider: process.env.TELEPHONY_PROVIDER || 'twilio', // twilio | vonage
    sttApiKey: process.env.STT_API_KEY || '',
    ttsApiKey: process.env.TTS_API_KEY || '',
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT) || 3001,
    env: process.env.NODE_ENV || 'development'
  }
};
