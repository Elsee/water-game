/**
 * GameHUD Component
 * Heads-up display showing moves, timer, level info, and goal
 */

import React from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore } from '../../store/water-game-store';
import { getLevelById } from '../../game/water-levels';
import { formatTime } from '../../engine/water-game-logic';

interface GameHUDProps {
  onMenuClick: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onMenuClick }) => {
  const state = useSelector(waterGameStore, (s) => s);
  const level = state.currentLevelId ? getLevelById(state.currentLevelId) : null;

  return (
    <div className="w-full max-w-6xl mx-auto mb-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-800 bg-opacity-80 rounded-xl p-4 shadow-lg">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Меню
        </button>

        {/* Level Info */}
        {level && (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Уровень</div>
              <div className="text-xl font-bold text-cyan-400">
                {level.id} / {level.name}
              </div>
            </div>
            <div className="hidden sm:block text-gray-600">|</div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Сложность</div>
              <div
                className={`text-lg font-bold ${
                  level.category === 'easy'
                    ? 'text-green-400'
                    : level.category === 'medium'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {level.category === 'easy' && 'Лёгкий'}
                {level.category === 'medium' && 'Средний'}
                {level.category === 'hard' && 'Сложный'}
              </div>
            </div>
          </div>
        )}

        {/* Spacer for mobile */}
        <div className="sm:hidden flex-1" />
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {/* Moves Counter */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-purple-900 to-purple-800 px-6 py-3 rounded-xl shadow-lg">
          <div className="p-2 bg-purple-700 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-purple-300 uppercase tracking-wider">Ходы</div>
            <div className="text-2xl font-bold text-white">{state.moves}</div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-blue-900 to-blue-800 px-6 py-3 rounded-xl shadow-lg">
          <div className="p-2 bg-blue-700 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-blue-300 uppercase tracking-wider">Время</div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatTime(state.timeElapsed)}
            </div>
          </div>
        </div>

        {/* Goal Display */}
        {level && (
          <div className="flex items-center gap-3 bg-gradient-to-br from-green-900 to-green-800 px-6 py-3 rounded-xl shadow-lg">
            <div className="p-2 bg-green-700 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-green-300 uppercase tracking-wider">Цель</div>
              <div className="text-2xl font-bold text-white">{level.goal} мл</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
