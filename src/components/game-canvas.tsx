import { useEffect, useRef } from 'react';
import type { GameInstance } from '../game/setup';
import { setupGame } from '../game/setup';

interface GameCanvasProps {
  onGameReady?: (instance: GameInstance) => void;
}

export function GameCanvas({ onGameReady }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = setupGame(containerRef.current);

    if (onGameReady) {
      onGameReady(instance);
    }

    return () => {
      instance.cleanup();
    };
  }, [onGameReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      tabIndex={0}
      style={{ outline: 'none' }}
    />
  );
}
