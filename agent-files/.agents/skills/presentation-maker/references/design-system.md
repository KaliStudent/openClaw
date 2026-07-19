# Design system: palette, typography, motif

A deck's visual identity is three decisions: **color**, **type**, and **motif** (the one repeated visual signature). Lock them once at the start, apply consistently, and the deck looks designed instead of assembled.

---

## DEPTH EFFECTS SYSTEM

This is what separates a *generated* deck from a *senior brand-designer* deck. **Every dark slide must be built with 5 visual layers, in this exact order.** All effect PNGs are generated programmatically at the top of the build script with `sharp` — no external assets needed.

### The 5 layers (order is non-negotiable)

| # | Layer | What | Applied |
|---|---|---|---|
| 1 | Base color | Flat background fill (`#0F0F0F` for dark decks) | First |
| 2 | Atmospheric glow | Radial gradient PNG, full-bleed, 80-85% transparency | After base |
| 3 | Content | Images, text, shapes — the actual slide | Middle |
| 4 | Grain | Procedural noise PNG, full-bleed, 91-92% transparency | **Second-to-last** |
| 5 | Vignette | Radial PNG (clear center, dark edges), 70-74% transparency | **Last** (before footer) |

> **Order matters absolutely.** Grain and vignette go AFTER content, never before. Any text added *after* grain appears unaffected by it — that's wrong. Grain is always the second-to-last element; vignette is last (footer pill is the only thing on top).

### Layer 2 — Atmospheric glow

A radial-gradient PNG, full-bleed, at 80-85% transparency. Two types — **never both on the same slide**:

- **Purple glow, top-right** = depth. Deep purple `#502890` radial, centered top-right. Creates the illusion of spatial distance.
- **Orange glow, bottom-left** (or behind the hero element) = warmth/accent moment. Orange `#F07022` radial. Adds brand warmth from a second direction.

### Layer 4 — Grain (highest-impact single effect)

A procedural noise texture, full-bleed, at 91-92% transparency (so only 8-9% is visible). It kills the "flat screen" look and makes the slide feel like a designed surface. Random noise each build is correct and desirable.

> **File-size rule:** generate grain at **960×540**. This keeps the deck under ~35MB. Full 1920×1080 grain bloats the deck to ~76MB — avoid.

### Layer 5 — Vignette

A radial PNG: transparent center, dark edges (black, max alpha ~180 at corners, quadratic falloff). Applied last at 70-74% transparency. Draws the eye to center and adds cinematic depth.

### Generator code (run once at the top of every build)

```javascript
const sharp = require('sharp');
const W = 13.33, H = 7.5;  // inches — slide dimensions for addImage calls

// --- Layer 2a: Purple atmosphere (depth) — 1920x1080, radial top-right, max alpha 55 ---
async function makePurpleGlow(out='/tmp/glow_purple.png') {
  const w=1920, h=1080, cx=w*0.82, cy=h*0.18, maxD=Math.hypot(w,h)*0.7;
  const px = Buffer.alloc(w*h*4);
  for (let y=0;y<h;y++) for (let x=0;x<w;x++){
    const i=(y*w+x)*4, d=Math.hypot(x-cx,y-cy);
    const a=Math.max(0, 55*(1-d/maxD));
    px[i]=0x50; px[i+1]=0x28; px[i+2]=0x90; px[i+3]=Math.floor(a);
  }
  await sharp(px,{raw:{width:w,height:h,channels:4}}).png().toFile(out);
}

// --- Layer 2b: Orange glow (warmth/accent) — 800x800, radial centered, max alpha 120 ---
async function makeOrangeGlow(out='/tmp/glow_orange.png') {
  const s=800, c=s/2, maxD=c;
  const px = Buffer.alloc(s*s*4);
  for (let y=0;y<s;y++) for (let x=0;x<s;x++){
    const i=(y*s+x)*4, d=Math.hypot(x-c,y-c);
    const a=Math.max(0, 120*(1-d/maxD));
    px[i]=240; px[i+1]=112; px[i+2]=34; px[i+3]=Math.floor(a);
  }
  await sharp(px,{raw:{width:s,height:s,channels:4}}).png().toFile(out);
}

// --- Layer 4: Grain — 960x540 single-channel noise (keeps deck < 35MB) ---
async function makeGrain(out='/tmp/grain.png') {
  const w=960, h=540, px=Buffer.alloc(w*h);
  for (let i=0;i<px.length;i++) px[i]=Math.floor(Math.random()*255);
  await sharp(px,{raw:{width:w,height:h,channels:1}}).png().toFile(out);
}

// --- Layer 5: Vignette — 1920x1080 RGBA, alpha = (dist/maxDist)^2 * 180, black ---
async function makeVignette(out='/tmp/vignette.png') {
  const w=1920, h=1080, cx=w/2, cy=h/2, maxD=Math.hypot(cx,cy);
  const px=Buffer.alloc(w*h*4);
  for (let y=0;y<h;y++) for (let x=0;x<w;x++){
    const i=(y*w+x)*4, d=Math.hypot(x-cx,y-cy);
    const a=Math.floor(Math.pow(d/maxD,2)*180);
    px[i]=0; px[i+1]=0; px[i+2]=0; px[i+3]=a;
  }
  await sharp(px,{raw:{width:w,height:h,channels:4}}).png().toFile(out);
}
```

### Per-slide application order

```javascript
// 1. Base
s.background = { color: "0F0F0F" };
// 2. Atmosphere — ONE of these, never both
s.addImage({ path:'/tmp/glow_purple.png', x:0, y:0, w:W, h:H, sizing:{type:'cover',w:W,h:H}, transparency:82 });
// 3. ...content (images, text, shapes)...
// 4. Grain — second-to-last
s.addImage({ path:'/tmp/grain.png', x:0, y:0, w:W, h:H, sizing:{type:'cover',w:W,h:H}, transparency:91 });
// 5. Vignette — last (before footer pill only)
s.addImage({ path:'/tmp/vignette.png', x:0, y:0, w:W, h:H, sizing:{type:'cover',w:W,h:H}, transparency:72 });
// ...footer pill on top...
```

---

## DEPTH EFFECTS — per-element treatments

### Warm brand tint on all photos
Every AI-generated or photographic image gets a brand-color overlay rect on top at **88% transparency** (12% visible). For APS: orange `#F07022`. For a blue SaaS brand: their primary blue. This color-grades all photography to the brand palette so images from multiple sources feel like they belong together.

```javascript
s.addImage({ path:'photo.png', x:px, y:py, w:pw, h:ph });
s.addShape("rect", { x:px, y:py, w:pw, h:ph, fill:{color:"F07022", transparency:88}, line:{type:"none"} });
```

### Gradient fade transitions — never hard-cut an image into a background
Always fade the edge where an image meets the dark background — this is what CSS `linear-gradient` does in web design. Without it, images look pasted in. Generate two gradient PNGs (opaque bg color → transparent):

- `grad_left.png` — horizontal, left edge = opaque bg, right edge = transparent. Place at the **left edge of any right-panel image**.
- `grad_top.png` — vertical, top = opaque bg, bottom = transparent. Place at the **top of any image strip**.

```javascript
// grad_left.png — bg color at left, fading to transparent at right
async function makeGradLeft(out='/tmp/grad_left.png', bg=[15,15,15]) {
  const w=400, h=1080, px=Buffer.alloc(w*h*4);
  for (let y=0;y<h;y++) for (let x=0;x<w;x++){
    const i=(y*w+x)*4, a=Math.floor(255*(1-x/w));
    px[i]=bg[0]; px[i+1]=bg[1]; px[i+2]=bg[2]; px[i+3]=a;
  }
  await sharp(px,{raw:{width:w,height:h,channels:4}}).png().toFile(out);
}
```

### Orange radial glow behind accent elements
Whenever a key element needs visual weight — the hero stat tile, the philosophy-slide oval, the cover headline — place the orange glow PNG centered behind it at **72-78% transparency**. Adds warmth and draws the eye without being aggressive. (Draw the glow BEFORE the element so the element sits on top.)

---

## ⚠ Punctuation rule — no em dashes in slide copy

**Never use em dashes (—) in slide text.** They read as cluttered and typographically aggressive on large-format slides.

**Alternatives:**
- Break into two sentences. (Usually the best fix.)
- Use a colon: if the second part explains the first.
- Use a comma, or restructure the sentence entirely.
- For a pause, use an ellipsis sparingly.

This applies to all text elements: headlines, body copy, callouts, captions, speaker notes.

```javascript
// BAD
"Roads, fences, acoustic walls — mandatory infrastructure — generate zero energy."

// GOOD
"Roads, fences, and acoustic walls generate zero energy today."

// GOOD
"Mandatory infrastructure: roads, fences, and acoustic walls generate zero energy."
```

---

## ⚠ Text-on-shape contrast rule — CRITICAL

**Text inside any filled shape (circle, badge, card, rectangle, pill, icon container) must be a HIGH-CONTRAST color against that shape's fill.** This is one of the most common and most damaging failures in generated decks.

### The rule

| Shape fill | Text color inside |
|---|---|
| Accent color (e.g. golden yellow, amber, orange) | `#FFFFFF` white OR the dark background color (e.g. `#1F1235`, `#0B0F19`) |
| Dark color (navy, black, dark purple) | `#FFFFFF` white |
| Light color (cream, light gray, white) | Dark text (the deck's body text color) |
| Brand primary (mid-tone) | Determine via luminance — see rule below |

### How to choose: luminance rule

If the shape fill is **light** (perceived brightness > 50%): use **dark text** (the deck's darkest color).
If the shape fill is **dark** (perceived brightness < 50%): use **white text** (`#FFFFFF`).

When in doubt: use **white**. White on a saturated color almost always passes contrast. Same-family tints never do.

### What is absolutely forbidden

- **Same-family text on shape fill.** Never put a lighter tint of the accent color as text on the accent color fill. Example: light yellow text (`#F5D67A`) on golden yellow circle (`#D4A017`) — this is the exact failure shown in the screenshot feedback. The contrast ratio is ~1.3:1 — completely inaccessible.
- Never use a color "close to" the fill color as the text color, even if it looks slightly different in the editor. It will be invisible in a room or on a projected screen.
- Never use opacity/alpha on text inside shapes as a substitute for proper contrast.

### Stat circles and badge elements — specific rule

For **stat circles** (a number + label inside a filled circle or rounded rectangle):
- Circle fill → accent color
- Number (big stat) → **`#FFFFFF`** white, bold
- Label beneath number → **`#FFFFFF`** white or `rgba(255,255,255,0.85)`, regular weight

**Never** use the accent color's tint or any color from the same hue family for text inside an accent-colored shape.

```javascript
// BAD — light yellow text on golden circle
{ fill: '#D4A017', textColor: '#F5D67A' }  // contrast ~1.3:1 — INVISIBLE

// GOOD — white text on golden circle
{ fill: '#D4A017', textColor: '#FFFFFF' }  // contrast ~8:1 — readable

// GOOD — dark text on golden circle
{ fill: '#D4A017', textColor: '#1F1235' }  // contrast ~7:1 — readable
```

### Pre-render QA checklist for shapes

Before finalising any slide with filled shapes:
1. Every circle, badge, card, or pill has text inside → check: is text color high-contrast against fill?
2. No two adjacent colors in a shape's fill + text are from the same hue family.
3. Minimum contrast ratio: **4.5:1** for body/label text, **3:1** for large display numbers (≥40pt).

---

## PALETTE PHILOSOPHY

The most impactful investor decks use **near-black as dominant** with ONE accent color used **surgically** — maximum one accent element per slide. "Surgical" means: section dividers, the closing slide, one stat tile, one accent line. Never body text, never labels, never secondary elements.

### Dark-dominant palette tokens (industrial / B2B decks)

```javascript
const C = {
  INK:    "0F0F0F",  // near-black — dominant background
  COAL:   "1A1A1A",  // slightly lighter surface
  MID:    "2A2A2A",  // stat tiles, secondary surfaces
  BONE:   "F0EDE6",  // warm off-white text on dark — pairs with grain+tint system (warmer than #FFFFFF)
  DIM:    "9B9B8F",  // muted captions on dark
  ACCENT: "FF5A1F",  // THE one accent (brand color) — used surgically only
};
```

### The intentional light-slide contrast break

In a dark-dominant deck, insert **exactly ONE** light slide in the middle of the content section. It creates a visual breath that makes all the surrounding dark slides hit harder. One. Not two, not a light/dark checkerboard — a single deliberate exhale.

---

## TYPOGRAPHY AS ARCHITECTURE

Type isn't just read — on these slides it builds the layout itself.

```javascript
// 1. Giant ghosted background text — a number at 300-340pt, near-invisible,
//    same family as the bg, felt as weight not read as text.
s.addText("2026", { x:-0.5, y:1.2, w:SW+1, h:5.5, fontSize:330, bold:true,
  color:"161616", align:"center", valign:"middle" });   // INK bg = 0F0F0F, ghost just above it

// 2. Architecture number — giant corner number that IS the layout structure.
s.addText("03", { x:SW-5, y:SH-4.6, w:4.6, h:4.2, fontSize:210, bold:true,
  color:C.ACCENT, align:"right", valign:"bottom", transparency:12 });

// 3. Pre-title eyebrow — small ALL CAPS, wide tracking (4-5pt), above the headline.
s.addText("MARKET OPPORTUNITY", { x:0.6, y:0.9, w:9, h:0.4, fontSize:13, bold:true,
  color:C.DIM, charSpacing:5 });
```

---

## Color


### Two paths

**A. The user has brand colors.** Use them. Build the deck's palette *from* them:
- The brand primary becomes the dominant color (titles, accents, key shapes).
- Generate a neutral scale (page background, body text, dividers) chosen to harmonize with the primary.
- Generate a secondary accent used for highlights and callouts only.
- Add semantic colors as needed (success green, warning amber) but only if the deck uses them.

If brand colors clash or are unsuitable, say so kindly and propose a working palette that *uses* the brand color.

**B. The user has no brand colors.** Pick a palette that matches the topic and mood. Don't default to blue. Offer 2-3 palette options and let them pick.

### Palette inspiration (grouped by mood)

Each entry is `Primary · Secondary · Accent · Background · Text`.

**Editorial / serious**
- Ink: `#1A1A1A` · `#3A3A3A` · `#D4AF37` · `#FAFAFA` · `#1A1A1A`
- Navy classic: `#0B2545` · `#13315C` · `#EEF4ED` · `#FFFFFF` · `#0B2545`
- Newsprint: `#222222` · `#666666` · `#C8102E` · `#F4F1EA` · `#222222`

**Modern / clean (SaaS-friendly)**
- Plum and cream: `#5B2A86` · `#A45EE5` · `#F7B538` · `#FFFFFF` · `#1F1235`
- Ocean: `#0EA5E9` · `#0369A1` · `#F97316` · `#F8FAFC` · `#0F172A`
- Forest tech: `#10B981` · `#047857` · `#FBBF24` · `#FFFFFF` · `#064E3B`

**Bold / energetic**
- Coral pop: `#FF5A5F` · `#FFB400` · `#1E2A38` · `#FFF8F4` · `#1E2A38`
- Magenta neon: `#FF006E` · `#3A86FF` · `#FFBE0B` · `#0A0A0A` · `#FFFFFF`
- Sunset: `#F94144` · `#F3722C` · `#F9C74F` · `#FFFFFF` · `#1F2937`

**Calm / refined**
- Sage stone: `#7C9A92` · `#52796F` · `#CAD2C5` · `#F4F4F0` · `#2F3E46`
- Dusty rose: `#C08497` · `#F7AF9D` · `#F7E7CE` · `#FBF7F4` · `#3F2E3E`
- Mist: `#94A3B8` · `#64748B` · `#0EA5E9` · `#F8FAFC` · `#0F172A`

**Premium dark**
- Midnight: `#0B0F19` · `#1F2937` · `#F59E0B` · `#0B0F19` · `#F9FAFB`
- Royal: `#1E1B4B` · `#3730A3` · `#FBBF24` · `#1E1B4B` · `#FFFFFF`
- Charcoal and blush: `#1F2937` · `#374151` · `#FBCFE8` · `#1F2937` · `#FFFFFF`

**Warm / human**
- Terracotta: `#B85042` · `#E7E8D1` · `#A7BEAE` · `#FBF6F0` · `#3F2E2A`
- Mustard and ink: `#D4A017` · `#7C2D12` · `#1F2937` · `#FFF8E1` · `#1F2937`

### Palette construction principles

**Dominance over equality.** One color dominates (60-70% of visual weight). One supporting color (20-30%). One accent for highlights only (5-10%). Equal-weight palettes feel flat.

**Contrast is non-negotiable.** Body text needs at least 4.5:1 contrast ratio against its background. Titles can go to 3:1 if large. Light gray on cream is a frequent failure: looks elegant in the editor, unreadable in a room.

**Avoid these pitfalls:**
- Cream backgrounds by default: looks AI-generated. Use white or the brand's neutral.
- Three saturated colors competing for attention. Pick one to dominate.
- Pure black on pure white: feels harsh. Soften (`#1F2937` on `#FAFAFA`).
- Gradient text: dated and reduces contrast.
- **Same-family text on filled shapes.** See the ⚠ Text-on-shape contrast rule above — this is a critical failure point.

### When the deck mixes dark and light slides

The "sandwich" approach: dark cover and dark closing, light content slides in between. Or fully dark throughout for a premium feel. Pattern must be intentional, not random.

---

## Typography

> ⚠ **APPROVED FONT LIST — use ONLY these fonts. No other fonts are permitted.**

### The approved font library

| Font | Classification | Character | Best for |
|---|---|---|---|
| **Neue Haas Grotesk Display Pro** | Premium grotesque sans | Authoritative, refined, timeless | Dark-luxe headlines, editorial authority, cover hero |
| **Helvetica Neue** | Classic grotesque sans | Neutral, trusted, supremely versatile | Minimalist decks, corporate, single-family decks |
| **Helvetica** | Classic grotesque sans | Same DNA as Neue — use Neue preferred | Fallback for Helvetica Neue |
| **Space Grotesk** | Geometric sans | Tech-forward, slightly quirky | Tech, SaaS, developer tools |
| **Montserrat** | Geometric sans | Accessible, warm, geometric | Consumer, education, warm-modern |
| **Gilroy** | Modern geometric sans | Clean, contemporary, consumer-friendly | Soft decks, consumer apps, lifestyle |
| **Inter** | Screen-optimized neutral sans | Maximum legibility, versatile | Body copy on any deck, data labels |
| **Manrope** | Modern grotesque | Softer, warm, approachable | Body copy, warm-modern, SaaS |
| **Wix Madefor Display** | Contemporary sans | Clean, versatile, Hebrew support | Hebrew-language decks, versatile display |
| **Bricolage Grotesque** | Editorial variable grotesque | Strong personality, expressive | Warm-modern, agencies, brand editorial |
| **Instrument Serif** | Contemporary serif | Elegant, editorial, restrained luxury | Editorial-premium headlines, luxury brands |
| **Radix** | Modern geometric serif | Precise, considered, architectural | Swiss-system serif moments, precision brands |
| **JetBrains Mono** | Monospace | Technical, data-native | Data labels, code, dashboard decks |
| **Aether** | Atmospheric display | Cinematic, premium, editorial | Dark-luxe cover accents, cinematic hero moments |
| **Eschaton** | Experimental display | Bold personality, distinctive | Strong brand-voice covers, editorial statements |

### Persona-to-font mapping

Pick the pairing that matches the deck's visual persona. Do not deviate from this list.

| Persona | Display font | Body font | Notes |
|---|---|---|---|
| **dark-luxe** | Neue Haas Grotesk Display Pro | Inter | Tight tracking on display (-3.5), loose on captions (+2) |
| **editorial-premium** | Instrument Serif | Manrope | Serif display + humanist sans body |
| **minimalism** | Helvetica Neue | Helvetica Neue | Single-family only. Weight contrast does the work |
| **swiss-system** | Neue Haas Grotesk Display Pro | JetBrains Mono (data) + Inter (body) | Mono for all numeric/data labels |
| **soft** | Gilroy | Manrope | Rounded feel, approachable |
| **cinematic-product** | Neue Haas Grotesk Display Pro | Inter | Add Aether for single cover accent moments only |
| **dashboard** | Inter | JetBrains Mono | Tabular numerals throughout |
| **warm-modern** | Bricolage Grotesque | Manrope | Variable font — use weight range for hierarchy |
| **editorial-serene** | Instrument Serif | Manrope | Same as editorial-premium, warmer body |
| **monochrome-editorial** | Neue Haas Grotesk Display Pro OR Helvetica Neue | same family | Single family, ultra-light to black weight contrast |

### Hebrew-language decks

| Use case | Font | Notes |
|---|---|---|
| Hebrew primary | Wix Madefor Display | Best Hebrew support in the approved list |
| Hebrew + English mixed | Wix Madefor Display | Works for both scripts in one family |
| Hebrew body bump | +10-15% over Latin body size | Hebrew reads smaller at same pt — compensate |

### Arabic-language decks

Arabic is not directly supported by any font in the approved list. If a deck requires Arabic script, flag this explicitly and use a system fallback (the user will need to install an Arabic-supporting font). Do not fake Arabic with an unsupported font.

### Latin-only approved pairings (quick reference)

| Display | Body | Persona vibe |
|---|---|---|
| Neue Haas Grotesk Display Pro | Inter | Dark-luxe, cinematic, editorial authority |
| Instrument Serif | Manrope | Editorial-premium, luxury, wellness |
| Helvetica Neue | Helvetica Neue | Minimalist, corporate, neutral |
| Bricolage Grotesque | Manrope | Warm-modern, agency, brand |
| Space Grotesk | Inter | Tech-forward, SaaS, developer |
| Gilroy | Manrope | Soft, consumer, lifestyle |
| Inter | JetBrains Mono | Dashboard, data-heavy, analytics |
| Neue Haas Grotesk Display Pro | JetBrains Mono | Swiss-precision with data elements |
| Radix | Inter | Geometric serif moment, precision brands |

### Type scale

| Element | pptx (pt) | Notes |
|---|---|---|
| Cover hero | 80-100 | The opening headline |
| Hero / big-statement | 60-120 | Single sentence |
| Wide-body paragraph (R10) | 36-50 | Regular/light weight — NOT bold |
| Section divider title | 60-68 | Top-left of divider slide |
| Section divider number | 200-220 | Bottom-right, MASSIVE, slight transparency |
| Big-stat | 40-65 | One number, dominant (stat tiles: 50-65) |
| Slide title (claim) | 30-40 | One line ideal, two max |
| Section header | 24-30 | Within a slide |
| Body | 13-16 | Read-on-your-own |
| Caption / micro | 8-11 | Muted color |

For live presentation: body minimum 18pt. For read-on-your-own: 13pt acceptable.

### Type rules

- Left-align body text in LTR; right-align in RTL. Never center body paragraphs.
- Center titles only on cover and big-statement slides. Otherwise left-align.
- Line length: 45-75 characters per line.
- No mid-sentence bolding for "emphasis". If it needs emphasis, make it the title.
- No italics in Hebrew/Arabic. Use weight or color instead.
- **No em dashes in any text.** See punctuation rule at top of this file.
- **Never use a font not in the approved list above.** If a brand specifies an unlisted font, use the closest match from the approved list and note the substitution.

#### Refinements that pair with the DEPTH EFFECTS SYSTEM
- **Tighten display headlines:** `charSpacing: -3.5` on large display headlines — feels more premium and intentional.
- **Loosen small captions:** `charSpacing: +2.0` on small caption/label text — more legible at small sizes.
- **Warm text color:** use `#F0EDE6` (the BONE token) instead of pure `#FFFFFF` for text on dark. The slightly warmer white pairs with the warm grain + brand-tint system; pure white reads cold against it.

---

## Glassmorphism cards (for photographic or dark backgrounds)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  padding: 32px;
  color: white;
}
```

**For pptx — these are the authoritative token values** (they replace solid-fill stat tiles / priority pills on dark backgrounds):

```javascript
// Regular glass card
fill: { color: "FFFFFF", transparency: 93 }
line: { color: "FFFFFF", transparency: 78, pt: 0.6 }

// Hero / accent glass card
fill: { color: "F07022", transparency: 8 }   // brand accent
line: { color: "F07022", transparency: 45, pt: 0.8 }
// Place the orange glow PNG behind a hero card BEFORE drawing it (see DEPTH EFFECTS SYSTEM).
```

No true blur in pptx, but fill + border at these values approximates it convincingly.

Apply when: background is dark, photographic, or gradient. Don't apply on solid light backgrounds. See **DEPTH EFFECTS SYSTEM** at the top of this file for the glow/grain/vignette layering these cards sit within.

---

## Display-dominant typography pattern

Set the slide title at 100-160pt in a high-contrast display font, let it occupy the upper 30-50% of the slide, then place a short body paragraph at 18-22pt beneath. The title *is* the slide; the body is a footnote.

Use for: section openers, big-claim slides, editorial moments.

---

## Motif

The motif is the one repeated visual device that makes the deck feel like a designed system rather than a collection of slides. Pick it once and apply it everywhere.

**Examples by type:**

*Line:* A 2-4pt horizontal rule in the accent color above the slide title. Used in editorial / news-magazine decks.

*Bar:* A vertical accent strip on the left or right edge (3-8% of slide width). Strong, architectural feeling. Good for B2B, infrastructure, energy.

*Corner device:* A colored L-shape or notch in a consistent corner. Subtle but present.

*Background texture:* A repeating grid, dot matrix, or topographic pattern at low opacity on dark slides. Adds depth without noise.

*Color block:* A full-width colored rectangle anchoring the bottom 8-12% of every slide. Works well with footer text embedded in it.

**Rules for motifs:**
- The motif must be present (even minimally) on every slide, including the cover and closing slide.
- It must use the accent color exclusively. Using multiple colors defeats the purpose.
- It should not move or change size or thickness across slides. Consistency is the point.
- Avoid: thick ruled lines under every heading (this is a default PowerPoint behavior and a strong AI-deck signal).
