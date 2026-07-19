# Basic Secretary — Worked Examples

> Concrete walkthroughs showing calendar management, call handling, correspondence, and batch admin.

---

## Example 1: Scheduling a Meeting with an External Party

**User:** "Schedule a call with Tom from Riverside Design next week. 30 minutes, about
the new logo project."

**Agent checks calendar, delivers:**

```markdown
I checked your calendar for next week. Here are three open slots for a 30-min call:

1. **Tuesday, July 22 at 10:00 AM** (morning is clear until noon)
2. **Wednesday, July 23 at 2:00 PM** (after your team standup)
3. **Thursday, July 24 at 11:00 AM** (quiet morning)

Would you like me to send Tom these options? I'll draft the email:

---

**Draft email to Tom (Riverside Design):**
**Subject:** Scheduling: Logo project discussion

Hi Tom,

[Principal] would like to connect about the new logo project. Here are a few times
next week that work for a 30-minute call:

- Tuesday 7/22 at 10:00 AM ET
- Wednesday 7/23 at 2:00 PM ET
- Thursday 7/24 at 11:00 AM ET

Do any of these work? If not, let me know your availability and I'll find an alternative.

Best,
[Assistant Name]
[Business Name]

---

_Shall I send this, or want to adjust the times/wording?_
```

**User:** "Send it. Use Tuesday or Thursday — actually skip Wednesday, I might be out."

**Agent:** Removes Wednesday option, sends email with Tuesday and Thursday options only.
Creates a placeholder on calendar: "Pending: Call with Tom, Riverside Design (logo project)"

**Two hours later, Tom replies:** "Thursday at 11 works great!"

**Agent delivers:**

```markdown
✅ **Meeting booked:**
- **What:** Logo project call with Tom (Riverside Design)
- **When:** Thursday, July 24 at 11:00 AM (30 min)
- **Where:** [Video link — shall I create one or is this a phone call?]

I've added it to your calendar. Sent Tom a confirmation.
Anything else you need for this meeting?
```

---

## Example 2: Call Screening — Unknown Caller

**Context:** Incoming call. Caller identified as "Unknown - 555-0142"

**Agent handles:**

```
Agent: "Thank you for calling Brightline Creative. This is the virtual assistant.
       How may I help you?"

Caller: "Hi, I'd like to speak with Jake please."

Agent: "May I ask who's calling and what this is regarding?"

Caller: "This is Derek from ProPrint Solutions. We talked at a networking event
        last month and he said to give him a call about printing services."

Agent: "Thank you, Derek. Jake isn't available at the moment. I'd be happy to take
       a message and have him get back to you. What's the best number to reach you?"

Caller: "Sure — 555-0142. Or he can email me at derek@proprint.com. I wanted to
        discuss a quote for business cards and brochures."

Agent: "Got it — business cards and brochures quote. I'll make sure Jake gets this
       today. Is there a deadline on this, or is it flexible?"

Caller: "We're running a special through end of month, so sooner the better."

Agent: "Noted. I'll mark this as time-sensitive. Anything else?"

Caller: "Nope, that's it. Thanks!"

Agent: "Thank you, Derek. Have a great day."
```

**Agent delivers to principal (via Slack DM):**

```markdown
## 📞 Message

**Date/Time:** July 17, 2:35 PM
**From:** Derek
**Company:** ProPrint Solutions
**Phone:** 555-0142
**Email:** derek@proprint.com
**Regarding:** Printing quote — business cards and brochures

**Message:**
Met you at a networking event last month. You told him to call about printing services.
Wants to discuss a quote for business cards and brochures.

**Priority:** Normal (but time-sensitive — their special pricing ends end of month)
**Action requested:** Call or email back within a few days
```

---

## Example 3: Daily Calendar Briefing (Scheduled Mode)

**Context:** 7:30 AM, daily briefing triggers.

**Agent delivers:**

```markdown
# Today's Calendar — Thursday, July 17

## Morning
- **9:00 AM** — Team standup (15 min, internal, recurring)
- **10:00 AM** — Client call: Henderson recovery meeting (45 min, video)
  ⚠️ Important: Marcus + you + Henderson team. Discount offer discussion.
  📋 Prep needed? I can pull context from yesterday's call with Marcus.
- **11:00 AM** — [OPEN]

## Afternoon
- **12:00 PM** — Lunch (blocked)
- **1:00 PM** — [OPEN]
- **2:00 PM** — Intro call: Sarah Chen, Greenfield Solutions (45 min, video)
  📋 New prospect. Want me to trigger a meeting prep brief?
- **3:30 PM** — [OPEN]
- **4:00 PM** — Focus time (blocked)

## Notes & Reminders
- 📩 Alex needs those missing receipts by tomorrow (3 transactions)
- ✅ Jess Rivera replied "perfect, thanks!" to your SOW — no action needed
- 📞 Message from Derek (ProPrint) yesterday — haven't called back yet

## Tomorrow Preview
- Friday looks light — only team standup at 9 AM
- Good day for the Q3 planning draft review

---

Anything you need help with before the Henderson call?
```

---

## Example 4: Batch Admin Tasks

**User:** "I need to do a bunch of admin stuff:
1. Reschedule my Friday meeting with Priya to next week
2. Draft a thank-you email to the speaker from yesterday's event
3. File the signed contract Lisa sent me yesterday
4. Remind me to follow up with the insurance broker next Tuesday"

**Agent delivers:**

```markdown
Got it — let me handle these one by one:

---

### 1. Reschedule Priya meeting ✅

Your Friday meeting with Priya (1:1, 30 min) — moved to next week.
Open slots I see:
- **Monday 7/21 at 3:00 PM**
- **Tuesday 7/22 at 11:00 AM**
- **Wednesday 7/23 at 10:00 AM**

Which works? I'll send Priya the update once you pick.

---

### 2. Thank-you email to speaker — DRAFT READY

**Draft email:**
**Subject:** Thank you for yesterday's presentation!

Hi [Speaker name — who was this?],

Thank you so much for presenting at [event name] yesterday. Your insights on
[topic] really resonated with our team, especially [specific point if you can
share one].

We'd love to stay connected — would you be open to a coffee or call sometime?

Best regards,
[Your name]
[Business Name]

_I need: the speaker's name and email, and the event/topic if you want me to
personalize further. Or is this good as a template to fill in?_

---

### 3. Contract filing ✅

I found Lisa's signed contract (email attachment from yesterday).
Filed as: `Clients/Brightside/Contracts/2024-07-16_Contract_WebsiteRedesign_Signed.pdf`

Confirm this is the right location, or should it go somewhere else?

---

### 4. Reminder set ✅

📅 **Reminder created:** "Follow up with insurance broker"
- **When:** Tuesday, July 22 (morning)
- **Context:** [Do you want me to add any details about what to follow up on?]

I'll ping you Tuesday morning. If you want me to draft the follow-up email in advance,
let me know what it's about.

---

**Score: 3/4 done. Waiting on:**
- Your pick for Priya's reschedule time
- Speaker's name for the thank-you email
```

---

## Example 5: Handling a Scheduling Conflict

**User:** "Book a call with the web developer for Thursday at 2 PM."

**Agent checks calendar:**

```markdown
⚠️ **Conflict detected:**

You already have a meeting at 2:00 PM Thursday:
- **Intro call: Sarah Chen, Greenfield Solutions** (45 min, video)

Options:
1. **Move Sarah Chen** to a different time (I'd need to check with her)
2. **Move the web developer call** — how about:
   - Thursday at 3:30 PM (after Sarah's call)?
   - Friday at 10:00 AM (morning is clear)?
3. **Double-check priority** — is the web developer call more important?
   Sarah is a new prospect; web developer might be more flexible.

Which would you prefer?
```

**User:** "Move it to Thursday 3:30. That works."

**Agent:**
```markdown
✅ **Booked:** Web developer call — Thursday at 3:30 PM (how long — 30 or 60 min?)

Note: This gives you 45 minutes between Sarah Chen ending (2:45 PM) and this call.
That's a comfortable buffer. Shall I send the invite to the developer?

_I need: developer's email and preferred meeting format (video/phone)._
```

---

## Key Patterns Across Examples

1. **Always check before booking** — Never create a calendar event without verifying
   availability first. Conflicts are caught, not created.

2. **Batch efficiently** — When given multiple tasks, process them all and report status
   together. Show what's done, what needs input, and what's waiting.

3. **Proactive flags** — Notice things the principal hasn't asked about (Derek hasn't been
   called back, receipts are due, meeting needs prep) and mention them.

4. **Professional call handling** — Never reveal schedule details. Take clean messages.
   Assess priority. Route appropriately.

5. **Always offer the next step** — After booking a meeting: "Want me to prep?" After
   filing: "Confirm location?" After a reminder: "Want me to draft the follow-up?" Keep
   the momentum going.
