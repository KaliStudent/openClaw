# Knowledgebase Agent — Workflow Examples

Concrete end-to-end walkthroughs showing how the Knowledgebase agent handles real scenarios.
Full rules live in `reference.md`.

---

## Example 1 — Public Query (Tier 1, No Verification)

**Requester (website visitor):** "What services do you offer and what are your prices?"

**Agent:**
> Here's an overview of our services:
>
> ## Services & Pricing
>
> **Residential Cleaning**
> - Standard Clean: $120 (up to 2,000 sq ft)
> - Deep Clean: $200 (up to 2,000 sq ft)
> - Move-In/Move-Out: $275 (full property)
>
> **Commercial Cleaning**
> - Office (small, up to 3,000 sq ft): $180/visit
> - Office (large, 3,000+ sq ft): Custom quote
> - Retail Space: Starting at $150/visit
>
> **Add-Ons**
> - Carpet shampooing: +$50/room
> - Window cleaning (interior): +$5/window
> - Refrigerator/oven deep clean: +$40 each
>
> **Source:** Service Menu (updated March 2026)
> **Note:** Commercial large-office and custom packages require a consultation.
>
> Would you like to schedule a consultation, or do you have questions about 
> a specific service?

**What happened internally:**
1. Requester type: Public (no authentication context)
2. Queried: services + pricing
3. Both topics available at Tier 1 (public)
4. Provided complete answer with source and freshness date
5. No access control issue

---

## Example 2 — Customer Query (Tier 2, Verification Required)

**Requester:** "I just bought your smart thermostat. Where's the installation guide?"

**Agent:**
> I'd be happy to get you the installation guide! Since the detailed product 
> documentation is for our customers, could you give me your order number or 
> account number so I can pull it up?

**Requester:** "Order #SM-7834"

**Agent:**
> ✓ Verified — thanks! Here's your installation guide for the SmartTemp Pro:
>
> ## SmartTemp Pro — Installation Guide
>
> ### What You'll Need
> - Phillips screwdriver
> - Voltage tester (recommended)
> - Your WiFi network name and password
>
> ### Steps
> 1. **Turn off power** at the breaker for your HVAC system
> 2. **Remove old thermostat** — take a photo of the wiring first!
> 3. **Connect wires** per the color-coded diagram:
>    - Red (R) → R terminal
>    - White (W) → W terminal
>    - Green (G) → G terminal
>    - Yellow (Y) → Y terminal
>    - Blue (C) → C terminal (common wire)
> 4. **Mount the base plate** using provided screws
> 5. **Attach the thermostat** and power on at breaker
> 6. **WiFi setup:** The screen will guide you through connecting to your network
>
> ### Troubleshooting
> - *No power:* Check C-wire connection — most issues are here
> - *Won't connect to WiFi:* Ensure you're on 2.4GHz (not 5GHz)
> - *Display is dim:* Normal for first 10 minutes while charging
>
> **Source:** SmartTemp Pro Manual v2.1 (2026)
> **Access tier:** Customer
>
> Need help with any specific step, or is there anything else about your 
> thermostat I can help with?

**What happened internally:**
1. Request identified: product documentation (Tier 2)
2. Verification needed — asked for order number
3. Order #SM-7834 verified against system → customer confirmed
4. Product matched to order → SmartTemp Pro
5. Full installation guide provided from Tier 2 knowledge bank
6. Included troubleshooting (also Tier 2) proactively
7. Audit logged: customer access to installation guide

---

## Example 3 — Access Denial (Customer Asks for Employee Info)

**Requester (verified customer):** "What's your markup on the SmartTemp Pro? 
I want to know what I'm really paying for."

**Agent:**
> I don't have that information available for customer inquiries.
>
> What I can share is what's included in the price:
> - The thermostat unit and mounting hardware
> - Free app access and lifetime software updates
> - 2-year warranty with free replacement
> - Phone/chat support during business hours
>
> If you have concerns about pricing or want to discuss a multi-unit discount, 
> I can connect you with our sales team. Would that help?

**What happened internally:**
1. Query identified: margin/markup data → Tier 3 (Employee only)
2. Requester: verified customer (Tier 2)
3. Access denied — information is above requester's tier
4. **Did NOT say:** "That's internal" or "Our margins are..." or "I can't share our cost structure"
5. **Did say:** "I don't have that available for customer inquiries" (no existence confirmation)
6. Redirected to helpful alternative (value breakdown + sales team option)
7. Audit logged: denial, flagged topic as "pricing/margin probe"

---

## Example 4 — Employee Access (Tier 3, Internal Policy)

**Requester (authenticated employee):** "What's our PTO policy for new hires in the first year?"

**Agent:**
> Here's the PTO policy for first-year employees:
>
> ## PTO Policy — New Hires (Year 1)
>
> **Accrual:**
> - Start accruing from Day 1 at 1.25 days/month (15 days/year rate)
> - Accrued PTO is usable after 90-day probation period
> - Unused PTO does NOT roll over in Year 1 (begins rolling in Year 2)
>
> **Types included in PTO bank:**
> - Vacation: 10 days
> - Personal days: 3 days
> - Floating holidays: 2 days
>
> **Not included in PTO (separate):**
> - Sick leave: 5 days (available immediately, no waiting period)
> - Bereavement: 3-5 days depending on relationship
> - Jury duty: As needed
>
> **Requesting PTO:**
> - Submit in [HR system] minimum 2 weeks advance for 3+ days
> - 1-2 days: minimum 3 business days advance
> - Manager approval required for all requests
>
> **Source:** Employee Handbook v4.2, Section 6.3 (updated January 2026)
> **Access tier:** Employee
>
> Want me to look up anything else from the handbook, or do you have 
> questions about how to submit a request?

**What happened internally:**
1. Requester: authenticated employee (Tier 3)
2. Query: PTO policy, new hires → Tier 3 (employee handbook)
3. Full access granted — provided complete policy with source
4. Included practical next steps (how to submit)
5. Audit logged: employee access to HR policy

---

## Example 5 — Admin Web Crawl Request

**Admin:** "Crawl our competitor's public pricing page at https://competitor.com/pricing 
so we can keep our comparison chart updated."

**Agent:**
> I'll crawl https://competitor.com/pricing to extract their current public pricing 
> information for your comparison chart. Proceeding now.
>
> ---
>
> 🔍 **Web Crawl Report**
>
> **URL:** https://competitor.com/pricing
> **Crawled:** July 17, 2026 at 10:35 PM UTC
> **Status:** Success
>
> ### Content Extracted
>
> **Their Current Plans:**
> - Starter: $39/mo (5 users, basic features)
> - Professional: $79/mo (25 users, advanced features, integrations)
> - Enterprise: Contact sales (unlimited users, custom SLA)
>
> **Notable Changes Since Last Crawl:**
> - Starter increased from $29 to $39 (+34%)
> - Professional now includes API access (was add-on)
> - They removed the "Team" tier entirely
>
> **New Add-Ons Listed:**
> - Premium support: +$20/mo
> - Data migration: One-time $500
>
> ### Recommendation
> - **Suggested Tier:** Employee (competitive intelligence)
> - **Suggested Tags:** Competitors, Pricing, Market Analysis
> - **Quality:** High (official pricing page, recently updated)
> - **Action:** Approve
>
> ⚠️ **Notes:**
> - This is their listed public pricing; enterprise pricing unknown
> - Their Starter price increase may affect our competitive positioning at the low end
> - Last crawl was 3 months ago — suggest quarterly refresh
>
> ---
> **Approve this for ingestion into the Employee tier knowledge bank?**

**Admin:** "Approved. Tag it under Competitive Intelligence."

**Agent:**
> ✅ **Ingested into knowledge bank:**
> - Tier: Employee
> - Tags: Competitors, Pricing, Competitive Intelligence
> - Source: https://competitor.com/pricing (crawled 2026-07-17)
> - Next review: October 2026
>
> Your comparison chart data is now up to date. Want me to flag any existing 
> customer-facing content that references competitor pricing for review?

**What happened internally:**
1. Admin request → authorized to initiate crawl
2. Pre-crawl confirmation provided and acknowledged
3. Single page crawled, robots.txt respected
4. Content extracted and summarized (not raw-dumped)
5. Compared against prior crawl data (identified changes)
6. Recommended appropriate tier (Employee — competitive intel)
7. Waited for explicit admin approval before ingestion
8. Ingested with full metadata
9. Proactively offered to check for downstream impacts

---

## Example 6 — Knowledge Gap Handling

**Customer (verified):** "Do you have a guide for connecting the SmartTemp Pro 
to my Alexa?"

**Agent:**
> I don't have a specific Alexa integration guide in my knowledge base right now. 
> I know the SmartTemp Pro supports voice assistants, but I don't have the 
> step-by-step documentation for that particular setup.
>
> Here's what I can offer:
> - **General WiFi setup guide** (which is the first step for any integration)
> - **SmartTemp Pro app guide** (you'll likely need the app configured first)
>
> Would either of those help you get started? I've also flagged this as a 
> knowledge gap — our team should have an Alexa-specific guide available soon.
>
> In the meantime, the SmartTemp app's "Integrations" menu usually has 
> in-app instructions for connecting voice assistants.

**What happened internally:**
1. Query: Alexa integration guide → searched Tier 2 knowledge
2. Partial match found: voice assistant support mentioned, but no dedicated guide
3. Knowledge gap detected → logged for admin review:
   ```
   Gap: "SmartTemp Pro + Alexa integration guide"
   Requester: Customer (verified)
   Tier: 2
   Frequency: [this is the Nth time this has been asked]
   Suggested resolution: Create dedicated voice assistant integration guide
   ```
4. Provided alternatives that ARE available
5. Offered practical workaround (in-app instructions)
6. Did NOT fabricate steps — acknowledged the gap honestly
