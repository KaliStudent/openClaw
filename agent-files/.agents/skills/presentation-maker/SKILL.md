---
name: presentation-maker
description: Turn a quick description into a polished presentation. Builds real layouts, brand-matched visuals, and editorial-quality design for decks, pitches, or team updates.
---

# Presentation Maker

You are about to make a presentation. The job is not "fill slides with text" — it is to **make the message land**. Every layout choice, color, and word should serve that.

This skill assumes nothing about the format. It walks you through the right decisions in the right order, points you to deep references when you need them, and supports Hebrew and Arabic (including mixed-language decks) as first-class citizens — not afterthoughts.

---


## ⚑ MASTER PHILOSOPHY — THE OPERATING STANDARD

> **"You are the Visionary Creative Designer and Principal Art Director, a singular entity operating at the absolute peak of Creative-Concept unique Direction and Flawless presentations — Awwwward-winning designs."**

This is not a metaphor. It is the non-negotiable operating standard for every deck you produce.

**What this means in practice:**
- Every layout decision is **intentional and justified** — not defaulted. Ask: "why THIS layout for THIS content?" before placing anything.
- Typography creates **tension, hierarchy, and authority** — not just readability.
- Color is used with **restraint and precision** — to structure, not decorate.
- White space is treated as **active design material** — not empty room that needs filling.
- The deck must be **immediately, viscerally distinctive** — if you could swap another brand's logo in without friction, it failed.
- Every slide should be able to stand alone as a **piece of graphic design**.
- The target is: **jaw-dropping, unmistakably designed, strategically bulletproof.**

**Before building, read `references/visual-references.md`** — it contains 5 analyzed reference decks, their design DNA, extracted layout patterns (R1-R9), the Awwwward-standard quality checklist, and the 5-step art direction process. These are the visual benchmarks for this skill.



## ⚑ Step 0 — Brief check: ask or build?

**Before doing anything else**, count how many of these 5 signals are present in the user's request:

| Signal | Examples |
|---|---|
| Topic / content | "pitch deck for our solar startup", slide-by-slide structure |
| Format | "PowerPoint", "HTML", "pptx" |
| Audience | "investors", "the team", "clients in Israel" |
| Brand / palette | URL, logo, company name, color description |
| Slide count / structure | "12 slides", "like a real pitch deck", listed slide titles |

**4–5 signals present → start building immediately.** State your design decisions in 2–3 lines and move. Do not ask anything.

**3 signals present → state your assumptions and build.** Example: *"Going with dark fintech palette, Neue Haas Grotesk Display Pro, 12 slides, HTML — building now."* No confirmation needed.

**Fewer than 3 signals → ask everything missing in ONE combined message.** Never ask one question, wait, then ask another.

### What to never ask when the answer is obvious
- Don't ask "what format?" if the user said "PowerPoint" or "pptx"
- Don't ask "how many slides?" if the user gave a slide-by-slide structure
- Don't ask "what's the audience?" if the deck type makes it clear (pitch deck = investors)
- Don't ask "what's the vibe?" if the topic has a universal aesthetic (fintech = dark/minimal, bachelorette = fun/colorful)

---

## ⚑ Brand reference rule — do this BEFORE building anything

**Whenever the user provides a brand reference** (a company name, a website URL, a logo file, a design system doc, screenshots, or any visual material), you must actively mine it for everything that affects the deck's visual identity. Do not guess or invent brand colors. Do not reuse a previous palette from a different brand.

### What to extract from every brand reference

| Signal | What to do |
|--------|------------|
| **Website URL** | Open it with the browser tool. Take screenshots of the hero, a product/feature section, and a dark/light section if present. Extract the exact hex values by inspecting computed styles or reading CSS custom properties. |
| **Logo file** | Note the exact colors in the logo mark and wordmark. Use those as the primary palette anchors. |
| **Screenshots / images** | Identify the dominant background color, primary accent color, and text colors. Use an eyedropper mental model — pick the single most-used bg, the single most-used accent, and the text color. |
| **Design system doc** | Extract primary, accent, neutral, and semantic tokens directly. Use them verbatim. |
| **Company name only** | Search for the brand's website. Open it. Extract visually — do not fabricate. |

### What to do with what you find

- **Colors** → Set these as the deck's palette tokens. Never deviate — every `rect()`, `addText()`, and `rule()` in the deck should trace back to a brand token.
- **Typography** → If the brand uses specific fonts (visible on site or in a doc), use them or the closest web-safe equivalent. Note the weight and size relationships (e.g. if the site uses heavy weight bold headlines, do the same in the deck).
- **Layout rhythm** → Look at how the site is structured. Does it alternate dark/light sections? Use full-bleed imagery? Favor whitespace and minimal text? Replicate that rhythm across slides.
- **Logo** → If a logo URL or file is available, embed it on every slide's standard logo position. If not, approximate with the brand name in the correct font weight and color.
- **Imagery style** → What kind of photography or illustration does the brand use? Full-bleed atmospheric? Product close-ups? Abstract graphics? Inform placeholder descriptions accordingly so real assets can slot in cleanly.
- **Accent motifs** → Does the brand use a consistent visual device? (Stripe: diagonal slash; Notion: black-and-white blocks; Ella Solar: lime left bar + bottom bar) Identify it and repeat it every slide as the visual signature.

### Validation checkpoint before building

Before writing a single slide, state clearly:
- Primary background color: `#XXXXXX`
- Primary accent color: `#XXXXXX`
- Secondary accent (if any): `#XXXXXX`
- Text color on dark bg: `#XXXXXX`
- Text color on light bg: `#XXXXXX`
- Font: [name or closest equivalent]
- Recurring motif: [describe it]
- Layout rhythm: [dark/light alternating / all-dark / all-light / etc.]

If you cannot confirm any of these from the brand reference, say so and ask before proceeding.

---

## ⚑ Style Router — commit to a visual persona before building

Before writing a single line of code, pick ONE visual persona. Do not mix styles. Do not default to the same dark-navy-orange every time.

### The 10 presentation personas

| Persona | When to choose | Palette signal | Typography signal |
|---------|---------------|----------------|-------------------|
| **dark-luxe** | Crypto, fintech, premium SaaS, night-club energy | Off-black bg, 1 moody accent (gold/orange/teal) | Neue Haas Grotesk Display Pro + Inter |
| **editorial-premium** | Investors who care about taste, fashion, culture, studios | Ivory/cream bg, dark text, 1 editorial accent | Instrument Serif + Manrope |
| **minimalism** | Consulting, legal, B2B services, "less is more" clients | Near-white bg, near-black text, no accent excess | Helvetica Neue (single family) |
| **swiss-system** | Design-forward, B2B SaaS data products, rational grid lovers | White + 1 electric accent (lime/blue) + dark sections | Neue Haas Grotesk Display Pro + JetBrains Mono, architectural numbers |
| **soft** | Consumer apps, education, health, community products | Warm off-white, rounded, pastel accents | Gilroy + Manrope |
| **cinematic-product** | Hardware launches, product hero, immersive reveals | Full-bleed dark with dramatic lighting | Neue Haas Grotesk Display Pro heavy + Aether |
| **dashboard** | Data-heavy, metrics-first, B2B analytics | Dense surface grid, muted palette + 2 data colors | Inter + JetBrains Mono |
| **warm-modern** | Agencies, service brands, human-focused startups | Warm neutrals, earthy accents | Bricolage Grotesque + Manrope |
| **editorial-serene** | Wellness, luxury lifestyle, hospitality, premium consumer | Warm off-white `#F5F3EF`, serif headlines, 1 organic accent (burgundy/terracotta), botanical motifs | Instrument Serif + Manrope, generous spacing |
| **monochrome-editorial** | Fashion, DTC, culture, portfolio, brand agency | Pure white/black alternating panels, zero accent color | Neue Haas Grotesk Display Pro or Helvetica Neue, ultra-light to black weight range |

### How to choose

1. What is the **audience's taste level**? (sophisticated investor / consumer user / technical operator)
2. What is the **energy**? (calm + restrained / bold + assertive / warm + human)
3. What is the **content density**? (sparse hero-driven / medium editorial / dense data)

Match those three signals to the table above. Commit. Do not hedge.

**Then read the matching industry playbook in `references/industry-playbooks.md`** — it gives the visual *direction* for the topic (palette logic, type feel, motif, imagery, domain anti-patterns). Treat it as a compass, never a template: pick your own specific colors/fonts so two decks in the same industry never look alike.

### Anti-defaulting rules
- Never default to `dark-luxe` just because it looks professional
- Never use purple-blue gradients, neon violet glows, or cyan-indigo SaaS fog as the main aesthetic
- Never build a deck that could have any brand's logo swapped in without friction — if another startup fits, it failed

### Design variance knobs (set per persona)
- **DENSITY** (1=airy gallery / 5=pilot cockpit data) — most investor decks: 2–3
- **MOTION** (1=static / 3=editorial reveals / 5=cinematic) — default: 2
- **VARIANCE** (1=perfect symmetry / 5=artsy asymmetry) — most decks: 2

---

## ⚑ Image rule — intelligent image selection, never leave a slide visually empty

**Every slide that has an image zone must contain a real or AI-generated image.** Blank colored rectangles are never acceptable.

### Step 1: Identify the image TYPE before generating

| Type | When to use | Placement |
|---|---|---|
| **Scene / Environment** | Cover, Problem, Market, Closing | Full-bleed background with gradient overlay |
| **Product / Object Shot** | Solution, Technology, How It Works | Half-panel with gradient edge |
| **People / Human Context** | Team, Process, Proof/Traction | Full-bleed or contained zone |
| **Data / Abstract Visualization** | Business Model, Market Map, Architecture | Side panel, next to text |
| **Spot Illustration** | Feature cards (one per card) | Small, ~1" inside card |
| **Texture / Atmosphere** | Dark section dividers, depth on dark slides | Full-bleed, heavy overlay |

**Quick mapping:** Cover/Problem/Market/Closing → Scene. Solution/Technology → Product Shot. Team/Process/Proof → People. Business Model → Data Viz.

### Step 2: Build a specific, subject-aware prompt

**Formula:** `[viewpoint] [specific subject in context], [brand color mood], [lighting/atmosphere], [style keyword]`

- Name the actual subject — not "solar energy" but "bifacial solar panels integrated into a perimeter security fence at a railway station"
- Include brand palette as color mood: "navy and lime green color mood"
- Specify viewpoint, atmosphere, and style
- **Never use:** vague stock-photo language ("business team", "handshake", "happy customer", "city skyline")

**Real photography rule:** For Proof/Traction slides, ask user for actual deployment photos first. Only generate AI if none available. Never generate AI faces for Team slides.

### Step 3: Apply the correct overlay

Images behind text always need an overlay. Full details in `references/image-intelligence.md`. Short version:
- Full-bleed with text panel: OOXML gradient from 100% opaque bg color (text side) → 4% transparent (image side)
- Full-bleed cover/closing: dark flat overlay at 40-55%
- Texture backgrounds: dark flat overlay at 50-70%

**Generate all images in parallel** (parallel tool calls) before building slides. Never sequential.

**Full spec:** `references/image-intelligence.md`

---

## ⚑ Format capability rule — always use the platform's best native capabilities

| Format requested | Correct approach | Never do this |
|---|---|---|
| **Google Slides** | Build in pptxgenjs with full animations, upload to Google Drive converting to Google Slides format (`mimeType: application/vnd.google-apps.presentation`) | Do NOT upload a static pptx without animations |
| **PowerPoint (.pptx)** | Use python-pptx with raw OOXML timing/animation XML injected, OR pptxgenjs if animations aren't required | Do NOT deliver a flat static deck when animations are requested |
| **HTML** | Use CSS animations, transitions, and GSAP. Fully interactive and responsive | Do NOT produce static HTML when motion was requested |
| **PDF** | No animations possible — inform the user **before** delivering. Deliver perfect layout and color fidelity | Do NOT silently strip animations |

### Animation standards (all animated formats)

**ALL animations are triggered by click/tap only. Nothing animates automatically.**

- Every slide has exactly **one** click trigger — the first beat
- All subsequent beats use **onClick** too (not afterPrev, not afterEffect)
- The presenter fully controls pace. No auto-advancing, no timed reveals
- Max 3–4 animated elements per slide. Everything else visible from the start
- Pre-hide all animated elements at t=0 so they don't flash before their cue

**Beat order by slide type:**
- **Cover:** eyebrow → headline → tagline → metadata (each onClick)
- **Stat/card slides:** eyebrow → headline → body → EACH stat/card individually (number + label = one beat). Never group all stats into one beat.
- **Card/pillar slides:** eyebrow → headline → card 1 → card 2 → card 3 (each onClick)
- **Body/text slides:** eyebrow → headline → body → callout
- **Dark closing slide:** headline → tagline → CTA button

**Effects by element type:**
- Headlines: fade-up (opacity 0→1 + translateY 24px→0, 550ms)
- Hero stats: heavy-number-drop (fade + scale 0.85→1.0, 600ms, spring easing)
- Stat grids: each pair is a separate beat, staggered 120ms; number appears first, label 80ms later
- Cover headline: word-by-word reveal (use ONCE per deck maximum)
- All slide transitions: cross-fade with depth pull (incoming scales 0.97→1.0, 600ms). Never cuts, pushes, or wipes
- Section eyebrows: always FIRST beat, 300ms, before headline
- Dark/light rhythm: no 3+ same-tone slides in a row

**What kills it:** all elements appearing at once, instant cuts, bounce/spin/wipe animations, afterPrev chains that auto-play everything, animating backgrounds or decorative shapes.

---

## ⚑ Visual depth system — what makes slides feel designed

> **For dark decks, the authoritative implementation is the DEPTH EFFECTS SYSTEM in `references/design-system.md`** — the mandatory 5-layer build order (base → glow → content → grain → vignette), with `sharp` generator code for every effect PNG, warm brand tint, gradient fades, and glass-card tokens. The principles below are the conceptual overview; design-system.md is the build spec.

### 1. THREE-LAYER DEPT