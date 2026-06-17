import { ButtonDesktop } from '@tui-react/button';
import { Surface } from '@tui-react/surface';
import { gameActions } from '../../store/game-store';

export function PauseMenu() {
  const handleResume = () => {
    gameActions.resumeGame();
  };

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
        <h2 className="text-3xl font-bold mb-6">Paused</h2>
        <div className="flex gap-4 justify-center">
          <ButtonDesktop size="l" appearance="accent" onClick={handleResume}>
            Resume
          </ButtonDesktop>
          <ButtonDesktop size="l" appearance="flat" onClick={handleRestart}>
            Restart
          </ButtonDesktop>
        </div>
      </Surface>
    </div>
  );
}
