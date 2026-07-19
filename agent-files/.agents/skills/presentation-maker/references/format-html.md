# HTML slides implementation

HTML slides offer the most layout flexibility — and the strongest RTL behavior — at the cost of not being editable by non-developers. Use when the deck will be published online, embedded, or when bespoke design demands more than pptx can express.

## Approach: single-file HTML

Build the deck as **one self-contained `.html` file** with inline CSS and minimal JS. This keeps it portable (one file to share), versionable, and avoids dependency hassles. Use the template below as a starting point and customize per deck.

Don't pull in heavy frameworks like reveal.js unless the deck needs reveal's specific features (multi-axis navigation, speaker mode, etc.). Plain HTML + CSS Grid gives full layout control with less ceremony, and you keep total control of the design.

## Skeleton template

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<title>Deck title</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Replace with whatever font pair the design system spec calls for -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #0B2545;
    --accent: #D4AF37;
    --bg: #FAFAFA;
    --text: #0B2545;
    --muted: #6B7280;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: Inter, system-ui, sans-serif; background: #111; color: var(--text); }
  .deck { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 32px; }
  .slide {
    width: min(1280px, 95vw);
    aspect-ratio: 16 / 9;
    background: var(--bg);
    padding: 6%;
    display: grid;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
  }
  /* Motif: left-edge accent stripe — example */
  .slide.has-motif::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;  /* RTL-safe */
    width: 12px;
    background: var(--accent);
  }
  h1.claim { font-size: clamp(28px, 3.2vw, 48px); font-weight: 800; line-height: 1.15; }
  h2 { font-size: clamp(20px, 2vw, 28px); font-weight: 600; }
  p, li { font-size: clamp(16px, 1.4vw, 22px); line-height: 1.5; }
  .stat-big { font-size: clamp(80px, 10vw, 200px); font-weight: 800; line-height: 1; color: var(--primary); }
  .stat-label { color: var(--muted); font-size: clamp(14px, 1.2vw, 18px); margin-top: 12px; }
  /* Print: each slide on its own page */
  @media print {
    body { background: white; }
    .deck { gap: 0; padding: 0; }
    .slide { box-shadow: none; page-break-after: always; width: 100vw; aspect-ratio: auto; height: 100vh; }
  }
</style>
</head>
<body>
<main class="deck">
  <!-- Cover -->
  <section class="slide" style="background: var(--primary); color: white; place-content: end start;">
    <h1 class="claim">The single sentence the deck is about</h1>
    <p style="opacity:.7; margin-top: 24px;">Speaker · Date</p>
  </section>
  <!-- Big-stat -->
  <section class="slide has-motif" style="place-content: center;">
    <div style="text-align: center;">
      <div class="stat-big">4×</div>
      <div class="stat-label">Revenue growth after shipping self-serve</div>
    </div>
  </section>
  <!-- ...etc -->
</main>
</body>
</html>
```

## RTL in HTML

This is where HTML shines. Use **logical CSS properties** throughout (`inset-inline-start`, `margin-inline-end`, `padding-inline`, etc.) — they auto-flip based on direction. Then setting direction is a one-line change.

For RTL-primary decks:
```html
<html lang="he" dir="rtl">
```

For mixed-direction decks, keep `<html dir="ltr">` and set `dir="rtl"` per slide or per text element:
```html
<section class="slide" dir="rtl" lang="he">…</section>

<!-- Or inline mixed-language text -->
<p>The product is called <span dir="ltr">Cowork</span> and we launched it ב-2024.</p>
```

Use `<bdi>` for isolating user-generated or dynamic foreign-script content from the surrounding bidi context.

## Presentation mode

For live presentation, add minimal keyboard navigation:

```html
<script>
  let slides = [...document.querySelectorAll('.slide')];
  let current = 0;
  function show(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, idx) => s.style.display = idx === current ? '' : 'none');
    location.hash = `#${current + 1}`;
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') show(current + 1);
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'f') document.documentElement.requestFullscreen();
  });
  // Honor #N in URL on load
  const initial = parseInt(location.hash.slice(1)) - 1;
  show(isNaN(initial) ? 0 : initial);
</script>
```

For RTL decks, swap arrow direction: ArrowLeft → next, ArrowRight → previous.

## Fonts

Pull from Google Fonts using `<link>` tags (above). For Hebrew/Arabic:
```html
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
```

Set CSS:
```css
html[lang="he"], [lang="he"] { font-family: Heebo, system-ui, sans-serif; }
html[lang="ar"], [lang="ar"] { font-family: Tajawal, system-ui, sans-serif; }
```

If you need offline-portable HTML (no internet at presentation time), download the font files and embed as `@font-face` with `src: url(data:font/woff2;base64,...)` — large but bulletproof.

## Layout patterns

Use CSS Grid for slide internals. Each layout from `layouts.md` is a grid template. Examples:

```css
.layout-two-col { grid-template-columns: 1fr 1fr; gap: 6%; align-items: center; }
.layout-grid-of-cards { grid-template-columns: repeat(3, 1fr); gap: 3%; }
.layout-big-statement { place-content: center; text-align: start; }
.layout-half-bleed > img { grid-column: 2; height: 100%; object-fit: cover; }
```

## Export to PDF from HTML

```bash
# Headless Chrome
google-chrome --headless --disable-gpu --print-to-pdf=deck.pdf --no-pdf-header-footer file://$PWD/deck.html

# Or Playwright (more reliable for complex pages)
npx playwright codegen # to set up
# Or use weasyprint for HTML → PDF (great for RTL):
weasyprint deck.html deck.pdf
```

`weasyprint` is the best option for RTL — it handles bidi correctly and embeds fonts automatically.

## Visual QA for HTML

Open in a browser. Hit `f` for fullscreen. Walk every slide. Check:
- Text doesn't overflow its container at the actual aspect ratio.
- Colors look as intended (not desaturated, not blown out).
- Direction is correct on every RTL slide.
- Fonts loaded (no fallback shown — view source and confirm the font name).
- Print-to-PDF preview looks right (each slide one page, no cutoffs).
- **No collapsed line-boxes on big display glyphs.** Oversized quote marks, ghost numbers, and architecture numbers must NOT have `line-height` below 1 or a `height` smaller than the glyph — that pulls the glyph out of its box and overlaps it with the eyebrow/label above or the text below. Use `line-height:1`, no fixed `height`, and space it with `margin`. (See the "oversized quotation-mark trap" in `layouts.md`.)

For final QA, also test on a different browser. Safari renders fonts slightly differently from Chrome; verify the deck looks right in both if the audience might use either.

---

## ⚑ Data visualization — charts and graphs in HTML slides

**NEVER use CSS flex/grid with `height: %` for bar charts.** Browsers silently ignore percentage heights inside flex containers — bars will not render. This is one of the most common presentation bugs.

### Always use SVG for charts

SVG uses absolute coordinates. There is no rendering ambiguity. Use it for every chart type.

**Bar chart template (copy and adapt):**
```html
<svg viewBox="0 0 500 260" width="100%" style="overflow:visible">
  <!-- Y-axis -->
  <line x1="50" y1="10" x2="50" y2="220" stroke="#444" stroke-width="1.5"/>
  <!-- X-axis -->
  <line x1="50" y1="220" x2="490" y2="220" stroke="#444" stroke-width="1.5"/>

  <!-- Bars — define x, y, width, height as absolute px values -->
  <!-- y = 220 - barHeight, height = barHeight -->
  <rect x="70"  y="160" width="55" height="60"  fill="#8892A4" rx="4"/>
  <rect x="160" y="130" width="55" height="90"  fill="#8892A4" rx="4"/>
  <rect x="250" y="90"  width="55" height="130" fill="#8892A4" rx="4"/>
  <rect x="340" y="50"  width="55" height="170" fill="#8892A4" rx="4"/>
  <rect x="430" y="20"  width="55" height="200" fill="#FF6B35" rx="4"/> <!-- highlight bar -->

  <!-- X labels -->
  <text x="97"  y="238" text-anchor="middle" fill="#8892A4" font-size="13">2021</text>
  <text x="187" y="238" text-anchor="middle" fill="#8892A4" font-size="13">2022</text>
  <text x="277" y="238" text-anchor="middle" fill="#8892A4" font-size="13">2023</text>
  <text x="367" y="238" text-anchor="middle" fill="#8892A4" font-size="13">2024</text>
  <text x="457" y="238" text-anchor="middle" fill="#FF6B35" font-size="13" font-weight="700">2025E</text>

  <!-- Value labels on top of bars -->
  <text x="97"  y="153" text-anchor="middle" fill="white" font-size="12" font-weight="600">300M</text>
  <text x="457" y="13"  text-anchor="middle" fill="#FF6B35" font-size="12" font-weight="700">900M</text>
</svg>
```

**How to calculate bar height:**
```
chartHeight = 210  (total SVG draw area)
barHeight = (value / maxValue) * chartHeight
y = 220 - barHeight
```

Run this arithmetic explicitly before writing SVG. Never eyeball it.

**Other chart types:**
- **Line chart** → SVG `<polyline>` or `<path>` with calculated point coordinates
- **Pie/donut** → SVG `<circle>` with `stroke-dasharray` technique
- **Progress bar** → SVG `<rect>` background + `<rect>` fill — never CSS width: %

---

## ⚑ User-provided images — placement protocol

When the user sends an image and says "put it in slide X":

1. **Save the image** to the build directory and reference it with a relative path.
2. **Choose a placement pattern** based on slide content density:
   - If slide has lots of text → **right panel** layout: content left 55%, image right 45%
   - If slide is sparse → **full-bleed background** with overlay
   - If it's a portrait photo (person) → **right column**, contained, with `object-fit: cover`

3. **CSS for panel image:**
```css
.image-panel {
  position: absolute;
  right: 0; top: 0;
  width: 45%; height: 100%;
  overflow: hidden;
}
.image-panel img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
}
/* Gradient fade on left edge so text doesn't clash */
.image-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--bg) 0%, transparent 30%);
  z-index: 1;
}
```

4. **Reflow the existing content** to use the remaining width — set `max-width: 52%` on the text container and add `padding-right: 2%`.

---

## ⚑ Team slide — profile picture protocol

When the user provides a profile photo for a team member:

**Always display as a circle**, not a rectangle. This is the universal convention for team slides and signals professional design instantly.

```css
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top; /* favor face over body */
  border: 2px solid var(--accent);
}
```

If the source image is not square, `object-fit: cover` will crop it to fill the circle — always set `object-position: center top` to avoid cropping the face.

If the user provides **no photo** for a team member, generate a placeholder with initials:
```html
<div class="avatar" style="background: var(--accent); display:grid; place-content:center;
  font-size:32px; font-weight:700; color:var(--bg); border-radius:50%; width:96px; height:96px;">
  OF
</div>
```

Never use a generic person icon — initials look intentional; icons look lazy.
