/**
 * GameBoard Component
 * Main game area with vessels grid and action buttons
 */

import React from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore, waterGameActions } from '../../store/water-game-store';
import { VesselComponent } from './Vessel';
import { getLevelById } from '../../game/water-levels';

export const GameBoard: React.FC = () => {
  const state = useSelector(waterGameStore, (s) => s);
  const level = state.currentLevelId ? getLevelById(state.currentLevelId) : null;

  const handleVesselClick = (vesselId: number) => {
    if (state.selectedVesselId === null) {
      // First click - select source vessel
      waterGameActions.selectVessel(vesselId);
    } else if (state.selectedVesselId === vesselId) {
      // Clicking same vessel - deselect
      waterGameActions.cancelSelection();
    } else {
      // Second click on different vessel - pour
      waterGameActions.pourVessels(state.selectedVesselId, vesselId);
    }
  };

  const handleFill = () => {
    if (state.selectedVesselId !== null) {
      waterGameActions.fillVessel(state.selectedVesselId);
    }
  };

  const handleEmpty = () => {
    if (state.selectedVesselId !== null) {
      waterGameActions.emptyVessel(state.selectedVesselId);
    }
  };

  const handleCancel = () => {
    waterGameActions.cancelSelection();
  };

  const handleUndo = () => {
    waterGameActions.undo();
  };

  const handleRestart = () => {
    waterGameActions.restartLevel();
  };

  if (!level) {
    return null;
  }

  const canUndo = state.actionHistory.length > 0;
  const hasSelection = state.selectedVesselId !== null;
  const selectedVessel = state.vessels.find(v => v.id === state.selectedVesselId);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto">
      {/* Vessels Grid */}
      <div
        className={`
          grid gap-6 sm:gap-8 md:gap-10
          ${state.vessels.length <= 3 ? 'grid-cols-3' : ''}
          ${state.vessels.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : ''}
          ${state.vessels.length >= 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : ''}
        `}
      >
        {state.vessels.map((vessel) => (
          <VesselComponent
            key={vessel.id}
            vessel={vessel}
            isSelected={state.selectedVesselId === vessel.id}
            isTarget={false}
            onClick={() => handleVesselClick(vessel.id)}
            disabled={false}
            showGoalMarker={true}
            goalAmount={level.goal}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
        {/* Fill Button */}
        <button
          onClick={handleFill}
          disabled={!hasSelection || selectedVessel?.current === selectedVessel?.capacity}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg
            transition-all duration-200
            flex items-center gap-2
            ${hasSelection && selectedVessel?.current !== selectedVessel?.capacity
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Наполнить
        </button>

        {/* Empty Button */}
        <button
          onClick={handleEmpty}
          disabled={!hasSelection || selectedVessel?.current === 0}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg
            transition-all duration-200
            flex items-center gap-2
            ${hasSelection && selectedVessel?.current !== 0
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Вылить
        </button>

        {/* Cancel Selection Button */}
        <button
          onClick={handleCancel}
          disabled={!hasSelection}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg
            transition-all duration-200
            flex items-center gap-2
            ${hasSelection
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg hover:shadow-yellow-500/50'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Отмена
        </button>

        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg
            transition-all duration-200
            flex items-center gap-2
            ${canUndo
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/50'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Назад
        </button>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className="px-6 py-3 rounded-lg font-bold text-lg bg-gray-600 hover:bg-gray-500 text-white shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Заново
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg max-w-2xl text-center">
        <p className="text-gray-300 text-sm sm:text-base">
          {hasSelection
            ? (
              <>
                <span className="text-cyan-400 font-bold">Выбран сосуд {state.selectedVesselId + 1}</span> — нажмите на другой сосуд, чтобы перелить воду,
                или используйте кнопки выше
              </>
            )
            : (
              <>
                Нажмите на сосуд, чтобы выбрать его, затем нажмите на другой сосуд для переливания.
                Или используйте кнопки <span className="text-blue-400 font-bold">Наполнить</span> / <span className="text-red-400 font-bold">Вылить</span>
              </>
            )}
        </p>
      </div>
    </div>
  );
};
