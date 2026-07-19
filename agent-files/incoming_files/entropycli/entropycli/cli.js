#!/usr/bin/env node

/**
 * ENTROPIC UI v2.0 — CLI Installer
 * Generates production-grade CSS + optional HTML scaffold + component kits
 * Version: 0.2.0
 */

import { intro, outro, select, spinner, text, confirm, note } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ═══════════════════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════════════════ */
const THEMES = {
  entropic: {
    label: 'Entropic',
    hint: 'Green / Purple / Amber',
    primary:       '#03ff6c',
    primaryLt:     '#7cfc19',
    primaryDk:     '#00cc55',
    accent1:       '#7cfc19',
    accent2:       '#ffa805',
    accent3:       '#5b0af2',
    gradText:      'linear-gradient(135deg, #03ff6c 0%, #7cfc19 40%, #c4fc19 70%, #ffa805 100%)',
    darkBg:        '#000000',
    darkSurface:   '#0a0a0a',
    darkSurface2:  '#111111',
    lightBg:       '#f0faf4',
    lightSurface:  '#ffffff',
    lightSurface2: '#e4f5eb',
    gridColor:     'rgba(3,255,108,0.035)',
    navRim:        'rgba(3,255,108,0.5)',
    btnBorder:     'rgba(3,255,108,0.45)',
    btnBg:         'rgba(3,255,108,0.08)',
    btnGlow:       'rgba(3,255,108,0.28)',
    orb1:          'rgba(3,255,108,0.20)',
    orb2:          'rgba(91,10,242,0.24)',
    orb3:          'rgba(255,168,5,0.14)',
    orb4:          'rgba(196,252,25,0.12)',
    btnText:       '#000000',
    selection:     'rgba(3,255,108,0.25)',
  },
  cherry: {
    label: 'Neon Cherry',
    hint: 'Hot Pink / Mango / Aqua',
    primary:       '#ff0066',
    primaryLt:     '#ff4488',
    primaryDk:     '#cc0055',
    accent1:       '#ff8c00',
    accent2:       '#00ffaa',
    accent3:       '#ff44aa',
    gradText:      'linear-gradient(135deg, #ff0066 0%, #ff4488 30%, #ff8c00 70%, #ffb300 100%)',
    darkBg:        '#000000',
    darkSurface:   '#0a0005',
    darkSurface2:  '#110008',
    lightBg:       '#fff0f5',
    lightSurface:  '#ffffff',
    lightSurface2: '#ffe0ec',
    gridColor:     'rgba(255,0,102,0.035)',
    navRim:        'rgba(255,0,102,0.6)',
    btnBorder:     'rgba(255,0,102,0.5)',
    btnBg:         'rgba(255,0,102,0.09)',
    btnGlow:       'rgba(255,0,102,0.30)',
    orb1:          'rgba(255,0,102,0.22)',
    orb2:          'rgba(255,140,0,0.18)',
    orb3:          'rgba(0,255,170,0.14)',
    orb4:          'rgba(255,68,136,0.12)',
    btnText:       '#ffffff',
    selection:     'rgba(255,0,102,0.25)',
  },
  jungle: {
    label: 'Neon Jungle',
    hint: 'Yellow-Green / Aqua / Crimson',
    primary:       '#aaff00',
    primaryLt:     '#ccff44',
    primaryDk:     '#88cc00',
    accent1:       '#00e066',
    accent2:       '#00ffcc',
    accent3:       '#f71e5b',
    gradText:      'linear-gradient(135deg, #aaff00 0%, #66ff33 45%, #00ffcc 80%, #00e0aa 100%)',
    darkBg:        '#000000',
    darkSurface:   '#030a00',
    darkSurface2:  '#071200',
    lightBg:       '#f4fff0',
    lightSurface:  '#ffffff',
    lightSurface2: '#e4ffe0',
    gridColor:     'rgba(170,255,0,0.035)',
    navRim:        'rgba(170,255,0,0.55)',
    btnBorder:     'rgba(170,255,0,0.45)',
    btnBg:         'rgba(170,255,0,0.08)',
    btnGlow:       'rgba(170,255,0,0.25)',
    orb1:          'rgba(170,255,0,0.18)',
    orb2:          'rgba(247,30,91,0.22)',
    orb3:          'rgba(0,255,204,0.15)',
    orb4:          'rgba(0,224,102,0.13)',
    btnText:       '#000000',
    selection:     'rgba(170,255,0,0.25)',
  },
  cobalt: {
    label: 'Cobalt',
    hint: 'Electric Blue / Yellow / Red',
    primary:       '#0088ff',
    primaryLt:     '#44aaff',
    primaryDk:     '#0055cc',
    accent1:       '#ffdd00',
    accent2:       '#ff2200',
    accent3:       '#8800ff',
    gradText:      'linear-gradient(135deg, #0066ff 0%, #3344ff 35%, #6633ff 65%, #8800cc 88%, #0099ff 100%)',
    darkBg:        '#050810',
    darkSurface:   '#0a0f1e',
    darkSurface2:  '#0f1628',
    lightBg:       '#f0f4ff',
    lightSurface:  '#ffffff',
    lightSurface2: '#e0eaff',
    gridColor:     'rgba(0,136,255,0.04)',
    navRim:        'rgba(0,136,255,0.6)',
    btnBorder:     'rgba(0,136,255,0.45)',
    btnBg:         'rgba(0,136,255,0.09)',
    btnGlow:       'rgba(0,136,255,0.28)',
    orb1:          'rgba(0,102,255,0.26)',
    orb2:          'rgba(136,0,255,0.22)',
    orb3:          'rgba(0,153,255,0.16)',
    orb4:          'rgba(102,51,255,0.18)',
    btnText:       '#ffffff',
    selection:     'rgba(0,136,255,0.25)',
  },
  solar: {
    label: 'SolarStorm',
    hint: 'Electric Yellow / White / Black',
    primary:       '#fbff03',
    primaryLt:     '#ffff55',
    primaryDk:     '#cccc00',
    accent1:       '#e2ff03',
    accent2:       '#ffffff',
    accent3:       '#33332f',
    gradText:      'linear-gradient(135deg, #fbff03 0%, #e2ff03 50%, #ffffff 100%)',
    darkBg:        '#000000',
    darkSurface:   '#0a0a00',
    darkSurface2:  '#111100',
    lightBg:       '#fffff0',
    lightSurface:  '#ffffff',
    lightSurface2: '#ffffd0',
    gridColor:     'rgba(251,255,3,0.07)',
    navRim:        'rgba(251,255,3,0.7)',
    btnBorder:     'rgba(251,255,3,0.6)',
    btnBg:         'rgba(251,255,3,0.10)',
    btnGlow:       'rgba(251,255,3,0.30)',
    orb1:          'rgba(251,255,3,0.18)',
    orb2:          'rgba(226,255,3,0.14)',
    orb3:          'rgba(234,255,6,0.5)',
    orb4:          'rgba(251,255,3,0.10)',
    btnText:       '#000000',
    selection:     'rgba(251,255,3,0.30)',
  },
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT KITS
   Static, self-contained HTML component libraries shipped alongside
   the CLI in /components. These are copied (not generated) into the
   output directory since they're hand-built reference implementations.
═══════════════════════════════════════════════════════════════ */
const COMPONENT_KITS = {
  none: {
    label: 'None',
    hint: 'Skip component kit',
  },
  neumorphic: {
    label: 'Neumorphic Kit',
    hint: 'Soft-UI components across all 6 Entropic themes',
    source: 'neumorphic-kit.html',
    output: 'entropic-neumorphic-kit.html',
  },
  skeuneu: {
    label: 'Skeu + Neu Kit (Freshmen / Ember)',
    hint: 'Skeuomorphic paper palette + Neumorphic graphite palette, 20+ components each',
    source: 'skeu-neu-kit.html',
    output: 'entropic-skeu-neu-kit.html',
  },
};

/* ═══════════════════════════════════════════════════════════════
   VARIANT TOKENS
═══════════════════════════════════════════════════════════════ */
const VARIANTS = {
  liquid: {
    label: 'Liquid',
    hint: 'Deep blur, floating orbs, heavy rims, max immersion.',
    glassBlur:       'blur(28px) saturate(200%) brightness(112%)',
    glassBg:         'rgba(255,255,255,0.04)',
    glassBgLight:    'rgba(255,255,255,0.55)',
    glassBorder:     '1px solid rgba(255,255,255,0.08)',
    glassBorderLight:'1px solid rgba(255,255,255,0.60)',
    glassRadius:     '20px',
    glassShadow:     '0 24px 48px rgba(0,0,0,0.5)',
    glassShadowLight:'0 8px 32px rgba(0,0,0,0.12)',
    glassShadowHover:'0 32px 64px rgba(0,0,0,0.65)',
    rimOpacity:      '0.28',
    btnRadius:       '100px',
    hoverLift:       'translateY(-5px)',
    transition:      '0.22s ease',
    heroTracking:    '-0.04em',
    heroWeight:      '900',
    bodyWeight:      '400',
    sectionPad:      '100px',
    gridSize:        '80px',
    gridOpacity:     '0.04',
    bodyFont:        "'Inter', system-ui, sans-serif",
    displayFont:     "'Inter', system-ui, sans-serif",
    navBg:           'rgba(0,0,0,0.55)',
    navBgLight:      'rgba(255,255,255,0.60)',
    fontsUrl:        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  },
  brutal: {
    label: 'Brutalist Glass',
    hint: 'Sharp geometry, grid overlays, Orbitron headings.',
    glassBlur:       'blur(8px) saturate(140%)',
    glassBg:         'rgba(255,255,255,0.03)',
    glassBgLight:    'rgba(255,255,255,0.55)',
    glassBorder:     '2px solid rgba(255,255,255,0.22)',
    glassBorderLight:'2px solid rgba(0,0,0,0.15)',
    glassRadius:     '4px',
    glassShadow:     '4px 4px 0 rgba(255,255,255,0.15)',
    glassShadowLight:'4px 4px 0 rgba(0,0,0,0.10)',
    glassShadowHover:'6px 6px 0 rgba(255,255,255,0.25)',
    rimOpacity:      '0.10',
    btnRadius:       '2px',
    hoverLift:       'translateY(0)',
    transition:      '0.08s ease',
    heroTracking:    '0em',
    heroWeight:      '800',
    bodyWeight:      '400',
    sectionPad:      '56px',
    gridSize:        '40px',
    gridOpacity:     '0.07',
    bodyFont:        "'JetBrains Mono', monospace",
    displayFont:     "'Orbitron', monospace",
    navBg:           'rgba(0,0,0,0.80)',
    navBgLight:      'rgba(255,255,255,0.90)',
    fontsUrl:        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
  minimal: {
    label: 'Neo-Minimal',
    hint: 'Invisible at rest, reveals on hover, max whitespace.',
    glassBlur:       'blur(16px) saturate(160%)',
    glassBg:         'rgba(255,255,255,0)',
    glassBgLight:    'rgba(255,255,255,0)',
    glassBorder:     '1px solid rgba(255,255,255,0)',
    glassBorderLight:'1px solid rgba(0,0,0,0)',
    glassRadius:     '12px',
    glassShadow:     'none',
    glassShadowLight:'none',
    glassShadowHover:'0 8px 24px rgba(0,0,0,0.3)',
    rimOpacity:      '0.0',
    btnRadius:       '8px',
    hoverLift:       'translateY(0)',
    transition:      '0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
    heroTracking:    '-0.05em',
    heroWeight:      '900',
    bodyWeight:      '300',
    sectionPad:      '160px',
    gridSize:        '80px',
    gridOpacity:     '0',
    bodyFont:        "'Inter', system-ui, sans-serif",
    displayFont:     "'Inter', system-ui, sans-serif",
    navBg:           'rgba(0,0,0,0.30)',
    navBgLight:      'rgba(255,255,255,0.40)',
    fontsUrl:        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  },
};

/* ═══════════════════════════════════════════════════════════════
   CSS GENERATOR — Full Production Token Set
═══════════════════════════════════════════════════════════════ */
function generateCSS(themeName, variantName) {
  const t = THEMES[themeName];
  const v = VARIANTS[variantName];
  const isBrutal  = variantName === 'brutal';
  const isMinimal = variantName === 'minimal';
  const isLiquid  = variantName === 'liquid';

  return `/* ============================================================
   ENTROPIC UI v2.0
   Theme   : ${t.label.toUpperCase()}
   Variant : ${v.label.toUpperCase()}
   Generated by Entropic CLI v0.1.0
   ============================================================ */

/* ── Google Fonts ──────────────────────────────────────────── */
@import url('${v.fontsUrl}');

/* ══════════════════════════════════════════
   DARK MODE  (default / .theme-dark)
══════════════════════════════════════════ */
:root,
.theme-dark {
  /* Palette */
  --primary:            ${t.primary};
  --primary-lt:         ${t.primaryLt};
  --primary-dk:         ${t.primaryDk};
  --accent1:            ${t.accent1};
  --accent2:            ${t.accent2};
  --accent3:            ${t.accent3};
  --grad-text:          ${t.gradText};

  /* Surfaces */
  --bg:                 ${t.darkBg};
  --surface:            ${t.darkSurface};
  --surface2:           ${t.darkSurface2};
  --text:               rgba(255,255,255,0.88);
  --text-dim:           rgba(255,255,255,0.38);
  --border:             rgba(255,255,255,0.08);
  --border2:            rgba(255,255,255,0.04);

  /* Primary tints */
  --primary-tint:       color-mix(in srgb, ${t.primary} 10%, transparent);
  --primary-border:     color-mix(in srgb, ${t.primary} 28%, transparent);
  --primary-rim:        color-mix(in srgb, ${t.primary} 55%, transparent);

  /* Orbs */
  --orb1:               ${t.orb1};
  --orb2:               ${t.orb2};
  --orb3:               ${t.orb3};
  --orb4:               ${t.orb4};

  /* Grid */
  --grid-color:         ${t.gridColor};
  --grid-size:          ${v.gridSize};
  --grid-opacity:       ${v.gridOpacity};

  /* Glass */
  --glass-blur:         ${v.glassBlur};
  --glass-bg:           ${v.glassBg};
  --glass-border:       ${v.glassBorder};
  --glass-radius:       ${v.glassRadius};
  --glass-shadow:       ${v.glassShadow};
  --glass-shadow-hover: ${v.glassShadowHover};
  --rim-opacity:        ${v.rimOpacity};

  /* Nav */
  --nav-bg:             ${v.navBg};
  --nav-rim:            ${t.navRim};

  /* Buttons */
  --btn-radius:         ${v.btnRadius};
  --btn-border:         ${t.btnBorder};
  --btn-bg:             ${t.btnBg};
  --btn-bg-hover:       color-mix(in srgb, ${t.primary} 20%, transparent);
  --btn-glow-shadow:    0 0 24px ${t.btnGlow};
  --btn-text:           ${t.btnText};

  /* Typography */
  --body-font:          ${v.bodyFont};
  --display-font:       ${v.displayFont};
  --hero-tracking:      ${v.heroTracking};
  --hero-weight:        ${v.heroWeight};
  --body-weight:        ${v.bodyWeight};

  /* Layout */
  --section-pad:        ${v.sectionPad};
  --hover-lift:         ${v.hoverLift};
  --transition:         ${v.transition};
}

/* ══════════════════════════════════════════
   LIGHT MODE  (.theme-light)
══════════════════════════════════════════ */
.theme-light {
  --bg:                 ${t.lightBg};
  --surface:            ${t.lightSurface};
  --surface2:           ${t.lightSurface2};
  --text:               rgba(0,10,30,0.88);
  --text-dim:           rgba(0,10,30,0.45);
  --border:             rgba(0,0,0,0.09);
  --border2:            rgba(0,0,0,0.04);

  --primary-tint:       color-mix(in srgb, ${t.primaryDk} 10%, transparent);
  --primary-border:     color-mix(in srgb, ${t.primaryDk} 28%, transparent);
  --primary-rim:        color-mix(in srgb, ${t.primaryDk} 45%, transparent);

  --glass-bg:           ${v.glassBgLight};
  --glass-border:       ${v.glassBorderLight};
  --glass-shadow:       ${v.glassShadowLight};
  --nav-bg:             ${v.navBgLight};

  --btn-border:         color-mix(in srgb, ${t.primaryDk} 40%, transparent);
  --btn-bg:             color-mix(in srgb, ${t.primaryDk} 9%, transparent);
  --btn-bg-hover:       color-mix(in srgb, ${t.primaryDk} 18%, transparent);
}

/* ══════════════════════════════════════════
   RESET + BASE
══════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--body-font);
  font-weight: var(--body-weight);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background var(--transition), color var(--transition);
}
::selection { background: ${t.selection}; color: #fff; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ── Typography ── */
h1,h2,h3,h4,h5,h6 {
  font-family: var(--display-font, var(--body-font));
  color: var(--text);
  line-height: 1.1;
  letter-spacing: var(--hero-tracking);
  font-weight: var(--hero-weight);
}
p { line-height: 1.7; color: var(--text-dim); }
a { color: var(--primary); text-decoration: none; transition: color var(--transition); }
a:hover { color: var(--primary-lt); }

/* ── Gradient text ── */
.grad-text {
  background: var(--grad-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Background grid ── */
.entropic-grid {
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  opacity: var(--grid-opacity);
}

/* ── Glass ── */
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
  transition: box-shadow var(--transition), transform var(--transition), background var(--transition);
}
${isLiquid ? `
/* Specular rim — mandatory on Liquid */
.glass::before {
  content: '';
  position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255,255,255,var(--rim-opacity)),
    var(--primary-rim),
    rgba(255,255,255,var(--rim-opacity)),
    transparent
  );
  pointer-events: none;
}
.glass:hover {
  transform: var(--hover-lift);
  box-shadow: var(--glass-shadow-hover), 0 0 44px var(--primary-tint);
}` : ''}
${isBrutal ? `
/* Brutalist — no transform, instant color on hover */
.glass:hover {
  border-color: var(--primary-border);
  box-shadow: var(--glass-shadow-hover);
}` : ''}
${isMinimal ? `
/* Minimal — invisible at rest, reveals on hover */
.glass {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-color: transparent;
  box-shadow: none;
}
.glass:hover {
  background: var(--glass-bg, rgba(255,255,255,0.04));
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-color: var(--border);
  box-shadow: var(--glass-shadow-hover);
}` : ''}

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 28px;
  border-radius: var(--btn-radius);
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  font-family: var(--body-font); font-size: 14px; font-weight: 600;
  color: var(--primary); cursor: pointer; letter-spacing: 0.02em;
  transition: all var(--transition); text-decoration: none;
  ${isBrutal ? 'backdrop-filter: none;' : 'backdrop-filter: blur(24px) saturate(180%);'}
}
.btn:hover {
  background: var(--btn-bg-hover);
  ${isBrutal ? `color: #000; background: var(--primary); border-color: var(--primary);` : `box-shadow: var(--btn-glow-shadow); transform: var(--hover-lift);`}
}
.btn-ghost {
  border-color: var(--border);
  background: rgba(255,255,255,0.03);
  color: var(--text-dim);
}
.btn-ghost:hover {
  border-color: rgba(255,255,255,0.25);
  color: var(--text);
  ${isBrutal ? 'background: rgba(255,255,255,0.06);' : ''}
}
${themeName === 'solar' ? `
/* SolarStorm — button text always black */
.btn { color: #000 !important; font-weight: 800; }` : ''}

/* ── Badge ── */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 14px 4px 10px;
  border-radius: var(--btn-radius);
  border: 1px solid var(--primary-border);
  background: var(--primary-tint);
  backdrop-filter: blur(16px);
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--primary);
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary); box-shadow: 0 0 8px var(--primary);
  animation: entropic-pulse 2s infinite;
}

/* ── Nav ── */
.nav {
  position: sticky; top: 0; z-index: 200;
  height: 60px; padding: 0 clamp(16px,4vw,48px);
  display: flex; align-items: center; justify-content: space-between;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.nav-rim {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), var(--nav-rim), rgba(255,255,255,0.15), transparent);
  pointer-events: none;
}

/* ── Section ── */
.section {
  padding: var(--section-pad) clamp(16px,5vw,80px);
  max-width: 1200px;
  margin: 0 auto;
}
.section-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--primary); margin-bottom: 10px;
}
.section-title {
  font-size: clamp(24px,4vw,48px); font-weight: 800;
  letter-spacing: var(--hero-tracking); color: var(--text); margin-bottom: 16px;
}
.section-sub {
  font-size: clamp(14px,1.8vw,17px); color: var(--text-dim);
  line-height: 1.7; max-width: 540px;
}

/* ── Grids ── */
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 18px; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 18px; }
.grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 18px; }

/* ── Orb ── */
.orb {
  position: fixed; border-radius: 50%;
  pointer-events: none; will-change: transform; z-index: 0;
}
${isLiquid ? `
.orb { animation-play-state: running; }
@keyframes entropic-drift1 {
  0%   { transform: translate(0,0) scale(1); }
  33%  { transform: translate(4vw,6vh) scale(1.05); }
  66%  { transform: translate(-3vw,10vh) scale(0.97); }
  100% { transform: translate(0,0) scale(1); }
}
@keyframes entropic-drift2 {
  0%   { transform: translate(0,0) scale(1); }
  40%  { transform: translate(-5vw,-4vh) scale(1.08); }
  70%  { transform: translate(3vw,6vh) scale(0.95); }
  100% { transform: translate(0,0) scale(1); }
}
@keyframes entropic-drift3 {
  0%   { transform: translate(0,0); }
  50%  { transform: translate(6vw,-8vh); }
  100% { transform: translate(0,0); }
}
@keyframes entropic-drift4 {
  0%   { transform: translate(0,0) rotate(0deg); }
  50%  { transform: translate(-4vw,5vh) rotate(180deg); }
  100% { transform: translate(0,0) rotate(360deg); }
}
.orb-1 { animation: entropic-drift1 20s ease-in-out infinite; }
.orb-2 { animation: entropic-drift2 26s ease-in-out infinite; }
.orb-3 { animation: entropic-drift3 18s ease-in-out infinite; }
.orb-4 { animation: entropic-drift4 14s ease-in-out infinite; }` : `
/* Brutalist/Minimal — orbs static */
.orb { animation: none; }`}

/* ── Divider ── */
.divider { height: 1px; background: var(--border); margin: calc(var(--section-pad) / 2) 0; }

/* ── Noise overlay ── */
.noise {
  position: fixed; inset: 0; z-index: 4; opacity: 0.28; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* ── Rain wrap (Liquid only) ── */
#rain-wrap {
  position: fixed; inset: 0; z-index: 1;
  opacity: 0; transition: opacity 1s ease; pointer-events: none;
}
#rain-wrap.active { opacity: 1; }

/* ── Reveal (Minimal scroll animation) ── */
.reveal {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s var(--transition), transform 0.7s var(--transition);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── Animations ── */
@keyframes entropic-pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
@keyframes entropic-shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes entropic-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .orb, .badge-dot { animation: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  #rain-wrap { display: none !important; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .nav { padding: 0 16px; }
}
`;
}

/* ═══════════════════════════════════════════════════════════════
   HTML SCAFFOLD GENERATOR
═══════════════════════════════════════════════════════════════ */
const PAGE_TEMPLATES = {
  landing: (t, v, themeName, variantName, cssFile) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landing — Entropic UI ${t.label} × ${v.label}</title>
  <link rel="stylesheet" href="${cssFile}" />
  ${variantName === 'liquid' ? '<script src="liquid-rain.js" defer></script>' : ''}
</head>
<body>

  <!-- Background layer -->
  <div id="bg" style="position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;">
    ${variantName === 'liquid' ? '<div id="rain-wrap"></div>' : ''}
    <div class="orb" style="width:700px;height:700px;background:radial-gradient(circle,var(--orb1) 0%,transparent 70%);filter:blur(54px);top:-10%;left:-8%;"></div>
    <div class="orb" style="width:800px;height:800px;background:radial-gradient(circle,var(--orb2) 0%,transparent 70%);filter:blur(66px);top:20%;right:-15%;"></div>
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,var(--orb3) 0%,transparent 70%);filter:blur(44px);bottom:5%;left:20%;"></div>
    <div class="noise"></div>
  </div>

  <!-- Nav -->
  <nav class="nav" style="position:fixed;top:0;left:0;right:0;">
    <div class="nav-rim"></div>
    <a href="#" style="font-family:var(--display-font);font-weight:800;font-size:17px;color:#fff;text-decoration:none;">
      Your<span style="color:var(--primary);">Brand</span>
    </a>
    <div style="display:flex;gap:8px;align-items:center;">
      <a href="#features" style="color:var(--text-dim);font-size:13px;font-weight:600;padding:6px 12px;border-radius:var(--btn-radius);transition:color var(--transition);">Features</a>
      <a href="#pricing" style="color:var(--text-dim);font-size:13px;font-weight:600;padding:6px 12px;border-radius:var(--btn-radius);transition:color var(--transition);">Pricing</a>
      <a href="#" class="btn" style="padding:8px 20px;font-size:13px;">Get Started</a>
    </div>
  </nav>

  <!-- Hero -->
  <main style="position:relative;z-index:10;">
    <section style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px clamp(16px,5vw,80px) 80px;text-align:center;">
      <span class="badge" style="margin-bottom:28px;">
        <span class="badge-dot"></span>
        NOW AVAILABLE
      </span>
      <h1 style="font-size:clamp(44px,9vw,110px);font-weight:var(--hero-weight);line-height:0.95;letter-spacing:var(--hero-tracking);margin-bottom:24px;max-width:900px;">
        Built on
        <span class="grad-text">Glass.</span>
      </h1>
      <p style="font-size:clamp(15px,2vw,19px);color:var(--text-dim);max-width:520px;line-height:1.7;margin-bottom:44px;">
        Your tagline goes here. Make it sharp, make it matter.
        Dark-first, glass-layered, motion-driven.
      </p>
      <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;">
        <a href="#" class="btn">Start Building</a>
        <a href="#" class="btn btn-ghost">View Docs</a>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="section">
      <div style="text-align:center;margin-bottom:48px;">
        <p class="section-eyebrow">Features</p>
        <h2 class="section-title">Everything you need</h2>
        <p class="section-sub" style="margin:0 auto;">Three sentences about your product that make someone want to sign up immediately.</p>
      </div>
      <div class="grid-3">
        <div class="glass" style="padding:32px 28px;">
          <div style="font-size:28px;margin-bottom:16px;">⚡</div>
          <h3 style="font-size:18px;margin-bottom:10px;">Feature One</h3>
          <p>Description of this feature and why it matters to your users.</p>
        </div>
        <div class="glass" style="padding:32px 28px;">
          <div style="font-size:28px;margin-bottom:16px;">🔮</div>
          <h3 style="font-size:18px;margin-bottom:10px;">Feature Two</h3>
          <p>Description of this feature and why it matters to your users.</p>
        </div>
        <div class="glass" style="padding:32px 28px;">
          <div style="font-size:28px;margin-bottom:16px;">🚀</div>
          <h3 style="font-size:18px;margin-bottom:10px;">Feature Three</h3>
          <p>Description of this feature and why it matters to your users.</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="section">
      <div style="text-align:center;margin-bottom:48px;">
        <p class="section-eyebrow">Pricing</p>
        <h2 class="section-title">Simple pricing</h2>
      </div>
      <div class="grid-2" style="max-width:700px;margin:0 auto;">
        <div class="glass" style="padding:40px 32px;">
          <p style="font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--text-dim);margin-bottom:8px;">STARTER</p>
          <div style="font-size:48px;font-weight:900;color:var(--text);margin-bottom:4px;">Free</div>
          <p style="margin-bottom:28px;">Perfect for side projects.</p>
          <a href="#" class="btn btn-ghost" style="width:100%;text-align:center;">Get Started</a>
        </div>
        <div class="glass" style="padding:40px 32px;border-color:var(--primary-border);">
          <p style="font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--primary);margin-bottom:8px;">PRO</p>
          <div style="font-size:48px;font-weight:900;color:var(--text);margin-bottom:4px;">$29<span style="font-size:18px;font-weight:400;color:var(--text-dim);">/mo</span></div>
          <p style="margin-bottom:28px;">For serious builders.</p>
          <a href="#" class="btn" style="width:100%;text-align:center;">Upgrade</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Mouse orb -->
  <div id="orb-mouse" style="width:340px;height:340px;background:radial-gradient(circle,rgba(255,255,255,.03) 0%,transparent 70%);filter:blur(50px);position:fixed;border-radius:50%;pointer-events:none;z-index:3;transition:left 1.3s cubic-bezier(.25,.46,.45,.94),top 1.3s cubic-bezier(.25,.46,.45,.94);"></div>
  <script>
    const mo = document.getElementById('orb-mouse');
    window.addEventListener('mousemove', e => {
      mo.style.left = (e.clientX - 170) + 'px';
      mo.style.top  = (e.clientY - 170) + 'px';
    }, { passive: true });
  </script>

</body>
</html>`,

  dashboard: (t, v, themeName, variantName, cssFile) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard — Entropic UI ${t.label} × ${v.label}</title>
  <link rel="stylesheet" href="${cssFile}" />
</head>
<body>
  <!-- Sidebar + Main layout -->
  <div style="display:flex;min-height:100vh;position:relative;z-index:10;">

    <!-- Background orbs -->
    <div style="position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;">
      <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,var(--orb1) 0%,transparent 70%);filter:blur(60px);top:-5%;left:-5%;"></div>
      <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,var(--orb2) 0%,transparent 70%);filter:blur(50px);bottom:10%;right:-5%;"></div>
      <div class="noise"></div>
    </div>

    <!-- Sidebar -->
    <aside class="glass" style="width:240px;min-height:100vh;padding:24px 16px;display:flex;flex-direction:column;gap:8px;position:sticky;top:0;z-index:10;border-radius:0;border-top:none;border-bottom:none;border-left:none;">
      <div style="padding:12px 16px;margin-bottom:16px;">
        <span style="font-family:var(--display-font);font-weight:800;font-size:17px;color:#fff;">Your<span style="color:var(--primary);">Brand</span></span>
      </div>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--glass-radius);background:var(--primary-tint);color:var(--primary);font-weight:600;font-size:13px;text-decoration:none;">📊 Dashboard</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--glass-radius);color:var(--text-dim);font-size:13px;text-decoration:none;transition:color var(--transition);">📁 Projects</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--glass-radius);color:var(--text-dim);font-size:13px;text-decoration:none;transition:color var(--transition);">⚙️ Settings</a>
    </aside>

    <!-- Main content -->
    <main style="flex:1;padding:40px clamp(16px,3vw,48px);position:relative;z-index:10;">
      <h1 style="font-size:clamp(28px,4vw,42px);margin-bottom:8px;">Good morning 👋</h1>
      <p style="margin-bottom:40px;">Here's what's happening today.</p>

      <!-- Stat cards -->
      <div class="grid-4" style="margin-bottom:40px;">
        <div class="glass" style="padding:24px;">
          <p style="font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--text-dim);margin-bottom:8px;">TOTAL USERS</p>
          <div style="font-size:36px;font-weight:900;color:var(--primary);">12.4k</div>
        </div>
        <div class="glass" style="padding:24px;">
          <p style="font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--text-dim);margin-bottom:8px;">REVENUE</p>
          <div style="font-size:36px;font-weight:900;color:var(--text);">$8.2k</div>
        </div>
        <div class="glass" style="padding:24px;">
          <p style="font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--text-dim);margin-bottom:8px;">ACTIVE NOW</p>
          <div style="font-size:36px;font-weight:900;color:var(--accent1);">342</div>
        </div>
        <div class="glass" style="padding:24px;">
          <p style="font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--text-dim);margin-bottom:8px;">UPTIME</p>
          <div style="font-size:36px;font-weight:900;color:var(--text);">99.9%</div>
        </div>
      </div>

      <!-- Table -->
      <div class="glass" style="padding:28px;">
        <h2 style="font-size:18px;margin-bottom:20px;">Recent Activity</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);">
              <th style="text-align:left;padding:10px 0;color:var(--text-dim);font-weight:600;">Event</th>
              <th style="text-align:left;padding:10px 0;color:var(--text-dim);font-weight:600;">User</th>
              <th style="text-align:right;padding:10px 0;color:var(--text-dim);font-weight:600;">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border2);">
              <td style="padding:12px 0;color:var(--text);">New signup</td>
              <td style="padding:12px 0;color:var(--text-dim);">user@example.com</td>
              <td style="padding:12px 0;color:var(--text-dim);text-align:right;">2m ago</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border2);">
              <td style="padding:12px 0;color:var(--text);">Payment received</td>
              <td style="padding:12px 0;color:var(--text-dim);">another@example.com</td>
              <td style="padding:12px 0;color:var(--text-dim);text-align:right;">14m ago</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:var(--text);">API key generated</td>
              <td style="padding:12px 0;color:var(--text-dim);">dev@example.com</td>
              <td style="padding:12px 0;color:var(--text-dim);text-align:right;">1h ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</body>
</html>`,

  auth: (t, v, themeName, variantName, cssFile) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign In — Entropic UI ${t.label} × ${v.label}</title>
  <link rel="stylesheet" href="${cssFile}" />
</head>
<body>
  <!-- Background -->
  <div style="position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;">
    <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,var(--orb1) 0%,transparent 70%);filter:blur(60px);top:-10%;right:-5%;"></div>
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,var(--orb2) 0%,transparent 70%);filter:blur(50px);bottom:-5%;left:-5%;"></div>
    <div class="noise"></div>
  </div>

  <!-- Auth card -->
  <main style="position:relative;z-index:10;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 16px;">
    <div class="glass" style="width:100%;max-width:420px;padding:48px 40px;">
      <div style="text-align:center;margin-bottom:36px;">
        <span style="font-family:var(--display-font);font-weight:800;font-size:22px;color:#fff;">Your<span style="color:var(--primary);">Brand</span></span>
        <h1 style="font-size:26px;margin-top:24px;margin-bottom:8px;">Welcome back</h1>
        <p style="font-size:14px;">Sign in to your account</p>
      </div>

      <form style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="display:block;font-size:12px;font-weight:600;letter-spacing:.05em;color:var(--text-dim);margin-bottom:6px;">EMAIL</label>
          <input type="email" placeholder="you@example.com" style="width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:var(--glass-radius);color:var(--text);font-size:14px;font-family:var(--body-font);outline:none;transition:border-color var(--transition);" onfocus="this.style.borderColor='var(--primary-border)'" onblur="this.style.borderColor='var(--border)'" />
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:600;letter-spacing:.05em;color:var(--text-dim);margin-bottom:6px;">PASSWORD</label>
          <input type="password" placeholder="••••••••" style="width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:var(--glass-radius);color:var(--text);font-size:14px;font-family:var(--body-font);outline:none;transition:border-color var(--transition);" onfocus="this.style.borderColor='var(--primary-border)'" onblur="this.style.borderColor='var(--border)'" />
        </div>
        <button type="submit" class="btn" style="width:100%;margin-top:8px;padding:14px;font-size:15px;">Sign In</button>
        <button type="button" class="btn btn-ghost" style="width:100%;padding:14px;font-size:15px;">Continue with Google</button>
      </form>

      <p style="text-align:center;font-size:13px;margin-top:24px;">
        Don't have an account? <a href="#">Sign up</a>
      </p>
    </div>
  </main>
</body>
</html>`,
};

/* ═══════════════════════════════════════════════════════════════
   MAIN CLI
═══════════════════════════════════════════════════════════════ */
async function main() {
  console.clear();
  intro(pc.bgMagenta(pc.bold(' ⚡ ENTROPIC UI v2.0 — CLI INSTALLER ')));

  // Theme
  const themeKey = await select({
    message: pc.bold('Select your Core Theme (Color Palette):'),
    options: Object.entries(THEMES).map(([k, t]) => ({
      value: k, label: t.label, hint: t.hint
    }))
  });
  if (themeKey === null || themeKey === Symbol.for('clack:cancel')) {
    console.log(pc.red('Cancelled.')); process.exit(0);
  }

  // Variant
  const variantKey = await select({
    message: pc.bold('Select your Style Variant (Form & Depth):'),
    options: Object.entries(VARIANTS).map(([k, v]) => ({
      value: k, label: v.label, hint: v.hint
    }))
  });
  if (variantKey === null || variantKey === Symbol.for('clack:cancel')) {
    console.log(pc.red('Cancelled.')); process.exit(0);
  }

  // Page scaffold?
  const wantScaffold = await confirm({
    message: 'Generate an HTML scaffold page?',
    initialValue: true,
  });

  let pageType = null;
  if (wantScaffold) {
    pageType = await select({
      message: 'Select page type:',
      options: [
        { value: 'landing',   label: 'Landing Page',  hint: 'Hero, features, pricing' },
        { value: 'dashboard', label: 'Dashboard',      hint: 'Sidebar, stat cards, table' },
        { value: 'auth',      label: 'Auth / Sign In', hint: 'Centered login form' },
      ]
    });
  }

  // Component kit?
  const kitKey = await select({
    message: pc.bold('Include a component library?'),
    options: Object.entries(COMPONENT_KITS).map(([k, kit]) => ({
      value: k, label: kit.label, hint: kit.hint
    }))
  });
  if (kitKey === null || kitKey === Symbol.for('clack:cancel')) {
    console.log(pc.red('Cancelled.')); process.exit(0);
  }

  // Output dir
  const outputDir = await text({
    message: 'Output directory:',
    placeholder: '.',
    defaultValue: '.',
  });
  if (outputDir === null || outputDir === Symbol.for('clack:cancel')) {
    console.log(pc.red('Cancelled.')); process.exit(0);
  }

  const t = THEMES[themeKey];
  const v = VARIANTS[variantKey];

  const s = spinner();
  s.start('Synthesizing stylesheet...');
  await new Promise(r => setTimeout(r, 600));

  const cssFile    = `${variantKey}-${themeKey}.css`;
  const cssPath    = path.join(process.cwd(), outputDir, cssFile);
  const cssContent = generateCSS(themeKey, variantKey);

  try {
    await fs.mkdir(path.join(process.cwd(), outputDir), { recursive: true });
    await fs.writeFile(cssPath, cssContent, 'utf8');
    s.stop(pc.green(`✓ ${cssFile}`));

    if (wantScaffold && pageType) {
      const s2 = spinner();
      s2.start(`Building ${pageType} scaffold...`);
      await new Promise(r => setTimeout(r, 400));

      const htmlFile    = `${pageType}-${variantKey}-${themeKey}.html`;
      const htmlPath    = path.join(process.cwd(), outputDir, htmlFile);
      const htmlContent = PAGE_TEMPLATES[pageType](t, v, themeKey, variantKey, cssFile);

      await fs.writeFile(htmlPath, htmlContent, 'utf8');
      s2.stop(pc.green(`✓ ${htmlFile}`));
    }

    let kitOutputPath = null;
    if (kitKey && kitKey !== 'none') {
      const kit = COMPONENT_KITS[kitKey];
      const s3 = spinner();
      s3.start(`Copying ${kit.label}...`);
      await new Promise(r => setTimeout(r, 300));

      const kitSourcePath = path.join(__dirname, 'components', kit.source);
      kitOutputPath = path.join(process.cwd(), outputDir, kit.output);

      await fs.copyFile(kitSourcePath, kitOutputPath);
      s3.stop(pc.green(`✓ ${kit.output}`));
    }

    note(
      [
        pc.bold('Theme:')   + '   ' + pc.cyan(t.label),
        pc.bold('Variant:') + ' ' + pc.cyan(v.label),
        '',
        pc.bold('Files written:'),
        pc.dim('  ' + path.relative(process.cwd(), cssPath)),
        wantScaffold && pageType
          ? pc.dim('  ' + path.join(outputDir, `${pageType}-${variantKey}-${themeKey}.html`))
          : '',
        kitOutputPath
          ? pc.dim('  ' + path.relative(process.cwd(), kitOutputPath))
          : '',
        '',
        pc.bold('HTML Integration:'),
        pc.dim(`  <link rel="stylesheet" href="${cssFile}">`),
        variantKey === 'liquid'
          ? pc.dim(`  <script src="liquid-rain.js" defer></script>`)
          : '',
        variantKey === 'liquid'
          ? pc.dim(`  Grab liquid-rain.js from the Entropic UI repo.`)
          : '',
      ].filter(Boolean).join('\n'),
      'Done'
    );

    outro(pc.bgGreen(pc.bold(pc.black(' Build something beautiful. '))));
  } catch (err) {
    s.stop(pc.red('Failed to write files'));
    console.error(err);
    process.exit(1);
  }
}

main().catch(console.error);
