/**
 * Vessel Component
 * Displays a single square vessel with water level visualization
 * Handles click interactions for selection and pouring
 */

import React from 'react';
import type { Vessel } from '../../types/water-game';
import { getFillPercentage } from '../../engine/water-game-logic';

interface VesselProps {
  vessel: Vessel;
  isSelected: boolean;
  isTarget: boolean;
  onClick: () => void;
  disabled?: boolean;
  showGoalMarker?: boolean;
  goalAmount?: number;
}

export const VesselComponent: React.FC<VesselProps> = ({
  vessel,
  isSelected,
  isTarget,
  onClick,
  disabled = false,
  showGoalMarker = false,
  goalAmount = 0,
}) => {
  const fillPercentage = getFillPercentage(vessel);
  const isEmpty = vessel.current === 0;
  const isFull = vessel.current === vessel.capacity;
  const hasGoalAmount = vessel.current === goalAmount && goalAmount > 0;

  // Calculate goal marker position
  const goalMarkerPosition = goalAmount > 0
    ? (goalAmount / vessel.capacity) * 100
    : 0;

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
        ${isSelected ? 'ring-4 ring-white ring-opacity-80 scale-110' : ''}
        ${isTarget ? 'ring-4 ring-green-400 ring-opacity-80 animate-pulse' : ''}
      `}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      aria-label={`Vessel ${vessel.id + 1}: ${vessel.current}ml / ${vessel.capacity}ml`}
    >
      {/* Vessel container */}
      <div
        className={`
          relative w-24 h-32 sm:w-28 sm:h-40 md:w-32 md:h-44
          bg-gray-900 bg-opacity-80
          border-4 border-gray-600
          rounded-lg sm:rounded-xl
          overflow-hidden
          shadow-lg
        `}
        style={{
          boxShadow: isSelected
            ? `0 0 20px ${vessel.color}, 0 0 40px ${vessel.color}`
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Water */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
          style={{
            height: `${fillPercentage}%`,
            backgroundColor: vessel.color,
            opacity: isEmpty ? 0 : 0.8,
            boxShadow: isEmpty ? 'none' : `0 0 20px ${vessel.color}`,
          }}
        >
          {/* Water surface wave effect */}
          {!isEmpty && (
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(to bottom, ${vessel.color}, transparent)`,
                opacity: 0.5,
              }}
            />
          )}

          {/* Bubbles animation */}
          {!isEmpty && fillPercentage > 20 && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white bg-opacity-60 rounded-full animate-bubble"
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: '0',
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Goal marker line */}
        {showGoalMarker && goalMarkerPosition > 0 && goalMarkerPosition < 100 && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10"
            style={{
              bottom: `${goalMarkerPosition}%`,
              boxShadow: '0 0 5px #fbbf24',
            }}
          >
            <span className="absolute -right-8 -top-1 text-xs text-yellow-400 font-bold">
              GOAL
            </span>
          </div>
        )}

        {/* Capacity markings */}
        <div className="absolute right-1 top-2 bottom-2 flex flex-col justify-between text-xs text-gray-500 font-mono opacity-50">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-px bg-gray-500"
              style={{ marginTop: i === 0 ? '0' : undefined }}
            />
          ))}
        </div>

        {/* Current amount label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`
              text-lg sm:text-xl font-bold drop-shadow-lg
              ${isEmpty || fillPercentage < 30 ? 'text-white' : 'text-white'}
            `}
            style={{
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            {vessel.current}
          </span>
        </div>

        {/* Capacity label at bottom */}
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-xs text-gray-400 font-mono">
            / {vessel.capacity}
          </span>
        </div>
      </div>

      {/* Vessel label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-semibold text-gray-300">
          Сосуд {vessel.id + 1}
        </span>
      </div>

      {/* Goal achieved indicator */}
      {hasGoalAmount && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
