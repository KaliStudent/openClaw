const { logger } = require('../config/logger');

/**
 * KnowledgeService — Manages the knowledge bank for agents
 * 
 * Handles: document ingestion, web crawling, access control, approval workflow
 */
class KnowledgeService {

  // In-memory store (replace with Supabase)
  static knowledgeBank = new Map();

  /**
   * Ingest a document into the knowledge bank (pending approval)
   */
  static async ingestDocument({ agentId, title, content, contentType, sourcePath, accessTier }) {
    const entry = {
      id: crypto.randomUUID(),
      agent_id: agentId,
      title,
      content,
      content_type: contentType || 'document',
      source_document: sourcePath || null,
      source_url: null,
      access_tier: accessTier || 'public',
      status: 'pending',
      approved_by: null,
      approved_at: null,
      tags: [],
      created_at: new Date().toISOString()
    };

    this.knowledgeBank.set(entry.id, entry);
    logger.info(`Document ingested (pending): ${title} for agent ${agentId}`);
    
    return entry;
  }

  /**
   * Crawl a single URL and extract content (single-threaded)
   */
  static async crawlUrl({ agentId, url, suggestedTier }) {
    logger.info(`Starting crawl: ${url} for agent ${agentId}`);

    try {
      // Fetch the page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MainStreetAI-Bot/1.0 (Knowledge Crawler)'
        },
        signal: AbortSignal.timeout(30000) // 30s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Basic content extraction (strip HTML tags)
      const textContent = this.extractTextFromHtml(html);
      const title = this.extractTitle(html) || url;

      // Create pending knowledge entry
      const entry = {
        id: crypto.randomUUID(),
        agent_id: agentId,
        title,
        content: textContent,
        content_type: 'webpage',
        source_url: url,
        source_document: null,
        crawled_at: new Date().toISOString(),
        access_tier: suggestedTier || 'public',
        status: 'pending', // Requires admin approval
        tags: [],
        created_at: new Date().toISOString()
      };

      this.knowledgeBank.set(entry.id, entry);

      logger.info(`Crawl complete: ${url} — ${textContent.length} chars extracted`);

      return {
        success: true,
        entry_id: entry.id,
        title,
        content_preview: textContent.substring(0, 500),
        content_length: textContent.length,
        suggested_tier: suggestedTier || 'public',
        status: 'pending_approval'
      };
    } catch (err) {
      logger.error(`Crawl failed: ${url} — ${err.message}`);
      return {
        success: false,
        error: err.message,
        url
      };
    }
  }

  /**
   * Approve a knowledge bank entry
   */
  static async approveEntry({ entryId, approvedBy, accessTier, tags }) {
    const entry = this.knowledgeBank.get(entryId);
    if (!entry) {
      throw new Error('Knowledge entry not found');
    }

    entry.status = 'approved';
    entry.approved_by = approvedBy;
    entry.approved_at = new Date().toISOString();
    if (accessTier) entry.access_tier = accessTier;
    if (tags) entry.tags = tags;

    this.knowledgeBank.set(entryId, entry);
    logger.info(`Knowledge entry approved: ${entry.title}`);

    return entry;
  }

  /**
   * Reject a knowledge bank entry
   */
  static async rejectEntry({ entryId, reason }) {
    const entry = this.knowledgeBank.get(entryId);
    if (!entry) {
      throw new Error('Knowledge entry not found');
    }

    entry.status = 'rejected';
    entry.rejection_reason = reason;
    this.knowledgeBank.set(entryId, entry);
    
    logger.info(`Knowledge entry rejected: ${entry.title} — ${reason}`);
    return entry;
  }

  /**
   * Query knowledge bank for an agent (respecting access tier)
   */
  static async query({ agentId, searchQuery, accessLevel, limit }) {
    const results = Array.from(this.knowledgeBank.values())
      .filter(entry => {
        if (entry.agent_id !== agentId) return false;
        if (entry.status !== 'approved') return false;
        
        // Access tier check
        const tierHierarchy = { public: 0, customer: 1, employee: 2 };
        if (tierHierarchy[entry.access_tier] > tierHierarchy[accessLevel || 'public']) {
          return false;
        }

        // Basic search (replace with vector search in production)
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return entry.title.toLowerCase().includes(searchLower) ||
                 entry.content.toLowerCase().includes(searchLower) ||
                 entry.tags.some(t => t.toLowerCase().includes(searchLower));
        }

        return true;
      })
      .slice(0, limit || 10);

    return results;
  }

  /**
   * Get pending entries for admin review
   */
  static async getPendingEntries(agentId) {
    return Array.from(this.knowledgeBank.values())
      .filter(entry => entry.agent_id === agentId && entry.status === 'pending');
  }

  /**
   * Get all entries for an agent
   */
  static async getAllEntries(agentId) {
    return Array.from(this.knowledgeBank.values())
      .filter(entry => entry.agent_id === agentId);
  }

  // --- Helper Methods ---

  static extractTextFromHtml(html) {
    // Remove script and style tags
    let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    // Decode common HTML entities
    text = text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&nbsp;/g, ' ');
    return text;
  }

  static extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : null;
  }
}

module.exports = KnowledgeService;
