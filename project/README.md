# MainStreet AI — Small Business AI Assistant SaaS

## Overview

A multi-tenant SaaS platform that deploys configurable AI agents for small businesses. Each agent can serve as a website chatbot, voice receptionist, appointment scheduler, and general assistant — bilingual in English and Spanish.

## Project Structure

```
project/
├── docs/                          # Architecture & design docs
│   ├── ARCHITECTURE.md            # System overview
│   └── AGENT_SCHEMA.md            # Agent configuration schema
├── platform/
│   ├── backend/                   # Node.js/Express API
│   │   ├── src/
│   │   │   ├── index.js           # Server entry point
│   │   │   ├── config/            # Configuration & logger
│   │   │   ├── middleware/        # Auth middleware
│   │   │   ├── routes/            # API routes (auth, agents, admin, chat)
│   │   │   └── services/         # Business logic (AgentService)
│   │   ├── .env.example           # Environment variables template
│   │   └── package.json
│   └── frontend/                  # Next.js React app
│       ├── src/
│       │   ├── app/               # Pages (home, login, register, dashboard, admin)
│       │   ├── components/        # Shared components
│       │   ├── lib/               # Utilities
│       │   └── styles/            # Global CSS
│       └── package.json
├── agents/
│   ├── master/                    # Master agent definition
│   │   └── BASE_PROMPT.md         # Core system prompt
│   └── specialists/               # Individual specialist agents (TBD)
└── infra/                         # Infrastructure configs (Docker, etc.)
```

## Quick Start

### Backend
```bash
cd platform/backend
cp .env.example .env
# Edit .env with your API keys
npm install
npm run dev
```

### Frontend
```bash
cd platform/frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`
Frontend runs on `http://localhost:3000`

## Current Status

### ✅ Completed
- Project architecture design
- Backend API scaffold (Express)
  - Auth routes (register, login, admin-login)
  - Agent CRUD routes (create, read, update, delete, deploy)
  - Admin routes (dashboard, users, agents, skills)
  - Chat route (message handling with LLM integration)
  - Agent service (prompt building, multi-provider LLM calls)
  - JWT authentication middleware
  - Rate limiting, CORS, security headers
- Frontend scaffold (Next.js)
  - Landing page (marketing/features)
  - Registration page (with business type selection)
  - Login page (user + admin toggle)
  - Dashboard (agent list, stats, create modal)
  - Admin panel (sidebar nav, agent builder, skills, deployments, logs)
- Master agent base prompt
- Agent configuration schema
- Multi-provider LLM support (OpenAI, Anthropic, Groq)
- Bilingual support structure (EN/ES)

### 🔲 Pending (Awaiting Input)
- Specialist sub-agent definitions (waiting for file with initial agent list)
- LLM provider/model selection
- Voice/telephony provider choice
- Infrastructure/hosting decisions
- Brand name
- Pricing model
- Database setup (PostgreSQL schema)
- Voice pipeline implementation (STT/TTS)
- Phone call integration (Twilio/Vonage)
- Embeddable chat widget
- Docker configuration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| POST | /api/auth/admin-login | Admin login |
| GET | /api/agents | List user's agents |
| GET | /api/agents/:id | Get agent details |
| POST | /api/agents | Create agent |
| PUT | /api/agents/:id | Update agent |
| DELETE | /api/agents/:id | Delete agent |
| POST | /api/agents/:id/deploy | Deploy agent |
| POST | /api/chat/message | Send chat message |
| GET | /api/chat/history/:id | Get conversation history |
| POST | /api/chat/voice | Voice interaction (planned) |
| GET | /api/admin/dashboard | Admin stats |
| GET | /api/admin/skills | List skill modules |
| GET | /api/health | Health check |

## LLM Provider Options (Cost-Effective)

| Provider | Model | Cost (per 1M tokens) | Quality | Speed |
|----------|-------|---------------------|---------|-------|
| Groq | Llama 3.1 8B | ~$0.05 in / $0.08 out | Good | Very Fast |
| OpenAI | GPT-4o-mini | ~$0.15 in / $0.60 out | Great | Fast |
| Anthropic | Claude Haiku | ~$0.25 in / $1.25 out | Great | Fast |
| Together | Llama 3.1 70B | ~$0.90 in / $0.90 out | Excellent | Medium |

**Recommendation:** Groq (Llama 3.1 8B) for cost-effectiveness with good bilingual support. Fall back to GPT-4o-mini for complex tasks.
