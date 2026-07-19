# Daily Briefing — Reference

Detailed protocols, priority frameworks, and operational rules for the Daily Briefing agent.

---

## Priority Framework

### The Urgency × Impact Matrix

Every item in the briefing gets assessed on two dimensions:

| | High Impact | Low Impact |
|---|---|---|
| **Urgent (today)** | 🔴 Needs You #1 | Needs You (but quick) |
| **Important (this week)** | 🟡 Watch / Schedule | FYI only |
| **Low urgency** | 🟢 Weekly review item | Don't include in daily brief |

### What Qualifies as "Needs You"

An item goes in "Needs You" ONLY if:
1. Only the business owner can make this decision/take this action
2. It's time-sensitive (today or tomorrow)
3. Someone is waiting on it (blocking them)
4. Inaction has real consequences (missed deadline, lost deal, upset customer)

**NOT "Needs You":**
- Informational items ("FYI, John called")
- Things the agent can handle ("I'll reply to confirm the appointment")
- Things that can wait a week
- Routine items without deadlines

### Prioritization Rules

Within "Needs You," rank items by:
1. **Revenue impact** — Will this make or lose money today?
2. **People waiting** — Is a customer, employee, or partner blocked?
3. **Time sensitivity** — Does the window close today?
4. **Cascading effects** — Will inaction today create bigger problems tomorrow?

### The #1 Priority Selection

Every briefing has exactly ONE #1 priority. It's the answer to: "If you only do ONE thing today, do this."

Selection criteria:
- Highest combined urgency + impact
- Most costly to ignore
- Most time-sensitive
- Tie-breaker: revenue-affecting beats everything else

---

## Information Gathering Protocol

### Calendar Analysis (When Connected)

**What to extract from each meeting:**
1. Who's attending (internal vs. external — external meetings get more context)
2. Meeting type (decision meeting, update, sales call, check-in)
3. Prep required (anything the owner needs to review/prepare)
4. Follow-up from last meeting (if recurring)
5. Conflict detection (double-bookings, back-to-back without breaks)

**What to surface:**
- Back-to-back meetings with no breaks (flag: "You have 4 hours straight with no gap")
- Meetings without agendas (flag: "No agenda set for [meeting] — need to prep?")
- New meetings added since last briefing
- Cancelled or rescheduled meetings

### Email Analysis (When Connected)

**What to check:**
1. Unread count + high-priority senders
2. Messages from customers/clients (always surface)
3. Messages over 24 hours old without response (aging)
4. Sent messages waiting for reply (track responsiveness of others)
5. Thread activity (new replies to conversations the owner is in)

**Priority email senders (always surface):**
- Active customers with open projects
- Prospects in active sales conversations
- Key vendors/partners
- Employees with questions/issues
- Anyone the owner explicitly asked to watch

**Email triage categories:**
- 🔴 Reply today (customer waiting, deadline-linked)
- 🟡 Reply this week (important but not urgent)
- 🟢 FYI / Archive (newsletters, notifications, automated)
- ⚫ Delegatable (things the agent or staff can handle)

### Pipeline/CRM Analysis (When Connected)

**What to check:**
1. Deals closing this week (any blockers?)
2. Deals that have stalled (no activity 7+ days)
3. New leads/inquiries received
4. Overdue tasks or follow-ups
5. Stage changes (deals moving forward or backward)

**Alert thresholds:**
| Condition | Alert Level |
|-----------|-------------|
| Deal closing today with unsigned contract | 🔴 Critical |
| Deal stalled 7+ days | 🟡 Medium |
| New lead uncontacted 24+ hours | 🟡 Medium |
| Pipeline below monthly target at mid-month | 🟡 Medium |
| Deal moved backward | 🟡 Medium |
| Overdue task | 🟡 Medium |

---

## Briefing Delivery Protocols

### Timing Guidelines

| Brief Type | Best Time | Why |
|------------|-----------|-----|
| Morning brief | 30-60 min before owner's workday starts | They see it when they sit down |
| Mid-day check-in | Only if triggered by urgent event | Don't interrupt without cause |
| EOD wrap-up | 30 min before owner typically stops working | Captures full day while fresh |
| Weekly review | Sunday evening or Monday first thing | Sets the week's focus |

### Adapting to Owner's Style

**Some owners want detail:**
- Full briefing every morning
- All sections populated
- Multiple FYI items
- Prefer to scan everything themselves

**Some owners want headlines only:**
- Quick brief format daily
- Full brief only on Mondays
- "Just tell me what's broken"
- Prefer maximum delegation

**Detect preference through:**
- What they respond to (detailed answers = they like detail)
- What they skip (sections they never engage with = remove them)
- Direct feedback ("too much," "give me more detail on pipeline")
- Time patterns (if they only read briefs at 6 AM, they want them concise)

### Channel-Specific Formatting

**Chat/SMS delivery:**
- No tables (doesn't render well)
- Use bullet points and bold
- Shorter sentences
- Link to full brief if they want more

**Email delivery:**
- Full format with tables
- Mobile-friendly (short paragraphs)
- Put #1 priority in subject line
- Use headers for scannability

---

## The "Nothing Urgent" Briefing

When there's genuinely nothing urgent:

```markdown
# ☀️ Morning Briefing | [Date]

## 🟢 All Clear

No urgent items this morning. Here's your day:

**Meetings:** [N] — [times and with whom]
**Open items:** [N] rolling from this week (none overdue)
**Pipeline:** Healthy — [X deals] in motion, [Y] closing this week

**Suggestion:** Good day to tackle [that thing that keeps getting pushed] or [proactive project].

*I'll ping you if anything urgent comes in.*
```

**Don't invent urgency.** An "all clear" briefing is valuable — it gives the owner permission to focus on non-reactive work.

---

## Carry-Forward and Loop Closing

### The Aging Protocol

Track how long items have been open:

| Age | Action |
|-----|--------|
| Day 1 | Mention in Needs You or Watch |
| Day 3 | Elevate if still unresolved. Ask: "Still a priority?" |
| Day 7 | Flag explicitly: "This has been open a week — [options]" |
| Day 14 | Direct question: "Should we drop this, delegate it, or schedule it?" |
| Day 21+ | Move to weekly review only. It's not a daily priority if it's been 3 weeks. |

### Closing Items Properly

An item is "closed" when:
1. Action was taken AND outcome is confirmed
2. Owner explicitly says "drop it" or "no longer needed"
3. It was delegated AND the delegate confirmed completion
4. The deadline passed and it's no longer relevant

**Never silently drop items.** Even if something seems obsolete, confirm: "Removing [X] from tracking since [reason]. Let me know if that's wrong."

### The Commitment Log

Maintain across briefings:

```markdown
## Active Commitments

### You Committed To:
| To Whom | What | By When | Status | Days Open |
|---------|------|---------|--------|-----------|
| [Person] | [Promise] | [Date] | [Status] | [N] |

### Others Committed To You:
| From Whom | What | By When | Status | Days Waiting |
|-----------|------|---------|--------|--------------|
| [Person] | [Promise] | [Date] | [Status] | [N] |
```

Surface overdue commitments (both directions) in every briefing.

---

## Situational Briefing Variants

### "Catch Me Up" (After Absence)

When the owner returns from PTO, sick day, or busy stretch:

1. **Span:** Cover the full absence period
2. **Structure:** Start with "here's where things stand NOW" before "here's what happened"
3. **Prioritize:** What needs attention today first, then chronological recap
4. **Group:** By topic/project, not chronologically
5. **Length:** Scale to absence length (1 day = quick; 1 week = comprehensive)

### Pre-Meeting Briefing

When the owner has an important meeting today:

- Pull context: who's attending, last meeting notes, open items with attendees
- Suggest talking points
- Flag anything the attendee recently emailed/mentioned
- Note relationship context (how long, what's the dynamic)

### Crisis Briefing

When something goes wrong (bad review, lost customer, staff issue):

1. **Facts first:** What happened, when, who's involved
2. **Impact assessment:** How bad is this? Who's affected?
3. **Current state:** What's been done so far?
4. **Options:** What can the owner do right now? (2-3 concrete options)
5. **Recommendation:** What would you suggest?

### Holiday/Weekend Briefing

- Shorter format (quick brief, not full)
- Only surface truly urgent items
- Batch everything else for Monday morning
- Include: "Enjoy your weekend. Nothing here can't wait."

---

## Weather Integration (For Relevant Businesses)

Include weather when the business is affected:

| Business Type | Weather Matters Because |
|--------------|------------------------|
| Landscaping / Outdoor services | Rain cancels jobs |
| Restaurants with patios | Affects seating capacity |
| Retail (foot traffic) | Snow/rain reduces walk-ins |
| Construction | Safety + scheduling |
| Events / Photography | Outdoor plans |
| HVAC / Plumbing | Extreme temps = surge |
| Auto repair | Ice = accidents = business |

**Weather format in briefing:**
```
**Weather:** [Condition], [High/Low]°F. [Business impact if any.]
```

Example: "Weather: Rain expected 2-6 PM, 72°F. Consider rescheduling the Johnson landscaping job or moving to Thursday."

---

## Numbers to Track

### Universal Metrics (All Businesses)

| Metric | Where to Find | Alert If |
|--------|---------------|----------|
| Revenue (this month) | CRM/Accounting | Below target at mid-month |
| New leads/inquiries | CRM/Phone/Email | Zero for 3+ days |
| Active customers | CRM | Sudden drop |
| Overdue invoices | Accounting | Any over 30 days |
| Upcoming payroll | Accounting/Calendar | Within 3 days |

### Service Business Metrics

| Metric | Alert If |
|--------|----------|
| Open appointments this week | Below average |
| Cancellation rate | Above 15% |
| Average ticket value | Dropping trend |
| Review count/rating | New negative review |

### Retail Metrics

| Metric | Alert If |
|--------|----------|
| Daily/weekly sales | Below same period last year |
| Inventory alerts | Key items low stock |
| Foot traffic | Significant drop |

---

## Handoff to Other Agents

The daily briefing frequently identifies work for other agents:

| Situation Detected | Handoff To | Action |
|-------------------|-----------|--------|
| New lead uncontacted | sales-outreach | "Want me to draft an outreach email?" |
| Content due today | content-creator | "Ready to draft today's social post?" |
| Competitor mentioned | competitive-intel | "Want me to research what they're doing?" |
| Appointment request | appointment-scheduler | "Want me to book this?" |
| Meeting today | meeting-prep tools | "Want me to prep context for your 2 PM?" |

Always offer the handoff — don't just route silently. The owner should know what's happening.
