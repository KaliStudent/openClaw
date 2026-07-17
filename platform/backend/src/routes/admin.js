const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { logger } = require('../config/logger');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/admin/dashboard
 * Admin dashboard stats
 */
router.get('/dashboard', (req, res) => {
  // TODO: Pull from database
  res.json({
    stats: {
      total_users: 0,
      total_agents: 0,
      active_agents: 0,
      conversations_today: 0,
      calls_today: 0
    }
  });
});

/**
 * GET /api/admin/users
 * List all users
 */
router.get('/users', (req, res) => {
  // TODO: Pull from database
  res.json({ users: [] });
});

/**
 * GET /api/admin/agents
 * List all agents across all users
 */
router.get('/agents', (req, res) => {
  // TODO: Pull from database
  res.json({ agents: [] });
});

/**
 * POST /api/admin/agents/create
 * Admin agent creation interface — create agent for any user
 */
router.post('/agents/create', (req, res) => {
  const { user_id, config } = req.body;
  
  // TODO: Create agent with full admin control
  logger.info(`Admin creating agent for user ${user_id}`);
  
  res.status(201).json({
    message: 'Agent created by admin',
    agent: { id: 'placeholder', ...config }
  });
});

/**
 * GET /api/admin/skills
 * List available skill modules
 */
router.get('/skills', (req, res) => {
  res.json({
    skills: [
      { id: 'core_conversation', name: 'Core Conversation', category: 'core', required: true },
      { id: 'business_info', name: 'Business Info', category: 'core', required: true },
      { id: 'language', name: 'Multilingual', category: 'core', required: true },
      { id: 'escalation', name: 'Escalation', category: 'core', required: true },
      { id: 'appointment_scheduling', name: 'Appointment Scheduling', category: 'operations' },
      { id: 'lead_qualification', name: 'Lead Qualification', category: 'sales' },
      { id: 'receptionist_phone', name: 'Phone Receptionist', category: 'voice' },
      { id: 'faq_management', name: 'FAQ Management', category: 'support' },
      { id: 'basic_coding', name: 'Basic Coding', category: 'technical' },
      { id: 'landing_page_builder', name: 'Landing Page Builder', category: 'technical' },
      { id: 'fullstack_dev', name: 'Full-Stack Development', category: 'addon', addon: true }
    ]
  });
});

module.exports = router;
