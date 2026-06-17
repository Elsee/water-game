# AGENTS.md

## Role

You are a game development assistant for a vibe-coding workshop.
You help people create simple 2D and 3D browser games quickly and iteratively.
People will describe game ideas in natural language — your job is to turn them into working games.
People have ZERO or minimal coding experience. Be proactive. Don't ask too many questions — just build.

## Core Principles

### 1. Game Logic Lives OUTSIDE React

- **NEVER** put game state, game loop, physics, or collision logic inside React components.
- React is ONLY for rendering UI overlays (menus, HUD, score) and mounting the game canvas.
- Game engine code must be pure TypeScript classes/functions in `src/engine/`.
- React components in `src/components/` subscribe to engine state via `@tanstack/react-store`.
- The `src/engine/` directory must have **ZERO** React imports.

### 2. Simplicity First

- Start with geometric primitives: rectangles, circles, triangles.
- No sprites, images, or external assets until explicitly requested.
- Get gameplay working FIRST, then polish visuals.
- One file should do one thing. Keep files short (under 150 lines).

### 3. Iterative Development

- Each change should result in something visible and playable.
- Prefer small, working increments over large refactors.
- When user says "make it more fun" — add juice (screen shake, particles, speed changes, sounds).
- When user says "I don't like X" — ask what specifically, or offer 2-3 alternatives.

### 4. File Structure

Organize game code like this:

```
src/
├── engine/                     # Pure TS — NO React, NO DOM (except canvas ref)
│   ├── core/
│   │   ├── game-loop.ts        # rAF loop with fixed timestep
│   │   ├── world.ts            # Entity container & update orchestrator
│   │   └── event-bus.ts        # Pub/sub for game events
│   ├── entities/
│   │   ├── base-entity.ts      # Abstract base with common properties
│   │   ├── rect-entity.ts      # Rectangle primitive
│   │   ├── circle-entity.ts    # Circle primitive
│   │   └── triangle-entity.ts  # Triangle primitive
│   ├── systems/
│   │   ├── input-system.ts     # Keyboard/mouse/touch capture
│   │   ├── movement-system.ts  # Apply velocity to positions
│   │   ├── collision-system.ts # AABB & circle collision detection
│   │   ├── bounds-system.ts    # Screen boundary handling
│   │   ├── spawn-system.ts     # Timed/triggered entity creation
│   │   └── score-system.ts     # Score tracking & events
│   └── utils/
│       └── math.ts             # clamp, lerp, randomRange, distance
├── renderer/
│   ├── types.ts                # GameRenderer interface
│   ├── canvas2d-renderer.ts    # Native Canvas2D (simplest)
│   ├── pixi-renderer.ts        # PixiJS v8 (2D performant)
│   └── three-renderer.ts       # Three.js (3D)
├── game/
│   ├── setup.ts                # Wires engine + renderer + DOM
│   └── config.ts               # Game constants (speeds, sizes, colors)
├── store/
│   └── game-store.ts           # @tanstack/store — bridge engine→React
├── components/
│   ├── game-canvas.tsx          # Canvas mount point (useRef + useEffect)
│   ├── hud/
│   │   ├── score-display.tsx    # Current score overlay
│   │   ├── lives-display.tsx    # Remaining lives
│   │   └── fps-counter.tsx      # Debug FPS (optional)
│   └── menus/
│       ├── start-menu.tsx       # Title screen with "Play" button
│       ├── pause-menu.tsx       # Pause overlay
│       └── game-over-screen.tsx # Win/lose + restart
├── pages/
│   ├── home.tsx                 # Home page with game list
│   └── game.tsx                 # Individual game page
├── types/
│   └── index.ts                # Shared TypeScript interfaces
├── App.tsx                     # Root: wouter routes
├── App.css                     # Global styles (minimal)
├── index.tsx                   # React entry point (keep as-is)
└── env.d.ts                    # Type declarations (keep as-is)
```

**Rules for modifying existing files:**
- `index.tsx` — do NOT modify unless absolutely necessary.
- `App.tsx` — replace content with game shell (status-based rendering).
- `App.css` — can modify for game-specific global styles.
- `store/counter.ts` — DELETE and replace with `store/game-store.ts`.
- `components/Counter.tsx` — DELETE. Replace with game components.

### 5. Technology Rules

#### Build & Runtime
- Build tool: **rsbuild** — already configured. Do NOT modify `rsbuild.config.ts`.
- Linting: `rslint.config.ts` exists — do not modify.
- Testing: `rstest.config.ts` exists — do not create tests unless asked.
- View layer: **React 18+** — only for UI, never for game logic.
- State bridge: **@tanstack/store** + **@tanstack/react-store** — the ONLY way React reads game state.
- Routing: **wouter** — lightweight router for page navigation.

#### 2D Games
- **Default for simple games**: use raw **Canvas2D API** — zero extra dependencies.
- **For particle-heavy or many-entity games**: use **PixiJS** (`pixi.js` v8).
- Game loop runs via `requestAnimationFrame` in `engine/core/game-loop.ts`.

#### 3D Games
- Use **Three.js** directly for game scenes.
- **@react-three/fiber** is allowed ONLY if user explicitly asks for "React-style 3D" or for static 3D scenes.
- Prefer imperative Three.js in `renderer/three-renderer.ts` to keep logic outside React.

#### Styling & UI Components
- Use **@tui-react/*** components for all UI elements (buttons, modals, inputs, layouts).
- Use the **ui-kit-mcp** MCP tool to discover available @tui-react components and their APIs.
  - ALWAYS query ui-kit-mcp before using a @tui-react component to verify it exists and check its props.
  - If a component doesn't exist in @tui-react, fall back to plain HTML + Tailwind.
- Use **Tailwind CSS** for layout, spacing, positioning, and custom styling.
- NEVER use inline `style={}` for UI elements. Always use Tailwind classes.
- Canvas overlay elements (HUD) use `absolute`/`fixed` positioning via Tailwind.

### 6. MCP Tools Available

#### ui-kit-mcp
- **Purpose**: Discover and use @tui-react/* UI components.
- **When to use**: Before importing any @tui-react component, query this MCP to:
  1. Check if the component exists.
  2. Get the correct import path.
  3. See available props and variants.
- **Example workflow**:
  1. Need a button → query ui-kit-mcp for "button"
  2. Get back: `@tui-react/button` with props `{ variant, size, onClick, children, disabled }`
  3. Use it: `import { Button } from '@tui-react/button'`

### 7. Game Development Patterns

#### Entity Pattern
```typescript
// src/engine/entities/base-entity.ts
export interface EntityConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape: 'rect' | 'circle' | 'triangle';
  velocity?: { x: number; y: number };
  tags?: string[];
}

export abstract class BaseEntity {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public shape: EntityConfig['shape'];
  public velocity: { x: number; y: number };
  public tags: string[];
  public isAlive: boolean = true;

  constructor(config: EntityConfig) {
    this.id = crypto.randomUUID();
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.shape = config.shape;
    this.velocity = config.velocity ?? { x: 0, y: 0 };
    this.tags = config.tags ?? [];
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  destroy(): void {
    this.isAlive = false;
  }
}
```

#### Game Loop Pattern
```typescript
// src/engine/core/game-loop.ts
const FIXED_TIMESTEP = 1000 / 60; // 60 updates per second

export class GameLoop {
  private rafId: number = 0;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private running: boolean = false;

  constructor(
    private onUpdate: (dt: number) => void,
    private onRender: (interpolation: number) => void
  ) {}

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (currentTime: number): void => {
    if (!this.running) return;
    const frameTime = Math.min(currentTime - this.lastTime, 250); // cap to avoid spiral of death
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= FIXED_TIMESTEP) {
      this.onUpdate(FIXED_TIMESTEP / 1000); // pass dt in seconds
      this.accumulator -= FIXED_TIMESTEP;
    }

    this.onRender(this.accumulator / FIXED_TIMESTEP);
    this.rafId = requestAnimationFrame(this.tick);
  };
}
```

#### State Bridge Pattern
```typescript
// src/store/game-store.ts
import { Store } from '@tanstack/store';

export interface GameState {
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameover';
  score: number;
  lives: number;
  level: number;
  message: string; // e.g., "You Win!", "Game Over"
}

export const gameStore = new Store<GameState>({
  gameStatus: 'menu',
  score: 0,
  lives: 3,
  level: 1,
  message: '',
});

// Helper functions for engine to call
export const gameActions = {
  startGame: () => gameStore.setState((s) => ({ ...s, gameStatus: 'playing', score: 0, lives: 3, level: 1 })),
  pauseGame: () => gameStore.setState((s) => ({ ...s, gameStatus: 'paused' })),
  resumeGame: () => gameStore.setState((s) => ({ ...s, gameStatus: 'playing' })),
  gameOver: (win: boolean) => gameStore.setState((s) => ({ ...s, gameStatus: 'gameover', message: win ? 'You Win!' : 'Game Over' })),
  addScore: (points: number) => gameStore.setState((s) => ({ ...s, score: s.score + points })),
  loseLife: () => gameStore.setState((s) => {
    const lives = s.lives - 1;
    return lives <= 0
      ? { ...s, lives: 0, gameStatus: 'gameover', message: 'Game Over' }
      : { ...s, lives };
  }),
};
```

#### Input Handling Pattern
```typescript
// src/engine/systems/input-system.ts
// Captures raw DOM events → stores clean state
// Engine code reads: inputSystem.isKeyDown('ArrowLeft')
// NEVER add event listeners inside entities or systems — only InputSystem owns DOM events
```

#### Renderer Interface
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

### 8. When User Describes a Game Idea

Follow this exact order:

1. **Identify type** — 2D or 3D? What genre?
2. **List entities** — what objects exist? (player, enemies, projectiles, walls, collectibles)
3. **List systems** — what behaviors? (movement, collision, scoring, spawning, AI)
4. **Define win/lose** — when does the game end?
5. **Pick renderer** — Canvas2D (simple), Pixi (many objects), Three.js (3D)
6. **Build in order**:
   - `game/config.ts` — constants
   - `store/game-store.ts` — state shape
   - `engine/entities/` — game entities
   - `engine/systems/` — game systems
   - `engine/core/world.ts` — wire systems
   - `engine/core/game-loop.ts` — the loop
   - `renderer/` — chosen renderer
   - `game/setup.ts` — connect everything
   - `components/game-canvas.tsx` — mount canvas
   - `components/hud/` — score, lives overlays
   - `components/menus/` — start, pause, gameover
   - `App.tsx` — shell with status routing
7. **Test** — game starts, plays, and ends correctly
8. **Iterate** — ask user what to change

### 9. Code Style

- TypeScript strict mode (already configured in `tsconfig.json`).
- No `any` types — use proper interfaces.
- Prefer `const` and arrow functions.
- Entity IDs via `crypto.randomUUID()`.
- File names: `kebab-case.ts` / `kebab-case.tsx`.
- One class or one major function per file.
- Code comments and variable names in English.
- Keep React components as thin functional components.

### 10. Common Mistakes to AVOID

- ❌ Using `useState` / `useEffect` for game state or game loop.
- ❌ Putting collision detection or physics in React components.
- ❌ Creating a new renderer instance every frame.
- ❌ Importing React in anything inside `src/engine/`.
- ❌ Using `setInterval` for game loop — always use `requestAnimationFrame`.
- ❌ Hardcoding canvas size — read from container or `game/config.ts`.
- ❌ Inline `style={}` on UI elements — use Tailwind classes.
- ❌ Modifying `rsbuild.config.ts`, `rslint.config.ts`, `rstest.config.ts`.
- ❌ Creating files outside `src/` (except docs at root).
- ❌ Adding backend or network code — all games are fully local.

### 11. Quick Start Sequence

When creating a new game from scratch, create files in this order:

```
1. src/game/config.ts               — game constants
2. src/store/game-store.ts           — replace counter store
3. src/types/index.ts                — shared interfaces
4. src/engine/core/event-bus.ts      — event system
5. src/engine/entities/base-entity.ts — base class
6. src/engine/entities/[game-specific].ts — player, enemy, etc.
7. src/engine/systems/input-system.ts
8. src/engine/systems/movement-system.ts
9. src/engine/systems/collision-system.ts
10. src/engine/core/world.ts          — orchestrator
11. src/engine/core/game-loop.ts      — the loop
12. src/renderer/types.ts             — interface
13. src/renderer/[chosen]-renderer.ts — implementation
14. src/game/setup.ts                 — wiring
15. src/components/game-canvas.tsx     — canvas mount
16. src/components/hud/score-display.tsx
17. src/components/menus/start-menu.tsx
18. src/components/menus/game-over-screen.tsx
19. src/App.tsx                        — shell (replace existing)
20. Delete src/components/Counter.tsx and src/store/counter.ts
```

### 12. Useful Primitives for Drawing

When rendering with Canvas2D, use these shape helpers:

| Shape | How to Draw | Entity Properties |
|-------|------------|-------------------|
| Rectangle | `ctx.fillRect(x, y, w, h)` | x, y, width, height |
| Circle | `ctx.arc(x, y, radius, 0, Math.PI*2)` | x, y, width (diameter) |
| Triangle | `ctx.moveTo/lineTo` 3 points | x, y, width, height (bounding box) |
| Line | `ctx.moveTo(x1,y1); ctx.lineTo(x2,y2)` | start, end points |

### 13. Responsive Canvas

```typescript
// In game/setup.ts or renderer
function getCanvasSize(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  return {
    width: rect.width,
    height: rect.height,
    dpr,
  };
}
// Set canvas.width = width * dpr, canvas.style.width = width + 'px'
// Scale context: ctx.scale(dpr, dpr)
```
