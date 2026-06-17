/**
 * Water Game Store
 * TanStack Store for managing water puzzle game state
 * Bridge between game engine and React UI
 */

import { Store } from '@tanstack/store';
import type {
  WaterGameState,
  WaterGameAction,
  Vessel,
  GameAction,
  LevelStats,
  GameStatistics,
} from '../types/water-game';
import {
  cloneVessels,
  fillVessel,
  emptyVessel,
  pourVessels,
  checkWinCondition,
  createAction,
} from '../engine/water-game-logic';
import { getLevelById, getNextLevelId, LEVELS } from '../game/water-levels';

const STORAGE_KEY = 'water-puzzle-game-save';
const STATS_KEY = 'water-puzzle-game-stats';

/**
 * Load saved game state from localStorage
 */
function loadSavedGame(): Partial<WaterGameState> | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved game:', e);
  }
  return null;
}

/**
 * Load statistics from localStorage
 */
function loadStatistics(): GameStatistics {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load statistics:', e);
  }

  // Default statistics
  return {
    levels: {},
    totalTimePlayed: 0,
    totalMoves: 0,
  };
}

/**
 * Save game state to localStorage
 */
function saveGame(state: WaterGameState) {
  try {
    const toSave: Partial<WaterGameState> = {
      currentLevelId: state.currentLevelId,
      unlockedLevels: state.unlockedLevels,
      statistics: state.statistics,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

/**
 * Save statistics to localStorage
 */
function saveStatistics(stats: GameStatistics) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save statistics:', e);
  }
}

/**
 * Initialize game state
 */
function getInitialState(): WaterGameState {
  const saved = loadSavedGame();
  const statistics = loadStatistics();

  return {
    status: 'menu',
    currentLevelId: null,
    vessels: [],
    moves: 0,
    timeElapsed: 0,
    selectedVesselId: null,
    actionHistory: [],
    statistics,
    unlockedLevels: saved?.unlockedLevels || [1], // First level always unlocked
  };
}

/**
 * Create initial level stats if not exists
 */
function getOrCreateLevelStats(
  stats: GameStatistics,
  levelId: number
): LevelStats {
  if (!stats.levels[levelId]) {
    stats.levels[levelId] = {
      completed: false,
      bestMoves: null,
      bestTime: null,
      attempts: 0,
    };
  }
  return stats.levels[levelId];
}

/**
 * Water Game Store
 */
export const waterGameStore = new Store<WaterGameState>(getInitialState());

/**
 * Game actions - called by game logic
 */
export const waterGameActions = {
  /**
   * Select a vessel (first click for pour operation)
   */
  selectVessel: (vesselId: number) => {
    waterGameStore.setState((state) => {
      const newState = { ...state };

      if (state.selectedVesselId === vesselId) {
        // Deselect if clicking same vessel
        newState.selectedVesselId = null;
      } else {
        // Select vessel
        newState.selectedVesselId = vesselId;
      }

      return newState;
    });
  },

  /**
   * Fill a vessel to maximum
   */
  fillVessel: (vesselId: number) => {
    waterGameStore.setState((state) => {
      if (state.status !== 'playing') return state;

      const vessel = state.vessels.find((v) => v.id === vesselId);
      if (!vessel || vessel.current === vessel.capacity) {
        return state; // Already full or doesn't exist
      }

      const previousState = cloneVessels(state.vessels);
      const newVessels = fillVessel(state.vessels, vesselId);
      const action = createAction('fill', vesselId, previousState);

      const newState: WaterGameState = {
        ...state,
        vessels: newVessels,
        moves: state.moves + 1,
        actionHistory: [...state.actionHistory, action],
        selectedVesselId: null,
      };

      // Check win condition
      const level = getLevelById(state.currentLevelId!);
      if (level && checkWinCondition(newVessels, level.goal)) {
        return handleLevelComplete(newState);
      }

      return newState;
    });
  },

  /**
   * Empty a vessel completely
   */
  emptyVessel: (vesselId: number) => {
    waterGameStore.setState((state) => {
      if (state.status !== 'playing') return state;

      const vessel = state.vessels.find((v) => v.id === vesselId);
      if (!vessel || vessel.current === 0) {
        return state; // Already empty or doesn't exist
      }

      const previousState = cloneVessels(state.vessels);
      const newVessels = emptyVessel(state.vessels, vesselId);
      const action = createAction('empty', vesselId, previousState);

      const newState: WaterGameState = {
        ...state,
        vessels: newVessels,
        moves: state.moves + 1,
        actionHistory: [...state.actionHistory, action],
        selectedVesselId: null,
      };

      // Check win condition
      const level = getLevelById(state.currentLevelId!);
      if (level && checkWinCondition(newVessels, level.goal)) {
        return handleLevelComplete(newState);
      }

      return newState;
    });
  },

  /**
   * Pour from one vessel to another
   */
  pourVessels: (fromId: number, toId: number) => {
    waterGameStore.setState((state) => {
      if (state.status !== 'playing') return state;

      const fromVessel = state.vessels.find((v) => v.id === fromId);
      const toVessel = state.vessels.find((v) => v.id === toId);

      if (!fromVessel || !toVessel || fromId === toId) {
        return state;
      }

      // Check if pour is possible
      const availableSpace = toVessel.capacity - toVessel.current;
      if (fromVessel.current === 0 || availableSpace === 0) {
        return state; // Nothing to pour or no space
      }

      const previousState = cloneVessels(state.vessels);
      const newVessels = pourVessels(state.vessels, fromId, toId);
      const action = createAction('pour', fromId, previousState, toId);

      const newState: WaterGameState = {
        ...state,
        vessels: newVessels,
        moves: state.moves + 1,
        actionHistory: [...state.actionHistory, action],
        selectedVesselId: null,
      };

      // Check win condition
      const level = getLevelById(state.currentLevelId!);
      if (level && checkWinCondition(newVessels, level.goal)) {
        return handleLevelComplete(newState);
      }

      return newState;
    });
  },

  /**
   * Cancel vessel selection
   */
  cancelSelection: () => {
    waterGameStore.setState((state) => ({
      ...state,
      selectedVesselId: null,
    }));
  },

  /**
   * Undo last action
   */
  undo: () => {
    waterGameStore.setState((state) => {
      if (state.actionHistory.length === 0) return state;

      const newHistory = [...state.actionHistory];
      const lastAction = newHistory.pop()!;

      return {
        ...state,
        vessels: cloneVessels(lastAction.previousState),
        moves: state.moves - 1,
        actionHistory: newHistory,
        selectedVesselId: null,
      };
    });
  },

  /**
   * Start a level
   */
  startLevel: (levelId: number) => {
    const level = getLevelById(levelId);
    if (!level) return;

    waterGameStore.setState((state) => {
      // Import vessels from level definition
      const initialVessels = level.vessels.map((v, index) => ({
        id: index,
        capacity: v.capacity,
        current: v.initial,
        color: v.color,
      }));

      // Update level stats (increment attempts)
      const newStats = { ...state.statistics };
      const levelStats = getOrCreateLevelStats(newStats, levelId);
      levelStats.attempts += 1;

      return {
        ...state,
        status: 'playing',
        currentLevelId: levelId,
        vessels: initialVessels,
        moves: 0,
        timeElapsed: 0,
        selectedVesselId: null,
        actionHistory: [],
        statistics: newStats,
      };
    });
  },

  /**
   * Restart current level
   */
  restartLevel: () => {
    waterGameStore.setState((state) => {
      if (!state.currentLevelId) return state;

      const level = getLevelById(state.currentLevelId);
      if (!level) return state;

      const initialVessels = level.vessels.map((v, index) => ({
        id: index,
        capacity: v.capacity,
        current: v.initial,
        color: v.color,
      }));

      return {
        ...state,
        vessels: initialVessels,
        moves: 0,
        timeElapsed: 0,
        selectedVesselId: null,
        actionHistory: [],
      };
    });
  },

  /**
   * Return to main menu
   */
  returnToMenu: () => {
    waterGameStore.setState((state) => {
      // Save progress before leaving
      saveGame(state);

      return {
        ...state,
        status: 'menu',
        currentLevelId: null,
        vessels: [],
        moves: 0,
        timeElapsed: 0,
        selectedVesselId: null,
        actionHistory: [],
      };
    });
  },

  /**
   * Show statistics screen
   */
  showStats: () => {
    waterGameStore.setState((state) => ({
      ...state,
      status: 'stats',
    }));
  },

  /**
   * Timer tick (called every second during gameplay)
   */
  tickTimer: () => {
    waterGameStore.setState((state) => {
      if (state.status !== 'playing') return state;

      return {
        ...state,
        timeElapsed: state.timeElapsed + 1,
      };
    });
  },

  /**
   * Go back from stats to menu
   */
  backToMenu: () => {
    waterGameStore.setState((state) => ({
      ...state,
      status: 'menu',
    }));
  },
};

/**
 * Handle level completion
 */
function handleLevelComplete(state: WaterGameState): WaterGameState {
  const level = getLevelById(state.currentLevelId!);
  if (!level) return state;

  const newStats = { ...state.statistics };
  const levelStats = getOrCreateLevelStats(newStats, state.currentLevelId!);

  // Update best moves
  if (
    levelStats.bestMoves === null ||
    state.moves < levelStats.bestMoves
  ) {
    levelStats.bestMoves = state.moves;
  }

  // Update best time
  if (
    levelStats.bestTime === null ||
    state.timeElapsed < levelStats.bestTime
  ) {
    levelStats.bestTime = state.timeElapsed;
  }

  levelStats.completed = true;

  // Update total stats
  newStats.totalTimePlayed += state.timeElapsed;
  newStats.totalMoves += state.moves;

  // Unlock next level
  const nextLevelId = getNextLevelId(level.id);
  const newUnlockedLevels = [...state.unlockedLevels];
  if (nextLevelId && !newUnlockedLevels.includes(nextLevelId)) {
    newUnlockedLevels.push(nextLevelId);
  }

  const newState: WaterGameState = {
    ...state,
    status: 'won',
    statistics: newStats,
    unlockedLevels: newUnlockedLevels,
  };

  // Save progress
  saveGame(newState);
  saveStatistics(newStats);

  return newState;
}

/**
 * Auto-unlock all levels (for testing)
 */
export const unlockAllLevels = () => {
  waterGameStore.setState((state) => ({
    ...state,
    unlockedLevels: LEVELS.map((l) => l.id),
  }));
};
