import { useSelector } from '@tanstack/react-store';
import { gameStore } from '../../store/game-store';

export function ScoreDisplay() {
  const score = useSelector(gameStore, (state) => state.score);

  return (
    <div className="absolute top-4 left-4 text-xl font-bold">
      Score: {score}
    </div>
  );
}
