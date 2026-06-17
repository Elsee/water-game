import { useSelector } from '@tanstack/react-store';
import { ButtonDesktop } from '@tui-react/button';
import { Surface } from '@tui-react/surface';
import { gameStore, gameActions } from '../../store/game-store';

export function GameOverScreen() {
  const { message, score, highScore } = useSelector(gameStore, (state) => ({
    message: state.message,
    score: state.score,
    highScore: state.highScore,
  }));

  const handleRestart = () => {
    gameActions.startGame();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Surface
        padding="l"
        radius="l"
        shadow="popup"
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">{message}</h2>
        <p className="text-xl mb-2">Score: {score}</p>
        <p className="text-base mb-6">High Score: {highScore}</p>
        <ButtonDesktop size="l" appearance="accent" onClick={handleRestart}>
          Play Again
        </ButtonDesktop>
      </Surface>
    </div>
  );
}
