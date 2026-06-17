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

// Neon color palette for water
const NEON_COLORS = {
  blue: '#00f5ff',
  green: '#00ff88',
  purple: '#bb00ff',
  pink: '#ff0080',
  orange: '#ff8800',
  yellow: '#ffff00',
  cyan: '#00ffff',
  lime: '#ccff00',
} as const;

export const LEVELS: Level[] = [
  // ==================== EASY LEVELS (1-5) ====================
  {
    id: 1,
    name: 'Первый шаг',
    category: 'easy',
    vessels: [
      { capacity: 5, initial: 0, color: NEON_COLORS.blue },
      { capacity: 3, initial: 3, color: NEON_COLORS.green },
    ],
    goal: 4,
    minMoves: 7,
  },
  {
    id: 2,
    name: 'Простое переливание',
    category: 'easy',
    vessels: [
      { capacity: 8, initial: 0, color: NEON_COLORS.blue },
      { capacity: 5, initial: 5, color: NEON_COLORS.purple },
    ],
    goal: 4,
    minMoves: 6,
  },
  {
    id: 3,
    name: 'Точный расчёт',
    category: 'easy',
    vessels: [
      { capacity: 4, initial: 0, color: NEON_COLORS.cyan },
      { capacity: 9, initial: 9, color: NEON_COLORS.pink },
    ],
    goal: 6,
    minMoves: 8,
  },
  {
    id: 4,
    name: 'Три сосуда',
    category: 'easy',
    vessels: [
      { capacity: 3, initial: 0, color: NEON_COLORS.blue },
      { capacity: 5, initial: 0, color: NEON_COLORS.green },
      { capacity: 8, initial: 8, color: NEON_COLORS.purple },
    ],
    goal: 4,
    minMoves: 6,
  },
  {
    id: 5,
    name: 'Быстрая победа',
    category: 'easy',
    vessels: [
      { capacity: 7, initial: 0, color: NEON_COLORS.orange },
      { capacity: 4, initial: 4, color: NEON_COLORS.lime },
    ],
    goal: 3,
    minMoves: 3,
  },

  // ==================== MEDIUM LEVELS (6-10) ====================
  {
    id: 6,
    name: 'Четыре шага',
    category: 'medium',
    vessels: [
      { capacity: 3, initial: 0, color: NEON_COLORS.blue },
      { capacity: 5, initial: 0, color: NEON_COLORS.green },
      { capacity: 8, initial: 8, color: NEON_COLORS.purple },
    ],
    goal: 4,
    minMoves: 7,
  },
  {
    id: 7,
    name: 'Баланс',
    category: 'medium',
    vessels: [
      { capacity: 5, initial: 0, color: NEON_COLORS.cyan },
      { capacity: 8, initial: 0, color: NEON_COLORS.pink },
      { capacity: 12, initial: 12, color: NEON_COLORS.orange },
    ],
    goal: 6,
    minMoves: 8,
  },
  {
    id: 8,
    name: 'Комбинация',
    category: 'medium',
    vessels: [
      { capacity: 4, initial: 0, color: NEON_COLORS.blue },
      { capacity: 7, initial: 0, color: NEON_COLORS.green },
      { capacity: 10, initial: 10, color: NEON_COLORS.purple },
    ],
    goal: 5,
    minMoves: 7,
  },
  {
    id: 9,
    name: 'Переливашки',
    category: 'medium',
    vessels: [
      { capacity: 3, initial: 3, color: NEON_COLORS.lime },
      { capacity: 5, initial: 0, color: NEON_COLORS.cyan },
      { capacity: 8, initial: 0, color: NEON_COLORS.pink },
      { capacity: 10, initial: 10, color: NEON_COLORS.orange },
    ],
    goal: 6,
    minMoves: 9,
  },
  {
    id: 10,
    name: 'Средняя сложность',
    category: 'medium',
    vessels: [
      { capacity: 5, initial: 0, color: NEON_COLORS.blue },
      { capacity: 7, initial: 0, color: NEON_COLORS.green },
      { capacity: 9, initial: 0, color: NEON_COLORS.purple },
      { capacity: 15, initial: 15, color: NEON_COLORS.yellow },
    ],
    goal: 8,
    minMoves: 9,
  },

  // ==================== HARD LEVELS (11-15) ====================
  {
    id: 11,
    name: 'Пятиходовка',
    category: 'hard',
    vessels: [
      { capacity: 4, initial: 0, color: NEON_COLORS.blue },
      { capacity: 6, initial: 0, color: NEON_COLORS.green },
      { capacity: 9, initial: 0, color: NEON_COLORS.purple },
      { capacity: 15, initial: 15, color: NEON_COLORS.pink },
    ],
    goal: 7,
    minMoves: 10,
  },
  {
    id: 12,
    name: 'Мастер переливания',
    category: 'hard',
    vessels: [
      { capacity: 3, initial: 0, color: NEON_COLORS.cyan },
      { capacity: 5, initial: 0, color: NEON_COLORS.lime },
      { capacity: 8, initial: 0, color: NEON_COLORS.orange },
      { capacity: 12, initial: 12, color: NEON_COLORS.yellow },
    ],
    goal: 7,
    minMoves: 11,
  },
  {
    id: 13,
    name: 'Сложная комбинация',
    category: 'hard',
    vessels: [
      { capacity: 5, initial: 0, color: NEON_COLORS.blue },
      { capacity: 7, initial: 0, color: NEON_COLORS.green },
      { capacity: 9, initial: 0, color: NEON_COLORS.purple },
      { capacity: 11, initial: 0, color: NEON_COLORS.pink },
      { capacity: 20, initial: 20, color: NEON_COLORS.orange },
    ],
    goal: 13,
    minMoves: 12,
  },
  {
    id: 14,
    name: 'Виртуоз',
    category: 'hard',
    vessels: [
      { capacity: 4, initial: 0, color: NEON_COLORS.cyan },
      { capacity: 6, initial: 0, color: NEON_COLORS.lime },
      { capacity: 9, initial: 0, color: NEON_COLORS.blue },
      { capacity: 13, initial: 0, color: NEON_COLORS.purple },
      { capacity: 18, initial: 18, color: NEON_COLORS.yellow },
    ],
    goal: 10,
    minMoves: 13,
  },
  {
    id: 15,
    name: 'Легендарный уровень',
    category: 'hard',
    vessels: [
      { capacity: 3, initial: 0, color: NEON_COLORS.blue },
      { capacity: 5, initial: 0, color: NEON_COLORS.green },
      { capacity: 7, initial: 0, color: NEON_COLORS.purple },
      { capacity: 11, initial: 0, color: NEON_COLORS.pink },
      { capacity: 16, initial: 0, color: NEON_COLORS.orange },
      { capacity: 25, initial: 25, color: NEON_COLORS.lime },
    ],
    goal: 14,
    minMoves: 16,
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
