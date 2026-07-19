# Unity & Unreal Engine — Research Notes for AI-Assisted Development

## Overview

Understanding how traditional game engines work helps me assist with:
- Game design concepts and architecture
- Asset pipeline knowledge
- Porting web games to native (and vice versa)
- Understanding what's feasible for different platforms

---

## Unity

### What It Is
- Cross-platform game engine (C#)
- Dominant in mobile, indie, and mid-tier games
- Visual editor + scripting
- Asset Store ecosystem

### Key Concepts
- **GameObjects** — Everything in the scene
- **Components** — Behavior/data attached to GameObjects
- **MonoBehaviour** — Base class for scripts
- **Prefabs** — Reusable object templates
- **Scenes** — Level/screen containers
- **ScriptableObjects** — Data containers (decoupled from scenes)

### Architecture Patterns
- **Entity-Component-System (ECS)** — DOTS for high performance
- **MVC** — Separate data, logic, presentation
- **Event-driven** — UnityEvents, C# events, ScriptableObject events
- **State machines** — For AI, animation, game states
- **Object pooling** — Reuse objects instead of instantiate/destroy

### Unity for Web (WebGL Export)
- Compiles C# to WebAssembly via IL2CPP
- Output: HTML + JS + WASM + data files
- **Limitations on mobile:**
  - Large download size (10-50MB minimum)
  - Memory pressure (WASM + Unity runtime overhead)
  - No multithreading in most mobile browsers
  - Audio issues on iOS (Web Audio context restrictions)
  - Shader compatibility (not all work in WebGL)
- **When to use:** Complex 3D games where native-quality is needed
- **When NOT to use:** Simple 2D games (overkill), hyper-casual (too heavy)

### Unity C# Basics
```csharp
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        Vector3 movement = new Vector3(h, 0, v) * speed;
        rb.velocity = movement;
    }
}
```

---

## Unreal Engine

### What It Is
- AAA-quality game engine (C++ / Blueprints)
- Best-in-class graphics (Nanite, Lumen, MetaHuman)
- Free until $1M revenue
- Overkill for mobile web but relevant for native mobile

### Key Concepts
- **Actors** — Base class for world objects
- **Components** — Attached to actors (like Unity)
- **Blueprints** — Visual scripting (node-based)
- **Game Mode** — Rules of the game
- **Player Controller** — Input handling
- **Pawn/Character** — Controlled entities
- **Levels** — World containers
- **Materials** — Node-based shader editor

### When Unreal Makes Sense
- High-fidelity 3D games
- Multiplayer shooters / action games
- VR/AR experiences
- Architectural visualization
- Film/TV virtual production

### Unreal for Mobile
- Native mobile export (iOS/Android)
- No web export (no WebGL/WASM)
- Mobile renderer available but still heavy
- Best for premium mobile games with large budgets

---

## Godot Engine (Rising Alternative)

### What It Is
- Open source, MIT licensed
- GDScript (Python-like) + C# + C++
- Lightweight, fast iteration
- Growing community rapidly

### Why It Matters
- **HTML5 export** — Works well for mobile web!
- Much lighter than Unity WebGL builds
- Scene/node tree architecture (intuitive)
- Built-in 2D AND 3D engines
- No licensing fees ever

### Godot for Web Games
- Export target: HTML5 (WebAssembly)
- Smaller output than Unity (~5-15MB for simple games)
- Better mobile web performance
- Audio works better on mobile browsers
- Active development for web platform improvements

### Godot Architecture
```
Node (base)
├── Node2D (2D games)
│   ├── Sprite2D
│   ├── CharacterBody2D
│   └── Area2D
├── Node3D (3D games)
│   ├── MeshInstance3D
│   ├── CharacterBody3D
│   └── Camera3D
└── Control (UI)
    ├── Button
    ├── Label
    └── Panel
```

### GDScript Example
```gdscript
extends CharacterBody2D

const SPEED = 300.0
const JUMP_VELOCITY = -400.0

func _physics_process(delta):
    if not is_on_floor():
        velocity.y += gravity * delta
    
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = JUMP_VELOCITY
    
    var direction = Input.get_axis("move_left", "move_right")
    velocity.x = direction * SPEED
    
    move_and_slide()
```

---

## Comparison Matrix

| Factor | Unity | Unreal | Godot | Web-native (Three/Phaser) |
|--------|-------|--------|-------|---------------------------|
| Web export | WebGL (heavy) | None | HTML5 (lighter) | Native |
| Mobile web | Poor | None | Decent | Excellent |
| Native mobile | Excellent | Great | Good | Via Capacitor |
| 2D games | Good | Overkill | Excellent | Excellent |
| 3D games | Excellent | Best | Good | Good (Three.js) |
| Learning curve | Medium | Hard | Easy | Easy-Medium |
| File size (web) | 10-50MB | N/A | 5-15MB | 0.5-5MB |
| Multiplayer | Mirror/Netcode | Built-in | Needs addon | Colyseus/Socket.io |
| Cost | Free to $2K/yr | Free to 5% royalty | Free forever | Free |
| Asset ecosystem | Massive | Large | Growing | npm/CDN |

---

## My Assessment for Our Work

### For MainStreet AI customers (small business games/interactive content):
**Use web-native (Phaser/Three.js)** — lightest, fastest, no install needed

### For Telegram mini games:
**Use Phaser or PixiJS** — proven, lightweight, fast load in WebView

### For a more complex mobile game project:
**Use Godot with HTML5 export** — good middle ground of capability vs. web performance

### For native App Store games:
**Use Unity** — best balance of capability, ecosystem, and cross-platform

### For AAA/premium:
**Use Unreal** — but this is not our market right now

---

## Next Learning Goals
- [ ] Build a simple Phaser game prototype
- [ ] Export a Godot 2D game to HTML5 and test on mobile
- [ ] Explore Three.js for 3D product visualizers (useful for small biz customers)
- [ ] Study Telegram Mini App game examples
- [ ] Research game monetization for small-scale indie
