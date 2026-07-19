# Master Agent — Routing Decision Tree

> How the master agent decides which specialist to invoke, resolves conflicts,
> manages handoff sequences, and handles edge cases.

---

## Routing Algorithm

### Step 1: Intent Classification

When a message arrives, classify into one of these intent categories:

```
┌─────────────────────────────────────────────────────────────────────┐
│  INTENT CATEGORIES                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  SALES        → lead-qualifier, sales-outreach                       │
│  SUPPORT      → customer-service, knowledgebase                      │
│  SCHEDULING   → appointment-scheduler, basic-secretary               │
│  PRODUCTIVITY → meeting-prep, email-meeting-summary, daily-briefing  │
│  ADMIN        → basic-secretary, executive-assistant                 │
│  FINANCE      → financial-manager                                    │
│  MARKETING    → content-creator                                      │
│  STRATEGY     → competitive-intel                                    │
│  ONBOARDING   → client-onboarding                                    │
│  GENERAL      → basic-chatbot (fallback)                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Step 2: Trigger Phrase Matching

```python
# Pseudocode for routing logic
def route(message, enabled_agents):
    # 1. Exact trigger phrase match
    matches = find_trigger_matches(message, SKILL_REGISTRY)
    
    # 2. Filter by availability
    available = [m for m in matches if m.agent_id in enabled_agents]
    
    # 3. If single match → route
    if len(available) == 1:
        return available[0]
    
    # 4. If multiple matches → apply priority rules
    if len(available) > 1:
        return resolve_priority(available, message_context)
    
    # 5. If no match → intent-based routing
    intent = classify_intent(message)
    candidates = get_agents_for_intent(intent, enabled_agents)
    
    if candidates:
        return candidates[0]  # highest priority for intent
    
    # 6. Fallback to basic-chatbot
    return "basic-chatbot"
```

### Step 3: Priority Resolution

When multiple agents could handle a request:

---

## Priority Rules

### Rule 1: Specificity Wins

More specific agent beats more general agent.

| Request | Candidates | Winner | Reason |
|---------|-----------|--------|--------|
| "Book an appointment" | appointment-scheduler, basic-secretary | **appointment-scheduler** | More specific to booking |
| "What are your hours?" | knowledgebase, basic-chatbot | **knowledgebase** | KB is purpose-built for info |
| "Send a follow-up email" | sales-outreach, email-meeting-summary, basic-secretary | **sales-outreach** (if sales context) / **email-meeting-summary** (if meeting context) | Context determines specificity |
| "Help me write something" | content-creator, basic-chatbot | **basic-chatbot** (general) / **content-creator** (if marketing context) | Ambiguous → use context |

### Rule 2: Context Trumps Keywords

Recent conversation context overrides isolated keyword matching.

```
IF conversation has been about sales → sales-related agents get priority boost
IF conversation has been about support → support-related agents get priority boost
IF conversation started as lead qualification → maintain that flow
```

### Rule 3: Customer Type Determines Route

| Requester | Default Priority |
|-----------|-----------------|
| New/Unknown visitor | lead-qualifier > customer-service > basic-chatbot |
| Existing customer | customer-service > appointment-scheduler > knowledgebase |
| Business owner/staff | executive-assistant > daily-briefing > basic-secretary |
| Identified prospect | sales-outreach > lead-qualifier > appointment-scheduler |

### Rule 4: Channel Influences Priority

| Channel | Priority Boost |
|---------|---------------|
| Phone/Voice | appointment-scheduler, customer-service (people calling want action) |
| Web Chat | basic-chatbot, knowledgebase (browsing, exploring) |
| Email | email-meeting-summary, sales-outreach (async communication) |
| SMS | appointment-scheduler, basic-secretary (quick actions) |

### Rule 5: Premium Subsumes Standard

If a premium agent is available and covers the same ground as a standard agent:
- `executive-assistant` subsumes `basic-secretary` + `meeting-prep` + `email-meeting-summary`
- Route to the premium agent for unified handling

**Exception:** If the request is simple and clearly within a standard agent's scope, use the standard agent to optimize cost/tokens.

---

## Handoff Sequences

### Sales Pipeline Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│ lead-qualifier   │────▶│ sales-outreach   │────▶│ client-onboarding   │
│                  │     │                  │     │                     │
│ Qualifies lead   │     │ Sends proposal   │     │ Guides new client   │
│ Scores fit       │     │ Manages follow-up│     │ through setup       │
│ Captures info    │     │ Closes deal      │     │                     │
└─────────────────┘     └─────────────────┘     └─────────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
 appointment-scheduler    meeting-prep             appointment-scheduler
 (book consultation)      (prep for sales call)    (schedule kickoff)
```

**Handoff triggers:**
- lead-qualifier → sales-outreach: Lead scores "hot" or explicitly requests pricing/proposal
- sales-outreach → client-onboarding: Deal marked as "closed-won"
- Any stage → appointment-scheduler: Prospect/client wants to book a time

### Support Resolution Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│ customer-service │────▶│ knowledgebase    │────▶│ appointment-scheduler   │
│                  │     │                  │     │                         │
│ Identifies issue │     │ Finds answer     │     │ Books service appt      │
│ De-escalates     │     │ Provides docs    │     │ if in-person needed     │
│ Resolves or      │     │                  │     │                         │
│ escalates        │     │                  │     │                         │
└─────────────────┘     └─────────────────┘     └─────────────────────────┘
        │
        ▼
   HUMAN ESCALATION
   (if unresolvable)
```

**Handoff triggers:**
- customer-service → knowledgebase: Issue requires policy/product lookup
- customer-service → appointment-scheduler: Resolution requires in-person visit
- customer-service → HUMAN: Customer requests manager OR issue is beyond policy

### Morning Briefing Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│ daily-briefing   │────▶│ meeting-prep     │────▶│ email-meeting-      │
│                  │     │                  │     │ summary             │
│ Surfaces today's │     │ Preps for key    │     │                     │
│ priorities       │     │ meetings         │     │ Processes inbox     │
│                  │     │                  │     │ Extracts actions    │
└─────────────────┘     └─────────────────┘     └─────────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
 basic-secretary          competitive-intel         basic-secretary
 (schedule actions)       (if competitor meeting)   (schedule follow-ups)
```

**Handoff triggers:**
- daily-briefing → meeting-prep: Briefing identifies meeting needing prep
- daily-briefing → email-meeting-summary: Unread priority emails flagged
- meeting-prep → competitive-intel: Meeting involves competitor discussion

### Executive Delegation Flow

```
┌─────────────────────┐
│ executive-assistant  │
│                      │
│ Receives complex     │
│ request, breaks into │
│ component tasks      │
└──────────┬───────────┘
           │
     ┌─────┼─────────────┬──────────────┬──────────────┐
     ▼     ▼             ▼              ▼              ▼
 meeting  financial   content      competitive    basic
  -prep   -manager    -creator     -intel         -secretary
           
           │
           ▼
   Collects results, synthesizes,
   reports back to user
```

**Handoff triggers:**
- executive-assistant → any specialist: EA breaks down request and delegates
- EA maintains oversight of all delegated tasks
- EA synthesizes results before presenting to user

---

## Escalation Paths

### Tier 1: Agent-to-Agent Escalation

When a specialist can't handle something, it routes back to master:

```
Specialist detects out-of-scope request
    → Returns to master with context + reason
        → Master routes to appropriate specialist
            OR handles with base capabilities
            OR escalates to Tier 2
```

### Tier 2: Agent-to-Human Escalation

Automatic escalation triggers:
- Customer explicitly requests human ("let me talk to a person")
- Issue requires authorization the agent doesn't have
- Emotional intensity exceeds threshold (anger, distress)
- Legal or liability-sensitive situation
- Financial transaction above configured limit
- 3+ failed resolution attempts

Escalation format:
```markdown
## 🚨 Escalation to Human Staff

**Customer:** [Name if known]
**Channel:** [phone/chat/email]
**Issue:** [One-line summary]
**Context:** [Relevant conversation history]
**Attempted:** [What agent tried]
**Recommended:** [Suggested next step for human]
**Urgency:** [Low/Medium/High/Critical]
```

### Tier 3: System Fallback

When the system itself has issues:
```
Primary model unavailable → Try fallback model
Fallback unavailable → Static response: "I'm having technical difficulties. 
  Let me connect you with [business] directly. You can reach them at [contact]."
All agents failing → Basic chatbot with cached KB only
```

---

## Conflict Resolution

### Same-Category Conflicts

| Conflict | Resolution |
|----------|-----------|
| `basic-secretary` vs `appointment-scheduler` | If customer-facing booking → scheduler. If internal calendar → secretary. |
| `basic-chatbot` vs `knowledgebase` | If answer is in KB → knowledgebase. If general conversation → chatbot. |
| `email-meeting-summary` vs `basic-secretary` | If summarizing/analyzing → email-meeting-summary. If sending/scheduling → secretary. |
| `lead-qualifier` vs `customer-service` | If new prospect → lead-qualifier. If existing customer → customer-service. |
| `executive-assistant` vs `basic-secretary` | If complex/multi-step → EA. If simple admin → secretary (cost optimization). |
| `content-creator` vs `basic-chatbot` | If marketing/brand content → content-creator. If one-off writing → chatbot. |

### Ambiguous Requests

When intent is genuinely unclear:

1. **Check conversation history** — prior context usually disambiguates
2. **Check requester type** — owner vs customer vs prospect
3. **Ask a clarifying question** — "Are you looking to [option A] or [option B]?"
4. **Default to broader agent** — basic-chatbot handles gracefully, can re-route later

### Multi-Intent Messages

When a single message contains multiple intents:

```
"Book me an appointment for Thursday AND send a follow-up email to the client from yesterday"
```

Resolution:
1. Identify all intents: [appointment-scheduler] + [email-meeting-summary or sales-outreach]
2. Execute sequentially (most urgent first, or order mentioned)
3. Track both as pending until complete
4. Report combined results

---

## Fallback Behavior

### When Specialist is Unavailable (Not in Plan)

```
User triggers a specialist NOT in their deployment config:

1. Acknowledge the need genuinely
2. Handle what you CAN with available capabilities
3. Note the gap (for upsell opportunity, NOT pushy)
4. Offer alternative: human staff OR available agent workaround

Example:
User: "Do competitive research on [company]"
Config: No competitive-intel agent

Response: "I can look up basic public information about [company] for you. 
For a full competitive analysis with pricing intelligence and battlecards, 
that's part of our Premium plan. Would you like me to share what I can find, 
or connect you with the team?"
```

### When Specialist Fails Mid-Task

```
1. Capture partial results
2. Explain what was completed and what wasn't
3. Offer alternatives:
   - Retry with simpler approach
   - Route to different specialist
   - Escalate to human
4. Never leave user hanging without explanation
```

### Universal Fallback Response

If absolutely nothing works:
```
"I'm not able to help with that right now, but I don't want to leave you stuck. 
Here's what I'd suggest: [concrete next step — call the office, email, try again later].
Is there anything else I can help with?"
```

---

## Routing Decision Flowchart

```
MESSAGE RECEIVED
       │
       ▼
┌─────────────────────┐
│ Detect Language      │──── Set language context (EN/ES)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌──────────────────┐
│ Exact Trigger Match? │─YES─▶│ Agent Available?  │─YES─▶ ROUTE TO SPECIALIST
└──────────┬──────────┘     └────────┬─────────┘
           │NO                       │NO
           ▼                         ▼
┌─────────────────────┐     ┌──────────────────┐
│ Intent Classify      │     │ Graceful Degrade  │
└──────────┬──────────┘     └──────────────────┘
           │
           ▼
┌─────────────────────┐
│ Multiple Matches?    │─YES─▶ APPLY PRIORITY RULES ─▶ ROUTE
└──────────┬──────────┘
           │NO
           ▼
┌─────────────────────┐
│ Single Match Found?  │─YES─▶ ROUTE TO SPECIALIST
└──────────┬──────────┘
           │NO
           ▼
┌─────────────────────┐
│ General/Ambiguous?   │─YES─▶ basic-chatbot (can re-route later)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Completely Unknown   │─────▶ Ask clarifying question
└─────────────────────┘
```

---

## Performance Optimization

### Token-Aware Routing

- Simple requests (FAQ, hours, booking) → Smallest model sufficient
- Complex requests (research, analysis, multi-step) → Upgrade model for that turn
- After specialist completes → Return to base model for delivery

### Parallel Execution

When multiple specialists are needed and have no dependencies:
```
"Brief me and prep for my 2pm meeting"
  → daily-briefing (no dependency)  ┐
  → meeting-prep (no dependency)    ├── Execute in parallel
                                    ┘
  → Combine results → deliver unified response
```

### Routing Cache

For repeat patterns:
- Same customer asking same type of question → Skip classification, direct route
- Business-specific patterns (dentist office gets 80% appointment requests) → Boost appointment-scheduler priority
- Time-of-day patterns (morning = briefings, afternoon = admin) → Adjust routing weights
