# Skill Patterns Analysis

> Comprehensive analysis of 60+ agent skills from a production skill library.
> Extracted from `/workspace/agent-files/.agents/skills/` — studied 15+ skills in full depth.

---

## Table of Contents

1. [Canonical Skill Format](#1-canonical-skill-format)
2. [Skill Triggering & Routing Patterns](#2-skill-triggering--routing-patterns)
3. [Progressive Disclosure Architecture](#3-progressive-disclosure-architecture)
4. [Script & Automation Integration](#4-script--automation-integration)
5. [What Makes the Best Skills Great](#5-what-makes-the-best-skills-great)
6. [Common Patterns Across Skills](#6-common-patterns-across-skills)
7. [Recommended Skill Template for MainStreet AI](#7-recommended-skill-template-for-mainstreet-ai)
8. [Recommendations for Our 9 Specialist Agents](#8-recommendations-for-our-9-specialist-agents)

---

## 1. Canonical Skill Format

### File Structure

Every skill follows a directory-based layout:

```
skill-name/
├── SKILL.md              (REQUIRED — the skill's entry point)
├── reference.md          (detailed rules, specs, protocols)
├── examples.md           (worked walkthroughs, concrete scenarios)
├── onboarding.md         (first-run setup flow)
├── references/           (multiple reference docs for complex skills)
│   ├── daily-briefing.md
│   ├── meeting-prep.md
│   └── equip-and-extend.md
├── scripts/              (deterministic automation scripts)
│   ├── close_scan.py
│   └── run.sh
├── assets/               (templates, images, output resources)
│   └── tracker-template.xlsx
├── templates/            (structural templates for output)
│   └── design-playground.md
└── evals/                (test cases / evaluation criteria)
```

### SKILL.md Structure

```yaml
---
name: skill-name-lowercase-hyphens
description: One paragraph that includes WHAT it does AND WHEN to use it, with specific trigger phrases.
---
```

**Body structure (observed across top skills):**

```markdown
# Human-Readable Title

> AGENT RULE / PHILOSOPHY statement (if critical behavioral constraints exist)

Brief overview paragraph — what this skill does and the value it provides.

## When to use
- Bullet list of triggering scenarios
- Specific user phrases that activate this skill

## Capabilities / How It Works
- Visual diagram (often ASCII box diagrams)
- What it can do vs. what's "supercharged" with connectors

## Critical rules
- Numbered list of absolute behavioral constraints
- These NEVER get violated regardless of context

## Workflows / Core method
- Step-by-step procedures
- Named workflows (A, B, C) for different modes

## Output format
- Exact template of what the skill produces
- Markdown-formatted expected output

## Connectors / Requirements
- Table of integrations needed
- What's optional vs required

## Routing to sidecar files
- Pointers to reference.md, examples.md, etc.

## Out of scope
- Explicit boundaries on what this skill does NOT do

## Related Skills
- Cross-references to complementary skills
```

### Key Design Principle: SKILL.md is the Router

SKILL.md is intentionally kept lean (target: 1,500–3,000 words). It:
1. Defines WHAT and WHEN
2. Establishes non-negotiable rules
3. Routes to deeper files for HOW

---

## 2. Skill Triggering & Routing Patterns

### Description Field = The Routing Key

The `description` field in YAML frontmatter is the single most important field for skill discovery. It determines when the AI agent activates the skill.

**Pattern 1: Trigger phrase inclusion (most common)**
```yaml
description: This skill should be used when the user asks to "create an agent", 
  "add an agent", "write a subagent", "agent frontmatter"...
```

**Pattern 2: Scenario-based (natural language)**
```yaml
description: Close your books in QuickBooks each month. Automatically finds unsorted 
  transactions, double-paid bills, and missing receipts, and nudges customers who still owe you.
```

**Pattern 3: Action + context (what + when)**
```yaml
description: Research a company or person and get actionable sales intel. Works standalone 
  with web search, supercharged when you connect enrichment tools or your CRM. Trigger with 
  "research [company]", "look up [person]", "intel on [prospect]"...
```

**Pattern 4: Role-based (chief-of-staff pattern)**
```yaml
description: Your way to get whatever you need done. Preps you for meetings, surfaces 
  what needs attention, and tracks follow-ups across your email, calendar, Slack, and docs.
```

### Trigger Routing Best Practices

| Approach | Example | Effectiveness |
|----------|---------|---------------|
| **Exact user phrases in quotes** | `"morning briefing", "daily brief", "what's on my plate today"` | Highest — direct match |
| **Action verbs + objects** | `"research competitors", "how do we compare"` | High — intent matching |
| **Context + capability** | `"Use when a ticket has been resolved and the solution should be documented"` | Medium — situational |
| **Generic role** | `"Helps with documents"` | Low — too vague |

### "When to Use" Section in Body

The best skills include a dedicated `## When to use` section that expands beyond the frontmatter description:

```markdown
## When to use

Invoke when the user wants to:
- Run or prepare their monthly close; see what's blocking it
- Review uncategorized transactions, duplicates, missing receipts
- Review open AR / AP and chase unpaid invoices automatically
- Get an accountant-ready summary for the period
- Be pinged on Slack when something critical needs attention
```

### Anti-Triggering (Out of Scope)

The best skills explicitly define what they do NOT handle:

```markdown
## Out of scope

This assistant does NOT:
- Pay bills/invoices or move money
- Lock / formally close the period in QuickBooks
- File taxes or run payroll
- Make any QuickBooks write without per-item confirmation
```

---

## 3. Progressive Disclosure Architecture

### Three-Level Loading System

```
Level 1: ALWAYS LOADED (metadata only)
├── name + description (~100 words)
├── Used for routing decisions
└── Minimal token cost

Level 2: LOADED WHEN SKILL TRIGGERS (SKILL.md body)
├── Core procedures and workflows
├── Critical rules and constraints
├── Output format templates
└── Pointers to Level 3 resources
    Target: 1,500-3,000 words

Level 3: LOADED AS NEEDED (bundled resources)
├── references/ — detailed domain knowledge
├── examples/ — worked walkthroughs
├── scripts/ — executable automation
└── assets/ — templates and output files
    Can be unlimited in size
```

### How It Works In Practice

**financial-manager** (exemplary progressive disclosure):
- `SKILL.md` (171 lines): Rules, workflow overview, script commands, routing
- `reference.md`: Full operational rules (period resolution, checks, confirmation protocol, AR logic)
- `examples.md`: 10+ concrete walkthroughs (gated writes, guardrails, edge cases)
- `onboarding.md`: First-run setup flow
- `scripts/`: 3 Python scripts + runner

**presentation-maker** (deep reference library):
- `SKILL.md` (223 lines): Philosophy, style router, step 0 brief-check, image rules, format rules
- `references/` (15 files!): design-system.md, visual-references.md, industry-playbooks.md, layouts.md, format-pptx.md, format-html.md, rtl-guide.md, etc.

**chief-of-staff** (workflow routing):
- `SKILL.md` (220 lines): Operating loop, communication style, core workflows overview
- `references/` (6 files): daily-briefing.md, meeting-prep.md, follow-up-tracking.md, research.md, connectors-and-channels.md, equip-and-extend.md
- `assets/`: Tracker templates
- `evals/`: Test cases

### Key Insight: "Read This File When..."

Skills use conditional routing to references:

```markdown
## Routing to sidecar files

Full rules (the checks, AR/AP aging, the confirmation protocol...) → **read `reference.md`**.
Worked walkthroughs (incl. gated fixes, a reminder run, an escalation) → **read `examples.md`**.
```

```markdown
## The four core workflows

**Daily priorities briefing** — See `references/daily-briefing.md`.
**Meeting prep** — See `references/meeting-prep.md`.
**Follow-up & commitment tracking** — See `references/follow-up-tracking.md`.
**Research** — See `references/research.md`.
```

---

## 4. Script & Automation Integration

### Pattern: Agent Calls Scripts, Never Re-implements

The `financial-manager` skill codifies this perfectly:

```markdown
> **AGENT RULE:** Run the scripts to pull/compute numbers and decide who to remind — 
> never eyeball AR/AP aging, totals, or reminder eligibility, and never write inline 
> code that re-implements them.
```

### Script Design Principles (from `close_scan.py`)

1. **READ-ONLY by default** — Scripts query data; writes are the agent's job (consent-gated)
2. **Idempotent** — Same inputs → same output, every time
3. **Single source of truth** — "Every number the agent reports must come from this output"
4. **Structured JSON output** — Scripts output machine-readable JSON the agent reasons over
5. **Clear env requirements** — Documented environment variables with defaults
6. **Loud failures** — Fail with clear messages when inputs are missing
7. **Contract documentation** — Header comment explains inputs, outputs, and behavioral guarantees

### Script Integration Pattern

```bash
# Usage documented in SKILL.md:
QUICKBOOKS_ACCESS_TOKEN=… \
  python3 .agents/skills/monthly-close-assistant/scripts/close_scan.py <company_id> <YYYY-MM>
```

The skill documents:
- Exact command to run
- Required environment variables
- Expected JSON output schema
- What the agent should do with each field

### Automation Modes

Skills distinguish between:

| Mode | User Present? | Writes Allowed? | Example |
|------|---------------|-----------------|---------|
| **Interactive** | Yes | Yes (with consent) | "Close my books for May" |
| **Automation** | No | Never | Monthly close runs on the 3rd |
| **Policy-driven** | No | Pre-approved only | Daily AR reminders per approved policy |

### The "Kill Switch" Pattern

For skills that send outbound communication:
```markdown
6. **Kill switch is absolute.** If `reminders_enabled` is false, send NO reminders 
   or escalations, ever — regardless of policy or schedule.
```

---

## 5. What Makes the Best Skills Great

### Tier 1: Exceptional Skills (financial-manager, chief-of-staff, presentation-maker)

**What sets them apart:**

1. **Opinionated workflows with clear decision trees**
   - Not just "here's how to do X" but "here's the exact sequence, and here's what to do when..."
   - Every branch has a defined handling

2. **Behavioral constraints that are non-negotiable**
   - Rules like "Never write to QuickBooks without per-item confirmation"
   - "Never invent a number" 
   - "Kill switch is absolute"
   - These create TRUST

3. **Concrete output formats (not vague)**
   - Full markdown templates of expected output
   - Exact fields, exact structure
   - The agent knows exactly what "done" looks like

4. **Error handling and edge cases documented**
   - "What if numbers don't tie out?"
   - "What if the user says 'looks good' but hasn't seen everything?"
   - "What if a paid invoice appears in the reminder queue?"

5. **Progressive workflow with CTAs (Next Actions)**
   - After completing step A, the skill naturally flows to step B
   - "After a close run, deliver the workflow, not just the summary"
   - Skills never dead-end

6. **Graceful degradation (works without connectors)**
   - Every skill works standalone
   - Connectors supercharge but aren't required
   - "No connectors? No problem. Tell me your meetings and I'll help prioritize"

### Tier 2: Strong Skills (daily-briefing, call-prep, competitive-intelligence)

**Characteristics:**

1. **ASCII architecture diagrams** showing capability levels
2. **Execution flow** with clear phases (Gather → Research → Synthesize → Output)
3. **Connector tables** showing what each integration adds
4. **Mode variants** (Quick mode, End of Day mode, Deep dive)
5. **Related skills** cross-references

### Tier 3: Minimal Skills (create-plan, develop-web-game, competitive-analysis)

These have only frontmatter + 1-2 lines. They work but lack:
- Behavioral constraints
- Output templates
- Error handling
- Progressive disclosure

### Anti-Patterns Observed

| Anti-Pattern | Example | Better Approach |
|---|---|---|
| Vague description | "Helps with documents" | Include trigger phrases and context |
| No output format | Skill says what to do but not what "done" looks like | Include full output template |
| No constraints | Agent can do anything without guardrails | Define critical rules |
| Monolithic SKILL.md | 5,000+ words in one file | Progressive disclosure to references/ |
| No error handling | Assumes happy path always | Document edge cases and failures |
| No degradation path | Requires all connectors | "Works standalone, supercharged with..." |

---

## 6. Common Patterns Across Skills

### Pattern 1: The "Supercharged" Connector Model

Nearly every skill uses this two-tier approach:

```
┌─────────────────────────────────────────────────────────────────┐
│  ALWAYS (works standalone)                                       │
│  ✓ Core capability with user input / web search                 │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (when you connect your tools)                      │
│  + CRM: deal history, pipeline data                             │
│  + Email: recent threads, commitments                           │
│  + Calendar: auto-pull meetings                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern 2: The Gather → Synthesize → Act → Track Loop

From `chief-of-staff`:
1. **Gather context** — Pull from all available sources in parallel
2. **Synthesize** — Compress into what matters (judgment, not transcription)
3. **Act or recommend** — Produce an artifact, not just commentary
4. **Track and follow up** — Capture commitments somewhere durable

### Pattern 3: Confirmation Protocol (Write Safety)

For any skill that modifies external systems:
1. **Propose** — Show the exact change
2. **Confirm** — Get explicit yes for that specific item
3. **Re-read** — Verify state hasn't changed since proposal
4. **Write** — Apply the approved change
5. **Report** — Confirm what was written

### Pattern 4: Needs You / Handled / Watch

Communication pattern for briefings:
- **Needs you** — Decisions only the principal can make (goes FIRST)
- **Handled / FYI** — Things in motion they should know about
- **Watch** — Slow-developing items or risks

### Pattern 5: The Onboarding Flow

For skills requiring setup:
- Detect if first run vs returning
- Walk through connector setup
- Capture preferences/policies once
- Install automations
- Give capability briefing
- Never re-ask on subsequent activations

### Pattern 6: Mode Variants

Skills offer multiple execution modes:
- **Full mode**: Complete workflow
- **Quick mode**: Abbreviated version ("quick brief", "tldr my day")
- **End of day mode**: Wrap-up variant
- **Automation mode**: No user present, read-only

### Pattern 7: Cross-Skill References

Skills form an ecosystem:
```markdown
## Related Skills
- **call-prep** — Deep prep for any specific meeting
- **call-follow-up** — Process notes after calls
- **account-research** — Research a company before first meeting
```

### Pattern 8: The "Deliver, Don't Narrate" Rule

From `sales-content-strategy`:
> The job is to hand back finished work. Don't show a "here's my process" map, don't stop 
> after each step to ask permission to continue. All the value is in the finished thinking 
> and the finished posts.

### Pattern 9: Visual Design Token Systems

For output-heavy skills (presentations, HTML):
- Define a complete color system with CSS variables
- Typography scale and font choices
- Component patterns (cards, grids, matrices)
- Dark/light variants with explicit hex values

### Pattern 10: Data Structure Contracts

For data-handling skills, explicitly define the schema:
```yaml
competitor:
  name: "[Name]"
  profile:
    founded: "[Year]"
    funding: "[Stage + amount]"
  where_they_win:
    - area: "[Area]"
      advantage: "[Their strength]"
```

---

## 7. Recommended Skill Template for MainStreet AI

Based on the analysis, here is our recommended skill template:

### Directory Structure

```
skill-name/
├── SKILL.md              ← Entry point (1,500-3,000 words)
├── reference.md          ← Deep rules and specs (unlimited)
├── examples.md           ← Worked walkthroughs (3-5 scenarios)
├── onboarding.md         ← First-run flow (if setup needed)
├── scripts/              ← Deterministic automation
│   └── analyze.py
└── templates/            ← Output templates and assets
```

### SKILL.md Template

```markdown
---
name: skill-name
description: |
  [What this skill does in 1-2 sentences]. Use when [triggering scenarios]. 
  Trigger with "[phrase 1]", "[phrase 2]", "[phrase 3]", or when user mentions 
  [context keywords]. Works standalone; supercharged with [connector list].
version: 1.0.0
---

# [Human-Readable Skill Title]

> **CRITICAL RULE:** [The single most important behavioral constraint, if any]

[2-3 sentence overview of what this skill does and the value it delivers]

## When to Use

Use this skill when:
- [Scenario 1 — specific user action or request]
- [Scenario 2 — specific user action or request]
- [Scenario 3 — proactive trigger condition]

Do NOT use when:
- [Anti-scenario 1]
- [Anti-scenario 2]

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  ALWAYS (works standalone)                                       │
│  ✓ [Core capability 1]                                          │
│  ✓ [Core capability 2]                                          │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (with connected tools)                            │
│  + [Tool 1]: [What it adds]                                     │
│  + [Tool 2]: [What it adds]                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Critical Rules

1. **[Rule name]** — [Non-negotiable constraint]
2. **[Rule name]** — [Non-negotiable constraint]
3. **[Rule name]** — [Non-negotiable constraint]

## Workflow

### Phase 1: [Gather/Understand]
1. [Step with clear action]
2. [Step with clear action]

### Phase 2: [Process/Analyze]
1. [Step with clear action]
2. [Step with clear action]

### Phase 3: [Deliver/Output]
1. [Step with clear action]
2. [Step with clear action]

## Output Format

```markdown
# [Expected Output Title]

**[Key field 1]:** [Value]
**[Key field 2]:** [Value]

## [Section 1]
[Expected content structure]

## [Section 2]
[Expected content structure]

## Suggested Next Actions
1. [Action] — [Why now]
2. [Action] — [Why now]
```

## Running Scripts (if applicable)

```bash
python3 scripts/analyze.py <input> [options]
```

Output: JSON with `{ field1, field2, results[] }`
- Agent reasons over this output; never re-implements the logic inline.

## Connectors

| Purpose | Tool | Required? |
|---------|------|-----------|
| [Purpose] | [Tool name] | Yes/No |

## Mode Variants

- **Full**: [Complete workflow]
- **Quick**: [Abbreviated version — trigger with "quick [name]"]
- **Scheduled**: [Automation mode — read-only, no writes without user]

## Error Handling

| Situation | Response |
|-----------|----------|
| [Missing data] | [What to do] |
| [Conflicting info] | [What to do] |
| [External failure] | [What to do] |

## Routing to Reference Files

- Full operational rules → **`reference.md`**
- Worked examples → **`examples.md`**
- First-run setup → **`onboarding.md`**

## Related Skills

- **[skill-name]** — [What it does, when to chain]
- **[skill-name]** — [What it does, when to chain]
```

---

## 8. Recommendations for Our 9 Specialist Agents

Based on the patterns extracted, here are specific recommendations for improving our MainStreet AI specialist agents:

### Universal Improvements (Apply to All 9 Agents)

1. **Add explicit trigger phrases to descriptions**
   - Current: Generic capability descriptions
   - Better: Include 3-5 exact user phrases in quotes that should route to this agent

2. **Define "Critical Rules" (non-negotiable constraints)**
   - Every agent needs 3-5 absolute behavioral rules
   - These build user TRUST (e.g., "Never send without confirmation", "Never fabricate data")

3. **Include concrete Output Format templates**
   - Don't just describe what the agent does — show exactly what the output looks like
   - Use markdown templates with placeholders

4. **Implement Progressive Disclosure**
   - Keep the primary skill file lean (~2,000 words)
   - Move detailed domain knowledge to reference files
   - Move worked examples to separate files

5. **Add "Works standalone / Supercharged with" pattern**
   - Every agent should degrade gracefully without all integrations
   - Clearly show what each connected tool adds

6. **Implement the Gather → Synthesize → Act → Track loop**
   - Standard operating procedure for all agents
   - Makes behavior predictable and reliable

7. **Define error handling and edge cases**
   - What happens when data is missing?
   - What happens when sources conflict?
   - What happens when external systems fail?

8. **Add mode variants**
   - Full mode for comprehensive execution
   - Quick mode for brief interactions
   - Scheduled/automation mode for recurring tasks

9. **Cross-reference related agents**
   - Define which agents hand off to which
   - Create an agent ecosystem, not isolated islands

### Agent-Specific Recommendations

#### 1. Marketing Agent
- **Model after:** `content-creation` + `sales-content-strategy`
- **Add:** Channel-specific formatting rules (social, email, blog)
- **Add:** SEO fundamentals integrated into every content piece
- **Add:** Brand voice extraction process (from `presentation-maker`'s brand reference rule)
- **Add:** "Deliver, Don't Narrate" rule — produce finished content, don't ask permission at every step
- **Script opportunity:** `scripts/content_calendar.py` — generate a data-driven content plan

#### 2. Sales Agent  
- **Model after:** `daily-briefing` + `call-prep` + `account-research`
- **Add:** The Needs You / Handled / Watch briefing structure
- **Add:** Pipeline alerts with specific thresholds
- **Add:** Meeting prep workflow (who's attending, context, suggested agenda)
- **Add:** Confirmation protocol for any outbound communication
- **Script opportunity:** `scripts/pipeline_scan.py` — deterministic pipeline health check

#### 3. Customer Success Agent
- **Model after:** `chief-of-staff` + `knowledge-management` + `trip-organizer`
- **Add:** Two-tier memory system from `memory-management` (decode customer shorthand)
- **Add:** Follow-up & commitment tracking pattern
- **Add:** "Flag, don't fix" approach for sensitive account issues
- **Add:** Churn risk scoring with explicit signals
- **Script opportunity:** `scripts/health_score.py` — customer health computation

#### 4. Operations Agent
- **Model after:** `financial-manager` + `reconciliation`
- **Add:** The Confirmation Protocol (propose → confirm → re-read → write → report)
- **Add:** Kill switch pattern for automated actions
- **Add:** Onboarding flow for first-time setup
- **Add:** Scheduled automation with explicit read-only vs write modes
- **Script opportunity:** `scripts/ops_scan.py` — operational metrics gathering

#### 5. Finance Agent
- **Model after:** `financial-manager` (directly — this is the gold standard)
- **Add:** Complete confirmation protocol for any write operation
- **Add:** "Numbers must come from script output, never invented"
- **Add:** Accountant-ready summary generation
- **Add:** AR/AP aging with escalation policies
- **Add:** Ledger/audit trail for every action taken
- **Script opportunity:** Adopt `close_scan.py` pattern directly

#### 6. Legal/Compliance Agent
- **Model after:** `reconciliation` + `contract-review` + `compliance`
- **Add:** Strict "flag, never fix" approach (surface issues, never auto-resolve)
- **Add:** Confidence levels (from `knowledge-synthesis`) for legal interpretations
- **Add:** Source attribution for every claim
- **Add:** Explicit disclaimer: "does not provide legal advice"
- **Add:** Document the exact boundary between "inform" and "advise"

#### 7. HR/People Agent
- **Model after:** `chief-of-staff` + `doc-coauthoring`
- **Add:** Privacy constraints (never surface sensitive HR data in wrong context)
- **Add:** The structured doc co-authoring workflow for policy documents
- **Add:** Memory management for employee shorthand/nicknames
- **Add:** Onboarding flows for new employee setup
- **Script opportunity:** `scripts/org_health.py` — team health metrics

#### 8. Product/Technical Agent
- **Model after:** `skill-development` + `agent-development` + `playground`
- **Add:** Progressive disclosure (lean overview → deep references)
- **Add:** Validation rules for any artifacts produced
- **Add:** Interactive playground pattern for design decisions
- **Add:** The "state management" pattern (single state object, every action reads from it)
- **Script opportunity:** `scripts/validate.sh` — artifact validation

#### 9. Strategy/Research Agent
- **Model after:** `knowledge-synthesis` + `competitive-intelligence`
- **Add:** The deduplication + confidence scoring framework
- **Add:** Source attribution for every claim (inline + source list)
- **Add:** Conflicting information handling (surface conflicts, don't hide them)
- **Add:** Interactive HTML output for complex analyses (battlecard pattern)
- **Add:** "Lead with the answer, not the search process"
- **Script opportunity:** `scripts/market_scan.py` — competitive signal gathering

### Implementation Priority

| Priority | Action | Impact |
|----------|--------|--------|
| **P0** | Add trigger phrases to all agent descriptions | Routing accuracy |
| **P0** | Define Critical Rules for each agent | Trust and safety |
| **P1** | Add output format templates | Consistency |
| **P1** | Implement progressive disclosure (split into reference files) | Token efficiency |
| **P1** | Add error handling / edge case documentation | Reliability |
| **P2** | Build deterministic scripts for data gathering | Accuracy |
| **P2** | Add mode variants (full/quick/scheduled) | Flexibility |
| **P2** | Implement cross-agent handoff references | Ecosystem coherence |
| **P3** | Add onboarding flows | First-run experience |
| **P3** | Build interactive output formats (HTML artifacts) | User delight |

---

## Summary of Key Takeaways

1. **Skills are routers, not monoliths.** The SKILL.md is an entry point that routes to deeper resources based on need. Keep it lean.

2. **Trigger phrases are everything.** The description field determines whether a skill gets activated. Include exact user phrases.

3. **Trust comes from constraints.** The best skills are powerful BECAUSE they have non-negotiable rules. "Never invent a number" is more valuable than "can do anything."

4. **Scripts handle math; agents handle judgment.** Deterministic computation belongs in scripts. Reasoning, synthesis, and communication belong to the agent.

5. **Always work standalone; supercharge with tools.** Never make a skill useless without integrations.

6. **Deliver finished work.** Don't narrate a process — produce the artifact. Ask for input only at genuine decision points.

7. **Progressive disclosure saves tokens.** 100 words always in context → 2,000 words when triggered → unlimited when needed.

8. **Edge cases are where trust is built.** "What if data conflicts?" "What if consent is ambiguous?" "What if the system fails?" Document all of these.

9. **Skills form ecosystems.** Cross-references between skills create a network effect. One skill's output is another's input.

10. **The Confirmation Protocol is universal.** Any skill that modifies external state needs: Propose → Confirm → Re-read → Write → Report.
