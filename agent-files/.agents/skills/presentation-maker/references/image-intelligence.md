# Image Intelligence: selecting, generating, and placing visuals

Images are not decoration — they are **semantic content**. Every image on every slide must carry a specific job. This spec defines how to choose the right image type for a given slide context, how to prompt AI generation, and how to never leave a blank rect again.

---

## PHOTOGRAPHY STYLE DOCTRINE

The single biggest quality lever in AI imagery is the *language* of the prompt. Stock-photo language produces stock-photo results. Editorial/cinematic language produces images that look art-directed.

| Avoid (stock language) | Use instead (editorial/cinematic) |
|---|---|
| "industrial facility" | "aerial cinematic photography of a petrochemical refinery at dusk, orange flames, Bloomberg editorial style" |
| "polymer pellets" | "extreme macro close-up of white polymer pellets cascading against black, dramatic studio lighting, depth-of-field blur" |
| "business meeting" | "candid wide-angle of executives mid-discussion in a glass boardroom, golden-hour backlight, documentary editorial style" |
| "city at night" | "long-exposure aerial of a financial district at blue hour, light trails, cinematic wide angle" |

### Prompt add-ons that elevate quality

Append one or more of these to any panel/background prompt:
- "Bloomberg editorial photography style"
- "cinematic wide angle, dramatic industrial lighting"
- "extreme depth of field"
- "long exposure photography"
- "no text, 16:9 landscape, fills entire frame edge to edge"

---

## Image pre-processing rules

Before inserting any AI-generated image into a pptx, pre-crop it with `sharp` so it fills its zone exactly with no distortion:

```javascript
const sharp = require('./node_modules/sharp');

// Full-bleed slide (16:9)
await sharp('raw.png').resize(2000, 1125, { fit: 'cover' }).toFile('fullbleed.png');

// Half-panel portrait (left or right half, edge to edge)
await sharp('raw.png').resize(840, 1125, { fit: 'cover' }).toFile('halfpanel.png');
```

`fit: 'cover'` crops to fill the target ratio — never letterboxes, never distorts.

---

---

## ⚠ Core rule

**Never leave a colored rectangle as an image placeholder.** If an image zone exists on a slide, it must contain either:
- An AI-generated image (default — use `generate_image` tool), OR
- A user-provided photo (if the user has sent one), OR
- A removed zone (if no image genuinely fits the slide — better to remove the zone than to leave it empty).

---

## Image type taxonomy

Inspired by Gamma's art-style system, every image zone is assigned exactly one type. The type drives the AI prompt style, the placement logic, and the overlay treatment.

### 1. Scene / Environment
**What it is:** A wide-angle, photorealistic environment shot. Shows a place or context — a city, a facility, a landscape, a room.

**When to use:**
- Cover slides — establish the world
- "The Problem" slides — show the current state being solved
- "Market" slides — convey geographic or physical scale
- Closing slides — emotional payoff, the world as it could be

**Prompt formula:**
`[wide/aerial] [location description], [time of day], [mood adjective], photorealistic, [camera angle]`

**Example:**
> `Aerial photograph of Israeli highway with solar fence panels on both sides, golden hour, industrial and clean, wide angle`

**Placement:** Full-bleed background (0, 0, W, H) with a dark overlay (gradient or semi-transparent fill) so text is legible on top. Never crop small.

---

### 2. Product / Object Shot
**What it is:** Clean, close-up image of a specific product, component, or physical object. Often against a neutral or dark background.

**When to use:**
- "Our Solution" slides — show the actual product
- "Technology" slides — show components, engineering, specs
- "How It Works" slides — step-by-step with product callouts

**Prompt formula:**
`Close-up of [product description], [material/surface details], [lighting style], [background], photorealistic, [color mood matching brand]`

**Example:**
> `Close-up of bifacial solar panels in a perimeter security fence, steel structure, dramatic directional sunlight, dark industrial background, photorealistic, lime-green tinted glow`

**Placement:** Half-panel (right or left half of slide). Use a gradient overlay on the side that meets text — do NOT use a hard edge.

---

### 3. People / Human Context
**What it is:** Photos of real-seeming people in professional or contextual settings. Engineers, customers, team members, users.

**When to use:**
- "Team" slides — portraits or in-field photos
- "Customer / Traction" slides — show the human impact
- "Process" slides — engineers, installers, operators working

**Prompt formula:**
`[number] [profession] [doing specific action], [environment], [lighting], documentary photography style, [brand color mood], authentic and candid`

**Example:**
> `Two Israeli engineers reviewing installation plans at a solar fence site, railway infrastructure in background, golden hour, documentary style, navy and lime color mood`

**Placement:** Either full-bleed behind cards (with overlay) or a contained zone within the slide layout. Never as a tiny thumbnail.

**⚠ Avoid:** Generic stock-photo vibes (white-background headshots, handshake photos, the businessman-at-laptop pose). Prompt for specificity and action.

---

### 4. Data / Abstract Visualization
**What it is:** Visual representations of concepts, flows, or systems — not charts (those are built as shapes), but conceptual or stylized graphics.

**When to use:**
- "Business Model" slides — flows and diagrams
- "Market Map" slides — landscape overviews
- "Technical Architecture" slides — system diagrams

**Prompt formula:**
`[concept] visualized as a [type: network diagram / flow chart / system map], [style: flat vector / dark mode / blueprint], [brand colors], minimal and clean`

**Example:**
> `Solar energy distribution network visualized as a dark-mode system diagram, node connections glowing lime green on navy background, minimal and technical`

**Placement:** Takes up a panel — usually 50-60% of slide width. Sit it next to text, not behind it.

---

### 5. Spot Illustration
**What it is:** Small, purposeful icon-level illustrations. Used as visual punctuation, not as primary visuals.

**When to use:**
- Pillar/feature cards — one illustration per card to differentiate content
- Process steps — visual anchor for each step

**Prompt formula:**
`Simple [style: flat / line art / minimal] illustration of [concept], [brand accent color] on [background color], icon-style, clean`

**Example:**
> `Minimal line art illustration of a solar panel fence, lime green on dark navy, icon style, clean`

**Placement:** Small, ~0.8–1.5 inches square, inside a card at the top or left. Must not compete with the card's text.

---

### 6. Texture / Atmosphere
**What it is:** Non-representational images used purely for visual texture — gradients, bokeh, light leaks, material close-ups (metal, concrete, glass).

**When to use:**
- Dark slides needing depth — add a texture overlay rather than a flat bg
- Section dividers — full-bleed texture behind a single large headline
- Closing slides — can pair with a Scene image

**Prompt formula:**
`[material: concrete / metal mesh / carbon fiber / brushed steel] texture, [color mood], [lighting: high contrast / soft], macro photography, abstract`

**Example:**
> `Carbon fiber mesh texture close-up, dark navy tones with faint lime-green reflections, high contrast macro photography`

**Placement:** Always full-bleed (0,0,W,H) with a significant dark overlay. This is the *background* — it should not compete with text.

---

## Decision matrix: which type to use per slide

| Slide type                  | Primary image type        | Secondary (optional)    |
|-----------------------------|---------------------------|-------------------------|
| Cover                       | Scene / Environment       | Texture / Atmosphere    |
| Big Statement               | None — use ghost typography instead | —             |
| Stat tiles                  | None — data is the visual | —                       |
| The Problem                 | Scene / Environment       | —                       |
| Why Now                     | Data / Abstract Viz       | Scene                   |
| Our Solution                | Product / Object Shot     | —                       |
| Technology                  | Product / Object Shot     | Texture                 |
| Process / How It Works      | People / Human Context    | Spot Illustration       |
| Proof / Traction            | Scene or People           | —                       |
| Team                        | Monogram circles (NEVER AI faces) | —               |
| Market Potential            | Scene / Environment       | Data / Abstract Viz     |
| Business Model              | Data / Abstract Viz       | —                       |
| Financial Projections       | — (no image — data only)  | —                       |
| Closing / CTA               | None — brand color fill IS the visual | —           |
| Pillar/Feature cards (3-up) | Spot Illustration (per card) | —                    |

---

## Prompt construction rules

### Always include:
1. **Subject specificity** — not "a solar panel" but "bifacial solar panels integrated into a perimeter security fence at a rail station"
2. **Brand color mood** — include the dominant brand colors as a lighting/mood cue: "navy and lime green color mood", "warm amber lighting"
3. **Style keyword** — "photorealistic", "editorial photography", "documentary style", "minimal flat illustration"
4. **Viewpoint** — "aerial", "ground level", "close-up macro", "wide establishing shot"
5. **Atmosphere** — "golden hour", "dramatic directional sunlight", "cool overcast", "high contrast"

### Never use:
- Vague prompts: "a professional photo of solar energy"
- Stock-photo language: "business team meeting", "happy customer", "handshake"
- Generic contexts: "office", "computer screen", "city skyline" with no specifics
- Placeholder language: "image here", "insert photo"

---

## Subject-aware prompt table

For each project/topic, pre-determine the core image subjects before building slides. This maps the presentation's real-world domain to image generation vocabulary.

| Domain                          | Core subjects                                                   | Style recommendation          |
|---------------------------------|-----------------------------------------------------------------|-------------------------------|
| Clean energy / solar            | Solar panels, fencing, rail corridors, aerial infrastructure    | Documentary / editorial photo |
| SaaS / tech product             | App interfaces, data flows, abstract networks                   | Dark-mode illustration / scene|
| Healthcare / biotech            | Lab environments, medical devices, human impact                 | Documentary photo + spot illus|
| Real estate / construction      | Aerial site shots, architectural renders, materials             | Scene + product shot          |
| Consumer brand / retail         | Product still life, lifestyle scene, people using product       | Still life + people           |
| Finance / investment            | City skylines, data rooms, abstract financial flows             | Abstract viz + texture        |
| Education / HR                  | People learning, collaborative spaces, portraits                | People / human context        |
| Fashion / luxury                | Product still life, editorial scene, high-contrast textures     | Still life + texture          |
| Infrastructure / government     | Aerial maps, field operations, engineering documentation        | Scene + people                |
| Food / hospitality              | Still life (plated dishes), environment (restaurant/kitchen)    | Still life + scene            |

---

## Overlay rules (text legibility)

When an image sits behind text, always add an overlay layer. The overlay type depends on layout:

| Layout pattern                | Overlay type                          | Opacity guideline   |
|-------------------------------|---------------------------------------|---------------------|
| Full-bleed behind text panel  | OOXML gradient: solid dark → transparent | 80-100% on text side |
| Half panel (image left/right) | Hard-stop gradient at the column edge | 100% solid on text side |
| Card on top of full-bleed     | 10-15% white or dark tint on card bg | (glassmorphism effect) |
| Texture / atmosphere only     | Dark flat overlay over entire image   | 50-70% opacity      |

**OOXML gradient overlay formula (linear_left, for image on right half):**
```
stops: (0, "BG_COLOR", 100%) → (55%, "BG_COLOR", 78%) → (100%, "BG_COLOR", 4%)
angle: 0  (left to right)
```
Replace `BG_COLOR` with the slide's background hex (e.g. `0D1147` for Ella Solar dark slides).

---

## Number of images per slide

| Slide type            | Max images |
|-----------------------|------------|
| Cover                 | 1 (scene)  |
| Single-topic content  | 1          |
| 2-col layout          | 1 (one col)|
| 3-up cards            | 3 spot illustrations (one per card) OR 0 |
| Data-heavy            | 0          |
| Closing               | 1 (scene)  |

Never place two full-bleed images on the same slide. Spot illustrations in cards are the only exception to the "one image per slide" rule.

---

## When the user provides real photos

If the user uploads images:
1. Use them. Real photos always beat AI-generated ones for authenticity and score.
2. Apply the same overlay and placement rules above.
3. Crop to cover the zone (never letterbox/pillarbox).
4. Save filenames to the design spec notes for reference.
5. If the real photo conflicts with the brand palette (e.g. warm orange photo on a cold navy deck), add a brand-colored overlay at 20-30% opacity to unify the color temperature.

---

## Scoring impact

| Parameter      | Image contribution                                                    |
|----------------|-----------------------------------------------------------------------|
| Images score   | Directly driven by image presence, relevance, and quality             |
| Brand identity | Images using brand color mood lift this score                         |
| Overlapping    | Image placement with correct overlays prevents collision penalties    |
| Content hierarchy | Full-bleed images with overlays must not obscure text hierarchy   |

Placeholder rects score 0 on Images. Real or AI-generated images with correct subject, placement, and overlay score 7-10/10.
