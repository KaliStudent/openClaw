# Examples: patterns to copy and traps to avoid

Two real decks studied side-by-side: **Chi** (light, geometric SaaS pitch) and **Vintage Furniture Marketplace** (dark, photographic, editorial). Each does some things very well and a few things wrong. Use this as a pattern library and a hit list.

---

## Patterns worth copying

### 1. Distinctive non-default color identity (Chi)

Chi's palette: deep navy `#1F2A3A` + magenta `#E6307E` + electric blue `#2D8DFF` against a near-white striped background. The magenta as the *unfair-advantage* accent is what makes the deck recognizable — it shows up on every slide as outlines, numbered circles, hairlines, and dominant text accents. A default blue would have rendered this exact same content forgettable.

**Apply this**: when the user gives no brand, propose a palette with one unexpected accent (magenta, gold, terracotta, electric green). Don't default to corporate blue. The accent appears in 10% of the slide and carries the deck's identity.

### 2. Big-display editorial typography (Vintage Furniture)

The Vintage deck sets titles at what looks like ~120-160pt in a high-contrast display serif, often filling the upper third of the slide. "Market Opportunity" and "Competitive Advantage" become *the slide*, not labels above the slide. This is fashion-magazine energy and it works for any topic where you want the deck to feel premium and confident.

**Apply this**: for non-data-heavy slides, push titles to 80-160pt. Let them dominate. The body underneath gets shorter and the slide reads faster.

### 3. Glassmorphism cards on photographic backgrounds (Vintage Furniture)

Translucent rounded-rectangle cards with thin light borders, sitting on top of a dark photographic or gradient background. The cards feel like they're floating; the photo provides emotional context; the text stays readable because of the slight opacity.

**Apply this**: powerful when the deck's subject is visual (products, places, people). See the design-system update below for CSS recipes.

### 4. Persistent header motif (Vintage Furniture)

Every slide has the same top-left header: small icon + brand name in a thin font. The top-right has a pill-shaped page indicator with two small dots. This is the deck's signature — it identifies the deck across every screenshot, every slide, every share.

**Apply this**: pick one tiny element (logo in corner, page-of-pages pill, section breadcrumb) and reuse it on every content slide. Skip it on the cover and closing slides for variation. This is *the motif* — the single thing that turns a generic deck into "this deck."

### 5. Numbered circles for processes (both decks)

Chi: filled magenta circles with white numerals, used in "How It Works" and as section markers.
Vintage: glass-outline circles with numerals inside, used in Go-to-Market.

Both work. The choice is tone — filled circles read as bold/SaaS; glass-outline circles read as elegant/editorial.

**Apply this**: any 3-8 step process becomes immediately legible when each step gets a numbered circle in the accent color. Don't use bullets for sequences.

### 6. Big-stat with italic caption beneath (Vintage Furniture)

`73%` set at 200pt in white. Beneath it, in italic 18pt with reduced opacity: *"of buyers abandon searches due to unreliable listings."* The italic + smaller size creates a quiet, supporting voice that doesn't compete with the number.

**Apply this**: for any big-stat slide, follow the number with one italic line of context. Don't bullet 3 sub-points; the stat should hit, the caption should explain, the slide should end.

### 7. Big-stat in a circle (Chi)

Chi's Traction slide uses three circles of equal size, each holding one stat + label. The repetition turns numbers into a visual rhythm — like icons that happen to be statistics. Works for any 3-up summary of magnitude.

**Apply this**: when you have 3-4 stats of equal importance, put each in a matching shape (circles, squares, rounded rects). The shape uniformity amplifies the parallel comparison.

### 8. Dark accent cards for "the punchline" (Chi)

Chi uses dark navy rectangles with bright magenta borders to call out the *most important* content on a light slide — "THE IMPACT", "THE UNFAIR ADVANTAGE", "KEY MILESTONES". The light/dark contrast within a light slide makes the eye go there first.

**Apply this**: when one block on a slide is the punchline, invert it — dark background, light text, accent border. The audience reads it before anything else on the slide.

### 9. Rhythm-breaking slide with different palette (Vintage Furniture)

The Go-to-Market slide departs from the deck's dark-blue palette into a saturated green + terracotta + organic shapes. It's the visual equivalent of changing key in a song — breaks the rhythm and refocuses attention. Used once, mid-deck, it punctuates.

**Apply this**: pick one slide in long decks (10+) to deliberately *break the pattern* — different palette, different texture, different feel. Use this sparingly (once per deck). Overused, it becomes noise.

### 10. Emotional close with full-bleed photo + CTA pill (Vintage Furniture)

The final slide: a warm photograph of people in a vintage-furnished living room, large white title overlay ("Join Us in Reviving Vintage Style"), subtitle, then a single CTA pill at the bottom. No corporate "Thank you" — an invitation, with the visual stakes shown directly.

**Apply this**: close on the emotional payoff of the deck's argument, not on "Q&A". For pitch decks: photo + ask + contact, no other content.

---

## Traps to avoid (these decks slip into them)

### 1. Overlapping cards that clip text (Chi)

The Problem slide: the dark "THE IMPACT" card overlaps the white "STATUS QUO IS BROKEN" card, clipping "growing concern", "fragmented", "outdated", "productivity". The Competitive Advantage slide clips "Encryption" and "Exponential". Business Model clips "Up to 10 Users". This isn't a design choice — it's a layout bug.

**The rule**: overlapping cards is a strong layout move, but the underlying card must contain text that *isn't compromised* by the overlap. Either (a) put no text in the overlap zone, (b) make the overlap visually intentional (e.g. a corner overlap, not a center one), or (c) don't overlap. The Chi deck consistently picks the worst combination.

### 2. Charts with low contrast against background (Vintage Furniture)

The Financial Highlights chart has near-white bars on a near-white gradient background — they barely register. The chart undermines its own point.

**The rule**: chart elements need 3:1 minimum contrast with their background. On dark backgrounds, use white or accent-colored bars and white axis labels. On light backgrounds, use dark or accent-colored bars. Always verify the chart renders at presentation distance, not just in your editor.

### 3. Stock silhouette avatars (Chi)

Chi's team slide uses generic person-icon silhouettes (the businessman, the laptop-person, the ninja-mask person — yes, really a ninja). These read as placeholder content. If real headshots aren't available, either skip the visual entirely (text-only team cards with names and roles set well) or commission/generate consistent illustrated avatars.

**The rule**: stock placeholder icons in a "real" deck signal incomplete work. Better to ship a clean text-only card than to ship with the businessman silhouette.

### 4. Busy decorative backgrounds (Chi)

Chi's diagonal-striped pattern is on every single slide. It's mild enough not to harm legibility, but loud enough that after 10 slides it starts to feel like wallpaper, not design. The pattern adds nothing to the message.

**The rule**: a background pattern should either disappear or do work. If it doesn't carry meaning *and* it persists across the deck, swap it for solid color or a single subtle texture used sparingly.

### 5. Leftover AI-generation disclaimers (Vintage Furniture)

The Financial Highlights chart footer reads: *"Source: AI-generated data. Replace or verify before use."* This is the kind of artifact that gets shipped when no one does a final read-through. It instantly signals the deck wasn't reviewed.

**The rule**: before declaring done, grep the deck for `lorem`, `ipsum`, `placeholder`, `[insert`, `TODO`, `XXX`, `AI-generated`. Fix every hit. Visual QA catches some of this but not all.

### 6. Header chrome on every slide eating attention (both decks, but more so Vintage)

The persistent header is good as a motif (see #4 above), but it should be *quiet*. If the header is competing with the content for attention (too large, too saturated, too detailed), shrink it. The brand-name header in Vintage is roughly the right size; the "Page X of 10" pill is borderline busy.

**The rule**: the motif should be the deck's signature, not its loudest voice. Body type should be larger than header type. If a viewer notices the header before the content, the header is too loud.

### 7. Identical layout repeating without variation (Vintage Furniture)

The Vintage deck uses the "big title + body + two glass cards below" layout on slides 5, 6, 7. It's a beautiful layout — but the audience starts to feel the rhythm before the variation. Break it earlier or vary the proportions.

**The rule**: even when a single layout fits 4 slides perfectly, force yourself to vary at least one of them — flip the card placement, use a single big card instead of two, or add an image cutout. Variation keeps attention.

---

## Quick takeaways to fold into the skill

1. **Default to a distinctive accent color** when the user has no brand. The accent (often magenta, gold, terracotta, electric green) becomes the deck's identity.
2. **Push display titles big** — 80-160pt on title slides and big-statement slides. Editorial confidence reads as polish.
3. **Glassmorphism cards** are a strong pattern on photographic backgrounds. Translucency + thin borders + soft rounded corners = modern and warm.
4. **Persistent motif** — pick one element (logo, page pill, breadcrumb) and repeat it on every content slide. Skip on cover/closing.
5. **Big-stat + italic caption** — never bullet a stat's context. One italic line, then end the slide.
6. **Dark accent cards** invert attention on a light slide. Use for *the punchline*.
7. **Rhythm-breaking slide** — once per long deck, deliberately depart from the palette/texture to refocus attention.
8. **Watch overlap geometry** — text inside an overlap zone gets clipped. Either no text in overlap, or no overlap.
9. **Chart contrast is non-negotiable** — bars and axes need 3:1 minimum against background.
10. **Grep for placeholders** before shipping — `lorem`, `[insert`, `AI-generated`, `XXX`, `TODO`.
