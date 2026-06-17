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
  const [showRules, setShowRules] = React.useState(false);

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
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            {/* Stars */}
            {levelStats.bestStars !== null && (
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= levelStats.bestStars!
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-700 fill-gray-700'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
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
        <button
          onClick={() => setShowRules(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Правила
          </div>
        </button>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border-2 border-blue-500">
            {/* Close Button */}
            <button
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-6">
              Как играть
            </h2>

            {/* Rules */}
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <p>Нажмите на сосуд, чтобы выбрать его, затем на другой — чтобы перелить воду.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <p>Используйте кнопки <strong>«Наполнить»</strong> или <strong>«Вылить»</strong> для управления водой.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <p>Цель — получить указанное количество воды в любом сосуде.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">💧</span>
                </div>
                <p><strong>Вода не ограничена!</strong> Наполнять сосуды можно столько раз, сколько нужно. Каждый ход считается!</p>
              </div>
            </div>

            {/* Stars System */}
            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Система звёзд
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <svg key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold">Идеально!</span>
                  <span className="text-gray-400">— минимальное число ходов</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2].map((s) => (
                      <svg key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-700 fill-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-green-400 font-bold">Отлично!</span>
                  <span className="text-gray-400">— +2-3 хода</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-gray-700 fill-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-gray-700 fill-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-blue-400 font-bold">Хорошо!</span>
                  <span className="text-gray-400">— +4 хода и больше</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
              <p className="text-yellow-300 text-sm">
                💡 <strong>Совет:</strong> Планируйте ходы заранее! Используйте кнопку «Назад», чтобы отменить последний ход.
              </p>
            </div>
          </div>
        </div>
      )}

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
