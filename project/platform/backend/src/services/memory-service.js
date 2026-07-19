const { logger } = require('../config/logger');

/**
 * MemoryService — Handles session memory lifecycle
 * 
 * Flow: Active Session → 7-day full storage → Summarized memory → 6-month purge
 */
class MemoryService {

  /**
   * Create a new session with memory tracking
   */
  static async createSession({ agentId, customerId, channel, language }) {
    const session = {
      id: crypto.randomUUID(),
      agent_id: agentId,
      customer_id: customerId,
      channel,
      language: language || 'en',
      started_at: new Date().toISOString(),
      messages: [],
      memory_md: null,
      status: 'active'
    };

    // TODO: Insert into Supabase sessions table
    logger.info(`Session created: ${session.id} for agent ${agentId}`);
    return session;
  }

  /**
   * Generate memory.md from session conversation
   * Called when session ends or at critical points
   */
  static generateMemoryMd(session) {
    const { messages, customer_id } = session;
    
    // Extract customer info from messages
    const customerInfo = this.extractCustomerInfo(messages);
    const keyPoints = this.extractKeyPoints(messages);
    const issues = this.extractIssues(messages);

    const memoryMd = `# Session Memory — ${new Date().toISOString()}

## Customer
- Name: ${customerInfo.name || 'Unknown'}
- Contact: ${customerInfo.contact || 'Not provided'}
- Company: ${customerInfo.company || 'Not provided'}

## Key Points
${keyPoints.map(p => `- ${p}`).join('\n')}

## Issues/Requests
${issues.map(i => `- ${i}`).join('\n')}

## Follow-up Needed
${customerInfo.followUps?.map(f => `- [ ] ${f}`).join('\n') || '- None identified'}

## Tags
${customerInfo.tags?.map(t => `- ${t}`).join('\n') || '- general'}
`;

    return memoryMd;
  }

  /**
   * Summarize session for long-term memory (after 7-day window)
   */
  static async summarizeSession(session) {
    const summary = {
      customer_name: null,
      customer_email: null,
      customer_phone: null,
      summary: '',
      key_details: {},
      tags: [],
      lead_score: 'cold',
      interests: [],
      last_interaction_at: session.ended_at || session.started_at,
      interaction_count: 1
    };

    // Parse memory_md for structured data
    if (session.memory_md) {
      const parsed = this.parseMemoryMd(session.memory_md);
      summary.customer_name = parsed.name;
      summary.customer_email = parsed.email;
      summary.customer_phone = parsed.phone;
      summary.summary = parsed.keyPoints.join('; ');
      summary.key_details = parsed;
      summary.tags = parsed.tags || [];
    }

    // Determine lead score based on interaction signals
    summary.lead_score = this.scoreLead(session.messages);

    // TODO: Upsert into Supabase customer_memories table
    logger.info(`Session ${session.id} summarized for long-term memory`);
    return summary;
  }

  /**
   * Score a lead based on conversation signals
   */
  static scoreLead(messages) {
    if (!messages || messages.length === 0) return 'cold';

    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ');

    const hotSignals = ['buy', 'purchase', 'price', 'cost', 'how much', 'sign up', 'start', 'ready'];
    const warmSignals = ['interested', 'tell me more', 'options', 'compare', 'when can', 'available'];

    const hotCount = hotSignals.filter(s => userMessages.includes(s)).length;
    const warmCount = warmSignals.filter(s => userMessages.includes(s)).length;

    if (hotCount >= 2) return 'hot';
    if (hotCount >= 1 || warmCount >= 2) return 'warm';
    return 'cold';
  }

  /**
   * Retrieve customer memory for use in new conversations
   */
  static async getCustomerMemory(customerId, agentId) {
    // TODO: Query Supabase customer_memories table
    // Returns summarized past interactions for context
    return null;
  }

  /**
   * Generate lead contact list for outreach
   */
  static async generateLeadList({ agentId, scoreFilter, maxAge }) {
    // TODO: Query customer_memories where:
    // - eligible_for_outreach = true
    // - do_not_contact = false
    // - last_interaction within maxAge
    // - lead_score in scoreFilter
    return [];
  }

  /**
   * Run session cleanup job (called by scheduler)
   * - Summarize sessions older than 7 days
   * - Purge memories older than 6 months
   */
  static async runCleanup() {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now - 180 * 24 * 60 * 60 * 1000);

    // TODO: Implement with Supabase queries
    logger.info('Memory cleanup job executed');
    
    return {
      sessionsSummarized: 0,
      memoriesPurged: 0
    };
  }

  // --- Helper methods ---

  static extractCustomerInfo(messages) {
    // Basic extraction — in production, use LLM for this
    const info = { name: null, contact: null, company: null, followUps: [], tags: [] };
    
    // Simple pattern matching for phone/email
    const allText = messages.map(m => m.content).join(' ');
    const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = allText.match(/[\+]?[\d\s\-\(\)]{10,}/);
    
    if (emailMatch) info.contact = emailMatch[0];
    if (phoneMatch) info.contact = info.contact ? `${info.contact}, ${phoneMatch[0]}` : phoneMatch[0];
    
    return info;
  }

  static extractKeyPoints(messages) {
    // In production, use LLM to extract key points
    // For now, return last few user messages as points
    return messages
      .filter(m => m.role === 'user')
      .slice(-5)
      .map(m => m.content.substring(0, 100));
  }

  static extractIssues(messages) {
    // In production, use LLM to identify issues
    return ['Session recorded — detailed analysis pending'];
  }

  static parseMemoryMd(memoryMd) {
    // Basic markdown parsing of memory.md format
    const result = { name: null, email: null, phone: null, keyPoints: [], tags: [] };
    
    const nameMatch = memoryMd.match(/Name:\s*(.+)/);
    if (nameMatch) result.name = nameMatch[1].trim();
    
    const contactMatch = memoryMd.match(/Contact:\s*(.+)/);
    if (contactMatch) {
      const contact = contactMatch[1].trim();
      if (contact.includes('@')) result.email = contact;
      else result.phone = contact;
    }

    // Extract key points
    const keyPointsSection = memoryMd.match(/## Key Points\n([\s\S]*?)(?=\n##|$)/);
    if (keyPointsSection) {
      result.keyPoints = keyPointsSection[1]
        .split('\n')
        .filter(l => l.startsWith('- '))
        .map(l => l.substring(2));
    }

    // Extract tags
    const tagsSection = memoryMd.match(/## Tags\n([\s\S]*?)(?=\n##|$)/);
    if (tagsSection) {
      result.tags = tagsSection[1]
        .split('\n')
        .filter(l => l.startsWith('- '))
        .map(l => l.substring(2));
    }

    return result;
  }
}

module.exports = MemoryService;
