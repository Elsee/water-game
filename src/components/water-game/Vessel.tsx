/**
 * Vessel Component
 * Displays a single vessel with SVG flask and water level visualization
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

  // SVG coordinates: water area is from y=40 (top) to y=125 (bottom), height = 85
  // Increased flask height by 50% for better visibility
  const WATER_AREA_TOP = 40;
  const WATER_AREA_BOTTOM = 190;  // Was 125, increased by 65 (50% of 85)
  const WATER_AREA_HEIGHT = 150;  // Was 85, increased by 50%

  // Calculate water level Y position
  const waterLevelY = WATER_AREA_BOTTOM - (fillPercentage / 100) * WATER_AREA_HEIGHT;
  
  // Calculate goal marker Y position (same formula as tick marks - from bottom)
  const goalMarkerY = goalAmount > 0 && goalAmount <= vessel.capacity
    ? WATER_AREA_BOTTOM - (goalAmount / vessel.capacity) * WATER_AREA_HEIGHT
    : 0;
  
  // Show goal marker only when it's visible (within flask body)
  const showGoalMarkerLine = showGoalMarker && goalAmount > 0 && goalAmount <= vessel.capacity;
  
  // Calculate arrow points for goal marker
  const arrowPoints = `10,${goalMarkerY - 4} 10,${goalMarkerY + 4} 14,${goalMarkerY}`;

  // Generate dynamic tick marks based on capacity
  const tickInterval = vessel.capacity >= 20 ? 5 : vessel.capacity >= 10 ? 2 : 1;
  const tickMarks = [];
  for (let ml = 0; ml <= vessel.capacity; ml += tickInterval) {
    const y = WATER_AREA_BOTTOM - (ml / vessel.capacity) * WATER_AREA_HEIGHT;
    tickMarks.push({ ml, y });
  }

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
        ${isSelected ? 'scale-110' : ''}
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
      style={{
        filter: isSelected
          ? `drop-shadow(0 0 10px ${vessel.color}) drop-shadow(0 0 20px ${vessel.color})`
          : undefined,
      }}
    >
      {/* SVG Flask */}
      <svg
        viewBox="0 0 100 200"
        className={`
          w-20 h-36 sm:w-24 sm:h-40 md:w-28 md:h-48
          drop-shadow-lg
          ${isSelected ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : ''}
        `}
      >
        {/* Glass flask outline */}
        <defs>
          <clipPath id={`flaskClip-${vessel.id}`}>
            {/* Flask body shape - beaker with narrow neck (updated for 50% height increase) */}
            <path d="M 35,10 L 65,10 L 65,25 L 80,40 L 80,190 L 20,190 L 20,40 L 35,25 Z" />
          </clipPath>
        </defs>

        {/* Flask body - glass container */}
        <path
          d="M 35,10 L 65,10 L 65,25 L 80,40 L 80,190 L 20,190 L 20,40 L 35,25 Z"
          fill="rgba(200,220,255,0.1)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Water inside flask */}
        {!isEmpty && (
          <g clipPath={`url(#flaskClip-${vessel.id})`}>
            {/* Water body - fills from bottom to waterLevel */}
            <rect
              x="20"
              y={waterLevelY}
              width="60"
              height={WATER_AREA_BOTTOM - waterLevelY}
              fill={vessel.color}
              opacity="0.85"
            />

            {/* Wave surface effect */}
            <ellipse
              cx="50"
              cy={waterLevelY}
              rx="30"
              ry="4"
              fill={vessel.color}
              opacity="0.7"
            >
              <animate
                attributeName="ry"
                values="3;5;3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Bubbles animation - rise from bottom to surface */}
            {fillPercentage > 20 && (
              <g>
                <circle cx="35" cy={WATER_AREA_BOTTOM - 10} r="2" fill="rgba(255,255,255,0.6)">
                  <animate attributeName="cy" values={`${WATER_AREA_BOTTOM - 10};${waterLevelY + 20};${waterLevelY}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.3;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy={WATER_AREA_BOTTOM - 15} r="1.5" fill="rgba(255,255,255,0.5)">
                  <animate attributeName="cy" values={`${WATER_AREA_BOTTOM - 15};${waterLevelY + 25};${waterLevelY + 5}`} dur="2.5s" begin="0.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.2;0" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle cx="65" cy={WATER_AREA_BOTTOM - 20} r="2.5" fill="rgba(255,255,255,0.7)">
                  <animate attributeName="cy" values={`${WATER_AREA_BOTTOM - 20};${waterLevelY + 15};${waterLevelY - 5}`} dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>
        )}

        {/* Measurement markings - dynamic based on capacity */}
        <g>
          {tickMarks.map((tick) => (
            <g key={tick.ml}>
              {/* Left side tick */}
              <line
                x1="10"
                y1={tick.y}
                x2="20"
                y2={tick.y}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth={tick.ml % (tickInterval * 2) === 0 ? "2" : "1"}
              />
              {/* Right side tick */}
              <line
                x1="80"
                y1={tick.y}
                x2="90"
                y2={tick.y}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth={tick.ml % (tickInterval * 2) === 0 ? "2" : "1"}
              />
              {/* Left side label (ml) */}
              {tick.ml % (tickInterval * 2) === 0 && (
                <text
                  x="8"
                  y={tick.y + 2.5}
                  fontSize="6"
                  fill="rgba(255,255,255,0.7)"
                  textAnchor="end"
                >
                  {tick.ml}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Goal marker line - shows target level on the side of flask */}
        {showGoalMarkerLine && (
          <g>
            {/* Horizontal line across flask */}
            <line
              x1="15"
              y1={goalMarkerY}
              x2="85"
              y2={goalMarkerY}
              stroke="#FBBF24"
              strokeWidth="2"
              strokeDasharray="4,2"
              opacity="0.8"
            />
            {/* Arrow marker on left side */}
            <polygon
              points={arrowPoints}
              fill="#FBBF24"
            />
            {/* Goal amount label */}
            <text
              x="88"
              y={goalMarkerY + 3}
              fontSize="7"
              fill="#FBBF24"
              fontWeight="bold"
            >
              {goalAmount}мл
            </text>
          </g>
        )}

        {/* Glass highlights for 3D effect */}
        <path
          d="M 25,45 L 25,185"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 75,45 L 75,185"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Current amount label below flask */}
      <div className="mt-1 text-center">
        <span
          className="text-lg font-bold drop-shadow-lg"
          style={{
            color: isEmpty ? '#9CA3AF' : vessel.color,
            textShadow: '0 0 8px rgba(0,0,0,0.5)',
          }}
        >
          {vessel.current} / {vessel.capacity}
        </span>
        <div className="text-xs text-gray-400 font-semibold">
          Сосуд {vessel.id + 1}
        </div>
      </div>

      {/* Goal achieved indicator */}
      {hasGoalAmount && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
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
