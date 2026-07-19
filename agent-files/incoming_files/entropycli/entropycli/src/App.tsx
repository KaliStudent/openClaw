/**
 * Entropic CLI — Live Browser Preview
 * Interactive theme × variant selector with real-time CSS variable rendering
 */

import React, { useState, useEffect, useRef } from 'react';

/* ── Theme + Variant Data ───────────────────────────────────── */
const THEMES = {
  entropic: {
    label: 'Entropic',
    primary: '#03ff6c', primaryLt: '#7cfc19', primaryDk: '#00cc55',
    accent1: '#7cfc19', accent2: '#ffa805', accent3: '#5b0af2',
    gradText: 'linear-gradient(135deg, #03ff6c 0%, #7cfc19 40%, #c4fc19 70%, #ffa805 100%)',
    darkBg: '#000000', lightBg: '#f0faf4',
    orb1: 'rgba(3,255,108,0.22)', orb2: 'rgba(91,10,242,0.26)', orb3: 'rgba(255,168,5,0.16)',
    btnText: '#000000', selection: 'rgba(3,255,108,0.25)',
    gridColor: 'rgba(3,255,108,0.04)',
    navRim: 'rgba(3,255,108,0.6)',
    btnBorder: 'rgba(3,255,108,0.45)', btnBg: 'rgba(3,255,108,0.09)', btnGlow: 'rgba(3,255,108,0.28)',
  },
  cherry: {
    label: 'Neon Cherry',
    primary: '#ff0066', primaryLt: '#ff4488', primaryDk: '#cc0055',
    accent1: '#ff8c00', accent2: '#00ffaa', accent3: '#ff44aa',
    gradText: 'linear-gradient(135deg, #ff0066 0%, #ff4488 30%, #ff8c00 70%, #ffb300 100%)',
    darkBg: '#000000', lightBg: '#fff0f5',
    orb1: 'rgba(255,0,102,0.24)', orb2: 'rgba(255,140,0,0.20)', orb3: 'rgba(0,255,170,0.16)',
    btnText: '#ffffff', selection: 'rgba(255,0,102,0.25)',
    gridColor: 'rgba(255,0,102,0.04)',
    navRim: 'rgba(255,0,102,0.6)',
    btnBorder: 'rgba(255,0,102,0.5)', btnBg: 'rgba(255,0,102,0.09)', btnGlow: 'rgba(255,0,102,0.30)',
  },
  jungle: {
    label: 'Neon Jungle',
    primary: '#aaff00', primaryLt: '#ccff44', primaryDk: '#88cc00',
    accent1: '#00e066', accent2: '#00ffcc', accent3: '#f71e5b',
    gradText: 'linear-gradient(135deg, #aaff00 0%, #66ff33 45%, #00ffcc 80%, #00e0aa 100%)',
    darkBg: '#000000', lightBg: '#f4fff0',
    orb1: 'rgba(170,255,0,0.20)', orb2: 'rgba(247,30,91,0.24)', orb3: 'rgba(0,255,204,0.16)',
    btnText: '#000000', selection: 'rgba(170,255,0,0.25)',
    gridColor: 'rgba(170,255,0,0.04)',
    navRim: 'rgba(170,255,0,0.6)',
    btnBorder: 'rgba(170,255,0,0.45)', btnBg: 'rgba(170,255,0,0.09)', btnGlow: 'rgba(170,255,0,0.25)',
  },
  cobalt: {
    label: 'Cobalt',
    primary: '#0088ff', primaryLt: '#44aaff', primaryDk: '#0055cc',
    accent1: '#ffdd00', accent2: '#ff2200', accent3: '#8800ff',
    gradText: 'linear-gradient(135deg, #0066ff 0%, #3344ff 35%, #6633ff 65%, #8800cc 88%, #0099ff 100%)',
    darkBg: '#050810', lightBg: '#f0f4ff',
    orb1: 'rgba(0,102,255,0.26)', orb2: 'rgba(136,0,255,0.22)', orb3: 'rgba(0,153,255,0.18)',
    btnText: '#ffffff', selection: 'rgba(0,136,255,0.25)',
    gridColor: 'rgba(0,136,255,0.04)',
    navRim: 'rgba(0,136,255,0.6)',
    btnBorder: 'rgba(0,136,255,0.45)', btnBg: 'rgba(0,136,255,0.09)', btnGlow: 'rgba(0,136,255,0.28)',
  },
  solar: {
    label: 'SolarStorm',
    primary: '#fbff03', primaryLt: '#ffff55', primaryDk: '#cccc00',
    accent1: '#e2ff03', accent2: '#ffffff', accent3: '#33332f',
    gradText: 'linear-gradient(135deg, #fbff03 0%, #e2ff03 50%, #ffffff 100%)',
    darkBg: '#000000', lightBg: '#fffff0',
    orb1: 'rgba(251,255,3,0.20)', orb2: 'rgba(226,255,3,0.16)', orb3: 'rgba(234,255,6,0.50)',
    btnText: '#000000', selection: 'rgba(251,255,3,0.30)',
    gridColor: 'rgba(251,255,3,0.07)',
    navRim: 'rgba(251,255,3,0.7)',
    btnBorder: 'rgba(251,255,3,0.6)', btnBg: 'rgba(251,255,3,0.10)', btnGlow: 'rgba(251,255,3,0.30)',
  },
} as const;

const VARIANTS = {
  liquid:   { label: 'Liquid',          glassRadius: '20px',  btnRadius: '100px', blur: 'blur(28px) saturate(200%) brightness(112%)' },
  brutal:   { label: 'Brutalist Glass', glassRadius: '4px',   btnRadius: '2px',   blur: 'blur(8px) saturate(140%)' },
  minimal:  { label: 'Neo-Minimal',     glassRadius: '12px',  btnRadius: '8px',   blur: 'blur(16px) saturate(160%)' },
} as const;

type ThemeKey   = keyof typeof THEMES;
type VariantKey = keyof typeof VARIANTS;

/* ── Main App ───────────────────────────────────────────────── */
export default function App() {
  const [theme,     setTheme]     = useState<ThemeKey>('cobalt');
  const [variant,   setVariant]   = useState<VariantKey>('liquid');
  const [lightMode, setLightMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const t = THEMES[theme];
  const v = VARIANTS[variant];

  const bg      = lightMode ? t.lightBg : t.darkBg;
  const text     = lightMode ? 'rgba(0,10,30,0.88)'    : 'rgba(255,255,255,0.88)';
  const textDim  = lightMode ? 'rgba(0,10,30,0.45)'    : 'rgba(255,255,255,0.38)';
  const border   = lightMode ? 'rgba(0,0,0,0.10)'      : 'rgba(255,255,255,0.08)';
  const glassBg  = lightMode ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.04)';
  const glassBdr = lightMode
    ? (variant === 'brutal' ? '2px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.60)')
    : (variant === 'brutal' ? '2px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.08)');

  const isLiquid  = variant === 'liquid';
  const isBrutal  = variant === 'brutal';
  const isMinimal = variant === 'minimal';

  const glassStyle: React.CSSProperties = {
    background:       isMinimal ? 'transparent' : glassBg,
    backdropFilter:   isMinimal ? 'none' : v.blur,
    WebkitBackdropFilter: isMinimal ? 'none' : v.blur,
    border:           isMinimal ? '1px solid transparent' : glassBdr,
    borderRadius:     v.glassRadius,
    boxShadow:        isMinimal ? 'none' : lightMode
      ? (isBrutal ? '4px 4px 0 rgba(0,0,0,0.10)' : '0 8px 32px rgba(0,0,0,0.12)')
      : (isBrutal ? '4px 4px 0 rgba(255,255,255,0.15)' : '0 24px 48px rgba(0,0,0,0.5)'),
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.22s ease',
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px 24px',
    borderRadius: v.btnRadius,
    border: `1px solid ${t.btnBorder}`,
    background: t.btnBg,
    color: isBrutal ? t.btnText : t.primary,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.22s ease',
    backdropFilter: isBrutal ? 'none' : 'blur(24px)',
    fontFamily: isBrutal ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
    letterSpacing: '0.02em',
  };

  const bodyFont = isBrutal
    ? "'JetBrains Mono', monospace"
    : "'Inter', system-ui, sans-serif";

  // Grid overlay for brutalist
  const gridOverlay = isBrutal ? {
    backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    position: 'absolute' as const, inset: 0, opacity: 0.5, pointerEvents: 'none' as const, zIndex: 0,
  } : undefined;

  return (
    <div style={{ fontFamily: bodyFont, minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>

      {/* ── Control Panel ───────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        gap: 16, flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', color: '#fff', marginRight: 8 }}>
          ⚡ ENTROPIC CLI
        </span>

        {/* Theme selector */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
          {(Object.keys(THEMES) as ThemeKey[]).map(k => (
            <button key={k} onClick={() => setTheme(k)} style={{
              padding: '4px 10px', borderRadius: 7, border: `1px solid ${theme === k ? THEMES[k].primary : 'transparent'}`,
              background: theme === k ? `color-mix(in srgb, ${THEMES[k].primary} 18%, transparent)` : 'transparent',
              color: theme === k ? THEMES[k].primary : 'rgba(255,255,255,0.4)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}>{THEMES[k].label}</button>
          ))}
        </div>

        {/* Variant selector */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
          {(Object.keys(VARIANTS) as VariantKey[]).map(k => (
            <button key={k} onClick={() => setVariant(k)} style={{
              padding: '4px 10px', borderRadius: 7, border: `1px solid ${variant === k ? t.primary : 'transparent'}`,
              background: variant === k ? `color-mix(in srgb, ${t.primary} 18%, transparent)` : 'transparent',
              color: variant === k ? t.primary : 'rgba(255,255,255,0.4)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}>{VARIANTS[k].label}</button>
          ))}
        </div>

        {/* Light mode toggle */}
        <button onClick={() => setLightMode(m => !m)} style={{
          padding: '4px 12px', borderRadius: 7,
          border: `1px solid ${lightMode ? t.primary : 'rgba(255,255,255,0.15)'}`,
          background: lightMode ? `color-mix(in srgb, ${t.primary} 18%, transparent)` : 'transparent',
          color: lightMode ? t.primary : 'rgba(255,255,255,0.5)',
          fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}>{lightMode ? '☀️ Light' : '🌑 Dark'}</button>

        {/* Active combo badge */}
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
          {variant}-{theme}.css
        </div>
      </div>

      {/* ── Live Preview ─────────────────────────────── */}
      <div ref={previewRef} style={{
        paddingTop: 64, minHeight: '100vh',
        background: bg, transition: 'background 0.4s',
        fontFamily: bodyFont, color: text, position: 'relative', overflow: 'hidden',
      }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`, filter: 'blur(60px)', top: '-5%', left: '-5%', borderRadius: '50%', animation: isLiquid ? 'drift1 20s ease-in-out infinite' : 'none' }} />
          <div style={{ position: 'absolute', width: 700, height: 700, background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`, filter: 'blur(70px)', top: '20%', right: '-10%', borderRadius: '50%', animation: isLiquid ? 'drift2 26s ease-in-out infinite' : 'none' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, background: `radial-gradient(circle, ${t.orb3} 0%, transparent 70%)`, filter: 'blur(44px)', bottom: '10%', left: '30%', borderRadius: '50%', animation: isLiquid ? 'drift3 18s ease-in-out infinite' : 'none' }} />
          {isBrutal && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.6 }} />
          )}
        </div>

        {/* Nav preview */}
        <nav style={{
          position: 'sticky', top: 64, zIndex: 50,
          height: 56, padding: '0 clamp(16px,4vw,48px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          background: lightMode ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
          borderBottom: `1px solid ${border}`,
          transition: 'all 0.3s',
        }}>
          {/* Nav rim */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), ${t.navRim}, rgba(255,255,255,0.15), transparent)` }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: lightMode ? '#000' : '#fff' }}>
            Your<span style={{ color: t.primary }}>Brand</span>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: textDim, fontSize: 13, fontWeight: 600, padding: '6px 12px' }}>Features</span>
            <span style={{ color: textDim, fontSize: 13, fontWeight: 600, padding: '6px 12px' }}>Docs</span>
            <button style={btnStyle}>Get Started</button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ position: 'relative', zIndex: 10, padding: '80px clamp(16px,5vw,80px) 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px 5px 10px',
            borderRadius: v.btnRadius,
            border: `1px solid color-mix(in srgb, ${t.primary} 28%, transparent)`,
            background: `color-mix(in srgb, ${t.primary} 10%, transparent)`,
            backdropFilter: 'blur(16px)', fontSize: 11, color: t.primary, fontWeight: 700, letterSpacing: '0.08em',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.primary, boxShadow: `0 0 8px ${t.primary}`, animation: 'pulse 2s infinite' }} />
            ENTROPIC UI v2.0
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(44px,9vw,96px)', fontWeight: 900,
            lineHeight: 0.95, letterSpacing: '-0.04em',
            color: lightMode ? '#000' : '#fff', maxWidth: 800,
            fontFamily: isBrutal ? "'Orbitron', monospace" : bodyFont,
          }}>
            Built on{' '}
            <span style={{ background: t.gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: `drop-shadow(0 0 40px color-mix(in srgb, ${t.primary} 44%, transparent))` }}>
              Glass.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,19px)', color: textDim, maxWidth: 520, lineHeight: 1.7 }}>
            15 theme × variant combinations. Full CSS token set. Production-ready components. Dark-first, always.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={btnStyle}>Start Building</button>
            <button style={{ ...btnStyle, border: `1px solid ${border}`, background: 'rgba(255,255,255,0.03)', color: textDim }}>View Docs</button>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ position: 'relative', zIndex: 10, padding: '40px clamp(16px,5vw,80px) 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            {[
              { icon: '🎨', title: '5 Themes', sub: 'Entropic, Cherry, Jungle, Cobalt, SolarStorm' },
              { icon: '⚡', title: '3 Variants', sub: 'Liquid, Brutalist Glass, Neo-Minimal' },
              { icon: '🌗', title: 'Light + Dark', sub: 'Every combo ships with both modes built in' },
              { icon: '🧩', title: 'Full Token Set', sub: '50+ CSS custom properties per stylesheet' },
            ].map(card => (
              <div key={card.title} style={{ ...glassStyle, padding: '28px 24px', cursor: 'pointer' }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (isLiquid) { el.style.transform = 'translateY(-5px)'; el.style.boxShadow = `0 32px 64px rgba(0,0,0,0.65), 0 0 44px color-mix(in srgb, ${t.primary} 10%, transparent)`; }
                  if (isBrutal) { el.style.borderColor = t.btnBorder; }
                  if (isMinimal) {
                    el.style.background = glassBg;
                    el.style.backdropFilter = v.blur;
                    el.style.WebkitBackdropFilter = v.blur;
                    el.style.border = glassBdr;
                    el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'none';
                  el.style.boxShadow = isMinimal ? 'none' : glassStyle.boxShadow as string;
                  el.style.borderColor = '';
                  if (isMinimal) {
                    el.style.background = 'transparent';
                    el.style.backdropFilter = 'none';
                    el.style.WebkitBackdropFilter = 'none';
                    el.style.border = '1px solid transparent';
                  }
                }}
              >
                {/* Specular rim (Liquid only) */}
                {isLiquid && (
                  <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.28), ${t.primary}66, rgba(255,255,255,0.28), transparent)` }} />
                )}
                {isBrutal && gridOverlay && <div style={gridOverlay} />}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 26, marginBottom: 14 }}>{card.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: lightMode ? '#000' : '#fff', fontFamily: isBrutal ? "'Orbitron', monospace" : bodyFont }}>{card.title}</h3>
                  <p style={{ fontSize: 13, color: textDim, lineHeight: 1.6 }}>{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes drift1  { 0%{transform:translate(0,0)} 33%{transform:translate(4vw,6vh)} 66%{transform:translate(-3vw,10vh)} 100%{transform:translate(0,0)} }
        @keyframes drift2  { 0%{transform:translate(0,0)} 40%{transform:translate(-5vw,-4vh)} 70%{transform:translate(3vw,6vh)} 100%{transform:translate(0,0)} }
        @keyframes drift3  { 0%{transform:translate(0,0)} 50%{transform:translate(6vw,-8vh)} 100%{transform:translate(0,0)} }
      `}</style>
    </div>
  );
}
