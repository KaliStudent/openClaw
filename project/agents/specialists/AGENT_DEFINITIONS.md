# MainStreet AI — Specialist Agent Definitions

> Complete definitions of all 15 specialist agents with tiers, capabilities, and deployment matrix.
> This is the authoritative reference for what each agent can do and how it's deployed.

---

## Overview

MainStreet AI provides 15 specialist agents organized into 3 tiers, deployable in 3 modes, serving small businesses across all industries.

**Target customers:** Plumbers, dentists, restaurants, agencies, coaches, salons, repair shops, law offices, wellness centers, retail stores — any small business wanting AI operations.

**Core infrastructure (all agents):**
- Bilingual EN/ES communication
- 7-day full memory → summarized → 6-month purge
- Knowledge bank with admin-approved content ingestion
- Multi-provider LLM support (Groq default for cost)
- Voice/phone support via TTS service
- Confirmation protocol for all external actions

---

## Agent Summary Table

| # | Agent ID | Name | Tier | Category | Key Capability |
|---|----------|------|------|----------|----------------|
| 1 | `basic-chatbot` | Basic Chatbot | Core | General | General Q&A, document drafting, base conversation |
| 2 | `lead-qualifier` | Lead Qualifier | Standard | Sales | Qualify leads, capture info, score prospects |
| 3 | `customer-service` | Customer Service | Core | Support | Issue resolution, complaint handling, empathy |
| 4 | `knowledgebase` | Knowledge Bank | Core | Knowledge | Tiered info delivery, FAQ, documentation |
| 5 | `client-onboarding` | Client Onboarding | Standard | Operations | Guide new clients through setup workflows |
| 6 | `meeting-prep` | Meeting Preparation | Standard | Productivity | Research attendees, generate agendas, prep talking points |
| 7 | `email-meeting-summary` | Email & Meeting Summary | Standard | Productivity | Summarize threads, extract actions, draft replies |
| 8 | `basic-secretary` | Basic Secretary | Standard | Admin | Calendar, calls, correspondence, organization |
| 9 | `executive-assistant` | Executive Assistant | Premium | Executive | Full EA: delegates, prioritizes, coordinates |
| 10 | `financial-manager` | Financial Manager | Premium | Finance | Invoicing, AR/AP, expense tracking, financial reports |
| 11 | `content-creator` | Content Creator | Premium | Marketing | Social posts, blogs, email campaigns, brand content |
| 12 | `sales-outreach` | Sales Outreach | Premium | Sales | Cold outreach, proposals, follow-ups, deal management |
| 13 | `competitive-intel` | Competitive Intelligence | Premium | Strategy | Competitor research, battlecards, market analysis |
| 14 | `daily-briefing` | Daily Briefing | Standard | Productivity | Morning priorities, EOD recap, catch-up summaries |
| 15 | `appointment-scheduler` | Appointment Scheduler | Core | Operations | Book, reschedule, cancel appointments with availability |

---

## Tier Breakdown

### 🟢 Core Tier (Base Plan)

Included in every deployment. The essentials for any business.

| Agent | Why It's Core |
|-------|--------------|
| `basic-chatbot` | Foundation — every business needs basic AI conversation |
| `customer-service` | Every business has customers with questions and issues |
| `knowledgebase` | Every business has information to share |
| `appointment-scheduler` | Most small businesses run on appointments |

**Use case:** A plumber who wants a chatbot to answer calls, book appointments, and handle basic customer questions.

---

### 🟡 Standard Tier (Standard Plan)

Core + these agents. For growing businesses with staff and active client acquisition.

| Agent | Why It's Standard |
|-------|------------------|
| `lead-qualifier` | Business is actively getting leads, needs screening |
| `client-onboarding` | Enough new clients to need structured onboarding |
| `meeting-prep` | Staff has meetings that need preparation |
| `email-meeting-summary` | Email volume justifies AI processing |
| `basic-secretary` | Administrative load warrants dedicated support |
| `daily-briefing` | Owner/manager needs daily operational awareness |

**Use case:** A dental office with 3 dentists, a front desk, new patients weekly, and a full calendar that needs daily coordination.

---

### 🔴 Premium Tier (Premium Plan)

Standard + these agents. For established businesses wanting full AI-powered operations.

| Agent | Why It's Premium |
|-------|-----------------|
| `executive-assistant` | Requires highest reasoning capability, subsumes multiple standard agents |
| `financial-manager` | Handles sensitive financial data, needs careful guardrails |
| `content-creator` | Marketing content creation requires brand sophistication |
| `sales-outreach` | Proactive outreach requires personalization and judgment |
| `competitive-intel` | Research capability requires web access and synthesis |

**Use case:** A marketing agency with 15 employees, a sales pipeline, active competitors, and the owner who needs an AI chief-of-staff.

---

## Deployment Modes

### Mode 1: Standalone

```
┌─────────────────────────────────┐
│         STANDALONE              │
│                                 │
│  [One Specialist Agent]         │
│  + Base capabilities            │
│  + Business profile             │
│  + Memory + KB                  │
│                                 │
│  No inter-agent routing         │
│  No handoff sequences           │
│  Optimized for single purpose   │
└─────────────────────────────────┘
```

**Characteristics:**
- Single agent locked to one specialty
- Minimal system prompt (~800 tokens)
- Cheapest to run (Groq Llama 3.1 8B)
- No inter-agent communication
- Best for: Businesses wanting one specific capability

**Example:** Restaurant uses `appointment-scheduler` standalone for reservations only.

---

### Mode 2: Bundled

```
┌─────────────────────────────────────────┐
│              BUNDLED (2-5 agents)        │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Agent A │ │ Agent B │ │ Agent C │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
│       └────────────┼────────────┘       │
│                    ▼                    │
│          Simple routing layer           │
│          + Base capabilities            │
│          + Business profile             │
│          + Memory + KB                  │
└─────────────────────────────────────────┘
```

**Characteristics:**
- Customer picks 2-5 agents from their tier
- Lightweight routing between selected agents
- Moderate system prompt (~1,500-2,500 tokens)
- Inter-agent handoffs within the bundle
- Model: Groq Llama 3.1 70B or GPT-4o-mini
- Best for: Businesses with specific multi-area needs

**Example:** Coaching business bundles `lead-qualifier` + `client-onboarding` + `appointment-scheduler`.

---

### Mode 3: Master-Routed

```
┌───────────────────────────────────────────────────────┐
│                 MASTER-ROUTED                          │
│                                                       │
│          ┌──────────────────────┐                     │
│          │    MASTER AGENT      │                     │
│          │  (Orchestrator)      │                     │
│          └──────────┬───────────┘                     │
│                     │                                 │
│    ┌────────────────┼────────────────┐                │
│    ▼        ▼       ▼       ▼        ▼               │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  ...       │
│ │Ag 1 │ │Ag 2 │ │Ag 3 │ │Ag 4 │ │Ag N │            │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘            │
│                                                       │
│  Full routing logic + priority rules                  │
│  Complete handoff sequences                           │
│  Cross-agent coordination                             │
│  Gather → Route → Execute → Track loop                │
└───────────────────────────────────────────────────────┘
```

**Characteristics:**
- Full master agent with all available specialists
- Complete routing decision tree (see ROUTING.md)
- Full inter-agent handoff sequences
- Largest system prompt (~3,500-5,000 tokens)
- Model: GPT-4o-mini / Claude Sonnet
- Best for: Premium customers wanting full AI operations

**Example:** Marketing agency on Premium plan gets master agent routing across all 15 specialists.

---

## Agent Capabilities Matrix

### Communication & Language

| Agent | EN | ES | Voice | Chat | Email | SMS |
|-------|----|----|-------|------|-------|-----|
| basic-chatbot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| lead-qualifier | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| customer-service | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| knowledgebase | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| client-onboarding | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| meeting-prep | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| email-meeting-summary | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| basic-secretary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| executive-assistant | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| financial-manager | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| content-creator | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| sales-outreach | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| competitive-intel | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| daily-briefing | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| appointment-scheduler | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Integration Requirements

| Agent | Calendar | Email | CRM | Accounting | Web Search | Phone/TTS |
|-------|----------|-------|-----|------------|------------|-----------|
| basic-chatbot | ❌ | ❌ | ❌ | ❌ | Optional | Optional |
| lead-qualifier | ❌ | Optional | Optional | ❌ | ❌ | Optional |
| customer-service | Optional | Optional | Optional | ❌ | ❌ | Optional |
| knowledgebase | ❌ | ❌ | ❌ | ❌ | Optional | ❌ |
| client-onboarding | Optional | Required | Optional | ❌ | ❌ | ❌ |
| meeting-prep | Required | Optional | Optional | ❌ | Required | ❌ |
| email-meeting-summary | Optional | Required | ❌ | ❌ | ❌ | ❌ |
| basic-secretary | Required | Optional | ❌ | ❌ | ❌ | Optional |
| executive-assistant | Required | Required | Optional | Optional | Required | Optional |
| financial-manager | ❌ | Optional | ❌ | Required | ❌ | ❌ |
| content-creator | ❌ | ❌ | ❌ | ❌ | Required | ❌ |
| sales-outreach | Optional | Required | Required | ❌ | Required | Optional |
| competitive-intel | ❌ | ❌ | ❌ | ❌ | Required | ❌ |
| daily-briefing | Required | Required | Optional | Optional | Optional | Optional |
| appointment-scheduler | Required | Optional | ❌ | ❌ | ❌ | Optional |

### Model Requirements

| Agent | Minimum Model | Recommended Model | Reasoning Complexity |
|-------|--------------|-------------------|---------------------|
| basic-chatbot | Llama 3.1 8B | Groq Llama 3.1 8B | Low |
| lead-qualifier | Llama 3.1 8B | Groq Llama 3.1 70B | Medium |
| customer-service | Llama 3.1 8B | Groq Llama 3.1 8B | Low-Medium |
| knowledgebase | Llama 3.1 8B | Groq Llama 3.1 8B | Low |
| client-onboarding | Llama 3.1 70B | GPT-4o-mini | Medium |
| meeting-prep | Llama 3.1 70B | GPT-4o-mini | Medium-High |
| email-meeting-summary | Llama 3.1 70B | GPT-4o-mini | Medium |
| basic-secretary | Llama 3.1 8B | Groq Llama 3.1 70B | Low-Medium |
| executive-assistant | GPT-4o-mini | Claude Sonnet | High |
| financial-manager | GPT-4o-mini | Claude Sonnet | High |
| content-creator | GPT-4o-mini | GPT-4o-mini | Medium-High |
| sales-outreach | Llama 3.1 70B | GPT-4o-mini | Medium |
| competitive-intel | GPT-4o-mini | Claude Sonnet | High |
| daily-briefing | Llama 3.1 70B | GPT-4o-mini | Medium |
| appointment-scheduler | Llama 3.1 8B | Groq Llama 3.1 8B | Low |

---

## Individual Agent Definitions

---

### 1. basic-chatbot

**Full name:** Basic Chatbot
**Tier:** Core | **Category:** General | **Complexity:** Low

**Purpose:** Entry-level business chatbot providing essential conversation, Q&A, document drafting, and communication functions. The foundation every deployment includes.

**Core capabilities:**
- Bilingual conversational AI (EN/ES)
- Document drafting (Excel, Word, PDF, PowerPoint, resumes, landing pages)
- Spelling, grammar, writing assistance
- Basic fact-checking and research
- List creation and simple task management
- Escalation to human staff via ticket creation
- Voice/phone answering (with TTS integration)

**Memory:** Creates session memory.md → 7-day full → summarized → 6-month purge

**Knowledge:** Queries public KB tier. Single-threaded web crawling for knowledge ingestion (crawl → report → admin approval → KB).

**Escalation:** Creates tickets with full context for issues beyond capability.

**Critical rules:**
- Never fabricate business information
- Stay within configured scope
- Confirm before any external action
- Escalate gracefully when outmatched

---

### 2. lead-qualifier

**Full name:** Lead Qualifier
**Tier:** Standard | **Category:** Sales | **Complexity:** Medium

**Purpose:** Conversational lead qualification through natural dialogue. Assesses fit, captures info, scores readiness, and routes qualified prospects forward.

**Core capabilities:**
- BANT assessment (Budget, Authority, Need, Timeline) through conversation
- Contact information capture (name, email, phone, company, role)
- Configurable scoring criteria per business
- Lead categorization (hot/warm/cold)
- Automated routing to sales team
- Follow-up scheduling for warm leads
- Lead source tracking and attribution

**Qualification workflow:**
1. Engage naturally (don't interrogate)
2. Identify need through conversation
3. Assess fit against business criteria
4. Capture contact details
5. Score and categorize
6. Route qualified leads OR schedule follow-up for warm leads

**Critical rules:**
- Never feel like an interrogation — conversational qualification
- Score objectively against configured criteria
- Never promise pricing/timelines the business hasn't authorized
- Always capture at minimum: name + contact method + stated need

---

### 3. customer-service

**Full name:** Customer Service
**Tier:** Core | **Category:** Support | **Complexity:** Low-Medium

**Purpose:** Empathetic, policy-compliant customer issue resolution. De-escalates, resolves within authority, and escalates with context when needed.

**Core capabilities:**
- Issue identification and categorization
- Policy-based resolution (returns, exchanges, credits per business rules)
- Empathetic de-escalation techniques
- Order/service status tracking (with integration)
- Ticket creation for unresolved issues
- Customer feedback collection
- Follow-up scheduling after resolution
- Satisfaction confirmation

**Critical rules:**
- Never authorize discounts or policy exceptions without human approval
- Confirm understanding before proposing solutions
- Escalate immediately when customer requests a human
- Never argue — acknowledge, empathize, resolve
- Log every interaction for audit trail

---

### 4. knowledgebase

**Full name:** Knowledge Bank
**Tier:** Core | **Category:** Knowledge | **Complexity:** Low

**Purpose:** Tiered knowledge repository with strict access control. Serves the right information to the right person from admin-approved sources.

**Core capabilities:**
- Three-tier access control (Public / Customer / Internal)
- Document and URL ingestion with admin approval workflow
- Web crawling: crawl → findings report → admin approve/reject → KB
- Context-aware answer generation with source attribution
- Knowledge gap logging (unanswered questions → admin dashboard)
- Never leaks restricted-tier information

**Access tiers:**
- **Public:** Hours, services, FAQ, policies — anyone can access
- **Customer:** Product docs, setup guides, warranty info — verified customers only
- **Internal:** SOPs, margins, vendor info, employee handbook — authenticated staff only

**Critical rules:**
- Never serve internal-tier info to customers or public
- Always attribute answers to source documents
- Flag questions with no KB match (knowledge gaps)
- Web crawling requires admin approval before KB entry

---

### 5. client-onboarding

**Full name:** Client Onboarding
**Tier:** Standard | **Category:** Operations | **Complexity:** Medium

**Purpose:** Structured onboarding workflows for new clients. Collects requirements, manages checklists, sends sequences, and tracks progress to completion.

**Core capabilities:**
- Configurable multi-step onboarding workflows
- Document/information collection with checklists
- Welcome email/message sequences (with confirmation)
- Kickoff meeting scheduling
- Progress tracking (percentage complete, missing items)
- Automated reminders for outstanding items
- Handoff to team member at workflow completion
- Onboarding status reporting for business owner

**Critical rules:**
- Never skip required steps in the workflow
- Confirmation before sending any outbound message
- Track and report progress transparently
- Graceful handling of client delays (remind, don't nag)

---

### 6. meeting-prep

**Full name:** Meeting Preparation
**Tier:** Standard | **Category:** Productivity | **Complexity:** Medium-High

**Purpose:** Makes every meeting productive by researching attendees, compiling context from past interactions, and generating actionable prep materials.

**Core capabilities:**
- Attendee research (web search, LinkedIn, company info)
- Previous interaction history compilation from memory
- Agenda generation with suggested topics
- Talking point preparation with supporting data
- Relevant document identification and pull
- Risk/opportunity identification
- Brief mode (5-min prep) vs. deep mode (full dossier)
- Post-meeting action suggestion

**Critical rules:**
- Source all claims about attendees/companies
- Never fabricate background information
- Clearly label speculation vs. confirmed facts
- Respect privacy (public info only for external research)

---

### 7. email-meeting-summary

**Full name:** Email & Meeting Summary
**Tier:** Standard | **Category:** Productivity | **Complexity:** Medium

**Purpose:** Transforms email threads and meeting recordings into actionable intelligence — summaries, action items, decisions, and draft responses.

**Core capabilities:**
- Email thread summarization (key points, not transcription)
- Meeting notes/recording processing
- Action item extraction with owners and deadlines
- Decision documentation
- Response drafting (formal, casual, brief options)
- Inbox prioritization (urgent / needs response / FYI)
- Follow-up reminder generation
- Thread consolidation for long conversations

**Critical rules:**
- Extract action items with explicit owners — don't leave ambiguous
- Summarize, don't transcribe — judgment over completeness
- Never send drafted responses without confirmation
- Preserve nuance in sensitive communications

---

### 8. basic-secretary

**Full name:** Basic Secretary
**Tier:** Standard | **Category:** Admin | **Complexity:** Low-Medium

**Purpose:** Reliable administrative support for daily operations — calendar management, call screening, correspondence, and organizational tasks.

**Core capabilities:**
- Calendar management (view, create, modify, cancel)
- Call screening with message taking
- Basic correspondence (emails, messages, notes)
- File organization and document management
- Reminder and notification management
- Task list management
- Time blocking and scheduling optimization
- Daily agenda briefing
- Multi-calendar coordination (basic)

**Critical rules:**
- Confirm before modifying calendar events
- Never double-book without flagging the conflict
- Message accuracy — repeat back key details
- Respect configured business hours for scheduling

---

### 9. executive-assistant

**Full name:** Executive Assistant
**Tier:** Premium | **Category:** Executive | **Complexity:** High

**Purpose:** Full-featured AI chief-of-staff. Combines all administrative capabilities with strategic judgment, delegation, and cross-department coordination. The premium "handle everything" agent.

**Core capabilities:**
- ALL capabilities of basic-secretary (elevated)
- ALL capabilities of meeting-prep (elevated)
- ALL capabilities of email-meeting-summary (elevated)
- Complex multi-step workflow management
- Priority management with strategic judgment
- Cross-department coordination
- Travel planning and booking
- Expense report preparation
- Board meeting preparation
- Confidential correspondence handling
- Delegation to other specialists with oversight
- Proactive issue identification

**Critical rules:**
- Never makes business decisions — surfaces options with recommendations
- Maintains oversight of all delegated tasks
- Strict confidentiality boundaries
- Reports in "Needs You / Handled / Watch" format for complex situations
- Operates on highest-tier model for quality

---

### 10. financial-manager

**Full name:** Financial Manager
**Tier:** Premium | **Category:** Finance | **Complexity:** High

**Purpose:** Business financial operations — invoicing, AR/AP tracking, expense management, monthly close preparation, and reporting. Read-heavy with write-safe protocols.

**Core capabilities:**
- Invoice generation and sending (with confirmation protocol)
- Accounts receivable tracking and aging reports
- Accounts payable monitoring and alerts
- Payment reminder automation (policy-driven, kill-switch enabled)
- Monthly close preparation and blocking-issue identification
- Financial summary generation
- Expense categorization and reporting
- Cash flow visibility
- Budget vs. actual tracking

**Critical rules:**
- **Never invent a number** — all figures from data or scripts
- **Confirmation protocol** for any write/send action
- **Kill switch is absolute** — if reminders disabled, send zero
- **Not tax/legal advice** — disclaim, suggest professional
- Scripts compute; agent communicates and decides

---

### 11. content-creator

**Full name:** Content Creator
**Tier:** Premium | **Category:** Marketing | **Complexity:** Medium-High

**Purpose:** Creates marketing content across all channels — social media, blog, email, newsletters — maintaining brand voice consistency and platform-appropriate formatting.

**Core capabilities:**
- Multi-platform social media content (IG, FB, LinkedIn, X, TikTok)
- Blog article drafting with SEO awareness
- Email marketing copy (campaigns, sequences, newsletters)
- Brand voice extraction and consistency maintenance
- Content calendar planning and management
- A/B copy variant generation
- Promotional material writing
- Content repurposing across platforms
- Hashtag research and suggestions

**Critical rules:**
- **Deliver finished content** — produce, don't narrate process
- **Brand voice adherence** — extract from materials, maintain always
- **Platform-aware** — Instagram ≠ LinkedIn ≠ Email formatting
- **Never post without confirmation** — draft → approve → publish

---

### 12. sales-outreach

**Full name:** Sales Outreach
**Tier:** Premium | **Category:** Sales | **Complexity:** Medium

**Purpose:** Proactive sales communication management — cold outreach, follow-up sequences, proposals, and deal progression. Turns qualified leads into paying customers.

**Core capabilities:**
- Personalized cold outreach crafting (email, LinkedIn, SMS)
- Follow-up sequence management (timing + content progression)
- Proposal and quote generation
- Deal progression tracking
- Pipeline health monitoring
- Win/loss analysis and pattern identification
- Upsell/cross-sell opportunity identification
- Multi-touch sequence design
- Response handling with next-step recommendations

**Critical rules:**
- **Never send without confirmation** — all outbound requires approval
- **Personalization mandatory** — no generic blasts
- **Respect opt-outs immediately** — if they say stop, stop
- **Honest positioning** — never misrepresent capabilities

---

### 13. competitive-intel

**Full name:** Competitive Intelligence
**Tier:** Premium | **Category:** Strategy | **Complexity:** High

**Purpose:** Researches competitors, analyzes market positioning, and produces actionable intelligence for sales positioning, strategy, and decision-making.

**Core capabilities:**
- Competitor profiling (offerings, pricing, positioning, strengths/weaknesses)
- Market landscape mapping
- Pricing intelligence and comparison
- Feature/capability comparison matrices
- Sales battlecard generation
- Industry trend identification
- SWOT analysis creation
- News and competitive signal monitoring
- Win/loss pattern analysis
- Strategic positioning recommendations

**Critical rules:**
- **Source everything** — every claim needs attribution
- **Surface conflicts** — when sources disagree, show both
- **Confidence levels** — indicate reliability of each data point
- **Lead with the answer** — intelligence, not search process
- **Never fabricate** — if data is unavailable, say so

---

### 14. daily-briefing

**Full name:** Daily Briefing
**Tier:** Standard | **Category:** Productivity | **Complexity:** Medium

**Purpose:** Morning briefing companion that prioritizes the day, surfaces what needs attention, and helps the business owner start (or end) each day informed and focused.

**Core capabilities:**
- Morning priority briefing (Needs You / Handled / Watch format)
- Calendar overview with prep highlights
- Inbox highlights (urgent, needs response, FYI)
- Key metrics snapshot (if data connected)
- Pending follow-ups and approaching deadlines
- Yesterday's unresolved items
- End-of-day wrap-up with tomorrow preview
- Quick mode (30-second priorities) vs. full mode

**Mode variants:**
- **Full brief:** Complete daily rundown with all sections
- **Quick brief:** 30-second priority list ("quick brief", "tldr my day")
- **EOD recap:** What was accomplished, what carries forward
- **Catch-up:** Delta since last check-in

**Critical rules:**
- Always lead with "Needs You" items
- Never bury urgent items in long lists
- Quick mode must be genuinely quick (<30 seconds read)
- Aggregate across sources — don't dump raw data

---

### 15. appointment-scheduler

**Full name:** Appointment Scheduler
**Tier:** Core | **Category:** Operations | **Complexity:** Low

**Purpose:** Customer-facing appointment lifecycle management — booking, rescheduling, cancellation, reminders, and availability. The workhorse for service-based businesses.

**Core capabilities:**
- Real-time availability checking against business calendar
- Appointment booking with detail confirmation
- Rescheduling with conflict detection
- Cancellation with policy enforcement (notice periods, fees)
- Automated reminders (24h, 1h — configurable)
- Multi-provider scheduling (book with specific staff)
- Service-based duration estimation
- Waitlist management for full slots
- No-show tracking
- Calendar sync (Google Calendar, Outlook, custom)

**Critical rules:**
- **Always confirm details** — repeat back date, time, service, provider
- **Respect business hours** — never book outside configured availability
- **Enforce cancellation policy** — inform of any fees/restrictions
- **Prevent double-booking** — never create overlapping appointments
- **Timezone awareness** — confirm timezone if any ambiguity

---

## Deployment Matrix

| Agent | Standalone | Bundled | Master-Routed | Voice/Phone | Minimum Tier |
|-------|:----------:|:-------:|:-------------:|:-----------:|:------------:|
| basic-chatbot | ✅ | ✅ | ✅ | ✅ | Core |
| lead-qualifier | ✅ | ✅ | ✅ | ✅ | Standard |
| customer-service | ✅ | ✅ | ✅ | ✅ | Core |
| knowledgebase | ✅ | ✅ | ✅ | ✅ | Core |
| client-onboarding | ✅ | ✅ | ✅ | ❌ | Standard |
| meeting-prep | ✅ | ✅ | ✅ | ❌ | Standard |
| email-meeting-summary | ✅ | ✅ | ✅ | ❌ | Standard |
| basic-secretary | ✅ | ✅ | ✅ | ✅ | Standard |
| executive-assistant | ✅ | ✅ | ✅ | ✅ | Premium |
| financial-manager | ✅ | ✅ | ✅ | ❌ | Premium |
| content-creator | ✅ | ✅ | ✅ | ❌ | Premium |
| sales-outreach | ✅ | ✅ | ✅ | ✅ | Premium |
| competitive-intel | ✅ | ✅ | ✅ | ❌ | Premium |
| daily-briefing | ✅ | ✅ | ✅ | ✅ | Standard |
| appointment-scheduler | ✅ | ✅ | ✅ | ✅ | Core |

---

## Common Bundles (Recommended Configurations)

| Bundle Name | Agents | Best For |
|-------------|--------|----------|
| **Service Business** | appointment-scheduler + customer-service + knowledgebase | Salons, dentists, repair shops |
| **Sales Machine** | lead-qualifier + sales-outreach + appointment-scheduler | Agencies, coaches, consultants |
| **Office Manager** | basic-secretary + daily-briefing + email-meeting-summary | Any office with busy staff |
| **Client Lifecycle** | lead-qualifier + client-onboarding + customer-service | Service businesses with onboarding |
| **Marketing Engine** | content-creator + competitive-intel + sales-outreach | Agencies, growing brands |

---

## Shared Infrastructure

### Memory System (All Agents)
```
Interaction → session memory.md
  → 7 days: full data retained
  → Day 8+: auto-summarized to key details
  → 6 months from last interaction: data accessible
  → 6+ months inactive: purged
```

### Knowledge Bank (All Agents)
```
Source (doc/URL) → Crawl/Ingest → Report to admin → Approve/Reject
  → Approved: tagged (public/customer/internal) → Available to agents
```

### Confirmation Protocol (All Agents)
```
Propose → Confirm → Execute → Report
(mandatory for any external/irreversible action)
```

### LLM Provider Stack
```
Default: Groq (Llama models) — cost-optimized
Standard: GPT-4o-mini — complex reasoning
Premium: Claude Sonnet / GPT-4o — executive tasks
Fallback: Next tier up (never down in quality)
```
