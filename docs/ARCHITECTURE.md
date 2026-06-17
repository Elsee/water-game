# ARCHITECTURE.md

## Overview

Browser-based game framework for a vibe-coding workshop.
Games are built with **pure TypeScript** for logic and **React** only for UI chrome.
Everything runs client-side — **no backend, no network, no database**.
Games start with **geometric primitives** (squares, circles, triangles) — no sprites needed.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                         BROWSER                            │
│                                                            │
│  ┌───────────────────┐   useSelector()   ┌────────────────┐  │
│  │    React UI        │◄──────────────│ @tanstack/store │  │
│  │  (App.tsx,         │   reads only  │ (game-store.ts) │  │
│  │   menus, HUD)      │               └───────▲────────┘  │
│  └────────┬───────────┘                       │ writes     │
│           │ mounts <div>                      │            │
│           │ via ref                           │            │
│           ▼                                   │            │
│  ┌─────────────────┐              ┌───────────┴─────────┐  │
│  │  <canvas> or     │◄──render()──│   Game Engine        │  │
│  │  <div> container │             │   (pure TypeScript)  │  │
│  └─────────────────┘              │                      │  │
│                                   │  ┌────────────────┐  │  │
│                                   │  │  GameLoop       │  │  │
│                                   │  │  (rAF + fixed   │  │  │
│                                   │  │   timestep)     │  │  │
│                                   │  └──────┬─────────┘  │  │
│                                   │         │ each tick   │  │
│                                   │         ▼             │  │
│                                   │  ┌────────────────┐  │  │
│                                   │  │  World          │  │  │
│                                   │  │  (entities +    │  │  │
│                                   │  │   systems)      │  │  │
│                                   │  └──────┬─────────┘  │  │
│                                   │         │ updates     │  │
│                                   │         ▼             │  │
│                                   │  ┌────────────────┐  │  │
│                                   │  │  Systems        │  │  │
│                                   │  │  Input →        │  │  │
│                                   │  │  Movement →     │  │  │
│                                   │  │  Collision →    │  │  │
│                                   │  │  Bounds →       │  │  │
│                                   │  │  Score          │  │  │
│                                   │  └──────┬─────────┘  │  │
│                                   │         │             │  │
│                                   │         ▼             │  │
│                                   │  ┌────────────────┐  │  │
│                                   │  │  Entities       │  │  │
│                                   │  │  (BaseEntity    │  │  │
│                                   │  │   subclasses)   │  │  │
│                                   │  └────────────────┘  │  │
│                                   └──────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │            Renderer (implements GameRenderer)         │    │
│  │                                                       │    │
│  │  Canvas2DRenderer │ PixiRenderer │ ThreeRenderer      │    │
│  │  (simple games)   │ (2D perf)   │ (3D games)         │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input (keyboard / mouse / touch)
        │
        ▼
  InputSystem.capture()          ← DOM event listeners (on canvas only)
        │
        ▼
  GameLoop.tick()                ← requestAnimationFrame
        │
        ├──▶ InputSystem.update()        — process buffered input
        ├──▶ MovementSystem.update()     — apply velocities
        ├──▶ CollisionSystem.update()    — detect & resolve
        ├──▶ BoundsSystem.update()       — screen edges
        ├──▶ SpawnSystem.update()        — create new entities
        ├──▶ ScoreSystem.update()        — track score
        ├──▶ World.cleanup()             — remove dead entities
        │
        ├──▶ EventBus emissions ──▶ gameStore.setState()
        │                                  │
        │                                  ▼
        │                          React re-renders
        │                          (HUD, menus only)
        │
        └──▶ Renderer.render(entities) ──▶ pixels on canvas
```

## Layer Responsibilities

### Engine Layer (`src/engine/`)

**Hard rule: ZERO imports from React, ReactDOM, or any UI library.**

| Module | Responsibility |
|--------|---------------|
| `core/game-loop.ts` | Fixed timestep rAF loop. Calls update and render callbacks. |
| `core/world.ts` | Holds all entities in a `Map<string, BaseEntity>`. Runs systems in order. Provides `addEntity()`, `removeEntity()`, `getByTag()`. |
| `core/event-bus.ts` | Typed pub/sub. Systems emit events, store listeners react. Decouples everything. |
| `entities/base-entity.ts` | Abstract class: id, position, size, velocity, color, shape, tags, isAlive. |
| `entities/*.ts` | Concrete entity classes (player paddle, ball, enemy, wall, collectible). |
| `systems/input-system.ts` | Owns all DOM event listeners on canvas. Exposes `isKeyDown(key)`, `isKeyPressed(key)`, `getMousePos()`. Cleans up on destroy. |
| `systems/movement-system.ts` | `entity.x += entity.velocity.x * dt` for all entities. |
| `systems/collision-system.ts` | AABB and circle overlap checks. Emits `'collision'` events via EventBus. |
| `systems/bounds-system.ts` | Keeps entities in play area. Options: clamp, wrap, bounce, destroy. |
| `systems/spawn-system.ts` | Timer or event-based entity spawning. |
| `systems/score-system.ts` | Listens to collision/destroy events, updates score via `gameActions`. |
| `utils/math.ts` | `clamp`, `lerp`, `randomRange`, `distance`, `normalize`. |

### Renderer Layer (`src/renderer/`)

**Knows about engine entities. Does NOT import React.**

```typescript
// src/renderer/types.ts
import type { BaseEntity } from '../engine/entities/base-entity';

export interface GameRenderer {
  init(container: HTMLElement, width: number, height: number): void;
  render(entities: BaseEntity[]): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
```

| Renderer | When to Use | Dependencies |
|----------|------------|--------------|
| `Canvas2DRenderer` | Pong, Snake, Breakout, simple puzzles (<50 entities) | None (native API) |
| `PixiRenderer` | Platformers, shooters, particle-heavy (>50 entities) | `pixi.js` |
| `ThreeRenderer` | Any 3D game | `three` |

### Store Layer (`src/store/`)

**@tanstack/store — the bridge between engine and React.**

- Engine **writes** via `gameActions` helper functions.
- React **reads** via `useSelector(gameStore)` from `@tanstack/react-store`.
- Store holds ONLY UI-relevant state: score, lives, gameStatus, level, message.
- Store does NOT hold entity positions or physics data (that's too granular / too fast).

### UI Layer (`src/components/` + `src/pages/` + `src/App.tsx`)

**React only. Subscribes to store. Calls engine control functions. Never contains game logic.**

| File/Page | Purpose |
|-----------|---------|
| `App.tsx` | Root shell with wouter routes. Switches between home, game pages. |
| `pages/home.tsx` | Home page with game list/cards and links to docs. |
| `pages/game.tsx` | Individual game page with canvas, HUD, and menus. |
| `pages/counter.tsx` | Counter demo page (TanStack Store example). |
| `components/game-canvas.tsx` | Renders a `<div ref={}>`. On mount: calls `setupGame(ref)`. On unmount: calls `cleanup()`. |
| `components/hud/*` | Score, lives, level overlays. Absolute positioned over canvas. |
| `components/menus/*` | Start, pause, game-over screens. Use Tailwind for styling. |

### Game Wiring Layer (`src/game/`)

| File | Purpose |
|------|---------|
| `config.ts` | All magic numbers: canvas size, speeds, colors, spawn rates, entity sizes. |
| `setup.ts` | Creates engine + systems + renderer. Returns `cleanup` function. This is the main entry point for game initialization. |

## Key Architecture Decisions

| Decision | Why |
|----------|-----|
| Game logic outside React | React reconciler adds 5-16ms overhead per frame. Pure TS gives consistent 60fps. |
| @tanstack/store as bridge | Lightweight (~1KB), no boilerplate, works outside React, perfect for one-direction data flow. |
| Renderer interface | Swap Canvas2D↔Pixi↔Three without touching game logic. Great for workshop — upgrade renderer as games get complex. |
| EventBus for decoupling | Systems don't import each other. Collision system emits event, score system listens. Easy to add new behaviors. |
| Fixed timestep loop | Physics behaves consistently on 30fps laptop and 144hz monitor. |
| Primitives first | Instant visual results. No asset pipeline. Participants see shapes moving in minutes. |
| No git | Workshop projects are throwaway. Reduces friction. |

## Renderer Selection Guide

| Game Idea | Renderer | Why |
|-----------|----------|-----|
| Pong | Canvas2D | 4 rectangles, 1 circle. Simplest possible. |
| Snake | Canvas2D | Grid of squares. |
| Breakout / Arkanoid | Canvas2D | Rectangles + 1 circle. |
| Flappy Bird | Canvas2D or Pixi | Few entities but scrolling background benefits from Pixi. |
| Space Invaders | Pixi | Many enemies, projectiles, particles. |
| Platformer | Pixi | Scrolling world, many tiles, particles. |
| Tower Defense | Pixi | Many enemies, projectiles, UI overlays. |
| Asteroids | Canvas2D or Pixi | Triangles + circles, rotation. |
| 3D Maze Runner | Three | First-person or third-person 3D. |
| 3D Flyer / Space | Three | 3D space with camera movement. |
| 3D Puzzle | Three | 3D objects, rotation, camera. |
| Card Game / Board Game | React only | No canvas needed. Pure UI. |

## Adding a New Game — Checklist

```
[ ] 1. Define game constants in src/game/config.ts
[ ] 2. Define game state shape in src/store/game-store.ts
[ ] 3. Create entity classes in src/engine/entities/
[ ] 4. Create/configure systems in src/engine/systems/
[ ] 5. Wire world + loop in src/engine/core/
[ ] 6. Implement renderer in src/renderer/
[ ] 7. Wire everything in src/game/setup.ts
[ ] 8. Create game-canvas.tsx component
[ ] 9. Create HUD components
[ ] 10. Create menu components
[ ] 11. Update App.tsx shell
[ ] 12. Clean up old files (Counter.tsx, counter.ts)
[ ] 13. Test: starts → plays → ends → restarts
```

## Performance Budget

| Metric | Target |
|--------|--------|
| Frame time | < 16ms (60fps) |
| Entities on screen | Canvas2D: <100, Pixi: <1000, Three: <500 |
| Store updates | < 10 per second (only meaningful state changes) |
| React re-renders | Only on gameStatus/score/lives changes |
