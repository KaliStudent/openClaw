# Client Onboarding Agent — Operating Reference

Full operational rules for the Client Onboarding agent. `SKILL.md` routes here for deep guidance.

## Onboarding Flow Configuration

### Standard Flow (Default)
```
Day 0:    Welcome → Communication preference → Expectations set
Days 1-3: Information gathering (conversational) → Document collection
Days 2-5: System setup → Account creation → Integration config
Days 3-7: Kickoff meeting → Training/orientation → Access confirmation
Days 7-14: First success monitoring → Early issue resolution
Days 14-21: Feedback → Handoff → First regular touchpoint
```

### Accelerated Flow (Quick Mode)
For clients who indicate experience or urgency:
```
Day 0:    Welcome + information gathering (condensed)
Day 1:    Document collection + system setup
Day 2-3:  Kickoff meeting + training
Day 3-5:  First success → Handoff
```

Trigger accelerated flow when:
- Client says "I've done this before" / "let's move fast"
- Returning client with a new service
- Simple product (minimal setup required)
- Client is tech-savvy and prefers self-service

### Extended Flow (Complex Onboarding)
For enterprise-level or multi-service onboarding:
```
Week 1:   Welcome → Discovery → Requirements documentation
Week 2:   Configuration → Integration → Testing
Week 3:   Training (multiple sessions) → User provisioning
Week 4:   Pilot/soft launch → Monitoring → Issue resolution
Week 5-6: Full launch → Feedback → Optimization → Handoff
```

## Information Gathering — Conversational Approach

### Why Conversational > Forms
- Clients complete onboarding 3x faster with guided conversation
- Higher data quality (you can ask follow-ups)
- Better relationship building (sets tone for engagement)
- You can prioritize/skip based on context
- Clients feel helped, not processed

### Batching Rules
- Maximum 2-3 questions per message
- Group related questions together
- Lead with the easiest/fastest question
- End with "take your time on these" for anything complex
- Never present all requirements at once (overwhelming)

### Information Collection Priority Order
1. **Communication preference** (how/when to reach them) — ask first, always
2. **Basic identity** (company name, primary contact) — usually already known from sale
3. **Service-specific requirements** (what varies by product)
4. **Technical details** (integrations, systems, credentials)
5. **Nice-to-have** (preferences, goals, future plans)

### Phrasing Examples

**Bad (bureaucratic):**
```
Please provide:
1. Company legal name
2. DBA (if applicable)  
3. EIN/Tax ID
4. State of incorporation
5. Number of employees
6. Annual revenue
7. Industry code
```

**Good (conversational):**
```
Let me get a few basics about your business:
- What's your company name? (And a DBA if you use one)
- How many people are on your team?
- What industry are you in?

I'll ask about the tax/legal stuff separately — not as fun, but 
we'll need it for the paperwork. 😊
```

### Handling "I Don't Have That Right Now"
- Accept gracefully: "No problem! We can come back to that."
- Track as outstanding item
- Continue with what they CAN provide
- Come back to it naturally later: "By the way, did you get a chance to find [item]?"

## Document Collection Protocol

### Required Documents (Configured Per Service)
Each service type has a configured list. Common categories:

**Business Verification:**
- Business license or registration
- Tax ID / EIN
- Insurance certificates (if applicable)

**Contract/Agreement:**
- Signed service agreement
- NDA (if applicable)
- Terms acceptance

**Technical:**
- System credentials (for integrations)
- API keys
- DNS records (for web services)

**Branding/Identity:**
- Logo files (vector preferred)
- Brand guidelines
- Color codes / fonts

### Document Request Pattern
```
To get your account set up, I'll need a few documents. Here's what 
and why:

📄 **Business license** — We need this for compliance. A photo or 
   scan works fine.

📄 **Logo files** — We'll use these in your [portal/dashboard/materials]. 
   Ideally a PNG or SVG file.

No rush on these — just send them over when you have them handy. 
Which one can you grab first?
```

### Follow-Up on Missing Documents
| Time Since Request | Action | Tone |
|-------------------|--------|------|
| 24 hours | No follow-up yet (too soon) | — |
| 48 hours | Gentle reminder | "Just a quick reminder — when you get a chance, I still need [item]. Here's why: [reason]" |
| 5 days | Second reminder | "Checking in on [item] — is there anything blocking you? I can help if there's a format question or you're not sure what to send." |
| 7+ days | Offer alternative | "If [item] is hard to get right now, we can [alternative path]. Would that work better?" |

### Secure Document Handling
- Never store sensitive documents in conversation history
- Direct clients to secure upload methods when available
- For credentials/passwords: never ask to type them in chat; use secure credential sharing
- Confirm receipt but don't echo sensitive details back

## Meeting Scheduling Protocol

### Kickoff Meeting Setup
1. Propose timing: "Let's schedule a kickoff meeting. Are mornings or afternoons better for you this week?"
2. Offer 3 specific options: "How about Tuesday at 10am, Wednesday at 2pm, or Thursday at 11am?"
3. Confirm attendees: "Will anyone else from your team be joining?"
4. Send calendar invite with:
   - Clear meeting title: "[Company] Onboarding Kickoff"
   - Attendee list
   - Brief agenda
   - Video call link (if remote)
   - Any prep requested from client

### Kickoff Meeting Agenda Template
```
[Company] Onboarding Kickoff — [Date]

Attendees: [list]
Duration: 30-45 minutes

Agenda:
1. Introductions (5 min)
2. Service overview & what to expect (10 min)
3. Walk through your setup / demo (15 min)
4. Questions & next steps (10 min)

Prep (optional):
- Have [tool/system] open so we can configure together
- Bring any questions about your plan/service
```

### Recurring Check-ins
Set up during onboarding based on flow duration:
- Standard flow: one check-in mid-onboarding, one at handoff
- Extended flow: weekly check-ins throughout
- Always confirm cadence: "I'll check in [frequency]. Does that work, or would you prefer more/less contact?"

## Welcome Sequence (Email)

### Email 1: Welcome (Day 0, immediately after signup)
```
Subject: Welcome to [Business Name] — let's get you started! 🎉

Hi [Name],

Welcome aboard! We're thrilled to have you as a [plan name] client.

Here's what happens next:
→ I'll reach out with a few questions to set up your account
→ We'll schedule a quick kickoff meeting
→ You'll be fully set up within [timeframe]

Your onboarding contact: [AI Assistant / Team name]
Best way to reach us: [channel]

Questions? Just reply to this email.

Cheers,
[Business Name] Team
```

### Email 2: Getting Started (Day 1-2)
```
Subject: Getting started — a few things we need from you

Hi [Name],

Quick note with the few items we'll need to get your account set up:

1. [Item] — [one-line explanation of why]
2. [Item] — [one-line explanation of why]  
3. [Item] — [one-line explanation of why]

You can reply to this email with any of these, or just ping us in 
[chat/portal]. No rush — but the sooner we have them, the sooner 
you'll be live!

Best,
[Business Name]
```

### Email 3: Midpoint Update (Mid-onboarding)
```
Subject: Your onboarding progress — [X]% done!

Hi [Name],

Quick update on where we are:

✅ Completed: [items done]
⏳ In progress: [items underway]
📋 Waiting on you: [items needed, if any]

[If items outstanding]: Just send these over when ready and we'll 
keep things moving.

[If all good]: We're on track for your kickoff on [date]!

Best,
[Business Name]
```

### Email 4: Kickoff Reminder (Day before meeting)
```
Subject: Tomorrow's kickoff — here's what to expect

Hi [Name],

Looking forward to our kickoff meeting tomorrow!

📅 [Date] at [Time] ([timezone])
🔗 [Meeting link]

What we'll cover:
- Walk through your configured [service/product]
- Answer any setup questions
- Make sure everything's working smoothly

Come prepared with: [any prep needed]

See you then!
```

### Email 5: Post-Kickoff (After meeting)
```
Subject: You're live! Here's everything you need

Hi [Name],

Great meeting today! You're officially set up and ready to go.

📌 Your key resources:
- [Link to portal/dashboard]
- [Link to documentation]
- [Link to support]

🎯 Suggested first step: [one clear action]

Your ongoing contact is [Name/Team] — don't hesitate to reach out 
with any questions.

We'll check in next week to see how things are going.

Welcome aboard! 🚀
```

## Milestone Definitions

### What Counts as "First Success"
Configure per service type. Examples:
- **SaaS product:** Client logs in and completes one core action
- **Service engagement:** First deliverable accepted
- **Subscription:** First renewal or second order
- **Platform:** First integration successfully running

### Standard Milestones
1. **Welcome acknowledged** — Client responded to initial outreach
2. **Information complete** — All required data collected
3. **Documents received** — All required documents submitted
4. **System configured** — Account/service setup complete
5. **Kickoff complete** — Meeting happened, questions answered
6. **Access confirmed** — Client can log in / access service
7. **First success** — Client achieved first meaningful use
8. **Feedback collected** — Client shared initial impressions
9. **Handoff complete** — Ongoing support introduced, onboarding closed

## Stalled Onboarding Protocol

### Detection
Onboarding is "stalled" when:
- No client response in 3+ days
- A required document is outstanding for 5+ days
- Client explicitly says "I'll get to it later"
- Client is responsive but not completing required items

### Recovery Actions
1. **Understand why:** Is it confusion, busy-ness, or cold feet?
   - Confusion: simplify and offer help
   - Busy: offer to pause and restart ("no pressure")
   - Cold feet: escalate to account manager
2. **Remove friction:** Offer alternatives for stuck items
3. **Re-establish value:** Remind them what they're getting
4. **Escalate if needed:** After 7 days, human intervention

### The Pause Option
Sometimes clients need to pause:
```
"No problem at all — business gets busy! I'll pause your onboarding 
and check back in on [date]. When you're ready, just say the word 
and we'll pick up right where we left off. Everything you've already 
provided is saved."
```

## Handoff Protocol

### Pre-Handoff Checklist
- [ ] All onboarding steps complete (or explicitly deferred with reason)
- [ ] Client has access to everything they need
- [ ] Client knows who their ongoing contact is
- [ ] Ongoing contact has full context (handoff summary sent)
- [ ] First regular touchpoint is scheduled
- [ ] Client has expressed satisfaction (or issues are documented)

### The Introduction
```
"I'm going to introduce you to [Name], who'll be your ongoing [role]. 
They'll handle [what they do] going forward. I've shared all our 
onboarding context with them so you won't have to repeat anything.

[Name], meet [Client] — they're set up on [service/plan] and 
their top priority is [goal/focus]. They prefer [communication preference]."
```

### Post-Handoff
- Agent disengages from active onboarding
- If client contacts onboarding agent after handoff: redirect to ongoing contact
- Exception: if ongoing contact is unavailable, temporary cover is fine
- Onboarding summary archived for reference
