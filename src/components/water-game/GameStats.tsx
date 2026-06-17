/**
 * GameStats Component
 * Statistics screen showing player progress and best results
 */

import React from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore, waterGameActions } from '../../store/water-game-store';
import { LEVELS } from '../../game/water-levels';
import { formatTime } from '../../engine/water-game-logic';

export const GameStats: React.FC = () => {
  const state = useSelector(waterGameStore, (s) => s);

  const completedLevels = LEVELS.filter(
    (level) => state.statistics.levels[level.id]?.completed
  );
  const completionRate = Math.round(
    (completedLevels.length / LEVELS.length) * 100
  );

  const totalBestMoves = LEVELS.reduce((sum, level) => {
    const levelStats = state.statistics.levels[level.id];
    return sum + (levelStats?.bestMoves ?? 0);
  }, 0);

  const totalBestTime = LEVELS.reduce((sum, level) => {
    const levelStats = state.statistics.levels[level.id];
    return sum + (levelStats?.bestTime ?? 0);
  }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
          Статистика
        </h1>
        <p className="text-gray-400">Ваши достижения и рекорды</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Completed Levels */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl shadow-lg">
          <div className="text-green-300 text-sm uppercase tracking-wider mb-2">
            Пройдено уровней
          </div>
          <div className="text-4xl font-bold text-white">
            {completedLevels.length} / {LEVELS.length}
          </div>
          <div className="mt-2 text-green-400 text-sm">
            {completionRate}% завершение
          </div>
        </div>

        {/* Total Moves */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl shadow-lg">
          <div className="text-purple-300 text-sm uppercase tracking-wider mb-2">
            Всего ходов
          </div>
          <div className="text-4xl font-bold text-white">
            {state.statistics.totalMoves}
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl shadow-lg">
          <div className="text-blue-300 text-sm uppercase tracking-wider mb-2">
            Всего времени
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatTime(state.statistics.totalTimePlayed)}
          </div>
        </div>

        {/* Best Combined */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-6 rounded-xl shadow-lg">
          <div className="text-yellow-300 text-sm uppercase tracking-wider mb-2">
            Лучшее время
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatTime(totalBestTime)}
          </div>
          <div className="mt-1 text-yellow-400 text-xs">
            {totalBestMoves} ходов (сумма)
          </div>
        </div>
      </div>

      {/* Level Details */}
      <div className="bg-gray-800 bg-opacity-80 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Детали по уровням</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Уровень</th>
                <th className="pb-3 text-gray-400 font-medium">Категория</th>
                <th className="pb-3 text-gray-400 font-medium">Статус</th>
                <th className="pb-3 text-gray-400 font-medium">Лучшие ходы</th>
                <th className="pb-3 text-gray-400 font-medium">Лучшее время</th>
                <th className="pb-3 text-gray-400 font-medium">Попыток</th>
              </tr>
            </thead>
            <tbody>
              {LEVELS.map((level) => {
                const levelStats = state.statistics.levels[level.id];
                const isCompleted = levelStats?.completed ?? false;

                return (
                  <tr
                    key={level.id}
                    className="border-b border-gray-700 last:border-b-0"
                  >
                    <td className="py-3 text-white font-medium">
                      {level.id}. {level.name}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          level.category === 'easy'
                            ? 'bg-green-900 text-green-400'
                            : level.category === 'medium'
                            ? 'bg-yellow-900 text-yellow-400'
                            : 'bg-red-900 text-red-400'
                        }`}
                      >
                        {level.category === 'easy' && 'Лёгкий'}
                        {level.category === 'medium' && 'Средний'}
                        {level.category === 'hard' && 'Сложный'}
                      </span>
                    </td>
                    <td className="py-3">
                      {isCompleted ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Пройден
                        </span>
                      ) : (
                        <span className="text-gray-500">Не пройден</span>
                      )}
                    </td>
                    <td className="py-3 text-white font-mono">
                      {levelStats?.bestMoves ?? '—'}
                    </td>
                    <td className="py-3 text-white font-mono">
                      {levelStats?.bestTime !== null
                        ? formatTime(levelStats.bestTime)
                        : '—'}
                    </td>
                    <td className="py-3 text-gray-400">
                      {levelStats?.attempts ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => waterGameActions.backToMenu()}
          className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Назад в меню
        </button>
      </div>
    </div>
  );
};
