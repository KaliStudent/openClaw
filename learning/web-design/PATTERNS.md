# Modern Web Design — Research & Patterns

## Design Systems & Component Libraries

### Trending in 2025-2026
- **Shadcn/ui** — Copy-paste Radix components with Tailwind. Not a package, you own the code.
- **Tailwind CSS** — Utility-first, dominant in new projects. v4 uses Oxide engine (faster).
- **Framer Motion** — Animation library for React. Smooth, declarative.
- **GSAP** — Professional animation (ScrollTrigger, timeline-based).
- **Aceternity UI** — Premium animated components (cards, hero sections, backgrounds).
- **Magic UI** — Animated components for landing pages.

### Design Trends 2026
1. **Bento Grids** — Dashboard-like layouts for marketing pages
2. **Glassmorphism** — Frosted glass effects (backdrop-blur)
3. **Grain/noise textures** — Subtle overlays for depth
4. **Dark mode by default** — With thoughtful light mode option
5. **Micro-interactions** — Small animations on every interaction
6. **3D elements** — Spline/Three.js hero sections
7. **Variable fonts** — Single font file, many weights/widths
8. **Scroll-driven animations** — CSS scroll-timeline (native!)
9. **AI-themed gradients** — Purple/blue/cyan color schemes
10. **Brutalist accents** — Raw, intentional "ugliness" as style

---

## Landing Page Architecture (Best Converting)

### Above the Fold (Hero)
```
┌─────────────────────────────────────────────┐
│ Logo          Nav Links          CTA Button  │
├─────────────────────────────────────────────┤
│                                             │
│     Big Bold Headline (1 line)              │
│     Subheadline (1-2 lines, value prop)     │
│                                             │
│     [Primary CTA]   [Secondary CTA]        │
│                                             │
│     Social proof line (X customers...)      │
│                                             │
│     Hero image/video/demo                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Full Page Flow
1. **Hero** — Hook + CTA
2. **Social proof** — Logos, testimonials, numbers
3. **Problem** — What's wrong without your product
4. **Solution** — How you fix it (with demo/screenshot)
5. **Features** — 3-6 key benefits (icons + short copy)
6. **How it works** — 3 steps
7. **Pricing** — Clear tiers
8. **Testimonials** — Real people, real results
9. **FAQ** — Overcome objections
10. **Final CTA** — Repeat the ask

### Key Principles
- **One page, one goal** — Every element drives toward one CTA
- **F-pattern reading** — Important stuff top-left
- **Progressive disclosure** — Don't overwhelm upfront
- **Speed** — If it doesn't load in 2s on mobile, you've lost them
- **Contrast** — CTA button must be the most visually prominent thing

---

## Responsive Design Patterns

### Breakpoints (Tailwind defaults)
```
sm: 640px    — Large phones landscape
md: 768px    — Tablets portrait
lg: 1024px   — Tablets landscape / small laptops
xl: 1280px   — Desktops
2xl: 1536px  — Large desktops
```

### Mobile-First Approach
```css
/* Base: mobile */
.card { padding: 1rem; }

/* Scale up for larger screens */
@media (min-width: 768px) {
  .card { padding: 2rem; }
}
```

### Container Queries (Modern CSS)
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

---

## Performance Patterns

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Checklist
- [ ] Images: WebP/AVIF, responsive sizes, lazy loading
- [ ] Fonts: preload, font-display: swap, subset
- [ ] CSS: Critical CSS inlined, rest async loaded
- [ ] JS: Code split, tree shake, defer non-critical
- [ ] Caching: Aggressive cache headers, service worker
- [ ] CDN: Static assets on edge
- [ ] Compression: Brotli > gzip
- [ ] Prefetch: `<link rel="prefetch">` for likely next pages

---

## Color & Typography

### SaaS Color Palette Pattern
```
Primary:    Blue/Purple (#2563EB / #7C3AED)
Secondary:  Teal/Green (#0D9488 / #16A34A)  
Accent:     Orange/Pink (#F97316 / #EC4899)
Neutrals:   Slate scale (#0F172A → #F8FAFC)
Success:    Green (#22C55E)
Warning:    Amber (#F59E0B)
Error:      Red (#EF4444)
```

### Typography Scale (Tailwind)
```
xs:   12px / 0.75rem
sm:   14px / 0.875rem
base: 16px / 1rem
lg:   18px / 1.125rem
xl:   20px / 1.25rem
2xl:  24px / 1.5rem
3xl:  30px / 1.875rem
4xl:  36px / 2.25rem
5xl:  48px / 3rem
```

### Font Stacks
- **Headings:** Inter, Cal Sans, Satoshi, Plus Jakarta Sans
- **Body:** Inter, system-ui, DM Sans
- **Mono:** JetBrains Mono, Fira Code

---

## Animation Patterns (Framer Motion)

### Page Enter
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Stagger Children
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

### Scroll-triggered (native CSS - no JS!)
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

---

## SaaS Dashboard Patterns

### Layout
```
┌──────────┬──────────────────────────────────┐
│          │  Header (breadcrumbs, search, user│
│  Sidebar │──────────────────────────────────│
│  (nav)   │                                  │
│          │  Content Area                    │
│  - Dash  │  ┌────────┬────────┬────────┐   │
│  - Users │  │ Stat 1 │ Stat 2 │ Stat 3 │   │
│  - Data  │  └────────┴────────┴────────┘   │
│  - Logs  │                                  │
│  - Conf  │  ┌──────────────────────────┐   │
│          │  │ Main content / table /    │   │
│          │  │ chart / form             │   │
│          │  └──────────────────────────┘   │
└──────────┴──────────────────────────────────┘
```

### Mobile Dashboard
- Sidebar becomes bottom tab bar or hamburger
- Stat cards stack vertically
- Tables become card lists
- Charts simplify (fewer data points)

---

## Useful Resources
- https://ui.shadcn.com — Component reference
- https://tailwindcss.com/docs — Utility classes
- https://motion.dev — Animation library docs
- https://www.refactoringui.com — Design for developers (book)
- https://laws.ux — UX principles
- https://www.nngroup.com — UX research (authoritative)
- https://dribbble.com — Design inspiration
- https://land-book.com — Landing page gallery
- https://www.awwwards.com — Award-winning web design
