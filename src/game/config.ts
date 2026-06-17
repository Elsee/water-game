// Game configuration - modify these values to customize your game

export const GAME_CONFIG = {
  // Canvas settings
  canvasWidth: 800,
  canvasHeight: 600,

  // Player settings
  playerSpeed: 300, // pixels per second
  playerSize: 20,
  playerColor: '#4CAF50',

  // Enemy settings
  enemySpeed: 100,
  enemySize: 20,
  enemyColor: '#F44336',

  // Projectile settings
  projectileSpeed: 500,
  projectileSize: 8,
  projectileColor: '#FFEB3B',

  // Game settings
  initialLives: 3,
  pointsPerKill: 100,
  spawnInterval: 2000, // milliseconds
};

export type GameConfig = typeof GAME_CONFIG;
