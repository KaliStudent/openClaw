import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';

// Initialize database (must be before routes that use models)
import './database';

// Import routes
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import billingRoutes from './routes/billing';

// Initialize passport strategies
import { initializePassport } from './config/passport';

// Session store
const SQLiteStore = require('connect-sqlite3')(session);

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Trust proxy for rate limiting and secure cookies (when behind nginx/cloudflare)
app.set('trust proxy', 1);

// Body parsing - raw body needed for Stripe webhooks
app.use('/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './data'
  }),
  secret: process.env.SESSION_SECRET || 'dns-intel-secret-change-in-production',
  resave: true, // Force session save on every request
  saveUninitialized: true, // Save session even if not modified
  proxy: true, // Trust the reverse proxy
  rolling: true, // Reset expiry on every response
  cookie: {
    secure: false, // Disabled for debugging
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax',
    path: '/'
  },
  name: 'dnsintel.sid'
}));

// Initialize Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// Auth routes
app.use('/auth', authRoutes);

// Billing routes
app.use('/billing', billingRoutes);

// Landing page
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Pricing page
app.get('/pricing', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/pricing.html'));
});

// Login page
app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Dashboard page
app.get('/dashboard', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// API documentation - redirect to coming soon
app.get('/docs', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/coming-soon.html'));
});

// Coming soon page
app.get('/coming-soon', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/coming-soon.html'));
});

// Privacy Policy page
app.get('/privacy', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/privacy.html'));
});

// Terms of Service page
app.get('/terms', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/terms.html'));
});

// Contact page
app.get('/contact', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// 404 handler
app.use((req: Request, res: Response) => {
  // For HTML requests, serve a nice 404 page or redirect
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
    return;
  }

  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/v1/scan/:domain - Full DNS intelligence scan',
      'GET /api/v1/dns/:domain - DNS records lookup',
      'GET /api/v1/propagation/:domain - Propagation check',
      'GET /api/v1/health/:domain - Zone health analysis',
      'GET /api/v1/subdomains/:domain - Subdomain enumeration',
      'GET /api/v1/whois/:domain - WHOIS lookup'
    ]
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌐 DNS Intelligence API Server                          ║
║                                                           ║
║   Running on http://localhost:${PORT}                       ║
║                                                           ║
║   API Endpoints:                                          ║
║   • GET /api/v1/scan/:domain     - Full scan              ║
║   • GET /api/v1/dns/:domain      - DNS records            ║
║   • GET /api/v1/propagation/:domain - Propagation         ║
║   • GET /api/v1/health/:domain   - Zone health            ║
║   • GET /api/v1/subdomains/:domain - Subdomains           ║
║   • GET /api/v1/whois/:domain    - WHOIS lookup           ║
║                                                           ║
║   Auth Endpoints:                                         ║
║   • GET  /auth/google            - Google OAuth           ║
║   • GET  /auth/twitter           - Twitter OAuth          ║
║   • POST /auth/register          - Email signup           ║
║   • POST /auth/login             - Email login            ║
║   • GET  /auth/me                - Current user           ║
║                                                           ║
║   Pages:                                                  ║
║   • /           - Landing page                            ║
║   • /pricing    - Pricing page                            ║
║   • /login      - Login/signup                            ║
║   • /dashboard  - User dashboard                          ║
║                                                           ║
║   Free Tier: 3 requests / 24 hours                        ║
║   Trial: 30 days unlimited access                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
