const config = require('../config');
const { logger } = require('../config/logger');

/**
 * AgentService — Core service for agent interactions
 * Handles prompt construction, LLM calls, and response processing
 */
class AgentService {
  
  /**
   * Process a chat message through the agent pipeline
   */
  static async chat({ agentId, message, history, language, channel }) {
    // TODO: Load agent config from database
    const agentConfig = await this.getAgentConfig(agentId);
    
    // Build the system prompt from agent config
    const systemPrompt = this.buildSystemPrompt(agentConfig, language, channel);
    
    // Prepare messages for LLM
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.formatHistory(history),
      { role: 'user', content: message }
    ];

    // Call LLM
    const response = await this.callLLM(messages);

    // Detect response language
    const detectedLanguage = this.detectLanguage(response);

    return {
      message: response,
      language: detectedLanguage,
      metadata: {
        model: config.llm.model,
        agent_id: agentId,
        channel
      }
    };
  }

  /**
   * Build system prompt from agent configuration
   */
  static buildSystemPrompt(agentConfig, language, channel) {
    const parts = [];

    // Base identity
    parts.push(`You are ${agentConfig?.name || 'a helpful assistant'} for ${agentConfig?.business_profile?.name || 'a small business'}.`);
    
    // Business context
    if (agentConfig?.business_profile) {
      const bp = agentConfig.business_profile;
      parts.push(`\nBusiness: ${bp.name}`);
      if (bp.type) parts.push(`Type: ${bp.type}`);
      if (bp.description) parts.push(`Description: ${bp.description}`);
      if (bp.hours) parts.push(`Hours: ${JSON.stringify(bp.hours)}`);
      if (bp.services?.length) {
        parts.push(`Services: ${bp.services.map(s => `${s.name} (${s.price_range})`).join(', ')}`);
      }
    }

    // Language instruction
    if (language === 'es' || language === 'auto') {
      parts.push('\nLanguage: Respond in the same language the customer uses. You are fluent in English and Spanish. If the customer writes in Spanish, respond in Spanish. If unclear, respond in English and offer Spanish: "¿Prefiere español?"');
    }

    // Channel-specific behavior
    if (channel === 'phone') {
      parts.push('\nChannel: Phone call. Be concise, conversational. Use short sentences. Confirm important details by repeating them. Pause naturally.');
    } else if (channel === 'web_chat') {
      parts.push('\nChannel: Web chat. Be helpful and clear. Use short paragraphs. Offer to help with specific things.');
    }

    // Personality
    const personality = agentConfig?.agent_config?.personality || 'friendly';
    parts.push(`\nPersonality: ${personality}. Be professional but approachable.`);

    // Escalation rules
    parts.push('\nEscalation: If the customer is angry, has a legal question, or you cannot help after 3 attempts, offer to connect them with a human team member.');

    // Skills context
    if (agentConfig?.skills?.enabled) {
      parts.push(`\nEnabled capabilities: ${agentConfig.skills.enabled.join(', ')}`);
    }

    return parts.join('\n');
  }

  /**
   * Call the configured LLM provider
   */
  static async callLLM(messages) {
    const { provider, model, apiKey, maxTokens, temperature } = config.llm;

    if (!apiKey) {
      logger.warn('No LLM API key configured — returning placeholder response');
      return 'I\'m currently being set up. Please check back soon, or leave a message and someone will get back to you!';
    }

    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(messages, { model, apiKey, maxTokens, temperature });
        case 'anthropic':
          return await this.callAnthropic(messages, { model, apiKey, maxTokens, temperature });
        case 'groq':
          return await this.callGroq(messages, { model, apiKey, maxTokens, temperature });
        default:
          return await this.callOpenAI(messages, { model, apiKey, maxTokens, temperature });
      }
    } catch (err) {
      logger.error(`LLM call failed (${provider}):`, err.message);
      return 'I apologize, but I\'m having a temporary issue. Please try again in a moment, or call us directly for immediate assistance.';
    }
  }

  /**
   * OpenAI-compatible API call
   */
  static async callOpenAI(messages, { model, apiKey, maxTokens, temperature }) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Anthropic API call
   */
  static async callAnthropic(messages, { model, apiKey, maxTokens, temperature }) {
    const systemMsg = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        system: systemMsg?.content || '',
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Groq API call (OpenAI-compatible)
   */
  static async callGroq(messages, { model, apiKey, maxTokens, temperature }) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Get agent configuration (placeholder — will use DB)
   */
  static async getAgentConfig(agentId) {
    // TODO: Fetch from PostgreSQL
    return null;
  }

  /**
   * Format conversation history for LLM
   */
  static formatHistory(history) {
    if (!history || history.length === 0) return [];
    
    // Keep last 20 messages for context window management
    return history.slice(-20).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Simple language detection
   */
  static detectLanguage(text) {
    // Basic heuristic — replace with proper detection in production
    const spanishIndicators = /[¿¡ñáéíóú]|(?:hola|gracias|por favor|buenos|buenas)/i;
    return spanishIndicators.test(text) ? 'es' : 'en';
  }
}

module.exports = AgentService;
