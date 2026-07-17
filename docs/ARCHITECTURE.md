# Architecture Overview

## Project: MainStreet AI

### Vision
A SaaS platform that deploys configurable AI agents for small businesses. Each agent can serve as a website chatbot, voice receptionist, or general assistant — tailored to the specific business vertical.

---

## System Components

### 1. Web Platform (Portal)
- **Signup/Login** — Business owners create accounts
- **Admin Interface** — Internal admins create/manage agent configurations
- **Agent Builder** — Configure skills, personality, business context per customer
- **Dashboard** — Usage stats, conversation logs, settings

### 2. Master Agent
- Multipurpose AI with full skill library
- Can operate as any specialist or as general-purpose
- Learns new skills as sub-agents are created
- Acts as the template from which deployed agents are configured

### 3. Specialist Sub-Agents
- Each focused on a specific skill/vertical
- Deployed per customer, locked to configured capabilities
- Lightweight — only loads relevant skills and context
- Examples: Receptionist, Appointment Scheduler, FAQ Bot, Lead Qualifier

### 4. Communication Channels
- **Web Chat Widget** — Embeddable on customer websites
- **Voice/Phone** — Live call answering (receptionist mode)
- **Text-to-Speech / Speech-to-Text** — Voice interaction in chat
- **Multilingual** — English and Spanish (primary), extensible

### 5. Add-on Services
- Full-stack application development
- Custom integrations
- Advanced coding capabilities

---

## Technical Stack (Proposed — Pending Confirmation)

### Backend
- **Runtime:** Node.js (Express/Fastify) or Python (FastAPI)
- **Database:** PostgreSQL (accounts, configs) + Redis (sessions, caching)
- **Queue:** Bull/BullMQ or Celery for async tasks
- **Auth:** JWT + OAuth2

### Frontend
- **Framework:** React or Next.js
- **UI:** Tailwind CSS + shadcn/ui (fast, professional)
- **State:** Zustand or React Query

### AI/LLM
- **Primary Model:** TBD (cost-effective — candidates: GPT-4o-mini, Claude Haiku, Llama 3.1 via Groq/Together)
- **Voice:** Twilio (calls) + Deepgram/Whisper (STT) + ElevenLabs/OpenAI TTS
- **Orchestration:** Custom agent framework or LangChain/CrewAI

### Infrastructure
- **Hosting:** TBD (AWS/GCP/VPS)
- **Containers:** Docker + Docker Compose (dev), Kubernetes (prod scale)
- **CDN:** Cloudflare

---

## Agent Architecture

```
┌─────────────────────────────────────────────┐
│              MASTER AGENT                     │
│  ┌─────────┬─────────┬─────────┬─────────┐ │
│  │ Skill A │ Skill B │ Skill C │ Skill N │ │
│  └─────────┴─────────┴─────────┴─────────┘ │
└─────────────────────┬───────────────────────┘
                      │ deploys as
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ Customer A │ │ Customer B │ │ Customer C │
   │ Skills:A,B │ │ Skills:B,C │ │ Skills:ALL │
   │ Lang: EN   │ │ Lang: ES   │ │ Lang: EN/ES│
   └────────────┘ └────────────┘ └────────────┘
```

### Agent Configuration Schema
Each deployed agent has:
- `business_profile` — name, type, hours, location, services
- `skills` — array of enabled skill modules
- `language` — supported languages
- `channels` — where it's deployed (web, phone, etc.)
- `personality` — tone, formality level, custom instructions
- `escalation` — when/how to hand off to humans

---

## Deployment Model

### Per-Customer Agent
- Each customer gets a configured agent instance
- Agent loads only relevant skills and business context
- Isolated conversation history per customer
- Shared underlying model infrastructure (multi-tenant)

### Scaling
- Stateless agent instances behind load balancer
- Customer context loaded from DB per request
- Voice calls handled via WebSocket + telephony bridge

---

## Development Phases

### Phase 1: Foundation
- [ ] Project scaffold (backend + frontend)
- [ ] Auth system (signup, login, admin)
- [ ] Agent configuration schema
- [ ] Basic chat interface
- [ ] Master agent base prompt system

### Phase 2: Core Features
- [ ] Web chat widget (embeddable)
- [ ] Bilingual support (EN/ES)
- [ ] Voice input/output in chat
- [ ] Business profile configuration
- [ ] Basic skill modules (FAQ, appointment, receptionist)

### Phase 3: Voice/Phone
- [ ] Telephony integration (inbound calls)
- [ ] Real-time STT/TTS pipeline
- [ ] Call routing and IVR
- [ ] Voicemail and call summaries

### Phase 4: Advanced
- [ ] Add-on service marketplace
- [ ] Full-stack dev capabilities
- [ ] Custom integrations (CRM, scheduling, POS)
- [ ] Analytics dashboard
- [ ] Multi-agent orchestration

---

## Open Decisions (Awaiting Input)
- [ ] LLM provider selection
- [ ] Voice/telephony provider
- [ ] Hosting infrastructure
- [ ] Business/pricing model
- [ ] Brand name
- [ ] Auth method preferences
