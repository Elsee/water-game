import { useEffect } from 'react';
import { Link } from 'wouter';
import { ButtonDesktop } from '@tui-react/button';
import { GameCanvas } from '../components/game-canvas';
import { ScoreDisplay } from '../components/hud/score-display';
import { LivesDisplay } from '../components/hud/lives-display';
import { StartMenu } from '../components/menus/start-menu';
import { PauseMenu } from '../components/menus/pause-menu';
import { GameOverScreen } from '../components/menus/game-over-screen';
import { gameStore, gameActions } from '../store/game-store';
import { useSelector } from '@tanstack/react-store';

export function GamePage() {
  const gameStatus = useSelector(gameStore, (state) => state.gameStatus);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (gameStatus === 'playing') {
          gameActions.pauseGame();
        } else if (gameStatus === 'paused') {
          gameActions.resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur">
        <Link href="/">
          <ButtonDesktop size="s" appearance="flat">
            ← Back to Home
          </ButtonDesktop>
        </Link>
        <h1 className="font-semibold">Game Template</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      {/* Game Canvas */}
      <GameCanvas />

      {/* HUD - only visible when playing */}
      {gameStatus === 'playing' && (
        <>
          <ScoreDisplay />
          <LivesDisplay />
        </>
      )}

      {/* Menus */}
      {gameStatus === 'menu' && <StartMenu title="Game Template" />}
      {gameStatus === 'paused' && <PauseMenu />}
      {gameStatus === 'gameover' && <GameOverScreen />}

      {/* Controls hint */}
      {gameStatus === 'playing' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm">
          Press <kbd className="px-2 py-1 rounded">ESC</kbd> to pause
        </div>
      )}
    </div>
  );
}
