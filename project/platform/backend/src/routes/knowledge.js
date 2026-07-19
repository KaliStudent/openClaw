const express = require('express');
const { authenticate } = require('../middleware/auth');
const KnowledgeService = require('../services/knowledge-service');
const { logger } = require('../config/logger');

const router = express.Router();

router.use(authenticate);

/**
 * GET /api/knowledge/:agent_id
 * List all knowledge entries for an agent
 */
router.get('/:agent_id', async (req, res) => {
  try {
    const entries = await KnowledgeService.getAllEntries(req.params.agent_id);
    res.json({ entries });
  } catch (err) {
    logger.error('Failed to list knowledge:', err);
    res.status(500).json({ error: 'Failed to retrieve knowledge entries' });
  }
});

/**
 * GET /api/knowledge/:agent_id/pending
 * List pending entries awaiting approval
 */
router.get('/:agent_id/pending', async (req, res) => {
  try {
    const entries = await KnowledgeService.getPendingEntries(req.params.agent_id);
    res.json({ entries });
  } catch (err) {
    logger.error('Failed to list pending knowledge:', err);
    res.status(500).json({ error: 'Failed to retrieve pending entries' });
  }
});

/**
 * POST /api/knowledge/:agent_id/ingest
 * Upload a document to the knowledge bank
 */
router.post('/:agent_id/ingest', async (req, res) => {
  const { title, content, content_type, access_tier, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  try {
    const entry = await KnowledgeService.ingestDocument({
      agentId: req.params.agent_id,
      title,
      content,
      contentType: content_type,
      accessTier: access_tier,
      tags
    });

    res.status(201).json({
      message: 'Document ingested — pending approval',
      entry
    });
  } catch (err) {
    logger.error('Document ingestion failed:', err);
    res.status(500).json({ error: 'Failed to ingest document' });
  }
});

/**
 * POST /api/knowledge/:agent_id/crawl
 * Crawl a URL and extract content (single-threaded)
 */
router.post('/:agent_id/crawl', async (req, res) => {
  const { url, suggested_tier } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const result = await KnowledgeService.crawlUrl({
      agentId: req.params.agent_id,
      url,
      suggestedTier: suggested_tier
    });

    if (result.success) {
      res.json({
        message: 'Crawl complete — pending approval',
        ...result
      });
    } else {
      res.status(422).json({
        message: 'Crawl failed',
        error: result.error
      });
    }
  } catch (err) {
    logger.error('Crawl failed:', err);
    res.status(500).json({ error: 'Crawl operation failed' });
  }
});

/**
 * POST /api/knowledge/:agent_id/approve/:entry_id
 * Approve a pending knowledge entry
 */
router.post('/:agent_id/approve/:entry_id', async (req, res) => {
  const { access_tier, tags } = req.body;

  try {
    const entry = await KnowledgeService.approveEntry({
      entryId: req.params.entry_id,
      approvedBy: req.user.id,
      accessTier: access_tier,
      tags
    });

    res.json({ message: 'Entry approved', entry });
  } catch (err) {
    logger.error('Approval failed:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/knowledge/:agent_id/reject/:entry_id
 * Reject a pending knowledge entry
 */
router.post('/:agent_id/reject/:entry_id', async (req, res) => {
  const { reason } = req.body;

  try {
    const entry = await KnowledgeService.rejectEntry({
      entryId: req.params.entry_id,
      reason: reason || 'Rejected by admin'
    });

    res.json({ message: 'Entry rejected', entry });
  } catch (err) {
    logger.error('Rejection failed:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/knowledge/:agent_id/search
 * Search the knowledge bank (with access control)
 */
router.post('/:agent_id/search', async (req, res) => {
  const { query, access_level, limit } = req.body;

  try {
    const results = await KnowledgeService.query({
      agentId: req.params.agent_id,
      searchQuery: query,
      accessLevel: access_level || 'public',
      limit: limit || 10
    });

    res.json({ results, count: results.length });
  } catch (err) {
    logger.error('Knowledge search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
