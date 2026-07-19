# Master Agent — Skill Registry

> Complete registry of all 15 specialist agents. Used by the master agent for routing decisions.
> Each entry includes trigger phrases, tier, deployment modes, and cross-references.

---

## Registry Overview

| # | Agent ID | Tier | Category |
|---|----------|------|----------|
| 1 | `basic-chatbot` | Core | General |
| 2 | `lead-qualifier` | Standard | Sales |
| 3 | `customer-service` | Core | Support |
| 4 | `knowledgebase` | Core | Knowledge |
| 5 | `client-onboarding` | Standard | Operations |
| 6 | `meeting-prep` | Standard | Productivity |
| 7 | `email-meeting-summary` | Standard | Productivity |
| 8 | `basic-secretary` | Standard | Admin |
| 9 | `executive-assistant` | Premium | Executive |
| 10 | `financial-manager` | Premium | Finance |
| 11 | `content-creator` | Premium | Marketing |
| 12 | `sales-outreach` | Premium | Sales |
| 13 | `competitive-intel` | Premium | Strategy |
| 14 | `daily-briefing` | Standard | Productivity |
| 15 | `appointment-scheduler` | Core | Operations |

---

## Tier Definitions

| Tier | Included Agents | Target Customer |
|------|----------------|-----------------|
| **Core** | 1, 3, 4, 15 | Any small business wanting basic automation |
| **Standard** | Core + 2, 5, 6, 7, 8, 14 | Growing businesses with staff and clients |
| **Premium** | Standard + 9, 10, 11, 12, 13 | Established businesses wanting full AI operations |

---

## Agent Definitions

---

### 1. basic-chatbot

**Name:** Basic Chatbot
**ID:** `basic-chatbot`
**Description:** General-purpose conversational AI for small businesses. Handles Q&A, basic tasks, document drafting, and serves as the foundational communication layer for all deployments.

**Trigger Phrases:**
- "I have a question"
- "Can you help me with..."
- "Write me a [document type]"
- "Draft a [letter/email/resume]"
- "Create a spreadsheet"
- "Make a list"
- "Help me write..."
- "Spell check this"
- "Summarize this document"
- Any general conversation not matching other specialists

**Tier:** Core
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Bilingual conversation (EN/ES)
- Document drafting (Excel, Word, PDF, PowerPoint, resumes, basic websites)
- Spelling, grammar, and writing assistance
- Basic fact-checking and research
- List creation and task management
- Escalation to human staff via ticket creation

**Cross-references:**
- Routes TO → `knowledgebase` (when question needs KB lookup)
- Routes TO → `customer-service` (when issue is service-related)
- Routes TO → `appointment-scheduler` (when booking is mentioned)
- Receives FROM → all agents (as fallback for general conversation)

---

### 2. lead-qualifier

**Name:** Lead Qualifier
**ID:** `lead-qualifier`
**Description:** Qualifies and scores incoming leads through conversational assessment. Captures contact info, evaluates fit, and routes qualified prospects to sales or onboarding.

**Trigger Phrases:**
- "I'm interested in your services"
- "How much does [service] cost?"
- "Do you work with [industry/type]?"
- "I'd like to learn more about..."
- "Can you tell me about your packages?"
- "I'm looking for a [service provider]"
- "What's your pricing?"
- "Do you offer [specific service]?"
- "I was referred by..."
- "I need help with my business"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Conversational lead scoring (budget, authority, need, timeline)
- Contact information capture (name, email, phone, company)
- Fit assessment against configurable criteria
- Lead categorization (hot/warm/cold)
- Automated routing of qualified leads to sales reps
- Follow-up scheduling for warm leads
- Lead source tracking

**Cross-references:**
- Routes TO → `sales-outreach` (qualified lead ready for outreach)
- Routes TO → `client-onboarding` (lead converts → start onboarding)
- Routes TO → `appointment-scheduler` (lead wants to book a call)
- Receives FROM → `basic-chatbot` (conversation reveals purchase intent)
- Receives FROM → `customer-service` (service inquiry becomes sales opportunity)

---

### 3. customer-service

**Name:** Customer Service
**ID:** `customer-service`
**Description:** Handles customer inquiries, complaints, and service requests with empathy and efficiency. Resolves issues within policy, escalates when needed, and maintains customer satisfaction.

**Trigger Phrases:**
- "I have a problem with..."
- "I need to return..."
- "My order is [late/wrong/damaged]"
- "I'm not happy with..."
- "I want to speak to a manager"
- "Can I get a refund?"
- "Something is broken"
- "I need help with my account"
- "Where's my [order/delivery]?"
- "I want to file a complaint"
- "Your service was [bad/terrible/disappointing]"

**Tier:** Core
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Issue identification and categorization
- Policy-based resolution (returns, exchanges, credits)
- Empathetic communication with de-escalation
- Order/service status tracking (with integration)
- Ticket creation for unresolved issues
- Customer feedback collection
- Follow-up scheduling
- Satisfaction confirmation after resolution

**Critical Rules:**
- Never authorize discounts or policy exceptions without human approval
- Always confirm understanding of the issue before proposing solutions
- Escalate immediately if customer requests human representative
- Never argue with a customer — acknowledge, empathize, resolve

**Cross-references:**
- Routes TO → `knowledgebase` (needs product/policy information)
- Routes TO → `appointment-scheduler` (customer needs service appointment)
- Routes TO → `lead-qualifier` (service inquiry becomes sales opportunity)
- Receives FROM → `basic-chatbot` (general chat reveals service issue)

---

### 4. knowledgebase

**Name:** Knowledge Bank
**ID:** `knowledgebase`
**Description:** Tiered knowledge repository with access-controlled information delivery. Manages public, customer, and internal knowledge with admin-approved content ingestion.

**Trigger Phrases:**
- "What are your hours?"
- "Where are you located?"
- "How do I [install/use/setup]..."
- "What's your policy on..."
- "Do you have instructions for..."
- "Tell me about [product/service]"
- "How does [product] work?"
- "What's included in [package]?"
- "I need the documentation for..."
- "FAQ" / "frequently asked questions"
- "What's your return policy?"
- "How-to" / "guide" / "instructions"

**Tier:** Core
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Three-tier knowledge access (public / customer / internal)
- Document and URL ingestion with admin approval workflow
- Single-threaded web crawling (crawl → report → approve/reject → KB)
- Context-aware answer generation from knowledge bank
- Source attribution for answers
- Knowledge gap identification (logs unanswered questions)
- Access control enforcement (never leaks tier-restricted info)

**Knowledge Tiers:**
| Tier | Content | Access |
|------|---------|--------|
| Public | Hours, services, FAQ, pricing, policies | Anyone |
| Customer | Product docs, setup guides, warranty, account details | Verified customers |
| Internal | SOPs, margins, vendor info, roadmap, employee handbook | Authenticated staff |

**Cross-references:**
- Routes TO → `customer-service` (question becomes service issue)
- Routes TO → `appointment-scheduler` (inquiry leads to booking)
- Receives FROM → all agents (any agent can query KB for information)

---

### 5. client-onboarding

**Name:** Client Onboarding
**ID:** `client-onboarding`
**Description:** Guides new clients through structured onboarding workflows. Collects requirements, sends welcome sequences, schedules kickoff calls, and tracks completion.

**Trigger Phrases:**
- "I just signed up"
- "I'm a new client"
- "How do I get started?"
- "What do you need from me?"
- "Onboarding" / "getting started"
- "Next steps after signing"
- "Setup my account"
- "I just purchased [plan/package]"
- "Welcome" / "kickoff"
- "What documents do you need?"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Configurable multi-step onboarding workflows
- Document/information collection with checklists
- Welcome email/message sequences
- Kickoff meeting scheduling
- Progress tracking with completion percentage
- Automated reminders for missing items
- Handoff to appropriate team member at completion
- Onboarding status reporting for business owner

**Cross-references:**
- Routes TO → `appointment-scheduler` (schedule kickoff meeting)
- Routes TO → `basic-secretary` (delegate administrative follow-ups)
- Routes TO → `email-meeting-summary` (send onboarding emails)
- Receives FROM → `lead-qualifier` (lead converts to client)
- Receives FROM → `sales-outreach` (deal closed, begin onboarding)

---

### 6. meeting-prep

**Name:** Meeting Preparation
**ID:** `meeting-prep`
**Description:** Researches attendees, compiles context, generates agendas, and prepares talking points for upcoming meetings. Makes every meeting productive.

**Trigger Phrases:**
- "I have a meeting with..."
- "Prep me for my call with..."
- "What do I know about [person/company]?"
- "Meeting prep"
- "Get me ready for tomorrow's meeting"
- "Who is [attendee name]?"
- "Background on [company]"
- "Agenda for my [meeting type]"
- "Talking points for..."
- "What should I bring up with [client]?"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Attendee research (LinkedIn, company website, news)
- Previous interaction history compilation
- Agenda generation with suggested topics
- Talking point preparation with supporting data
- Document pull (relevant contracts, proposals, notes)
- Risk/opportunity identification for the meeting
- Post-meeting action item suggestions
- Brief vs. detailed prep modes

**Cross-references:**
- Routes TO → `competitive-intel` (meeting involves competitor discussion)
- Routes TO → `knowledgebase` (pull relevant internal docs)
- Routes TO → `email-meeting-summary` (post-meeting follow-up)
- Receives FROM → `daily-briefing` (today's meetings need prep)
- Receives FROM → `basic-secretary` (calendar triggers prep)

---

### 7. email-meeting-summary

**Name:** Email & Meeting Summary
**ID:** `email-meeting-summary`
**Description:** Processes email threads and meeting recordings into actionable summaries. Extracts action items, deadlines, and key decisions. Drafts responses.

**Trigger Phrases:**
- "Summarize this email thread"
- "What did we decide in the meeting?"
- "Action items from..."
- "TL;DR this email"
- "What's important in my inbox?"
- "Draft a reply to..."
- "Meeting notes" / "meeting summary"
- "What did [person] say about..."
- "Key takeaways from..."
- "Prioritize my emails"
- "What needs a response?"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Email thread summarization with key points
- Meeting recording/notes processing
- Action item extraction with owners and deadlines
- Decision documentation
- Response drafting (multiple tone options)
- Inbox prioritization (urgent / needs response / FYI)
- Follow-up reminder generation
- Thread consolidation for long conversations

**Cross-references:**
- Routes TO → `basic-secretary` (action items need scheduling)
- Routes TO → `client-onboarding` (meeting reveals onboarding needs)
- Routes TO → `appointment-scheduler` (follow-up meeting needed)
- Receives FROM → `meeting-prep` (post-meeting processing)
- Receives FROM → `daily-briefing` (morning email digest)

---

### 8. basic-secretary

**Name:** Basic Secretary
**ID:** `basic-secretary`
**Description:** All-purpose administrative support. Manages calendars, screens calls, handles correspondence, organizes files, and keeps daily operations running smoothly.

**Trigger Phrases:**
- "Schedule [event/meeting]"
- "What's on my calendar?"
- "Block time for..."
- "Move my [meeting] to..."
- "Take a message"
- "Screen this call"
- "File this under..."
- "Remind me to..."
- "Send a message to..."
- "What do I have today?"
- "Cancel my [appointment]"
- "Organize my [calendar/files/tasks]"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Calendar management (view, create, modify, cancel events)
- Call screening with message taking
- Basic correspondence (emails, messages, notes)
- File organization and document management
- Reminder setting and notification management
- Task list management
- Time blocking and scheduling optimization
- Multi-calendar coordination (basic level)
- Daily agenda briefing

**Cross-references:**
- Routes TO → `appointment-scheduler` (customer-facing bookings)
- Routes TO → `meeting-prep` (upcoming meeting needs prep)
- Routes TO → `email-meeting-summary` (correspondence needs summarizing)
- Receives FROM → `executive-assistant` (delegated admin tasks)
- Receives FROM → `daily-briefing` (schedule-related actions)

---

### 9. executive-assistant

**Name:** Executive Assistant
**ID:** `executive-assistant`
**Description:** Full-featured executive support combining all administrative capabilities with strategic judgment. Handles complex multi-step workflows, prioritization, delegation, and cross-department coordination.

**Trigger Phrases:**
- "Handle this for me"
- "Take care of [complex request]"
- "What should I focus on?"
- "Prioritize my [day/week]"
- "Coordinate with [multiple people]"
- "Prepare the board materials"
- "Plan my travel to..."
- "What's falling through the cracks?"
- "Delegate this to..."
- "Brief me on [situation]"
- "Manage this project"
- "What needs my attention?"

**Tier:** Premium
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- All capabilities of basic-secretary (elevated)
- All capabilities of meeting-prep (elevated)
- All capabilities of email-meeting-summary (elevated)
- Complex multi-step workflow management
- Priority management with strategic judgment
- Cross-department coordination
- Travel planning and booking
- Expense report preparation
- Board meeting preparation
- Confidential correspondence handling
- Delegation suggestions with follow-through tracking
- Proactive issue identification

**Critical Rules:**
- Operates at highest reasoning tier (GPT-4o-mini / Claude Sonnet minimum)
- Can delegate to other specialists but maintains oversight
- Never makes business decisions — surfaces options with recommendations
- Maintains strict confidentiality boundaries

**Cross-references:**
- Routes TO → any specialist (can delegate to any available agent)
- Routes TO → `financial-manager` (budget/expense questions)
- Routes TO → `competitive-intel` (strategic research needs)
- Receives FROM → `daily-briefing` (morning priorities)
- Subsumes → `basic-secretary`, `meeting-prep`, `email-meeting-summary`

---

### 10. financial-manager

**Name:** Financial Manager
**ID:** `financial-manager`
**Description:** Manages business financial operations — invoicing, expense tracking, accounts receivable/payable, monthly close preparation, and financial reporting. Read-heavy, write-safe.

**Trigger Phrases:**
- "Send an invoice to..."
- "What do I owe?" / "Who owes me?"
- "Accounts receivable" / "AR" / "AP"
- "Monthly close" / "close the books"
- "Revenue this month"
- "Expense report"
- "Chase payment from..."
- "Financial summary"
- "Budget vs actual"
- "Cash flow"
- "P&L" / "profit and loss"
- "Overdue invoices"
- "How much did [client] pay?"

**Tier:** Premium
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Invoice generation and sending (with confirmation)
- Accounts receivable tracking and aging reports
- Accounts payable monitoring
- Payment reminder automation (policy-driven)
- Monthly close preparation and checklist
- Financial summary generation (not tax advice)
- Expense categorization and reporting
- Cash flow visibility
- Budget vs. actual tracking
- Integration with accounting tools (QuickBooks, etc.)

**Critical Rules:**
- **Never invent a number** — all figures come from data sources or scripts
- **Confirmation protocol mandatory** for any write/send action
- **Kill switch absolute** — if reminders_enabled is false, send zero reminders
- **Not tax advice** — always disclaim, suggest CPA for tax questions
- Scripts handle calculations; agent handles judgment and communication

**Cross-references:**
- Routes TO → `client-onboarding` (new client needs billing setup)
- Routes TO → `email-meeting-summary` (financial emails need summarizing)
- Receives FROM → `executive-assistant` (expense/budget requests)
- Receives FROM → `daily-briefing` (AR/AP alerts in morning brief)

---

### 11. content-creator

**Name:** Content Creator
**ID:** `content-creator`
**Description:** Creates marketing content across channels — social media posts, blog articles, email campaigns, newsletters, and promotional materials. Maintains brand voice consistency.

**Trigger Phrases:**
- "Write a social media post about..."
- "Create content for..."
- "Blog post about..."
- "Email campaign for..."
- "Newsletter draft"
- "Marketing copy for..."
- "Write an ad for..."
- "Content calendar"
- "Post ideas for [platform]"
- "Promotional email for [event/sale]"
- "Caption for..."
- "Rewrite this for [platform]"
- "Social media strategy"

**Tier:** Premium
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Multi-platform content creation (Instagram, Facebook, LinkedIn, X, TikTok captions)
- Blog article drafting with SEO awareness
- Email marketing copy (campaigns, sequences, newsletters)
- Brand voice extraction and consistency
- Content calendar planning
- A/B copy variants for testing
- Promotional material writing
- Content repurposing across platforms
- Hashtag research and suggestions
- Call-to-action optimization

**Critical Rules:**
- **Deliver finished content** — don't narrate the process or ask permission at every step
- **Brand voice adherence** — extract from existing materials, maintain consistently
- **Platform-aware formatting** — Instagram ≠ LinkedIn ≠ Email
- **Never post without confirmation** — draft → approve → publish

**Cross-references:**
- Routes TO → `competitive-intel` (research competitor content)
- Routes TO → `knowledgebase` (pull product/service details for content)
- Receives FROM → `sales-outreach` (needs content for campaigns)
- Receives FROM → `executive-assistant` (marketing requests)

---

### 12. sales-outreach

**Name:** Sales Outreach
**ID:** `sales-outreach`
**Description:** Manages proactive sales communication — cold outreach, follow-up sequences, proposal drafting, and deal progression. Turns qualified leads into customers.

**Trigger Phrases:**
- "Follow up with [prospect]"
- "Draft a proposal for..."
- "Cold email to..."
- "Outreach sequence for..."
- "Sales email to..."
- "Follow up on the quote"
- "Close the deal with..."
- "Proposal for [client/project]"
- "Reach out to [prospect list]"
- "Sales pipeline" / "deal status"
- "Win back [churned client]"
- "Upsell [client] on..."

**Tier:** Premium
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Cold outreach email/message crafting (personalized)
- Follow-up sequence management (timing + content)
- Proposal and quote generation
- Deal progression tracking
- Pipeline health monitoring
- Win/loss analysis
- Upsell/cross-sell identification
- Personalization based on prospect research
- Multi-touch sequence design
- Response handling and next-step recommendations

**Critical Rules:**
- **Never send without confirmation** — all outbound requires explicit approval
- **Personalization mandatory** — no generic templates without customization
- **Respect opt-outs** — if prospect says no/stop, immediately cease
- **Honest positioning** — never misrepresent capabilities or make false promises

**Cross-references:**
- Routes TO → `client-onboarding` (deal closes → start onboarding)
- Routes TO → `content-creator` (needs sales collateral)
- Routes TO → `meeting-prep` (sales meeting coming up)
- Receives FROM → `lead-qualifier` (qualified lead ready for outreach)
- Receives FROM → `competitive-intel` (intelligence for positioning)

---

### 13. competitive-intel

**Name:** Competitive Intelligence
**ID:** `competitive-intel`
**Description:** Researches competitors, market positioning, and industry trends. Produces actionable intelligence for sales, strategy, and decision-making.

**Trigger Phrases:**
- "Research [competitor]"
- "How do we compare to..."
- "Competitive analysis"
- "What are [competitor] doing?"
- "Market research on..."
- "Who are our competitors?"
- "SWOT analysis"
- "Industry trends in..."
- "How is [competitor] pricing?"
- "Battlecard for [competitor]"
- "Win against [competitor]"
- "What's new in our market?"

**Tier:** Premium
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Competitor profiling (offerings, pricing, positioning, strengths/weaknesses)
- Market landscape mapping
- Pricing intelligence and comparison
- Feature/capability comparison matrices
- Battlecard generation for sales team
- Industry trend identification
- SWOT analysis generation
- News and signal monitoring
- Win/loss pattern analysis
- Strategic positioning recommendations

**Critical Rules:**
- **Source everything** — every claim needs attribution
- **Surface conflicts** — when sources disagree, show both sides
- **Confidence levels** — indicate how reliable each data point is
- **Lead with the answer** — deliver intelligence, not search process
- **Never fabricate competitive data** — if unknown, say so

**Cross-references:**
- Routes TO → `content-creator` (competitive positioning content)
- Routes TO → `sales-outreach` (intelligence for sales campaigns)
- Receives FROM → `meeting-prep` (competitor mentioned in upcoming meeting)
- Receives FROM → `executive-assistant` (strategic research request)
- Receives FROM → `daily-briefing` (competitive alerts)

---

### 14. daily-briefing

**Name:** Daily Briefing
**ID:** `daily-briefing`
**Description:** Delivers morning briefings with prioritized agenda, key metrics, pending items, and recommended focus areas. The business owner's "start of day" companion.

**Trigger Phrases:**
- "Morning briefing" / "daily brief"
- "What's on my plate today?"
- "Brief me"
- "What should I focus on?"
- "Start of day" / "morning update"
- "What happened overnight?"
- "Daily summary"
- "What's urgent today?"
- "Catch me up"
- "What did I miss?"
- "End of day summary" / "EOD recap"

**Tier:** Standard
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Morning priority briefing (Needs You / Handled / Watch format)
- Calendar overview with prep notes
- Inbox highlights (urgent, needs response, FYI)
- Key metrics snapshot (if connected)
- Pending follow-ups and deadlines
- Weather and commute info (if relevant)
- Yesterday's unresolved items
- End-of-day wrap-up with tomorrow preview
- Quick mode ("30-second brief") vs. full mode

**Mode Variants:**
- **Full morning brief**: Complete daily rundown
- **Quick brief**: 30-second priority summary ("quick brief", "tldr my day")
- **EOD recap**: End-of-day wrap-up and tomorrow preview
- **Catch-up**: What happened since last check-in

**Cross-references:**
- Routes TO → `meeting-prep` (today's meetings need prep)
- Routes TO → `email-meeting-summary` (inbox needs processing)
- Routes TO → `basic-secretary` (scheduling actions from brief)
- Routes TO → `financial-manager` (financial alerts need attention)
- Receives FROM → all agents (aggregates alerts and status)

---

### 15. appointment-scheduler

**Name:** Appointment Scheduler
**ID:** `appointment-scheduler`
**Description:** Manages customer-facing appointment booking, rescheduling, cancellation, and reminders. Integrates with business calendars to show real-time availability.

**Trigger Phrases:**
- "I'd like to book an appointment"
- "Schedule me for..."
- "What times are available?"
- "Can I come in on [day]?"
- "Reschedule my appointment"
- "Cancel my appointment"
- "When is my next appointment?"
- "Book a [service type]"
- "I need to see [provider/staff]"
- "Do you have availability [date/time]?"
- "Appointment reminder"
- "Confirm my booking"

**Tier:** Core
**Deployment Modes:** Standalone ✅ | Bundled ✅ | Master-routed ✅

**Capabilities:**
- Real-time availability checking
- Appointment booking with confirmation
- Rescheduling with conflict detection
- Cancellation with policy enforcement (notice periods, fees)
- Automated reminders (24h, 1h before — configurable)
- Multi-provider scheduling (book with specific staff member)
- Service-based duration estimation
- Waitlist management for full slots
- No-show tracking and policy application
- Calendar sync (Google Calendar, Outlook, custom)

**Critical Rules:**
- **Always confirm details** — repeat back date, time, service, provider before booking
- **Respect business hours** — never book outside configured availability
- **Cancellation policy enforcement** — inform customer of any fees/restrictions
- **Double-booking prevention** — never create overlapping appointments

**Cross-references:**
- Routes TO → `customer-service` (appointment issue becomes service complaint)
- Routes TO → `client-onboarding` (new client appointment → onboarding flow)
- Receives FROM → `basic-chatbot` (general conversation reveals booking intent)
- Receives FROM → `customer-service` (service resolution requires appointment)
- Receives FROM → `lead-qualifier` (prospect wants to book consultation)
- Receives FROM → `basic-secretary` (internal scheduling needs)

---

## Deployment Mode Details

### Standalone Mode
Single agent deployed with only core infrastructure:
- One specialist + base capabilities (language, escalation, business info)
- Optimized system prompt (minimal token usage)
- Best for: Businesses wanting one specific capability
- Model: Groq Llama (cost-optimized)

### Bundled Mode
Customer selects 2-5 agents:
- Selected specialists + base capabilities
- Inter-agent routing within the bundle
- Best for: Businesses with specific multi-area needs
- Model: GPT-4o-mini (handles multi-context)

### Master-Routed Mode
Full master agent with all enabled specialists:
- Master orchestrator routes to any available specialist
- Full inter-agent handoff capabilities
- Complete operating loop (Gather → Route → Execute → Track)
- Best for: Premium customers wanting full AI operations
- Model: GPT-4o-mini / Claude Sonnet (complex routing)

---

## System Prompt Construction

```
Master-Routed:
  System = BASE_PROMPT + BUSINESS_PROFILE + ROUTING_RULES + Σ(ENABLED_SKILLS) + CHANNEL + MEMORY + KB

Bundled:
  System = BASE_PROMPT(lite) + BUSINESS_PROFILE + Σ(SELECTED_SKILLS) + CHANNEL + MEMORY + KB

Standalone:
  System = SPECIALIST_PROMPT + BUSINESS_PROFILE + CHANNEL + MEMORY + KB
```

---

## Cost Matrix

| Mode | Avg Prompt Size | Recommended Model | Cost Tier |
|------|----------------|-------------------|-----------|
| Standalone (1 agent) | ~800 tokens | Groq Llama 3.1 8B | $ |
| Bundled (2-3 agents) | ~1,500 tokens | Groq Llama 3.1 70B | $$ |
| Bundled (4-5 agents) | ~2,500 tokens | GPT-4o-mini | $$$ |
| Master (standard) | ~3,500 tokens | GPT-4o-mini | $$$$ |
| Master (premium/all) | ~5,000 tokens | Claude Sonnet / GPT-4o | $$$$$ |

---

## Quick Reference: Routing by Category

### Sales Flow
```
lead-qualifier → sales-outreach → client-onboarding
```

### Support Flow
```
customer-service → knowledgebase → appointment-scheduler
```

### Productivity Flow
```
daily-briefing → meeting-prep → email-meeting-summary → basic-secretary
```

### Executive Flow
```
executive-assistant → [delegates to any specialist]
```

### Intelligence Flow
```
competitive-intel → content-creator / sales-outreach
```

### Finance Flow
```
financial-manager → [standalone, reports to executive-assistant]
```
