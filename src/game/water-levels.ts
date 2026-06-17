/**
 * Water Puzzle Game Levels
 * 15+ levels divided into 3 difficulty categories
 * 
 * Level design principles:
 * - Easy: 2-3 vessels, 2-5 moves, simple solutions
 * - Medium: 3-4 vessels, 5-10 moves, moderate complexity
 * - Hard: 4-5 vessels, 10+ moves, multi-step combinations
 */

import type { Level } from '../types/water-game';

// Classic water color palette
const WATER_COLORS = {
  lightBlue: '#4FC3F7',    // Голубой - лёгкий уровень
  blue: '#2196F3',         // Синий - средний уровень
  deepBlue: '#1976D2',     // Глубокий синий - сложный уровень
  cyan: '#26C6DA',         // Бирюзовый - акцент
  green: '#4CAF50',        // Зелёный - для разнообразия
  purple: '#9C27B0',       // Фиолетовый - редкие уровни
} as const;

export const LEVELS: Level[] = [
  // ==================== EASY LEVELS (1-5) ====================
  {
    id: 1,
    name: 'Первый шаг',
    category: 'easy',
    vessels: [
      { capacity: 5, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 3, initial: 3, color: WATER_COLORS.green },
    ],
    goal: 4,
    minMoves: 7,
  },
  {
    id: 2,
    name: 'Начинающий',
    category: 'easy',
    vessels: [
      { capacity: 8, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 5, initial: 5, color: WATER_COLORS.purple },
    ],
    goal: 4,
    minMoves: 9,
  },
  {
    id: 3,
    name: 'Точный расчёт',
    category: 'easy',
    vessels: [
      { capacity: 4, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 9, initial: 9, color: WATER_COLORS.blue },
    ],
    goal: 6,
    minMoves: 7,
  },
  {
    id: 4,
    name: 'Три сосуда',
    category: 'easy',
    vessels: [
      { capacity: 3, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 5, initial: 0, color: WATER_COLORS.green },
      { capacity: 8, initial: 8, color: WATER_COLORS.blue },
    ],
    goal: 4,
    minMoves: 6,
  },
  {
    id: 5,
    name: 'Разминка',
    category: 'easy',
    vessels: [
      { capacity: 7, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 4, initial: 4, color: WATER_COLORS.green },
    ],
    goal: 3,
    minMoves: 3,
  },

  // ==================== MEDIUM LEVELS (6-10) ====================
  {
    id: 6,
    name: 'Средний уровень',
    category: 'medium',
    vessels: [
      { capacity: 3, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 5, initial: 0, color: WATER_COLORS.green },
      { capacity: 8, initial: 8, color: WATER_COLORS.blue },
    ],
    goal: 4,
    minMoves: 6,
  },
  {
    id: 7,
    name: 'Баланс',
    category: 'medium',
    vessels: [
      { capacity: 5, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 8, initial: 0, color: WATER_COLORS.purple },
      { capacity: 12, initial: 12, color: WATER_COLORS.deepBlue },
    ],
    goal: 6,
    minMoves: 6,
  },
  {
    id: 8,
    name: 'Комбинация',
    category: 'medium',
    vessels: [
      { capacity: 4, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 7, initial: 0, color: WATER_COLORS.green },
      { capacity: 10, initial: 10, color: WATER_COLORS.blue },
    ],
    goal: 5,
    minMoves: 6,
  },
  {
    id: 9,
    name: 'Переливашки',
    category: 'medium',
    vessels: [
      { capacity: 3, initial: 3, color: WATER_COLORS.green },
      { capacity: 5, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 8, initial: 0, color: WATER_COLORS.purple },
      { capacity: 10, initial: 10, color: WATER_COLORS.deepBlue },
    ],
    goal: 6,
    minMoves: 3,
  },
  {
    id: 10,
    name: 'Продвинутый',
    category: 'medium',
    vessels: [
      { capacity: 7, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 13, initial: 0, color: WATER_COLORS.green },
      { capacity: 20, initial: 20, color: WATER_COLORS.blue },
    ],
    goal: 11,
    minMoves: 12,
  },

  // ==================== HARD LEVELS (11-15) ====================
  {
    id: 11,
    name: 'Виртуоз',
    category: 'hard',
    vessels: [
      { capacity: 9, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 14, initial: 0, color: WATER_COLORS.green },
      { capacity: 22, initial: 22, color: WATER_COLORS.deepBlue },
    ],
    goal: 11,
    minMoves: 8,
  },
  {
    id: 12,
    name: 'Эксперт',
    category: 'hard',
    vessels: [
      { capacity: 8, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 15, initial: 0, color: WATER_COLORS.green },
      { capacity: 23, initial: 23, color: WATER_COLORS.blue },
    ],
    goal: 12,
    minMoves: 18,
  },
  {
    id: 13,
    name: 'Профессионал',
    category: 'hard',
    vessels: [
      { capacity: 9, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 16, initial: 0, color: WATER_COLORS.green },
      { capacity: 25, initial: 25, color: WATER_COLORS.deepBlue },
    ],
    goal: 13,
    minMoves: 13,
  },
  {
    id: 14,
    name: 'Гроссмейстер',
    category: 'hard',
    vessels: [
      { capacity: 10, initial: 0, color: WATER_COLORS.cyan },
      { capacity: 17, initial: 0, color: WATER_COLORS.green },
      { capacity: 27, initial: 27, color: WATER_COLORS.blue },
    ],
    goal: 19,
    minMoves: 19,
  },
  {
    id: 15,
    name: 'Легенда',
    category: 'hard',
    vessels: [
      { capacity: 13, initial: 0, color: WATER_COLORS.lightBlue },
      { capacity: 21, initial: 0, color: WATER_COLORS.green },
      { capacity: 34, initial: 34, color: WATER_COLORS.deepBlue },
    ],
    goal: 23,
    minMoves: 13,
  },
];

/**
 * Get level by ID
 */
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(level => level.id === id);
}

/**
 * Get levels by category
 */
export function getLevelsByCategory(
  category: 'easy' | 'medium' | 'hard'
): Level[] {
  return LEVELS.filter(level => level.category === category);
}

/**
 * Get next level ID (returns null if no next level)
 */
export function getNextLevelId(currentId: number): number | null {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1].id;
  }
  return null;
}

/**
 * Get total number of levels
 */
export function getTotalLevels(): number {
  return LEVELS.length;
}
