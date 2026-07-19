# PowerPoint (.pptx) implementation

For .pptx output, **defer to the existing `pptx` skill** for mechanics: it handles file generation via `pptxgenjs` or unpacking/repacking templates, has battle-tested scripts for thumbnail QA, and knows the quirks of LibreOffice conversion. Read `pptx/SKILL.md` and follow its workflow.

This file covers the *extra* concerns specific to this presentation-maker skill — things the base pptx skill doesn't address.

## Workflow

1. Use the outline, layout choices, palette, and motif you locked in with the user.
2. Read the `pptx` skill's SKILL.md for the mechanical creation workflow (`pptxgenjs` for new decks, unpack/repack for templates).
3. Implement each slide following the layout you chose from `layouts.md`. **Do not fall back to PowerPoint's default "Title + Content" layout placeholder** — it shows the AI-slide signature instantly.
4. After generation, run the pptx skill's visual QA: convert to images, spawn a subagent to inspect.
5. If RTL is involved, additional QA: open in LibreOffice or PowerPoint, confirm direction is set per text box.

---

## ⚠ Critical bugs — observed in production, never skip these fixes

### BUG 0: writeFile absolute path crash (pptxgenjs)

pptxgenjs **silently throws** `"Relative path cannot be absolute or contain drive letters"` when given an absolute path like `/app/output.pptx`. The error is swallowed — the file simply doesn't appear and you waste a build cycle.

**Fix: always write to a relative filename, then move it.**

```javascript
// BAD — silently fails
pptx.writeFile({ fileName: "/app/output.pptx" });

// GOOD — write relative, then shell-move
await pptx.writeFile({ fileName: "output.pptx" });
// In bash: mv /tmp/pptx_build/output.pptx /app/FinalDeck.pptx
```

**Run all pptxgenjs build scripts from a dedicated temp dir:**
```bash
mkdir -p /tmp/pptx_build && cd /tmp/pptx_build
node build.js
mv output.pptx /app/FinalDeck.pptx
```

This also keeps the workspace clean — no stale `.pptx` files accumulating in `/app`.

---

## ⚠ Critical layout rules — enforce these on every slide before committing

These failure modes have been observed in production decks. They look fine in code but break visually.

### 0. Content density check — one idea per slide, split if crowded

**Before writing any slide, count the content items:**
- 1 headline + 1 body block + 1 visual element = OK
- 1 headline + 1 body block + cards/stats + callout strip = TOO MUCH — split into 2 slides

**The split rule:** If placing all content on one slide requires any element to start less than 0.25in below the previous element's calculated bottom edge, the slide is overfull. Split it.

**How to split well:**
- Slide A keeps the big claim (headline + key visual/stats) — the "what"
- Slide B carries the explanation, context, supporting detail — the "why"
- Both slides share the same eyebrow label so the reader knows they're connected
- Example: "Slide 2a — The Opportunity" (claim + stats) + "Slide 2b — The Opportunity: Why Now" (body + regulatory context)

Never compress font size below 11pt or reduce line spacing below 1.3 to make content fit. If it doesn't fit at comfortable sizes — split.

### 1. Calculate actual rendered text height before placing anything below it

pptxgenjs does NOT clip text — text that overflows its `h` box bleeds over the next element invisibly in code but visibly in the rendered slide. The `h` parameter is not a max-height — it's a hint that pptxgenjs largely ignores.

**The formula:**
```
actualH = (fontSize_pt / 72) × lineCount × lineSpacingMultiple
```

Always compute this before setting the Y position of the next element. Add a 15–20% buffer for safety.

```javascript
// Example: 34pt headline, 4 lines, spacing 1.08
// actualH = (34/72) × 4 × 1.08 = 2.04 in  ← NOT the 1.65 declared!
// → bottom edge = y + 2.04, NOT y + 1.65

// SAFE pattern:
const headlineH = (34/72) * 4 * 1.08 * 1.15; // +15% buffer = 2.35in
const headlineBottom = 1.14 + headlineH;       // = 3.49
const bodyY = headlineBottom + 0.25;           // guaranteed gap
body(s, text, x, bodyY, w, h, 14);
```

**Common line count mistakes:**
- 34pt text in a 5-inch-wide box: a 10-word headline wraps to ~4 lines, not 2
- Always count actual visual lines at the given font size and box width, not word count

### 2. Headline width must never cross column boundaries

If a slide has a left text column and a right stat/image column, **the headline width must be capped to the left column width**, not the full slide width.

```javascript
// BAD — headline width 9.5 crosses into the right stat column (RX=6.6)
H1(s, "Title text", ML, 1.1, 9.5, 1.6, 34);

// GOOD — headline constrained to left column
const LW = 5.4;
H1(s, "Title text", ML, 1.1, LW, 1.6, 34);
```

**Rule:** Before writing any multi-column slide, define `LW` and `RX` first. Never set `x + w > RX` unless the element intentionally spans the full slide.

### 3. Text color must contrast against its background — always verify

The most common failure is **dark-on-dark** — hex colors that look different but share nearly the same lightness.

**Hard rules:**
- Text on dark backgrounds (luminance < 30%) → use `white` or a light muted gray. Never use another dark shade.
- Placeholder text in image boxes (`[PHOTO]`, `[CHART]`) on a dark bg → always use `C.textMuted` or white.
- Before any `addText()` inside a colored rect: ask "is this text color more than 40% different in lightness from the background?" If no — change it.

```javascript
// BAD — near-zero contrast
rect(s, tx, 3.0, cw, 1.7, "1B2070");
s.addText("[PHOTO]", { color: "1E2870" });  // invisible!

// GOOD
rect(s, tx, 3.0, cw, 1.7, C.navyMid);
s.addText("[PHOTO]", { color: C.textMuted });  // 8A9ABF — visible
```

### 4. Declare all column geometry before placing any element

Every multi-column or multi-zone slide must open with a geometry block. No magic numbers.

```javascript
const LW  = 5.4;                  // left column width
const GAP = 0.5;                  // gutter
const RX  = ML + LW + GAP;       // right column X
const RW  = W - RX - MR;         // right column width
// For N equal columns: COL_W = (SW - GAP * (N-1)) / N
```

### 5. Bottom-edge audit before finalising each slide

After placing all elements, write out every bottom edge as a comment and verify no element's bottom exceeds the next element's top:

```javascript
// logo:       y=0.44, h=0.34  → bottom=0.78
// eyebrow:    y=0.85, h=0.22  → bottom=1.07
// headline:   y=1.14, h=2.1   → bottom=3.24  ← use ACTUAL computed h
// body:       y=3.49, h=1.1   → bottom=4.59  ← bodyY = 3.24 + 0.25
// TAMA strip: y=5.0,  h=0.58  → bottom=5.58
// footer:     y=7.06          → bottom=7.08 ✓
```

If any bottom > next top → split the slide or cut content.

### 6. addImage — always include sizing, always layer overlays correctly

**Missing `sizing` distorts images.** Without it, pptxgenjs stretches the image to fill the box, breaking aspect ratio and warping faces/text.

```javascript
// BAD — image gets distorted
slide.addImage({ path: "hero.jpg", x: 0, y: 0, w: 7.5, h: 5.625 });

// GOOD — always include sizing
slide.addImage({
  path: "hero.jpg",
  x: 0, y: 0, w: 7.5, h: 5.625,
  sizing: { type: "cover", w: 7.5, h: 5.625 }
});
```

**Overlay z-order matters.** The overlay rect must be added AFTER the image and BEFORE any text:

```javascript
// 1. Background image
slide.addImage({ ..., sizing: { type: "cover", w, h } });

// 2. Dark overlay (transparency: 40 = 60% opaque — enough to darken most photos)
slide.addShape("rect", { x: 0, y: 0, w, h,
  fill: { color: "000000", transparency: 40 },
  line: { color: "000000", transparency: 100 }
});

// 3. Text on top
slide.addText("Headline", { ... });
```

**Side gradient simulation** (for split image/text layouts): add a solid bg-color rect that bleeds ~0.8in into the image zone. This simulates the gradient fade without requiring a gradient image file.

```javascript
// Text panel is x=0 to x=5.5, image is x=5.5 to x=13.33
// Add a bg-color bleed rect overlapping the image by 0.8in:
slide.addShape("rect", { x: 5.5, y: 0, w: 0.8, h: SH,
  fill: { color: C.navy }, line: { color: C.navy } });
```

---

## ⚠ Image sizing rule — cover for visual panels, contain for logos/icons only

When adding an image to any full-slide panel or large visual area (right half, left half, hero zone), always use `sizing: { type: "cover", w, h }`. **Never use `contain` for photographic or AI-generated slide panels** — contain leaves the image small and centered with empty space around it, which looks broken at panel scale.

```javascript
// BAD — image appears tiny and centered, empty space fills the rest
slide.addImage({ path: "hero.jpg", x: 6.5, y: 0, w: 6.8, h: 7.5,
  sizing: { type: "contain", w: 6.8, h: 7.5 } });

// GOOD — image fills the panel edge to edge
slide.addImage({ path: "hero.jpg", x: 6.5, y: 0, w: 6.8, h: 7.5,
  sizing: { type: "cover", w: 6.8, h: 7.5 } });
```

**Decision table:**

| Use case | `sizing` type |
|---|---|
| Full-bleed slide background | `cover` |
| Hero image behind text with overlay | `cover` |
| Right/left half visual panel (photo or AI-generated) | `cover` |
| UI screenshot inside a white card | `cover` |
| Logo in a corner or header | `contain` |
| Small icon in a card | `contain` |

---

## ⚠ Inline color rule — never layer text boxes to create colored words

To color specific words or lines within a headline, always use the **runs array syntax** in a single `addText()` call. Never place a second text box on top of the first to achieve color variation — that causes visible overlap, duplication, and z-order bugs.

```javascript
// BAD — two stacked text boxes, causes overlap and duplication
slide.addText("First line\nLast line.", { x, y, w, h, fontSize: 48, color: "111111" });
slide.addText("colored line", { x, y: y + lineH, w, h, fontSize: 48, color: "F26522" }); // ← overlaps!

// GOOD — one addText() call with a runs array
slide.addText([
  { text: "First line\n",   options: { color: "111111" } },
  { text: "colored line\n", options: { color: "F26522" } },
  { text: "last line.",      options: { color: "111111" } },
], { x, y, w, h, fontSize: 48, bold: true, fontFace: "Inter" });
```

**Rule:** Any time you need color variation within a single text block — a highlighted word, an accent line, a brand-colored phrase — use the runs array. One text box, multiple runs.

---

## ⚠ Image generation rule — always request wide landscape format for panels

Any image intended for a slide panel must end its prompt with:

> **"Wide landscape format, fills the entire frame edge to edge, no white margins, rich detailed background."**

Small illustration-style images on white backgrounds look stretched and unprofessional when placed in large panel containers with `sizing: cover`. The prompt suffix forces the model to generate a composition that actually fills the frame.

```javascript
// BAD prompt — will produce a small illustration on white that looks broken at panel size
"A solar panel on a fence, minimal illustration"

// GOOD prompt — fills the panel correctly
"Ground-level view of bifacial solar panels mounted on a perimeter security fence at a railway station, navy and lime green color mood, golden hour, photorealistic documentary style. Wide landscape format, fills the entire frame edge to edge, no white margins, rich detailed background."
```

Apply this suffix to every `generate_image` call where the output will be placed in a slide panel (half-panel, full-bleed, hero zone). Skip it only for logos, icons, and spot illustrations placed inside small cards.


---

## Educational / lecture deck patterns

Lecture and classroom decks have different requirements: larger body text, high contrast, clear visual hierarchy for projection. Body text minimum **17pt** (audience reads from distance). Never go below this for any educational context.

### Pattern A: Quiz / Multiple-choice slide

```javascript
function quizSlide(prs, question, options) {
  const s = prs.addSlide();
  const SW = 13.33, SH = 7.5, ML = 0.6, MR = 0.6;

  // Background
  s.addShape("rect", { x:0, y:0, w:SW, h:SH, fill:{color:"1a1a2e"}, line:{color:"1a1a2e"} });

  // Pill label — "QUESTION" eyebrow
  s.addShape("rect", { x:ML, y:0.5, w:1.6, h:0.32,
    fill:{color:"AADC3A"}, line:{color:"AADC3A"},
    rectRadius: 0.16 });  // pill shape
  s.addText("QUESTION", { x:ML, y:0.5, w:1.6, h:0.32,
    fontSize:8, bold:true, color:"0D1147", align:"center", valign:"middle" });

  // Scenario box — yellow rounded rect
  s.addShape("rect", { x:ML, y:1.0, w:SW-ML-MR, h:1.6,
    fill:{color:"2a2a00"}, line:{color:"FFDD44", lineSize:1.5},
    rectRadius: 0.12 });
  s.addText(question, { x:ML+0.2, y:1.1, w:SW-ML-MR-0.4, h:1.4,
    fontSize:18, color:"FFEE88", bold:false, valign:"middle" });

  // Answer options — lettered rows
  const letters = ["A", "B", "C", "D"];
  const optColors = ["1a3a5c", "1a3a5c", "1a3a5c", "1a3a5c"];
  options.forEach((opt, i) => {
    const oy = 2.85 + i * 1.05;
    // Letter ellipse
    s.addShape("ellipse", { x:ML, y:oy, w:0.42, h:0.42,
      fill:{color:"AADC3A"}, line:{color:"AADC3A"} });
    s.addText(letters[i], { x:ML, y:oy, w:0.42, h:0.42,
      fontSize:13, bold:true, color:"0D1147", align:"center", valign:"middle" });
    // Option row background
    s.addShape("rect", { x:ML+0.55, y:oy, w:SW-ML-MR-0.55, h:0.42,
      fill:{color:optColors[i]}, line:{color:"FFFFFF", transparency:80},
      rectRadius: 0.08 });
    s.addText(opt, { x:ML+0.75, y:oy, w:SW-ML-MR-0.75, h:0.42,
      fontSize:17, color:"FFFFFF", valign:"middle" });
  });
}
```

### Pattern B: "What NOT to do" warning slide

```javascript
function warningSlide(prs, title, items) {
  const s = prs.addSlide();
  const SW = 13.33, SH = 7.5, ML = 0.6;

  // Background — dark, ominous
  s.addShape("rect", { x:0,y:0,w:SW,h:SH, fill:{color:"120808"}, line:{color:"120808"} });

  // Red header bar
  s.addShape("rect", { x:0, y:0, w:SW, h:1.1, fill:{color:"8b0000"}, line:{color:"8b0000"} });
  s.addText(`\u2715  ${title}`, { x:ML, y:0, w:SW-ML*2, h:1.1,
    fontSize:28, bold:true, color:"FFAAAA", valign:"middle" });

  // Warning cards — dark red tint
  items.forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = ML + col * 6.2, cy = 1.4 + row * 2.7;
    const cw = 5.9, ch = 2.4;
    s.addShape("rect", { x:cx, y:cy, w:cw, h:ch,
      fill:{color:"2a1010"}, line:{color:"cc3333", transparency:60},
      rectRadius: 0.10 });
    // X icon
    s.addText("\u2715", { x:cx+0.15, y:cy+0.12, w:0.36, h:0.36,
      fontSize:14, bold:true, color:"FF4444", align:"center" });
    // Card text
    s.addText(item, { x:cx+0.55, y:cy+0.12, w:cw-0.7, h:ch-0.25,
      fontSize:17, color:"FFCCCC", valign:"top" });
  });

  // Rule: NEVER mix warnings with positives on the same slide
  // — a "what not to do" slide must stand alone
}
```

### Pattern C: Pro / Con split slide

```javascript
function proConSlide(prs, title, pros, cons) {
  const s = prs.addSlide();
  const SW = 13.33, SH = 7.5, ML = 0.5;
  const HW = (SW - ML*2 - 0.3) / 2; // half-width panels

  // Background
  s.addShape("rect", { x:0,y:0,w:SW,h:SH, fill:{color:"111111"}, line:{color:"111111"} });

  // Headline
  s.addText(title, { x:ML, y:0.35, w:SW-ML*2, h:0.7,
    fontSize:28, bold:true, color:"FFFFFF", align:"center" });

  // PRO panel — dark green tint background
  s.addShape("rect", { x:ML, y:1.25, w:HW, h:SH-1.55,
    fill:{color:"152d15"}, line:{color:"33aa33", transparency:60},
    rectRadius: 0.10 });
  s.addText("\u2714  PRO", { x:ML+0.2, y:1.4, w:HW-0.4, h:0.5,
    fontSize:16, bold:true, color:"aaffaa" });
  pros.forEach((p, i) => {
    s.addText(`\u2022  ${p}`, { x:ML+0.2, y:2.05+i*0.72, w:HW-0.4, h:0.65,
      fontSize:17, color:"ccffcc", valign:"top" });
  });

  // CON panel — dark red tint background
  const rx = ML + HW + 0.3;
  s.addShape("rect", { x:rx, y:1.25, w:HW, h:SH-1.55,
    fill:{color:"2d1515"}, line:{color:"aa3333", transparency:60},
    rectRadius: 0.10 });
  s.addText("\u2715  CON", { x:rx+0.2, y:1.4, w:HW-0.4, h:0.5,
    fontSize:16, bold:true, color:"ffaaaa" });
  cons.forEach((c, i) => {
    s.addText(`\u2022  ${c}`, { x:rx+0.2, y:2.05+i*0.72, w:HW-0.4, h:0.65,
      fontSize:17, color:"ffcccc", valign:"top" });
  });

  // KEY RULE: use tinted dark backgrounds (2a1010 / 152d15) with soft-colored text
  // NEVER use pure red/green fills — they look kindergarten, not professional
  // NEVER use black text on colored panels — always use soft tinted text (aaffaa / ffaaaa)
}
```

---

## pptxgenjs RTL notes

```javascript
// For an RTL text box:
slide.addText("שלום עולם", {
  x: 0.5, y: 0.5, w: 9, h: 1,
  fontSize: 28, fontFace: "Heebo",
  rtlMode: true,
  align: "right",
});
```

For mixed-language slides, use separate text boxes per direction rather than mixing scripts in one text run.

## Visual motif in pptx

```javascript
function addMotif(slide) {
  slide.addShape("rect", { x: 0, y: 0, w: 0.15, h: 5.625, fill: { color: "D4AF37" } });
}
```

Helper function per slide is faster for one-off decks; slide master is better for editable decks.


## Avoiding AI-slop in pptx

**"Clean but boring" IS AI-slop.** A deck that uses only text + colored rects on a white or single-color background is AI-slop even if technically correct — zero layout ambition, zero visual interest, nothing to look at.

**The rule:** every deck must use at minimum:
- At least 2 image zones (full-bleed or half-panel) — generate with `generate_image` if no real photos
- Glass cards on at least 1 slide (frosted semi-transparent containers)
- At least 1 section divider slide with a big atmospheric number or full-bleed visual
- Dark/light rhythm — never 3+ slides with the same background tone in a row

The skill has all these tools. Use them every time. A deck with zero images and only flat rects is unacceptable.

Other anti-patterns to avoid:
- No SmartArt
- No default Office accent colors — use the brand palette
- No thin underlines under titles
- No clipart icons in colored circles
- No bullet-point lists masquerading as content (use cards instead)

## Speaker notes

```javascript
slide.addNotes("Speaker note here — the script, not a recap of the slide.");
```

## Embedded fonts

pptxgenjs doesn't embed fonts. For font fidelity: user should open in PowerPoint → File → Options → Save → embed fonts, or export to PDF.


---

## Working with user-provided photos

When the user uploads real photos (screenshots, personal images, product shots), follow this exact workflow before writing a single line of slide code.

### Step 1: Download and measure FIRST

```python
from PIL import Image
import os

photo_dir = "/tmp/deck/photos"
ratios = {}
for fname in os.listdir(photo_dir):
    if fname.lower().endswith((".jpg", ".jpeg", ".png")):
        with Image.open(os.path.join(photo_dir, fname)) as img:
            w, h = img.size
            ratios[fname] = round(w / h, 3)
            print(f"  {fname}: {w}x{h}  ratio={ratios[fname]}")
```

Save the `ratios` dict. Never guess or assume dimensions. A Facebook screenshot is ~2:1. A portrait photo is ~0.75:1. Wrong assumptions = warped faces.

### Step 2: addProportionalImage() — the only safe way to place user photos

```javascript
// Put actual measured ratios at top of build script:
const IMG_RATIOS = {
  "photo1.jpg": 2.06,
  "photo2.jpg": 0.75,
  // ... all files
};

/**
 * Place an image while preserving its aspect ratio.
 * Fits within maxW × maxH, centers horizontally on slide.
 * Returns the actual rendered height so the next element can stack correctly.
 */
function addProportionalImage(slide, fname, y, maxW, maxH) {
  const ratio = IMG_RATIOS[fname] || 1.0;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }
  const x = (SW - w) / 2; // center horizontally
  slide.addImage({
    path: `/tmp/deck/photos/${fname}`,
    x, y, w, h,
    sizing: { type: "cover", w, h }
  });
  return h; // ALWAYS use the returned height for next element Y
}

// Usage — dynamic Y stacking:
const imgH = addProportionalImage(s, "photo1.jpg", 1.1, 11.5, 3.0);
const nextY = 1.1 + imgH + 0.25; // guaranteed gap, no collision
```

**Never** use `sizing: "contain"` with a container larger than the image — pptxgenjs will stretch to fill and distort. Always compute exact W×H and use `"cover"`.

### Step 3: Dynamic Y stacking — no hardcoded Y after images

Every element below a user photo must be positioned relative to the photo's actual bottom:

```javascript
// BAD — assumes photo is always 2.5in tall
s.addText("Caption", { x: 1, y: 3.8, ... }); // breaks if photo is 1.8in

// GOOD — stacks from actual bottom
const imgH = addProportionalImage(s, "photo.jpg", 1.1, 11.5, 3.0);
const captionY = 1.1 + imgH + 0.2;
s.addText("Caption", { x: 1, y: captionY, ... });
```

### Step 4: UI screenshot cards (Facebook, WhatsApp, etc.)

When embedding UI screenshots (social media posts, chat messages, app screens), don't just drop a raw image — wrap it in a card that mimics the original UI chrome. This looks intentional, not lazy.

```javascript
function uiScreenshotCard(slide, fname, cardX, cardY, cardW, accentColor, yearLabel, likes) {
  const ratio = IMG_RATIOS[fname];
  const imgW = cardW - 0.1;
  let imgH = imgW / ratio;
  const maxImgH = 3.2;
  if (imgH > maxImgH) { imgH = maxImgH; }
  const cardH = imgH + 0.72;

  // White card background (mimics FB/WA card)
  slide.addShape("rect", { x:cardX, y:cardY, w:cardW, h:cardH,
    fill:{color:"FFFFFF"}, line:{color:"DADDE1", width:0.5}, rectRadius:0.10 });

  // Screenshot at correct proportions
  slide.addImage({ path:`/tmp/deck/photos/${fname}`,
    x: cardX+0.05, y: cardY+0.05, w: imgW, h: imgH,
    sizing: { type:"cover", w:imgW, h:imgH } });

  // Footer bar — mimics social media post footer
  slide.addShape("rect", { x:cardX, y:cardY+imgH+0.05, w:cardW, h:0.32,
    fill:{color:"F0F2F5"}, line:{color:"E4E6EB", width:0.5}, rectRadius:0.10 });

  // Year pill
  slide.addShape("rect", { x:cardX+0.12, y:cardY+imgH+0.1, w:0.78, h:0.2,
    fill:{color:accentColor}, line:{color:accentColor}, rectRadius:0.10 });
  slide.addText(yearLabel, { x:cardX+0.12, y:cardY+imgH+0.1, w:0.78, h:0.2,
    fontSize:8, bold:true, color:"FFFFFF", align:"center", valign:"middle" });

  // Likes count
  if (likes) {
    slide.addText(`\uD83D\uDC4D ${likes}`, { x:cardX+cardW-1.1, y:cardY+imgH+0.1, w:0.95, h:0.22,
      fontSize:11, color:"555555", align:"right", bold:true });
  }

  return cardH; // return total card height for stacking
}
```

**Rules for UI screenshot cards:**
- Always add a footer bar — a floating screenshot with no chrome looks unfinished
- Year/date pill should use the deck's accent color, not grey
- Keep card border radius consistent with other cards on the slide (0.10–0.14)
- For 3-up grids (3 cards side by side): `COL_W = (SW - ML - MR - GAP*2) / 3`

---

## RTL punctuation fix — \u200F after end-of-line punctuation

**Problem:** In Hebrew RTL text boxes, PowerPoint's Bidi algorithm pushes periods, commas and other punctuation to the **wrong side of the line** (left instead of right).

**Fix:** Append `\u200F` (Right-to-Left Mark) immediately after any punctuation (`. , ; : ! ?`) that ends a Hebrew string or a `\n`-separated segment within a string. Apply as a post-processing step on **all JS string literals** before writing the file.

```javascript
// BAD → period appears at LEFT side of line
"כל המשפטים קשורים לאותו נושא."

// GOOD → \u200F anchors the period to the RIGHT side
"כל המשפטים קשורים לאותו נושא.\u200F"

// With \n-segments — fix EVERY segment that ends with punctuation:
"שירה תמיד שמה אחרים.\u200F\nהיא הכי טובה!"
```

**Apply to:** string endings AND every `\n`-separated segment that ends with `.`, `,`, `;`, `:`, `!`, or `?`.

**Quick script to audit a build file:**
```bash
grep -n "[\u05D0-\u05EA][.,;:!?]\"" build.js   # finds unprotected Hebrew punctuation
```

---


## Content column geometry when an image panel exists

Define `IMG_W`, `IMG_GAP`, `CW`, and `IMG_X` at the **top of the file** — before any slide. Every slide that includes an image panel must use `CW` for text width. Slides without a panel use the full `SW - ML - MR`.

```javascript
// ── GLOBAL GEOMETRY (define once, at top of file) ────────────────────
const SW      = 13.33;
const SH      = 7.5;
const ML      = 0.55;   // left margin
const MR      = 0.55;   // right margin
const IMG_W   = 3.2;    // image panel width
const IMG_GAP = 0.3;    // gap between text and panel
const CW      = SW - ML - MR - IMG_W - IMG_GAP - 0.14;  // text column width
const IMG_X   = ML + CW + IMG_GAP;                       // panel X position
```

**Rules:**
- Never mix `CW` and full-width (`SW - ML - MR`) on the same slide — pick one and use it for every element.
- If `CW < 7.0 inches`, the slide is too crowded for a panel — skip it (see below).
- All headlines, body text, and cards on a panel slide must use `CW` as their width.

---

## When NOT to add an image panel

Skip the image panel on slides where the content already fills the full width or where `CW` would be too narrow:

| Slide type | Panel? |
|---|---|
| 4+ answer rows (MC questions) | ❌ Skip — options need full width |
| 3-column card layouts | ❌ Skip — already uses full width |
| Pro/con split slides | ❌ Skip — two columns already |
| CW < 7.0 inches | ❌ Skip — text becomes unreadably narrow |
| Single headline + short body | ✅ Add panel |
| 2-column stat cards + text | ✅ Add panel (use `CW` for cards) |


---

## SVG אינו נתמך ב-PPTX — תמיד להמיר ל-PNG לפני addImage

**pptxgenjs ו-PowerPoint לא מציגים SVG.** כל קובץ `.svg` חייב לעבור המרה ל-PNG לפני שמעבירים אותו ל-`addImage`. ניסיון להעביר SVG ישיר גורם לריק שקוף או לקריסה שקטה.

**כלי ההמרה:** `sharp` — זמין ב-`node_modules/sharp` בתיקיית הבנייה.

```javascript
// בתחילת כל build שמשתמש בקבצי SVG:
const sharp = require('./node_modules/sharp');
const fs    = require('fs');

// המרה לפני כל שימוש:
await sharp(fs.readFileSync('icon.svg'))
  .resize(400, 400)
  .png()
  .toFile('icon.png');

// רק אחרי ההמרה:
s.addImage({ path: 'icon.png', x: ..., y: ..., w: ..., h: ...,
  sizing: { type: "contain", w: ..., h: ... } });
```

**כלל מוחלט:** לעולם לא להעביר `.svg` ל-`addImage`. רק `.png` או `.jpg`.

**טבלת פורמטים מותרים:**

| פורמט | מותר? |
|---|---|
| `.png` | ✅ |
| `.jpg` / `.jpeg` | ✅ |
| `.gif` | ✅ (frame ראשון בלבד) |
| `.svg` | ❌ — חייב להמיר ל-PNG תחילה |
| `.webp` | ❌ — חייב להמיר |

---

## גאומטריית עמודות ב-RTL עם פאנל תמונה — תמונה שמאל, טקסט ימין

**ב-RTL, הקורא מתחיל מהצד הימני.** לכן בכל שקף עם פאנל תמונה לצד טקסט עברי:
- **פאנל התמונה** → צד **שמאל** (x = ML)
- **הטקסט הראשי** → צד **ימין** (x = IMG_X + IMG_W + GAP)

סדר הפוך (תמונה מימין, טקסט משמאל) גורם ל-overlap ולתחושה שהאיור "בולע" את הטקסט.

```javascript
// ── RTL PANEL GEOMETRY (הגדר פעם אחת בראש הקובץ) ────────────────────
const IMG_W   = 2.9;                        // רוחב פאנל התמונה
const IMG_GAP = 0.35;                       // מרווח בין פאנל לטקסט
const IMG_X   = ML;                         // פאנל: מתחיל בשוליים שמאל
const TXT_X   = IMG_X + IMG_W + IMG_GAP;   // טקסט: מתחיל ימינה מהפאנל
const TXT_W   = SW - TXT_X - MR - 0.14;   // טקסט: עד השוליים ימין
```

**חוק:** כל element טקסטואלי על שקף RTL עם פאנל חייב להשתמש ב-`TXT_X` ו-`TXT_W` — לא ב-`ML` ולא ב-`SW - ML - MR`.

---

## headerBar על שקפים עם פאנל תמונה — חייב להתחיל ב-TXT_X

אם `headerBar` מתחיל ב-`x=0` או `x=ML` על שקף שיש בו פאנל תמונה, הוא ידרוס את הפאנל.

```javascript
function headerBar(s, text, opts={}) {
  const startX = opts.withPanel ? TXT_X : 0;
  const barW   = SW - startX - 0.14;
  // רקע ה-bar
  s.addShape("rect", { x: startX, y: 0.62, w: barW, h: 0.44,
    fill: { color: C.accent }, line: { color: C.accent } });
  // טקסט בתוך ה-bar
  s.addText(text, {
    x: opts.withPanel ? TXT_X + 0.15 : ML,
    y: 0.62, w: barW - 0.15, h: 0.44,
    fontSize: 14, bold: true, color: C.white, valign: "middle"
  });
}

// שימוש:
headerBar(s, "כותרת הסעיף", { withPanel: true });  // שקף עם פאנל תמונה
headerBar(s, "כותרת הסעיף");                        // שקף full-width
```

---
