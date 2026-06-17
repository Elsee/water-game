import { Store } from '@tanstack/store';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  gameStatus: GameStatus;
  score: number;
  lives: number;
  level: number;
  message: string;
  highScore: number;
}

export const gameStore = new Store<GameState>({
  gameStatus: 'menu',
  score: 0,
  lives: 3,
  level: 1,
  message: '',
  highScore: 0,
});

export const gameActions = {
  startGame: () =>
    gameStore.setState((s) => ({
      ...s,
      gameStatus: 'playing',
      score: 0,
      lives: 3,
      level: 1,
      message: '',
    })),

  pauseGame: () =>
    gameStore.setState((s) => ({ ...s, gameStatus: 'paused' })),

  resumeGame: () =>
    gameStore.setState((s) => ({ ...s, gameStatus: 'playing' })),

  gameOver: (win: boolean) =>
    gameStore.setState((s) => {
      const newHighScore = Math.max(s.highScore, s.score);
      if (newHighScore !== s.highScore) {
        localStorage.setItem('highScore', String(newHighScore));
      }
      return {
        ...s,
        gameStatus: 'gameover',
        message: win ? 'You Win!' : 'Game Over',
        highScore: newHighScore,
      };
    }),

  addScore: (points: number) =>
    gameStore.setState((s) => ({ ...s, score: s.score + points })),

  loseLife: () =>
    gameStore.setState((s) => {
      const lives = s.lives - 1;
      return lives <= 0
        ? { ...s, lives: 0, gameStatus: 'gameover', message: 'Game Over' }
        : { ...s, lives };
    }),

  nextLevel: () =>
    gameStore.setState((s) => ({ ...s, level: s.level + 1 })),

  setMessage: (message: string) =>
    gameStore.setState((s) => ({ ...s, message })),

  setGameStatus: (gameStatus: GameStatus) =>
    gameStore.setState((s) => ({ ...s, gameStatus })),
};

// Load high score from localStorage on init
const savedHighScore = localStorage.getItem('highScore');
if (savedHighScore) {
  gameStore.setState((s) => ({ ...s, highScore: parseInt(savedHighScore, 10) }));
}
