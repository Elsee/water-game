import { GameLoop } from '../engine/core/game-loop';
import { World } from '../engine/core/world';
import { EventBus } from '../engine/core/event-bus';
import { InputSystem } from '../engine/systems/input-system';
import { MovementSystem } from '../engine/systems/movement-system';
import { CollisionSystem } from '../engine/systems/collision-system';
import { BoundsSystem } from '../engine/systems/bounds-system';
import { Canvas2DRenderer } from '../renderer/canvas2d-renderer';
import { RectEntity } from '../engine/entities/rect-entity';
import { GAME_CONFIG } from './config';
import type { BaseEntity } from '../engine/entities/base-entity';

export interface GameInstance {
  cleanup: () => void;
  world: World;
  inputSystem: InputSystem;
}

export function setupGame(container: HTMLElement): GameInstance {
  // Initialize renderer
  const renderer = new Canvas2DRenderer();
  renderer.init(container, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

  // Initialize core systems
  const eventBus = new EventBus();
  const world = new World();
  const inputSystem = new InputSystem(container as HTMLCanvasElement);
  const movementSystem = new MovementSystem();
  const collisionSystem = new CollisionSystem(eventBus);
  const boundsSystem = new BoundsSystem({
    mode: 'clamp',
    width: GAME_CONFIG.canvasWidth,
    height: GAME_CONFIG.canvasHeight,
  });

  // Create game loop
  const gameLoop = new GameLoop(
    // Update function (fixed timestep)
    (dt: number) => {
      // Update systems in order
      movementSystem.update(world.getAllEntities(), dt);
      boundsSystem.update(world.getAllEntities());
      collisionSystem.update(world.getAllEntities());

      // Cleanup dead entities
      world.cleanup();
    },
    // Render function (with interpolation)
    (_interpolation: number) => {
      renderer.render(world.getAllEntities());
    }
  );

  // Start the game loop
  gameLoop.start();

  // Listen for game events
  eventBus.on('collision', (data: { entity1: string; entity2: string }) => {
    // Handle collisions here - customize per game
    console.log('Collision:', data);
  });

  // Return cleanup function and game instance
  return {
    cleanup: () => {
      gameLoop.stop();
      renderer.destroy();
      inputSystem.destroy();
      eventBus.clear();
      world.clear();
    },
    world,
    inputSystem,
  };
}

// Helper to create common entities
export function createPlayer(x: number, y: number): BaseEntity {
  return new RectEntity({
    x,
    y,
    width: GAME_CONFIG.playerSize,
    height: GAME_CONFIG.playerSize,
    color: GAME_CONFIG.playerColor,
    tags: ['player'],
  });
}

export function createEnemy(x: number, y: number): BaseEntity {
  return new RectEntity({
    x,
    y,
    width: GAME_CONFIG.enemySize,
    height: GAME_CONFIG.enemySize,
    color: GAME_CONFIG.enemyColor,
    velocity: { x: 0, y: GAME_CONFIG.enemySpeed },
    tags: ['enemy'],
  });
}
