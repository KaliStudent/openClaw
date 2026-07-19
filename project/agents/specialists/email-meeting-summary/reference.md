# Email & Meeting Summary — Reference

> Detailed prioritization rules, VIP handling, digest configuration, and operational protocols.

## Prioritization Framework

### The Priority Matrix

Priority is determined by two axes: **urgency** (time-sensitive) and **importance** (impact).

```
                    HIGH IMPORTANCE
                         │
         Needs You       │      Watch (becoming urgent)
         (Act now)       │      (Monitor)
                         │
   HIGH URGENCY ─────────┼───────── LOW URGENCY
                         │
         Handle quickly  │      Archive / FYI
         (Don't block)   │      (Batch process)
                         │
                    LOW IMPORTANCE
```

### Priority Signals

**🔴 Needs You (High urgency + High importance):**
- Direct question requiring the principal's unique knowledge/authority
- Decision that blocks other people's work
- Time-sensitive deadline (today or tomorrow)
- Client/customer with an active issue
- Revenue-impacting decision
- Escalation from team member who's stuck

**🟡 FYI / Handled (Important but not urgent, or urgent but not important):**
- Status updates on projects the principal cares about
- Confirmations and acknowledgments
- CC'd threads where principal isn't the actor
- Automated notifications from important systems
- Team wins and good news

**👀 Watch (Not urgent now, but could become important):**
- Early warning signs (customer complaint, budget variance, schedule slip)
- Threads where tone is shifting negative
- Requests with no deadline stated but likely to escalate
- Industry news that might affect strategy

**📦 Archive (Low urgency + Low importance):**
- Marketing emails and newsletters (unless specifically relevant)
- Automated system notifications with no action needed
- Social media notifications
- Spam and irrelevant outreach

### VIP Rules

A VIP contact is someone whose emails always get priority treatment, regardless of content:
- The principal's boss / board members / investors
- Top 5 clients by revenue
- Key partners or vendors
- Family members (if personal email is included)
- Anyone the principal explicitly marks as VIP

**VIP treatment:**
- Always surface in "Needs You" or "FYI" — never archive without showing
- Faster response drafting
- Note any change in communication tone/frequency

### Deprioritization Signals

Move items DOWN in priority when:
- The principal is CC'd (not TO'd) and multiple other people are on the thread
- It's a reply-all chain where others are handling it
- The sender is known to send low-priority bulk messages
- The email is clearly auto-generated
- It's a thread that's been going for days without the principal needing to act

## Email Summarization Rules

### Thread Summarization

For multi-message threads:

1. **Start with the current state** — What's the latest? What's the ask right now?
2. **Work backwards** — How did we get here? (Brief — 1-2 sentences)
3. **Skip the noise** — "Thanks!" "Got it!" "👍" — these don't need summarizing
4. **Preserve decisions** — If someone committed to something mid-thread, capture it
5. **Note tone shifts** — If the thread started friendly and got tense, note it

### Length Guidelines

| Thread Length | Summary Length |
|---|---|
| 1-3 messages | 1-2 sentences |
| 4-10 messages | 3-5 sentences + action items |
| 10-25 messages | Short paragraph + key decisions + action items |
| 25+ messages | Request permission to summarize last 10, or provide section summary |

### What to Always Include

- The current ask/status (what's needed NOW)
- Any deadlines mentioned
- Any commitments made (who said they'd do what)
- Changes in scope, timeline, or agreement
- Names of key participants (who's driving, who's blocking)

### What to Exclude

- Pleasantries and greetings
- Email signatures and disclaimers
- Repeated information across messages
- "Me too" and acknowledgment-only replies
- Thread participants who added nothing substantive

## Meeting Summary Rules

### Processing Meeting Transcripts

When working with a meeting transcript (raw or lightly edited):

1. **Identify speakers** — Map voices to names. If unclear, ask.
2. **Structure by topic** — Group the transcript by subject discussed, not chronologically
   (unless chronological order is important to understanding).
3. **Distinguish decisions from discussions** — A decision is "We agreed to X." A discussion
   is "We talked about X but didn't conclude."
4. **Capture the exact commitment** — "Sarah will send the proposal by Friday" not "Sarah
   is working on the proposal."
5. **Note what wasn't discussed** — If an agenda item was skipped, note it.

### Meeting Types and Focus

| Meeting Type | Focus Summary On |
|---|---|
| 1:1 | Action items, concerns raised, relationship dynamics |
| Team sync | Status updates, blockers, decisions |
| Client call | Commitments made, satisfaction signals, follow-ups |
| All-hands | Announcements, Q&A themes, action items |
| Board meeting | Decisions, directions, action items for management |
| Interview | Strengths, concerns, hiring decision factors |
| Brainstorm | Ideas generated (all of them), voted favorites, next steps |

### Action Item Extraction Rules

An action item must have:
- **WHO** — A specific person (not "the team" or "someone should")
- **WHAT** — A concrete deliverable or action (not "think about")
- **WHEN** — A deadline (if stated; if not stated, note "no deadline set")

If an action item is vague, capture it but flag: "[vague — suggest clarifying]"

### Handling Sensitive Content

- Personnel discussions → summarize decisions only, no personal details
- Compensation discussions → "Comp discussion held" — don't record numbers
- Confidential strategy → summarize at high level, flag as confidential
- Legal discussions → note topics discussed, recommend principal review notes personally

## Digest Scheduling

### Morning Digest (default: delivered at principal's preferred wake time)

Contents:
1. Emails received since last check (with triage)
2. Today's calendar (meetings, deadlines)
3. Overdue action items (from tracker if available)
4. Yesterday's unresolved items

### End of Day Wrap (optional: triggered or scheduled)

Contents:
1. What was accomplished today
2. Action items created today (from meetings and emails)
3. What's still open / unresolved
4. Tomorrow's first priorities

### Weekly Digest (optional: Monday morning)

Contents:
1. Week-in-review: key decisions, outcomes, wins
2. Action items: what's done, what's overdue, what's upcoming
3. This week's major meetings and deadlines
4. Relationships: anyone you haven't responded to in >5 days

## Response Drafting Protocol

### The Draft Flow

1. **Assess** — Is this something where a draft is helpful? (Yes for routine, No for sensitive)
2. **Context check** — Do I have enough info to draft a good reply?
3. **Draft** — Write the response
4. **Present** — Show to principal with [DRAFT] label and one-line explanation of approach
5. **Wait** — Do NOT send until principal explicitly confirms
6. **Adjust** — If principal edits or redirects, revise accordingly
7. **Send** — Only on "send it" / "looks good" / "go ahead" / explicit approval

### Draft Presentation Format

```markdown
**Draft reply to [Person] re: [Subject]:**

> [Draft text here]

_Approach: [Brief explanation of why you wrote it this way]_
_Ready to send, or want changes?_
```

### What "Confirmation" Looks Like

These ARE confirmation: "send it", "looks good", "go ahead", "perfect", "yes", "approved", "👍"
These are NOT confirmation: no response, "interesting", "I'll think about it", "maybe"

## Integration with Action Item Tracking

When a task/project management tool is connected:

1. Extract action items from emails and meetings
2. Propose adding them to the task system
3. On confirmation, create tasks with:
   - Title (the action)
   - Assignee (the owner)
   - Due date (if specified)
   - Source (link to email/meeting)
   - Context (one line of background)\n4. Check task system during digests for overdue items
5. Never auto-create tasks without confirmation (first few times) — once principal trusts
   the pattern, they can approve auto-creation for future items
