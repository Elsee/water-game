/**
 * WinScreen Component
 * Victory screen shown when level is completed
 */

import React, { useEffect } from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore, waterGameActions } from '../../store/water-game-store';
import { getLevelById, getNextLevelId } from '../../game/water-levels';
import { formatTime, calculateStars } from '../../engine/water-game-logic';

export const WinScreen: React.FC = () => {
  const state = useSelector(waterGameStore, (s) => s);
  const level = state.currentLevelId ? getLevelById(state.currentLevelId) : null;
  const nextLevelId = state.currentLevelId ? getNextLevelId(state.currentLevelId) : null;
  const nextLevel = nextLevelId ? getLevelById(nextLevelId) : null;

  const earnedStars = level ? calculateStars(state.moves, level.minMoves) : 0;

  // Auto-continue to next level after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Optional: auto-continue could be implemented here
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleNextLevel = () => {
    if (nextLevelId) {
      waterGameActions.startLevel(nextLevelId);
    }
  };

  const handleRetry = () => {
    waterGameActions.restartLevel();
    // Force status back to playing after restart
    setTimeout(() => {
      waterGameStore.setState((s) => ({ ...s, status: 'playing' }));
    }, 0);
  };

  const handleMenu = () => {
    waterGameActions.returnToMenu();
  };

  if (!level) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      {/* Confetti Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              backgroundColor: ['#00f5ff', '#00ff88', '#bb00ff', '#ff0080', '#ffff00'][
                i % 5
              ],
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Win Card */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-yellow-500">
        {/* Trophy Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg animate-bounce">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Уровень пройден!
          </h1>
          <p className="text-gray-400 mt-2">{level.name}</p>
          
          {/* Stars Rating */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((star) => (
              <svg
                key={star}
                className={`w-10 h-10 transition-all duration-300 ${
                  star <= earnedStars
                    ? 'text-yellow-400 fill-yellow-400 scale-110'
                    : 'text-gray-600 fill-gray-700'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {earnedStars === 3 && (
            <p className="text-yellow-400 text-sm mt-2 font-bold">Идеально! 🌟</p>
          )}
          {earnedStars === 2 && (
            <p className="text-green-400 text-sm mt-2 font-bold">Отлично! 👍</p>
          )}
          {earnedStars === 1 && (
            <p className="text-blue-400 text-sm mt-2 font-bold">Хорошо! 💪</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 uppercase">Ходы</div>
            <div className="text-2xl font-bold text-purple-400">{state.moves}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 uppercase">Время</div>
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {formatTime(state.timeElapsed)}
            </div>
          </div>
        </div>

        {/* New Record Badge */}
        {state.isNewRecord && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 mb-6 text-center shadow-lg animate-pulse">
            <div className="text-white text-sm uppercase tracking-wider font-bold">
              🎉 Новый рекорд! 🎉
            </div>
          </div>
        )}

        {/* Goal Achieved */}
        <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 mb-6 text-center">
          <div className="text-green-400 text-sm uppercase tracking-wider mb-1">
            Получено воды
          </div>
          <div className="text-3xl font-bold text-white">
            {level.goal} мл
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {nextLevel ? (
            <button
              onClick={handleNextLevel}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Следующий уровень
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
            <div className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white font-bold rounded-xl text-center shadow-lg">
              🎉 Все уровни пройдены! 🎉
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200"
            >
              Заново
            </button>
            <button
              onClick={handleMenu}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200"
            >
              В меню
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
