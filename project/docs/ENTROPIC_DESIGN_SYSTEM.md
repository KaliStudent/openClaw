# Entropic CSS Design System — Deep Study

> **Source**: `/workspace/agent-files/entropic-css/`, `entropic-ui-template.html`, `templates/`, `pages/Home.jsx`
> **Version**: Entropic UI v2.0–v3.0, May 2026
> **Author**: Study by MainStreet AI engineering team

---

## 1. Token/Variable System Architecture

Entropic uses a **two-layer CSS custom property system**:

### Layer 1: Semantic Surface Tokens (Theme-Specific)
These define the *identity* of a theme — raw color palette values:

```css
:root, .theme-dark {
  --primary:       #03ff6c;      /* Brand accent */
  --primary-lt:    #7cfc19;      /* Lighter variant */
  --primary-dk:    #01cc55;      /* Darker variant */
  --accent1:       #7cfc19;      /* Secondary accent */
  --accent2:       #ffa805;      /* Tertiary accent */
  --accent3:       #5b0af2;      /* Quaternary/contrast */
  --grad-text:     linear-gradient(135deg, ...); /* Text gradient */
}
```

### Layer 2: Component/System Tokens (Variant-Mapped)
These define *how* things look — derived from palette but controlling components:

```css
/* Surfaces */
--bg:           var(--void);        /* Page background */
--surface:      var(--graphite);    /* Card/section surface */
--surface2:     var(--panel);       /* Nested surface */
--text:         var(--fore);        /* Primary text */
--text-dim:     var(--muted);       /* Secondary text */
--border:       var(--hairline);    /* Default border */
--border2:      rgba(58,64,74,0.5); /* Subtle border */

/* Glass */
--glass-blur:   blur(28px) saturate(200%) brightness(112%);
--glass-bg:     rgba(255,255,255,0.04);
--glass-border: 1px solid rgba(255,255,255,0.08);
--glass-radius: 20px;
--glass-shadow: 0 24px 48px rgba(0,0,0,0.5);

/* Buttons */
--btn-radius:   100px;
--btn-border:   color-mix(in srgb, #03ff6c 40%, transparent);
--btn-bg:       color-mix(in srgb, #03ff6c 9%, transparent);
--btn-glow-shadow: 0 0 24px color-mix(in srgb, #03ff6c 30%, transparent);
```

### The "Asphalt" Extended Palette (Named Tokens)
The Asphalt theme introduces a named luminance-only scale — no hue, pure gray:

```css
--void:       #0d0f12;   /* Deepest background */
--graphite:   #1a1d22;   /* Surface */
--panel:      #22262d;   /* Elevated panel */
--slate:      #2e3440;   /* Mid-dark */
--hairline:   #3a404a;   /* Border/divider */
--muted:      #6b7280;   /* Dim text */
--fore:       #c9d1d9;   /* Primary text (foreground) */
--lumen:      #f0f4f8;   /* Highest luminance text */
--horizon:    rgba(255,255,255,0.12);  /* Decorative accent */
```

### Key Insight: `color-mix()` Usage
Entropic heavily uses `color-mix(in srgb, <color> <percent>, transparent)` to generate tints/borders from the primary color — eliminating manual alpha-channel calculations:

```css
--primary-tint:   color-mix(in srgb, #ff0066 10%, transparent);
--primary-border: color-mix(in srgb, #ff0066 28%, transparent);
--btn-glow:       color-mix(in srgb, #ff0066 30%, transparent);
```

---

## 2. Theme Structure (6 Themes × 3 Styles)

### Six Color Themes:
| Theme | Primary | Character |
|-------|---------|-----------|
| **Entropic** | `#03ff6c` (green) | Electric neon green, purple/orange accents |
| **Cherry** | `#ff0066` (pink) | Hot pink, orange/teal accents |
| **Jungle** | `#aaff00` (lime) | Acid lime, teal/crimson accents |
| **Cobalt** | `#0088ff` (blue) | Deep blue, purple/yellow accents |
| **Solarstorm** | `#fbff03` (yellow) | Electric yellow, near-monochrome |
| **Unstained** | `#f4f4f5` (white) | Blue-black to warm white scale, zero color |

### Three Style Variants:

#### Liquid (Glass Morphism)
- `backdrop-filter: blur(28px) saturate(200%) brightness(112%)`
- `border-radius: 20px` / `btn-radius: 100px`
- Translucent `rgba(255,255,255,0.04)` backgrounds
- Smooth `0.22s ease` transitions
- `hover-lift: translateY(-5px)` — cards float on hover
- Deep blur glass with 24px+ radii
- Grid overlay visible at ~4% opacity
- Orbs drift with 20-26s infinite animations
- Rim highlights on top edges (`::before` pseudo)

#### Brutalist
- `backdrop-filter: none` — no blur anywhere
- `border-radius: 0px` / `btn-radius: 2px`
- `border: 2px solid rgba(255,255,255,0.22)`
- Hard `4px 4px 0` offset shadows (CSS box-shadow, no blur)
- `transition: 0.08s ease` — snappy, instant-feel
- `hover-lift: translateY(0)` — no float, border color change only
- Fonts: `JetBrains Mono` body + `Orbitron` display
- Grid visible as dot-matrix pattern at 20% opacity
- Scan-line overlays (1px repeating linear gradients)
- Hover fills primary color: `background: var(--primary); color: #000`
- `letter-spacing: 0.08em`, `text-transform: uppercase`
- Static orbs (animation paused)
- Grid gaps collapse to 1px (cells share borders)
- Section padding compact: 56px

#### Minimal (Neo-Minimal / Enhanced Glass)
- `backdrop-filter: none` at rest → reveals on hover
- Cards **invisible at rest** (no bg, no border, no shadow)
- On hover: deep frosted glass reveals (`blur(32px)`, border, shadow all fade in)
- `body-weight: 300` — thin typography
- `section-pad: 120px` — generous breathing room
- `transition: 0.35s cubic-bezier(0.25,0.46,0.45,0.94)` — smooth, deliberate
- `hero-tracking: -0.05em` — tighter headline kerning
- Scroll reveal animations (opacity + translateY)
- Buttons invisible at rest, reveal on hover
- `glass-static` class for always-visible panels (nav, modals)
- Radial bottom glow `::after` for sub-surface depth feel

---

## 3. How Themes Differ from Each Other

### Brutalist vs Liquid vs Minimal — Summary Matrix

| Property | Liquid | Brutalist | Minimal |
|----------|--------|-----------|---------|
| `border-radius` | 20px / 100px | 0px / 2px | 14px / 8px |
| `backdrop-filter` | Always on | Never | On hover only |
| `transition` | 0.22s | 0.08s | 0.35s |
| `hover` | lift + shadow | border-color / fill | reveal all |
| `body-font` | Inter | JetBrains Mono | Inter |
| `display-font` | Inter | Orbitron | Inter |
| `font-weight` | 400 | 400 | 300 |
| Background | Grid + orbs | Dot-matrix + scanlines | Clean + subtle orbs |
| Spacing | 100px sections | 56px compact | 120px generous |
| Shadow style | Deep blur (48px) | Hard offset (4px 4px 0) | None → reveal |
| Grid gaps | 18px | 1px (border sharing) | 18px |

---

## 4. Glass Morphism Approach

The `.glass` class is the core component pattern:

```css
.glass {
  background: var(--glass-bg);              /* rgba(255,255,255,0.04) */
  backdrop-filter: var(--glass-blur);       /* blur(28px) saturate(200%) */
  border: var(--glass-border);              /* 1px solid rgba(255,255,255,0.08) */
  border-radius: var(--glass-radius);       /* 20px */
  box-shadow: var(--glass-shadow);          /* 0 24px 48px rgba(0,0,0,0.5) */
}
```

**Key glass details:**
- `::before` pseudo creates a **rim highlight** — a gradient from transparent → white → primary → white → transparent along the top edge
- `::after` adds a subtle animated shimmer on the bottom edge
- Hover intensifies: shadow grows, card lifts, background brightens
- The `saturate(200%) brightness(112%)` in the backdrop-filter makes background content more vibrant through the glass

**Neumorphic Mode** (from the main template):
- Uses `box-shadow` pairs: `12px 12px 28px dark, -6px -6px 18px light`
- Active/pressed state uses `inset` shadows
- Theme-specific base colors: `--neu-bg`, `--neu-shadow-dk`, `--neu-shadow-lt`
- Each theme maps to a unique dark surface tone for neumorphic depth

---

## 5. Component Patterns

### Navigation (`.nav`)
- Sticky, 60px height
- Backdrop-blurred with saturate
- Bottom `::after` horizon line (gradient fade-out at edges)
- Logo: display-font, 800 weight, accent-colored secondary word
- Links: 11-13px, uppercase in brutal, sentence in others

### Badge (`.badge`)
- Inline-flex with gap
- `.badge-dot`: pulsing circle (6px) with box-shadow glow
- Border from `--primary-border` (tinted)
- Brutalist: square dot, hard blink animation

### Section Layout
- `.section-eyebrow`: 9-11px, uppercase, tracked, primary colored
- `.section-title`: `clamp(22px, 3.5vw, 48px)`, 800 weight
- `.section-sub`: max-width 480-540px, dim color, 1.7 line-height
- Brutalist: eyebrow has `::before` 24px hairline dash

### Cards / Feature Cards
- Use `.glass` as base
- `.feature-icon`: 28px emoji, floats on hover
- `.feature-title`: 14-16px bold
- `.feature-desc`: 12-14px, dim, 1.7 line-height
- Brutalist: left accent bar (`border-left: 4px solid primary`)
- Corner tick marks (brutalist): `::before` with monospace label

### Buttons
- `.btn`: rounded pill (liquid), square (brutal), soft rounded (minimal)
- `.btn-primary`: border + bg use primary tints, text = primary color
- `.btn-ghost`: nearly invisible, reveals on hover
- Brutalist hover: **full primary fill**, inverted text
- Neumorphic: raised box-shadow → pressed inset on active

### Stat Block (Asphalt theme)
- `border-top: 2px solid var(--fore)`
- Large display number (40px, 900 weight)
- Small label (10px, tracked, uppercase)

### Data Table
- Minimal chrome: border-collapse, hairline separators
- Header: 10px uppercase tracked
- Row hover: 2% white tint
- Compact 12px body text

### Forms
- Labels: 10-12px, uppercase, tracked
- Inputs: transparent bg, hairline border, 2px radius (brutal) or 10px (minimal)
- Focus: border brightens, subtle background reveal
- Minimal: `backdrop-filter: blur(12px)` on inputs

---

## 6. Background System

### Orbs
- 4 fixed-position orbs + 1 mouse-tracking orb
- Sizes: 380px–800px with heavy blur (36-66px)
- Radial gradient: primary/accent → transparent at 70%
- 14-26s infinite drift animations (viewport-unit keyframes)
- Brutalist: paused animations (static glow spots)
- Neumorphic: slower (32s)

### Grid Overlay
- CSS linear-gradient grid lines (1px width)
- `background-size: var(--grid-size)` — 40px brutal, 80px liquid
- Opacity controlled per variant

### Dot Matrix (Brutalist)
- `radial-gradient(circle, color 1.5px, transparent 1.5px)`
- `background-size: 22-24px`
- Visible only in brutalist mode

### Scan Lines (Brutalist)
- Repeating-linear-gradient: 1px colored, 2px transparent
- Ultra-subtle (2% white)

### Noise Texture
- SVG inline data URI: `feTurbulence` fractal noise
- Tiled at 200px, 15-28% opacity
- Adds analog film grain feel

---

## 7. Dark/Light Mode System

Each theme provides full `.theme-light` overrides:

```css
.theme-light {
  --bg:        #f0f4ff;          /* Light base */
  --surface:   #ffffff;          /* Pure white cards */
  --text:      rgba(0,8,30,0.88); /* Near-black */
  --border:    rgba(0,0,0,0.09);  /* Subtle */
  --glass-bg:  rgba(255,255,255,0.70);   /* Opaque white */
  --glass-shadow: 4px 4px 0 rgba(0,0,0,0.15); /* Dark offset */
  --btn-bg-hover: primary-color;
  --nav-bg:    rgba(255,255,255,0.92);
}
```

**Key light mode shifts:**
- Surfaces flip from dark-translucent to white-opaque
- Shadows change from white-on-dark to black-on-light
- Primary colors darken slightly for contrast (e.g. `#03ff6c` → `#01cc55`)
- Glass becomes frosted white instead of frosted dark

---

## 8. Template Architecture

### Selector System (`templates/selector.html`)
- 7 site templates × 6 themes × 2 variants × 2 modes = 168 combinations
- State-driven JS: single `setState()` triggers full re-render
- Sidebar filter UI with live iframe preview
- Device switching (desktop/tablet/mobile) via max-width toggle
- Purchase panel with Stripe/PayPal checkout stubs

### Template HTML Pattern
All templates follow the same structure:
```html
<link rel="stylesheet" href="../../entropic-css/[variant]-[theme].css" id="theme-stylesheet" />
<!-- Background layer (orbs + noise + grid) -->
<div style="position:fixed;inset:0;z-index:0;pointer-events:none;">...</div>
<!-- Nav -->
<nav class="nav">...</nav>
<!-- Content sections using .glass, .section, .grid-N -->
<!-- Theme switcher bar (fixed bottom-right) -->
<div class="theme-bar">...</div>
```

### JSX/React Pattern (`Home.jsx`)
- CONFIG object at top for easy rebranding
- Hardcoded token values (not CSS vars) inline in React style objects
- Mouse-tracking orb effect
- Countdown timer component
- Form with state management (idle/loading/success/error)
- Separate `<Styles>` component for global CSS injection

---

## 9. What to Steal/Adapt for MainStreet AI

### ✅ Adopt Immediately

1. **Token architecture**: Two-layer system (palette → component tokens) with CSS custom properties. Perfect for theming our AI-generated sites.

2. **`color-mix()` for tints**: Eliminates hand-crafting rgba values. One primary color generates all needed tints:
   ```css
   --primary-tint: color-mix(in srgb, var(--primary) 10%, transparent);
   --primary-border: color-mix(in srgb, var(--primary) 28%, transparent);
   ```

3. **Glass card pattern**: The `.glass` class with its rim highlights, hover lift, and backdrop-filter is production-ready and impressive.

4. **Dark/Light mode via class toggle**: Clean `.theme-dark` / `.theme-light` override blocks. No media queries needed for user preference (but could add).

5. **Section anatomy**: eyebrow → title → subtitle → content grid. This is the standard section pattern used across all templates.

6. **Fluid typography with `clamp()`**: 
   ```css
   font-size: clamp(24px, 4vw, 48px);
   padding: var(--section-pad) clamp(16px, 5vw, 80px);
   ```

7. **Named luminance scale** (Asphalt-style): `--void` → `--graphite` → `--panel` → `--slate` → `--hairline` → `--muted` → `--fore` → `--lumen`. Memorable, semantic.

8. **Noise texture overlay**: Single SVG data URI, completely self-contained, adds premium feel at near-zero cost.

### ✅ Adapt with Modifications

9. **Orb/glow system**: Useful for hero backgrounds, but should be optional and performant. Use `will-change: transform` and consider reducing to 2 orbs on mobile.

10. **Variant switching via class**: The `body.style-brutalist` / `body.style-liquid` pattern is clever — CSS does all the work, JS just swaps classes. We should use this for our template customization engine.

11. **Brutalist grid gaps → 1px borders**: Instead of CSS gap, cells share borders. Creates that raw "data grid" feel cheaply.

12. **Mouse-following orb**: Nice subtle effect. Implement with passive event listener and CSS transition (not JS animation frame).

13. **Horizon lines**: The gradient fade-out dividers (`linear-gradient(90deg, transparent, rgba(...), transparent)`) look better than solid `<hr>` elements.

### ⚠️ Use Cautiously

14. **Full backdrop-filter everywhere**: Performance cost on mobile. Gate behind `@supports` and reduce saturation on mobile.

15. **Inline styles in React**: Home.jsx uses inline styles extensively — fine for rapid prototyping, but our production components should use the CSS variable system with utility classes.

---

## 10. Specific CSS Tokens Worth Adopting

### Core System (steal directly):
```css
/* Surface scale */
--bg, --surface, --surface2, --text, --text-dim, --border, --border2

/* Primary with tint derivatives */
--primary, --primary-lt, --primary-dk
--primary-tint, --primary-border, --primary-rim

/* Glass component */
--glass-blur, --glass-bg, --glass-border, --glass-radius, --glass-shadow

/* Button component */
--btn-radius, --btn-border, --btn-bg, --btn-bg-hover, --btn-glow-shadow

/* Typography */
--body-font, --display-font, --hero-tracking, --hero-weight, --body-weight

/* Layout */
--section-pad, --hover-lift, --transition

/* Orb/decoration */
--orb1, --orb2, --orb3, --grid-color, --grid-size, --grid-opacity
```

### Animation Keyframes (steal directly):
```css
@keyframes entropic-pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
@keyframes entropic-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes entropic-drift1 { /* viewport-unit path animation */ }
```

### The "Horizon" Pattern:
```css
.divider-horizon {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
}
```

### The "Rim" Pattern:
```css
.glass::before {
  content: '';
  position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255,255,255,0.30), 
    color-mix(in srgb, var(--primary) 70%, transparent),
    rgba(255,255,255,0.30), 
    transparent
  );
}
```

---

## 11. Summary: What Makes Entropic Good

1. **One CSS file = complete design system** — no build step, no dependencies
2. **Theme × variant matrix** — combinatorial customization with zero JS
3. **Progressive disclosure** — minimal variant hides UI until interaction
4. **Named scales** — memorable tokens like `--void`, `--lumen`, `--horizon`
5. **Self-contained decorations** — noise, orbs, grid all work via CSS alone
6. **Reduced motion respected** — full `prefers-reduced-motion` support
7. **Light/dark as class toggle** — simplifies dynamic theming
8. **Component patterns are minimal** — `.glass`, `.btn`, `.badge`, `.section` cover 90% of needs
9. **Template architecture is plug-and-play** — swap one `<link>` = new personality

---

## 12. Recommended MainStreet AI Implementation Order

1. Define our token system (surface scale + primary derivatives)
2. Build `.glass` card component with rim highlights
3. Implement dark/light mode via class toggle
4. Create 2-3 color themes using `color-mix()` pattern
5. Add noise texture overlay (self-contained SVG)
6. Build section anatomy components (eyebrow, title, sub, grid)
7. Implement the "brutal" variant as an alternate personality
8. Add orb background system (optional, hero-only)
9. Wire up template selector for customer-facing preview
