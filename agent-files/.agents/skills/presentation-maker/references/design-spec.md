# Design spec: structured, reusable, lintable

## THE 7 GOLDEN RULES

These override everything below. If a later instruction conflicts with these, the Golden Rule wins.

**Rule 1 — Typography IS the design.** Use ONE font family throughout the deck. Size and weight contrast does all the work — not extra fonts, not decoration. If another brand's logo could swap into your deck without friction, the typography failed.

**Rule 2 — Section dividers are mandatory.** Every major section must open with a full-slide brand-color fill. Top-left: section title (~60pt). Bottom-right: section number at 200-220pt (MASSIVE). Zero other content. Non-negotiable for multi-section decks.

**Rule 3 — Stat blocks use colored tiles.** Each metric gets a rounded-rectangle tile: number dominant (50-65pt), label at top (11pt), description text placed OUTSIDE the tile, below it. First tile = primary accent fill. Others = neutral tints.

**Rule 4 — Zero decorative shapes.** No abstract rectangles, swooshes, or diagonal accents. The only allowed shapes are: section-divider fills, stat tiles, quote cards, and dot bullets. If a shape carries no information, delete it.

**Rule 5 — Images must touch an edge.** Every image either (a) fills the full left or right half edge-to-edge, or (b) is a full-bleed background. Never a floating centered image with whitespace around it.

**Rule 6 — Radical whitespace on content slides.** At least 30-40% of every light-background content slide must be empty. Resist the urge to fill space.

**Rule 7 — Closing = full-bleed brand accent color.** The closing slide uses the actual brand accent (orange, red, lime — NOT black or dark navy) as the full slide background. Headline at 80-130pt. CTA button in a contrast color. Ghost number or brand element bottom-right.

### Layout variance requirement
A 10-slide deck must use **at least 6 distinct layout patterns**. No two consecutive slides may share the same structural layout.

---


Lock the deck's design system as a structured `design-spec.md` *file* before building. The spec serves three purposes:

1. **Reduce drift** — every slide reads from the same tokens; no slide invents its own colors or sizes.
2. **Reuse across decks** — when the user builds a second deck for the same brand, the spec is the starting point, not a blank page.
3. **QA target** — the spec is something you can lint (contrast ratios, broken token references, missing tokens) before generating slides.

This format is inspired by Google Labs's [DESIGN.md](https://github.com/google-labs-code/design.md) but adapted for presentation decks (which have stronger type hierarchy and motif requirements than UI design systems).

---

## The format

A `design-spec.md` file has two layers: a YAML frontmatter block with machine-readable tokens, followed by markdown prose that explains *why* those values exist and how to apply them.

```yaml
---
name: Acme Q3 Investor Deck
brand:
  primary_languages: [en, he]
  base_direction: ltr        # or "rtl" or "mixed"
  vibe: editorial premium
colors:
  primary: "#0B2545"         # deep navy, dominant
  secondary: "#13315C"       # supporting structure
  accent: "#D4AF37"          # gold, used in 5-10% of the deck only
  bg: "#FAFAFA"              # off-white background
  bg_dark: "#0B2545"         # dark cover/closing slides
  text: "#0B2545"            # on light backgrounds
  text_on_dark: "#FFFFFF"
  muted: "#6B7280"           # captions, sources
  success: "#10B981"         # optional, only if used
typography:
  display:                   # for cover, big-statement, big-stat
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 800
    size_pt: 120             # pptx point size
    line_height: 1.05
  title:                     # claim titles
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 800
    size_pt: 40
    line_height: 1.15
  section_header:
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 600
    size_pt: 26
  body:
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 400
    size_pt: 20
    line_height: 1.5
  body_hebrew:               # bumped 10% over Latin body
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 400
    size_pt: 22
    line_height: 1.5
  caption:
    font_family: "Wix Madefor Display"  # approved Hebrew-supporting font — replace with deck font
    weight: 400
    size_pt: 12
    color: "{colors.muted}"
layout:
  aspect_ratio: "16:9"
  canvas_pt: [960, 540]      # for pptx; or [1920, 1080] for HTML
  margin_pct: 6              # min margin as % of width
  gutter_pt: 24
motif:
  description: "Thin gold left-edge stripe on every content slide. Removed on cover and section dividers."
  shape: rect
  fill: "{colors.accent}"
  width_pt: 6
  position: left-edge
slide_types:
  cover:
    bg: "{colors.bg_dark}"
    text_color: "{colors.text_on_dark}"
    motif: none
  section_divider:
    bg: "{colors.primary}"
    text_color: "{colors.text_on_dark}"
    motif: none
  content:
    bg: "{colors.bg}"
    text_color: "{colors.text}"
    motif: stripe
  closing:
    bg: "{colors.bg_dark}"
    text_color: "{colors.text_on_dark}"
    motif: none
---

## Overview

This deck targets seed-stage VCs. Tone is editorial-premium: dense in evidence,
sparse in chrome, never corporate-blue. The gold accent carries the deck's
identity and should appear on every content slide as the left-edge stripe
plus one in-content highlight (a circle, a number, an underline on the
"so what" line).

## Colors

Primary navy dominates 60-70% of visual weight (page background on dark
slides, all text on light slides, primary chart elements). Off-white is the
content-slide background — never cream or warm-beige. Gold appears only on
the stripe motif and the *single most important* element per slide; if more
than two gold elements are on a slide, demote one. Muted gray is for
sources, captions, and one-step-back metadata.

## Typography

Wix Madefor Display supports both Latin and Hebrew without font swaps,
which is the deciding factor. Hebrew body bumps to 22pt to read at the same visual size as 20pt
6 and 9. Hebrew body bumps to 22pt to read at the same visual size as 20pt
Latin body. Display sizes are deliberately extreme (120pt) on cover and
big-statement slides; the audience should grasp the slide before they
finish reading.

## Layout

960×540pt is the native pptx slide size at 16:9. Margins are 6% of width
(~58pt). Gutters between content blocks are 24pt minimum, 48pt for breathing
room between major sections within a slide.

## Motif

The thin gold stripe is the deck's visual signature. It appears on every
content slide and only on content slides — its absence on cover, section
dividers, and the closing slide is what makes those slides feel different.
Resist adding the stripe to those slides "for consistency" — variation is
the point.

## Do's and Don'ts

**Do**

- Use gold for the *one* element per slide you want noticed.
- Set claim titles as full sentences ("Revenue grew 4×…"), not labels ("Revenue").
- Bump Hebrew body to 22pt when Latin body is 20pt — visual size matters more than nominal pt.

**Don't**

- Don't add a gold underline below titles — that's the AI-slide tell. Use whitespace and the left stripe instead.
- Don't add the stripe to cover/closing/section-divider slides.
- Don't use cream or beige backgrounds; this deck is navy + off-white.
- Don't put gold next to gold on the same slide. One accent per slide.
```

---

## Token reference syntax

Use `{path.to.token}` to point one token at another. E.g. `caption.color: "{colors.muted}"` means "use the muted color value" — when the muted color changes, the caption color updates automatically.

Valid forms:
- `"{colors.primary}"`
- `"{typography.body.font_family}"`
- `"{layout.gutter_pt}"`

Broken references (token doesn't exist) should be caught in lint. See "Linting checks" below.

---

## When to write the spec

Write it **once, at the start of building**, right after the user has answered the 5 upfront questions. Save it as `design-spec.md` next to the deck source. Reference it from every render — don't hardcode colors or sizes in slide code, read from the spec.

If the user has done a previous deck for the same brand, **start from that deck's `design-spec.md`** rather than building from scratch. Update what's different, keep what's the same.

---

## Linting checks (run before rendering slides)

These checks save real time — catching a broken reference in the spec is one fix; catching it after rendering 15 slides is fifteen.

### 1. WCAG contrast — required pairs

For each slide-type definition, the `text_color` against the `bg` must hit at least:
- **4.5:1** for body text
- **3:1** for titles/large text (>=24pt or >=18pt bold)

If your spec has any pair below those, either change the color or restrict that slide type to use larger type only.

Quick way to check: use a tool like https://webaim.org/resources/contrastchecker/ or compute the ratio directly. If you have ≤4 slide types, do this by hand. The cost is negligible.

### 2. Broken token references

Every `{colors.x}`, `{typography.x.y}`, `{layout.x}` must resolve to a defined token. If you write `caption.color: "{colors.mutd}"` (typo), nothing will render correctly. A simple grep can catch these:

```bash
grep -oE '\{[^}]+\}' design-spec.md   # list every reference; verify each exists
```

### 3. Primary color present

If the `colors:` block has no `primary`, you don't have a design system — you have an unsorted palette. Define `primary` before any other token.

### 4. Hebrew/Arabic body size adjustment

If the deck has Hebrew or Arabic content and `body_hebrew` (or `body_arabic`) isn't defined, you'll either undersized Hebrew or have to retrofit a second body style later. Define it upfront.

### 5. Motif defined exactly once

The motif description should be one paragraph. If it's three different shapes ("a stripe AND a corner mark AND a watermark"), pick one. Multiple motifs cancel each other out.

### 6. Accent appears on a maximum-share check

The accent color should fill ≤10% of the deck's visual weight. If you're using accent for backgrounds, large blocks, or text on more than a few slides, it's the primary — relabel.

---

## Reusing a spec across decks

Save the spec at the user's project level (not inside a single deck folder) when:

- The deck is for the same brand/team as a previous deck.
- The user explicitly says "this is our template, use it for everything."

When reusing, only override the fields that differ for *this* deck — usually `name`, the `slide_types` config, and sometimes `motif`. Colors, typography, and base layout stay locked.

---

## Why this format pays off

It feels heavier than "just pick colors" but it isn't, because:

1. You'd write down the choices anyway — the spec is the form.
2. Every slide can read from one source of truth — fewer drift bugs.
3. When the user says "make everything 2pt larger" or "the gold isn't quite right", you change one place.
4. The spec becomes a portable artifact — the user owns their brand system, not just one deck.
5. Lint catches contrast, ref, and structure errors before they become 30-minute QA loops.

If the user pushes back ("just make the deck, I don't want to fill out a spec"), the answer is: you fill out the spec *for* them based on their answers to the 5 upfront questions, show it back as a paragraph or two of plain prose, and confirm. The YAML behind the scenes is yours to maintain.
