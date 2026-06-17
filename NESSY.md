# Vibe Workshop Template — Game Development

A browser-based game development template for vibe-coding workshops. Build simple 2D and 3D games quickly with **pure TypeScript** for game logic and **React** only for UI chrome.

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Lint code
npm run test     # Run tests
```

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Build Tool** | Rsbuild 2 |
| **Language** | TypeScript 6 (strict) |
| **State** | TanStack Store |
| **Routing** | wouter |
| **2D Rendering** | Canvas2D (default) or PixiJS 8 |
| **3D Rendering** | Three.js |
| **UI Components** | @tui-react/* |
| **Styling** | Tailwind CSS 4 |
| **Linting** | Rslint |
| **Testing** | Rstest (Vitest) |

## Project Structure

```
src/
├── engine/           # Pure TS game logic — NO React imports
│   ├── core/         # Game loop, world, event bus
│   ├── entities/     # Entity classes (player, enemies, etc.)
│   ├── systems/      # Input, movement, collision, etc.
│   └── utils/        # Math helpers
├── renderer/         # Canvas2D, Pixi, or Three renderers
├── game/             # Game config and setup wiring
├── store/            # TanStack Store — bridge engine→React
├── components/       # React UI (canvas mount, HUD, menus)
├── pages/            # Route pages (Home, Game, About)
├── types/            # Shared TypeScript interfaces
├── App.tsx           # Root with wouter routes
├── App.css           # Global styles
├── index.tsx         # React entry point
└── env.d.ts          # Type declarations

docs/                 # Workshop documentation
├── ARCHITECTURE.md   # System design and data flow
├── PROMPTS.md        # Game idea prompts for participants
├── TROUBLESHOOTING.md# Common issues and solutions
└── GAME-IDEAS.md     # Game catalog by complexity
```

## Core Principles

1. **Game logic OUTSIDE React** — Engine code in `src/engine/` is pure TypeScript. React only renders UI overlays.
2. **Simplicity first** — Start with geometric primitives (rectangles, circles). Add sprites later.
3. **Iterative development** — Each change should be visible and playable immediately.
4. **One file, one responsibility** — Keep files under 150 lines.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  React UI (menus, HUD)                              │
│    ▲                                                │
│    │ useSelector() reads                               │
│    │                                                │
│    │              ┌─────────────────────────┐       │
│    └──────────────│ @tanstack/store         │       │
│                   │ (game-store.ts)         │◄──────┤  Engine writes
│                   └─────────────────────────┘       │  via gameActions
│                              ▲                      │
│                              │                      │
│    ┌──────────────┐         │         ┌──────────┐ │
│    │  <canvas>    │◄────────┴─────────│  Engine  │ │
│    │  Renderer    │  render(entities) │  (pure   │ │
│    └──────────────┘                   │   TS)    │ │
│                                       └──────────┘ │
└─────────────────────────────────────────────────────┘
```

## Creating a New Game

1. Define constants in `src/game/config.ts`
2. Define state in `src/store/game-store.ts`
3. Create entity classes in `src/engine/entities/`
4. Configure systems in `src/engine/systems/`
5. Wire everything in `src/game/setup.ts`
6. Create UI components (canvas mount, HUD, menus)
7. Update `src/App.tsx` shell

See `docs/PROMPTS.md` for game ideas and `docs/ARCHITECTURE.md` for detailed design.

## Renderer Selection

| Game Type | Renderer | When to Use |
|-----------|----------|-------------|
| Simple 2D | Canvas2D | Pong, Snake, Breakout (<50 entities) |
| Complex 2D | PixiJS | Platformers, shooters, particles (>50 entities) |
| 3D | Three.js | First-person, 3D puzzles, space games |

## Key Files

| File | Purpose |
|------|---------|
| `src/engine/core/game-loop.ts` | Fixed timestep rAF loop (60 FPS) |
| `src/engine/core/world.ts` | Entity container and system orchestrator |
| `src/engine/systems/input-system.ts` | Keyboard/mouse/touch capture |
| `src/engine/systems/collision-system.ts` | AABB and circle collision |
| `src/store/game-store.ts` | State bridge (score, lives, game status) |
| `src/game/setup.ts` | Main entry point — wires engine + renderer |
| `src/components/game-canvas.tsx` | Canvas mount with ref |

## Common Commands

```bash
# Install optional renderers
npm install pixi.js              # For complex 2D games
npm install three @types/three   # For 3D games

# Development
npm run dev                      # Start dev server
npm run build                    # Production build
npm run preview                  # Preview production build
npm run lint                     # Lint code
npm run test                     # Run tests
npm run test:watch              # Watch mode
```

## Documentation

- `docs/ARCHITECTURE.md` — System design, data flow, layer responsibilities
- `docs/PROMPTS.md` — Ready-to-use game prompts for workshop participants
- `docs/TROUBLESHOOTING.md` — Common issues and solutions
- `docs/GAME-IDEAS.md` — Game catalog by complexity

## Resources

- [Rsbuild Docs](https://rsbuild.rs)
- [TanStack Store Docs](https://tanstack.com/store)
- [PixiJS Docs](https://pixijs.com)
- [Three.js Docs](https://threejs.org)
