import { useSelector } from '@tanstack/react-store';
import { gameStore } from '../../store/game-store';

export function LivesDisplay() {
  const lives = useSelector(gameStore, (state) => state.lives);

  return (
    <div className="absolute top-4 right-4 text-xl font-bold">
      Lives: {lives}
    </div>
  );
}
