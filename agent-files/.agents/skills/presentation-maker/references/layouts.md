# Layouts: 24 core patterns + deck-craft patterns + 16 reference patterns (R1–R16)

A layout is not decoration — it's a way of *thinking on the slide*. The layout you pick determines how fast the audience grasps the point and what they grasp first. Use the catalog below to match the message to the right shape.

## How to use this catalog

For each slide, ask: "What is this slide *doing*?" Then pick the layout that matches the job.

- **Stating a single claim** → big-statement, hero-quote, full-bleed image
- **Showing magnitude** → big-stat, comparison-stats, bar-of-bars
- **Comparing things** → side-by-side, before/after, decision-matrix
- **Showing a process** → numbered-steps, timeline, kanban-flow
- **Showing relationships** → 2×2 matrix, pyramid, hub-and-spoke, bubble-cluster (R13)
- **Showing a structure** → grid-of-cards, sectioned-list, tree
- **Quoting a person** → pull-quote, testimonial-card, pull-quote-with-corner-portrait (R14)
- **Setting the stage** → cover, section-divider, agenda
- **Walking through detail** → annotated-image, two-column, exploded-diagram
- **Stating a long-form thought** → wide-body paragraph (R10), full-bleed atmosphere quote (R4)
- **Listing features/benefits** → diamond-bullet 2×2 (R12), feature dots row (R6), feature row with photos (R15-variant), highlighted-first row (R16)
- **Editorial/brand opening** → triptych panel cover (R15), asymmetric color block (R3), black panel contrast (R5)

**Vary layouts across the deck.** Repeating "title + bullets" 12 times is the surest way to lose the room. Aim for at least 5-6 different layout patterns across a 10-slide deck.

---

## The 24 core patterns

### 1. Cover slide
The first impression. Strong title (often the deck's claim, not its topic), subtitle or speaker name, date. Bold visual: a single hero image, a typographic treatment, or a saturated color field. **No agenda, no logos-of-everything, no "Q4 2026 Q4 2026" repetition.**

### 2. Section divider — MANDATORY
Every major section MUST open with one. Full-slide saturated brand-color fill. Section title top-left (~60pt bold). Section number bottom-right (~210pt bold, white, slight transparency so it reads as architecture not clutter). Zero other content — no body, no image, no decoration. Reference: MetricBridge "Data Signal / 01" slide.

```javascript
// Full-bleed brand color
s.addShape("rect", { x:0, y:0, w:SW, h:SH, fill:{color:C.accent}, line:{color:C.accent} });
// Title top-left
s.addText("Data Signal", { x:0.6, y:0.6, w:8, h:1.2, fontSize:60, bold:true, color:"FFFFFF" });
// MASSIVE number bottom-right, slightly transparent
s.addText("01", { x:SW-5.2, y:SH-4.4, w:5, h:4, fontSize:210, bold:true,
  color:"FFFFFF", align:"right", valign:"bottom", transparency:18 });
```

### 3. Agenda / table of contents
Use sparingly — needed only in longer decks (>15 slides) or formal contexts. Numbered list, generous spacing, optionally with time estimates. Skip in short decks; the section dividers do the work.

### 4. Big-statement
One sentence, set huge (60-120pt), centered or left-aligned, on a near-empty slide. Use when the slide is making a *single* claim that you want to hit hard. Often used at section openings and the close.

### 5. Big-stat
A single number, set very large (120-240pt), with a short label beneath ("of users return within 7 days"). Use when a number *is* the point. Pair with a thin sub-label giving the source or timeframe. Don't combine multiple stats here — that's pattern #6.

### 6. Stat-tiles (multi-stat)
3-4 colored tiles in a horizontal row. Each tile: label top-left (11pt bold), giant value centered (50-65pt bold), description BELOW the tile, outside it (10pt muted). First tile = primary accent fill with white text. Others = neutral tints. No borders, no shadows — fill only. Corner radius 0.1in. Keep stats parallel: same units, same level of detail. Reference: MetricBridge "This Quarter In Numbers" slide.

```javascript
const tileW = 2.9, gap = 0.3, tileH = 2.2, ty = 2.6;
const fills = [C.accent, C.mid, C.mid, C.mid];      // first = accent, rest = neutral tint
const txt   = ["FFFFFF", C.bone, C.bone, C.bone];
stats.forEach((st, i) => {
  const tx = 0.6 + i * (tileW + gap);
  s.addShape("rect", { x:tx, y:ty, w:tileW, h:tileH, fill:{color:fills[i]}, line:{color:fills[i]}, rectRadius:0.1 });
  s.addText(st.label, { x:tx+0.2, y:ty+0.18, w:tileW-0.4, h:0.3, fontSize:11, bold:true, color:txt[i] });
  s.addText(st.value, { x:tx, y:ty+0.55, w:tileW, h:1.2, fontSize:58, bold:true, color:txt[i], align:"center", valign:"middle" });
  // description OUTSIDE the tile, below it
  s.addText(st.desc, { x:tx+0.05, y:ty+tileH+0.12, w:tileW-0.1, h:0.6, fontSize:10, color:C.dim });
});
```

### 7. Pull-quote
A short quotation set large, in a contrast color or italic, with attribution beneath. Use for testimonials, customer voice, founding philosophy. The quote should fit in 1-3 lines; trim aggressively.

### 8. Testimonial card
Photo of speaker + their quote + name + title/company. Often laid out as: portrait on one side, quote on the other. Use when *who said it* matters as much as *what they said*.

### 9. Full-bleed image with overlay
Image fills the slide; a band, gradient, or color block overlays a title or short caption. Use for emotional or atmospheric beats — opening of a deck, transition into a new theme, anchoring a customer story. Make sure text contrast against the image is strong (often a darkened gradient is required).

### 10. Two-column
Text on one side, image/diagram/chart on the other. Roughly 50/50 or 40/60. The classic explainer layout — use generously, but vary which side gets the image to keep rhythm.

### 11. Half-bleed image
Image bleeds to one edge filling ~40-50% of the slide; text occupies the rest. Visually more grounded than a centered image-with-text. Especially good when the image is portrait-oriented or the text needs room.

### 12. Annotated image
A single image (screenshot, product photo, diagram) with labels and callout lines pointing to specific parts. Use for product walkthroughs, UI explanations, anatomy of a system. Number callouts (1, 2, 3) and explain in a sidebar or beneath.

### 13. Grid of cards (3, 4, or 6 up)
Repeated card units with icon/image + heading + 1-2 lines. Use for feature lists, team intros, services, pillars. Keep cards rigorously parallel — same word count, same image style. **Tiles use solid color fills (accent or neutral tint), NOT white-with-a-border.** Bordered white cards read as default/AI-generated; filled tiles read as designed. If you can't keep cards parallel, you have a layout-mismatch problem.

### 14. Icon-row
Horizontal row of 3-5 icons, each with a short label. Use to summarize a process or set of values at a glance. Lighter weight than grid-of-cards — use when each item only needs a label, not a description.

### 15. Side-by-side / before-after
Two columns with parallel structure showing two states or options. Use the *same* layout for both sides so the differences pop. Title each side clearly. Often add a small "→" or "vs." in between.

### 16. Numbered steps (process flow)
A linear sequence (3-6 steps) with numbered headers and short descriptions. Horizontal works for short labels; vertical works for longer descriptions. Add arrows or thin connectors to show flow.

### 17. Timeline
Horizontal axis with dated milestones above/below the line. Use when *time itself* is the structuring principle (company history, roadmap, project milestones). For roadmaps with uncertainty, use approximate buckets ("Q3", "H2") not precise dates.

### 18. 2×2 matrix
Two axes, four quadrants, with items plotted in them. Use to position options or compare things on two dimensions (impact/effort, urgency/importance, competitive landscape). Label both axes clearly. Put your point of view *in* the matrix — highlight the quadrant you care about.

### 19. Pyramid / hierarchy
Stacked tiers showing dependence or proportion (Maslow-style). Use sparingly — easy to overuse. Best when there's a genuine "foundation supports top" relationship.

### 20. Hub-and-spoke
Central concept with surrounding related concepts. Use when one thing relates to many others without strict hierarchy (a platform with integrations, a person with stakeholders). Avoid if there's no genuine "hub" — a flat grid is honest.

### 21. Decision matrix / scorecard
Table comparing options across criteria. Use sparingly — tables compete with each other for attention. Highlight the row or column you're recommending in a contrast color so the conclusion is visible.

### 22. Glass cards on photographic background
Translucent rounded cards (light borders, low-alpha fill, slight backdrop blur) overlaid on a photographic or strongly gradient background. Use for editorial / premium decks, when the deck's subject has visual identity, or when you want emotional context behind structured content. See `design-system.md` for the CSS recipe and the pptx approximation.

### 23. Display-dominant title slide
Title set at 100-160pt occupying the upper third to half of the slide, with a brief body paragraph beneath at 18-22pt. The title is the slide. Use for section openers, big-claim slides, and decks where editorial confidence is the tone. See `design-system.md` for the type-scale notes.

### 24. Bar-of-bars / dense chart
Standard chart (bar, line, scatter) — but the layout question is *what surrounds it*. Always: claim title above, "so what" sentence beneath, source citation in the corner. The chart is the evidence; the words tell the audience what to see.

---

## Consistent footer rule

**Every slide gets a single rounded-pill footer** — not just a page number, a brand signature. Format: `Brand · 01/10 · domain`. One tidy element, bottom-left or bottom-center, muted fill. Apply to all future decks.

```javascript
function footerPill(s, brand, idx, total, domain, C) {
  const SW = 13.33, SH = 7.5;
  const label = `${brand}  ·  ${String(idx).padStart(2,"0")}/${String(total).padStart(2,"0")}  ·  ${domain}`;
  const pw = 4.6, ph = 0.34, px = 0.6, py = SH - 0.62;
  // Muted pill
  s.addShape("roundRect", { x:px, y:py, w:pw, h:ph, rectRadius:ph/2,
    fill:{ color: C.MID || "2A2A2A" }, line:{ color: C.MID || "2A2A2A" } });
  s.addText(label, { x:px, y:py, w:pw, h:ph, fontSize:9, color: C.DIM || "9B9B8F",
    align:"center", valign:"middle", charSpacing:1 });
}
// Call once per slide, last (so it sits above backgrounds). On dark divider/closing
// slides use a translucent white pill instead so it stays legible.
```

Reference: APS Polymers v6 — `APS Polymers · 01/10 · apspolymers.net` on every slide.

---

## Deck-craft patterns (SentinelCore / APS v6 learnings)

These are named, not renumbered, so they don't collide with patterns 1-24 above. Each was proven on a real planning/investor deck.

### Image-strip cover
Title + tagline in the **top half**, a full-width cinematic image strip in the **bottom half**. No overlay on the image — clean and editorial. A calmer, more sophisticated alternative to the full-bleed cover. Add a compressed tagline line and the footer pill.

### Two-weight big statement
All lines at the **same font size**; the final punchline switches to **bold** for emphasis — no color change, weight alone carries it. Use the pptxgenjs runs array. Add a small arrow-circle (→) bottom-right as a CTA cue.

```javascript
s.addText([
  { text:"We don't move product.\n", options:{ bold:false } },
  { text:"We move markets.\n",        options:{ bold:false } },
  { text:"We Are the Solution.",        options:{ bold:true } },
], { x:0.7, y:1.8, w:11, h:3.6, fontSize:54, color:C.BONE, lineSpacingMultiple:1.05 });
// Arrow-circle CTA, bottom-right
s.addShape("ellipse", { x:11.9, y:6.0, w:0.8, h:0.8, fill:{color:C.ACCENT}, line:{color:C.ACCENT} });
s.addText("→", { x:11.9, y:6.0, w:0.8, h:0.8, fontSize:26, bold:true, color:"FFFFFF", align:"center", valign:"middle" });
```

### Philosophy / "Our Approach" slide
A trust-builder. Small eyebrow label ("Our Approach"), an **oval element with texture** center-left (see Abstract texture-oval below), and one large guiding-principle paragraph (~26pt). Example: *"We do not move product. We move markets. Every relationship we build is engineered to outlast any single transaction."* Builds trust faster than any credential.

### Numbered priority pills (instead of bullets)
Replace a bullet list with a **2×2 grid of items**, each carrying a numbered pill (01/02/03/04) — muted fill + subtle border. Far more structured and credible than a list.

```javascript
const items = [ {n:"01", t:"..."}, {n:"02", t:"..."}, {n:"03", t:"..."}, {n:"04", t:"..."} ];
const cw=5.6, ch=1.9, gx=0.4, gy=0.4, x0=0.7, y0=2.0;
items.forEach((it,i)=>{
  const col=i%2, row=Math.floor(i/2);
  const x=x0+col*(cw+gx), y=y0+row*(ch+gy);
  // numbered pill: muted fill + subtle border
  s.addShape("roundRect",{ x, y, w:0.9, h:0.5, rectRadius:0.25,
    fill:{color:C.MID}, line:{color:C.DIM, width:0.75} });
  s.addText(it.n,{ x, y, w:0.9, h:0.5, fontSize:14, bold:true, color:C.BONE, align:"center", valign:"middle" });
  s.addText(it.t,{ x:x+1.1, y, w:cw-1.1, h:ch, fontSize:14, color:C.BONE, valign:"top" });
});
```

### Device-mockup hero
Prove the product is real. Text in the **left column**, a dark **device image (laptop/phone with the live UI)** in the right column, **touching the right edge**. The device makes the platform feel operational, not aspirational.

### Full-slide quote (no portrait)
A full quote at ~34pt carries the entire slide. Eyebrow label above, attribution below, **no person photo**. Add a subtle texture (e.g. pellets) at very low opacity for depth without distraction. Use when the words matter more than the face.

**The oversized quotation-mark trap (caused a real bug — guard against it).** A big decorative open-quote glyph (`"`) set at 60-100pt above the quote is gorgeous, but it WILL collide with the eyebrow/label sitting above it if you collapse its line box. The failure mode: setting `line-height` below 1 *and* a `height` smaller than the glyph (e.g. `font-size:90px; line-height:.5; height:.5em`) pulls the glyph up out of its own box and straight into the text above — they overlap into an unreadable smear.
  - **HTML rule:** never give the quote-mark a `height` smaller than its glyph and never set `line-height` below 1. Use `line-height:1`, no fixed `height`, and create the gap above it with a positive `margin-top` (≈16-22px). Let the box reserve the glyph's full height so flow layout keeps the eyebrow clear of it.
  - **pptx rule:** the mark is its own `addText` box with its own `y` — give it a `y` at least its own height below the eyebrow's `y`; never overlap their boxes by eyeballing.
  - **General principle:** giant display glyphs (quote marks, ghost numbers, architecture numbers) must own a real line box. Create spacing with margins/positions, never by collapsing the glyph's own height — a collapsed box silently lets the glyph bleed into whatever sits above or below it.

### Portrait trio
Three portraits in a row (team/leadership/advisors), rigorously parallel — same crop, same treatment, same caption structure. The human-context beat in the energy curve.

### Split-texture closing
Left half: solid dark + "Thank You." + a short paragraph + contact + CTA pill. Right half: an abstract **texture panel**. No separator line needed — the color contrast creates the split. More restrained and elegant than a full-bleed color close; right for sophisticated B2B/industrial brands.

### Abstract texture-oval (reusable element)
An `ellipse` shape with a **texture image inside it** — not a photo, not an icon, not a chart. A contemplative abstract element for any "how we think / our philosophy" slide.

```javascript
// Place the texture image, then mask perception with an oval framing the composition.
// pptxgenjs has no true image-clip, so: oval-shaped fill + image sized inside its bounds.
const ox=0.8, oy=2.2, ow=3.6, oh=3.6;
s.addImage({ path:"texture.png", x:ox, y:oy, w:ow, h:oh, sizing:{ type:"cover", w:ow, h:oh },
  rounding:true });           // rounding:true renders the image as an oval/circle in pptxgenjs
```

---


---

## Additional patterns from reference decks (R10–R16)

These 7 patterns were identified from visual analysis of the reference decks and fill gaps not covered by the 24 core patterns or the R1-R9 set.

---

### R10 — Wide-body paragraph
*Source: Cal College "Who This Course Is For"*

A single category label (10pt, top-left) is the ONLY heading. Below it, a 5-7 line body paragraph set at **36-50pt** fills most of the slide — the paragraph itself is the statement. This is NOT a headline followed by body copy. The paragraph IS the entire content, set at a display size so every word lands. No bullets, no sub-items, no supporting text.

```
[Category label small]

You live on social media and
want to understand what shapes
what we see online. This course
sharpens your communication
skills and deepens your
understanding of digital culture.
```

**When to use:** "Who this is for" slides, values statements, "the world we're building" moments, any time a full thought matters more than a punchy one-liner.

**Typography spec:** 36-50pt, regular or light weight (NOT bold — boldness fights the paragraph length), line-height 1.35-1.45, left-aligned, generous left margin.

---

### R11 — Step-fade color rows
*Source: Cal College "In This Course"*

Distinct from a standard numbered list. Left panel: a short intro paragraph. Right panel: **3-4 horizontal rows**, each a solid fill in a **step-progression of the same accent hue** (e.g. lightest yellow → mid yellow → dark mustard). Each row contains only: a number (01, 02, 03) and a short label. The color progression is the visual story — it implies sequence, priority, or depth.

```
[Left: intro paragraph]     [01  Label]  ← lightest shade
                            [02  Label]  ← mid shade
                            [03  Label]  ← darkest shade
```

**When to use:** Agenda, course outline, "what we cover," ordered steps where visual sequence matters more than detailed explanation.

**Key constraint:** All rows same font size and weight. The hue step does ALL the hierarchy work — resist adding bold or icons inside the rows.

---

### R12 — Diamond-bullet 2×2 list with breath element
*Source: Pulse & Calm "What Our Club Offers"*

A clean features/benefits slide with intentional breathing room. Title at top-left. Below: **4 short items in a 2×2 grid**, each starting with a `♦` diamond marker (10-11pt, accent color) followed by a 1-2 line phrase. **One decorative breath element** (a botanical illustration, a minimal line drawing, or a single abstract shape) sits in the far right, taking up ~25% of the slide width — purely atmospheric, not labeled, not functional.

```
[Title]

♦  Curated mix of strength       ♦  Calm design-led spaces
   mobility and recovery            in the heart of the city

♦  Personalized programs          ♦  Integrated app for booking
   guided by expert coaches          tracking and habits

                                              [botanical drawing]
```

**When to use:** Features/benefits slides for lifestyle, wellness, consumer, or premium brands. The botanical or organic element anchors the brand's aesthetic personality.

**Note:** The breath element is decorative ONLY and must be visually lightweight — a fine-line illustration, not a heavy shape. Remove it entirely for non-lifestyle brands.

---

### R13 — Bubble cluster diagram
*Source: MetricBridge "Core Strategy Focus Areas"*

A relationship or focus-area diagram made entirely of **filled circles of varying sizes** placed in an informal, overlapping or near-touching cluster. No lines, no arrows, no connectors. The size differential implies relative importance; the spatial arrangement implies relationships. Each circle contains a short text label (centered, white or dark depending on fill).

Three fill states: **accent color** (the primary/most important), **supporting color** (secondary), **near-white/cream** (tertiary/peripheral). At least one circle should be noticeably larger than the others.

```
         ○ Share insight loops
    ◎ Standardize reporting        ● (accent, largest)
         ○ Build experimentation
    ◎ Establish single source
```

**When to use:** Strategic focus areas, product pillars with relative weighting, stakeholder maps, ecosystem maps. Use when you want to show clustering and priority WITHOUT the rigidity of a grid.

**Anti-pattern:** Don't make all circles the same size — uniform circles defeat the whole point.

---

### R14 — Pull-quote with corner portrait
*Source: MetricBridge "From Guesswork to Clarity"*

A large pull-quote occupies the **center-left 60% of the slide**. A small photo portrait (roughly 1.5-2" wide) sits in the **bottom-right corner** — it does NOT bleed to an edge, it's a contained, slightly informal placement. Attribution (name + title) sits just left of the portrait or beneath the quote. The slide has two zones: the words (dominant, left) and the face (accent, right/bottom) — but they don't compete.

```
[Small italic label — "From Guesswork to Clarity"]

"For the first time, our marketing
reviews are about decisions, not
arguments over whose numbers
are right."

  Nadia Roemer                    [portrait photo]
  VP Marketing, HaioFlux
```

**When to use:** Customer testimonial, case study quote, investor/analyst endorsement. The face adds credibility without dominating the words.

**Key constraint:** The portrait must NOT touch any slide edge. It sits inside the slide boundaries, in the bottom-right zone, with clear margin around it.

---

### R15 — Triptych panel cover
*Source: ThreadCraft Studios opening slides*

The entire slide is divided into **3 equal vertical panels**. Each panel alternates between a light (white/cream) background and a dark (black/deep) background. Photos bleed edge-to-edge within their panel — top, bottom, and outer side edges all fully bled. A short caption or headline sits at the bottom of each panel in the panel's contrast color. The overall effect reads like a film strip or editorial spread.

A variant: one panel (usually center) has a large typographic statement instead of a photo, creating a "photo — text — photo" rhythm.

```
[Photo panel]  [Dark + text]  [Photo panel]
[caption]      [statement]    [caption]
```

**When to use:** Cover slides for fashion, DTC, culture, portfolio, or multi-product brands. Also works as a mood-board / brand intro slide. Requires strong editorial photography.

**Typography:** Ultra-light or regular weight grotesque at 20-28pt for captions within panels. If a center panel carries a headline, 50-80pt bold or ultra-light.

---

### R16 — Highlighted-first feature row
*Source: Flip Finance feature comparison*

4-5 items in a **horizontal row of equal-width tiles**. The **leftmost tile** is filled in the brand accent color (with white text) — this is the "recommended" or "what makes us different" item. The remaining tiles are on a neutral/muted fill. All tiles share the same height. Each tile: a short heading + 2-3 lines description. No icons, no bullets.

```
[ACCENT FILL         ]  [neutral]  [neutral]  [neutral]
 What makes us feel      Fast to    No gotcha   Feels
 different from a        start      fees        familiar
 regular bank app
```

**When to use:** "What makes us different" comparisons, feature highlights where one differentiator should be called out, pricing table alternative for non-pricing content.

**Key constraint:** Only the FIRST tile gets the accent fill. Never accent two tiles on the same slide — the highlight loses meaning.

## Anti-patterns: layouts to avoid or use cautiously

- **Title + 3-7 bullet points.** The default layout almost everywhere. Use *at most* twice per deck. Almost always there's a better choice in the catalog above.
- **Wall of text.** Replace with a claim title + a chart, or split into 2-3 slides.
- **SmartArt** (PowerPoint's auto-shapes). Looks generic and AI-generated. Build custom layouts instead.
- **Decorative shapes that mean nothing.** Random triangles, swooshes, accent rectangles. If a shape doesn't carry information, delete it.
- **Cluttered footer chrome.** Don't stack logo + page number + date + tagline as separate floating elements. Instead use the single consolidated footer pill (see "Consistent footer rule" below) — one tidy brand signature, not four scattered bits of chrome.
- **Centered body text.** Center titles only. Centered paragraphs/lists are hard to read because the left edge keeps moving.
- **Underline-accent below every title.** The hallmark of AI-generated slides. Use whitespace or background color to separate instead.
- **Floating centered image.** An image sitting in the middle of a slide with whitespace around it always looks unfinished. Every image must touch an edge: full half-panel or full-bleed background.
- **Weak, undersized closing slide.** The close is the deck's biggest moment — never a tiny centered "thank you." Headline must be large (60-130pt). Use either a full-bleed brand-accent color (high-energy, consumer/startup) OR a split-texture close (restrained, sophisticated B2B). See "Closing choice guide" below to pick. The failure is a small/quiet close, not the color itself.

---

## Density rule of thumb

If a slide's layout requires you to shrink the body font below 14pt to fit, the layout is wrong — split or simplify. The fix is never "smaller font."

## Layout variety check before you ship

Lay out thumbnails of every slide. Look for:
- Did I use 5+ distinct layouts in a 10+ slide deck?
- Are two adjacent slides using the same layout? If yes, can I swap one?
- Does the deck have a *rhythm* — alternating between dense and sparse?
- Is there at least one big-statement or big-stat slide acting as a punctuation mark?

If any of those is "no", spend 10 more minutes rebalancing. It's worth it.

---

## Closing choice guide

Two valid closings — pick by brand maturity, never default to one:

| Closing style | When to use | Look |
|---|---|---|
| **Full-bleed brand accent** | Consumer, startup, high-energy pitch | Whole slide = accent color (orange/red/lime). Headline 80-130pt. CTA in contrast color. Ghost number bottom-right. |
| **Split-texture close** | Sophisticated B2B / industrial / enterprise | Left: solid dark + "Thank You." + paragraph + contact + CTA pill. Right: abstract texture panel. Contrast creates the split, no separator line. |

Both must be large and confident — the failure mode is a small, quiet close, not the color itself. (Reference: APS v6 chose the split-texture close over v5's full-bleed orange.)
