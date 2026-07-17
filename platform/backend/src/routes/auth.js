const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const { logger } = require('../config/logger');

const router = express.Router();

// In-memory store (replace with PostgreSQL in production)
const users = new Map();

/**
 * POST /api/auth/register
 * Register a new user (business owner)
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty(),
  body('business_name').trim().notEmpty(),
  body('language').optional().isIn(['en', 'es']).default('en')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, business_name, language } = req.body;

  // Check if user exists
  if (users.has(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      business_name,
      language: language || 'en',
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.set(email, user);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.info(`New user registered: ${email}`);
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        business_name: user.business_name,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = users.get(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        business_name: user.business_name,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/admin-login
 * Admin login (separate endpoint for admin portal)
 */
router.post('/admin-login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = users.get(email);

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  try {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '24h' } // Shorter expiry for admin
    );

    logger.info(`Admin logged in: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Admin login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Seed a default admin (dev only)
if (config.app.env === 'development') {
  (async () => {
    const adminPassword = await bcrypt.hash('admin123', 12);
    users.set('admin@platform.local', {
      id: uuidv4(),
      email: 'admin@platform.local',
      password: adminPassword,
      name: 'Platform Admin',
      business_name: 'Platform',
      language: 'en',
      role: 'admin',
      created_at: new Date().toISOString()
    });
    logger.info('Dev admin seeded: admin@platform.local / admin123');
  })();
}

module.exports = router;
