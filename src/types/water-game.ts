/**
 * Water Puzzle Game Types
 * Types and interfaces for the water pouring puzzle game
 */

/**
 * Represents a single vessel (container) with water
 */
export interface Vessel {
  id: number;
  capacity: number;  // Maximum capacity in ml
  current: number;   // Current water amount in ml
  color: string;     // Neon color for water visualization
}

/**
 * A single action that can be undone
 */
export interface GameAction {
  type: 'fill' | 'empty' | 'pour';
  vesselId: number;
  targetVesselId?: number;  // For pour actions
  previousState: Vessel[];  // State before action for undo
}

/**
 * Level definition
 */
export interface Level {
  id: number;
  name: string;
  category: 'easy' | 'medium' | 'hard';
  vessels: { capacity: number; initial: number; color: string }[];
  goal: number;  // Target amount to achieve in any vessel
  minMoves?: number;  // Optional hint for minimum moves
}

/**
 * Game status
 */
export type WaterGameStatus = 'menu' | 'playing' | 'won' | 'stats';

/**
 * Statistics for a single level
 */
export interface LevelStats {
  completed: boolean;
  bestMoves: number | null;
  bestTime: number | null;  // in seconds
  bestStars: number | null;  // 0-3 stars based on performance
  attempts: number;
}

/**
 * Overall game statistics
 */
export interface GameStatistics {
  levels: Record<number, LevelStats>;
  totalTimePlayed: number;  // in seconds
  totalMoves: number;
}

/**
 * Current game state
 */
export interface WaterGameState {
  status: WaterGameStatus;
  currentLevelId: number | null;
  vessels: Vessel[];
  moves: number;
  timeElapsed: number;  // in seconds
  selectedVesselId: number | null;  // For pour operation
  actionHistory: GameAction[];
  statistics: GameStatistics;
  unlockedLevels: number[];  // IDs of unlocked levels
  isNewRecord?: boolean;  // Flag set when level is completed with new best moves/time
}

/**
 * Action types for game operations
 */
export type WaterGameAction =
  | { type: 'SELECT_VESSEL'; payload: number }
  | { type: 'FILL_VESSEL'; payload: number }
  | { type: 'EMPTY_VESSEL'; payload: number }
  | { type: 'POUR_VESSEL'; payload: { from: number; to: number } }
  | { type: 'CANCEL_SELECTION' }
  | { type: 'UNDO' }
  | { type: 'RESTART_LEVEL' }
  | { type: 'START_LEVEL'; payload: number }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'SHOW_STATS' }
  | { type: 'TICK_TIMER' }
  | { type: 'LEVEL_COMPLETE' };
