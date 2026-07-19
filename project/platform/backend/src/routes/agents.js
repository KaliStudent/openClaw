const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { logger } = require('../config/logger');

const router = express.Router();

// In-memory store (replace with PostgreSQL)
const agents = new Map();

/**
 * GET /api/agents
 * List all agents for the authenticated user
 */
router.get('/', authenticate, (req, res) => {
  const userAgents = Array.from(agents.values())
    .filter(a => a.customer_id === req.user.id);
  
  res.json({ agents: userAgents });
});

/**
 * GET /api/agents/:id
 * Get a specific agent configuration
 */
router.get('/:id', authenticate, (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  if (agent.customer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ agent });
});

/**
 * POST /api/agents
 * Create a new agent
 */
router.post('/', authenticate, [
  body('name').trim().notEmpty(),
  body('business_profile').isObject(),
  body('business_profile.name').trim().notEmpty(),
  body('business_profile.type').trim().notEmpty(),
  body('skills').optional().isArray(),
  body('languages').optional().isArray(),
  body('channels').optional().isObject()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, business_profile, skills, languages, channels, personality } = req.body;

  const agent = {
    id: uuidv4(),
    customer_id: req.user.id,
    name,
    version: '1.0.0',
    status: 'active',
    
    business_profile: {
      name: business_profile.name,
      type: business_profile.type,
      industry: business_profile.industry || '',
      description: business_profile.description || '',
      hours: business_profile.hours || {},
      location: business_profile.location || {},
      services: business_profile.services || [],
      staff: business_profile.staff || []
    },

    agent_config: {
      model: 'cost-effective-default',
      temperature: 0.7,
      max_tokens: 1024,
      languages: languages || ['en'],
      primary_language: (languages && languages[0]) || 'en',
      personality: personality || 'friendly',
      voice: {
        enabled: false,
        voice_id: 'default',
        speed: 1.0
      }
    },

    skills: {
      enabled: [
        'core_conversation',
        'business_info',
        'language',
        'escalation',
        ...(skills || [])
      ],
      disabled: [],
      addons: []
    },

    channels: channels || {
      web_chat: { enabled: true },
      phone: { enabled: false },
      voice_chat: { enabled: false }
    },

    escalation: {
      triggers: ['customer_angry', 'unknown_topic_3_attempts'],
      method: 'take_message',
      notify: [req.user.email]
    },

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  agents.set(agent.id, agent);
  logger.info(`Agent created: ${agent.id} for user ${req.user.id}`);

  res.status(201).json({ agent });
});

/**
 * PUT /api/agents/:id
 * Update an agent configuration
 */
router.put('/:id', authenticate, (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  if (agent.customer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Merge updates
  const updates = req.body;
  const updatedAgent = {
    ...agent,
    ...updates,
    id: agent.id, // Prevent ID override
    customer_id: agent.customer_id, // Prevent ownership change
    updated_at: new Date().toISOString()
  };

  agents.set(agent.id, updatedAgent);
  logger.info(`Agent updated: ${agent.id}`);

  res.json({ agent: updatedAgent });
});

/**
 * DELETE /api/agents/:id
 * Delete an agent
 */
router.delete('/:id', authenticate, (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  if (agent.customer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  agents.delete(req.params.id);
  logger.info(`Agent deleted: ${req.params.id}`);

  res.json({ message: 'Agent deleted' });
});

/**
 * POST /api/agents/:id/deploy
 * Deploy/activate an agent
 */
router.post('/:id/deploy', authenticate, (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  if (agent.customer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  agent.status = 'deployed';
  agent.deployed_at = new Date().toISOString();
  agents.set(agent.id, agent);

  logger.info(`Agent deployed: ${agent.id}`);

  res.json({ 
    message: 'Agent deployed successfully',
    agent,
    widget_code: `<script src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/widget.js" data-agent-id="${agent.id}"></script>`
  });
});

module.exports = router;
