# Mobile Browser Game Development — Research Notes

## Overview

This document captures my research into building games for mobile browsers,
including frameworks, best practices, and architecture patterns. The goal is
to be able to rapidly prototype and ship browser-based mobile games.

---

## Key Frameworks & Engines

### Three.js
- **Type:** 3D rendering library (WebGL)
- **Best for:** 3D games, visual experiences, product visualizers
- **Mobile:** Works well but needs careful optimization (draw calls, geometry)
- **Learning curve:** Medium
- **URL:** https://threejs.org
- **Key concepts:**
  - Scene, Camera, Renderer pattern
  - Mesh = Geometry + Material
  - RequestAnimationFrame game loop
  - OrbitControls for camera
  - GLTFLoader for 3D models
  - Raycasting for interaction

### Phaser
- **Type:** 2D game framework (Canvas/WebGL)
- **Best for:** 2D games, platformers, puzzles, card games, casual mobile
- **Mobile:** Excellent — designed for it
- **Learning curve:** Easy-Medium
- **URL:** https://phaser.io
- **Key concepts:**
  - Scene-based architecture
  - Built-in physics (Arcade, Matter.js)
  - Sprite sheets and animations
  - Input handling (touch, keyboard, gamepad)
  - Tween system for animations
  - Asset loader with progress
  - Tilemap support

### PixiJS
- **Type:** 2D rendering engine (WebGL/Canvas fallback)
- **Best for:** High-performance 2D, UI-heavy games, slots, cards
- **Mobile:** Excellent
- **Learning curve:** Easy
- **URL:** https://pixijs.com
- **Key concepts:**
  - Display list (Stage > Container > Sprites)
  - Filters and blend modes
  - Texture management
  - Ticker for game loop

### Babylon.js
- **Type:** Full 3D game engine (WebGL/WebGPU)
- **Best for:** Complex 3D games, multiplayer, physics-heavy
- **Mobile:** Good but heavier than Three.js
- **Learning curve:** Medium-Hard
- **URL:** https://babylonjs.com
- **Key concepts:**
  - Node-based material system
  - Built-in physics (Havok, Cannon, Oimo)
  - GUI system
  - Animation system
  - XR support

### PlayCanvas
- **Type:** Cloud-based 3D game engine
- **Best for:** Team collaboration, 3D mobile games
- **Mobile:** Very good (optimized for mobile WebGL)
- **Learning curve:** Medium
- **URL:** https://playcanvas.com
- **Key concepts:**
  - Entity-Component system
  - Visual editor (browser-based)
  - Asset pipeline
  - Script components (ES6)

---

## Mobile-Specific Considerations

### Performance
- **Budget:** Target 60fps on mid-range phones (2-3 year old devices)
- **Draw calls:** Keep under 50-100 for smooth mobile performance
- **Textures:** Use texture atlases, compress with basis/ktx2
- **Geometry:** Low poly, instancing where possible
- **Shaders:** Keep simple, avoid complex fragment shaders
- **Memory:** Stay under 150MB total (some devices have 1-2GB total)
- **Battery:** Reduce GPU work when game is idle/paused

### Input
- **Touch:** Primary input method
  - Tap, double-tap, long press
  - Swipe (4 directions + diagonal)
  - Pinch zoom / rotate
  - Multi-touch (2-3 fingers max)
  - Virtual joystick / d-pad overlays
- **Gyroscope:** Tilt controls (racing, balance games)
- **Haptic:** vibrate() API for feedback
- **No hover state** — design for tap-only

### Screen
- **Orientation:** Lock or design for both (portrait usually better for casual)
- **Safe areas:** Respect notches and rounded corners
- **Aspect ratios:** Design for 16:9 through 20:9 (and tablets at 4:3)
- **DPI:** Use devicePixelRatio but cap at 2x for performance
- **Resize handling:** Responsive canvas sizing

### Audio
- **Web Audio API** for low-latency game sounds
- **Autoplay restrictions:** Must start audio after user gesture
- **Compressed formats:** Use MP3 or OGG (AAC for iOS)
- **Sound sprites** for multiple short effects

### Loading & Storage
- **Service Workers** for offline play
- **IndexedDB** for save data (larger than localStorage)
- **Lazy loading** for assets not needed immediately
- **Loading screen** with progress bar (users leave after 3s of blank screen)

---

## Telegram Games (Mini Apps)

### Architecture
- Standard web app loaded in Telegram WebView
- Access to Telegram user data, payments, share mechanics
- Can use any framework (Phaser, Three.js, PixiJS)

### Telegram-Specific APIs
```javascript
// Initialize
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand(); // Full screen

// User data
const user = tg.initDataUnsafe.user;
// { id, first_name, last_name, username, language_code }

// Haptic feedback
tg.HapticFeedback.impactOccurred('medium');

// Share / invite
tg.switchInlineQuery('play_my_game', ['users', 'groups']);

// Cloud storage (per-user)
tg.CloudStorage.setItem('high_score', '1000');

// Payments
tg.showPopup({ title: 'Buy Lives', message: '5 lives for $0.99' });
```

### Monetization
- In-app purchases via Telegram Stars
- Ads (Telegram Ad network or custom)
- Premium features
- Tournament entry fees

### Popular Telegram Game Patterns
- Tap-to-earn / clicker games
- Puzzle games (match-3, word games)
- Idle/incremental
- Social/multiplayer
- Card collection

---

## App Store Games (PWA / Capacitor / TWA)

### Progressive Web App (PWA)
- Add to homescreen via manifest.json
- Offline support via Service Worker
- Push notifications
- Limited but growing native API access
- No app store cut (but no discovery either)

### Capacitor (by Ionic)
- Wraps web app in native shell
- Access native APIs (camera, filesystem, push, etc.)
- Deploy to App Store and Google Play
- Same codebase as web version
- Good for games that need native features

### TWA (Trusted Web Activity) — Android
- Chrome-powered, no browser UI
- Full PWA in Play Store listing
- No web view overhead
- Must pass quality criteria (performance bars)

---

## Architecture Pattern: Mobile Browser Game

```
src/
  index.html          # Entry point, meta viewport, manifest
  game/
    Boot.js           # Preload essentials, show logo
    Preload.js        # Load all assets with progress bar
    MainMenu.js       # Title screen, play button
    Game.js           # Main gameplay scene
    GameOver.js       # Results, share, play again
    HUD.js            # Overlay UI (score, lives, etc.)
  systems/
    InputManager.js   # Unified touch/keyboard input
    AudioManager.js   # Sound with autoplay handling
    SaveManager.js    # IndexedDB/localStorage persistence
    Analytics.js      # Event tracking
  utils/
    resize.js         # Responsive canvas handling
    device.js         # Detect capabilities
  assets/
    sprites/          # Texture atlases
    audio/            # Compressed sound files
    fonts/            # Web fonts for UI
  manifest.json       # PWA manifest
  sw.js              # Service worker for offline
```

### Game Loop Best Practice
```javascript
class Game {
    constructor() {
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedStep = 1000 / 60; // 60 updates/sec
    }
    
    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulator += dt;
        
        // Fixed timestep updates (physics, logic)
        while (this.accumulator >= this.fixedStep) {
            this.update(this.fixedStep);
            this.accumulator -= this.fixedStep;
        }
        
        // Render at display refresh rate
        this.render();
        
        requestAnimationFrame(this.loop.bind(this));
    }
    
    update(dt) { /* game logic */ }
    render() { /* draw frame */ }
}
```

---

## Quick Reference: Framework Choice

| Game Type | Recommended | Why |
|-----------|------------|-----|
| Casual 2D (puzzle, cards) | Phaser | Full featured, easy, great mobile |
| Hyper-casual (tap, swipe) | PixiJS or vanilla Canvas | Lightweight, fast load |
| 3D (low complexity) | Three.js | Flexible, good ecosystem |
| 3D (complex, multiplayer) | Babylon.js | Full engine, built-in multiplayer |
| Telegram mini game | Phaser + TG SDK | Proven combo |
| Story/narrative | Ink.js + PixiJS | Branching narrative engine |
| Multiplayer real-time | Colyseus + Phaser/Three | Server authority, WebSocket |

---

## Multiplayer Architecture (for future reference)

### Client-Server (Authoritative)
- **Server:** Colyseus, Socket.io, or custom WebSocket
- **Pattern:** Client sends inputs → Server validates → Server broadcasts state
- **Good for:** Competitive games, anti-cheat requirements
- **Hosting:** Any VPS, or Colyseus Cloud

### Peer-to-Peer
- **Tech:** WebRTC DataChannels
- **Pattern:** Players connect directly, one acts as host
- **Good for:** Co-op, casual multiplayer, reduces server costs
- **Downside:** NAT traversal issues, no anti-cheat

---

## Next Steps to Explore
- [ ] Build a simple Phaser game (tap/swipe casual)
- [ ] Build a Three.js demo (simple 3D scene, mobile-optimized)
- [ ] Study Telegram Mini App SDK in depth
- [ ] Research Unity WebGL export (and its mobile limitations)
- [ ] Look into Godot HTML5 export as alternative
- [ ] Explore monetization patterns that work for mobile web games
