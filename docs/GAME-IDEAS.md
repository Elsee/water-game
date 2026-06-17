# GAME-IDEAS.md — Game Catalog by Complexity

## 🟢 Simple (15-30 minutes, Canvas2D)

Games with minimal entities and systems. Perfect for learning the framework.

| Game | Description | Entities | Systems | Win/Lose |
|------|-------------|----------|---------|----------|
| **Pong** | Two players, ball, bounces | 2 paddles, 1 ball, 4 walls | Input, Movement, Collision, Score | First to 5 points |
| **Snake** | Snake eats and grows | Snake segments, food | Input, Movement, Collision, Spawn | Hit wall or self |
| **Catch** | Catch falling objects | 1 catcher, N falling items | Input, Movement, Collision, Spawn, Score | Miss 3 items |
| **Dodge** | Dodge falling obstacles | 1 player, N obstacles | Input, Movement, Collision, Spawn, Score | Hit obstacle |
| **Clicker** | Click appearing targets | N targets | Input (mouse), Spawn, Score | Time limit or target count |
| **Brick Breaker** | Single paddle, one ball | 1 paddle, 1 ball, N bricks | Input, Movement, Collision, Score | All bricks destroyed |
| **Gravity Ball** | Ball bounces with gravity | 1 ball, platforms | Input (tap), Movement (gravity), Collision, Score | Fall off screen |

### Pong Details
```
Entities: PlayerPaddle, AIPaddle, Ball, Wall(x4)
Systems: InputSystem (W/S, ↑/↓), MovementSystem, CollisionSystem (ball↔paddle, ball↔wall), ScoreSystem
Config: paddleSpeed: 300, ballSpeed: 200, winScore: 5
```

### Snake Details
```
Entities: SnakeSegment (array), Food
Systems: InputSystem (arrows), MovementSystem (grid-based), CollisionSystem (self, wall, food), SpawnSystem (new food)
Config: gridSize: 20, speed: 5, growOnEat: true
```

---

## 🟡 Medium (30-60 minutes, Canvas2D or Pixi)

Games with multiple entity types and more complex interactions.

| Game | Description | Entities | Systems | Win/Lose |
|------|-------------|----------|---------|----------|
| **Breakout** | Destroy all bricks | Paddle, ball, N bricks, walls | Input, Movement, Collision, Score, Level | All levels complete |
| **Asteroids** | Shoot asteroids | Ship, N asteroids, N bullets | Input, Movement, Collision, Spawn, Wrap | All asteroids destroyed |
| **Flappy Bird** | Fly between pipes | Bird, N pipe pairs, ground | Input (tap), Movement (gravity), Collision, Score | Hit pipe or ground |
| **Space Invaders** | Shoot rows of enemies | Ship, N enemies, N bullets | Input, Movement, Collision, Spawn, AI, Score | All enemies destroyed |
| **Fruit Ninja** | Slice flying fruits | N fruits, blade trail | Input (mouse), Movement (gravity), Collision | Slice bomb |
| **Platformer** | Jump across platforms | Player, N platforms, N coins, flag | Input, Movement, Gravity, Collision, Camera | Reach flag |
| **Shmup** | Vertical shooter | Player, N enemies, N bullets, powerups | Input, Movement, Collision, Spawn, Score | Survive waves |

### Breakout Details
```
Entities: Paddle, Ball, Brick(rows×cols), Wall(x3)
Systems: InputSystem (mouse/keyboard), MovementSystem, CollisionSystem (ball↔brick, ball↔paddle), ScoreSystem
Config: brickRows: 5, brickCols: 8, lives: 3, ballSpeed: 250
```

### Space Invaders Details
```
Entities: Player, Enemy(rows×cols), EnemyBullet, PlayerBullet
Systems: InputSystem (left/right, space), MovementSystem (enemy grid movement), CollisionSystem, SpawnSystem (bullets), ScoreSystem
Config: enemyRows: 4, enemyCols: 8, enemySpeed: 50, fireRate: 0.5
```

---

## 🔴 Complex (60-120 minutes, Pixi or Three)

Games with many entities, AI, or 3D rendering.

| Game | Description | Entities | Systems | Win/Lose |
|------|-------------|----------|---------|----------|
| **Tower Defense** | Build towers, defend base | N enemies, N towers, N bullets, path | Input, AI (pathfinding), Spawn, Collision, Economy | Survive 20 waves |
| **3D Maze** | Find maze exit | Player (camera), N walls, exit | Input, Movement, Collision, Camera (FPS) | Reach exit |
| **3D Dodger** | Fly through space | Ship, N asteroids | Input, Movement, Collision, Spawn, Camera (3rd person) | Survive as long as possible |
| **Racing** | Avoid traffic | Player car, N AI cars, track | Input, Movement, AI, Collision, Score | Reach distance goal |
| **Match-3** | Match colored gems | N gems (grid), cursor | Input (swap), Movement (animation), Collision (match detection), Score | Reach target score |
| **Physics Sandbox** | Drop and stack objects | N rigid bodies, walls | Input, Movement (physics), Collision, Constraints | N/A (sandbox) |

### Tower Defense Details
```
Entities: Enemy, Tower, Bullet, PathMarker
Systems: InputSystem (place tower), MovementSystem (enemy pathfinding), CollisionSystem (bullet↔enemy), SpawnSystem (waves), EconomySystem (money, tower cost)
Config: waves: 20, startingMoney: 100, towerCost: 50, enemyHealth: 3
```

### 3D Maze Details
```
Entities: Player (camera), Wall(cube), Exit(green cube)
Systems: InputSystem (WASD + mouse), MovementSystem (FPS controller), CollisionSystem (AABB), CameraSystem
Config: mazeSize: 10×10, wallHeight: 3, playerSpeed: 5, mouseSensitivity: 0.002
```

---

## 🎮 Multiplayer (Local)

Games for 2+ players on the same keyboard.

| Game | Players | Description |
|------|---------|-------------|
| **Pong** | 2 | Classic paddle vs paddle |
| **Tank Battle** | 2-4 | Tanks shoot each other in arena |
| **Racing** | 2 | Split-screen or shared screen race |
| **Fighter** | 2 | Simple fighting game with attacks |
| **Co-op Catch** | 2 | Two catchers, shared score |

---

## 🏆 Challenge Ideas

Add these to any game for extra complexity:

- **Power-ups**: Speed boost, size change, extra life, shield
- **Combos**: Consecutive hits multiply score
- **Boss fights**: Special enemy every N points
- **Level progression**: Different layouts, increasing difficulty
- **High score system**: Save best scores to localStorage
- **Achievements**: Unlock badges for milestones
- **Daily challenges**: Random seed-based daily games
- **Replay system**: Record and playback gameplay

---

## 📊 Complexity Matrix

```
Entity Count
    100+ │ Tower Defense    Space Invaders    Physics Sandbox
         │
     50+ │ Platformer       Shmup             3D Dodger
         │
     20+ │ Breakout         Asteroids         3D Maze
         │
     10+ │ Snake            Catch             Dodge
         │
      5+ │ Pong             Clicker           Gravity Ball
         │
         └────────┬────────────┬──────────────┬──────────────
              Simple        Medium        Complex
                         Development Time
```
