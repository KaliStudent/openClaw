# Appointment Scheduler — Reference

Detailed scheduling logic, timezone handling, multi-provider rules, and operational protocols for the Appointment Scheduler agent.

---

## Scheduling Logic Deep Dive

### Availability Calculation

When determining available slots, consider ALL of these:

1. **Business hours** — When is the business open?
2. **Provider schedules** — When is each specific provider working?
3. **Existing bookings** — What slots are already taken?
4. **Buffer times** — Gaps between appointments (setup/cleanup)
5. **Service duration** — How long does this service take?
6. **Break times** — Lunch, personal blocks, prep time
7. **Travel time** — For mobile businesses (house calls, on-site services)
8. **Maximum daily capacity** — Some providers limit appointments per day

### Slot Calculation Formula

```
Available slot = 
  Business open time
  - Already booked slots (with buffers)
  - Blocked personal time
  - Time needed for this service + buffer
  = Remaining available windows
```

### Buffer Time Rules

| Scenario | Buffer Before | Buffer After |
|----------|---------------|--------------|
| Standard appointment | 0 min | 15 min |
| First appointment of day | 15 min (prep) | 15 min |
| After lengthy service (60+ min) | N/A | 30 min |
| Before lunch block | 0 min | 0 min (lunch is the buffer) |
| Last appointment of day | 0 min | 15 min (cleanup) |
| Between different service types | 15 min | 30 min (room/equipment switch) |

### Duration Defaults by Industry

| Industry | Service | Default Duration |
|----------|---------|-----------------|
| **Dental** | Cleaning | 60 min |
| | Consultation | 30 min |
| | Crown/Bridge | 90-120 min |
| | Filling | 45 min |
| | Emergency | 30 min (initial) |
| **Salon/Barber** | Men's haircut | 30 min |
| | Women's cut + style | 60 min |
| | Color treatment | 90-120 min |
| | Blowout | 45 min |
| **Medical** | New patient visit | 45-60 min |
| | Follow-up | 15-30 min |
| | Physical | 45 min |
| | Procedure | 60-90 min |
| **Legal** | Initial consultation | 60 min |
| | Follow-up meeting | 30 min |
| | Document review | 30 min |
| **Home Services** | Estimate/Quote | 30-60 min |
| | Standard service | 60-120 min |
| | Major project | 120-240 min |
| **Fitness/Wellness** | Personal training | 60 min |
| | Massage | 60-90 min |
| | Class | 45-60 min |
| **Auto** | Oil change | 30-45 min |
| | Diagnostic | 60 min |
| | Major repair | 120-480 min (drop-off) |

### Smart Time Offering

When suggesting times, use these principles:

**Variety rule:** Offer times at different parts of the day
- ❌ "I have 9:00, 9:30, and 10:00" (too clustered)
- ✅ "I have 9:00, 11:30, and 2:00" (morning, midday, afternoon)

**Day variety:** If same-day isn't possible, spread across days
- ❌ "Monday 9:00, Monday 9:30, Monday 10:00"
- ✅ "Monday 9:00, Wednesday 11:30, Friday 2:00"

**Convenience bias:** Lead with popular times for the customer's profile
- Working professional → first/last slots, lunch hour
- Parent → mid-morning (after school drop-off), early afternoon (before pickup)
- Senior → mid-morning (avoid early and rush hour)
- Weekend request → offer Saturday first, then earliest weekday

---

## Timezone Handling

### Detection Methods

1. **Explicit:** Customer states their timezone
2. **Phone area code:** Map to timezone (imperfect but reasonable starting point)
3. **Business context:** If local business, assume same timezone unless customer says otherwise
4. **Ask:** When in doubt, ask: "Just to confirm — are you in [timezone]?"

### Timezone Rules

- Always confirm times in the CUSTOMER'S timezone
- Internal calendar entries use the BUSINESS's timezone
- If business and customer are in different zones, state both:
  "That's 2:00 PM your time (1:00 PM our time in Denver)"
- For virtual appointments: timezone is the customer's
- For in-person appointments: timezone is the business location's

### Common Timezone Scenarios

| Scenario | Action |
|----------|--------|
| Local customer, local business | Use business timezone (they match) |
| Remote customer, virtual appointment | Confirm customer's timezone, show both |
| Customer traveling | Confirm which timezone for THIS appointment |
| Multi-location business | Specify which location's timezone |
| Daylight savings near transition | Extra-careful — confirm and double-check |

---

## Multi-Provider Scheduling

### When Multiple Providers Offer Same Service

**Customer has a preference:**
1. Check preferred provider's availability first
2. If unavailable, ask: "Dr. Smith's next opening is [date]. Would you like to wait, or I can check if another provider has sooner availability?"
3. Never switch providers without asking

**Customer has no preference:**
1. Offer the earliest available across all providers
2. If asked "who do you recommend?": "All our [providers] are great! The soonest available is [provider] on [date]. Would that work?"
3. Load-balance when possible (don't overbook one provider while another is empty)

### Provider-Specific Rules

Some services require specific providers:
- Follow-up appointments → same provider as initial visit
- Specialized procedures → only qualified providers
- New patients → designated new patient providers (if applicable)
- VIP/complex cases → most experienced provider

### Provider Availability Matrix

For businesses with multiple providers, maintain awareness of:

```
| Provider | Mon | Tue | Wed | Thu | Fri | Sat |
|----------|-----|-----|-----|-----|-----|-----|
| Dr. Smith | 8-5 | 8-5 | OFF | 8-5 | 8-5 | 8-12 |
| Dr. Jones | OFF | 8-5 | 8-5 | 8-5 | OFF | 8-12 |
| Dr. Lee | 8-5 | 8-5 | 8-5 | OFF | 8-5 | OFF |
```

---

## Confirmation and Reminder Protocol

### Confirmation Flow

**Immediately after booking:**
1. Send confirmation message (channel matches where they booked)
2. Include ALL details (date, time, location, service, prep instructions)
3. Include cancellation/reschedule instructions
4. If deposit required, include payment instructions

**Confirmation message must include:**
- ✅ Date and day of week (prevents "I thought it was Thursday" confusion)
- ✅ Time with AM/PM (never assume 24-hour is understood)
- ✅ Full address (especially for first-time customers)
- ✅ Service being performed
- ✅ Any prep instructions (fasting, forms to fill, what to bring)
- ✅ How to cancel/reschedule
- ✅ Contact number for questions

### Reminder Schedule

| Timing | Method | Message Style |
|--------|--------|---------------|
| 48 hours before | Email | Full details + prep reminders |
| 24 hours before | SMS/Text | Short confirmation request |
| 2 hours before | SMS (optional) | "See you soon!" (no response needed) |
| Day of (morning) | Push notification (if app) | Time + address |

**Reminder response handling:**
- "Confirm" / "Yes" / "See you there" → Mark confirmed
- "Cancel" / "Can't make it" → Trigger cancellation flow
- "Reschedule" / "Can we move it?" → Trigger reschedule flow
- No response to 24-hour reminder → Flag for business (potential no-show)

### No-Show Protocol

| Timing | Action |
|--------|--------|
| 10 min past appointment time | Text: "We're ready for you! Are you on your way?" |
| 20 min past (no response) | Call attempt |
| 30 min past (no contact) | Mark as no-show, notify business |
| Same day (after hours) | Send: "We missed you today! No worries — want to rebook?" |
| Next day | If no response to same-day message, one final attempt |
| After 2 no-shows | Flag customer for business decision (require deposit? Waitlist only?) |

---

## Cancellation Handling

### Cancellation Flow

1. **Identify the appointment** — "Which appointment would you like to cancel?"
2. **Check policy** — Is there a fee? Are they within the notice period?
3. **Communicate policy** — If fee applies, state it clearly BEFORE processing
4. **Process cancellation** — Remove from calendar
5. **Offer rebook** — Always: "Would you like to schedule for a different time?"
6. **Confirm** — "Your appointment on [date] has been cancelled."
7. **Notify business** — Alert the business to the open slot

### Cancellation Policy Communication

**Within policy (no fee):**
> "No problem at all! Your appointment on [date] has been cancelled. Would you like to rebook for another day?"

**Outside policy (fee applies):**
> "I can cancel that for you. Just so you're aware, since it's less than 24 hours before your appointment, our cancellation policy includes a $[X] fee. Would you still like to proceed, or would you prefer to reschedule instead?"

**Never surprise with fees.** Always state the fee BEFORE processing.

### Last-Minute Cancellation Recovery

When a customer cancels with short notice:
1. Cancel their appointment
2. Check waitlist (if one exists) for that time slot
3. If waitlist customer available → offer the slot
4. If no waitlist → notify business of open slot for potential walk-in

---

## Waitlist Management

### When to Use a Waitlist

- Customer wants a time that's booked
- Customer wants a specific provider who's booked
- Popular time slots (Monday mornings, Saturday mornings)
- Seasonal rush periods

### Waitlist Protocol

**Adding to waitlist:**
> "That time is booked, but I can put you on our waitlist. If something opens up, I'll text you right away. Sound good?"

**When a slot opens:**
> "Great news! A [time] slot just opened up on [date] for [service]. Would you like me to book it? Please reply within 2 hours and it's yours."

**Waitlist rules:**
- First on list gets first offer
- Give them 2 hours to respond before moving to next person
- Maximum 3 people on waitlist per slot (more than that = they won't get in)
- Remove from waitlist once booked elsewhere

---

## Industry-Specific Protocols

### Dental/Medical

**Required information:**
- Full name
- Date of birth
- Phone number
- Insurance information (or "self-pay")
- Reason for visit
- New patient vs. returning

**Special considerations:**
- New patients need longer appointments (forms, X-rays, exam)
- Emergency appointments: triage urgency ("Is this causing pain right now?")
- Insurance verification: "We'll verify your insurance before your visit. If there are any coverage questions, we'll call you before the appointment."
- HIPAA awareness: Don't discuss medical details in group/public channels

### Salon/Spa

**Required information:**
- Name
- Phone number
- Service(s) desired
- Provider preference (if any)
- Hair type/length (affects duration for some services)

**Special considerations:**
- Color services: Ask if it's a first-time color or touch-up (different duration)
- Multiple services: Calculate total time correctly (cut + color ≠ cut time + color time — they overlap)
- Consultations: Offer free consult for big changes before booking the full service
- "I don't know what I want": Suggest a consultation appointment

### Home Services (Plumbing, HVAC, Electrical)

**Required information:**
- Name
- Address (service location)
- Phone number
- Description of issue
- Urgency level (emergency vs. can wait)
- Access information (gate code, pet situation, key location)

**Special considerations:**
- Service windows vs. exact times: "Our tech will arrive between 8-10 AM"
- Emergency surcharges: Communicate before booking
- Estimates vs. service: "This first visit is a diagnostic. We'll provide a quote before doing any work."
- Someone must be home: Confirm who will be there

### Legal

**Required information:**
- Name
- Phone number
- Brief description of legal need (type of case)
- Conflict check (opposing party name for conflict clearance)

**Special considerations:**
- Initial consultations: Often free or reduced fee — state clearly
- Conflict check: "We'll do a quick conflict check before confirming. You'll hear back within a few hours."
- Sensitivity: These appointments are often stressful — extra warmth in tone
- Confidentiality: Don't include case details in reminders

### Fitness/Wellness

**Required information:**
- Name
- Phone/email
- Service type (class, personal training, massage, etc.)
- Any injuries or limitations
- First time? (different intake process)

**Special considerations:**
- Class capacity: "3 spots left in Saturday's 9 AM class"
- Package/membership check: "This uses one of your 10-pack sessions"
- Cancellation impact: Late cancels in group classes waste spots
- Recurring scheduling: "Want to book your regular Thursday 6 PM slot for the month?"

---

## Handling Difficult Scheduling Situations

### Customer Wants an Impossible Time
> "I understand you need something outside our regular hours. Let me check if we have any flexibility. [If yes: offer special accommodation]. [If no: offer closest alternative + waitlist]."

### Customer Is Frustrated About Availability
> "I hear you — I wish I had something sooner. Here's what I can do: I'll put you on our priority list, and if anything opens up before [date], you'll be the first person I call. In the meantime, would [alternative time] work as a backup?"

### Customer Keeps Rescheduling (3+ times)
> Flag for business attention. Don't confront the customer, but alert the owner:
> "Heads up: [Customer] has rescheduled 3 times for their [service]. Want me to handle differently?"

### Customer Requests a Provider Who Left
> "Dr. [Name] is no longer with our practice. Dr. [New provider] has taken over their patients and is excellent with [specialty]. Would you like to schedule with them, or would you prefer to choose a different provider?"

### Walk-In vs. Appointment Conflict
> When managing walk-in requests during busy times:
> "We're currently seeing patients by appointment, and the next available slot is [time]. Would you like me to book that, or if it's urgent, I can check if we can squeeze you in sooner?"

---

## Data Collection and Privacy

### What to Store
- Customer name, phone, email (for confirmations)
- Appointment history (what services, how often)
- Preferences (provider, time of day, communication method)
- Notes from business (special handling, VIP status)
- No-show/late cancellation history

### What NOT to Store
- Medical details beyond what's needed for scheduling
- Payment information (use secure payment systems)
- Sensitive personal information unrelated to the appointment
- Reasons for cancellation (unless customer volunteers and it's relevant)

### Privacy Rules
- Don't share one customer's info with another
- Don't discuss who else is scheduled ("Oh, your friend Sarah is coming in too!")
- Confirmations go only to the customer's provided contact method
- Reminder messages shouldn't include sensitive service details in preview text
  - ✅ "Reminder: appointment tomorrow at 2 PM"
  - ❌ "Reminder: STD test tomorrow at 2 PM"

---

## Performance Metrics to Track

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Booking completion rate | >90% | Conversations that end in a booking |
| No-show rate | <10% | Effectiveness of reminders |
| Cancellation rate | <15% | Policy and convenience working |
| Time-to-book | <3 messages | Efficiency of the flow |
| Reschedule rate | <20% | Offering right times initially |
| Customer satisfaction | High | They felt welcomed, not processed |
| Double-book incidents | 0 | NON-NEGOTIABLE |
