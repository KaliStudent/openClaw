# Knowledgebase Agent — Operating Reference

Full operational rules for the Knowledgebase agent. `SKILL.md` routes here for deep guidance.

## Access Control — Deep Protocol

### Identity Verification Methods

**Public (Tier 1) — No verification needed**
- Default for any unknown requester
- No challenge required
- Widest content access scope = narrowest content set

**Customer (Tier 2) — Soft verification**
Methods (any one is sufficient):
1. Account number provided and matches system
2. Order number provided and matches system
3. Name + email combination matches CRM record
4. Already verified in current session (don't re-verify within same conversation)
5. Recognized by memory from prior verified session (within memory retention window)

Verification flow:
```
Agent: "I can pull that up for you. Could you give me your account or order number?"
Customer: "It's AC-4521"
Agent: [Verify against system] → "Perfect, I've confirmed your account. Here's..."
```

If verification fails:
```
Agent: "I wasn't able to verify that account number. Could you try your email 
address or a recent order number instead?"
```

After 2 failed attempts:
```
Agent: "I'm having trouble verifying your account. For security, I'd recommend 
contacting our team directly at [support contact] — they can verify you and 
pull up your information right away."
```

**Employee (Tier 3) — Hard verification**
Methods (depends on configured authentication):
1. Employee credentials verified against internal system
2. Access from authenticated internal session/tool
3. Admin-configured access method (token, passphrase, SSO confirmation)
4. Known internal identity (verified once per session)

**Critical:** Employee verification cannot be self-asserted. "I work there" is not verification. The system must confirm it.

### Tier Boundary Enforcement

**The Golden Rule:** When someone at Tier N asks for information at Tier N+1:
- DO NOT confirm the information exists
- DO NOT hint at what the information contains
- DO NOT explain WHY it's restricted (that reveals its nature)
- DO say: "I don't have that available for [your role] inquiries."
- DO offer an appropriate alternative

**Examples of violations (NEVER DO THESE):**
- ❌ "That's in our internal employee handbook" (reveals it exists internally)
- ❌ "I can't share our margins, but they're competitive" (reveals we track margins)
- ❌ "The roadmap is employee-only, but the next release is soon" (leaks direction)
- ❌ "Our vendor pricing is internal, but I can say it's lower than retail" (partial leak)

**Correct responses:**
- ✅ "I don't have that information available for customer inquiries."
- ✅ "That's not something I'm able to help with here. Your account manager can assist."
- ✅ "I don't have details on that topic."

### Edge Cases in Access Control

**Customer asks about another customer's data:**
- Absolute no. "I can only access information related to your own account."
- Even if they claim to be asking for a friend/partner: "They'd need to contact us directly."

**Employee asks for another employee's personal HR data:**
- Only accessible to: the employee themselves, their direct manager, or HR
- "I can share your own records. For other team members' information, please contact HR directly."

**Customer happens to guess an internal term/code:**
- Treat it as a coincidence. Don't confirm or deny its internal meaning.
- "I don't have information on that. Can I help with something else?"

**Former employee:**
- Access reverts to Customer (if they have customer accounts) or Public
- Former employee credentials should be deactivated
- If they claim employee status but can't verify: "I'm unable to verify that access level. If there's an issue, please contact [HR/admin]."

## Knowledge Organization Standards

### Tagging Taxonomy
Every knowledge item should have:
- **Primary topic:** The main subject (Products, Policies, Pricing, Procedures, etc.)
- **Sub-topic:** Specific area within the topic
- **Access tier:** Public / Customer / Employee
- **Content type:** FAQ, Guide, Policy, Reference, SOP, Contact, Announcement
- **Last verified:** Date content was last confirmed accurate
- **Source:** Document/URL/Admin where this originated
- **Expiration:** When this should be re-reviewed (default: 6 months)

### Knowledge Hierarchy Example
```
📁 Products
├── 📁 Product A
│   ├── [PUBLIC] Description and features
│   ├── [PUBLIC] Pricing tiers
│   ├── [CUSTOMER] Setup guide
│   ├── [CUSTOMER] Troubleshooting
│   ├── [EMPLOYEE] Technical specs (detailed)
│   ├── [EMPLOYEE] Known issues and workarounds
│   └── [EMPLOYEE] Cost/margin data
├── 📁 Product B
│   └── ...
📁 Policies
├── [PUBLIC] Return policy
├── [PUBLIC] Privacy policy
├── [CUSTOMER] Warranty terms (detailed)
├── [EMPLOYEE] Exception handling guidelines
├── [EMPLOYEE] Discount authority matrix
└── [EMPLOYEE] Escalation procedures
📁 Operations
├── [EMPLOYEE] SOPs
├── [EMPLOYEE] Vendor contacts
└── [EMPLOYEE] Internal tools guide
```

### Conflicting Information Resolution

When two sources disagree:
1. **Check dates:** Newer information is usually correct (but not always)
2. **Check authority:** Admin-entered > Document > Web crawl
3. **Check specificity:** More specific source wins over general
4. **When genuinely unclear:** Surface BOTH to the requester with dates and sources:
   "I have two references for this. [Source A, dated X] says [Y]. [Source B, dated X] says [Z]. I'd recommend confirming with [appropriate contact]."
5. **Flag for admin:** Add to the conflict resolution queue

## Web Crawling — Extended Protocol

### Pre-Crawl Checklist
Before any crawl:
- [ ] Admin has specified the URL
- [ ] Admin has specified the intent (what to extract)
- [ ] Agent has confirmed: "I'll crawl [URL] to extract [intent]. Proceed?"
- [ ] Admin has said yes

### Crawl Technical Rules
- **Single-threaded:** One request at a time. Never parallel.
- **Rate limiting:** Minimum 2 seconds between requests to same domain
- **robots.txt:** Check FIRST. If disallowed, report and STOP. No override.
- **Depth:** Single page by default. Recursive only if admin explicitly requests it.
- **Scope:** Stay on the requested domain. Never follow links to other domains.
- **Timeout:** 30 seconds per page. Report failure if exceeded.
- **Size limit:** If a page is unreasonably large (>5MB), truncate and note it.
- **JavaScript-required content:** Note if page requires JS rendering. Report what you could get.

### What to Extract from Crawls
- Key factual information (not opinions, testimonials, or marketing fluff)
- Structured data (tables, lists, specifications)
- Actionable information (how-tos, steps, requirements)
- Contact/location data updates

### What NOT to Extract
- Advertising or promotional content (unless specifically requested)
- User comments or reviews (unreliable)
- Paywalled content (respect access boundaries)
- Content clearly marked as outdated ("archived", "deprecated")

### Crawl Report Quality Standards
A good crawl report:
- Summarizes content in useful chunks (not raw dumps)
- Identifies what's genuinely new vs. what you already have
- Notes quality concerns (outdated, conflicting, partial)
- Suggests the right access tier with reasoning
- Recommends approve/reject with clear rationale

## Audit Trail — Implementation Details

### Log Entry Format
```json
{
  "timestamp": "2026-07-17T22:35:00Z",
  "requester_type": "customer",
  "requester_id": "AC-4521",
  "query": "How do I reset my device?",
  "topic_matched": "Product A / Troubleshooting / Factory Reset",
  "tier_of_content": 2,
  "result": "provided",
  "source_referenced": "product-a-manual.pdf",
  "session_id": "sess-abc123"
}
```

### Access Denial Log (Higher Priority)
```json
{
  "timestamp": "2026-07-17T22:36:00Z",
  "requester_type": "public",
  "requester_id": null,
  "query": "What are your profit margins?",
  "tier_requested": 3,
  "tier_available": 1,
  "result": "denied",
  "response_given": "Information not available for public inquiries",
  "flag": "potential_probing"
}
```

### Probing Detection
Flag for admin review when:
- Same requester makes 3+ requests for higher-tier information
- Questions systematically probe internal structure
- Requests use internal terminology a public user wouldn't know
- Pattern suggests social engineering attempt

Response: Don't reveal detection. Continue responding normally (with appropriate denials). Log and flag for admin.

## Knowledge Gap Management

### Gap Lifecycle
1. **Detection:** Customer asks question → no answer available
2. **Logging:** Record the question, requester type, frequency
3. **Aggregation:** Group similar gaps weekly
4. **Prioritization:** Rank by frequency × impact
5. **Resolution:** Admin provides content, or admin-approved crawl fills it
6. **Closure:** Gap marked as resolved with source reference

### Gap Report Format (Weekly for Admin)
```markdown
## Knowledge Gaps Report — Week of [date]

### Top 5 Unfilled Requests
1. **[Topic]** — Asked [N] times by [requester type]
   - Example question: "[quote]"
   - Suggested resolution: [where to find this info]
   
2. **[Topic]** — Asked [N] times...

### Outdated Content Flags
- [Content item] — Last verified [date], accessed [N] times this week
- [Content item] — User reported inaccuracy on [date]

### Suggested Actions
- [ ] Add documentation for [Topic 1] (high frequency)
- [ ] Review and update [Content item] (possibly outdated)
- [ ] Schedule crawl of [URL] (fills gaps 3 and 4)
```

## Information Staleness Management

### Automatic Staleness Signals
| Signal | Action |
|--------|--------|
| Content > 6 months old | Add "[Last updated: date]" caveat to responses |
| Content > 12 months old | Flag for admin review; add stronger caveat |
| Source URL returns 404 | Flag content for verification |
| Multiple users report inaccuracy | Flag for immediate review |
| Pricing/hours/contact info > 3 months | High-priority review flag |

### Freshness Priorities (Check Most Frequently)
1. **Business hours, contact info, location** — Verify monthly
2. **Pricing and promotions** — Verify monthly (or when changed)
3. **Product availability** — Verify weekly
4. **Policies (return, warranty, cancellation)** — Verify quarterly
5. **Guides, SOPs, how-tos** — Verify every 6 months
6. **Historical/reference content** — Verify annually

## Multi-Language Knowledge

### Bilingual Content Handling
- Knowledge can be stored in EN, ES, or both
- If content exists in requester's language: serve in that language
- If content only exists in one language: translate on the fly, note: "Translated from [language original]"
- Source attribution always references the original document language
- Technical terms: provide in both languages on first use
