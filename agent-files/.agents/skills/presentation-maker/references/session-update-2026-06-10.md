# Session update — 2026-06-10: Investor-grade deck doctrine

This file consolidates the full detail and code examples behind the changes made on 2026-06-10. The individual reference files (`design-spec.md`, `layouts.md`, `narrative.md`, `design-system.md`, `image-intelligence.md`) carry the canonical rules; this file is the rationale + complete code companion.

> **Reference deck:** MetricBridge — a dark-dominant, surgically-accented B2B investor deck used as the quality benchmark throughout.

---

## The single most important change

For **investor decks**, four changes account for ~80% of the gap between a corporate brochure and a deck that excites investors:

1. **Dark-dominant palette** (near-black dominant, one accent surgical).
2. **Surgical accent** — max one accent element per slide.
3. **Market prize in slide 2 at massive size.**
4. **Full-bleed brand-color closing slide.**

Everything else below supports these four.

---

## 1. The 7 Golden Rules (canonical: design-spec.md)

1. **Typography IS the design** — one font family; size + weight contrast do the work.
2. **Section dividers are mandatory** — full-slide brand fill, title ~60pt top-left, number 200-220pt bottom-right, nothing else.
3. **Stat blocks use colored tiles** — number 50-65pt, label 11pt top, description outside/below; first tile = accent fill, rest neutral.
4. **Zero decorative shapes** — only divider fills, stat tiles, quote cards, dot bullets.
5. **Images must touch an edge** — full half-panel or full-bleed; never floating + centered.
6. **Radical whitespace** — 30-40% of every light content slide stays empty.
7. **Closing = full-bleed brand accent** — orange/red/lime, headline 80-130pt, CTA in contrast color.

Plus: a 10-slide deck uses ≥6 distinct layouts; no two consecutive slides share a structural layout.

---

## 2. Section divider — complete code (canonical: layouts.md Pattern 2)

```javascript
function sectionDivider(prs, title, number, C) {
  const s = prs.addSlide();
  const SW = 13.33, SH = 7.5;
  // Full-bleed brand color
  s.addShape("rect", { x:0, y:0, w:SW, h:SH, fill:{color:C.ACCENT}, line:{color:C.ACCENT} });
  // Title top-left (~60pt)
  s.addText(title, { x:0.6, y:0.6, w:8, h:1.2, fontSize:60, bold:true, color:"FFFFFF" });
  // MASSIVE number bottom-right (~210pt), slight transparency = architecture not clutter
  s.addText(number, { x:SW-5.2, y:SH-4.4, w:5, h:4, fontSize:210, bold:true,
    color:"FFFFFF", align:"right", valign:"bottom", transparency:18 });
  return s;
}
// Reference: MetricBridge "Data Signal / 01"
```

---

## 3. Stat tiles — complete code (canonical: layouts.md Pattern 6)

```javascript
function statTiles(s, stats, C) {
  const tileW = 2.9, gap = 0.3, tileH = 2.2, ty = 2.6, x0 = 0.6;
  const fills = [C.ACCENT, C.MID, C.MID, C.MID];   // first accent, rest neutral tint
  const txt   = ["FFFFFF", C.BONE, C.BONE, C.BONE];
  stats.forEach((st, i) => {
    const tx = x0 + i * (tileW + gap);
    // Tile: fill only, no border, no shadow, radius 0.1
    s.addShape("rect", { x:tx, y:ty, w:tileW, h:tileH, fill:{color:fills[i]}, line:{color:fills[i]}, rectRadius:0.1 });
    // Label top-left (11pt bold)
    s.addText(st.label, { x:tx+0.2, y:ty+0.18, w:tileW-0.4, h:0.3, fontSize:11, bold:true, color:txt[i] });
    // Giant value center (50-65pt bold)
    s.addText(st.value, { x:tx, y:ty+0.55, w:tileW, h:1.2, fontSize:58, bold:true, color:txt[i], align:"center", valign:"middle" });
    // Description OUTSIDE the tile, below it (10pt muted)
    s.addText(st.desc, { x:tx+0.05, y:ty+tileH+0.12, w:tileW-0.1, h:0.6, fontSize:10, color:C.DIM });
  });
}
// Reference: MetricBridge "This Quarter In Numbers"
```

---

## 4. Investor narrative + energy arc (canonical: narrative.md)

**First 3 slides answer:** (1) what's the prize [huge market number, slide 2], (2) what's broken [one sentence], (3) why this company [one sentence].
**Formula:** S1 Cover → S2 Big Statement (prize+problem+solution) → S3 Company facts.

**Energy curve (no flatline):** Cover (high) → Big Statement (peak) → Company (grounding) → Section divider (reset) → Stats (rising) → Product (light break) → Value (dark) → Team (human) → Closing (highest). Alternate dark/dense with light/sparse.

---

## 5. Dark-dominant palette + typography as architecture (canonical: design-system.md)

```javascript
const C = {
  INK:    "0F0F0F",  // dominant bg
  COAL:   "1A1A1A",  // surface
  MID:    "2A2A2A",  // stat tiles
  BONE:   "F0EDE6",  // warm off-white text on dark (pairs with grain+tint)
  DIM:    "9B9B8F",  // muted captions
  ACCENT: "FF5A1F",  // THE one accent, surgical use only
};

// Ghost typography — a number at 300-340pt, near-invisible, felt as weight
s.addText("2026", { x:-0.5, y:1.2, w:SW+1, h:5.5, fontSize:330, bold:true, color:"161616", align:"center", valign:"middle" });

// Architecture number — giant corner number that IS the layout
s.addText("03", { x:SW-5, y:SH-4.6, w:4.6, h:4.2, fontSize:210, bold:true, color:C.ACCENT, align:"right", valign:"bottom", transparency:12 });

// Pre-title eyebrow — ALL CAPS, wide tracking
s.addText("MARKET OPPORTUNITY", { x:0.6, y:0.9, w:9, h:0.4, fontSize:13, bold:true, color:C.DIM, charSpacing:5 });
```

**Light-slide break:** exactly ONE light slide mid-deck makes the surrounding dark slides hit harder.

**Type scale additions:** cover hero 80-100pt; section divider title 60-68pt; section divider number 200-220pt.

---

## 6. Photography doctrine + pre-processing (canonical: image-intelligence.md)

Editorial language beats stock language. Add-ons: "Bloomberg editorial photography style", "cinematic wide angle, dramatic industrial lighting", "extreme depth of field", "long exposure photography", "no text, 16:9 landscape, fills entire frame edge to edge".

```javascript
const sharp = require('./node_modules/sharp');
await sharp('raw.png').resize(2000, 1125, { fit:'cover' }).toFile('fullbleed.png');  // full-bleed
await sharp('raw.png').resize(840, 1125,  { fit:'cover' }).toFile('halfpanel.png');  // half-panel portrait
```

**Decision-matrix changes:** Big Statement → no image (ghost typography). Stat tiles → no image (data is the visual). Closing → no image (brand-color fill is the visual). Team → monogram circles, NEVER AI faces.
