# entropic-cli

Interactive scaffolding tool for the Entropic UI design system — generates production-grade themed CSS, optional HTML page scaffolds, and now full component-library kits.

## What it generates

1. **Themed CSS** — pick 1 of 5 color themes (Entropic, Neon Cherry, Neon Jungle, Cobalt, Solarstorm) × 1 of 3 style variants (Liquid, Brutalist Glass, Neo-Minimal). Outputs a full 50+ token production stylesheet with light/dark mode built in.
2. **HTML page scaffold** (optional) — Landing, Dashboard, or Auth page pre-wired with orb/grid background layers and the generated stylesheet linked.
3. **Component library kit** (optional, new in v0.2.0):
   - **Neumorphic Kit** — soft-UI components (nav, cards, forms, controls, loaders, etc.) across all 6 Entropic themes.
   - **Skeu + Neu Kit** — two full palettes side by side: *Freshmen* (skeuomorphic paper/chrome) and *Ember* (neumorphic dark graphite), 20+ components each.

## Install

No npm registry package yet — run it straight from this folder.

```bash
cd entropycli
npm install
```

Then either run it directly:

```bash
node cli.js
```

Or link it so `entropic-cli` works as a global command anywhere on your machine:

```bash
npm link
entropic-cli
```

(`npm unlink -g entropic-cli` to remove it later.)

## Usage

Just run `entropic-cli` (or `node cli.js`) and answer the prompts:

1. Pick a **theme** (color palette)
2. Pick a **style variant** (Liquid / Brutalist / Neo-Minimal)
3. Choose whether to generate an **HTML scaffold page** (and which type)
4. Choose whether to include a **component library kit** (None / Neumorphic / Skeu+Neu)
5. Pick an **output directory**

The CLI writes the CSS file, optional scaffold HTML, and optional component kit HTML directly into that directory, and prints exact `<link>` tags to drop into your project.

## Notes

- Component kits are static, hand-built reference files shipped in `/components` — the CLI copies them rather than generating them, since they're curated implementations, not templated output.
- If you pick the **Liquid** style variant, you'll also need `liquid-rain.js` (the dependency-free canvas rain engine) from the Entropic UI repo — the CLI reminds you of this in its final output.
