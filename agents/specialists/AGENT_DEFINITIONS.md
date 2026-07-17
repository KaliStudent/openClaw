# MainStreet AI — Specialist Agent Definitions

## Agent 1: Basic Chatbot Agent (Tier 1 — Core)

**ID:** `basic_chatbot`
**Model:** Cost-effective (Claude Haiku-level capability)
**Purpose:** Entry-level business chatbot with essential office and communication functions

### Capabilities
- Pre-programmed/scripted question-answer scenarios
- Bilingual communication (English/Spanish) via live chat
- Small task completion and list creation
- Document reading and summarization
- Basic fact-checking, spelling, grammar, and writing assistance
- Escalation to business entities via ticket creation
- Basic call answering and receptionist functionality
- Voice communication support

### Memory System
- Creates its own `memory.md` based on critical conversation points
- Each session creates a unique session directory
- Session data stored in Supabase database
- **Retention policy:**
  - Full session data: 7 days
  - After 7 days: summarized to pertinent customer details only → memory database
  - Memory database retention: 6 months from last interaction
  - After 6 months inactive: data purged
- Retained data (within 6 months) can be used for:
  - Lead contact list generation
  - Automated cold call promotional campaigns
  - Automated text message campaigns

### Document Drafting
- Excel spreadsheets
- Resumes
- Basic websites / landing pages
- Word documents
- Research papers
- PowerPoint slideshows
- General office document functions

### Knowledge Ingestion
- Learns from provided text documents and official documents
- Learns from provided websites and webpages
- Single-threaded web crawling (crawl → report → approve/reject → knowledge bank)
- No multi-agent crawling swarms

### Escalation
- Creates tickets for issues beyond its capability
- Routes to appropriate business department/entity
- Preserves conversation context in ticket

---

## Agent 2: Employee Assistant Agent

**ID:** `employee_assistant`
**Model:** Cost-effective+
**Purpose:** Internal employee support and productivity

### Sub-Specialties

#### 2a: Client Q&A & Lead Qualification Agent
**ID:** `lead_qualifier`
- Answer client questions about products/services
- Qualify and screen leads for sales representatives
- Score leads based on configurable criteria
- Route qualified leads to appropriate sales rep
- Capture lead contact info and interest details

#### 2b: Meeting Prep Agent
**ID:** `meeting_prep`
- Research attendees and companies
- Compile relevant notes from previous interactions
- Generate agenda suggestions
- Prepare talking points and data summaries
- Pull relevant documents and context

#### 2c: Client Onboarding Agent
**ID:** `client_onboarding`
- Guide new clients through setup process
- Collect required information/documents
- Send welcome sequences
- Schedule kickoff meetings
- Track onboarding progress and follow-ups

#### 2d: Email Inbox & Meeting Summary Agent
**ID:** `email_meeting_summary`
- Summarize email threads
- Prioritize inbox items
- Draft response suggestions
- Summarize meeting recordings/notes
- Extract action items and deadlines

#### 2e: Basic Secretary Agent
**ID:** `basic_secretary`
- All-purpose administrative support
- Calendar management
- Call screening and message taking
- Basic correspondence
- Filing and organization

---

## Agent 3: Executive Assistant Agent

**ID:** `executive_assistant`
**Model:** Higher-capability (handles complex tasks)
**Purpose:** Full-featured executive support — all office tasks combined

### Capabilities
- All capabilities of the Employee Assistant sub-agents combined
- Complex document preparation and editing
- Multi-calendar coordination
- Travel planning and booking
- Expense report preparation
- Board meeting preparation
- Confidential correspondence handling
- Priority management and delegation suggestions
- Cross-department coordination

### Deployment Note
This agent is a premium/add-on tier. It combines all Employee Assistant sub-specialties into one unified agent with elevated reasoning capability.

---

## Agent 4: Customer Service Agent

**ID:** `customer_service`
**Model:** Cost-effective
**Purpose:** Customer-facing support for product/service inquiries

### Capabilities
- Answer product/service questions
- Provide basic tiered pricing information
- Set up appointments
- Send emails to designated business email addresses
- Handle returns/exchange inquiries (per business policy)
- Track order status (with integration)
- Collect customer feedback

### Behavior
- Always professional and empathetic
- Follows configured escalation rules
- Never provides unauthorized discounts or policy exceptions
- Confirms appointment details before booking
- CC's designated email on all customer interactions requiring follow-up

---

## Agent 5: General Purpose Knowledgebase Agent

**ID:** `knowledgebase`
**Model:** Cost-effective
**Purpose:** Business knowledge repository with access-controlled information delivery

### Knowledge Tiers

#### Public Knowledge
- Product/service information
- Installation instructions
- How-to guides
- FAQ content
- Pricing (public tier)
- Hours, locations, policies

**Access:** Anyone (customers, public website visitors)

#### Customer Knowledge
- Product-specific documentation for purchased items
- Setup guides for owned products
- Warranty information
- Account-specific details

**Access:** Verified/known customers only (matched against customer database)

#### Employee Knowledge (Internal Only)
- Company policies and procedures
- Internal pricing/margin information
- Employee handbooks
- Vendor contacts and agreements
- Internal processes and SOPs
- Product roadmap/unreleased information

**Access:** Authenticated employees only — labeled and restricted

### Knowledge Ingestion
- Learns from provided text documents and official documents
- Learns from provided websites and webpages
- Single-threaded web crawling (crawl → report findings → admin approves/rejects → knowledge bank)
- No multi-agent crawling swarms
- Knowledge items tagged with access tier (public/customer/employee)

### Access Control
- Agent identifies requester type (public, customer, employee)
- Employees can be "in the field" and access internal docs via authenticated session
- Customer verification before providing customer-tier info
- Never leaks employee-tier info to customers or public
- Logs all access for audit trail

---

## Shared Infrastructure

### Memory System (All Agents)
```
Session Created → memory.md generated per session
       ↓
Stored in Supabase (session directory)
       ↓
7 days: Full session data accessible
       ↓
After 7 days: Auto-summarize → pertinent details only → memory DB
       ↓
6 months (from last customer interaction): Data accessible for lead gen
       ↓
After 6 months inactive: Data purged
```

### Knowledge Bank System (Basic Chatbot + Knowledgebase)
```
Source (document/URL) → Crawl/Ingest
       ↓
Report findings to admin
       ↓
Admin approves/rejects
       ↓
Approved → Knowledge Bank (tagged with access tier)
       ↓
Available to agent during conversations
```

### Web Crawling Rules
- Single crawler per request (no spawning multiple agents)
- Crawl → Report → Human reviews → Approve/Remove
- Respects robots.txt
- Rate limited (polite crawling)
- Results presented for human approval before entering knowledge bank

---

## Deployment Matrix

| Agent | Standalone | Part of Master | Add-on |
|-------|-----------|---------------|--------|
| Basic Chatbot | ✅ | ✅ | No (base tier) |
| Lead Qualifier | ✅ | ✅ | No |
| Meeting Prep | ✅ | ✅ | No |
| Client Onboarding | ✅ | ✅ | No |
| Email/Meeting Summary | ✅ | ✅ | No |
| Basic Secretary | ✅ | ✅ | No |
| Executive Assistant | ✅ | ✅ | Yes (premium) |
| Customer Service | ✅ | ✅ | No |
| Knowledgebase | ✅ | ✅ | No |

All agents can be deployed:
1. **Standalone** — locked to one specialty per customer
2. **As part of Master** — master agent has all skills, switches as needed
3. **Combined** — customer picks 2-3 agents to bundle for their deployment
