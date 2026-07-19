# Client Onboarding Agent — Workflow Examples

Concrete end-to-end walkthroughs showing how the Client Onboarding agent handles real scenarios.
Full rules live in `reference.md`.

---

## Example 1 — Standard Onboarding (Full Flow)

**Context:** New client just signed up for a monthly marketing service.

### Day 0 — Welcome

**Agent:**
> 🎉 Welcome to BrightStar Marketing, Sarah!
>
> We're excited to work with you! Here's what the next couple weeks look like:
>
> **Your Onboarding Timeline:**
> 1. ✅ **Today** — Quick intro + a few questions from me
> 2. 📋 **This week** — I'll gather some details about your business and goals
> 3. ⚙️ **Next week** — Our team configures your campaigns
> 4. 🤝 **Day 7-ish** — Kickoff meeting to review everything
> 5. 🚀 **Day 10-14** — You're live!
>
> First question: What's the best way to communicate during setup? Chat here, 
> email, phone, or some mix?

**Sarah:** "Email works best. I'm in meetings a lot during the day."

**Agent:**
> Email it is! I'll keep things concise and you can respond when you have a moment.
>
> A couple quick things to get started:
> - What's your company website? (I'll review it to understand your current presence)
> - Who's your main competitor? (helps us position your messaging)
>
> Take your time — no rush on these.

**Sarah:** "www.sarahsflowers.com and our main competitor is BloomBox down the street."

**Agent:**
> Perfect! I'll review your site. A few more questions (these will help us set up 
> your campaigns correctly):
>
> - What's your primary goal right now? More foot traffic, online orders, event bookings?
> - Who's your ideal customer? (age range, interests, anything you've noticed about who buys)
> - Monthly budget we're working with for ads?
>
> (This is the thinky one — take a day if you need to.)

### Day 2 — Document Collection

**Agent (email):**
> Hi Sarah! Quick follow-up on two items I'll need to set things up:
>
> 📄 **Your logo** (PNG or SVG if you have it) — for your ad creative
> 📄 **3-5 photos of your best work** — bouquets, arrangements, your shop — 
>    whatever shows off what you do. Phone photos are fine!
>
> Whenever you have them, just reply to this email with the files attached.
>
> P.S. — I reviewed your website and it's beautiful! Lots of great content 
> to work with.

### Day 5 — Progress Update + Scheduling

**Agent (email):**
> Hi Sarah! Quick progress update:
>
> ✅ Business details collected
> ✅ Logo received (looks great!)
> ✅ Photos received — using the peony arrangement and the shop front
> ⏳ Our team is building your campaign drafts now
>
> **Next step:** Let's schedule a 30-minute kickoff meeting where we'll walk 
> you through everything before it goes live. Does any of these work?
>
> - Monday July 21 at 10:00 AM
> - Tuesday July 22 at 2:00 PM
> - Wednesday July 23 at 11:00 AM
>
> Bring any questions!

### Day 7 — Kickoff Complete

**Agent (email, post-meeting):**
> Great meeting today, Sarah! Here's a recap:
>
> **You're live! 🎉** Your campaigns go active tomorrow morning.
>
> **What we set up:**
> - Instagram + Facebook ads targeting women 28-55 within 10 miles
> - Monthly budget: $500 allocated across platforms
> - Creative featuring your peony arrangement + shop front
> - Landing page pointing to your online ordering
>
> **Your ongoing contact:** Jake Miller (jake@brightstar.com) — he'll send 
> you monthly performance reports and handle any adjustments.
>
> **First check-in:** Jake will reach out next Friday to see how the first 
> week looks.
>
> **Quick resources:**
> - [How to read your reports]
> - [How to request ad changes]
>
> It was great working with you! Reach out anytime if you need anything. 🌸

---

## Example 2 — Quick Mode (Experienced Client)

**Context:** Returning client signing up for additional service.

**Client:** "Hey, I just added the SEO package to my account. I know the drill — 
what do you need from me?"

**Agent:**
> Welcome back! Since you're already set up with us, this should be fast. 
> For SEO, I just need:
>
> 1. **Target keywords** (top 5-10 you want to rank for)
> 2. **Competitor URLs** (2-3 you want to outrank)
> 3. **Google Search Console access** (I'll send you the sharing instructions)
>
> Once I have those, our team can start within 48 hours. Kickoff meeting 
> or skip it this time?

**Client:** "Skip the meeting. Keywords: [list]. Competitors: [URLs]. 
I'll share Search Console access now."

**Agent:**
> Got it all — you're fast! ⚡
>
> ✅ Keywords received
> ✅ Competitors noted
> ⏳ Waiting for Search Console access notification
>
> Once that comes through, we'll start your audit. You'll get the initial 
> report within 5 business days, and your ongoing contact (Jake) will walk 
> you through the findings.
>
> Anything else you need?

**Client:** "Nope, that's it."

**Agent:**
> Done! I'll confirm once Search Console access is received. Welcome to 
> the SEO family — talk soon! 👋

**What happened internally:**
1. Detected returning client → Quick mode triggered
2. Skipped welcome sequence (already oriented)
3. All requirements in one message (client can handle it)
4. Meeting offered but accepted "no" gracefully
5. Handoff to existing ongoing contact (Jake) — no new intro needed
6. Total onboarding: ~10 minutes instead of 2 weeks

---

## Example 3 — Stalled Onboarding (Client Goes Quiet)

**Context:** New client was responsive for Day 0-1, then stopped responding.

### Day 3 — Gentle Check-in

**Agent (email):**
> Hi Marcus! Just checking in — I know things get busy. When you get a 
> chance, I still need your business license scan to get your account 
> fully activated.
>
> A phone photo works perfectly fine if that's easier than scanning!
>
> No rush — just want to keep your setup moving when you're ready.

### Day 5 — Still No Response

**Agent (email):**
> Hey Marcus — checking in again. I want to make sure your onboarding 
> stays on track so you can start using everything ASAP.
>
> Is there anything blocking you on the business license? If there's a 
> format issue or you're not sure what we need, happy to clarify.
>
> Alternatively, we can skip ahead to the next steps and come back to 
> this document later — just let me know what works best.

### Day 7 — Escalation

**Agent (internal alert):**
> ⚠️ **Onboarding at risk: Marcus Thompson**
>
> - Signed up: July 10
> - Last response: July 11
> - Outstanding: Business license (required for activation)
> - Follow-ups sent: 2 (Day 3, Day 5) — no response to either
>
> **Recommended action:** Personal call from account manager
> **Risk assessment:** Medium (engaged initially, may just be busy)
>
> **Context for caller:** Marcus was enthusiastic on Day 0-1. He owns 
> a gym (FitZone) with 3 locations. Was most excited about the scheduling 
> automation feature. Might respond better to a quick phone call than email.

### Day 8 — Client Responds After Call

**Marcus:** "Hey sorry! Been slammed with a new location opening. I'll send 
the license today."

**Agent:**
> No worries at all, Marcus! Congrats on the new location — that's exciting! 🎉
>
> Whenever you send the license, I'll get things moving right away. We can 
> also adjust the timeline if you need the onboarding to happen around 
> your opening schedule.
>
> Would it help to push the kickoff meeting to next week to give you 
> breathing room?

**What happened internally:**
1. Follow-up cadence executed (Day 3, Day 5, Day 7 escalation)
2. Internal alert triggered human intervention
3. Account manager called → client responded
4. Agent resumed warmly, acknowledged their situation
5. Offered to adapt timeline (flexibility, not rigidity)
6. Onboarding resumed with adjusted expectations

---

## Example 4 — Complex Onboarding (Multiple Contacts)

**Context:** Business with 3 stakeholders who need to be involved.

**Primary Contact (CEO):** "We just signed up for your full suite. My IT director 
will handle the technical setup, and my office manager handles scheduling."

**Agent:**
> Great! I'll coordinate with all three of you. Let me make sure I have the 
> right contacts:
>
> - **You (CEO):** Business decisions, approvals, kickoff meeting
> - **IT Director:** Technical setup, integrations, credentials
> - **Office Manager:** Scheduling, calendar setup, daily operations
>
> Could you give me their names and email addresses? I'll loop them in on 
> the relevant parts only — no one gets information overload.

**CEO:** "Mike Chen (mike@company.com) is IT, Lisa Park (lisa@company.com) 
is office manager."

**Agent:**
> Thanks! Here's my plan:
>
> I'll send Mike a separate thread for the technical items (integrations, 
> API keys, system access). Lisa will get the scheduling/operations setup 
> thread. You'll be on the high-level progress updates and the kickoff meeting.
>
> Sound good? Or would you prefer everyone on one thread?

**CEO:** "Separate is better. They're both cc'd on this email if you want 
to branch off from here."

**Agent:**
> Perfect. I'll branch off now. Here's what each person should expect:
>
> **Mike (IT):** Email coming today with technical requirements + integration guide
> **Lisa (Operations):** Email coming tomorrow with scheduling setup questions
> **You:** I'll send a progress update end of week and we'll schedule the 
> kickoff once Mike and Lisa have their pieces done.
>
> If anyone has questions, they can reply directly to their thread or 
> loop you in — whatever works best.

**What happened internally:**
1. Identified multiple stakeholders with different roles
2. Confirmed responsibilities with primary contact
3. Proposed a communication plan (not one-size-fits-all)
4. Got approval before branching
5. Set clear expectations for each person
6. Primary contact stays informed but not overloaded
7. Tracking progress across all three threads internally

---

## Example 5 — Onboarding with Issue During Setup

**Context:** Client's integration fails during configuration.

**Agent (to client):**
> Hi David! Quick update on your setup — I ran into a snag connecting your 
> Shopify store to our system.
>
> **What happened:** The API key you provided seems to be for your development 
> store, not your live store. The permissions are slightly different.
>
> **What I need:** Could you generate a new API key from your live Shopify admin? 
> Here's how:
> 1. Go to Settings → Apps → Develop apps
> 2. Create a new app (or select existing)
> 3. Set permissions: read_products, read_orders, read_customers
> 4. Copy the API key + secret
>
> If that seems confusing, I can hop on a quick 10-minute call and walk you 
> through it. Just say the word!
>
> Everything else is on track — this is the last piece we need.

**David:** "Oh shoot, you're right. Let me grab the right one. Here it is: [key]"

**Agent:**
> Got it! Testing now...
>
> ✅ **Connected successfully!** Your Shopify store is linked and syncing. 
> I can see your product catalog (142 items) and recent orders loading in now.
>
> Your full setup is now complete:
> - ✅ Account created
> - ✅ Shopify integration (live store)
> - ✅ Email marketing configured
> - ✅ Customer segments imported
>
> Ready to schedule your kickoff meeting? I have availability this Thursday 
> or Friday.

**What happened internally:**
1. Detected integration failure during setup
2. Diagnosed the specific issue (dev vs. live key)
3. Explained clearly + provided step-by-step fix
4. Offered call as alternative (removing friction)
5. Client self-resolved quickly
6. Confirmed success and moved to next phase
7. Didn't blame client or make it feel like their mistake
