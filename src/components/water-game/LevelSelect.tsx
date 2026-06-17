/**
 * LevelSelect Component
 * Main menu with level selection grid
 */

import React from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore, waterGameActions } from '../../store/water-game-store';
import { LEVELS, getLevelsByCategory } from '../../game/water-levels';
import type { Level } from '../../types/water-game';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onViewStats: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onSelectLevel,
  onViewStats,
}) => {
  const state = useSelector(waterGameStore, (s) => s);

  const getLevelStatus = (levelId: number) => {
    const isUnlocked = state.unlockedLevels.includes(levelId);
    const levelStats = state.statistics.levels[levelId];
    const isCompleted = levelStats?.completed ?? false;
    return { isUnlocked, isCompleted };
  };

  const renderLevelCard = (level: Level) => {
    const { isUnlocked, isCompleted } = getLevelStatus(level.id);
    const levelStats = state.statistics.levels[level.id];

    return (
      <button
        key={level.id}
        onClick={() => isUnlocked && onSelectLevel(level.id)}
        disabled={!isUnlocked}
        className={`
          relative p-4 rounded-xl transition-all duration-200
          flex flex-col items-center gap-2
          ${isUnlocked
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 cursor-pointer transform hover:scale-105'
            : 'bg-gray-900 bg-opacity-50 cursor-not-allowed opacity-50'
          }
          ${isCompleted ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
          border-2 border-gray-700
        `}
      >
        {/* Level Number */}
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
            ${level.category === 'easy'
              ? 'bg-green-900 text-green-400'
              : level.category === 'medium'
              ? 'bg-yellow-900 text-yellow-400'
              : 'bg-red-900 text-red-400'
            }
          `}
        >
          {level.id}
        </div>

        {/* Level Name */}
        <div className="text-sm font-semibold text-gray-300 text-center">
          {level.name}
        </div>

        {/* Category Badge */}
        <div
          className={`
            text-xs px-2 py-1 rounded-full font-medium
            ${level.category === 'easy'
              ? 'bg-green-900 text-green-400'
              : level.category === 'medium'
              ? 'bg-yellow-900 text-yellow-400'
              : 'bg-red-900 text-red-400'
            }
          `}
        >
          {level.category === 'easy' && 'Лёгкий'}
          {level.category === 'medium' && 'Средний'}
          {level.category === 'hard' && 'Сложный'}
        </div>

        {/* Goal */}
        <div className="text-xs text-gray-400">
          Цель: {level.goal} мл
        </div>

        {/* Best Stats */}
        {isCompleted && levelStats && (
          <div className="text-xs text-gray-500 mt-1">
            {levelStats.bestMoves !== null && (
              <div>Лучшее: {levelStats.bestMoves} ход.</div>
            )}
            {levelStats.bestTime !== null && (
              <div>Время: {Math.floor(levelStats.bestTime / 60)}:{(levelStats.bestTime % 60).toString().padStart(2, '0')}</div>
            )}
          </div>
        )}

        {/* Lock Icon */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 rounded-xl">
            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  const easyLevels = getLevelsByCategory('easy');
  const mediumLevels = getLevelsByCategory('medium');
  const hardLevels = getLevelsByCategory('hard');

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Переливашки
        </h1>
        <p className="text-gray-400 text-lg">
          Логическая игра с водой и сосудами
        </p>
      </div>

      {/* Main Menu Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={onViewStats}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Статистика
          </div>
        </button>
      </div>

      {/* Easy Levels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Лёгкие уровни
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {easyLevels.map(renderLevelCard)}
        </div>
      </div>

      {/* Medium Levels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Средние уровни
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {mediumLevels.map(renderLevelCard)}
        </div>
      </div>

      {/* Hard Levels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Сложные уровни
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {hardLevels.map(renderLevelCard)}
        </div>
      </div>
    </div>
  );
};
