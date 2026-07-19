import { useState, useEffect, useRef } from "react";
import { EmailSignup } from "@/api/entities";

// ============================================================
// CUSTOMIZE — Change these values to rebrand this page
// ============================================================
const CONFIG = {
  // Brand
  brandName:    "YourBrand",           // First word (plain)
  brandAccent:  "Domains",             // Second word (yellow accent)
  brandEmoji:   "◈",                   // Logo icon (emoji or replace with img)
  tagline:      "Your Domain. Your Hosting. Your Brand.",
  subtext:      "A fully white-labeled domain registrar and shared hosting platform — built for agencies and resellers who want their name on everything.",
  badgeText:    "LAUNCHING SOON",

  // Countdown target — April 20, 2026 midnight CT
  // Format: new Date("YYYY-MM-DDTHH:MM:SS")
  launchDate:   new Date("2026-04-20T00:00:00"),

  // Features
  features: [
    { icon: "◈", label: "White Label Domains",   desc: "Sell domain registrations under your own brand. Your logo, your prices, your customers — zero Entropic branding anywhere." },
    { icon: "⬡", label: "White Label Hosting",   desc: "Shared hosting plans fully rebranded as your own product. Custom control panel skin, your support contact, your billing." },
    { icon: "◉", label: "Reseller Ready",         desc: "Built from the ground up for agencies and resellers. Bulk pricing, client management, and margin control all built in." },
    { icon: "▣", label: "Custom Nameservers",     desc: "Point ns1.yourbrand.com and ns2.yourbrand.com at your infrastructure. Your customers never see anyone else's name." },
  ],

  // CTA / signup
  ctaHeadline:  "Be first in line.",
  ctaSubtext:   "Drop your email and we'll notify you the moment we go live. Early access, early pricing.",
  inputPlaceholder: "your@email.com",
  btnLabel:     "Notify Me →",
  successMsg:   "You're on the list. We'll hit you when we launch. 🔥",
};
// ============================================================

// SolarStorm Brutalist tokens
const S = {
  yellow:  "#fbff03",
  yellow2: "#e2ff03",
  white:   "#ffffff",
  dark:    "#33332f",
  black:   "#000000",
  grid:    "rgba(251,255,3,0.07)",
  border:  "rgba(251,255,3,0.18)",
  borderHi:"rgba(251,255,3,0.55)",
  dimText: "rgba(255,255,255,0.38)",
  mutedText:"rgba(255,255,255,0.22)",
};

// ── Countdown logic ─────────────────────────────────────────
function getTimeLeft(target) {
  const diff = target - Date.now();
  if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0, done:true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    done:    false,
  };
}

export default function App() {
  const [time, setTime]       = useState(getTimeLeft(CONFIG.launchDate));
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg]   = useState("");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const inputRef = useRef(null);

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(CONFIG.launchDate)), 1000);
    return () => clearInterval(id);
  }, []);

  // Mouse orb
  useEffect(() => {
    const h = e => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  async function handleSignup(e) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrMsg("Enter a valid email address."); return;
    }
    setStatus("loading"); setErrMsg("");
    try {
      await EmailSignup.create({ email: trimmed, source: "coming_soon", signed_up_at: new Date().toISOString() });
      setStatus("success");
    } catch (err) {
      setErrMsg("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", background: S.black, minHeight: "100vh", color: S.white, overflowX: "hidden", position: "relative" }}>

      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Orbs — static in brutalist */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,255,3,0.13) 0%, transparent 70%)", filter: "blur(90px)", top: "-200px", left: "-100px" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(226,255,3,0.09) 0%, transparent 70%)", filter: "blur(100px)", bottom: "-150px", right: "-80px" }} />
        {/* Mouse ghost */}
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,255,3,0.04) 0%, transparent 70%)", filter: "blur(60px)", left: `calc(${mousePos.x * 100}% - 150px)`, top: `calc(${mousePos.y * 100}% - 150px)`, transition: "left 1.4s cubic-bezier(.25,.46,.45,.94), top 1.4s cubic-bezier(.25,.46,.45,.94)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${S.grid} 1px, transparent 1px), linear-gradient(90deg, ${S.grid} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        {/* Noise */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
      </div>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 60, padding: "0 clamp(16px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.75)", borderBottom: `1px solid ${S.border}`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
        {/* Top rim */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(251,255,3,0.5), ${S.yellow}, rgba(251,255,3,0.5), transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 3, background: S.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: S.black, fontWeight: 900 }}>{CONFIG.brandEmoji}</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "0.02em" }}>
            {CONFIG.brandName}<span style={{ color: S.yellow }}>{CONFIG.brandAccent}</span>
          </span>
        </div>
        {/* Launch date badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", border: `1px solid ${S.border}`, borderRadius: 2, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: S.yellow }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: S.yellow, boxShadow: `0 0 8px ${S.yellow}`, animation: "pulse 2s infinite", display: "inline-block" }} />
          LAUNCH: APR 20, 2026
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", padding: "80px clamp(16px,5vw,80px) 60px" }}>

        {/* Badge */}
        <div style={{ marginTop: 40, marginBottom: 24, padding: "5px 16px", border: `1px solid ${S.yellow}`, borderRadius: 2, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: S.black, background: S.yellow }}>
          {CONFIG.badgeText}
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px,7vw,88px)", fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1.0, textAlign: "center", maxWidth: 900, margin: "0 0 16px", color: S.white, fontFamily: "'JetBrains Mono', monospace" }}>
          {CONFIG.tagline.split(".").map((part, i, arr) => part.trim() && (
            <span key={i}>
              {i === 1
                ? <span style={{ color: S.yellow }}>{part.trim()}</span>
                : part.trim()
              }
              {i < arr.length - 1 && part.trim() && <span style={{ color: S.yellow }}>.</span>}
              {i < arr.filter(p=>p.trim()).length - 1 && part.trim() && <br />}
            </span>
          ))}
        </h1>

        <p style={{ color: S.dimText, fontSize: "clamp(13px,1.6vw,16px)", lineHeight: 1.75, maxWidth: 560, textAlign: "center", margin: "0 0 56px", fontWeight: 400 }}>
          {CONFIG.subtext}
        </p>

        {/* ── Countdown ── */}
        <div style={{ display: "flex", gap: "clamp(8px,2vw,20px)", marginBottom: 64, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "DAYS",    value: time.days },
            { label: "HOURS",   value: time.hours },
            { label: "MINUTES", value: time.minutes },
            { label: "SECONDS", value: time.seconds },
          ].map((unit, i) => (
            <CountUnit key={unit.label} label={unit.label} value={unit.value} isLast={i === 3} />
          ))}
        </div>

        {/* ── Signup form ── */}
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 80 }}>
          <div style={{ position: "relative", padding: "32px 28px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(255,255,255,0.03)", border: `1px solid ${S.border}`, borderRadius: 3, borderLeft: `3px solid ${S.yellow}` }}>
            {/* Top rim */}
            <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: `linear-gradient(90deg, transparent, rgba(251,255,3,0.3), transparent)` }} />

            <div style={{ color: S.yellow, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8 }}>{CONFIG.ctaHeadline.toUpperCase()}</div>
            <p style={{ color: S.dimText, fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>{CONFIG.ctaSubtext}</p>

            {status === "success" ? (
              <div style={{ padding: "16px 18px", background: "rgba(251,255,3,0.08)", border: `1px solid rgba(251,255,3,0.35)`, borderRadius: 2, color: S.yellow, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", borderLeft: `3px solid ${S.yellow}` }}>
                ✓ {CONFIG.successMsg}
              </div>
            ) : (
              <form onSubmit={handleSignup} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrMsg(""); }}
                  placeholder={CONFIG.inputPlaceholder}
                  style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.04)", border: `1px solid ${errMsg ? "rgba(255,50,50,0.5)" : S.border}`, borderRadius: 2, padding: "11px 14px", color: S.white, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none", transition: "border-color 0.1s" }}
                  onFocus={e => e.target.style.borderColor = S.yellow}
                  onBlur={e => e.target.style.borderColor = errMsg ? "rgba(255,50,50,0.5)" : S.border}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ padding: "11px 22px", borderRadius: 2, border: `1px solid ${S.yellow}`, background: status === "loading" ? "rgba(251,255,3,0.15)" : S.yellow, color: S.black, fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", cursor: status === "loading" ? "default" : "pointer", letterSpacing: "0.04em", transition: "all 0.08s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { if (status !== "loading") { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fff"; }}}
                  onMouseLeave={e => { if (status !== "loading") { e.currentTarget.style.background = S.yellow; e.currentTarget.style.borderColor = S.yellow; }}}
                >
                  {status === "loading" ? "SENDING..." : CONFIG.btnLabel}
                </button>
              </form>
            )}
            {errMsg && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 8, fontWeight: 700 }}>{errMsg}</div>}
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div style={{ width: "100%", maxWidth: 1000 }}>
          <div style={{ textAlign: "center", color: S.mutedText, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 24 }}>WHAT'S COMING</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {CONFIG.features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer style={{ position: "relative", zIndex: 10, padding: "20px clamp(16px,4vw,48px)", borderTop: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(14px)" }}>
        <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: `linear-gradient(90deg, transparent, rgba(251,255,3,0.2), rgba(251,255,3,0.4), rgba(251,255,3,0.2), transparent)` }} />
        <span style={{ color: S.mutedText, fontSize: 12 }}>© 2026 {CONFIG.brandName}{CONFIG.brandAccent}. All rights reserved.</span>
        <span style={{ color: S.mutedText, fontSize: 12 }}>Built with <span style={{ color: S.yellow }}>Entropic UI</span></span>
      </footer>

      <Styles />
    </div>
  );
}

// ── Countdown unit ───────────────────────────────────────────
function CountUnit({ label, value, isLast }) {
  const display = String(value).padStart(2, "0");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px,2vw,20px)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ position: "relative", padding: "clamp(16px,3vw,28px) clamp(20px,4vw,40px)", background: "rgba(251,255,3,0.05)", border: `1px solid ${S.border}`, borderRadius: 3, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", minWidth: "clamp(72px,12vw,110px)" }}>
          {/* Top specular */}
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(251,255,3,0.25), transparent)" }} />
          {/* Value */}
          <div style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 800, color: S.yellow, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em", textShadow: `0 0 30px rgba(251,255,3,0.35)` }}>
            {display}
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: S.mutedText }}>{label}</div>
      </div>
      {!isLast && (
        <div style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 800, color: S.yellow, opacity: 0.4, marginBottom: 20, animation: "blink 1.4s step-end infinite" }}>:</div>
      )}
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────
function FeatureCard({ icon, label, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "22px 20px", background: hovered ? "rgba(251,255,3,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${hovered ? "rgba(251,255,3,0.4)" : S.border}`, borderLeft: `2px solid ${hovered ? S.yellow : "rgba(251,255,3,0.25)"}`, borderRadius: 3, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", transition: "all 0.08s ease", cursor: "default" }}
    >
      <div style={{ fontSize: 20, marginBottom: 10, color: S.yellow }}>{icon}</div>
      <div style={{ color: S.white, fontWeight: 700, fontSize: 13, marginBottom: 7, letterSpacing: "0.03em" }}>{label}</div>
      <div style={{ color: S.dimText, fontSize: 12, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Inter:wght@300;400;700;900&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      input::placeholder { color: rgba(255,255,255,0.2); }
      input:focus { outline: none; }
      @keyframes pulse  { 0%,100%{opacity:1;box-shadow:0 0 8px #fbff03} 50%{opacity:0.3;box-shadow:0 0 3px #fbff03} }
      @keyframes blink  { 0%,100%{opacity:0.4} 50%{opacity:0.1} }
      ::selection { background: rgba(251,255,3,0.25); color: #000; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: #000; }
      ::-webkit-scrollbar-thumb { background: rgba(251,255,3,0.3); }
    `}</style>
  );
}
