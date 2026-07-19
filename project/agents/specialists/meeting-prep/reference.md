# Meeting Prep — Reference

> Detailed research protocols, source hierarchy, and operational rules for the meeting prep skill.

## Source Hierarchy

When researching an attendee, check sources in this order. Stop when you have enough
context — don't over-research for a casual check-in.

### Priority Order

1. **CRM record** (highest signal) — Deal stage, past purchases, support history, account
   notes. This tells you the business relationship.
2. **Recent email threads** (last 30 days) — What's actively being discussed. Open proposals,
   pending decisions, complaints, follow-ups.
3. **Previous meeting notes** — What was promised, what was decided, action items from last time.
4. **Calendar history** — Frequency of meetings (weekly 1:1? quarterly review? first time?)
5. **Web search / LinkedIn** — Role, tenure, company context, recent news. Use for new contacts
   or when CRM/email don't have enough.
6. **Social media / press** — Only if the meeting warrants deep research (board prep, major
   prospect, investor meeting).

### Research Depth by Meeting Type

| Meeting Type | Research Depth | Time Budget |
|---|---|---|
| Recurring 1:1 (weekly/biweekly) | Shallow — action items + recent threads only | 30 seconds |
| Client check-in (monthly) | Medium — CRM + email + previous notes | 1 minute |
| New prospect / first meeting | Deep — full web research + CRM + email | 2-3 minutes |
| Board / investor meeting | Deep — company financials, recent news, market context | 3-5 minutes |
| Internal team meeting | Light — agenda + action items from last time | 15 seconds |

### When to Stop Researching

Stop researching when you have:
- The person's current role and company
- The nature of your relationship (new vs. ongoing)
- What happened last time you interacted
- What's currently open/pending between you
- Enough for 2-3 relevant talking points

If you hit a dead end on someone, don't spend more than 60 seconds trying alternatives.
Note the gap and move on.

## Attendee Context Rules

### What to Include

- Current title and company (from the most recent source)
- How the principal knows them (client, prospect, colleague, vendor, etc.)
- Last interaction — when and what about
- Open commitments in either direction
- Communication style notes if available (e.g., "prefers bullets over paragraphs")
- Deal stage / account status if in CRM
- Relevant news (promotion, company funding, acquisition) — last 30 days only

### What to Exclude

- Personal information not relevant to business context (age, family, etc. — unless the
  principal explicitly keeps these notes)
- Salary or compensation information (even if accessible)
- Information from confidential sources (other clients' data, internal HR notes)
- Speculation about motivations or feelings
- Stale information (>6 months old unless nothing newer exists)

### Handling Multiple Attendees

For meetings with 5+ attendees:
- Provide full context for the 2-3 most important attendees (decision makers, key contacts)
- Provide a brief line for others (name, role — no deep research)
- Ask the principal if they want deep research on anyone else

## Agenda Generation Rules

### Structure

1. **Opening** (5 min) — Relationship check, small talk, set expectations
2. **Core topics** (ordered by priority, not chronology)
3. **Decision points** (explicitly called out — "we need to decide X")
4. **Next steps** (5 min) — Action items, follow-ups, scheduling

### Agenda Principles

- Put the hardest/most important topic first (while energy is high)
- Every topic should have a clear "what we need from this" statement
- Suggest time allocations that are realistic (meetings always run over)
- If you know the meeting is 30 minutes, limit to 3 topics max
- For recurring meetings, check what rolled over from last time

### When NOT to Suggest an Agenda

- Informal catch-ups / relationship meetings (suggest talking points instead)
- Meetings where someone else is clearly the host/organizer (suggest questions to ask instead)
- When the meeting already has a published agenda (surface it, add your context on top)

## Talking Points Protocol

### Good Talking Points

- Reference something specific and recent ("I saw [company] just closed their Series B — congrats")
- Tie back to the meeting's purpose ("Since we're deciding on vendor X, here's what I found...")
- Address known concerns proactively ("I know timeline was a worry last time — here's where we are")
- Open doors for next steps ("If budget is approved, I'd love to discuss implementation timeline")

### Bad Talking Points

- Generic ("How's business going?") — too vague to be useful
- Based on fabricated info (obvious)
- Overly salesy when the relationship doesn't warrant it
- Referencing information the principal shouldn't know from this source

## Proactive Trigger Rules

When running in proactive/scheduled mode:

1. Check calendar 2 hours before each meeting
2. If meeting has external attendees → generate Full brief
3. If meeting is internal recurring → generate Quick brief (action items + agenda only)
4. If meeting has no title or attendees listed → skip (notify principal: "You have a meeting
   at [time] but I don't have details to prep")
5. Deliver via configured channel (Slack DM by default)
6. Never interrupt a meeting to deliver prep for the next one — hold until current meeting ends

## Handling Meeting Series

For recurring meetings (weekly 1:1s, biweekly syncs, etc.):

1. **Carry forward** — Always check previous meeting's action items
2. **Track patterns** — If the same topic keeps rolling over, flag it: "This has been
   discussed 3 weeks running without resolution"
3. **Evolve the brief** — Don't repeat static background info every week. Focus on
   what's changed since last time.
4. **Offer a summary** — For long-running series, periodically offer: "Want me to
   summarize the last 4 weeks of these meetings into themes?"

## Integration with Other Skills

### Handoff to email-meeting-summary (Post-Meeting)

After the meeting, prompt the principal: "How'd the meeting go? Want me to capture notes
and action items?" This triggers the email-meeting-summary skill.

Pass forward:
- The attendee list (already researched)
- The agenda (to compare what was planned vs. discussed)
- Open action items from previous meetings (to mark as complete or carry forward)

### Handoff from basic-secretary (Calendar Trigger)

When basic-secretary books a new meeting, it can trigger a meeting-prep research request:
- "New meeting booked with [attendees] on [date]. Want me to start prepping?"
- For meetings with new contacts, auto-trigger attendee research

### Handoff to executive-assistant (Complex Prep)

Escalate to executive-assistant when:
- Meeting requires document preparation (decks, reports, analysis)
- Multiple calendar coordination needed for prep meetings before the main one
- Confidential handling required (board meeting, personnel discussion)
- Travel logistics tied to the meeting (flying in for an in-person)
