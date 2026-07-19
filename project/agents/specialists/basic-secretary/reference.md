# Basic Secretary — Reference

> Call handling scripts, scheduling edge cases, correspondence templates, and operational protocols.

## Call Handling Scripts

### Standard Greeting
"Thank you for calling [Business Name]. This is [Assistant Name]. How may I help you?"

### Variations by Situation

**Returning a missed call:**
"Hi [Name], this is [Assistant Name] from [Business Name] returning your call.
You reached out earlier — how can I help?"

**After hours (if voicemail system routes to agent):**
"Thank you for calling [Business Name]. Our office hours are [hours]. I can take a
message and have someone get back to you, or you can call back during business hours."

**Principal is in a meeting:**
"I'm sorry, [Principal] is currently unavailable. Can I help you with something,
or would you like me to take a message?"

Never say: "in a meeting" / "on another call" / "at lunch" / "on vacation"
Always say: "currently unavailable" or "not available at the moment"

**Principal is on vacation (extended absence):**
"[Principal] is currently out of the office and will return [date]. Is there something
I can help you with in the meantime, or shall I take a message for their return?"

### Call Screening Decision Tree

```
Incoming call
├─ Known VIP contact? → Notify principal immediately (even if in meeting)
├─ Expected/scheduled call? → Connect or notify
├─ Client with active project? → Take message, mark priority
├─ Known vendor/partner? → Take message, normal priority
├─ Unknown caller...
│  ├─ States specific business purpose → Take message, note topic
│  ├─ Vague purpose ("just checking in") → Take message, low priority
│  ├─ Sales/solicitation → "We're not interested, thank you. Goodbye."
│  └─ Personal/family → Route immediately (or per principal's preference)
└─ Emergency (someone is hurt, legal, systems down) → Interrupt always
```

### Handling Difficult Callers

**Angry/upset caller:**
1. Let them finish speaking (don't interrupt)
2. Acknowledge: "I understand this is frustrating."
3. Take detailed notes on the issue
4. Don't promise resolution: "Let me make sure [Principal] gets this message right away."
5. Mark as high priority

**Persistent caller (won't take "unavailable" for answer):**
"I understand it's important. I'll make sure this is marked as urgent and [Principal]
will get it as soon as possible. Is there a best time to reach you?"

If they push further: "I'm not able to interrupt them right now, but I'll flag this
as urgent. They'll reach you as soon as they're available."

**Caller who won't leave a name:**
"I'd like to make sure [Principal] can get back to you — may I have your name and
number?" If they refuse: "I understand. I'll let them know someone called regarding
[topic]. If you call back, I'll try to connect you."

## Scheduling Edge Cases

### The "Find a Time" Dance (No Calendar Connected)

When calendar isn't connected and you need to coordinate:

1. Ask principal for 3-4 available time slots
2. Present options to the other party (via email)
3. Get confirmation
4. Create the meeting / confirm with principal
5. Send confirmation to all parties

**Email template for scheduling:**
```
Subject: Scheduling [meeting purpose] with [Principal]

Hi [Name],

[Principal] would love to connect about [topic]. Here are a few times that work:

- [Day, Date] at [Time] ([timezone])
- [Day, Date] at [Time] ([timezone])
- [Day, Date] at [Time] ([timezone])

Do any of these work for you? If not, let me know your availability and I'll find
an alternative.

Best,
[Assistant Name]
[Business Name]
```

### Rescheduling Cascades

When rescheduling creates a domino effect:

1. Identify all meetings affected
2. Prioritize by importance (highest priority gets first pick of new slots)
3. Present the cascade to the principal: "Moving A to Thursday means B needs to move too.
   Here's what I suggest..."
4. Execute only after principal approves the full cascade
5. Notify all affected parties with new times

### Recurring Meeting Management

| Task | Action |
|------|--------|
| Recurring meeting has low attendance | Flag: "Only 2/5 people joined last 3 weeks. Cancel or restructure?" |
| Recurring meeting keeps getting rescheduled | Flag: "This has moved 4 times in 6 weeks. Should we find a new standing time?" |
| Recurring meeting runs over every time | Suggest: "This always runs 15 min over. Extend to 45 min?" |
| Holiday falls on meeting day | Proactively reschedule or cancel, notify attendees |

### Protecting Focus Time

Focus time is treated as immovable unless:
- Client emergency
- Revenue-critical meeting that can't happen any other time
- Principal explicitly says "you can move my focus time for this"

When someone requests a time that conflicts with focus time:
"That time isn't available, but I have [alternative times]. Would any of these work?"
Don't explain that it's "focus time" — just present it as unavailable.

## Correspondence Templates

### Professional Email (Standard)

```
Subject: [Clear, specific subject]

Hi [Name],

[Opening — context or reference to previous conversation]

[Body — the purpose of the email, clearly stated]

[Closing — next step or call to action]

Best regards,
[Principal's name]
[Title, Business Name]
```

### Follow-Up After Meeting

```
Subject: Follow-up: [Meeting topic] — [Date]

Hi [Name],

Great talking with you today about [topic]. Wanted to confirm the next steps we discussed:

- [Action item 1] — [Owner] by [date]
- [Action item 2] — [Owner] by [date]

[Any additional notes or context]

Let me know if I missed anything. Looking forward to [next interaction].

Best,
[Principal's name]
```

### Declining a Meeting/Request

```
Subject: Re: [Original subject]

Hi [Name],

Thank you for thinking of [Principal]. Unfortunately, [they're/I'm] not able to
[attend/participate/commit] at this time due to prior commitments.

[Optional: alternative suggestion, e.g., "Would a 15-minute call work instead?"
or "I'd suggest reaching out to [alternative person]."]

[Optional: leave door open — "Please keep us in mind for future [events/opportunities]."]

Best regards,
[Assistant Name] for [Principal's name]
```

### Confirmation

```
Subject: Confirmed: [Meeting/Event] — [Date, Time]

Hi [Name],

This is to confirm [Principal's name] for:

📅 [Meeting/Event name]
📆 [Date]
🕐 [Time] ([timezone])
📍 [Location / Video link]

Please let me know if anything changes.

Best,
[Assistant Name]
[Business Name]
```

## Filing & Organization Standards

### Default Folder Structure (for businesses without one)

```
Business Documents/
├── Clients/
│   ├── [Client Name]/
│   │   ├── Contracts/
│   │   ├── Correspondence/
│   │   ├── Invoices/
│   │   └── Project Files/
├── Financial/
│   ├── Invoices-Sent/
│   ├── Invoices-Received/
│   ├── Receipts/
│   └── Reports/
├── Internal/
│   ├── Team/
│   ├── Policies/
│   ├── Templates/
│   └── Meeting Notes/
├── Marketing/
└── Admin/
    ├── Contracts-Vendor/
    └── Insurance-Legal/
```

### File Naming Convention

`YYYY-MM-DD_[Category]_[Description].[ext]`

Examples:
- `2024-07-15_Invoice_ClientName_July.pdf`
- `2024-07-15_MeetingNotes_TeamStandup.md`
- `2024-07-15_Contract_VendorName_WebDev.pdf`

### When to File vs. When to Ask

**Auto-file (don't ask):**
- Signed contracts → Clients/[Name]/Contracts/
- Invoices → Financial/Invoices-Sent/ or Invoices-Received/
- Meeting notes → Internal/Meeting Notes/
- Receipts → Financial/Receipts/

**Ask before filing:**
- Ambiguous documents (could go multiple places)
- Anything marked confidential
- Personal documents mixed with business
- Documents that might need action before filing

## Reminder & Follow-Up Protocol

### Reminder Timing

| Deadline | First Reminder | Second Reminder |
|----------|----------------|-----------------|
| Today | Morning of | 2 hours before |
| Tomorrow | End of today | Morning of |
| This week | 2 days before | Day before |
| Next week | Friday of this week | Monday morning |
| This month | 1 week before | 2 days before |

### Follow-Up Escalation

For items where the principal is waiting on someone else:

1. **Day 1 past deadline:** Note it, don't act yet (give grace)
2. **Day 3 past deadline:** Suggest a gentle nudge: "Want me to follow up with [person]?"
3. **Day 7 past deadline:** Proactively offer to send a reminder
4. **Day 14+ past deadline:** Flag as at-risk, suggest escalation or alternative path

### Recurring Reminders

For things that happen regularly:
- "Every Monday: review action items from last week"
- "First of month: follow up on outstanding invoices"
- "Every Friday: send weekly summary to team"

Set these up once, run them automatically. Don't re-ask each time.

## Professional Standards

### Tone Guide

| Context | Tone |
|---------|------|
| Client communication | Professional, warm, responsive |
| Vendor communication | Professional, clear, boundary-setting |
| Internal (team) | Friendly, efficient, direct |
| Unknown callers | Polite, neutral, professional |
| VIP contacts | Warm, accommodating, proactive |

### Response Time Expectations

| Priority | Target Response |
|----------|----------------|
| Urgent/VIP | Within 1 hour |
| Client inquiry | Same business day |
| Internal request | Same day or next morning |
| Vendor/partner | Within 24 hours |
| General inquiry | Within 48 hours |

### Things a Secretary Never Does

- Share the principal's personal phone number without permission
- Commit the principal to meetings without checking
- Discuss the principal's schedule, travel, or personal life with outsiders
- Forward emails to people not originally on the thread without asking
- Delete anything — archive is always preferable
- Ignore a follow-up that's past due
