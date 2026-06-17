/**
 * WaterGamePage Component
 * Main page component for the water puzzle game
 * Handles game loop, timer, and screen routing
 */

import React, { useEffect, useCallback } from 'react';
import { useSelector } from '@tanstack/react-store';
import { waterGameStore, waterGameActions } from '../store/water-game-store';
import {
  GameBoard,
  GameHUD,
  LevelSelect,
  GameStats,
  WinScreen,
} from '../components/water-game';

export const WaterGamePage: React.FC = () => {
  const state = useSelector(waterGameStore, (s) => s);

  // Timer effect - runs every second during gameplay
  useEffect(() => {
    if (state.status !== 'playing') {
      return;
    }

    const intervalId = setInterval(() => {
      waterGameActions.tickTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.status]);

  // Handle level start
  const handleStartLevel = useCallback((levelId: number) => {
    waterGameActions.startLevel(levelId);
  }, []);

  // Handle return to menu
  const handleReturnToMenu = useCallback(() => {
    waterGameActions.returnToMenu();
  }, []);

  // Handle view stats
  const handleViewStats = useCallback(() => {
    waterGameActions.showStats();
  }, []);

  // Render based on game status
  const renderContent = () => {
    switch (state.status) {
      case 'menu':
        return (
          <LevelSelect
            onSelectLevel={handleStartLevel}
            onViewStats={handleViewStats}
          />
        );

      case 'playing':
        return (
          <>
            <GameHUD onMenuClick={handleReturnToMenu} />
            <GameBoard />
          </>
        );

      case 'won':
        return (
          <>
            <GameHUD onMenuClick={handleReturnToMenu} />
            <GameBoard />
            <WinScreen />
          </>
        );

      case 'stats':
        return <GameStats />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 bg-opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 bg-opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};
