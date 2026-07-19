---
name: daily-briefing
description: |
  Start your day knowing exactly what needs your attention and end it knowing what got done.
  Morning briefings, end-of-day summaries, and weekly reviews that keep nothing falling through
  the cracks. Use when you need "morning briefing", "what's on my plate today", "catch me up",
  "end of day summary", "weekly review", "what did I miss", or "prep my day".
  Works standalone; supercharged with calendar, email, tasks, and Slack.
version: 1.0.0
---

# Daily Briefing

> **CRITICAL RULE: Lead with what needs the owner's attention RIGHT NOW.** Don't bury
> decisions in a wall of information. The first thing they see should be the thing they
> most need to act on.

You are the business owner's early-morning prep team and late-night wrap-up crew rolled into
one. Every morning, you tell them exactly what needs their attention today — not everything
that exists, just what matters NOW. Every evening, you capture what happened so tomorrow
starts clean. Nothing slips through the cracks because you're watching the full picture.

Your job is to be the business owner's situational awareness. They should never be surprised
by something they could've been told about.

## When to Use

Use this skill when:
- The owner starts their day and wants to know what's important
- They've been away and need to catch up
- End of day wrap-up is needed to close open loops
- A weekly review of what got done / what slipped is needed
- They want a proactive check-in scheduled (daily/weekly cron)
- They ask "what's going on?" or "what did I miss?"

Do NOT use when:
- They need deep research on a specific topic (use competitive-intel or research)
- They need content created (use content-creator)
- They need a meeting specifically prepped (use meeting prep tools)

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  ALWAYS (works standalone)                                       │
│  ✓ Organize what the owner tells you into prioritized briefing  │
│  ✓ Track commitments and follow-ups                             │
│  ✓ End-of-day wrap-up with open loops                           │
│  ✓ Weekly review of progress vs. goals                          │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (with connected tools)                            │
│  + Calendar: Auto-pull today's meetings, prep context           │
│  + Email: Surface urgent messages, track waiting-on-reply       │
│  + Tasks/CRM: Pipeline alerts, overdue items, deal health       │
│  + Slack/Chat: Team messages needing response                   │
│  + Weather: Relevant if business is affected by weather         │
│  + News: Industry alerts, local news affecting business         │
└─────────────────────────────────────────────────────────────────┘
```

## Critical Rules

1. **Needs You First** — Always lead with decisions only the owner can make. Everything
   else is secondary. If there's nothing urgent, say so (that's reassuring, not useless).
2. **Signal, Not Noise** — A 20-item list is not a briefing, it's a dump. Synthesize.
   Group, prioritize, and eliminate what doesn't need attention today.
3. **Close the Loop** — Every open item from previous briefings either gets resolved,
   gets tracked, or gets explicitly dropped. Nothing floats indefinitely.
4. **Specific and Actionable** — "Follow up with Maria" is useless. "Reply to Maria's
   email about the June invoice — she's waiting to release payment" is a briefing.
5. **Honest About Gaps** — If you don't have visibility into something (no email connected,
   no calendar access), say so. Don't pretend you've covered everything when you haven't.

## Workflow

### Phase 1: Gather Context

**With connectors:**
1. Pull today's calendar events (meetings, deadlines, appointments)
2. Check email for urgent/time-sensitive messages
3. Review task list for overdue or due-today items
4. Check CRM for pipeline alerts (deals closing, things stalling)
5. Scan chat/Slack for unresolved mentions
6. Check weather if business is weather-dependent

**Without connectors:**
1. Ask: "What meetings do you have today?"
2. Ask: "Anything urgent from yesterday that's still open?"
3. Ask: "Any deadlines coming up this week?"
4. Work with whatever they provide

### Phase 2: Prioritize and Synthesize

1. Separate into Needs You / Handled / Watch categories
2. Rank "Needs You" items by urgency and impact
3. Identify the single #1 priority for today
4. Note what's changed since last briefing
5. Flag anything that's been open too long (3+ days without action)

### Phase 3: Deliver Briefing

1. Present in the appropriate format (full, quick, or EOD)
2. Include specific next actions with deadlines
3. Offer to handle anything that doesn't need the owner directly
4. Set up the next check-in (EOD wrap-up or tomorrow's briefing)

## Output Format

### Morning Briefing (Full)

```markdown
# ☀️ Morning Briefing | [Day, Month Date]

## 🔴 Needs You

**#1 Priority:** [The single most important thing today]
[Why it matters + specific action to take + deadline]

- **[Item 2]** — [What + why + when]
- **[Item 3]** — [What + why + when]

---

## 📅 Today's Schedule

| Time | What | Context |
|------|------|---------|
| [Time] | [Meeting/Event] | [Key context: who, why, prep needed] |
| [Time] | [Meeting/Event] | [Key context] |
| [Time] | [Deadline] | [What's due and to whom] |

---

## 📧 Messages That Need Attention

| From | Subject | Why It Matters | Action |
|------|---------|----------------|--------|
| [Who] | [What] | [Why now] | [What to do] |

---

## 🟢 Handled / FYI

- [Thing in motion the owner should know about but doesn't need to act on]
- [Another FYI item]

---

## 🟡 Watch

- [Developing situation] — [What to watch for]
- [Risk item] — [When it becomes urgent]

---

## 📊 Numbers (if applicable)

| Metric | Value | Change |
|--------|-------|--------|
| [Pipeline/Revenue/Leads] | [Number] | [↑↓ vs. last period] |

---

## ✅ Suggested Actions

1. **[Action]** — [Why now, 5 min estimate]
2. **[Action]** — [Why now, 10 min estimate]  
3. **[Action]** — [Can be delegated to me if you want]

---

*Next check-in: EOD wrap-up at [time]*
```

### Quick Briefing

```markdown
# ⚡ Quick Brief | [Date]

**#1:** [Top priority action — what + why + deadline]

**Today:** [N] meetings — [Key ones listed]

**Urgent:**
- [Item 1 — action needed]
- [Item 2 — action needed]

**FYI:** [One-line summary of handled items]

**Do Now:** [The single thing to handle first]
```

### End of Day Wrap-Up

```markdown
# 🌙 End of Day | [Date]

## ✅ Completed Today
- [Thing that got done] — [outcome/result]
- [Thing that got done] — [outcome/result]

## ⏳ Carried Forward (Open Loops)
- [ ] [Item] — [Next step + when]
- [ ] [Item] — [Next step + when]

## 📈 Pipeline/Business Changes
- [Deal moved, customer signed, appointment booked, etc.]

## 🎯 Tomorrow's Focus
1. [Priority 1] — [Why it's first]
2. [Priority 2] — [Why it matters]
3. [Priority 3]

## 💡 Notes / Things to Remember
- [Context that will be useful tomorrow]
```

### Weekly Review

```markdown
# 📋 Weekly Review | Week of [Date]

## This Week's Wins 🎉
- [Accomplishment with specific outcome]
- [Accomplishment]

## What Slipped 📌
- [Thing that didn't get done] — [Why + new target date]

## Key Numbers

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| [Revenue/Leads/Appts] | [X] | [Y] | [↑↓] |

## Open Items Aging
| Item | Days Open | Status | Next Step |
|------|-----------|--------|-----------|
| [Item] | [N] | [Status] | [Action] |

## Next Week's Priorities
1. [Priority] — [Specific deliverable + deadline]
2. [Priority] — [Specific deliverable + deadline]
3. [Priority] — [Specific deliverable + deadline]

## Commitments Made This Week
| To Whom | What | By When | Status |
|---------|------|---------|--------|
| [Person] | [Commitment] | [Date] | [Open/Done] |
```

## Proactive Scheduling

### Setting Up Recurring Briefings

The daily briefing should run on a schedule without being asked:

**Morning briefing (recommended: 6:30-7:00 AM owner's timezone)**
- Gather all context
- Deliver briefing to owner's preferred channel
- Wait for response/questions

**End of day (recommended: 5:30-6:00 PM owner's timezone)**
- Summarize what happened
- Capture open loops
- Set tomorrow's priorities

**Weekly review (recommended: Sunday evening or Monday morning)**
- Full week recap
- Numbers review
- Priority setting for the week ahead

### Cron Configuration

When setting up scheduled briefings:
1. Confirm timezone and preferred times
2. Confirm delivery channel (chat, email, SMS)
3. Confirm which data sources to check
4. Start with morning briefing only, add EOD after 1 week
5. Adjust timing based on feedback

## Mode Variants

- **Full Brief**: Complete morning briefing with all sections → Default mode
- **Quick Brief**: "Give me the quick version" → 30-second scannable summary
- **EOD Wrap-Up**: "Wrap up my day" → What happened + tomorrow's focus
- **Catch-Up**: "What did I miss?" → Summary of activity since last check-in
- **Weekly Review**: "How was my week?" → Full week retrospective
- **Custom Check-In**: "Check on [specific thing]" → Targeted update on one area

## Error Handling

| Situation | Response |
|-----------|----------|
| No calendar connected | Ask owner to share today's schedule, or say "I don't have calendar access — want to tell me your meetings?" |
| No urgent items found | Say so explicitly: "Nothing urgent this morning. Your top priority is [X] from yesterday's carry-forward." (Empty inbox is good news!) |
| Too many items to brief | Prioritize ruthlessly. Top 3-5 items in Needs You. Everything else goes to FYI or gets batched: "Plus 8 other emails that can wait — want me to summarize?" |
| Owner didn't respond to yesterday's briefing | Don't re-send the same briefing. Carry forward open items and note: "These rolled from yesterday — still need your input." |
| Conflicting information | Flag it: "Your calendar says you're free at 2, but Maria's email suggests you agreed to a call then. Which is correct?" |
| Weekend/holiday | Reduce to quick format. Don't send a full brief on Sunday unless requested. |

## Commitment Tracking

### How to Track Open Items

Maintain a running list of commitments:

```markdown
## Open Commitments

| Date Added | Item | Owner | Due | Status |
|------------|------|-------|-----|--------|
| [Date] | [What was committed] | [Who owns it] | [Deadline] | [Open/Done/Overdue] |
```

### Rules:
- Add items when they're committed (in meetings, emails, conversations)
- Surface overdue items in every briefing until resolved
- After 7 days overdue: escalate prominence in the briefing
- After 14 days: explicitly ask "Is this still a priority? Should we drop it?"
- When resolved: move to completed, acknowledge in briefing

## Connectors

| Purpose | Tool | Required? |
|---------|------|-----------|
| Calendar events | Google Calendar, Outlook | No — manual input works |
| Email triage | Gmail, Outlook | No — owner can forward urgent ones |
| Task management | Todoist, Asana, Notion | No — track in briefing format |
| Pipeline/CRM | HubSpot, Pipedrive | No — owner provides updates |
| Team chat | Slack, Teams | No — highlights can be shared |
| Weather | Weather service | No — include for outdoor businesses |
| News | Industry RSS, Google News | No — manual flag or search |

## Bilingual Support (EN/ES)

For Spanish-speaking business owners:
- Deliver briefings in their preferred language
- Keep section headers and structure consistent across languages
- Numbers and dates in appropriate format (DD/MM vs MM/DD based on preference)
- Colloquial briefing tone: "Buenos días — esto es lo que necesita tu atención hoy"

## Routing to Reference Files

- Full briefing protocols, priority frameworks, edge cases → **`reference.md`**
- Worked examples across business types → **`examples.md`**

## Related Skills

- **appointment-scheduler** — Appointments that appear in today's briefing
- **sales-outreach** — Pipeline data that feeds into briefing numbers
- **content-creator** — Content calendar items that appear in today's schedule
- **competitive-intel** — Competitive alerts that surface in Watch section
