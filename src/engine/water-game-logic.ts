/**
 * Water Game Logic Engine
 * Pure TypeScript game logic - NO React imports
 * Handles all water pouring puzzle mechanics
 */

import type { Vessel, Level, GameAction } from '../types/water-game';

/**
 * Deep clone vessels array for immutable state updates
 */
export function cloneVessels(vessels: Vessel[]): Vessel[] {
  return vessels.map(v => ({ ...v }));
}

/**
 * Fill a vessel to its maximum capacity
 */
export function fillVessel(vessels: Vessel[], vesselId: number): Vessel[] {
  const cloned = cloneVessels(vessels);
  const vessel = cloned.find(v => v.id === vesselId);
  if (vessel && vessel.current < vessel.capacity) {
    vessel.current = vessel.capacity;
  }
  return cloned;
}

/**
 * Empty a vessel completely
 */
export function emptyVessel(vessels: Vessel[], vesselId: number): Vessel[] {
  const cloned = cloneVessels(vessels);
  const vessel = cloned.find(v => v.id === vesselId);
  if (vessel && vessel.current > 0) {
    vessel.current = 0;
  }
  return cloned;
}

/**
 * Pour water from one vessel to another
 * Pours until source is empty OR target is full
 */
export function pourVessels(
  vessels: Vessel[],
  fromId: number,
  toId: number
): Vessel[] {
  const cloned = cloneVessels(vessels);
  const fromVessel = cloned.find(v => v.id === fromId);
  const toVessel = cloned.find(v => v.id === toId);

  if (!fromVessel || !toVessel || fromId === toId) {
    return cloned;
  }

  // Calculate how much can be poured
  const availableSpace = toVessel.capacity - toVessel.current;
  const amountToPour = Math.min(fromVessel.current, availableSpace);

  if (amountToPour > 0) {
    fromVessel.current -= amountToPour;
    toVessel.current += amountToPour;
  }

  return cloned;
}

/**
 * Check if the goal is achieved in any vessel
 */
export function checkWinCondition(vessels: Vessel[], goal: number): boolean {
  return vessels.some(v => v.current === goal);
}

/**
 * Find all vessels that have exactly the goal amount
 */
export function findGoalVessels(vessels: Vessel[], goal: number): Vessel[] {
  return vessels.filter(v => v.current === goal);
}

/**
 * Validate if a level configuration is solvable
 * Basic validation - checks if goal is achievable with given vessels
 */
export function validateLevel(level: Level): { valid: boolean; error?: string } {
  // Check if goal is achievable with any vessel
  const canAchieveGoal = level.vessels.some(v => v.capacity >= level.goal);
  if (!canAchieveGoal) {
    return {
      valid: false,
      error: 'Goal amount exceeds all vessel capacities',
    };
  }

  // Check if initial state already has the goal
  const alreadyHasGoal = level.vessels.some(v => v.initial === level.goal);
  if (alreadyHasGoal && level.vessels.length > 1) {
    // This is okay if there are multiple vessels (might need to create goal in another)
    const goalVessels = level.vessels.filter(v => v.initial === level.goal);
    if (goalVessels.length === level.vessels.length) {
      return {
        valid: false,
        error: 'Level already solved at start',
      };
    }
  }

  return { valid: true };
}

/**
 * Create initial vessel state from level definition
 */
export function createVesselsFromLevel(level: Level): Vessel[] {
  return level.vessels.map((v, index) => ({
    id: index,
    capacity: v.capacity,
    current: v.initial,
    color: v.color,
  }));
}

/**
 * Create a game action for undo functionality
 */
export function createAction(
  type: 'fill' | 'empty' | 'pour',
  vesselId: number,
  previousState: Vessel[],
  targetVesselId?: number
): GameAction {
  return {
    type,
    vesselId,
    targetVesselId,
    previousState: cloneVessels(previousState),
  };
}

/**
 * Calculate fill percentage for UI rendering
 */
export function getFillPercentage(vessel: Vessel): number {
  if (vessel.capacity === 0) return 0;
  return (vessel.current / vessel.capacity) * 100;
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate stars based on moves compared to minMoves
 * 3★ = perfect (minMoves), 2★ = good (+2-3), 1★ = okay (+4-6), 0★ = too many moves
 */
export function calculateStars(moves: number, minMoves: number | undefined): number {
  if (!minMoves || minMoves <= 0) {
    return 1; // Always at least 1 star for completing
  }

  if (moves === minMoves) {
    return 3;
  }
  if (moves <= minMoves + 3) {
    return 2;
  }
  if (moves <= minMoves + 6) {
    return 1;
  }
  return 1; // Always at least 1 star for completing the level
}

/**
 * Get a descriptive text for the current action
 */
export function getActionDescription(
  action: GameAction,
  vessels: Vessel[]
): string {
  const vessel = vessels.find(v => v.id === action.vesselId);
  if (!vessel) return 'Unknown action';

  switch (action.type) {
    case 'fill':
      return `Fill vessel ${vessel.id + 1}`;
    case 'empty':
      return `Empty vessel ${vessel.id + 1}`;
    case 'pour': {
      const target = vessels.find(v => v.id === action.targetVesselId);
      if (target) {
        return `Pour from ${vessel.id + 1} to ${target.id + 1}`;
      }
      return 'Pour water';
    }
    default:
      return 'Unknown action';
  }
}
